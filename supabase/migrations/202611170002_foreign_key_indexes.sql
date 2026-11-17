begin;

create index if not exists audit_logs_actor_user_idx on public.audit_logs (actor_user_id);
create index if not exists patient_allergies_recorded_by_idx on public.patient_allergies (recorded_by);
create index if not exists patients_created_by_idx on public.patients (created_by);
create index if not exists role_permissions_permission_idx on public.role_permissions (permission_id);
create index if not exists staff_profiles_department_idx on public.staff_profiles (department_id) where department_id is not null;
create index if not exists staff_roles_assigned_by_idx on public.staff_roles (assigned_by) where assigned_by is not null;
create index if not exists staff_roles_facility_idx on public.staff_roles (facility_id) where facility_id is not null;
create index if not exists staff_roles_role_idx on public.staff_roles (role_id);

commit;
