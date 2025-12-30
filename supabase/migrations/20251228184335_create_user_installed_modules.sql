-- Create table for tracking installed marketplace modules
create table if not exists user_installed_modules (
  id uuid default gen_random_uuid() primary key,
  user_business_id uuid references user_businesses(id) on delete cascade not null,
  module_id text not null,
  installed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  installed_by text,
  status text default 'active' check (status in ('active', 'disabled')),
  
  unique(user_business_id, module_id)
);

-- Ensure installed_by is text (fix if it was created as uuid previously)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_installed_modules' 
    AND column_name = 'installed_by' 
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE user_installed_modules ALTER COLUMN installed_by TYPE text;
  END IF;
END $$;

-- Enable RLS
alter table user_installed_modules enable row level security;

-- Policies (Drop first to be idempotent)
drop policy if exists "Users can view modules installed for their business" on user_installed_modules;
create policy "Users can view modules installed for their business"
  on user_installed_modules for select
  using (
    exists (
      select 1 from user_businesses
      where user_businesses.id = user_installed_modules.user_business_id
      and user_businesses.user_id = auth.uid()::text
    )
  );

drop policy if exists "Users can install modules for their business" on user_installed_modules;
create policy "Users can install modules for their business"
  on user_installed_modules for insert
  with check (
    exists (
      select 1 from user_businesses
      where user_businesses.id = user_installed_modules.user_business_id
      and user_businesses.user_id = auth.uid()::text
    )
  );

drop policy if exists "Users can update/uninstall modules for their business" on user_installed_modules;
create policy "Users can update/uninstall modules for their business"
  on user_installed_modules for update
  using (
    exists (
      select 1 from user_businesses
      where user_businesses.id = user_installed_modules.user_business_id
      and user_businesses.user_id = auth.uid()::text
    )
  );

drop policy if exists "Users can remove modules for their business" on user_installed_modules;
create policy "Users can remove modules for their business"
  on user_installed_modules for delete
  using (
    exists (
      select 1 from user_businesses
      where user_businesses.id = user_installed_modules.user_business_id
      and user_businesses.user_id = auth.uid()::text
    )
  );
