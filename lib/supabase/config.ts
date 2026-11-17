const PRODUCTION_APP_ORIGIN = 'https://citygardenclinic-management.vercel.app'

export function getApplicationOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL
  const origin = configuredOrigin || (process.env.NODE_ENV === 'production'
    ? PRODUCTION_APP_ORIGIN
    : 'http://localhost:3000')

  try {
    const parsed = new URL(origin)
    if (parsed.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      throw new Error('Production application URL must use HTTPS.')
    }
    return parsed.origin
  } catch {
    throw new Error('NEXT_PUBLIC_APP_URL must be a valid trusted application origin.')
  }
}

export function getAuthCallbackUrl(next?: string) {
  const callbackUrl = new URL('/auth/callback', getApplicationOrigin())
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    callbackUrl.searchParams.set('next', next)
  }
  return callbackUrl.toString()
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  )
}

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    )
  }

  return { url, key }
}
