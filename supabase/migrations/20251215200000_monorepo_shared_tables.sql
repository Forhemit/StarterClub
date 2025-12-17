-- Shared Tables Migration

-- PROFILES
create table if not exists profiles (
  id text primary key, -- Clerk User ID
  first_name text,
  last_name text,
  email text,
  phone text, -- Added for member lookup in kiosk
  role text default 'member', -- member, admin, partner
  tier text default 'Starter', -- Starter, Pro, Enterprise
  photo_url text,
  is_in_building boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ACTIVITY LOG
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  member_id text references profiles(id) on delete set null,
  visit_type text not null, -- MEMBER_VISIT, NEW_GUEST, etc.
  intent text, -- WORK, HANG_OUT
  resource_used text,
  resource_duration_hours numeric,
  payment_collected numeric default 0,
  description text,
  ai_category text,
  guest_data jsonb, -- Stores GuestProfile for non-members
  created_at timestamptz default now()
);

-- MEMBER PROGRESS
create table if not exists member_progress (
  member_id text primary key references profiles(id) on delete cascade,
  total_points integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_check_in timestamptz,
  level integer default 1,
  badges text[] default '{}',
  updated_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table activity_log enable row level security;
alter table member_progress enable row level security;

-- POLICIES

-- Profiles
create policy "Authenticated users can read profiles" on profiles
  for select
  using ( requesting_user_id() is not null );

create policy "Users can update own profile" on profiles
  for update
  using ( id = requesting_user_id() );

-- Activity Log
create policy "Users read own activity" on activity_log
  for select
  using ( member_id = requesting_user_id() );

create policy "Admins read all activity" on activity_log
  for select
  using ( 
    exists (select 1 from profiles where id = requesting_user_id() and role = 'admin')
  );

create policy "Users insert own activity" on activity_log
  for insert
  with check ( member_id = requesting_user_id() );

-- Member Progress
create policy "Users read own progress" on member_progress
  for select
  using ( member_id = requesting_user_id() );

create policy "Admins read all progress" on member_progress
  for select
  using ( 
     exists (select 1 from profiles where id = requesting_user_id() and role = 'admin')
  );
