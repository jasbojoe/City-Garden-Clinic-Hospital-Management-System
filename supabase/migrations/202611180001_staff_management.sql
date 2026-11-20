begin;

create or replace function public.create_staff_from_invitation(
  p_user_id uuid,
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
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_auth_email text;
  v_role_id uuid;
  v_role_count integer;
begin
  if v_actor is null
    or not public.has_permission('staff.invite', p_facility_id)
    or not public.has_permission('staff.roles.assign', p_facility_id) then
    raise exception using errcode = '42501', message = 'Staff invitation is not permitted.';
  end if;

  if p_user_id is null or p_user_id = v_actor then
    raise exception using errcode = '42501', message = 'The invited account is not eligible.';
  end if;

  if p_email is null or pg_catalog.length(pg_catalog.btrim(p_email)) > 254
    or p_first_name is null or pg_catalog.length(pg_catalog.btrim(p_first_name)) not between 1 and 100
    or (p_middle_name is not null and pg_catalog.length(pg_catalog.btrim(p_middle_name)) > 100)
    or p_last_name is null or pg_catalog.length(pg_catalog.btrim(p_last_name)) not between 1 and 100
    or (p_phone is not null and pg_catalog.length(pg_catalog.btrim(p_phone)) > 40)
    or (p_job_title is not null and pg_catalog.length(pg_catalog.btrim(p_job_title)) > 120) then
    raise exception using errcode = '22023', message = 'Staff profile information is invalid.';
  end if;

  if not exists (
    select 1 from public.facilities f
    where f.id = p_facility_id and f.is_active
  ) then
    raise exception using errcode = '22023', message = 'The selected facility is unavailable.';
  end if;

  select u.email into v_auth_email
  from auth.users u
  where u.id = p_user_id
    and u.invited_at is not null
    and u.email_confirmed_at is null;

  if v_auth_email is null or pg_catalog.lower(pg_catalog.btrim(v_auth_email)) <> pg_catalog.lower(pg_catalog.btrim(p_email)) then
    raise exception using errcode = '42501', message = 'A matching pending Auth invitation is required.';
  end if;

  if exists (select 1 from public.staff_profiles sp where sp.id = p_user_id)
    or exists (
      select 1 from public.staff_profiles sp
      where pg_catalog.lower(sp.email) = pg_catalog.lower(pg_catalog.btrim(p_email))
    ) then
    raise exception using errcode = '23505', message = 'A staff profile already exists for this account.';
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

  if p_department_id is not null and not exists (
    select 1 from public.departments d
    where d.id = p_department_id and d.facility_id = p_facility_id and d.is_active
  ) then
    raise exception using errcode = '22023', message = 'The selected department is unavailable at this facility.';
  end if;

  insert into public.staff_profiles (
    id, employee_number, first_name, middle_name, last_name, phone, email,
    department_id, job_title, status
  ) values (
    p_user_id,
    'EMP-' || pg_catalog.upper(pg_catalog.substr(pg_catalog.replace(p_user_id::text, '-', ''), 1, 12)),
    pg_catalog.btrim(p_first_name),
    nullif(pg_catalog.btrim(p_middle_name), ''),
    pg_catalog.btrim(p_last_name),
    nullif(pg_catalog.btrim(p_phone), ''),
    pg_catalog.lower(pg_catalog.btrim(p_email)),
    p_department_id,
    nullif(pg_catalog.btrim(p_job_title), ''),
    'active'
  );

  insert into public.staff_facilities (staff_id, facility_id, is_primary)
  values (p_user_id, p_facility_id, true);

  for v_role_id in
    select r.id from public.roles r
    where r.code = any(p_role_codes) and r.code <> 'super_administrator'
    order by r.code
  loop
    insert into public.staff_roles (staff_id, role_id, facility_id, assigned_by)
    values (p_user_id, v_role_id, p_facility_id, v_actor);
  end loop;

  insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
  values (
    v_actor,
    p_facility_id,
    'staff.invited',
    'staff_profile',
    p_user_id,
    pg_catalog.jsonb_build_object(
      'facility_id', p_facility_id,
      'department_id', p_department_id,
      'role_codes', p_role_codes
    )
  );

  return p_user_id;
end;
$$;

create or replace function public.update_staff_profile_admin(
  p_staff_id uuid,
  p_facility_id uuid,
  p_first_name text,
  p_middle_name text,
  p_last_name text,
  p_phone text,
  p_job_title text,
  p_department_id uuid,
  p_role_codes text[],
  p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_old_status text;
  v_old_primary_facility uuid;
  v_old_role_codes text[];
  v_new_role_codes text[];
  v_role_count integer;
  v_roles_changed boolean;
  v_role_id uuid;
begin
  if v_actor is null or not public.has_permission('staff.update', p_facility_id) then
    raise exception using errcode = '42501', message = 'Staff updates are not permitted.';
  end if;

  if p_staff_id is null or p_facility_id is null
    or p_status not in ('active', 'suspended', 'inactive')
    or p_first_name is null or pg_catalog.length(pg_catalog.btrim(p_first_name)) not between 1 and 100
    or (p_middle_name is not null and pg_catalog.length(pg_catalog.btrim(p_middle_name)) > 100)
    or p_last_name is null or pg_catalog.length(pg_catalog.btrim(p_last_name)) not between 1 and 100
    or (p_phone is not null and pg_catalog.length(pg_catalog.btrim(p_phone)) > 40)
    or (p_job_title is not null and pg_catalog.length(pg_catalog.btrim(p_job_title)) > 120) then
    raise exception using errcode = '22023', message = 'Staff profile information is invalid.';
  end if;

  select sp.status into v_old_status
  from public.staff_profiles sp where sp.id = p_staff_id;
  if not found then
    raise exception using errcode = 'P0002', message = 'Staff profile was not found.';
  end if;

  if not exists (
    select 1 from public.staff_facilities sf
    where sf.staff_id = p_staff_id
      and public.has_permission('staff.update', sf.facility_id)
  ) then
    raise exception using errcode = '42501', message = 'Staff updates are not permitted for this profile.';
  end if;

  if exists (
    select 1
    from public.staff_roles sr
    join public.roles r on r.id = sr.role_id
    where sr.staff_id = p_staff_id and r.code = 'super_administrator'
  ) then
    raise exception using errcode = '42501', message = 'The Super Administrator profile is protected.';
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

  if p_department_id is not null and not exists (
    select 1 from public.departments d
    where d.id = p_department_id and d.facility_id = p_facility_id and d.is_active
  ) then
    raise exception using errcode = '22023', message = 'The selected department is unavailable at this facility.';
  end if;

  select coalesce(pg_catalog.array_agg(r.code order by r.code), array[]::text[])
  into v_old_role_codes
  from public.staff_roles sr
  join public.roles r on r.id = sr.role_id
  where sr.staff_id = p_staff_id and sr.facility_id = p_facility_id;

  select coalesce(pg_catalog.array_agg(submitted.role_code order by submitted.role_code), array[]::text[])
  into v_new_role_codes
  from pg_catalog.unnest(p_role_codes) as submitted(role_code);

  v_roles_changed := v_old_role_codes is distinct from v_new_role_codes;
  if v_roles_changed and not public.has_permission('staff.roles.assign', p_facility_id) then
    raise exception using errcode = '42501', message = 'Staff role assignment is not permitted.';
  end if;

  select sf.facility_id into v_old_primary_facility
  from public.staff_facilities sf
  where sf.staff_id = p_staff_id and sf.is_primary
  limit 1;

  if p_staff_id = v_actor and (
    v_roles_changed or p_status is distinct from v_old_status
    or v_old_primary_facility is distinct from p_facility_id
  ) then
    raise exception using errcode = '42501', message = 'Staff cannot change their own role, status, or facility assignment.';
  end if;

  update public.staff_profiles
  set first_name = pg_catalog.btrim(p_first_name),
      middle_name = nullif(pg_catalog.btrim(p_middle_name), ''),
      last_name = pg_catalog.btrim(p_last_name),
      phone = nullif(pg_catalog.btrim(p_phone), ''),
      job_title = nullif(pg_catalog.btrim(p_job_title), ''),
      department_id = p_department_id,
      status = p_status
  where id = p_staff_id;

  update public.staff_facilities sf
  set is_primary = false
  where sf.staff_id = p_staff_id and sf.is_primary and sf.facility_id <> p_facility_id;

  insert into public.staff_facilities (staff_id, facility_id, is_primary)
  values (p_staff_id, p_facility_id, true)
  on conflict (staff_id, facility_id) do update
    set is_primary = true
    where public.staff_facilities.is_primary is distinct from true;

  if v_roles_changed then
    delete from public.staff_roles sr
    where sr.staff_id = p_staff_id and sr.facility_id = p_facility_id;

    for v_role_id in
      select r.id from public.roles r
      where r.code = any(v_new_role_codes) and r.code <> 'super_administrator'
      order by r.code
    loop
      insert into public.staff_roles (staff_id, role_id, facility_id, assigned_by)
      values (p_staff_id, v_role_id, p_facility_id, v_actor);
    end loop;

    insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
    values (
      v_actor,
      p_facility_id,
      'staff.role_assignment_changed',
      'staff_profile',
      p_staff_id,
      pg_catalog.jsonb_build_object('previous_role_codes', v_old_role_codes, 'role_codes', v_new_role_codes)
    );
  end if;

  if v_old_primary_facility is distinct from p_facility_id then
    insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
    values (
      v_actor,
      p_facility_id,
      'staff.facility_assigned',
      'staff_profile',
      p_staff_id,
      pg_catalog.jsonb_build_object('previous_primary_facility_id', v_old_primary_facility, 'primary_facility_id', p_facility_id)
    );
  end if;

  if p_status is distinct from v_old_status then
    insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
    values (
      v_actor,
      p_facility_id,
      case
        when p_status = 'suspended' then 'staff.suspended'
        when v_old_status = 'suspended' and p_status = 'active' then 'staff.reactivated'
        else 'staff.status_changed'
      end,
      'staff_profile',
      p_staff_id,
      pg_catalog.jsonb_build_object('previous_status', v_old_status, 'status', p_status)
    );
  end if;
end;
$$;

create or replace function public.audit_staff_invitation_resent(
  p_staff_id uuid,
  p_facility_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.has_permission('staff.invite', p_facility_id) then
    raise exception using errcode = '42501', message = 'Staff invitation is not permitted.';
  end if;

  if not exists (
    select 1 from public.staff_facilities sf
    where sf.staff_id = p_staff_id and sf.facility_id = p_facility_id
  ) or exists (
    select 1
    from public.staff_roles sr
    join public.roles r on r.id = sr.role_id
    where sr.staff_id = p_staff_id and r.code = 'super_administrator'
  ) then
    raise exception using errcode = '42501', message = 'Invitation resend is not permitted for this profile.';
  end if;

  insert into public.audit_logs (actor_user_id, facility_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    p_facility_id,
    'staff.invitation_resent',
    'staff_profile',
    p_staff_id,
    pg_catalog.jsonb_build_object('facility_id', p_facility_id)
  );
end;
$$;

create trigger staff_facilities_audit_row_change
  after insert or update or delete on public.staff_facilities
  for each row execute function public.audit_row_change();

revoke all on function public.create_staff_from_invitation(uuid, text, text, text, text, text, text, uuid, uuid, text[]) from public, anon, authenticated;
revoke all on function public.update_staff_profile_admin(uuid, uuid, text, text, text, text, text, uuid, text[], text) from public, anon, authenticated;
revoke all on function public.audit_staff_invitation_resent(uuid, uuid) from public, anon, authenticated;
grant execute on function public.create_staff_from_invitation(uuid, text, text, text, text, text, text, uuid, uuid, text[]) to authenticated;
grant execute on function public.update_staff_profile_admin(uuid, uuid, text, text, text, text, text, uuid, text[], text) to authenticated;
grant execute on function public.audit_staff_invitation_resent(uuid, uuid) to authenticated;

commit;
