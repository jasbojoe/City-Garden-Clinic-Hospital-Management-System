# Implementation status

## Completed in this change

- [x] Fixed the discovered TypeScript errors and added `pnpm typecheck`.
- [x] Removed `typescript.ignoreBuildErrors`; production builds now enforce type checking.
- [x] Added `@supabase/supabase-js`, `@supabase/ssr`, and Zod.
- [x] Added browser/server Supabase client setup using publishable/anon keys only.
- [x] Added typed foundational domain models and permission code constants.
- [x] Added Zod validators for patient registration/demographics, staff creation, login, password reset, and core workflow inserts.
- [x] Added explicit demo-mode patient/staff reads and fail-closed backend-not-ready results. Demo writes return errors, not fake success.
- [x] Added proposed architecture, schema, permission, integration, and status documentation.
- [x] Added `.env.example` and setup instructions.

## Partially completed

- [ ] Service abstraction is introduced for patient/staff read paths but existing modules still import demo arrays directly.
- [ ] Shared loading/empty/error states exist; permission-denied and confirmation components are reusable, but aren't applied to every workflow.
- [ ] Supabase clients are ready, but no dashboard auth/session route integration is enabled.

## Not implemented

- [ ] Database migrations or changes applied to the connected Supabase project.
- [ ] RLS policies, database permission helper functions, MRN generator, or security review.
- [ ] Login, password recovery, logout, active-staff/facility verification, and protected dashboard routing.
- [ ] Staff administration and patient CRUD against Supabase.
- [ ] Server-side audit logging and RLS/integration tests.

## Blocked

- Supabase is connected and environment variable names are present, but the integration's live schema inspection returns an execution error and its SQL tool is unavailable in this turn. The current public schema and policies therefore cannot be safely checked or modified.

## Requires hospital workflow confirmation

- Approved staff roles, permission matrix, patient record visibility boundaries, multi-facility membership policy, staff provisioning process, MRN format, and emergency/break-glass access rules.

## Security limitations

- Current HMS screens remain prototype/demo workflows. Client permission helpers are not security controls. Do not use real patient data or enable `HMS_DATA_MODE=supabase` until migrations, RLS, authentication, and server authorization have been implemented and tested.
