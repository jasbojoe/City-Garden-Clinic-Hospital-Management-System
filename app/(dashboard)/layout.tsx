import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/hms/app-sidebar"
import { Topbar } from "@/components/hms/topbar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { dataMode } from "@/lib/services/result"
import { createClient } from "@/lib/supabase/server"

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
      .select("id,status,first_name,middle_name,last_name,staff_roles(roles(name))")
      .eq("id", user.id)
      .maybeSingle()

    if (error || !staff || staff.status !== "active") {
      await supabase.auth.signOut()
      redirect("/?access=denied")
    }

    const roleAssignments = (staff.staff_roles ?? []) as Array<{
      roles: { name: string } | { name: string }[] | null
    }>
    const roleNames = roleAssignments.flatMap((assignment) => {
      const role = Array.isArray(assignment.roles) ? assignment.roles[0] : assignment.roles
      return role ? [role.name] : []
    })

    if (roleNames.length === 0) {
      await supabase.auth.signOut()
      redirect("/?access=denied")
    }

    const profile = {
      name: [staff.first_name, staff.middle_name, staff.last_name].filter(Boolean).join(" ") || "Staff member",
      role: roleNames.join(", "),
    }

    return (
      <SidebarProvider>
        <AppSidebar profile={profile} />
        <SidebarInset>
          <Topbar profile={profile} />
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <Alert role="status" className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6 text-card-foreground md:p-8">
              <div>
                <AlertTitle className="text-xl">Clinical modules are unavailable in live mode</AlertTitle>
                <AlertDescription className="mt-2 leading-6">
                  Patient, appointment, consultation, laboratory, pharmacy, billing, admissions, migration, and reporting workflows remain disabled until their live services and permissions are implemented and verified. Demo records are never shown in the authenticated workspace.
                </AlertDescription>
              </div>
              <div>
                <Button variant="outline" render={<Link href="/staff" />}>
                  Open staff management
                </Button>
              </div>
            </Alert>
          </main>
        </SidebarInset>
      </SidebarProvider>
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
