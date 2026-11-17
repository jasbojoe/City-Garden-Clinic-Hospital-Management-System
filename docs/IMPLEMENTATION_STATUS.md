# Implementation status

## Completed

- Added typed domain models, permission constants, Zod validators, Supabase browser/server clients, service contracts, and explicit demo/backend modes.
- Added versioned migration `supabase/migrations/202611170001_foundation_security.sql` and applied it to the connected Supabase project `pxsgqfgrokblrsyjsypt` as migration `20261117012323` (`foundation_security`).
- Confirmed the live project contains the facilities, departments, staff, roles, permissions, patients, patient identifiers, contacts, allergies, and audit tables with RLS enabled; seeded the City Garden Clinic facility and system roles/permissions.
- Replaced the prototype login form with Supabase email/password sign-in; added forgot-password, password-reset, and auth callback routes.
- Added Next.js 16 session refresh proxy and active staff-profile checks for backend-mode dashboard access. Logout calls Supabase Auth.
- Backend mode remains fail-closed: after active staff verification it shows a status page rather than exposing pages that still contain demo records.

## Verification performed

- `pnpm typecheck` passed.
- `pnpm build` passed.
- Browser snapshot confirmed the updated login screen renders.
- Live Supabase table inspection confirmed the foundation tables and RLS status; migration history contains the foundation migration.
- Supabase advisors reported security-definer RPC warnings for the intentionally used permission/MRN helper functions, plus unindexed foreign-key recommendations. These require review before production use: [security finding](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) and [index finding](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys).

## Not yet implemented

- Staff invitation/provisioning, role and facility assignment workflows, and first-administrator bootstrap UI/procedure execution.
- Supabase-backed patient listing, registration, demographic updates, identifiers, contacts, and allergies.
- Database-backed staff administration, audit event verification, and integration/RLS behavior tests using synthetic accounts and records.
- Additional clinical, laboratory, pharmacy, billing, admission, and migration tables/services.
- Full security-definer/grant review, foreign-key index recommendations, and end-to-end sign-in/reset/logout tests with an invited account.

## Operational limitation

Do not use real patient data. Existing dashboard modules remain demo workflows and are intentionally not rendered in backend mode. The foundation migration is installed, but this is not yet a production-ready clinical system; backend mode must remain disabled for ordinary use until the outstanding service wiring and security verification are complete.
