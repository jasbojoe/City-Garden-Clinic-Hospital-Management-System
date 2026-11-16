export type ServiceError = {
  code: 'VALIDATION_ERROR' | 'BACKEND_NOT_READY' | 'DEMO_READ_ONLY'
  message: string
}

export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: ServiceError }

export function dataMode() {
  const configuredMode = process.env.HMS_DATA_MODE
  return configuredMode === undefined || configuredMode === 'demo' ? 'demo' : 'supabase'
}

export function backendNotReady(entity: string) {
  return {
    data: null,
    error: {
      code: 'BACKEND_NOT_READY' as const,
      message: `Supabase ${entity} tables and RLS policies are not installed yet.`,
    },
  }
}
