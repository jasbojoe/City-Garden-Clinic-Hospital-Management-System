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
  if exists (select 1 from public.staff_roles sr join public.roles r on r.id = sr.role_id where r.code = 'super_administrator') then
    raise exception using errcode = '42501', message = 'Initial administrator setup has already been completed.';
  end if;
  select u.email, u.raw_app_meta_data into v_email, v_app_metadata
  from auth.users u where u.id = p_user_id and u.email_confirmed_at is not null;
  if v_email is null or coalesce(v_app_metadata ->> 'cgc_initial_admin_authorized', '') <> 'true' then
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
    v_email, 'active'
  );
  insert into public.staff_facilities (staff_id, facility_id, is_primary) values (p_user_id, v_facility_id, true);
  insert into public.staff_roles (staff_id, role_id, facility_id, assigned_by) values (p_user_id, v_role_id, null, p_user_id);
  insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
  values (p_user_id, v_facility_id, 'bootstrap', 'staff_profile', p_user_id, pg_catalog.jsonb_build_object('role_code', 'super_administrator'));
  update auth.users set raw_app_meta_data = raw_app_meta_data - 'cgc_initial_admin_authorized' where id = p_user_id;
  return p_user_id;
end;
$$;

revoke all on function public.bootstrap_first_super_administrator(uuid) from public, anon, authenticated;
grant execute on function public.bootstrap_first_super_administrator(uuid) to service_role;

commit;
