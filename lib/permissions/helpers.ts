import type { PermissionCode } from '@/lib/permissions/constants'

/** Use only permissions resolved by the trusted server for presentation; never for authorization. */
export function hasPermission(
  grantedPermissions: readonly string[],
  permission: PermissionCode,
) {
  return grantedPermissions.includes(permission)
}
