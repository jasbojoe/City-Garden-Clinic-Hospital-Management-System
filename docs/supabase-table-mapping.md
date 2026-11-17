# City Garden Clinic Supabase table mapping

This project currently uses local demo data. The mapping below is the recommended production schema when Supabase is connected.

## Core tables

- `profiles`: `id`, `full_name`, `role`, `phone`, `department_id`, `created_at`
- `patients`: `id`, `mrn`, `full_name`, `gender`, `date_of_birth`, `phone`, `email`, `blood_group`, `status`, `address`, `allergies`, `insurance_provider`, `emergency_contact`, `created_at`, `updated_at`
- `departments`: `id`, `name`, `code`, `active`
- `staff`: `id`, `profile_id`, `employee_number`, `job_title`, `department_id`, `status`, `phone`
- `appointments`: `id`, `patient_id`, `doctor_id`, `department_id`, `scheduled_at`, `type`, `status`, `notes`
- `encounters`: `id`, `patient_id`, `appointment_id`, `doctor_id`, `type`, `status`, `chief_complaint`, `diagnosis`, `notes`, `started_at`, `completed_at`
- `lab_orders`: `id`, `encounter_id`, `patient_id`, `ordered_by`, `test_name`, `priority`, `status`, `result`, `ordered_at`, `completed_at`
- `prescriptions`: `id`, `encounter_id`, `patient_id`, `prescribed_by`, `medicine_id`, `dosage`, `frequency`, `duration`, `status`
- `medicines`: `id`, `name`, `category`, `batch`, `stock`, `reorder_level`, `expiry_date`, `unit_price_sle`
- `invoices`: `id`, `patient_id`, `encounter_id`, `subtotal_sle`, `paid_sle`, `status`, `payment_method`, `issued_at`
- `migration_records`: `id`, `patient_id`, `folder_number`, `pages`, `department_id`, `category`, `assigned_to`, `date_scanned`, `status`, `ocr_payload`, `verified_by`, `verified_at`
- `audit_events`: `id`, `actor_id`, `entity`, `entity_id`, `action`, `summary`, `metadata`, `created_at`

## Security and relationships

- Enable RLS on every table.
- Scope patient, encounter, billing, and migration queries through the authenticated user's role and department.
- Keep `mrn` unique and immutable; use the internal UUID as the foreign-key value.
- Store QR payloads as signed, short-lived references to `patients.id` and never embed sensitive clinical notes in a QR code.
- Use database triggers for `updated_at` and append-only audit events for clinical and billing mutations.
- Store currency amounts as integer minor units or numeric `*_sle` fields; never infer conversion from display strings.
