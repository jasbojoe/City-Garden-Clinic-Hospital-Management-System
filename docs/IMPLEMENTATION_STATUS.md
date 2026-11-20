# Implementation status — Phase 2C

## Implemented

- Existing foundation, RLS, audit triggers, patient registration RPC, MRN sequencing, and idempotency are retained.
- Migration `patient_management` is applied to Supabase project `pxsgqfgrokblrsyjsypt`. It adds permission-checked database RPCs for demographic edits, identifier create/update, emergency/contact create/update, and allergy create/update. Added audit coverage for identifier/allergy updates and contact insert/update/delete.
- The initial administrator bootstrap is still first-user-only and service-role-only. It now requires a verified Auth account with explicit one-time `raw_app_meta_data.cgc_initial_admin_authorized=true` approval, consumes that marker on success, and writes a bootstrap audit event. A follow-up guard ensures null metadata cannot bypass the approval check.
- Existing sign-in, password recovery/reset pages, SSR auth callback, and session-refresh proxy exist.

## Not implemented or unverified

- The clinic-authorized initial Super Administrator remains unchanged. Read-only aggregate checks on 2026-11-19 found one active Super Administrator profile linked to an email-confirmed Auth account, with `staff.read`, `staff.invite`, `staff.roles.assign`, `staff.update`, and `departments.manage`. This confirms database/Auth/role state, not successful login. The current browser preview is in demo mode, so login and access to the real Staff Management interface remain unverified. Do not rerun bootstrap or modify/recreate this account.
- Staff administration is implemented in the `v0/phase-2c-staff-management` feature branch: scoped directory/profile management, invitation and resend actions, primary facility/department assignment, role assignment, suspension/reactivation, and permission-gated department creation. The `staff_management_admin` and `staff_invite_preflight` migrations are now present in the live ledger. The preflight migration was applied through Supabase MCP after its dependencies and guards were checked; its live function owner, SECURITY DEFINER setting, fixed search_path, and execution grants were verified. No staff invitation was sent and no new Auth or staff account was created.
- Patient profile edit, identifier/contact/allergy management UI and registration-history UI are not implemented. The new database RPCs exist but are not yet called by the application.
- The operator-provisioned Super Administrator exists, but administrator login was not tested here because no credentials or authenticated browser session were provided. No synthetic staff accounts were created. Logout, invitation delivery, role escalation, suspension, RLS isolation, and staff audit content are not end-to-end tested.
- Supabase Auth's public-signup configuration cannot be established from the connected database schema/API used here. Do not enable live backend mode until an operator verifies it is off.
- Clinical, admissions, appointment, laboratory, pharmacy, billing, and other modules remain demo/unconnected. The app is not approved for real patient information or clinical production use.

## Initial administrator setup

The one-time bootstrap is complete. Do not run `bootstrap_first_super_administrator` again, create a second Super Administrator, or edit the initial administrator through staff-management workflows. The initial account remains protected in the staff-management database functions.

## Applied migration status

Live Supabase migration ledger snapshot from 2026-11-19:

- `20261117012323` — `foundation_security`
- `20261117015320` — `foreign_key_indexes`
- `20261117015357` — `patient_registration`
- `20261117015517` — `unused`
- `20261117022400` — `patient_registry_hardening`
- `20261117022447` — `patient_registration_idempotency`
- `20261117131619` — `patient_management` (repository migration `202611170006_patient_management`)
- `20261117131727` — `bootstrap_null_guard` (repository migration `202611170007_bootstrap_null_guard`)
- `20261118162110` — `staff_management_admin` (repository migration `202611180001_staff_management`)
- `20261119150202` — `staff_invite_preflight` (repository migration `202611180002_staff_invite_preflight.sql`)

The invitation-preflight migration was absent from the ledger and its function absent from `pg_proc` before application. Its referenced columns, RLS state, and permission-helper definitions were checked; the migration was then applied through Supabase MCP and verified in both the ledger and live catalog. The preflight and staff RPCs are owned by `postgres`, are `SECURITY DEFINER`, pin `search_path=""`, deny `anon`, and grant execution to `authenticated` (the live ACL also includes `service_role`; no `PUBLIC` ACL entry). The preflight checks active facility/department, valid non-Super-Administrator roles, duplicate emails, and `staff.invite` plus `staff.roles.assign` before the app sends an Auth invitation. Earlier ledger entries were checked for presence only in this task; their complete database objects were not re-audited.

## Security advisor findings — 2026-11-19

- The Supabase security advisor reports 11 authenticated-callable `SECURITY DEFINER` RPC warnings, including the staff invitation preflight. Staff RPCs reviewed here use fixed empty search paths and explicit permission checks; runtime role tests remain outstanding. [Advisor remediation](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- The advisor reports RLS enabled without policies on `public.patient_registration_requests`. Live table grants were limited to `postgres` and `service_role`; no direct `anon` or `authenticated` grants were present. [Advisor remediation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- The advisor reports Supabase Auth leaked-password protection is disabled. This project-level setting was not changed as part of PR #5. [Supabase guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Validation

- `pnpm typecheck`: passed on 2026-11-19.
- `pnpm build`: passed on 2026-11-19.
- Supabase migrations `patient_management` and `bootstrap_null_guard`: applied successfully.
- Live grant check: bootstrap execution is denied to `anon` and `authenticated`, allowed to `service_role`, and retains `search_path=""`.
- Live aggregate check: one active staff profile, one `super_administrator` assignment, and one bootstrap audit event. Authenticated role has no INSERT/UPDATE/DELETE privileges on `audit_logs` and no direct UPDATE on `patient_identifiers`.
- No Auth-backed tests, RLS isolation tests, patient CRUD tests, audit event-content checks, role-matrix tests, or invitation/callback/suspension workflows were run. No approved synthetic staff identity was provided or created, and no invitation email was sent. A browser check of `/staff` rendered `Prototype Demo — Sample Data`; it did not reach the Supabase-backed Staff Management interface.
- No test script, test files, or configured test runner were found. `pnpm lint` could not run because the workspace has no `eslint` executable.
- Code review only: the invitation preflight and create RPCs both require `staff.invite` and `staff.roles.assign`, reject `super_administrator` assignment, and the update RPC prevents self role/status/facility changes and protects the existing Super Administrator. These controls have not been exercised with authenticated test identities.
- Review caveat: Auth invitation email and the staff-profile RPC are separate systems. If email sending succeeds but profile creation fails, the action surfaces that partial state and warns not to retry, but it does not automatically reconcile or revoke the pending Auth account. Resend similarly reports an audit warning if email succeeds but audit logging fails. These failure paths remain untested and should be resolved or accepted before production release.
- Scope review: the PR changes staff UI/actions, shared navigation, auth actions, permission constants, docs, and staff migrations; no patient registry implementation or patient migration files changed.
