# Implementation status — Phase 2C

## Implemented

- Existing foundation, RLS, audit triggers, patient registration RPC, MRN sequencing, and idempotency are retained.
- Migration `patient_management` is applied to Supabase project `pxsgqfgrokblrsyjsypt`. It adds permission-checked database RPCs for demographic edits, identifier create/update, emergency/contact create/update, and allergy create/update. Added audit coverage for identifier/allergy updates and contact insert/update/delete.
- The initial administrator bootstrap is still first-user-only and service-role-only. It now requires a verified Auth account with explicit one-time `raw_app_meta_data.cgc_initial_admin_authorized=true` approval, consumes that marker on success, and writes a bootstrap audit event. A follow-up guard ensures null metadata cannot bypass the approval check.
- Existing sign-in, password recovery/reset pages, SSR auth callback, and session-refresh proxy exist.

## Not implemented or unverified

- No administrator account was invented or provisioned. Do not consider bootstrap complete until the manual steps below are performed by an authorized project operator.
- Staff invitation, resend, department/facility assignment, role management, suspension/deactivation, and staff permission UI are not implemented. The current Staff page still shows demo data.
- Patient profile edit, identifier/contact/allergy management UI and registration-history UI are not implemented. The new database RPCs exist but are not yet called by the application.
- No active administrator/receptionist/doctor/nurse/cashier test accounts exist in this task. Login, logout, recovery, reset, session refresh, suspended-user denial, protected routes, RLS isolation, role escalation attempts, CRUD, and audit row contents are not end-to-end tested.
- Supabase Auth's public-signup configuration cannot be established from the connected database schema/API used here. Do not enable live backend mode until an operator verifies it is off.
- Clinical, admissions, appointment, laboratory, pharmacy, billing, and other modules remain demo/unconnected. The app is not approved for real patient information or clinical production use.

## Required one-time administrator setup (manual; not performed)

1. In Supabase Dashboard for project `pxsgqfgrokblrsyjsypt`, open **Authentication → Sign In / Providers → User Signups** and verify **Allow new users to sign up** is disabled. If it is enabled, disable it before continuing. This setting must not be inferred from the UI hiding a sign-up link.
2. Under **Authentication → Users**, invite only the explicitly approved initial administrator's real email. Do not create or share a password. The recipient must accept/verify the invitation so `email_confirmed_at` is set.
3. Using a trusted operator-only Supabase Auth Admin API client (never browser code), set this account's `app_metadata` key `cgc_initial_admin_authorized` to the string `true`. Do not put the service-role key in chat, source control, browser bundles, or an untrusted script. Record the invited user's UUID and verify the email is confirmed.
4. In the Supabase SQL Editor, execute the following transaction, replacing the UUID with the verified, approved account UUID:

   ```sql
   begin;
   select set_config('request.jwt.claim.role', 'service_role', true);
   select public.bootstrap_first_super_administrator('00000000-0000-0000-0000-000000000000'::uuid);
   commit;
   ```

   The transaction must return the same user UUID. If it errors, do not retry with another identity; investigate the setup state. The procedure is atomic and one-time. It creates the active staff profile, primary facility assignment, super-administrator role, audit row, and removes the one-time approval marker.
5. Confirm the account can sign in and that its `staff_profiles.status` is active and a `bootstrap` row exists in `audit_logs`. Only then begin authorized role-based testing.

The manual sequence above is a hard gate: it has not been executed here, and no authenticated CRUD or E2E success is claimed.

## Applied migration status

- `202611170006_patient_management`: applied successfully through Supabase MCP.
- `202611170007_bootstrap_null_guard`: applied successfully through Supabase MCP.
- Existing migrations `foundation_security`, `foreign_key_indexes`, `patient_registration`, `patient_registry_hardening`, and `patient_registration_idempotency` were present before this task.

## Security advisor findings

- Seven authenticated-callable `SECURITY DEFINER` RPC warnings remain; they are intentionally exposed but permission-checked and use fixed empty search paths. They require review with real test roles.
- One RLS-enabled/no-policy information finding remains for the private idempotency table; it has no API-role grants and intentionally has no caller policy.
- Performance advisor still reports RLS init-plan warnings (8), unused-index notices, and multiple-permissive-policy notices. These were not changed because no role-based regression suite is available.

## Validation

- `pnpm typecheck`: passed after excluding a malformed generated `.next/dev/types/validator.ts` artifact; `next build` type validation also passed.
- `pnpm build`: passed.
- Supabase migrations `patient_management` and `bootstrap_null_guard`: applied successfully.
- Live grant check: bootstrap execution is denied to `anon` and `authenticated`, allowed to `service_role`, and retains `search_path=""`.
- Live aggregate check: no super-administrator has been provisioned. Authenticated role has no INSERT/UPDATE/DELETE privileges on `audit_logs` and no direct UPDATE on `patient_identifiers`.
- No authenticated tests, RLS tests, patient CRUD tests, audit event-content verification, browser workflow checks, or role-matrix tests have been run. No synthetic patient or test staff account was created. The new RPC behavior has not been called with patient or staff records.
