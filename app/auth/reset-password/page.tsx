"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")
    if (password !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setMessage("Your password has been updated. You can now sign in.")
      window.setTimeout(() => router.replace("/"), 1200)
    } catch {
      setError("The reset link may have expired. Request a new password reset and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="flex min-h-svh items-center justify-center bg-background p-6"><section className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm"><h1 className="text-2xl font-semibold">Choose a new password</h1><p className="mt-2 text-sm text-muted-foreground">Use at least 8 characters for your staff account.</p><form onSubmit={handleSubmit} className="mt-6"><FieldGroup><Field><FieldLabel htmlFor="password">New password</FieldLabel><Input id="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></Field><Field><FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel><Input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></Field>{message ? <p role="status" className="text-sm text-foreground">{message}</p> : null}{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}<Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Updating…" : "Update password"}</Button><Link href="/" className="text-center text-sm text-primary hover:underline">Back to sign in</Link></FieldGroup></form></section></main>
}
