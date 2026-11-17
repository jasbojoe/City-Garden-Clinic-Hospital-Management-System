# Backend integration plan

| Module | Planned tables | Current status |
| --- | --- | --- |
| Staff and access | `staff_profiles`, `staff_facilities`, `roles`, `permissions`, `role_permissions`, `staff_roles` | Types and permission codes prepared; no database or auth actions yet |
| Patients | `patients`, `patient_identifiers`, `patient_contacts`, `patient_allergies` | Live schema has a permission-checked transactional registration RPC for a patient and optional emergency contact; full application CRUD, duplicate detection, and account-tested audit behavior remain pending |
| Appointments and queue | `appointments`, `queue_entries` | Domain types prepared; existing screens still use demo fixtures |
| Consultations | `encounters`, `vital_signs`, `clinical_notes` | Demo encounter history remains; no clinical writes |
| Laboratory | `lab_orders`, `lab_results` | Existing demo workflow only |
| Pharmacy | `prescriptions`, `dispenses`, `medication_stock` | Existing demo workflow only |
| Billing | `invoices`, `payments` | Existing demo workflow only; no payment integrations |
| Admissions | `admissions`, `wards`, `beds` | Existing demo workflow only |
| Record migration | `record_migrations`, `migration_documents` | Existing prototype only; no OCR or document storage integration |
| Audit | `audit_logs` | Display sample exists; no secure audit writer |

## Enablement sequence

1. Inspect the connected Supabase project's existing tables, grants, policies, views, and security-definer functions through Supabase MCP.
2. Agree on facility and staff provisioning policy, approved role matrix, and privacy rules.
3. Apply reviewed migration(s) through the MCP and commit matching migration files to source control.
4. Test RLS as unauthenticated, receptionist, clinician, lab, pharmacy, billing, and facility administrator identities using synthetic records.
5. Implement server-side account provisioning/login/session checks and protected dashboard routes.
6. Integrate patient registry CRUD with server validation, authorization, idempotent submissions, and database-controlled audit events.
7. Migrate remaining clinical modules one at a time; never silently fall back to mock records after a backend failure.
