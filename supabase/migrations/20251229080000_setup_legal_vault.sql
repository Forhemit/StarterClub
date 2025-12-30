-- Legal Entities Table
create table if not exists legal_entities (
    id uuid primary key default gen_random_uuid(),
    organization_type text, -- 'LLC', 'C-Corp', etc.
    formation_date date,
    primary_state text,
    business_purpose text,
    ein text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Legal Requirements Table (Tasks/Compliance Items)
create table if not exists legal_requirements (
    id uuid primary key default gen_random_uuid(),
    entity_id uuid references legal_entities(id) on delete cascade,
    category text, -- 'Official Identifiers', 'Tax'
    requirement_type text, -- 'business_license', 'ein'
    status text default 'pending', -- 'pending', 'complete', 'na'
    data jsonb default '{}'::jsonb, -- dynamic fields
    assigned_to text, -- Clerk User ID or email (keeping simple for now as text, or uuid if we have a users table synced)
    due_date date,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Legal Documents Table
create table if not exists legal_documents (
    id uuid primary key default gen_random_uuid(),
    entity_id uuid references legal_entities(id) on delete cascade,
    document_type text, -- 'Articles of Incorporation', etc.
    file_path text, -- Supabase Storage path
    upload_date timestamptz default now()
);

-- RLS Policies
alter table legal_entities enable row level security;
alter table legal_requirements enable row level security;
alter table legal_documents enable row level security;

-- Policy: Allow all authenticated users to view/edit (Simulating 'company' access)
-- In a real multi-tenant app, we'd filter by company_id. For now, we assume single company per environment or filter by user association.
-- Given the 'Starter Club' context, let's allow authenticated users for now.

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON legal_entities;
create policy "Enable all access for authenticated users" 
on legal_entities for all 
to authenticated 
using (true) 
with check (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON legal_requirements;
create policy "Enable all access for authenticated users" 
on legal_requirements for all 
to authenticated 
using (true) 
with check (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON legal_documents;
create policy "Enable all access for authenticated users" 
on legal_documents for all 
to authenticated 
using (true) 
with check (true);
