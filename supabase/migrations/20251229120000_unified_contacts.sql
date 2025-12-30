-- Unified Contacts Table
create table if not exists contacts (
    id uuid primary key default gen_random_uuid(),
    entity_id uuid references legal_entities(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade, -- Assuming standard supabase auth users linkage if needed
    contact_type text not null, -- 'Legal', 'Primary', 'Billing', 'Shipping', 'Emergency', 'HR', 'Financial', 'Technical', 'Other'
    is_primary boolean default false,
    source text default 'Manual Entry',
    
    -- Contact Details
    address_line1 text,
    address_line2 text,
    city text,
    state text,
    zip text,
    country text default 'US',
    phone text,
    email text,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    -- Constraints: Ensure it belongs to either an entity or a user (or both if valid, but usually one)
    constraint contact_owner_check check (entity_id is not null or user_id is not null)
);

-- Contact History Table for Auditing
create table if not exists contact_history (
    id uuid primary key default gen_random_uuid(),
    contact_id uuid references contacts(id) on delete cascade,
    field_changed text,
    old_value text,
    new_value text,
    changed_by uuid references auth.users(id), -- User who made the change
    change_date timestamptz default now()
);

-- RLS Policies
alter table contacts enable row level security;
alter table contact_history enable row level security;

-- Simple RLS for now: authenticated users can view/edit
-- Real app would filter by organization/ownership
drop policy if exists "Enable all access for authenticated users" on contacts;
create policy "Enable all access for authenticated users" 
on contacts for all 
to authenticated 
using (true) 
with check (true);

drop policy if exists "Enable all access for authenticated users" on contact_history;
create policy "Enable all access for authenticated users" 
on contact_history for all 
to authenticated 
using (true) 
with check (true);

-- Indexes for performance
create index if not exists contacts_entity_id_idx on contacts(entity_id);
create index if not exists contacts_user_id_idx on contacts(user_id);
create index if not exists contacts_type_idx on contacts(contact_type);
