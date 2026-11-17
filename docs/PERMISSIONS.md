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

Live inspection confirmed RLS is enabled on the inspected operational tables and found facility-/permission-scoped policies. The patient registry hardening migrations revoke direct `INSERT` on `public.patients` from `authenticated` and revoke authenticated execution of `generate_patient_mrn()`. The `register_patient` RPC remains executable by authenticated callers because registration is an intended operation; it rechecks `patients.register` and active/facility-scoped permission through the permission helper, has a fixed empty `search_path`, and writes the patient, optional emergency contact, and allergies atomically. A private RLS-enabled idempotency table has no API-role grants or policies and is only used by this RPC. Database triggers append audit rows for patient, contact, and allergy writes. The first-super-administrator bootstrap remains service-role-only and must never be exposed through public sign-up.

Supabase's security advisor continues to warn about the three authenticated-callable `SECURITY DEFINER` RPCs (`has_facility_access`, `has_permission`, `register_patient`). These functions are intentionally callable for policy evaluation and registration, but the warnings require review with real roles before production. The advisor also reports RLS init-plan performance warnings and existing unused-index / multiple-permissive-policy findings. No account-based attempt to assign administrator roles or read another facility's patient records has yet been executed. Keep backend mode disabled until public signup settings, provisioning, MFA policy, and RLS behavior have been verified with approved test accounts.
