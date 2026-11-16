import { patients, type Patient } from '@/lib/data'
import { PatientInsertSchema, type PatientInsert } from '@/lib/validators'
import { backendNotReady, dataMode, type ServiceResult } from '@/lib/services/result'

export type { ServiceResult } from '@/lib/services/result'

export type PatientSearch = {
  query?: string
  status?: Patient['status'] | 'all'
}

export async function getPatients(
  filters: PatientSearch = {},
): Promise<ServiceResult<Patient[]>> {
  if (dataMode() === 'supabase') return backendNotReady('patient')

  const query = filters.query?.trim().toLocaleLowerCase()
  const result = patients.filter((patient) => {
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
  if (dataMode() === 'supabase') return backendNotReady('patient')

  return { data: patients.find((patient) => patient.id === id) ?? null, error: null }
}

export async function createPatient(
  input: unknown,
): Promise<ServiceResult<never>> {
  const parsed = PatientInsertSchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Patient information is invalid.' },
    }
  }

  const isDemoMode = dataMode() === 'demo'
  return {
    data: null,
    error: {
      code: isDemoMode ? 'DEMO_READ_ONLY' : 'BACKEND_NOT_READY',
      message: isDemoMode
        ? 'Demo mode is read-only; no patient record was created.'
        : 'Patient registration is unavailable until the protected Supabase schema is installed.',
    },
  }
}

export type { PatientInsert }
