# Backend integration plan

| Module | Planned tables | Current status |
| --- | --- | --- |
| Staff and access | `staff_profiles`, `staff_facilities`, `roles`, `permissions`, `role_permissions`, `staff_roles` | Types, permission codes, and foundational RLS exist; invitations, role/facility administration, first-admin setup, MFA requirements, and account-based authorization tests remain pending |
| Patients | `patients`, `patient_identifiers`, `patient_contacts`, `patient_allergies`, `patient_registration_requests` | Live directory/search, authorized facility selection, profile demographics, and atomic/idempotent registration with optional contact/allergies are wired. Demographic edit, identifier/contact/allergy management screens, richer duplicate matching, and account-tested audit/RLS behavior remain pending |
| Appointments and queue | `appointments`, `queue_entries` | Domain types prepared; existing screens still use demo fixtures |
| Consultations | `encounters`, `vital_signs`, `clinical_notes` | Demo encounter history remains; no clinical writes |
| Laboratory | `lab_orders`, `lab_results` | Existing demo workflow only |
| Pharmacy | `prescriptions`, `dispenses`, `medication_stock` | Existing demo workflow only |
| Billing | `invoices`, `payments` | Existing demo workflow only; no payment integrations |
| Admissions | `admissions`, `wards`, `beds` | Existing demo workflow only |
| Record migration | `record_migrations`, `migration_documents` | Existing prototype only; no OCR or document storage integration |
| Audit | `audit_logs` | Display sample exists; no secure audit writer |

## Enablement sequence

1. Initial live Supabase schema, key grants, policies, security-definer RPCs, and security/performance advisor findings have been inspected; continue the review as features are added.
2. Agree on facility and staff provisioning policy, approved role matrix, and privacy rules; verify public Auth signup is disabled and document the MFA requirement.
3. Incremental patient-registry hardening and idempotency migrations were applied through MCP and are tracked in `supabase/migrations/`.
4. Provision approved synthetic staff identities, then test RLS as unauthenticated, receptionist, clinician, lab, pharmacy, billing, and facility administrator identities.
5. Implement server-side invitation, account provisioning, first-admin bootstrap operation, role/facility changes, and audit verification.
6. Complete patient demographic updates, identifiers, and contact/allergy management; test idempotent creation and audit events with synthetic accounts.
7. Migrate remaining clinical modules one at a time; never silently fall back to mock records after a backend failure.
