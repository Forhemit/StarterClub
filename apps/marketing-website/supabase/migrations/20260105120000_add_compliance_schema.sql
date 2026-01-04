-- Create compliance_profiles table
create table if not exists items_compliance_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- using text to match Clerk ID usually, or uuid if referencing auth.users
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create compliance_events table
create table if not exists items_compliance_events (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references items_compliance_profiles(id) on delete cascade not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  status text check (status in ('pending', 'completed', 'overdue', 'ignored')) default 'pending',
  category text check (category in ('tax', 'registration', 'license', 'other')) not null,
  jurisdiction text,
  notes text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add simple RLS (Row Level Security) - assuming generic user_id check
alter table items_compliance_profiles enable row level security;
alter table items_compliance_events enable row level security;

create policy "Users can view their own compliance profile"
  on items_compliance_profiles for select
  using (user_id = auth.uid()::text);

create policy "Users can insert their own compliance profile"
  on items_compliance_profiles for insert
  with check (user_id = auth.uid()::text);

create policy "Users can update their own compliance profile"
  on items_compliance_profiles for update
  using (user_id = auth.uid()::text);

create policy "Users can delete their own compliance profile"
  on items_compliance_profiles for delete
  using (user_id = auth.uid()::text);

-- Events policies (cascade from profile ownership usually, but for simplicity here:)
create policy "Users can manage events of their profile"
  on items_compliance_events for all
  using (
    exists (
      select 1 from items_compliance_profiles
      where items_compliance_profiles.id = items_compliance_events.profile_id
      and items_compliance_profiles.user_id = auth.uid()::text
    )
  );
