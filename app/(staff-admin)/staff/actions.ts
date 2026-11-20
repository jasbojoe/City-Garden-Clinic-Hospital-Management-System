'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getAuthCallbackUrl } from '@/lib/supabase/config'
import { dataMode } from '@/lib/services/result'
import { getStaffActor, getStaffManagementData, hasStaffPermission } from '@/lib/services/staff'

const optionalText = (max: number) => z.string().trim().max(max).optional()
const roleCodesSchema = z.array(z.string().regex(/^[a-z][a-z0-9_]{0,63}$/)).min(1).max(10)
  .refine((values) => new Set(values).size === values.length)

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  firstName: z.string().trim().min(1).max(100),
  middleName: optionalText(100),
  lastName: z.string().trim().min(1).max(100),
  phone: optionalText(40),
  jobTitle: optionalText(120),
  departmentId: z.string().uuid().nullable(),
  facilityId: z.string().uuid(),
  roleCodes: roleCodesSchema,
})

const updateSchema = z.object({
  staffId: z.string().uuid(),
  firstName: z.string().trim().min(1).max(100),
  middleName: optionalText(100),
  lastName: z.string().trim().min(1).max(100),
  phone: optionalText(40),
  jobTitle: optionalText(120),
  departmentId: z.string().uuid().nullable(),
  facilityId: z.string().uuid(),
  roleCodes: roleCodesSchema,
  status: z.enum(['active', 'suspended', 'inactive']),
})

const facilityTargetSchema = z.object({
  staffId: z.string().uuid(),
  facilityId: z.string().uuid(),
})

const departmentSchema = z.object({
  facilityId: z.string().uuid(),
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{2,24}$/),
  name: z.string().trim().min(2).max(100),
})

export type StaffActionResult = { ok: true; message: string } | { ok: false; message: string }

function modeError(): StaffActionResult {
  return { ok: false, message: 'Staff management is read-only in demo mode.' }
}

export async function getStaffManagementDataAction(facilityId: string) {
  if (dataMode() !== 'supabase') return { data: null, error: 'Staff management is read-only in demo mode.' }
  const parsed = z.string().uuid().safeParse(facilityId)
  if (!parsed.success) return { data: null, error: 'The selected facility is invalid.' }
  const result = await getStaffManagementData(parsed.data)
  return result.error ? { data: null, error: result.error.message } : { data: result.data, error: null }
}

export async function inviteStaffAction(input: unknown): Promise<StaffActionResult> {
  if (dataMode() !== 'supabase') return modeError()
  const parsed = inviteSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'Check the staff details and try again.' }

  const actor = await getStaffActor()
  if (!actor.ok) return { ok: false, message: actor.message }

  const values = parsed.data
  const rpcArgs = {
    p_email: values.email,
    p_first_name: values.firstName,
    p_middle_name: values.middleName || null,
    p_last_name: values.lastName,
    p_phone: values.phone || null,
    p_job_title: values.jobTitle || null,
    p_department_id: values.departmentId,
    p_facility_id: values.facilityId,
    p_role_codes: values.roleCodes,
  }

  try {
    const { error: preflightError } = await actor.supabase.rpc('validate_staff_invitation', rpcArgs)
    if (preflightError) {
      return { ok: false, message: 'Invitation checks failed or are unavailable. No Auth invitation was sent.' }
    }

    const admin = createAdminClient()
    const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(values.email, {
      data: { first_name: values.firstName, last_name: values.lastName },
      redirectTo: getAuthCallbackUrl('/dashboard'),
    })

    if (inviteError || !inviteData.user?.id) {
      return { ok: false, message: 'Supabase could not send this invitation. Verify the email address and account status.' }
    }

    const { error: profileError } = await actor.supabase.rpc('create_staff_from_invitation', {
      p_user_id: inviteData.user.id,
      ...rpcArgs,
    })

    if (profileError) {
      return {
        ok: false,
        message: 'An invitation may have been sent, but its staff profile was not finalized. Do not retry; contact the system administrator.',
      }
    }

    revalidatePath('/staff')
    return { ok: true, message: 'Invitation sent and staff assignment recorded.' }
  } catch {
    return { ok: false, message: 'Staff invitation could not be completed. Sensitive details were not logged.' }
  }
}

