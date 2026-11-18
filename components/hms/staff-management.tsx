'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2Icon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UsersRoundIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/hms/workflow-states'
import { PageHeader } from '@/components/hms/page-header'
import { StatusBadge } from '@/components/hms/status-badge'
import {
  createStaffDepartmentAction,
  getStaffManagementDataAction,
  inviteStaffAction,
  resendStaffInvitationAction,
  updateStaffAction,
  type StaffActionResult,
} from '@/app/(staff-admin)/staff/actions'
import {
  StaffDepartmentDialog,
  StaffDetailsDialog,
  StaffEditorDialog,
  StaffStatusConfirmation,
  type StaffFormValues,
  type StaffSubmitResult,
} from '@/components/hms/staff-management-dialogs'
import type { StaffDirectoryMember, StaffManagementData, StaffStatus } from '@/lib/services/staff'

const ALL = 'all'

export function StaffManagement({ initialData }: { initialData: StaffManagementData }) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState(ALL)
  const [roleFilter, setRoleFilter] = useState(ALL)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorStaffId, setEditorStaffId] = useState<string | null>(null)
  const [departmentOpen, setDepartmentOpen] = useState(false)
  const [departmentFacilityId, setDepartmentFacilityId] = useState<string | null>(null)
  const [statusConfirmation, setStatusConfirmation] = useState<{ staffId: string; status: StaffStatus; facilityId: string } | null>(null)
  const [statusBusy, setStatusBusy] = useState(false)

  const activeFacility = data.facilities.find((facility) => facility.id === data.selectedFacilityId) ?? null
  const selectedStaff = data.staff.find((member) => member.id === selectedStaffId) ?? null
  const editorStaff = editorStaffId ? data.staff.find((member) => member.id === editorStaffId) ?? null : null
  const departmentFacility = data.facilities.find((facility) => facility.id === departmentFacilityId) ?? null
  const inviteFacilities = data.facilities.filter((facility) => facility.canInviteStaff)
  const editableFacilities = data.facilities.filter((facility) => facility.canUpdateStaff)

  const roleFilters = useMemo(() => {
    const options = new Map<string, string>()
    for (const member of data.staff) {
      for (const assignment of member.roleAssignments) options.set(assignment.code, assignment.name)
    }
    return [...options].map(([code, name]) => ({ code, name })).sort((left, right) => left.name.localeCompare(right.name))
  }, [data.staff])

  const filteredStaff = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return data.staff.filter((member) => {
      const searchable = [
        member.fullName,
        member.employeeNumber,
        member.email,
        member.phone ?? '',
        member.jobTitle ?? '',
        member.departmentName ?? '',
        ...member.roleAssignments.map((assignment) => assignment.name),
      ].join(' ').toLocaleLowerCase()
      return (
        (statusFilter === ALL || member.status === statusFilter) &&
        (departmentFilter === ALL || member.departmentId === departmentFilter) &&
        (roleFilter === ALL || member.roleAssignments.some((assignment) => assignment.code === roleFilter)) &&
        (!search || searchable.includes(search))
      )
    })
  }, [data.staff, query, statusFilter, departmentFilter, roleFilter])

  async function reloadData(facilityId = data.selectedFacilityId) {
    const result = await getStaffManagementDataAction(facilityId)
    if (result.error || !result.data) {
      toast.error(result.error ?? 'Staff records could not be refreshed.')
      return false
    }
    setData(result.data)
    router.refresh()
    return true
  }

  async function changeFacility(facilityId: string) {
    const result = await getStaffManagementDataAction(facilityId)
    if (result.error || !result.data) {
      toast.error(result.error ?? 'Staff records could not be loaded.')
      return
    }
    setData(result.data)
    setDepartmentFilter(ALL)
    setRoleFilter(ALL)
  }

  function openInvite() {
    setEditorStaffId(null)
    setEditorOpen(true)
  }

  function openEdit(member: StaffDirectoryMember) {
    setDetailsOpen(false)
    setEditorStaffId(member.id)
    setEditorOpen(true)
  }

  function openDepartmentDialog(facilityId: string) {
    setEditorOpen(false)
    setDepartmentFacilityId(facilityId)
    setDepartmentOpen(true)
  }

  async function saveStaff(values: StaffFormValues): Promise<StaffSubmitResult> {
    let result: StaffActionResult
    if (editorStaff) {
      result = await updateStaffAction({
        staffId: editorStaff.id,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        phone: values.phone,
        jobTitle: values.jobTitle,
        facilityId: values.facilityId,
        departmentId: values.departmentId || null,
        roleCodes: values.roleCodes,
        status: values.status,
      })
    } else {
      result = await inviteStaffAction({
        email: values.email,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        phone: values.phone,
        jobTitle: values.jobTitle,
        facilityId: values.facilityId,
        departmentId: values.departmentId || null,
        roleCodes: values.roleCodes,
      })
    }

    if (result.ok) {
      toast.success(result.message)
      await reloadData(values.facilityId)
    }
    return result
  }

  async function saveDepartment(values: { facilityId: string; code: string; name: string }): Promise<StaffSubmitResult> {
    const result = await createStaffDepartmentAction(values)
    if (result.ok) {
      toast.success(result.message)
      await reloadData()
    }
    return result
  }

  async function resendInvitation() {
    if (!selectedStaff || !activeFacility) return
    const result = await resendStaffInvitationAction({ staffId: selectedStaff.id, facilityId: activeFacility.id })
    if (result.ok) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  function requestStatusChange(member: StaffDirectoryMember, status: StaffStatus) {
    const primaryAssignment = member.facilities.find((assignment) => assignment.isPrimary)
    const primaryFacility = primaryAssignment && data.facilities.find((facility) => facility.id === primaryAssignment.facilityId)
    const primaryRoles = member.roleAssignments
      .filter((assignment) => assignment.facilityId === primaryAssignment?.facilityId)
      .map((assignment) => assignment.code)
    const department = data.departments.find((option) => option.id === member.departmentId)

    if (!primaryAssignment || !primaryFacility?.canUpdateStaff || !primaryRoles.length) {
      toast.error('Access status can only be changed from a manageable primary facility with a visible role assignment.')
      return
    }
    if (member.departmentId && department?.facilityId !== primaryAssignment.facilityId) {
      toast.error('The current department assignment must be visible before changing access status.')
      return
    }

    setStatusConfirmation({ staffId: member.id, status, facilityId: primaryAssignment.facilityId })
  }

  async function confirmStatusChange() {
    if (!statusConfirmation) return
    const member = data.staff.find((entry) => entry.id === statusConfirmation.staffId)
    const facility = data.facilities.find((entry) => entry.id === statusConfirmation.facilityId)
    if (!member || !facility) return

    const roleCodes = member.roleAssignments
      .filter((assignment) => assignment.facilityId === facility.id)
      .map((assignment) => assignment.code)
    const department = data.departments.find((option) => option.id === member.departmentId)
    setStatusBusy(true)
    const result = await updateStaffAction({
      staffId: member.id,
      firstName: member.firstName,
      middleName: member.middleName ?? '',
      lastName: member.lastName,
      phone: member.phone ?? '',
      jobTitle: member.jobTitle ?? '',
      departmentId: department?.facilityId === facility.id ? member.departmentId : null,
      facilityId: facility.id,
      roleCodes,
      status: statusConfirmation.status,
    })
    setStatusBusy(false)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    setStatusConfirmation(null)
    await reloadData()
  }

  const staffCount = data.staff.length
  const activeCount = data.staff.filter((member) => member.status === 'active').length
  const suspendedCount = data.staff.filter((member) => member.status === 'suspended').length
  const inactiveCount = data.staff.filter((member) => member.status === 'inactive').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff Directory"
        description="Manage clinical and administrative personnel with facility-scoped access."
        breadcrumbs={[{ label: 'Staff' }]}
        actions={
          <>
            {activeFacility?.canManageDepartments ? (
              <Button variant="outline" onClick={() => openDepartmentDialog(activeFacility.id)}>
                <PlusIcon data-icon="inline-start" />
                Add department
              </Button>
            ) : null}
            {inviteFacilities.length ? (
              <Button onClick={openInvite}>
                <UserPlusIcon data-icon="inline-start" />
                Invite staff
              </Button>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><UsersRoundIcon className="size-5" /></div>
            <div><p className="text-2xl font-semibold">{staffCount}</p><p className="text-sm text-muted-foreground">Staff in facility</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><ShieldCheckIcon className="size-5" /></div>
            <div><p className="text-2xl font-semibold">{activeCount}</p><p className="text-sm text-muted-foreground">Active</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><UsersRoundIcon className="size-5" /></div>
            <div><p className="text-2xl font-semibold">{suspendedCount}</p><p className="text-sm text-muted-foreground">Suspended</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"><UsersRoundIcon className="size-5" /></div>
            <div><p className="text-2xl font-semibold">{inactiveCount}</p><p className="text-sm text-muted-foreground">Inactive</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Personnel</CardTitle>
            <CardDescription>{filteredStaff.length} of {staffCount} staff members</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            {data.facilities.length > 1 ? (
              <Select value={data.selectedFacilityId} onValueChange={(value) => value && void changeFacility(value)}>
                <SelectTrigger aria-label="Facility" className="w-full sm:w-52"><Building2Icon /><SelectValue placeholder="Facility" /></SelectTrigger>
                <SelectContent><SelectGroup>{data.facilities.map((facility) => <SelectItem key={facility.id} value={facility.id}>{facility.name}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
            ) : activeFacility ? (
              <Badge variant="outline" className="h-8 gap-2 px-3"><Building2Icon data-icon="inline-start" />{activeFacility.name}</Badge>
            ) : null}
            <InputGroup className="sm:w-56">
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupInput aria-label="Search staff directory" placeholder="Search staff…" value={query} onChange={(event) => setQuery(event.target.value)} />
            </InputGroup>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={departmentFilter} onValueChange={(value) => value && setDepartmentFilter(value)}>
                <SelectTrigger aria-label="Filter by department" className="w-full sm:w-48"><SelectValue placeholder="All departments" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={ALL}>All departments</SelectItem>
                    {data.departments.filter((department) => department.facilityId === data.selectedFacilityId).map((department) => (
                      <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(value) => value && setRoleFilter(value)}>
                <SelectTrigger aria-label="Filter by role" className="w-full sm:w-48"><SelectValue placeholder="All roles" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={ALL}>All roles</SelectItem>
                    {roleFilters.map((role) => <SelectItem key={role.code} value={role.code}>{role.name}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredStaff.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStaff.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => { setSelectedStaffId(member.id); setDetailsOpen(true) }}
                  className="flex w-full flex-col gap-4 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View ${member.fullName} staff profile`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-11">
                      <AvatarFallback>{member.fullName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{member.fullName}</p>
                      <p className="truncate text-sm text-muted-foreground">{member.jobTitle || member.roleAssignments.map((assignment) => assignment.name).join(', ') || 'Staff member'}</p>
                      <p className="truncate text-xs text-muted-foreground">{member.employeeNumber}</p>
                    </div>
                    <StatusBadge status={member.status} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.roleAssignments.slice(0, 2).map((assignment, index) => (
                      <Badge key={`${assignment.code}-${assignment.facilityId ?? 'global'}-${index}`} variant="secondary">{assignment.name}</Badge>
                    ))}
                    {member.roleAssignments.length > 2 ? <Badge variant="outline">+{member.roleAssignments.length - 2}</Badge> : null}
                  </div>
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-2"><Building2Icon className="size-3.5 shrink-0" /><span className="truncate">{member.departmentName || 'No department'} · {member.facilities.find((facility) => facility.isPrimary)?.facilityName || 'Facility assignment'}</span></span>
                    {member.email ? <span className="flex min-w-0 items-center gap-2"><MailIcon className="size-3.5 shrink-0" /><span className="truncate">{member.email}</span></span> : null}
                    {member.phone ? <span className="flex min-w-0 items-center gap-2"><PhoneIcon className="size-3.5 shrink-0" /><span className="truncate">{member.phone}</span></span> : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title={data.staff.length ? 'No matching staff' : 'No staff in this facility'}
              description={data.staff.length ? 'Try a different search or filter.' : 'Staff profiles assigned to this facility will appear here.'}
            />
          )}
        </CardContent>
      </Card>

      <StaffDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        member={selectedStaff}
        operationFacilityId={data.selectedFacilityId}
        currentUserId={data.currentUserId}
        canUpdate={Boolean(activeFacility?.canUpdateStaff && selectedStaff?.facilities.some((assignment) => assignment.isPrimary && data.facilities.some((facility) => facility.id === assignment.facilityId && facility.canUpdateStaff)))}
        canInvite={Boolean(activeFacility?.canInviteStaff)}
        onEdit={() => selectedStaff && openEdit(selectedStaff)}
        onResend={() => void resendInvitation()}
        onStatusChange={(status) => selectedStaff && requestStatusChange(selectedStaff, status)}
      />

      <StaffEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        member={editorStaff}
        defaultFacilityId={data.selectedFacilityId}
        facilities={editorStaff ? editableFacilities : inviteFacilities}
        departments={data.departments}
        roles={data.roles}
        onSave={saveStaff}
        onCreateDepartment={openDepartmentDialog}
      />

      <StaffDepartmentDialog
        open={departmentOpen}
        onOpenChange={setDepartmentOpen}
        facility={departmentFacility}
        onSave={saveDepartment}
      />

      <StaffStatusConfirmation
        open={Boolean(statusConfirmation)}
        onOpenChange={(open) => { if (!open) setStatusConfirmation(null) }}
        status={statusConfirmation?.status ?? 'suspended'}
        memberName={data.staff.find((member) => member.id === statusConfirmation?.staffId)?.fullName ?? 'this staff member'}
        busy={statusBusy}
        onConfirm={() => void confirmStatusChange()}
      />
    </div>
  )
}
