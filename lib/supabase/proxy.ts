import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { dataMode } from '@/lib/services/result'
import { getSupabasePublicConfig, isSupabaseConfigured } from '@/lib/supabase/config'

export async function updateSession(request: NextRequest) {
  if (dataMode() === 'demo') {
    const pathname = request.nextUrl.pathname
    if (pathname.startsWith('/auth/') && pathname !== '/auth/error') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next({ request })
  }

  if (!isSupabaseConfigured()) return NextResponse.next({ request })
  const { url, key } = getSupabasePublicConfig()
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    url,
    key,
    {
      cookieOptions: { secure: process.env.NODE_ENV === 'production' },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    request.nextUrl.pathname.startsWith('/protected') &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
