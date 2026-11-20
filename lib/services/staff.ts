import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { dataMode, type ServiceResult } from '@/lib/services/result'
import type { PermissionCode } from '@/lib/permissions/constants'

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>

export type StaffStatus = 'active' | 'suspended' | 'inactive'

export type StaffFacilityCapability = {
  canReadStaff: boolean
  canInviteStaff: boolean
  canUpdateStaff: boolean
  canAssignRoles: boolean
  canManageDepartments: boolean
}

export type StaffFacilityOption = StaffFacilityCapability & {
  id: string
  code: string
  name: string
}

export type StaffDepartmentOption = {
  id: string
  facilityId: string
  code: string
  name: string
}

export type StaffRoleOption = {
  code: string
  name: string
  description: string | null
}

export type StaffFacilityAssignment = {
  facilityId: string
  facilityCode: string
  facilityName: string
  isPrimary: boolean
}

export type StaffRoleAssignment = {
  facilityId: string | null
  code: string
  name: string
}

export type StaffDirectoryMember = {
  id: string
  employeeNumber: string
  firstName: string
  middleName: string | null
  lastName: string
  fullName: string
  email: string
  phone: string | null
  jobTitle: string | null
  professionalLicenseNumber: string | null
  departmentId: string | null
  departmentName: string | null
  status: StaffStatus
  facilities: StaffFacilityAssignment[]
  roleAssignments: StaffRoleAssignment[]
}

export type StaffManagementData = {
  currentUserId: string
  selectedFacilityId: string
  facilities: StaffFacilityOption[]
  departments: StaffDepartmentOption[]
  roles: StaffRoleOption[]
  staff: StaffDirectoryMember[]
}

export type StaffActorResult =
  | { ok: true; supabase: ServerSupabaseClient; userId: string }
  | { ok: false; message: string }

export async function getStaffActor(): Promise<StaffActorResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { ok: false, message: 'Sign in with an active staff account to continue.' }

    const { data: staffProfile, error: profileError } = await supabase
      .from('staff_profiles')
      .select('id,status')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !staffProfile || staffProfile.status !== 'active') {
      return { ok: false, message: 'An active staff account is required.' }
    }

    return { ok: true, supabase, userId: user.id }
  } catch {
    return { ok: false, message: 'Staff access could not be verified.' }
  }
}

export async function hasStaffPermission(
  supabase: ServerSupabaseClient,
  permission: PermissionCode,
  facilityId: string,
) {
  const { data, error } = await supabase.rpc('has_permission', {
    p_permission_code: permission,
    p_facility_id: facilityId,
  })
  return !error && data === true
}

function serviceError(message: string): ServiceResult<never> {
  return { data: null, error: { code: 'SERVICE_ERROR', message } }
}

function relationObject<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

type StaffProfileRow = {
  id: string
  employee_number: string
  first_name: string
  middle_name: string | null
  last_name: string
  email: string
  phone: string | null
  job_title: string | null
  professional_license_number: string | null
  department_id: string | null
  status: StaffStatus
  departments: { id: string; name: string } | { id: string; name: string }[] | null
  staff_facilities: Array<{
    facility_id: string
    is_primary: boolean
    facilities: { id: string; code: string; name: string } | { id: string; code: string; name: string }[] | null
  }> | null
  staff_roles: Array<{
    facility_id: string | null
    roles: { code: string; name: string } | { code: string; name: string }[] | null
  }> | null
}