export async function updateStaffAction(input: unknown): Promise<StaffActionResult> {
  if (dataMode() !== 'supabase') return modeError()
  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'Check the staff details and try again.' }

  const actor = await getStaffActor()
  if (!actor.ok) return { ok: false, message: actor.message }

  const values = parsed.data
  try {
    const { error } = await actor.supabase.rpc('update_staff_profile_admin', {
      p_staff_id: values.staffId,
      p_facility_id: values.facilityId,
      p_first_name: values.firstName,
      p_middle_name: values.middleName || null,
      p_last_name: values.lastName,
      p_phone: values.phone || null,
      p_job_title: values.jobTitle || null,
      p_department_id: values.departmentId,
      p_role_codes: values.roleCodes,
      p_status: values.status,
    })

    if (error) return { ok: false, message: 'The profile could not be updated. Check staff-management permissions and assignments.' }
    revalidatePath('/staff')
    return { ok: true, message: 'Staff profile updated.' }
  } catch {
    return { ok: false, message: 'The profile could not be updated.' }
  }
}

export async function createStaffDepartmentAction(input: unknown): Promise<StaffActionResult> {
  if (dataMode() !== 'supabase') return modeError()
  const parsed = departmentSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'Enter a valid department code and name.' }

  const actor = await getStaffActor()
  if (!actor.ok) return { ok: false, message: actor.message }
  const { facilityId, code, name } = parsed.data

  if (!await hasStaffPermission(actor.supabase, 'departments.manage', facilityId)) {
    return { ok: false, message: 'You do not have permission to manage departments at this facility.' }
  }

  try {
    const { error } = await actor.supabase.from('departments').insert({
      facility_id: facilityId,
      code,
      name,
    })
    if (error) return { ok: false, message: 'The department could not be created. Check for a duplicate code or name.' }
    revalidatePath('/staff')
    return { ok: true, message: 'Department added.' }
  } catch {
    return { ok: false, message: 'The department could not be created.' }
  }
}

export async function resendStaffInvitationAction(input: unknown): Promise<StaffActionResult> {
  if (dataMode() !== 'supabase') return modeError()
  const parsed = facilityTargetSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'The selected staff profile is invalid.' }

  const actor = await getStaffActor()
  if (!actor.ok) return { ok: false, message: actor.message }
  const { supabase } = actor
  const { staffId, facilityId } = parsed.data
  const canInvite = await hasStaffPermission(supabase, 'staff.invite', facilityId)
  const canAssignRoles = await hasStaffPermission(supabase, 'staff.roles.assign', facilityId)
  const canRead = await hasStaffPermission(supabase, 'staff.read', facilityId)
  if (!canInvite || !canAssignRoles || !canRead) {
    return { ok: false, message: 'You do not have permission to resend staff invitations at this facility.' }
  }

  try {
    const { data: target, error: targetError } = await supabase
      .from('staff_profiles')
      .select('id,email,status,staff_facilities!inner(facility_id),staff_roles(roles(code))')
      .eq('id', staffId)
      .eq('staff_facilities.facility_id', facilityId)
      .maybeSingle()

    if (targetError || !target || target.status !== 'active') {
      return { ok: false, message: 'No pending invitation is available for this staff profile.' }
    }

    const roleAssignments = (target.staff_roles ?? []) as Array<{ roles: { code: string } | { code: string }[] | null }>
    const isSuperAdministrator = roleAssignments.some((assignment) => {
      const role = Array.isArray(assignment.roles) ? assignment.roles[0] : assignment.roles
      return role?.code === 'super_administrator'
    })
    if (isSuperAdministrator) {
      return { ok: false, message: 'The Super Administrator account is protected.' }
    }

    const admin = createAdminClient()
    const { data: authData, error: authError } = await admin.auth.admin.getUserById(staffId)
    const authUser = authData.user
    if (
      authError || !authUser || !authUser.invited_at || authUser.email_confirmed_at ||
      authUser.email?.toLowerCase() !== target.email.toLowerCase()
    ) {
      return { ok: false, message: 'No pending invitation is available for this staff profile.' }
    }

    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(target.email, {
      redirectTo: getAuthCallbackUrl('/dashboard'),
    })
    if (inviteError) return { ok: false, message: 'Supabase could not resend this invitation.' }

    const { error: auditError } = await supabase.rpc('audit_staff_invitation_resent', {
      p_staff_id: staffId,
      p_facility_id: facilityId,
    })
    revalidatePath('/staff')
    if (auditError) {
      return { ok: true, message: 'Invitation resent, but its audit confirmation needs administrator review.' }
    }
    return { ok: true, message: 'Invitation resent.' }
  } catch {
    return { ok: false, message: 'The invitation could not be resent.' }
  }
}
