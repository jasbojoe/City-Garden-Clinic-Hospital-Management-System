import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/hms/app-sidebar"
import { Topbar } from "@/components/hms/topbar"
import { dataMode } from "@/lib/services/result"

export const dynamic = "force-dynamic"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  if (dataMode() === "supabase") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <section role="alert" className="max-w-xl rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h1 className="text-lg font-semibold">Backend mode is not ready</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Demo records are disabled. Supabase schema, Row Level Security, staff authentication, and server authorization must be installed and verified before this system can access real records.
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
