create table if not exists public.acquisition_readiness_profiles (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    company_name text,
    data_room_url text,
    documents_uploaded integer default 0,
    financial_audit_status text default 'not_started',
    legal_audit_status text default 'not_started',
    tech_audit_status text default 'not_started',
    red_flags text[],
    deal_stage text default 'preparation',
    documents jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    constraint unique_user_acquisition_profile unique (user_id)
);

alter table public.acquisition_readiness_profiles enable row level security;

create policy "Users can view their own acquisition profile"
    on public.acquisition_readiness_profiles for select
    using (auth.uid() = user_id);

create policy "Users can insert their own acquisition profile"
    on public.acquisition_readiness_profiles for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own acquisition profile"
    on public.acquisition_readiness_profiles for update
    using (auth.uid() = user_id);

create table if not exists public.enterprise_interested_parties (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    company_name text not null,
    contact_name text,
    email text,
    role text,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.enterprise_interested_parties enable row level security;

create policy "Users can manage their interested parties"
    on public.enterprise_interested_parties for all
    using (auth.uid() = user_id);

create table if not exists public.enterprise_access_rules (
    id uuid default gen_random_uuid() primary key,
    party_id uuid references public.enterprise_interested_parties(id) on delete cascade not null,
    resource_id text not null,
    has_access boolean default false,
    time_window text default 'all_time',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    constraint unique_party_resource unique (party_id, resource_id)
);

alter table public.enterprise_access_rules enable row level security;

create policy "Users can manage access rules via party ownership"
    on public.enterprise_access_rules for all
    using (
        exists (
            select 1 from public.enterprise_interested_parties
            where id = enterprise_access_rules.party_id
            and user_id = auth.uid()
        )
    );

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_timestamp_acquisition
  before update on public.acquisition_readiness_profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_parties
  before update on public.enterprise_interested_parties
  for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_rules
  before update on public.enterprise_access_rules
  for each row execute procedure public.handle_updated_at();
