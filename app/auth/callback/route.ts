import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getApplicationOrigin } from "@/lib/supabase/config"

export async function GET(request: NextRequest) {
  const origin = getApplicationOrigin()
  const { searchParams } = request.nextUrl
  const requestedNext = searchParams.get("next")
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/dashboard"
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const errorCode = searchParams.get("error_code")
  const errorDescription = searchParams.get("error_description")

  if (errorCode || errorDescription) {
    const errorUrl = new URL("/auth/error", origin)
    errorUrl.searchParams.set("reason", errorCode || "link_invalid")
    return NextResponse.redirect(errorUrl)
  }

  // Defer token-hash verification until an explicit user action so link scanners
  // cannot consume a one-time invitation or recovery token by prefetching it.
  if (tokenHash && ["invite", "recovery", "email"].includes(type || "")) {
    const verifyUrl = new URL("/auth/verify", origin)
    verifyUrl.searchParams.set("token_hash", tokenHash)
    verifyUrl.searchParams.set("type", type!)
    verifyUrl.searchParams.set("next", next)
    return NextResponse.redirect(verifyUrl)
  }

  const code = searchParams.get("code")
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, origin))
  }

  const errorUrl = new URL("/auth/error", origin)
  errorUrl.searchParams.set("reason", "link_expired_or_used")
  return NextResponse.redirect(errorUrl)
}
