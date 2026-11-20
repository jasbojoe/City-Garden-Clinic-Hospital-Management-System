"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck, Stethoscope, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(signInError.message.toLowerCase().includes("confirm")
          ? "Check your email and confirm your account before signing in."
          : "Unable to sign in with those credentials.")
        return
      }

      router.replace("/dashboard")
      router.refresh()
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col lg:flex-row">
      <section className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex lg:w-[45%] xl:w-1/2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-11 items-center justify-center overflow-hidden rounded-lg bg-primary-foreground">
            <Image src="/images/city-garden-clinic-logo.png" alt="City Garden Clinic logo" width={44} height={44} className="size-11 object-contain" priority />
          </span>
          <span className="text-lg font-semibold">City Garden Clinic</span>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="max-w-md text-3xl font-semibold leading-tight text-balance xl:text-4xl">Compassionate care, powered by connected data.</h1>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">Manage patients, appointments, laboratory, pharmacy, and billing from one unified clinical workspace built for modern hospitals.</p>
          <div className="flex flex-col gap-3 pt-2">
            <Feature icon={Users} text="Patient records in one secure workspace" />
            <Feature icon={Stethoscope} text="A connected care-team workflow" />
            <Feature icon={ShieldCheck} text="Invitation-only access with role-based controls" />
          </div>
        </div>
        <p className="text-xs text-primary-foreground/70">&copy; 2026 City Garden Clinic Hospital. All rights reserved.</p>
      </section>

      <section className="flex flex-1 items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-card">
              <Image src="/images/city-garden-clinic-logo.png" alt="City Garden Clinic logo" width={40} height={40} className="size-10 object-contain" priority />
            </span>
            <span className="text-lg font-semibold text-foreground">City Garden Clinic</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in with your invited staff account.</p>
          </div>

          <form className="mt-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input id="email" type="email" autoComplete="username" placeholder="name@citygardenclinic.health" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
                </div>
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </Field>
              {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
                <ArrowRight data-icon="inline-end" />
              </Button>
              <p className="text-center text-xs text-muted-foreground">Access is available to authorized, active staff only. Contact your administrator for an invitation.</p>
            </FieldGroup>
          </form>
        </div>
      </section>
    </main>
  )
}

function Feature({ icon: Icon, text }: { icon: typeof Users; text: string }) {
  return <div className="flex items-center gap-3 text-sm text-primary-foreground/90"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15"><Icon className="size-4" /></span>{text}</div>
}
