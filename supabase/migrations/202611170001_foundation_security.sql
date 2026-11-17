begin;

create sequence if not exists public.patient_mrn_seq;

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{2,24}$'),
  name text not null,
  address text,
  city text,
  region text,
  country text not null default 'Sierra Leone',
  phone text,
  email text,
  default_currency char(3) not null default 'SLE' check (default_currency ~ '^[A-Z]{3}$'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete restrict,
  code text not null,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (facility_id, code),
  unique (facility_id, name),
  unique (facility_id, id)
);

create table public.staff_profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  employee_number text not null unique,
  first_name text not null,
  middle_name text,
  last_name text not null,
  phone text,
  email text not null unique,
  department_id uuid references public.departments(id) on delete set null,
  job_title text,
  professional_license_number text,
  status text not null default 'active' check (status in ('active', 'suspended', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_facilities (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  facility_id uuid not null references public.facilities(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (staff_id, facility_id)
);
create unique index staff_facilities_one_primary_per_staff
  on public.staff_facilities (staff_id) where is_primary;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z][a-z0-9_]*$'),
  name text not null unique,
  description text,
  is_system_role boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z][a-z0-9_.]*$'),
  description text not null,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  facility_id uuid references public.facilities(id) on delete restrict,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now()
);
create unique index staff_roles_unique_assignment
  on public.staff_roles (staff_id, role_id, coalesce(facility_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index staff_roles_staff_facility_idx on public.staff_roles (staff_id, facility_id);

create or replace function public.validate_staff_role_scope()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.facility_id is null and not exists (
    select 1 from public.roles r where r.id = new.role_id and r.code = 'super_administrator'
  ) then
    raise exception using errcode = '23514', message = 'Invalid role scope.';
  end if;
  return new;
end;
$$;

create trigger staff_roles_validate_scope
before insert or update on public.staff_roles
for each row execute function public.validate_staff_role_scope();

create or replace function public.generate_patient_mrn()
returns text
language sql
volatile
security definer
set search_path = ''
as $$
  select 'CGC-' || pg_catalog.to_char(pg_catalog.now() at time zone 'UTC', 'YY') || '-' ||
         pg_catalog.lpad(pg_catalog.nextval('public.patient_mrn_seq'::regclass)::text, 8, '0');
$$;

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete restrict,
  mrn text not null unique default public.generate_patient_mrn(),
  first_name text not null,
  middle_name text,
  last_name text not null,
  date_of_birth date,
  date_of_birth_estimated boolean not null default false,
  gender text not null default 'unknown' check (gender in ('female', 'male', 'other', 'unknown')),
  phone_primary text,
  phone_secondary text,
  email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  country text not null default 'Sierra Leone',
  status text not null default 'active' check (status in ('active', 'inactive', 'deceased')),
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (facility_id, mrn),
  unique (facility_id, id)
);

create table public.patient_identifiers (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  identifier_type text not null check (identifier_type in ('national_id', 'passport', 'insurance', 'legacy_folder', 'other')),
  identifier_value text not null,
  issued_by text,
  created_at timestamptz not null default now(),
  unique (identifier_type, identifier_value)
);

create table public.patient_contacts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  contact_type text not null default 'emergency' check (contact_type in ('emergency', 'next_of_kin', 'guardian', 'other')),
  full_name text not null,
  relationship text,
  phone text not null,
  address text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index patient_contacts_one_primary_per_patient
  on public.patient_contacts (patient_id) where is_primary;

create table public.patient_allergies (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  allergen text not null,
  reaction text,
  severity text not null default 'unknown' check (severity in ('mild', 'moderate', 'severe', 'unknown')),
  status text not null default 'active' check (status in ('active', 'resolved', 'entered_in_error')),
  recorded_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  recorded_at timestamptz not null default now(),
  unique (patient_id, allergen)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  facility_id uuid references public.facilities(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index departments_facility_active_idx on public.departments (facility_id, is_active, name);
create index staff_profiles_status_name_idx on public.staff_profiles (status, last_name, first_name);
create index staff_facilities_facility_staff_idx on public.staff_facilities (facility_id, staff_id);
create index patients_facility_name_idx on public.patients (facility_id, last_name, first_name);
create index patients_facility_phone_idx on public.patients (facility_id, phone_primary) where phone_primary is not null;
create index patient_identifiers_patient_idx on public.patient_identifiers (patient_id);
create index patient_contacts_patient_idx on public.patient_contacts (patient_id);
create index patient_allergies_patient_status_idx on public.patient_allergies (patient_id, status);
create index audit_logs_facility_created_idx on public.audit_logs (facility_id, created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create trigger facilities_set_updated_at before update on public.facilities
for each row execute function public.set_updated_at();
create trigger departments_set_updated_at before update on public.departments
for each row execute function public.set_updated_at();
create trigger staff_profiles_set_updated_at before update on public.staff_profiles
for each row execute function public.set_updated_at();
create trigger patients_set_updated_at before update on public.patients
for each row execute function public.set_updated_at();

create or replace function public.has_facility_access(p_facility_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and exists (
      select 1 from public.staff_profiles sp
      where sp.id = auth.uid() and sp.status = 'active'
    )
    and (
      exists (
        select 1 from public.staff_facilities sf
        where sf.staff_id = auth.uid() and sf.facility_id = p_facility_id
      )
      or exists (
        select 1 from public.staff_roles sr
        join public.roles r on r.id = sr.role_id
        where sr.staff_id = auth.uid() and sr.facility_id is null and r.code = 'super_administrator'
      )
    );
$$;

create or replace function public.has_permission(p_permission_code text, p_facility_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.staff_profiles sp
      join public.staff_roles sr on sr.staff_id = sp.id
      join public.roles r on r.id = sr.role_id
      join public.role_permissions rp on rp.role_id = r.id
      join public.permissions p on p.id = rp.permission_id
      where sp.id = auth.uid()
        and sp.status = 'active'
        and p.code = p_permission_code
        and (
          (sr.facility_id = p_facility_id and public.has_facility_access(p_facility_id))
          or (sr.facility_id is null and r.code = 'super_administrator')
        )
    );
$$;

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_json jsonb;
  previous_json jsonb;
  changed_keys text[];
  target_id uuid;
  target_facility_id uuid;
begin
  if tg_op = 'DELETE' then
    row_json := pg_catalog.to_jsonb(old);
    target_id := (row_json ->> 'id')::uuid;
  else
    row_json := pg_catalog.to_jsonb(new);
    target_id := (row_json ->> 'id')::uuid;
  end if;
  if tg_op = 'UPDATE' then
    previous_json := pg_catalog.to_jsonb(old);
    select coalesce(pg_catalog.array_agg(k.key order by k.key), array[]::text[])
      into changed_keys
      from pg_catalog.jsonb_each(row_json) as k(key, value)
      where previous_json -> k.key is distinct from row_json -> k.key
        and k.key not in ('updated_at');
  elsif tg_op = 'INSERT' then
    select coalesce(pg_catalog.array_agg(k.key order by k.key), array[]::text[])
      into changed_keys
      from pg_catalog.jsonb_each(row_json) as k(key, value)
      where k.key not in ('created_at', 'updated_at');
  else
    changed_keys := array[]::text[];
  end if;

  if row_json ? 'facility_id' then
    target_facility_id := nullif(row_json ->> 'facility_id', '')::uuid;
  elsif row_json ? 'patient_id' then
    select p.facility_id into target_facility_id
      from public.patients p where p.id = (row_json ->> 'patient_id')::uuid;
  elsif tg_table_name = 'staff_profiles' then
    select sf.facility_id into target_facility_id
      from public.staff_facilities sf where sf.staff_id = target_id and sf.is_primary
      limit 1;
  end if;

  insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    target_facility_id,
    pg_catalog.lower(tg_op),
    tg_table_name,
    target_id,
    pg_catalog.jsonb_build_object('changed_fields', changed_keys)
  );
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger patients_audit_row_change after insert or update on public.patients
for each row execute function public.audit_row_change();
create trigger staff_profiles_audit_row_change after insert or update on public.staff_profiles
for each row execute function public.audit_row_change();
create trigger patient_identifiers_audit_row_change after insert on public.patient_identifiers
for each row execute function public.audit_row_change();
create trigger patient_allergies_audit_row_change after insert on public.patient_allergies
for each row execute function public.audit_row_change();
create trigger staff_roles_audit_row_change after insert or delete on public.staff_roles
for each row execute function public.audit_row_change();

insert into public.facilities (code, name, address, city, region, country, default_currency)
values ('CGC-FRE', 'City Garden Clinic', null, 'Freetown', 'Western Area', 'Sierra Leone', 'SLE')
on conflict (code) do nothing;

insert into public.roles (code, name, description) values
  ('super_administrator', 'Super Administrator', 'Cross-facility system access and emergency administration.'),
  ('hospital_administrator', 'Hospital Administrator', 'Facility operations and staff administration without unrestricted clinical access.'),
  ('receptionist', 'Receptionist', 'Patient registration and front-desk demographic workflows.'),
  ('records_officer', 'Records Officer', 'Patient identifiers and records administration.'),
  ('doctor', 'Doctor', 'Clinical access to demographics and allergy safety information.'),
  ('nurse', 'Nurse', 'Care-team access to demographics and allergy safety information.'),
  ('laboratory_technician', 'Laboratory Technician', 'Limited patient demographics for laboratory workflows.'),
  ('pharmacist', 'Pharmacist', 'Limited patient demographics and allergy safety information for dispensing.'),
  ('cashier', 'Cashier', 'Billing workflows; no patient registry or clinical-record access.'),
  ('accountant', 'Accountant', 'Financial administration; no patient registry or clinical-record access.')
on conflict (code) do nothing;

insert into public.permissions (code, description) values
  ('facilities.read', 'View assigned facilities.'),
  ('facilities.manage', 'Manage facility configuration.'),
  ('departments.read', 'View departments in assigned facilities.'),
  ('departments.manage', 'Manage departments in assigned facilities.'),
  ('staff.read', 'View staff profiles and assignments.'),
  ('staff.invite', 'Invite staff to the hospital.'),
  ('staff.update', 'Update staff profile and status.'),
  ('staff.roles.assign', 'Assign and remove staff roles.'),
  ('patients.read_demographics', 'View patient demographic records.'),
  ('patients.register', 'Register patients.'),
  ('patients.update_demographics', 'Update patient demographics.'),
  ('patients.identifiers.read', 'View patient identifiers.'),
  ('patients.identifiers.manage', 'Add and update patient identifiers.'),
  ('patients.contacts.manage', 'Manage patient contacts.'),
  ('patients.allergies.read', 'View patient allergy safety information.'),
  ('patients.allergies.record', 'Record patient allergy information.'),
  ('audit.read', 'Read audit events for assigned facilities.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.code = 'super_administrator'
on conflict do nothing;

with role_grants(role_code, permission_code) as (
  values
    ('hospital_administrator', 'facilities.read'),
    ('hospital_administrator', 'facilities.manage'),
    ('hospital_administrator', 'departments.read'),
    ('hospital_administrator', 'departments.manage'),
    ('hospital_administrator', 'staff.read'),
    ('hospital_administrator', 'staff.invite'),
    ('hospital_administrator', 'staff.update'),
    ('hospital_administrator', 'staff.roles.assign'),
    ('hospital_administrator', 'patients.read_demographics'),
    ('hospital_administrator', 'patients.register'),
    ('hospital_administrator', 'patients.update_demographics'),
    ('hospital_administrator', 'patients.identifiers.read'),
    ('hospital_administrator', 'patients.identifiers.manage'),
    ('hospital_administrator', 'patients.contacts.manage'),
    ('hospital_administrator', 'audit.read'),
    ('receptionist', 'facilities.read'),
    ('receptionist', 'departments.read'),
    ('receptionist', 'patients.read_demographics'),
    ('receptionist', 'patients.register'),
    ('receptionist', 'patients.update_demographics'),
    ('receptionist', 'patients.identifiers.read'),
    ('receptionist', 'patients.contacts.manage'),
    ('records_officer', 'facilities.read'),
    ('records_officer', 'departments.read'),
    ('records_officer', 'patients.read_demographics'),
    ('records_officer', 'patients.update_demographics'),
    ('records_officer', 'patients.identifiers.read'),
    ('records_officer', 'patients.identifiers.manage'),
    ('records_officer', 'audit.read'),
    ('doctor', 'facilities.read'),
    ('doctor', 'departments.read'),
    ('doctor', 'patients.read_demographics'),
    ('doctor', 'patients.allergies.read'),
    ('doctor', 'patients.allergies.record'),
    ('nurse', 'facilities.read'),
    ('nurse', 'departments.read'),
    ('nurse', 'patients.read_demographics'),
    ('nurse', 'patients.allergies.read'),
    ('nurse', 'patients.allergies.record'),
    ('laboratory_technician', 'facilities.read'),
    ('laboratory_technician', 'departments.read'),
    ('laboratory_technician', 'patients.read_demographics'),
    ('pharmacist', 'facilities.read'),
    ('pharmacist', 'departments.read'),
    ('pharmacist', 'patients.read_demographics'),
    ('pharmacist', 'patients.allergies.read')
)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from role_grants rg
join public.roles r on r.code = rg.role_code
join public.permissions p on p.code = rg.permission_code
on conflict do nothing;

create or replace function public.bootstrap_first_super_administrator(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
  v_role_id uuid;
  v_facility_id uuid;
begin
  perform pg_catalog.pg_advisory_xact_lock(7419201, 1);

  if coalesce(pg_catalog.current_setting('request.jwt.claim.role', true), '') <> 'service_role' then
    raise exception using errcode = '42501', message = 'Operation not permitted.';
  end if;

  if exists (
    select 1 from public.staff_roles sr
    join public.roles r on r.id = sr.role_id
    where r.code = 'super_administrator'
  ) then
    raise exception using errcode = '42501', message = 'Initial administrator setup has already been completed.';
  end if;

  select u.email into v_email
  from auth.users u
  where u.id = p_user_id and u.email_confirmed_at is not null;

  if v_email is null then
    raise exception using errcode = '42501', message = 'A verified invited account is required.';
  end if;

  select f.id into v_facility_id from public.facilities f where f.code = 'CGC-FRE' and f.is_active;
  select r.id into v_role_id from public.roles r where r.code = 'super_administrator';

  insert into public.staff_profiles (id, employee_number, first_name, last_name, email, status)
  values (
    p_user_id,
    'ADM-' || pg_catalog.upper(pg_catalog.substr(pg_catalog.replace(p_user_id::text, '-', ''), 1, 10)),
    coalesce((select u.raw_user_meta_data ->> 'first_name' from auth.users u where u.id = p_user_id), 'Initial'),
    coalesce((select u.raw_user_meta_data ->> 'last_name' from auth.users u where u.id = p_user_id), 'Administrator'),
    v_email,
    'active'
  );
  insert into public.staff_facilities (staff_id, facility_id, is_primary)
  values (p_user_id, v_facility_id, true);
  insert into public.staff_roles (staff_id, role_id, facility_id, assigned_by)
  values (p_user_id, v_role_id, null, p_user_id);

  insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
  values (p_user_id, v_facility_id, 'bootstrap', 'staff_profile', p_user_id,
          pg_catalog.jsonb_build_object('role_code', 'super_administrator'));

  return p_user_id;
end;
$$;

alter table public.facilities enable row level security;
alter table public.departments enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.staff_facilities enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.staff_roles enable row level security;
alter table public.patients enable row level security;
alter table public.patient_identifiers enable row level security;
alter table public.patient_contacts enable row level security;
alter table public.patient_allergies enable row level security;
alter table public.audit_logs enable row level security;

create policy facilities_select_assigned on public.facilities for select to authenticated
  using (public.has_facility_access(id));
create policy facilities_update_admin on public.facilities for update to authenticated
  using (public.has_permission('facilities.manage', id))
  with check (public.has_permission('facilities.manage', id));
create policy departments_select_assigned on public.departments for select to authenticated
  using (public.has_facility_access(facility_id));
create policy departments_manage_admin on public.departments for all to authenticated
  using (public.has_permission('departments.manage', facility_id))
  with check (public.has_permission('departments.manage', facility_id));

create policy staff_profiles_select_self_or_admin on public.staff_profiles for select to authenticated
  using (
    id = auth.uid()
    or exists (
      select 1 from public.staff_facilities sf
      where sf.staff_id = staff_profiles.id
        and public.has_permission('staff.read', sf.facility_id)
    )
  );
create policy staff_facilities_select_self_or_admin on public.staff_facilities for select to authenticated
  using (staff_id = auth.uid() or public.has_permission('staff.read', facility_id));
create policy roles_select_active_staff on public.roles for select to authenticated
  using (exists (select 1 from public.staff_profiles sp where sp.id = auth.uid() and sp.status = 'active'));
create policy permissions_select_active_staff on public.permissions for select to authenticated
  using (exists (select 1 from public.staff_profiles sp where sp.id = auth.uid() and sp.status = 'active'));
create policy role_permissions_select_active_staff on public.role_permissions for select to authenticated
  using (exists (select 1 from public.staff_profiles sp where sp.id = auth.uid() and sp.status = 'active'));
create policy staff_roles_select_self_or_admin on public.staff_roles for select to authenticated
  using (
    staff_id = auth.uid()
    or (facility_id is not null and public.has_permission('staff.read', facility_id))
    or (facility_id is null and public.has_permission('staff.roles.assign', (select f.id from public.facilities f where f.code = 'CGC-FRE' limit 1)))
  );

create policy patients_select_authorized on public.patients for select to authenticated
  using (
    public.has_permission('patients.read_demographics', facility_id)
    or public.has_permission('patients.register', facility_id)
    or public.has_permission('patients.update_demographics', facility_id)
  );
create policy patients_insert_authorized on public.patients for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.has_permission('patients.register', facility_id)
  );
create policy patients_update_authorized on public.patients for update to authenticated
  using (public.has_permission('patients.update_demographics', facility_id))
  with check (public.has_permission('patients.update_demographics', facility_id));

create policy patient_identifiers_select_authorized on public.patient_identifiers for select to authenticated
  using (
    exists (
      select 1 from public.patients p
      where p.id = patient_identifiers.patient_id
        and (public.has_permission('patients.identifiers.read', p.facility_id)
          or public.has_permission('patients.identifiers.manage', p.facility_id))
    )
  );
create policy patient_identifiers_insert_authorized on public.patient_identifiers for insert to authenticated
  with check (
    exists (
      select 1 from public.patients p
      where p.id = patient_identifiers.patient_id
        and public.has_permission('patients.identifiers.manage', p.facility_id)
    )
  );
create policy patient_contacts_select_authorized on public.patient_contacts for select to authenticated
  using (
    exists (select 1 from public.patients p where p.id = patient_contacts.patient_id
      and (public.has_permission('patients.read_demographics', p.facility_id)
        or public.has_permission('patients.contacts.manage', p.facility_id)))
  );
create policy patient_contacts_manage_authorized on public.patient_contacts for all to authenticated
  using (
    exists (select 1 from public.patients p where p.id = patient_contacts.patient_id
      and public.has_permission('patients.contacts.manage', p.facility_id))
  )
  with check (
    exists (select 1 from public.patients p where p.id = patient_contacts.patient_id
      and public.has_permission('patients.contacts.manage', p.facility_id))
  );
create policy patient_allergies_select_authorized on public.patient_allergies for select to authenticated
  using (
    exists (select 1 from public.patients p where p.id = patient_allergies.patient_id
      and public.has_permission('patients.allergies.read', p.facility_id))
  );
create policy patient_allergies_insert_authorized on public.patient_allergies for insert to authenticated
  with check (
    recorded_by = auth.uid()
    and exists (select 1 from public.patients p where p.id = patient_allergies.patient_id
      and public.has_permission('patients.allergies.record', p.facility_id))
  );
create policy audit_logs_select_authorized on public.audit_logs for select to authenticated
  using (facility_id is not null and public.has_permission('audit.read', facility_id));

revoke all on all tables in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from public, anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant usage on schema public to authenticated, service_role;
grant select on public.facilities, public.departments, public.staff_profiles, public.staff_facilities,
  public.roles, public.permissions, public.role_permissions, public.staff_roles,
  public.patients, public.patient_identifiers, public.patient_contacts, public.patient_allergies,
  public.audit_logs to authenticated;
grant update (name, address, city, region, country, phone, email, default_currency, is_active)
  on public.facilities to authenticated;
grant insert (facility_id, code, name, description, is_active),
  update (code, name, description, is_active) on public.departments to authenticated;
grant insert (facility_id, first_name, middle_name, last_name, date_of_birth, date_of_birth_estimated,
  gender, phone_primary, phone_secondary, email, address_line_1, address_line_2, city, region, country, status)
  on public.patients to authenticated;
grant update (first_name, middle_name, last_name, date_of_birth, date_of_birth_estimated,
  gender, phone_primary, phone_secondary, email, address_line_1, address_line_2, city, region, country, status)
  on public.patients to authenticated;
grant insert (patient_id, identifier_type, identifier_value, issued_by) on public.patient_identifiers to authenticated;
grant insert (patient_id, contact_type, full_name, relationship, phone, address, is_primary),
  update (contact_type, full_name, relationship, phone, address, is_primary) on public.patient_contacts to authenticated;
grant insert (patient_id, allergen, reaction, severity, status) on public.patient_allergies to authenticated;

grant all on all tables in schema public to service_role;
grant usage, select on sequence public.patient_mrn_seq to service_role;
revoke all on sequence public.patient_mrn_seq from public, anon, authenticated;
grant execute on function public.has_facility_access(uuid), public.has_permission(text, uuid) to authenticated;
grant execute on function public.generate_patient_mrn() to authenticated, service_role;
grant execute on function public.bootstrap_first_super_administrator(uuid) to service_role;

commit;
