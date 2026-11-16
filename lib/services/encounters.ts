import { auditEvents, encounters } from '@/lib/hms-service'
import { backendNotReady, dataMode, type ServiceResult } from '@/lib/services/result'
import type { AuditEvent, Encounter } from '@/lib/hms-domain'

export async function getEncounters(): Promise<ServiceResult<Encounter[]>> {
  if (dataMode() === 'supabase') return backendNotReady('encounter')
  return { data: encounters, error: null }
}

export async function getEncounterById(id: string): Promise<ServiceResult<Encounter | null>> {
  if (dataMode() === 'supabase') return backendNotReady('encounter')
  return { data: encounters.find((encounter) => encounter.id === id) ?? null, error: null }
}

export async function getAuditEventsForEntity(entityId: string): Promise<ServiceResult<AuditEvent[]>> {
  if (dataMode() === 'supabase') return backendNotReady('audit')
  return {
    data: auditEvents.filter((event) => event.entityId === entityId),
    error: null,
  }
}
