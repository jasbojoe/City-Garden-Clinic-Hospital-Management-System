'use server'

import { z } from 'zod'
import { dataMode } from '@/lib/services/result'
import { getPatients, type PatientSearch } from '@/lib/services/patients'
import type { Patient } from '@/lib/data'

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
  _input: unknown,
): Promise<PatientRegistrationResult> {
  if (dataMode() === 'supabase') {
    return { ok: false, message: 'Patient registration is disabled in live mode until its authorization and audit workflows are verified.' }
  }

  return { ok: false, message: 'Patient registration is unavailable in read-only demo mode.' }
}
