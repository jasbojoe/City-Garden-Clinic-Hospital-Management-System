"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    setError("")
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const callbackUrl = new URL(
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
      )
      callbackUrl.searchParams.set("next", "/auth/reset-password")
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: callbackUrl.toString(),
      })
      if (resetError) throw resetError
      setMessage("If an account is eligible, password reset instructions will be sent to that address.")
    } catch {
      setError("Password recovery is temporarily unavailable. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="flex min-h-svh items-center justify-center bg-background p-6"><section className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm"><h1 className="text-2xl font-semibold">Reset your password</h1><p className="mt-2 text-sm text-muted-foreground">Enter your staff email address and we&apos;ll send recovery instructions if the account is eligible.</p><form onSubmit={handleSubmit} className="mt-6"><FieldGroup><Field><FieldLabel htmlFor="email">Email address</FieldLabel><Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></Field>{message ? <p role="status" className="text-sm text-foreground">{message}</p> : null}{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}<Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send recovery instructions"}</Button><Link href="/" className="text-center text-sm text-primary hover:underline">Back to sign in</Link></FieldGroup></form></section></main>
}
