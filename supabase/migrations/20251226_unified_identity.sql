-- Unified Identity System Migration

-- 1. Roles Table
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- e.g. "Member", "Sponsor"
  slug text unique not null, -- e.g. "member", "sponsor"
  description text,
  created_at timestamptz default now()
);

-- 2. Permissions Table
create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, -- e.g. "view_member_content"
  description text,
  created_at timestamptz default now()
);

-- 3. Role Permissions (Junction)
create table if not exists role_permissions (
  role_id uuid references roles(id) on delete cascade,
  permission_id uuid references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- 4. User Roles (Junction)
create table if not exists user_roles (
  user_id text references profiles(id) on delete cascade, -- Maps to Clerk ID in profiles
  role_id uuid references roles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, role_id)
);

-- 5. Role Requests
create table if not exists role_requests (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  role_slug text not null, -- Requested role
  status text check (status in ('pending', 'approved', 'denied')) default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies

-- Roles: Public read (for now, or authenticated read)
alter table roles enable row level security;
create policy "Roles are viewable by everyone" on roles for select using (true);

-- Permissions: Public read
alter table permissions enable row level security;
create policy "Permissions are viewable by everyone" on permissions for select using (true);

-- Role Permissions: Public read
alter table role_permissions enable row level security;
create policy "Role permissions are viewable by everyone" on role_permissions for select using (true);

-- User Roles: Users can see their own roles
alter table user_roles enable row level security;
create policy "Users can view own roles" on user_roles for select using (user_id = requesting_user_id());

-- Role Requests: Users can see/create their own requests
alter table role_requests enable row level security;
create policy "Users can view own requests" on role_requests for select using (user_id = requesting_user_id());
create policy "Users can create requests" on role_requests for insert with check (user_id = requesting_user_id());
