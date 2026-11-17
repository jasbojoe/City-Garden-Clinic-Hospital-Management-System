import { staff, type Staff } from '@/lib/data'
import { backendNotReady, dataMode, type ServiceResult } from '@/lib/services/result'

export async function getStaff(): Promise<ServiceResult<Staff[]>> {
  if (dataMode() === 'supabase') return backendNotReady('staff')
  return { data: staff, error: null }
}

export async function getStaffById(id: string): Promise<ServiceResult<Staff | null>> {
  if (dataMode() === 'supabase') return backendNotReady('staff')
  return { data: staff.find((member) => member.id === id) ?? null, error: null }
}
