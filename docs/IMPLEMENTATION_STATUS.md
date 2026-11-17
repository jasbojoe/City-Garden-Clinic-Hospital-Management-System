# Implementation status

## Completed in the current phase

- Added `202611170004_patient_registry_hardening.sql` and applied it to Supabase project `pxsgqfgrokblrsyjsypt` as `patient_registry_hardening`.
  - Confirmed `facilities.default_currency` is `character(3)` and supports `SLE`.
  - Removed the patient MRN column default and revoked authenticated direct execution of `generate_patient_mrn()`; MRNs are generated inside the permission-checked registration RPC.
  - Revoked direct `INSERT` on `patients` from `authenticated` so patient creation must pass through the audited RPC.
  - Replaced the earlier registration RPC with an atomic patient, optional emergency contact, and allergy write. The RPC validates `patients.register`, uses a fixed empty `search_path`, and relies on database triggers for audit entries.
- Added and applied `202611170005_patient_registration_idempotency.sql` as `patient_registration_idempotency`. The private, RLS-enabled request table and per-actor request key make retries of one submission return its original patient instead of creating another record. Ordinary API roles have no table grants or RLS policies for this table.
- Connected the patient directory read/search, authorized facility list, profile demographics, and registration form to the existing Supabase service layer. Registration input is Zod-validated server-side, access is rechecked in the RPC, errors are surfaced, MRNs come from the database, and possible same-name patients produce a warning.
- In backend mode, the profile hides sample appointments, encounters, lab results, invoices, prescriptions, and documents instead of presenting demo records as real clinical information. Demo mode remains read-only.

## Verification performed

- `pnpm typecheck` passed after the service and UI wiring changes.
- The browser opened `/patients/new` successfully and confirmed demo mode fails closed with a clear registration-unavailable state. No authenticated user or fictional patient was created during this check.
- Both incremental migrations returned success from the Supabase MCP. Live checks confirmed RLS is enabled on `patient_registration_requests`.
- Supabase security advisor recheck reports three `SECURITY DEFINER` RPC warnings: `has_facility_access`, `has_permission`, and `register_patient`. Each is intentionally callable by signed-in users for authorization/registration, has a fixed empty `search_path`, and checks the active staff/permission context; these warnings remain for an account-based review.
- Performance advisor still reports eight RLS initialization-plan findings, unused-index informational findings, and two multiple-permissive-policy warnings. These are not represented as resolved.

## Still incomplete / production blockers

- No administrator or staff invitation/provisioning workflow; no first-administrator bootstrap has been run. The bootstrap RPC remains service-role-only, but a documented manual authorized setup and audit verification are still required.
- Public Supabase Auth sign-up configuration was not available through the connected database tools and has not been verified in Supabase Auth settings. Do not assume UI hiding disables public signup.
- No active staff test account was available. Login, reset, logout, active-staff denial, MFA, facility scoping, role-escalation attempts, audit rows, and authenticated/unauthenticated RLS behavior have not been end-to-end tested.
- Patient demographic edits, identifiers, standalone contact/allergy management, and full duplicate matching are not yet implemented. Duplicate detection is a same-facility first/last-name warning only.
- No automated Supabase/RLS integration tests were run. No real or synthetic patient was written to the connected project.
- The UI exposes the live registry only when `HMS_DATA_MODE=supabase` and a properly provisioned active staff user can sign in. Keep the current default demo mode until manual auth configuration and staff provisioning are complete.
- Clinical, lab, pharmacy, billing, admission, migration, and staff modules remain unconnected. This application is not approved for real patient data or production clinical use.

## Advisor references

- [SECURITY DEFINER functions callable by authenticated users](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)
- [RLS initialization-plan performance](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan)
- [Unused indexes](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)
- [Multiple permissive policies](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies)
