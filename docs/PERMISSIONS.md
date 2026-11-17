# Permissions and RLS

`lib/permissions/constants.ts` defines permission code identifiers for UI integration. `hasPermission` is only a presentation helper and is not an authorization boundary.

Authorization is intended to combine an active staff profile, a facility membership, and facility-scoped staff role grants. Sensitive patient clinical access must be explicitly granted; facility access alone is insufficient. Reception and billing roles must not receive clinical-note, diagnosis, or prescription access unless the hospital explicitly approves a documented rule.

## Required database controls

- Enable RLS on all operational tables; default deny.
- Check both permission and facility membership in policy predicates.
- Prevent users from editing their own staff status, role assignments, facility memberships, or permission grants.
- Restrict role and facility administration to authorized administrators.
- Keep sensitive clinical data policies narrower than demographic registry access.
- Restrict audit logs to authorized viewers and make events append-only.
- Pin `search_path` to an empty value in security-definer functions and fully qualify all objects.
- Revoke unnecessary grants; do not use service-role credentials in browser code.

Live inspection confirmed RLS is enabled on the inspected operational tables and found facility-/permission-scoped policies. The `register_patient` RPC rechecks `patients.register` within the database and is executable only by authenticated callers; it is `SECURITY DEFINER` with an empty `search_path`. The first-super-administrator bootstrap is not part of the public registration path. These checks are not a substitute for tests using unauthenticated, receptionist, clinician, and administrator identities. Keep backend mode disabled until authentication, account provisioning, RLS behavior, and route-level data sourcing have been exercised with approved test accounts.
