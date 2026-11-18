# Implementation status — Phase 2C

## Implemented

- Existing foundation, RLS, audit triggers, patient registration RPC, MRN sequencing, and idempotency are retained.
- Migration `patient_management` is applied to Supabase project `pxsgqfgrokblrsyjsypt`. It adds permission-checked database RPCs for demographic edits, identifier create/update, emergency/contact create/update, and allergy create/update. Added audit coverage for identifier/allergy updates and contact insert/update/delete.
- The initial administrator bootstrap is still first-user-only and service-role-only. It now requires a verified Auth account with explicit one-time `raw_app_meta_data.cgc_initial_admin_authorized=true` approval, consumes that marker on success, and writes a bootstrap audit event. A follow-up guard ensures null metadata cannot bypass the approval check.
- Existing sign-in, password recovery/reset pages, SSR auth callback, and session-refresh proxy exist.

## Not implemented or unverified

- The clinic-authorized initial Super Administrator is provisioned. A live aggregate check found one active staff profile, one `super_administrator` assignment, and one bootstrap audit event. The operator confirmed the account is verified, assigned to `CGC-FRE`, and the one-time approval marker was consumed. Do not rerun bootstrap or modify/recreate this account.
- Staff administration is implemented in the `v0/phase-2c-staff-management` feature branch: scoped directory/profile management, invitation and resend actions, primary facility/department assignment, role assignment, suspension/reactivation, and permission-gated department creation. The `staff_management_admin` migration was applied and its execute grants/search path verified. The follow-up `staff_invite_preflight` migration call returned an MCP error and its live status could not be confirmed; the invite action fails closed before sending if that preflight RPC is unavailable. No staff invitation was sent and no new Auth or staff account was created.
- Patient profile edit, identifier/contact/allergy management UI and registration-history UI are not implemented. The new database RPCs exist but are not yet called by the application.
- The operator-provisioned Super Administrator exists, but administrator login was not tested here because no credentials or authenticated browser session were provided. No synthetic staff accounts were created. Logout, invitation delivery, role escalation, suspension, RLS isolation, and staff audit content are not end-to-end tested.
- Supabase Auth's public-signup configuration cannot be established from the connected database schema/API used here. Do not enable live backend mode until an operator verifies it is off.
- Clinical, admissions, appointment, laboratory, pharmacy, billing, and other modules remain demo/unconnected. The app is not approved for real patient information or clinical production use.

## Initial administrator setup

The one-time bootstrap is complete. Do not run `bootstrap_first_super_administrator` again, create a second Super Administrator, or edit the initial administrator through staff-management workflows. The initial account remains protected in the staff-management database functions.

## Applied migration status

- `202611170006_patient_management`: applied successfully through Supabase MCP.
- `202611170007_bootstrap_null_guard`: applied successfully through Supabase MCP.
- `202611180001_staff_management`: applied successfully through Supabase MCP; RPC ACLs and fixed `search_path` were verified.
- `202611180002_staff_invite_preflight`: application and live state could not be confirmed after the Supabase MCP returned an unhandled error. Invitation code checks this RPC first and sends no email if it is missing.
- Existing migrations `foundation_security`, `foreign_key_indexes`, `patient_registration`, `patient_registry_hardening`, and `patient_registration_idempotency` were present before this task.

## Security advisor findings

- Seven authenticated-callable `SECURITY DEFINER` RPC warnings remain; they are intentionally exposed but permission-checked and use fixed empty search paths. They require review with real test roles.
- One RLS-enabled/no-policy information finding remains for the private idempotency table; it has no API-role grants and intentionally has no caller policy.
- Performance advisor still reports RLS init-plan warnings (8), unused-index notices, and multiple-permissive-policy notices. These were not changed because no role-based regression suite is available.

## Validation

- `pnpm exec next typegen && pnpm typecheck`: passed after refreshing generated route types for the new `/staff` route group.
- `pnpm build`: passed.
- Supabase migrations `patient_management` and `bootstrap_null_guard`: applied successfully.
- Live grant check: bootstrap execution is denied to `anon` and `authenticated`, allowed to `service_role`, and retains `search_path=""`.
- Live aggregate check: one active staff profile, one `super_administrator` assignment, and one bootstrap audit event. Authenticated role has no INSERT/UPDATE/DELETE privileges on `audit_logs` and no direct UPDATE on `patient_identifiers`.
- No authenticated tests, RLS tests, patient CRUD tests, audit event-content verification, browser workflow checks, or role-matrix tests have been run. No synthetic patient or test staff account was created. The new RPC behavior has not been called with patient or staff records.
