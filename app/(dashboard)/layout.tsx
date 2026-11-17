import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/hms/app-sidebar"
import { Topbar } from "@/components/hms/topbar"
import { dataMode } from "@/lib/services/result"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  if (dataMode() === "supabase") {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/")

    const { data: staff, error } = await supabase
      .from("staff_profiles")
      .select("id, status")
      .eq("id", user.id)
      .maybeSingle()

    if (error || !staff || staff.status !== "active") {
      await supabase.auth.signOut()
      redirect("/?access=denied")
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <section role="status" className="max-w-xl rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h1 className="text-lg font-semibold">Secure access confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your staff account is active. The clinical workspace remains unavailable until each module is connected to authorized database-backed services; demo records are intentionally not shown in backend mode.
          </p>
        </section>
      </main>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
