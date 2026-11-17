# Database schema (proposed)

This document describes the target foundation. It is not an applied migration and must not be treated as an operational schema. Before any DDL, inspect the connected Supabase project through its MCP to detect existing objects and policies; the schema inspection currently errors.

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

Use UUID primary keys, FK constraints, unique facility-scoped identifiers, checks for valid statuses and nonnegative money, indexes on foreign keys and common facility/status/search columns, and consistent `created_at`/`updated_at` handling. Enable RLS on every operational table and grant only required operations. Exact DDL and policy review are pending live-schema discovery.
