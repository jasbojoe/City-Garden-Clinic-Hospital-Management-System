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

Use UUID primary keys, FK constraints, unique facility-scoped identifiers, checks for valid statuses and nonnegative money, indexes on foreign keys and common facility/status/search columns, and consistent `created_at`/`updated_at` handling. Enable RLS on every operational table and grant only required operations. Incremental migrations in `supabase/migrations/` add covering indexes for eight foreign keys and a permission-checked, transactional `register_patient` RPC that creates a patient and optional emergency contact together. Contact inserts are audited. These migrations were applied to the connected Supabase project. The remaining schema, constraints, role matrix, and RLS behavior still need a full account-based review.
