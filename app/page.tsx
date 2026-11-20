import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import LoginPage from "@/components/hms/login-page"
import { dataMode } from "@/lib/services/result"

export const dynamic = "force-dynamic"

export default function HomePage() {
  if (dataMode() === "supabase") return <LoginPage />

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <section aria-labelledby="demo-heading" className="w-full max-w-lg rounded-2xl border bg-card p-8 text-card-foreground shadow-sm sm:p-10">
        <Badge variant="secondary">Demo Mode</Badge>
        <h1 id="demo-heading" className="mt-6 text-3xl font-semibold tracking-tight">City Garden Clinic</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Explore the hospital management workspace with sample data. This environment does not connect to live clinical records or staff-management mutations.
        </p>
        <Button className="mt-7 w-full" size="lg" render={<Link href="/dashboard" />}>
          Open demo workspace
          <ArrowRight data-icon="inline-end" />
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo records are sample-only and read-only.
        </p>
      </section>
    </main>
  )
}
