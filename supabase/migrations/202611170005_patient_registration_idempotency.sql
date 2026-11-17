begin;

create table public.patient_registration_requests (
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  patient_id uuid not null references public.patients(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (actor_user_id, request_id),
  unique (patient_id)
);

alter table public.patient_registration_requests enable row level security;
revoke all on table public.patient_registration_requests from public, anon, authenticated;
grant all on table public.patient_registration_requests to service_role;

drop function public.register_patient(uuid, jsonb, jsonb, jsonb);

create function public.register_patient(
  p_facility_id uuid,
  p_patient jsonb,
  p_emergency_contact jsonb,
  p_allergies jsonb,
  p_request_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_patient_id uuid;
  v_allergy jsonb;
begin
  if v_actor is null or not public.has_permission('patients.register', p_facility_id) then
    raise exception using errcode = '42501', message = 'Patient registration is not permitted.';
  end if;

  if p_request_id is null then
    raise exception using errcode = '22023', message = 'A registration request id is required.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_actor::text || ':' || p_request_id::text, 0));

  select r.patient_id into v_patient_id
  from public.patient_registration_requests r
  where r.actor_user_id = v_actor and r.request_id = p_request_id;
  if v_patient_id is not null then
    return v_patient_id;
  end if;

  if p_patient is null
    or nullif(pg_catalog.btrim(p_patient ->> 'first_name'), '') is null
    or nullif(pg_catalog.btrim(p_patient ->> 'last_name'), '') is null then
    raise exception using errcode = '22023', message = 'Patient name is required.';
  end if;

  if p_allergies is null or pg_catalog.jsonb_typeof(p_allergies) <> 'array' then
    raise exception using errcode = '22023', message = 'Allergies must be an array.';
  end if;

  insert into public.patients (
    facility_id, mrn, first_name, middle_name, last_name, date_of_birth,
    date_of_birth_estimated, gender, phone_primary, phone_secondary, email,
    address_line_1, address_line_2, city, region, country, status, created_by
  ) values (
    p_facility_id,
    public.generate_patient_mrn(),
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

  for v_allergy in select value from pg_catalog.jsonb_array_elements(p_allergies)
  loop
    if nullif(pg_catalog.btrim(v_allergy #>> '{}'), '') is null then
      raise exception using errcode = '22023', message = 'Allergy names cannot be empty.';
    end if;
    insert into public.patient_allergies (patient_id, allergen, recorded_by)
    values (v_patient_id, pg_catalog.btrim(v_allergy #>> '{}'), v_actor);
  end loop;

  insert into public.patient_registration_requests (actor_user_id, request_id, patient_id)
  values (v_actor, p_request_id, v_patient_id);

  return v_patient_id;
end;
$$;

revoke all on function public.register_patient(uuid, jsonb, jsonb, jsonb, uuid) from public, anon, authenticated;
grant execute on function public.register_patient(uuid, jsonb, jsonb, jsonb, uuid) to authenticated;

commit;
