# City Garden Clinic Hospital Management System

An existing Next.js 16 application for City Garden Clinic. The approved HMS frontend remains available in read-only demo mode while database schema, authentication, and authorization are prepared.

## Modes

- **Demo mode** (`HMS_DATA_MODE=demo`, the default): synthetic sample records from `lib/data.ts`; service-layer writes are rejected and no patient data is persisted.
- **Supabase mode** (`HMS_DATA_MODE=supabase`): reserved for the protected database-backed services. Do not enable until the migration, Row Level Security (RLS), and staff authentication have been installed and verified. Requests fail closed rather than falling back to sample data.

## Requirements

- Node.js supported by Next.js 16
- pnpm (use the version in `package.json`/lockfile)

## Local development

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` if you want to configure a local instance. Keep `HMS_DATA_MODE=demo` unless the backend has been fully initialized.
3. Start the app with `pnpm dev`.
4. Run `pnpm typecheck` and `pnpm build` before submitting changes.

Supabase clients read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Never place a service-role/secret key in browser code or commit credentials. The connected Vercel integration injects values in the hosted project; credentials alone do not mean schema, RLS, or auth workflows are ready.

## Project layout

- `app/` — App Router pages and routes
- `components/hms/` — reusable HMS components
- `lib/data.ts` — synthetic demo fixtures
- `lib/services/` — typed access layer; demo reads and explicit unavailable-backend results
- `lib/supabase/` — SSR/browser client setup
- `lib/permissions/` — permission codes and presentation helper
- `lib/validators.ts` — Zod input validation
- `docs/` — architecture, proposed schema, permissions, and implementation status
- `supabase/migrations/` — database migrations (pending Supabase MCP schema verification)
