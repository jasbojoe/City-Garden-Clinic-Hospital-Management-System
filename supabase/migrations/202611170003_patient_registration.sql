begin;

create or replace function public.register_patient(
  p_facility_id uuid,
  p_patient jsonb,
  p_emergency_contact jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_patient_id uuid;
begin
  if v_actor is null or not public.has_permission('patients.register', p_facility_id) then
    raise exception using errcode = '42501', message = 'Patient registration is not permitted.';
  end if;

  if p_patient is null
    or nullif(pg_catalog.btrim(p_patient ->> 'first_name'), '') is null
    or nullif(pg_catalog.btrim(p_patient ->> 'last_name'), '') is null then
    raise exception using errcode = '22023', message = 'Patient name is required.';
  end if;

  insert into public.patients (
    facility_id, first_name, middle_name, last_name, date_of_birth,
    date_of_birth_estimated, gender, phone_primary, phone_secondary, email,
    address_line_1, address_line_2, city, region, country, status, created_by
  ) values (
    p_facility_id,
    pg_catalog.btrim(p_patient ->> 'first_name'),
    nullif(pg_catalog.btrim(p_patient ->> 'middle_name'), ''),
    pg_catalog.btrim(p_patient ->> 'last_name'),
    nullif(p_patient ->> 'date_of_birth', '')::date,
    coalesce((p_patient ->> 'date_of_birth_estimated')::boolean, false),
    coalesce(nullif(pg_catalog.lower(p_patient ->> 'gender'), ''), 'unknown'),
    nullif(pg_catalog.btrim(p_patient ->> 'phone_primary'), ''),
    nullif(pg_catalog.btrim(p_patient ->> 'phone_secondary'), ''),
    nullif(pg_catalog.btrim(p_patient ->> 'email'), ''),
    nullif(pg_catalog.btrim(p_patient ->> 'address_line_1'), ''),
    nullif(pg_catalog.btrim(p_patient ->> 'address_line_2'), ''),
    nullif(pg_catalog.btrim(p_patient ->> 'city'), ''),
    nullif(pg_catalog.btrim(p_patient ->> 'region'), ''),
    coalesce(nullif(pg_catalog.btrim(p_patient ->> 'country'), ''), 'Sierra Leone'),
    'active', v_actor
  ) returning id into v_patient_id;

  if p_emergency_contact is not null
    and nullif(pg_catalog.btrim(p_emergency_contact ->> 'full_name'), '') is not null
    and nullif(pg_catalog.btrim(p_emergency_contact ->> 'phone'), '') is not null then
    insert into public.patient_contacts (patient_id, contact_type, full_name, relationship, phone, address, is_primary)
    values (
      v_patient_id, 'emergency',
      pg_catalog.btrim(p_emergency_contact ->> 'full_name'),
      nullif(pg_catalog.btrim(p_emergency_contact ->> 'relationship'), ''),
      pg_catalog.btrim(p_emergency_contact ->> 'phone'),
      nullif(pg_catalog.btrim(p_emergency_contact ->> 'address'), ''),
      true
    );
  end if;

  return v_patient_id;
end;
$$;

create trigger patient_contacts_audit_row_change
after insert or update on public.patient_contacts
for each row execute function public.audit_row_change();

revoke all on function public.register_patient(uuid, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.register_patient(uuid, jsonb, jsonb) to authenticated;

commit;
