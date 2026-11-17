import { appointments, queue } from '@/lib/data'
import { backendNotReady, dataMode, type ServiceResult } from '@/lib/services/result'
import type { Appointment as DemoAppointment, QueueEntry as DemoQueueEntry } from '@/lib/data'

export async function getAppointments(): Promise<ServiceResult<DemoAppointment[]>> {
  if (dataMode() === 'supabase') return backendNotReady('appointment')
  return { data: appointments, error: null }
}

export async function getQueueEntries(): Promise<ServiceResult<DemoQueueEntry[]>> {
  if (dataMode() === 'supabase') return backendNotReady('queue')
  return { data: queue, error: null }
}
