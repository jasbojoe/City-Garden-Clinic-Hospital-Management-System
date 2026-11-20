'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmationDialog } from '@/components/hms/confirmation-dialog'
import { StatusBadge } from '@/components/hms/status-badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  StaffDepartmentOption,
  StaffDirectoryMember,
  StaffFacilityOption,
  StaffRoleOption,
  StaffStatus,
} from '@/lib/services/staff'

const NO_DEPARTMENT = '__none__'

export type StaffFormValues = {
  email: string
  firstName: string
  middleName: string
  lastName: string
  phone: string
  jobTitle: string
  departmentId: string
  facilityId: string
  roleCodes: string[]
  status: StaffStatus
}

export type StaffSubmitResult = { ok: boolean; message: string }

export function StaffEditorDialog({
  open,
  onOpenChange,
  member,
  defaultFacilityId,
  facilities,
  departments,
  roles,
  onSave,
  onCreateDepartment,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: StaffDirectoryMember | null
  defaultFacilityId: string
  facilities: StaffFacilityOption[]
  departments: StaffDepartmentOption[]
  roles: StaffRoleOption[]
  onSave: (values: StaffFormValues) => Promise<StaffSubmitResult>
  onCreateDepartment: (facilityId: string) => void
}) {
  const [values, setValues] = useState<StaffFormValues>({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    jobTitle: '',
    departmentId: NO_DEPARTMENT,
    facilityId: defaultFacilityId,
    roleCodes: [],
    status: 'active',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    const primaryFacilityId = member?.facilities.find((assignment) => assignment.isPrimary)?.facilityId
    const facilityId = primaryFacilityId && facilities.some((facility) => facility.id === primaryFacilityId)
      ? primaryFacilityId
      : defaultFacilityId
    const matchingDepartment = member?.departmentId && departments.some(
      (department) => department.id === member.departmentId && department.facilityId === facilityId,
    )
      ? member.departmentId
      : NO_DEPARTMENT
    setValues({
      email: member?.email ?? '',
      firstName: member?.firstName ?? '',
      middleName: member?.middleName ?? '',
      lastName: member?.lastName ?? '',
      phone: member?.phone ?? '',
      jobTitle: member?.jobTitle ?? '',
      departmentId: matchingDepartment,
      facilityId,
      roleCodes: member
        ? member.roleAssignments.filter((assignment) => assignment.facilityId === facilityId).map((assignment) => assignment.code)
        : [],
      status: member?.status ?? 'active',
    })
    setError('')
  }, [open, member, defaultFacilityId, facilities, departments])

  const facility = facilities.find((option) => option.id === values.facilityId)
  const canAssignRoles = Boolean(facility?.canAssignRoles)
  const availableDepartments = departments.filter((department) => department.facilityId === values.facilityId)

  function changeFacility(facilityId: string) {
    const matchingDepartment = member?.departmentId && departments.some(
      (department) => department.id === member.departmentId && department.facilityId === facilityId,
    )
      ? member.departmentId
      : NO_DEPARTMENT
    setValues((current) => ({
      ...current,
      facilityId,
      departmentId: matchingDepartment,
      roleCodes: member
        ? member.roleAssignments.filter((assignment) => assignment.facilityId === facilityId).map((assignment) => assignment.code)
        : [],
    }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!values.roleCodes.length) {
      setError('Select at least one role for this facility.')
      return
    }
    setBusy(true)
    try {
      const result = await onSave({
        ...values,
        departmentId: values.departmentId === NO_DEPARTMENT ? '' : values.departmentId,
      })
      if (!result.ok) {
        setError(result.message)
        return
      }
      onOpenChange(false)
    } catch {
      setError('The staff profile could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  function toggleRole(code: string, checked: boolean) {
    setValues((current) => ({
      ...current,
      roleCodes: checked
        ? [...current.roleCodes, code]
        : current.roleCodes.filter((roleCode) => roleCode !== code),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit staff profile' : 'Invite new staff'}</DialogTitle>
          <DialogDescription>
            {member
              ? 'Update the profile and assignments for the selected facility. Existing assignments at other facilities are preserved.'
              : 'Send a secure Supabase Auth invitation and create a scoped staff assignment.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            {!member ? (
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="staff-email">Work email</FieldLabel>
                <Input
                  id="staff-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={values.email}
                  onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                />
              </Field>
            ) : (
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="staff-email-readonly">Work email</FieldLabel>
                <Input id="staff-email-readonly" type="email" value={values.email} disabled />
                <FieldDescription>Email changes require a separate verified Auth flow.</FieldDescription>
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="staff-first-name">First name</FieldLabel>
              <Input
                id="staff-first-name"
                autoComplete="given-name"
                required
                maxLength={100}
                value={values.firstName}
                onChange={(event) => setValues((current) => ({ ...current, firstName: event.target.value }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-middle-name">Middle name</FieldLabel>
              <Input
                id="staff-middle-name"
                autoComplete="additional-name"
                maxLength={100}
                value={values.middleName}
                onChange={(event) => setValues((current) => ({ ...current, middleName: event.target.value }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-last-name">Last name</FieldLabel>
              <Input
                id="staff-last-name"
                autoComplete="family-name"
                required
                maxLength={100}
                value={values.lastName}
                onChange={(event) => setValues((current) => ({ ...current, lastName: event.target.value }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-phone">Phone</FieldLabel>
              <Input
                id="staff-phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                value={values.phone}
                onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="staff-job-title">Job title</FieldLabel>
              <Input
                id="staff-job-title"
                maxLength={120}
                value={values.jobTitle}
                onChange={(event) => setValues((current) => ({ ...current, jobTitle: event.target.value }))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-facility">Primary facility</FieldLabel>
              <Select value={values.facilityId} onValueChange={(value) => value && changeFacility(value)}>
                <SelectTrigger id="staff-facility" className="w-full">
                  <SelectValue placeholder="Choose a facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {facilities.map((option) => (
                      <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-department">Department</FieldLabel>
              <Select
                value={values.departmentId}
                onValueChange={(value) => value && setValues((current) => ({ ...current, departmentId: value }))}
              >
                <SelectTrigger id="staff-department" className="w-full">
                  <SelectValue placeholder="Choose a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={NO_DEPARTMENT}>No department</SelectItem>
                    {availableDepartments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!availableDepartments.length ? (
                <FieldDescription>No departments are configured for this facility.</FieldDescription>
              ) : null}
              {facility?.canManageDepartments ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="w-fit px-0"
                  onClick={() => onCreateDepartment(values.facilityId)}
                >
                  Create a department
                </Button>
              ) : null}
            </Field>
          </FieldGroup>

          <FieldSet className="rounded-lg border p-4">
            <FieldLegend variant="label">Role assignments</FieldLegend>
            <FieldDescription>
              {canAssignRoles
                ? 'Roles are scoped to the selected facility. Super Administrator cannot be assigned here.'
                : 'You can edit this profile, but do not have permission to change its roles.'}
            </FieldDescription>
            {roles.length ? (
              <FieldGroup className="gap-3">
                {roles.map((role) => {
                  const checkboxId = `staff-role-${role.code}`
                  return (
                    <Field key={role.code} orientation="horizontal">
                      <Checkbox
                        id={checkboxId}
                        checked={values.roleCodes.includes(role.code)}
                        disabled={!canAssignRoles}
                        onCheckedChange={(checked) => toggleRole(role.code, checked === true)}
                      />
                      <FieldContent>
                        <FieldLabel htmlFor={checkboxId}>{role.name}</FieldLabel>
                        {role.description ? <FieldDescription>{role.description}</FieldDescription> : null}
                      </FieldContent>
                    </Field>
                  )
                })}
              </FieldGroup>
            ) : (
              <p className="text-sm text-muted-foreground">No assignable roles are available.</p>
            )}
          </FieldSet>

          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !roles.length || !facility}>
              {busy ? 'Saving…' : member ? 'Save profile' : 'Send invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function StaffDetailsDialog({
  open,
  onOpenChange,
  member,
  operationFacilityId,
  currentUserId,
  canUpdate,
  canInvite,
  onEdit,
  onResend,
  onStatusChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: StaffDirectoryMember | null
  operationFacilityId: string
  currentUserId: string
  canUpdate: boolean
  canInvite: boolean
  onEdit: () => void
  onResend: () => void
  onStatusChange: (status: StaffStatus) => void
}) {
  if (!member) return null

  const isProtectedSuperAdministrator = member.roleAssignments.some((assignment) => assignment.code === 'super_administrator')
  const isCurrentUser = member.id === currentUserId
  const assignedFacilities = member.facilities.map((assignment) => (
    <Badge key={assignment.facilityId} variant="outline">
      {assignment.facilityName}{assignment.isPrimary ? ' · Primary' : ''}
    </Badge>
  ))
  const assignedRoles = member.roleAssignments.map((assignment, index) => {
    const facilityName = member.facilities.find((facility) => facility.facilityId === assignment.facilityId)?.facilityName
    return (
      <Badge key={`${assignment.code}-${assignment.facilityId ?? 'global'}-${index}`} variant="secondary">
        {assignment.name} · {facilityName ?? 'Global'}
      </Badge>
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{member.fullName}</DialogTitle>
          <DialogDescription>
            {member.employeeNumber} · {member.jobTitle || 'Staff profile'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={member.status} />
            {isProtectedSuperAdministrator ? <Badge variant="outline">Protected system administrator</Badge> : null}
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1"><dt className="text-xs text-muted-foreground">Email</dt><dd className="break-all text-sm">{member.email}</dd></div>
            <div className="flex flex-col gap-1"><dt className="text-xs text-muted-foreground">Phone</dt><dd className="text-sm">{member.phone || 'Not provided'}</dd></div>
            <div className="flex flex-col gap-1"><dt className="text-xs text-muted-foreground">Department</dt><dd className="text-sm">{member.departmentName || 'Unassigned'}</dd></div>
            <div className="flex flex-col gap-1"><dt className="text-xs text-muted-foreground">Professional license</dt><dd className="text-sm">{member.professionalLicenseNumber || 'Not recorded'}</dd></div>
          </dl>
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Facility assignments</h3>
            <div className="flex flex-wrap gap-2">{assignedFacilities.length ? assignedFacilities : <span className="text-sm text-muted-foreground">No visible facility assignments.</span>}</div>
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Roles</h3>
            <div className="flex flex-wrap gap-2">{assignedRoles.length ? assignedRoles : <span className="text-sm text-muted-foreground">No visible role assignments.</span>}</div>
          </section>
          {isProtectedSuperAdministrator ? (
            <p className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              This initial Super Administrator is protected. Staff management cannot change this account or assign another Super Administrator.
            </p>
          ) : null}
          <DialogFooter>
            {canInvite && !isProtectedSuperAdministrator ? (
              <Button type="button" variant="outline" onClick={onResend}>
                Resend invitation
              </Button>
            ) : null}
            {canUpdate && !isProtectedSuperAdministrator ? (
              <>
                <Button type="button" variant={member.status === 'active' ? 'destructive' : 'outline'} disabled={isCurrentUser} onClick={() => onStatusChange(member.status === 'active' ? 'suspended' : 'active')}>
                  {member.status === 'active' ? 'Suspend access' : 'Reactivate staff'}
                </Button>
                <Button type="button" onClick={onEdit}>Edit profile</Button>
              </>
            ) : null}
            {isCurrentUser && canUpdate && !isProtectedSuperAdministrator ? (
              <span className="basis-full text-right text-xs text-muted-foreground">You cannot change your own access status or role.</span>
            ) : null}
          </DialogFooter>
          <span className="sr-only">Management actions are scoped to facility {operationFacilityId}.</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function StaffDepartmentDialog({
  open,
  onOpenChange,
  facility,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  facility: StaffFacilityOption | null
  onSave: (values: { facilityId: string; code: string; name: string }) => Promise<StaffSubmitResult>
}) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setCode('')
    setName('')
    setError('')
  }, [open, facility?.id])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!facility) return
    setBusy(true)
    setError('')
    try {
      const result = await onSave({ facilityId: facility.id, code: code.trim().toUpperCase(), name: name.trim() })
      if (!result.ok) {
        setError(result.message)
        return
      }
      onOpenChange(false)
    } catch {
      setError('The department could not be created.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add department</DialogTitle>
          <DialogDescription>Create an active department for {facility?.name ?? 'the selected facility'}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="department-code">Department code</FieldLabel>
              <Input id="department-code" required minLength={2} maxLength={24} pattern="[A-Za-z0-9-]{2,24}" value={code} onChange={(event) => setCode(event.target.value)} />
              <FieldDescription>Use 2–24 letters, numbers, or hyphens.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="department-name">Department name</FieldLabel>
              <Input id="department-name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
          </FieldGroup>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy || !facility}>{busy ? 'Saving…' : 'Create department'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function StaffStatusConfirmation({
  open,
  onOpenChange,
  status,
  memberName,
  busy,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  status: StaffStatus
  memberName: string
  busy: boolean
  onConfirm: () => void
}) {
  const suspending = status === 'suspended'
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={suspending ? 'Suspend staff access?' : 'Reactivate staff account?'}
      description={suspending
        ? `${memberName} will lose access to the clinic workspace. Their profile and audit history will remain.`
        : `${memberName} will regain access according to their current role and facility assignments.`}
      confirmLabel={suspending ? 'Suspend access' : 'Reactivate staff'}
      confirmVariant={suspending ? 'destructive' : 'default'}
      busy={busy}
      onConfirm={onConfirm}
    />
  )
}
