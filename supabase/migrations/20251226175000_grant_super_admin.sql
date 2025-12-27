-- Grant Super Admin permissions to Stephenobamastokes@gmail

-- 1. Ensure Super Admin role exists
insert into roles (name, slug, description)
values ('Super Admin', 'super_admin', 'Full access to all systems')
on conflict (slug) do nothing;

-- 2. Ensure Permissions exist
insert into permissions (slug, description)
values 
  ('access_all_roles', 'Can manage all roles'),
  ('access_all_members', 'Can manage all members'),
  ('access_all_sponsors', 'Can manage all sponsors'),
  ('access_all_partners', 'Can manage all partners'),
  ('access_employee_channels', 'Can access employee channels')
on conflict (slug) do nothing;

-- 3. Grant all permissions to Super Admin
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r
cross join permissions p
where r.slug = 'super_admin'
  and p.slug in (
    'access_all_roles',
    'access_all_members',
    'access_all_sponsors',
    'access_all_partners',
    'access_employee_channels'
  )
on conflict do nothing;

-- 4. Assign Super Admin role to user
do $$
declare
  target_user_id text;
  super_admin_role_id uuid;
begin
  -- Find user by email
  select id into target_user_id from profiles where email = 'Stephenobamastokes@gmail';
  
  -- Find role id
  select id into super_admin_role_id from roles where slug = 'super_admin';

  if target_user_id is not null and super_admin_role_id is not null then
    -- Assign role
    insert into user_roles (user_id, role_id)
    values (target_user_id, super_admin_role_id)
    on conflict (user_id, role_id) do nothing;
    
    -- Update legacy role column if it exists just in case
    update profiles set role = 'admin' where id = target_user_id;
    
    raise notice 'Successfully granted Super Admin permissions to %', target_user_id;
  else
    raise notice 'User (Stephenobamastokes@gmail) or super_admin role not found. Skipping assignment.';
  end if;
end $$;
