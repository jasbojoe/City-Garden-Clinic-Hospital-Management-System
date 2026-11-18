begin;

create or replace function public.validate_staff_invitation(
  p_email text,
  p_first_name text,
  p_middle_name text,
  p_last_name text,
  p_phone text,
  p_job_title text,
  p_department_id uuid,
  p_facility_id uuid,
  p_role_codes text[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role_count integer;
begin
  if auth.uid() is null
    or not public.has_permission('staff.invite', p_facility_id)
    or not public.has_permission('staff.roles.assign', p_facility_id) then
    raise exception using errcode = '42501', message = 'Staff invitation is not permitted.';
  end if;

  if p_email is null or pg_catalog.length(pg_catalog.btrim(p_email)) not between 3 and 254
    or pg_catalog.strpos(pg_catalog.btrim(p_email), '@') < 2
    or p_first_name is null or pg_catalog.length(pg_catalog.btrim(p_first_name)) not between 1 and 100
    or (p_middle_name is not null and pg_catalog.length(pg_catalog.btrim(p_middle_name)) > 100)
    or p_last_name is null or pg_catalog.length(pg_catalog.btrim(p_last_name)) not between 1 and 100
    or (p_phone is not null and pg_catalog.length(pg_catalog.btrim(p_phone)) > 40)
    or (p_job_title is not null and pg_catalog.length(pg_catalog.btrim(p_job_title)) > 120) then
    raise exception using errcode = '22023', message = 'Staff invitation information is invalid.';
  end if;

  if not exists (
    select 1 from public.facilities f
    where f.id = p_facility_id and f.is_active
  ) then
    raise exception using errcode = '22023', message = 'The selected facility is unavailable.';
  end if;

  if p_department_id is not null and not exists (
    select 1 from public.departments d
    where d.id = p_department_id and d.facility_id = p_facility_id and d.is_active
  ) then
    raise exception using errcode = '22023', message = 'The selected department is unavailable at this facility.';
  end if;

  if p_role_codes is null or pg_catalog.cardinality(p_role_codes) < 1 or pg_catalog.cardinality(p_role_codes) > 10 then
    raise exception using errcode = '22023', message = 'At least one valid staff role is required.';
  end if;
  select pg_catalog.count(distinct submitted.role_code)::integer into v_role_count
  from pg_catalog.unnest(p_role_codes) as submitted(role_code);
  if v_role_count <> pg_catalog.cardinality(p_role_codes)
    or exists (
      select 1 from pg_catalog.unnest(p_role_codes) as submitted(role_code)
      where submitted.role_code is null or submitted.role_code = 'super_administrator'
    )
    or exists (
      select 1 from pg_catalog.unnest(p_role_codes) as submitted(role_code)
      left join public.roles r on r.code = submitted.role_code
      where r.id is null
    ) then
    raise exception using errcode = '22023', message = 'One or more staff roles are invalid or restricted.';
  end if;

  if exists (
    select 1 from auth.users u
    where pg_catalog.lower(u.email) = pg_catalog.lower(pg_catalog.btrim(p_email))
  ) or exists (
    select 1 from public.staff_profiles sp
    where pg_catalog.lower(sp.email) = pg_catalog.lower(pg_catalog.btrim(p_email))
  ) then
    raise exception using errcode = '23505', message = 'An account or staff profile already exists for this email.';
  end if;
end;
$$;

revoke all on function public.validate_staff_invitation(text, text, text, text, text, text, uuid, uuid, text[]) from public, anon, authenticated;
grant execute on function public.validate_staff_invitation(text, text, text, text, text, text, uuid, uuid, text[]) to authenticated;

commit;
