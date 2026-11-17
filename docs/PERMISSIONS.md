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

Live inspection confirmed RLS is enabled on the inspected operational tables and found facility-/permission-scoped policies. The patient registry hardening migrations revoke direct `INSERT` on `public.patients` from `authenticated` and revoke authenticated execution of `generate_patient_mrn()`. The `register_patient` RPC remains executable by authenticated callers because registration is an intended operation; it rechecks `patients.register` and active/facility-scoped permission through the permission helper, has a fixed empty `search_path`, and writes the patient, optional emergency contact, and allergies atomically. A private RLS-enabled idempotency table has no API-role grants or policies and is only used by this RPC. Database triggers append audit rows for patient, contact, and allergy writes. The one-time first-super-administrator bootstrap remains service-role-only, checks a verified account and a separately set one-time `raw_app_meta_data.cgc_initial_admin_authorized=true` approval marker, and removes the marker after success. It must never be exposed through public sign-up. No account has been provisioned through this procedure. Signup configuration must still be checked manually in Supabase Auth.

Migration `202611170006_patient_management` added permission-checked RPCs for patient demographic edits, identifier create/update, contact create/update, and allergy create/update. Corresponding update/contact audit triggers were installed. Direct API table writes remain constrained by the existing grants and RLS. This database layer is not yet exposed through complete profile-management UI and has not been exercised with authenticated accounts.

The current security advisor reports seven signed-in-callable `SECURITY DEFINER` functions, including `has_facility_access`, `has_permission`, patient registration, and the four patient-management RPCs. Those functions are intentionally granted to authenticated callers and each performs permission checks with a fixed empty `search_path`, but the warnings require account-based review. It also reports the `patient_registration_requests` RLS-enabled/no-policy informational finding; the table has no API-role grants and is intentionally private. Performance findings remain, including RLS init-plan warnings (8), unused indexes, and multiple permissive policies. No account-based attempt to assign administrator roles or read another facility's patient records has been executed. Keep backend mode disabled until signup settings, provisioning, and RLS behavior are verified with approved test accounts.
