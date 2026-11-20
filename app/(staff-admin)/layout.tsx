import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/hms/app-sidebar'
import { Topbar } from '@/components/hms/topbar'
import { dataMode } from '@/lib/services/result'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StaffAdminLayout({ children }: { children: ReactNode }) {
  let profile: { name: string; role: string } | undefined

  if (dataMode() === 'supabase') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')

    const { data: staff, error } = await supabase
      .from('staff_profiles')
      .select('id,status,first_name,middle_name,last_name,staff_roles(roles(name))')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !staff || staff.status !== 'active') {
      await supabase.auth.signOut()
      redirect('/?access=denied')
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
      redirect('/?access=denied')
    }

    profile = {
      name: [staff.first_name, staff.middle_name, staff.last_name].filter(Boolean).join(' ') || 'Staff member',
      role: roleNames.join(', ') || 'Staff member',
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <SidebarInset>
        <Topbar profile={profile} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
