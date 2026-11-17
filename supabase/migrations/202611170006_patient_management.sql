begin;

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
  v_app_metadata jsonb;
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

  select u.email, u.raw_app_meta_data into v_email, v_app_metadata
  from auth.users u
  where u.id = p_user_id and u.email_confirmed_at is not null;

  if v_email is null or v_app_metadata ->> 'cgc_initial_admin_authorized' <> 'true' then
    raise exception using errcode = '42501', message = 'An explicitly authorized, verified account is required.';
  end if;

  select f.id into v_facility_id from public.facilities f where f.code = 'CGC-FRE' and f.is_active;
  select r.id into v_role_id from public.roles r where r.code = 'super_administrator';
  if v_facility_id is null or v_role_id is null then
    raise exception using errcode = '23514', message = 'Initial facility or system role is unavailable.';
  end if;

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

  update auth.users
  set raw_app_meta_data = raw_app_meta_data - 'cgc_initial_admin_authorized'
  where id = p_user_id;

  return p_user_id;
end;
$$;

create or replace function public.update_patient_demographics(p_patient_id uuid, p_changes jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_id uuid;
begin
  select p.facility_id into v_facility_id from public.patients p where p.id = p_patient_id;
  if v_facility_id is null or not public.has_permission('patients.update_demographics', v_facility_id) then
    raise exception using errcode = '42501', message = 'Patient update is not permitted.';
  end if;
  if p_changes is null or pg_catalog.jsonb_typeof(p_changes) <> 'object'
    or exists (select 1 from pg_catalog.jsonb_object_keys(p_changes) k
      where k not in ('first_name','middle_name','last_name','date_of_birth','date_of_birth_estimated','gender','phone_primary','phone_secondary','email','address_line_1','address_line_2','city','region','country')) then
    raise exception using errcode = '22023', message = 'Patient demographic fields are invalid.';
  end if;
  if nullif(pg_catalog.btrim(p_changes ->> 'first_name'), '') is null and p_changes ? 'first_name'
    or nullif(pg_catalog.btrim(p_changes ->> 'last_name'), '') is null and p_changes ? 'last_name' then
    raise exception using errcode = '22023', message = 'Patient first and last name are required.';
  end if;

  update public.patients p set
    first_name = case when p_changes ? 'first_name' then pg_catalog.btrim(p_changes ->> 'first_name') else p.first_name end,
    middle_name = case when p_changes ? 'middle_name' then nullif(pg_catalog.btrim(p_changes ->> 'middle_name'), '') else p.middle_name end,
    last_name = case when p_changes ? 'last_name' then pg_catalog.btrim(p_changes ->> 'last_name') else p.last_name end,
    date_of_birth = case when p_changes ? 'date_of_birth' then nullif(p_changes ->> 'date_of_birth', '')::date else p.date_of_birth end,
    date_of_birth_estimated = case when p_changes ? 'date_of_birth_estimated' then (p_changes ->> 'date_of_birth_estimated')::boolean else p.date_of_birth_estimated end,
    gender = case when p_changes ? 'gender' then coalesce(nullif(pg_catalog.lower(p_changes ->> 'gender'), ''), 'unknown') else p.gender end,
    phone_primary = case when p_changes ? 'phone_primary' then nullif(pg_catalog.btrim(p_changes ->> 'phone_primary'), '') else p.phone_primary end,
    phone_secondary = case when p_changes ? 'phone_secondary' then nullif(pg_catalog.btrim(p_changes ->> 'phone_secondary'), '') else p.phone_secondary end,
    email = case when p_changes ? 'email' then nullif(pg_catalog.btrim(p_changes ->> 'email'), '') else p.email end,
    address_line_1 = case when p_changes ? 'address_line_1' then nullif(pg_catalog.btrim(p_changes ->> 'address_line_1'), '') else p.address_line_1 end,
    address_line_2 = case when p_changes ? 'address_line_2' then nullif(pg_catalog.btrim(p_changes ->> 'address_line_2'), '') else p.address_line_2 end,
    city = case when p_changes ? 'city' then nullif(pg_catalog.btrim(p_changes ->> 'city'), '') else p.city end,
    region = case when p_changes ? 'region' then nullif(pg_catalog.btrim(p_changes ->> 'region'), '') else p.region end,
    country = case when p_changes ? 'country' then coalesce(nullif(pg_catalog.btrim(p_changes ->> 'country'), ''), 'Sierra Leone') else p.country end
  where p.id = p_patient_id;
end;
$$;

create or replace function public.save_patient_identifier(
  p_patient_id uuid, p_identifier_id uuid, p_identifier_type text,
  p_identifier_value text, p_issued_by text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_id uuid;
  v_identifier_id uuid;
begin
  select p.facility_id into v_facility_id from public.patients p where p.id = p_patient_id;
  if v_facility_id is null or not public.has_permission('patients.identifiers.manage', v_facility_id) then
    raise exception using errcode = '42501', message = 'Patient identifier management is not permitted.';
  end if;
  if p_identifier_type not in ('national_id','passport','insurance','legacy_folder','other')
    or nullif(pg_catalog.btrim(p_identifier_value), '') is null then
    raise exception using errcode = '22023', message = 'Patient identifier details are invalid.';
  end if;
  if p_identifier_id is null then
    insert into public.patient_identifiers(patient_id, identifier_type, identifier_value, issued_by)
    values (p_patient_id, p_identifier_type, pg_catalog.btrim(p_identifier_value), nullif(pg_catalog.btrim(p_issued_by), ''))
    returning id into v_identifier_id;
  else
    update public.patient_identifiers i set
      identifier_type = p_identifier_type,
      identifier_value = pg_catalog.btrim(p_identifier_value),
      issued_by = nullif(pg_catalog.btrim(p_issued_by), '')
    where i.id = p_identifier_id and i.patient_id = p_patient_id returning i.id into v_identifier_id;
    if v_identifier_id is null then
      raise exception using errcode = '42501', message = 'Patient identifier update is not permitted.';
    end if;
  end if;
  return v_identifier_id;
end;
$$;

create or replace function public.save_patient_contact(
  p_patient_id uuid, p_contact_id uuid, p_contact_type text, p_full_name text,
  p_relationship text, p_phone text, p_address text, p_is_primary boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_id uuid;
  v_contact_id uuid;
begin
  select p.facility_id into v_facility_id from public.patients p where p.id = p_patient_id;
  if v_facility_id is null or not public.has_permission('patients.contacts.manage', v_facility_id) then
    raise exception using errcode = '42501', message = 'Patient contact management is not permitted.';
  end if;
  if p_contact_type not in ('emergency','next_of_kin','guardian','other')
    or nullif(pg_catalog.btrim(p_full_name), '') is null
    or nullif(pg_catalog.btrim(p_phone), '') is null then
    raise exception using errcode = '22023', message = 'Patient contact details are invalid.';
  end if;
  if p_contact_id is null then
    insert into public.patient_contacts(patient_id, contact_type, full_name, relationship, phone, address, is_primary)
    values (p_patient_id, p_contact_type, pg_catalog.btrim(p_full_name), nullif(pg_catalog.btrim(p_relationship), ''), pg_catalog.btrim(p_phone), nullif(pg_catalog.btrim(p_address), ''), coalesce(p_is_primary, false))
    returning id into v_contact_id;
  else
    update public.patient_contacts c set
      contact_type = p_contact_type, full_name = pg_catalog.btrim(p_full_name),
      relationship = nullif(pg_catalog.btrim(p_relationship), ''), phone = pg_catalog.btrim(p_phone),
      address = nullif(pg_catalog.btrim(p_address), ''), is_primary = coalesce(p_is_primary, false)
    where c.id = p_contact_id and c.patient_id = p_patient_id returning c.id into v_contact_id;
    if v_contact_id is null then
      raise exception using errcode = '42501', message = 'Patient contact update is not permitted.';
    end if;
  end if;
  return v_contact_id;
end;
$$;

create or replace function public.save_patient_allergy(
  p_patient_id uuid, p_allergy_id uuid, p_allergen text, p_reaction text,
  p_severity text, p_status text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_id uuid;
  v_allergy_id uuid;
begin
  select p.facility_id into v_facility_id from public.patients p where p.id = p_patient_id;
  if v_facility_id is null or not public.has_permission('patients.allergies.record', v_facility_id) then
    raise exception using errcode = '42501', message = 'Patient allergy management is not permitted.';
  end if;
  if nullif(pg_catalog.btrim(p_allergen), '') is null
    or p_severity not in ('mild','moderate','severe','unknown')
    or p_status not in ('active','resolved','entered_in_error') then
    raise exception using errcode = '22023', message = 'Patient allergy details are invalid.';
  end if;
  if p_allergy_id is null then
    insert into public.patient_allergies(patient_id, allergen, reaction, severity, status, recorded_by)
    values (p_patient_id, pg_catalog.btrim(p_allergen), nullif(pg_catalog.btrim(p_reaction), ''), p_severity, p_status, auth.uid())
    returning id into v_allergy_id;
  else
    update public.patient_allergies a set allergen = pg_catalog.btrim(p_allergen),
      reaction = nullif(pg_catalog.btrim(p_reaction), ''), severity = p_severity, status = p_status
    where a.id = p_allergy_id and a.patient_id = p_patient_id returning a.id into v_allergy_id;
    if v_allergy_id is null then
      raise exception using errcode = '42501', message = 'Patient allergy update is not permitted.';
    end if;
  end if;
  return v_allergy_id;
end;
$$;

create trigger patient_identifiers_audit_update
after update on public.patient_identifiers
for each row execute function public.audit_row_change();
drop trigger if exists patient_contacts_audit_row_change on public.patient_contacts;
create trigger patient_contacts_audit_change
after insert or update or delete on public.patient_contacts
for each row execute function public.audit_row_change();
create trigger patient_allergies_audit_update
after update on public.patient_allergies
for each row execute function public.audit_row_change();

revoke all on function public.bootstrap_first_super_administrator(uuid) from public, anon, authenticated;
revoke all on function public.update_patient_demographics(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.save_patient_identifier(uuid, uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.save_patient_contact(uuid, uuid, text, text, text, text, text, boolean) from public, anon, authenticated;
revoke all on function public.save_patient_allergy(uuid, uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.bootstrap_first_super_administrator(uuid) to service_role;
grant execute on function public.update_patient_demographics(uuid, jsonb) to authenticated;
grant execute on function public.save_patient_identifier(uuid, uuid, text, text, text) to authenticated;
grant execute on function public.save_patient_contact(uuid, uuid, text, text, text, text, text, boolean) to authenticated;
grant execute on function public.save_patient_allergy(uuid, uuid, text, text, text, text) to authenticated;

commit;
