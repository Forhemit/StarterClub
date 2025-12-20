-- 20251220000001_soft_deletes.sql

-- Add deleted_at to partner_users
alter table partner_users add column if not exists deleted_at timestamptz default null;

-- Add deleted_at to partner_orgs
alter table partner_orgs add column if not exists deleted_at timestamptz default null;

-- Update RLS for partner_users: Hide deleted users
drop policy if exists "Authenticated users can view own user record" on partner_users;
create policy "Authenticated users can view own user record" on partner_users
    for select
    using ( 
        clerk_user_id = requesting_user_id() 
        and deleted_at is null 
    );

-- Update RLS for partner_orgs: Hide deleted orgs
drop policy if exists "Authenticated users can view own org" on partner_orgs;
create policy "Authenticated users can view own org" on partner_orgs
    for select
    using (
        exists (
            select 1 from partner_users
            where partner_users.org_id = partner_orgs.id
            and partner_users.clerk_user_id = requesting_user_id()
            and partner_users.deleted_at is null
        )
        and deleted_at is null
    );
