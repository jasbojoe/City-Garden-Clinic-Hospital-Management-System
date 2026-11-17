# Database schema (live foundation)

The connected Supabase project was inspected before applying incremental changes. The schema already contains facility, staff, authorization, patient registry, and audit tables, with RLS enabled on the inspected operational tables. Existing policies use facility access and permission predicates; policy behavior still requires testing with representative authenticated staff accounts. This file records observed foundations and must not be treated as a complete schema specification.

## Facility and department

- `facilities`: UUID PK, unique code, name, address/city/region/country, contact data, active flag, timestamps.
- `departments`: UUID PK, facility FK, facility-scoped unique code, name/description, active flag, timestamps.

## Staff and authorization

- `staff_profiles`: primary key references `auth.users(id)`, unique employee number/email, name, phone, department FK, title/license, status, timestamps.
- `staff_facilities`: staff/facility membership with one primary assignment per staff member.
- `roles`, `permissions`, `role_permissions`, `staff_roles`: normalized role grants scoped by facility. Role assignment must be restricted to authorized administrators.

## Patient registry

- `patients`: UUID PK, facility FK, facility-scoped unique MRN, demographics, contact/address fields, status, creator, timestamps. MRNs must be generated server/database-side from a concurrency-safe sequence and must not encode personal data.
- `patient_identifiers`: patient FK, identifier type/value and issuer; unique scoped values as required by hospital policy.
- `patient_contacts`: patient FK and emergency/contact relationship fields.
- `patient_allergies`: patient FK, allergen/reaction/severity/status and recorder.

## Future encounter-centered clinical data

Appointments, queue entries, encounters, vital-sign observations, clinical notes, lab orders/results, prescriptions, invoices, and payments should be separate relational tables keyed by patient, facility, and encounter. Finalized clinical notes should be immutable or amended through an auditable addendum workflow. No diagnosis or prescription automation is in scope.

## Audit

`audit_logs` records actor, facility, action, entity type/id, minimal metadata, and server timestamp. Inserts must be database/server controlled; users cannot update or delete audit events. Avoid putting clinical content or unnecessary PII in metadata.

## Required constraints and indexes

Use UUID primary keys, FK constraints, unique facility-scoped identifiers, checks for valid statuses and nonnegative money, indexes on foreign keys and common facility/status/search columns, and consistent `created_at`/`updated_at` handling. The observed `facilities.default_currency` is `character(3)` with default `SLE`.

Applied incremental migrations add foreign-key indexes and harden patient registration. Authenticated users cannot directly insert into `patients` or execute the MRN generator; the default MRN column expression was removed. The `register_patient` security-definer RPC uses an empty `search_path`, checks the authenticated staff member's `patients.register` permission, generates an MRN, and atomically inserts the patient, optional emergency contact, and allergy rows. The private, RLS-enabled `patient_registration_requests` table records `(actor_user_id, request_id) -> patient_id` for safe retries and has no API-role policies or grants.

`202611170006_patient_management.sql` adds permission-checked security-definer RPCs for demographic edits, patient identifier create/update, contact create/update, and allergy create/update. Each RPC verifies the patient's facility permission before writing. Audit triggers cover inserts and updates to identifiers and allergies, plus insert/update/delete for contacts. Ordinary API users still cannot write audit rows; no update/delete grants or policies are defined for `audit_logs`.

`202611170007_bootstrap_null_guard.sql` tightens the one-time bootstrap: it now requires a verified account with `raw_app_meta_data.cgc_initial_admin_authorized = true`, removes that one-time flag on success, checks the first-admin invariant under an advisory transaction lock, and remains executable only by `service_role`. These migrations were applied through the Supabase MCP. Schema/application migrations are installed, but account-level RLS behavior and audit event rows still require approved synthetic test accounts.
