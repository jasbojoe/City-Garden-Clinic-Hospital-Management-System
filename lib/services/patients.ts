import { patients as demoPatients, type Patient, type PatientStatus } from '@/lib/data'
import { z } from 'zod'
import { PatientInsertSchema, type PatientInsert } from '@/lib/validators'
import { createClient } from '@/lib/supabase/server'
import { dataMode, type ServiceResult } from '@/lib/services/result'

export type { ServiceResult } from '@/lib/services/result'

export type PatientSearch = {
  query?: string
  status?: PatientStatus | 'all'
}

type PatientRow = {
  id: string
  mrn: string
  first_name: string
  middle_name: string | null
  last_name: string
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | 'unknown'
  phone_primary: string | null
  email: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  region: string | null
  status: 'active' | 'inactive' | 'deceased'
}

export type RegistrationFacility = { id: string; name: string }

function fromRow(row: PatientRow): Patient {
  const age = row.date_of_birth
    ? Math.max(0, new Date().getFullYear() - new Date(`${row.date_of_birth}T00:00:00`).getFullYear())
    : 0
  const status: PatientStatus = row.status === 'active' ? 'active' : 'inactive'

  return {
    id: row.id,
    mrn: row.mrn,
    name: [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(' '),
    gender: row.gender === 'male' ? 'Male' : row.gender === 'female' ? 'Female' : 'Other',
    age,
    dob: row.date_of_birth ?? '',
    phone: row.phone_primary ?? '',
    email: row.email ?? '',
    bloodGroup: 'Not recorded',
    status,
    lastVisit: '—',
    department: '—',
    address: [row.address_line_1, row.address_line_2, row.city, row.region].filter(Boolean).join(', '),
    allergies: [],
    insurance: 'Not recorded',
    emergencyContact: 'Not recorded',
  }
}

export async function getPatients(
  filters: PatientSearch = {},
): Promise<ServiceResult<Patient[]>> {
  if (dataMode() !== 'supabase') {
    const query = filters.query?.trim().toLocaleLowerCase()
    const result = demoPatients.filter((patient) => {
      const matchesQuery =
        !query ||
        patient.name.toLocaleLowerCase().includes(query) ||
        patient.mrn.toLocaleLowerCase().includes(query)
      const matchesStatus = !filters.status || filters.status === 'all' || patient.status === filters.status
      return matchesQuery && matchesStatus
    })
    return { data: result, error: null }
  }

  if (filters.status === 'admitted' || filters.status === 'discharged') {
    return { data: [], error: null }
  }

  try {
    const supabase = await createClient()
    let request = supabase
      .from('patients')
      .select('id,mrn,first_name,middle_name,last_name,date_of_birth,gender,phone_primary,email,address_line_1,address_line_2,city,region,status')
      .order('created_at', { ascending: false })
      .limit(250)

    if (filters.query?.trim()) {
      const query = filters.query.trim().replace(/[\\%_(),.*"]/g, ' ').replace(/\s+/g, ' ')
      if (query) request = request.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,mrn.ilike.%${query}%`)
    }
    if (filters.status === 'active') request = request.eq('status', 'active')
    if (filters.status === 'inactive') request = request.in('status', ['inactive', 'deceased'])

    const { data, error } = await request
    if (error) return { data: null, error: { code: 'SERVICE_ERROR', message: error.message } }
    return { data: (data as PatientRow[]).map(fromRow), error: null }
  } catch {
    return { data: null, error: { code: 'SERVICE_ERROR', message: 'Patient records could not be loaded.' } }
  }
}

export async function getPatientById(id: string): Promise<ServiceResult<Patient | null>> {
  if (dataMode() !== 'supabase') {
    return { data: demoPatients.find((patient) => patient.id === id) ?? null, error: null }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('patients')
      .select('id,mrn,first_name,middle_name,last_name,date_of_birth,gender,phone_primary,email,address_line_1,address_line_2,city,region,status')
      .eq('id', id)
      .maybeSingle()
    if (error) return { data: null, error: { code: 'SERVICE_ERROR', message: error.message } }
    return { data: data ? fromRow(data as PatientRow) : null, error: null }
  } catch {
    return { data: null, error: { code: 'SERVICE_ERROR', message: 'Patient record could not be loaded.' } }
  }
}

export async function getRegistrationFacilities(): Promise<ServiceResult<RegistrationFacility[]>> {
  if (dataMode() !== 'supabase') {
    return {
      data: null,
      error: { code: 'DEMO_READ_ONLY', message: 'The live patient registry is not enabled in read-only demo mode.' },
    }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('facilities')
      .select('id,name')
      .eq('is_active', true)
      .order('name')
    if (error) return { data: null, error: { code: 'SERVICE_ERROR', message: error.message } }
    return { data: data ?? [], error: null }
  } catch {
    return { data: null, error: { code: 'SERVICE_ERROR', message: 'Facilities could not be loaded.' } }
  }
}

const PatientRegistrationSchema = PatientInsertSchema.extend({
  requestId: z.string().uuid(),
  allergies: z.array(z.string().trim().min(1).max(160)).max(30),
  emergencyContactName: z.string().trim().max(160).optional(),
  emergencyContactPhone: z.string().trim().max(40).optional(),
}).refine(
  (values) => Boolean(values.emergencyContactName) === Boolean(values.emergencyContactPhone),
  { message: 'Provide both emergency contact name and phone, or leave both blank.' },
)

export async function createPatient(input: unknown): Promise<ServiceResult<{ id: string; mrn: string }>> {
  const parsed = PatientRegistrationSchema.safeParse(input)
  if (!parsed.success) {
    return { data: null, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Patient information is invalid.' } }
  }
  if (dataMode() !== 'supabase') {
    return { data: null, error: { code: 'DEMO_READ_ONLY', message: 'Demo mode is read-only; no patient record was created.' } }
  }

  const values = parsed.data
  try {
    const supabase = await createClient()
    const emergencyContact = values.emergencyContactName && values.emergencyContactPhone
      ? { full_name: values.emergencyContactName, phone: values.emergencyContactPhone }
      : null
    const { data: patientId, error } = await supabase.rpc('register_patient', {
      p_facility_id: values.facilityId,
      p_patient: {
        first_name: values.firstName,
        middle_name: values.middleName ?? null,
        last_name: values.lastName,
        date_of_birth: values.dateOfBirth ?? null,
        date_of_birth_estimated: values.dateOfBirthEstimated,
        gender: values.gender?.toLowerCase() ?? 'unknown',
        phone_primary: values.phonePrimary ?? null,
        phone_secondary: values.phoneSecondary ?? null,
        email: values.email ?? null,
        address_line_1: values.addressLine1 ?? null,
        address_line_2: values.addressLine2 ?? null,
        city: values.city ?? null,
        region: values.region ?? null,
        country: values.country === 'SL' ? 'Sierra Leone' : values.country,
      },
      p_emergency_contact: emergencyContact,
      p_allergies: values.allergies,
      p_request_id: values.requestId,
    })
    if (error) return { data: null, error: { code: 'SERVICE_ERROR', message: error.message } }

    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id,mrn')
      .eq('id', patientId)
      .single()
    if (patientError || !patient) {
      return { data: null, error: { code: 'SERVICE_ERROR', message: patientError?.message ?? 'Patient was saved, but confirmation could not be loaded. Retry safely using the same request.' } }
    }
    return { data: patient, error: null }
  } catch {
    return { data: null, error: { code: 'SERVICE_ERROR', message: 'Patient registration could not be completed.' } }
  }
}

export type { PatientInsert }
