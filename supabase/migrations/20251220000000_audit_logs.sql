-- 20251220000000_audit_logs.sql

-- SYSTEM AUDIT LOGS
-- This table tracks high-privilege actions, especially those using SERVICE_ROLE_KEY.

create table if not exists audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id text not null, -- Clerk ID of the admin performing the action
    action text not null, -- e.g. 'USER_INVITE', 'ORG_DELETE'
    target_id text not null, -- The ID of the entity being acted upon
    target_type text not null, -- 'USER', 'ORG'
    metadata jsonb default '{}', -- Detailed payload (diffs, reasons)
    ip_address text, -- captured from request headers if available
    created_at timestamptz default now()
);

-- RLS: READ-ONLY for Admins. WRITE-ONLY for Service Role (effectively).
alter table audit_logs enable row level security;

-- Admins can read (for audit dashboard)
create policy "Admins can view audit logs" on audit_logs
    for select
    using (
        exists (select 1 from partner_users where clerk_user_id = requesting_user_id() and role = 'admin')
    );

-- Nobody can insert via Client (Service Role bypasses this)
create policy "No client inserts" on audit_logs
    for insert
    with check ( false );
