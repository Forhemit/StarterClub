-- Address Table for One-to-Many Relationship
create table if not exists entity_addresses (
    id uuid primary key default gen_random_uuid(),
    entity_id uuid references legal_entities(id) on delete cascade,
    address_type text not null, -- 'Legal', 'Mailing', 'Shipping', 'HQ', 'Other'
    is_primary boolean default false,
    line1 text not null,
    line2 text,
    city text not null,
    state text not null,
    zip text not null,
    country text default 'US',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table entity_addresses enable row level security;

DROP POLICY IF EXISTS "Enable all access for authenticated person" ON entity_addresses;
create policy "Enable all access for authenticated person" 
on entity_addresses for all 
to authenticated 
using (true) 
with check (true);
