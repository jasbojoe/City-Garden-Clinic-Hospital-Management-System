'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { dataMode } from '@/lib/services/result'
import { createPatient, getPatients, type PatientSearch } from '@/lib/services/patients'
import type { Patient } from '@/lib/data'
import { PatientInsertSchema } from '@/lib/validators'

const RegistrationSchema = PatientInsertSchema.extend({
  requestId: z.string().uuid(),
  allergies: z.array(z.string().trim().min(1).max(160)).max(30),
  emergencyContactName: z.string().trim().max(160).optional(),
  emergencyContactPhone: z.string().trim().max(40).optional(),
}).refine(
  (values) => Boolean(values.emergencyContactName) === Boolean(values.emergencyContactPhone),
  { message: 'Provide both emergency contact name and phone, or leave both blank.' },
)

export type PatientRegistrationResult =
  | { ok: true; patientId: string; mrn: string; possibleDuplicate: boolean }
  | { ok: false; message: string }

export async function searchPatientsAction(input: PatientSearch): Promise<{ data: Patient[] | null; error: string | null }> {
  const parsed = z.object({
    query: z.string().trim().max(100).optional(),
    status: z.enum(['active', 'admitted', 'discharged', 'inactive']).optional(),
  }).safeParse(input)
  if (!parsed.success) return { data: null, error: 'Search filters are invalid.' }

  const result = await getPatients(parsed.data)
  return result.error
    ? { data: null, error: result.error.message }
    : { data: result.data, error: null }
}

export async function registerPatientAction(
  input: unknown,
): Promise<PatientRegistrationResult> {
  if (dataMode() !== 'supabase') {
    return { ok: false, message: 'Patient registration is unavailable in read-only demo mode.' }
  }

  const parsed = RegistrationSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Patient information is invalid.' }
  }

  const values = parsed.data
  const supabase = await createClient()
  const { data: duplicates, error: duplicateError } = await supabase
    .from('patients')
    .select('id')
    .eq('facility_id', values.facilityId)
    .ilike('first_name', values.firstName.trim())
    .ilike('last_name', values.lastName.trim())
    .limit(1)

  if (duplicateError) {
    return { ok: false, message: duplicateError.message }
  }

  const created = await createPatient(values)
  if (created.error) return { ok: false, message: created.error.message }

  revalidatePath('/patients')
  revalidatePath(`/patients/${created.data.id}`)
  return {
    ok: true,
    patientId: created.data.id,
    mrn: created.data.mrn,
    possibleDuplicate: Boolean(duplicates?.length),
  }
}
