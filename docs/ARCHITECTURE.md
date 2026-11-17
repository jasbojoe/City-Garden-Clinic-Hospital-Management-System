# Architecture

## Current application

The frontend is a Next.js 16 App Router application with React 19, TypeScript, Tailwind CSS, and the existing shadcn/Base UI component set. Existing routes, navigation, patient profiles, and clinical workflow screens remain intact.

## Data modes

`lib/data.ts` remains the synthetic demo fixture source. `lib/services/` exposes async-friendly typed accessors. `HMS_DATA_MODE=demo` is the default and permits sample-data reads only. `HMS_DATA_MODE=supabase` returns an explicit backend-not-ready error until migrations and RLS are installed; it never silently serves mock data after a backend failure.

The Supabase browser and server clients use `@supabase/ssr`, the public publishable/anon key, and cookie-backed sessions. No service-role key is used by the application. Zod schemas are in `lib/validators.ts`; shared domain types are in `lib/hms-domain.ts`.

## Security boundaries

Client permission helpers are presentation-only. Authorization must be enforced on the server and in PostgreSQL RLS. Authenticated staff must be linked to an active staff profile and explicitly granted access to a facility before patient data can be read. Until that database and auth layer is installed, the product must remain in demo mode.

## Planned data flow

App Router server action/route handler → authentication and permission resolution → validated service operation → Supabase Postgres with RLS → database-controlled audit event. Clinical workflows will be encounter-centered; patient registry data will remain distinct from clinical notes, orders, and billing records.
