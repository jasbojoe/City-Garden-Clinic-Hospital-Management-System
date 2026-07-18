import Link from "next/link"
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col lg:flex-row">
      {/* Branding panel */}
      <section className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex lg:w-[45%] xl:w-1/2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Activity className="size-6" />
          </span>
          <span className="text-lg font-semibold">City Garden Clinic HMS</span>
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="max-w-md text-3xl font-semibold leading-tight text-balance xl:text-4xl">
            Compassionate care, powered by connected data.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
            Manage patients, appointments, laboratory, pharmacy, and billing
            from one unified clinical workspace built for modern hospitals.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Feature icon={Users} text="12,000+ patient records at your fingertips" />
            <Feature icon={Stethoscope} text="Real-time queue and consultation flow" />
            <Feature icon={ShieldCheck} text="Role-based access and audit-ready records" />
          </div>
        </div>

        <p className="text-xs text-primary-foreground/70">
          &copy; 2026 St. City Garden Clinic Hospital. All rights reserved.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="size-6" />
            </span>
            <span className="text-lg font-semibold text-foreground">
              City Garden Clinic HMS
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your clinical dashboard.
            </p>
          </div>

          <form className="mt-8">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="e.vasquez@City Garden Clinic.health"
                  defaultValue="e.vasquez@City Garden Clinic.health"
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  defaultValue="password"
                />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="remember" defaultChecked />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Keep me signed in on this device
                </Label>
              </Field>
              <Button size="lg" className="w-full" render={<Link href="/dashboard" />}>
                Sign in
                <ArrowRight data-icon="inline-end" />
              </Button>
              <FieldDescription className="text-center">
                This is a visual prototype. Any credentials will sign you in.
              </FieldDescription>
            </FieldGroup>
          </form>
        </div>
      </section>
    </main>
  )
}

function Feature({
  icon: Icon,
  text,
}: {
  icon: typeof Users
  text: string
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-primary-foreground/90">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
        <Icon className="size-4" />
      </span>
      {text}
    </div>
  )
}
