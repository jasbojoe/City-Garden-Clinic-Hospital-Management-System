"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function VerifyAuthLinkPage() {
  return <Suspense fallback={<main className="flex min-h-svh items-center justify-center">Loading secure link…</main>}><VerifyAuthLinkContent /></Suspense>
}

function VerifyAuthLinkContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tokenHash = params.get("token_hash")
  const type = params.get("type")
  const next = params.get("next")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function verify() {
    if (!tokenHash || !["invite", "recovery", "email"].includes(type || "")) {
      router.replace("/auth/error?reason=link_invalid")
      return
    }
    setSubmitting(true)
    const { error: verifyError } = await createClient().auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "invite" | "recovery" | "email",
    })
    if (verifyError) {
      setError("This link has expired, was already used, or is invalid. Request a fresh invitation or password reset.")
      setSubmitting(false)
      return
    }
    router.replace(next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard")
    router.refresh()
  }

  return <main className="flex min-h-svh items-center justify-center bg-background p-6"><section className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm"><h1 className="text-2xl font-semibold">Confirm your secure link</h1><p className="mt-2 text-sm text-muted-foreground">Continue to verify your invitation or password recovery link. This confirmation prevents email security scanners from using the one-time link before you.</p>{error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}<Button className="mt-6 w-full" onClick={verify} disabled={submitting}>{submitting ? "Verifying…" : "Continue securely"}</Button><Link href="/auth/forgot-password" className="mt-4 block text-center text-sm text-primary hover:underline">Request a new password reset</Link></section></main>
}
