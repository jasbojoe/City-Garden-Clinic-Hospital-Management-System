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

The linked Vercel project was verified by ID: `prj_uI4XDCle6pEKGUelrmjQZyH7K3rA` (project name `medicare`, connected to this repository). Its environment mode values match the table above: Production `supabase`, Preview `demo`, and Development `demo`. The configured Supabase host is `pxsgqfgrokblrsyjsypt.supabase.co`, matching the active, healthy Supabase project `pxsgqfgrokblrsyjsypt`. Production has the required Supabase URL and publishable key, plus server-only credentials used by the admin client.

The audit found privileged Supabase service-role/secret/JWT keys and direct Postgres credentials on Preview and Development. Their nonproduction targets have now been removed and verified absent; Production targets were preserved. The local Development mirror is set to `demo` and also has no privileged Supabase/Postgres entries. Public URL and publishable/anon keys remain in nonproduction; these are not privileged keys, and demo mode does not use them.

Important: deleting Vercel targets only affects new deployments; it does not revoke credentials or remove values from already-built deployments. The Vercel CLI explicitly warned that the credentials themselves must be rotated/revoked at their providers. No production credential rotation was performed, because it can affect live auth/database access. Treat any prior Preview deployment that had these values as potentially holding them; complete a coordinated provider-side rotation and Production configuration update before relying on those old deployments.

## Configure Vercel safely

1. In the verified `medicare` project, open **Settings → Environment Variables**. Confirm `HMS_DATA_MODE=supabase` is Production-only and `HMS_DATA_MODE=demo` is set for Preview and Development; these mode values are already correct.
2. Confirm `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET`, and every `POSTGRES_*` variable are Production-only. The Preview and Development targets for these credentials have already been removed. Public Supabase URL and publishable/anon keys are not privileged; demo mode does not use them.
3. Confirm Production points to Supabase project `pxsgqfgrokblrsyjsypt` and retains the URL, publishable key, and server-only credentials required by the application. Keep service-role/secret keys server-only; never use a `NEXT_PUBLIC_` name for them. Do not paste values into chat or source control.
4. If rotating provider credentials, coordinate the rotation with the Production configuration and a later approved Production deployment. Do not revoke a key still needed by the running Production deployment without a tested cutover plan.

## Safe verification and redeployment

1. Treat Preview deployments created before the credential cleanup as potentially containing the old environment snapshot. Rotate/revoke those provider credentials under a coordinated cutover before trusting old deployments; no rotation is performed by this change.
2. Review the pull request and allow only the normal Preview deployment. Confirm it uses `demo`, shows the **Demo Mode** indicator, displays synthetic sample records, and has no clinical or staff-management mutation path.
3. Confirm Production environment variable names/scopes without copying values. Verify `HMS_DATA_MODE=supabase` and the intended live Supabase configuration.
4. Do not merge or deploy Production automatically. After a separate explicit approval and code review, merge through the normal process, then manually create a new Production deployment from the approved main commit. Do not promote a demo-configured Preview build as a Production build.
5. Verify Production sign-in using an existing authorized staff account. Confirm the displayed name and role come from the authenticated staff profile, the staff directory is permission-gated, and clinical modules remain unavailable. No Supabase schema migration, invitation creation, or Super Administrator account change is part of this change.

No Production deployment or merge is started by this change. Pushing the review branch may trigger the project&apos;s usual Preview deployment.
