import { patients as demoPatients, type Patient, type PatientStatus } from '@/lib/data'
import { PatientInsertSchema, type PatientInsert } from '@/lib/validators'
import { backendNotReady, dataMode, type ServiceResult } from '@/lib/services/result'

export type { ServiceResult } from '@/lib/services/result'

export type PatientSearch = {
  query?: string
  status?: PatientStatus | 'all'
}

export type RegistrationFacility = { id: string; name: string }

export async function getPatients(
  filters: PatientSearch = {},
): Promise<ServiceResult<Patient[]>> {
  if (dataMode() === 'supabase') return backendNotReady('Patient registry')

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

export async function getPatientById(id: string): Promise<ServiceResult<Patient | null>> {
  if (dataMode() === 'supabase') return backendNotReady('Patient records')
  return { data: demoPatients.find((patient) => patient.id === id) ?? null, error: null }
}

export async function getRegistrationFacilities(): Promise<ServiceResult<RegistrationFacility[]>> {
  if (dataMode() === 'supabase') return backendNotReady('Patient registration')

  return {
    data: null,
    error: {
      code: 'DEMO_READ_ONLY',
      message: 'The live patient registry is not enabled in read-only demo mode.',
    },
  }
}

export async function createPatient(input: unknown): Promise<ServiceResult<{ id: string; mrn: string }>> {
  const parsed = PatientInsertSchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.issues[0]?.message ?? 'Patient information is invalid.',
      },
    }
  }

  if (dataMode() === 'supabase') return backendNotReady('Patient registration')

  return {
    data: null,
    error: {
      code: 'DEMO_READ_ONLY',
      message: 'Demo mode is read-only; no patient record was created.',
    },
  }
}

export type { PatientInsert }
