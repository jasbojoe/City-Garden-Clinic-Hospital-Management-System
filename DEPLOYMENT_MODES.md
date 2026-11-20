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

The linked Vercel project was verified by ID: `prj_uI4XDCle6pEKGUelrmjQZyH7K3rA` (project name `medicare`, connected to this repository). Its environment mode values currently match the table above: Production `supabase`, Preview `demo`, and Development `demo`. The configured Supabase host is `pxsgqfgrokblrsyjsypt.supabase.co`, matching the active Supabase project `pxsgqfgrokblrsyjsypt`. Production has the required Supabase URL and publishable key, plus server-only credentials used by the admin client. Secret values were not read into this document or chat.

Security issue found during audit: Supabase service-role/secret/JWT credentials and direct Postgres connection credentials are also scoped to Preview and Development. Remove those nonproduction targets before creating a new Preview deployment. Public URL and publishable/anon keys are not privileged, but demo deployments do not require them; if kept for convenience, keep them out of client code except the explicitly publishable keys. If nonproduction backend testing is later required, use an isolated nonproduction Supabase project rather than Production credentials.

## Configure Vercel safely

1. Open the verified `medicare` project in Vercel and go to **Settings → Environment Variables**. Confirm `HMS_DATA_MODE=supabase` is Production-only and `HMS_DATA_MODE=demo` is set for both Preview and Development; the current audit found these mode values already correct.
2. Keep `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET`, and every `POSTGRES_*` variable scoped to Production only. Remove their Preview and Development targets; do not change or rotate the Production values. Public Supabase URL and publishable/anon keys are not privileged, but may also be removed from demo environments because demo mode does not need a backend connection.
3. Confirm Production points to Supabase project `pxsgqfgrokblrsyjsypt` and has the URL, publishable key, and server-only credentials required by the application. Keep service-role/secret keys server-only; never use a `NEXT_PUBLIC_` name for them. Do not paste values into chat or source control.
4. Save the environment changes. Vercel environment updates apply to new deployments, not deployments that are already built.

## Safe verification and redeployment

1. Push the code change to the intended review branch and create a Preview deployment. Confirm the Preview shows the visible **Demo Mode** indicator, sample data only, and no clinical or staff-management mutation path.
2. Verify the Production variable names and scopes in Vercel without copying their values. Confirm `HMS_DATA_MODE=supabase` and the intended live Supabase configuration.
3. Review the Production deployment diff and build logs. The current implementation does not create staff invitations or change the Super Administrator account.
4. After review and approval, use Vercel&apos;s deployment controls to create a new Production deployment from the approved branch. Do not promote a demo-configured deployment as a substitute for a Production build.
5. Verify Production sign-in with an existing authorized staff account. Confirm the displayed name and role come from the authenticated staff profile, the staff directory is permission-gated, and clinical modules display as unavailable. No Supabase schema migration is part of this change.

No Production deployment is started automatically by this change. Pushing the review branch may trigger the project&apos;s usual Preview deployment.
