import { PageHeader } from '@/components/hms/page-header'
import { StaffDemo } from '@/components/hms/staff-demo'
import { StaffManagement } from '@/components/hms/staff-management'
import { getStaffManagementData } from '@/lib/services/staff'
import { dataMode } from '@/lib/services/result'

export default async function StaffPage() {
  if (dataMode() !== 'supabase') return <StaffDemo />

  const result = await getStaffManagementData()
  if (result.error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Staff Directory"
          description="Manage authorized clinic personnel."
          breadcrumbs={[{ label: 'Staff' }]}
        />
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {result.error.message}
        </p>
      </div>
    )
  }

  return <StaffManagement initialData={result.data} />
}
