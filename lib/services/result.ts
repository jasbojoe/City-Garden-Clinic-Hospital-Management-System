import 'server-only'

export type DataMode = 'demo' | 'supabase'

export type ServiceError = {
  code: 'VALIDATION_ERROR' | 'BACKEND_NOT_READY' | 'DEMO_READ_ONLY' | 'SERVICE_ERROR'
  message: string
}

export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: ServiceError }

export function dataMode(): DataMode {
  const configuredMode = process.env.HMS_DATA_MODE
  const deploymentEnvironment = process.env.VERCEL_ENV
  let mode = configuredMode

  if (mode === undefined) {
    const isNonProductionEnvironment =
      deploymentEnvironment === 'preview' ||
      deploymentEnvironment === 'development' ||
      (deploymentEnvironment === undefined && process.env.NODE_ENV !== 'production')

    if (isNonProductionEnvironment) mode = 'demo'
  }

  if (mode !== 'demo' && mode !== 'supabase') {
    throw new Error('HMS_DATA_MODE must be explicitly set to "demo" or "supabase".')
  }

  if (deploymentEnvironment === 'production' && mode !== 'supabase') {
    throw new Error('HMS_DATA_MODE must be "supabase" in the Vercel Production environment.')
  }

  if (
    (deploymentEnvironment === 'preview' || deploymentEnvironment === 'development') &&
    mode !== 'demo'
  ) {
    throw new Error(`HMS_DATA_MODE must be "demo" in the Vercel ${deploymentEnvironment} environment.`)
  }

  return mode
}

export function backendNotReady(entity: string) {
  return {
    data: null,
    error: {
      code: 'BACKEND_NOT_READY' as const,
      message: `${entity} services are unavailable in live mode until they are implemented and verified.`,
    },
  }
}
