# Deployment modes and safe redeployment

## Required mode values

Set `HMS_DATA_MODE` separately for each Vercel environment:

| Vercel environment | `HMS_DATA_MODE` | Behavior |
| --- | --- | --- |
| Production | `supabase` | Supabase authentication and authorized staff management; clinical modules remain unavailable until their live services and permissions are implemented and verified. |
| Preview | `demo` | Sample records only; no Supabase auth or staff/clinical writes. |
| Development | `demo` | Sample records only; no Supabase auth or staff/clinical writes. |

Only the exact values `demo` and `supabase` are accepted. A value that does not match its Vercel environment is a configuration error. Missing mode defaults to demo only in local development and nonproduction deployments; Production requires an explicit `supabase` value. Set the variable explicitly in every environment rather than relying on the safe default.

## Current Vercel configuration check

The linked Vercel project was verified by ID: `prj_uI4XDCle6pEKGUelrmjQZyH7K3rA` (project name `medicare`). The current environment-variable listing did not contain `HMS_DATA_MODE`. It also showed Supabase and direct database credentials attached to Production, Preview, and Development; secret values were not read or copied into this file.

Before using this configuration, scope Supabase service/secret keys and direct database credentials to Production only. Demo deployments do not need Supabase credentials. If nonproduction backend testing is later required, use an isolated nonproduction Supabase project rather than Production credentials.

## Configure Vercel

1. Open the verified `medicare` project in Vercel and go to **Settings → Environment Variables**.
2. Add `HMS_DATA_MODE` with value `supabase`, scoped to **Production** only.
3. Add `HMS_DATA_MODE` with value `demo`, scoped to **Preview** and **Development**. Use separate entries if the UI requires one scope per entry.
4. Restrict `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET`, `POSTGRES_PASSWORD`, and direct `POSTGRES_*` connection strings to Production only. Also remove Supabase URL/key variables from Preview and Development unless there is a documented nonproduction backend use case.
5. Confirm the existing Production Supabase URL points to the intended live database and that its RLS policies and staff-permission RPCs are in place. Do not paste secret values into chat, source code, or client-side variables.
6. Save the environment changes. Vercel environment updates apply to new deployments, not deployments that are already built.

## Safe verification and redeployment

1. Push the code change to the intended review branch and create a Preview deployment. Confirm the Preview shows the visible **Demo Mode** indicator, sample data only, and no clinical or staff-management mutation path.
2. Verify the Production variable names and scopes in Vercel without copying their values. Confirm `HMS_DATA_MODE=supabase` and the intended live Supabase configuration.
3. Review the Production deployment diff and build logs. The current implementation does not create staff invitations or change the Super Administrator account.
4. After review and approval, use Vercel&apos;s deployment controls to create a new Production deployment from the approved branch. Do not promote a demo-configured deployment as a substitute for a Production build.
5. Verify Production sign-in with an existing authorized staff account. Confirm the displayed name and role come from the authenticated staff profile, the staff directory is permission-gated, and clinical modules display as unavailable. No Supabase schema migration is part of this change.

No Production deployment is started automatically by this change. Pushing the review branch may trigger the project&apos;s usual Preview deployment.