export async function getStaffManagementData(
  requestedFacilityId?: string,
): Promise<ServiceResult<StaffManagementData>> {
  if (dataMode() !== 'supabase') {
    return serviceError('Staff management is read-only in demo mode.')
  }

  const actor = await getStaffActor()
  if (!actor.ok) return serviceError(actor.message)

  try {
    const { supabase, userId } = actor
    const { data: facilityRows, error: facilityError } = await supabase
      .from('facilities')
      .select('id,code,name')
      .eq('is_active', true)
      .order('name')

    if (facilityError) return serviceError('Facilities could not be loaded.')

    const readableFacilities = await Promise.all(
      (facilityRows ?? []).map(async (facility) => {
        const [canReadStaff, canInvite, canUpdate, canAssignRoles, canManageDepartments] = await Promise.all([
          hasStaffPermission(supabase, 'staff.read', facility.id),
          hasStaffPermission(supabase, 'staff.invite', facility.id),
          hasStaffPermission(supabase, 'staff.update', facility.id),
          hasStaffPermission(supabase, 'staff.roles.assign', facility.id),
          hasStaffPermission(supabase, 'departments.manage', facility.id),
        ])

        return {
          ...facility,
          canReadStaff,
          canInviteStaff: canInvite && canAssignRoles,
          canUpdateStaff: canUpdate,
          canAssignRoles,
          canManageDepartments,
        }
      }),
    )

    const facilities = readableFacilities.filter((facility) => facility.canReadStaff)
    if (!facilities.length) return serviceError('You do not have permission to view staff in an assigned facility.')

    const selectedFacilityId = requestedFacilityId ?? facilities[0].id
    if (!facilities.some((facility) => facility.id === selectedFacilityId)) {
      return serviceError('You do not have permission to view staff in the selected facility.')
    }

    const facilityIds = facilities.map((facility) => facility.id)
    const [departmentResponse, roleResponse, staffResponse] = await Promise.all([
      supabase
        .from('departments')
        .select('id,facility_id,code,name')
        .in('facility_id', facilityIds)
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('roles')
        .select('code,name,description')
        .neq('code', 'super_administrator')
        .order('name'),
      supabase
        .from('staff_profiles')
        .select('id,employee_number,first_name,middle_name,last_name,email,phone,job_title,professional_license_number,department_id,status,departments(id,name),staff_facilities!inner(facility_id,is_primary,facilities(id,code,name)),staff_roles(facility_id,roles(code,name))')
        .eq('staff_facilities.facility_id', selectedFacilityId)
        .order('last_name', { ascending: true })
        .limit(250),
    ])

    if (departmentResponse.error) return serviceError('Departments could not be loaded.')
    if (roleResponse.error) return serviceError('Staff role options could not be loaded.')
    if (staffResponse.error) return serviceError('Staff records could not be loaded.')

    const staff = ((staffResponse.data ?? []) as unknown as StaffProfileRow[]).map((row) => {
      const department = relationObject(row.departments)
      const facilitiesForStaff = (row.staff_facilities ?? []).flatMap((assignment) => {
        const facility = relationObject(assignment.facilities)
        return facility
          ? [{
              facilityId: facility.id,
              facilityCode: facility.code,
              facilityName: facility.name,
              isPrimary: assignment.is_primary,
            }]
          : []
      })
      const roleAssignments = (row.staff_roles ?? []).flatMap((assignment) => {
        const role = relationObject(assignment.roles)
        return role
          ? [{ facilityId: assignment.facility_id, code: role.code, name: role.name }]
          : []
      })

      return {
        id: row.id,
        employeeNumber: row.employee_number,
        firstName: row.first_name,
        middleName: row.middle_name,
        lastName: row.last_name,
        fullName: [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(' '),
        email: row.email,
        phone: row.phone,
        jobTitle: row.job_title,
        professionalLicenseNumber: row.professional_license_number,
        departmentId: row.department_id,
        departmentName: department?.name ?? null,
        status: row.status,
        facilities: facilitiesForStaff,
        roleAssignments,
      }
    })

    return {
      data: {
        currentUserId: userId,
        selectedFacilityId,
        facilities,
        departments: (departmentResponse.data ?? []).map((department) => ({
          id: department.id,
          facilityId: department.facility_id,
          code: department.code,
          name: department.name,
        })),
        roles: (roleResponse.data ?? []) as StaffRoleOption[],
        staff,
      },
      error: null,
    }
  } catch {
    return serviceError('Staff management data could not be loaded.')
  }
}
