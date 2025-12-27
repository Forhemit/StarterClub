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
ALTER TABLE IF EXISTS roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Roles are viewable by everyone" ON roles;
CREATE POLICY "Roles are viewable by everyone" ON roles FOR SELECT USING (true);

-- Permissions: Public read
ALTER TABLE IF EXISTS permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permissions are viewable by everyone" ON permissions;
CREATE POLICY "Permissions are viewable by everyone" ON permissions FOR SELECT USING (true);

-- Role Permissions: Public read
ALTER TABLE IF EXISTS role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Role permissions are viewable by everyone" ON role_permissions;
CREATE POLICY "Role permissions are viewable by everyone" ON role_permissions FOR SELECT USING (true);

-- User Roles: Users can see their own roles
ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (user_id = requesting_user_id());

-- Role Requests: Users can see/create their own requests
ALTER TABLE IF EXISTS role_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own requests" ON role_requests;
CREATE POLICY "Users can view own requests" ON role_requests FOR SELECT USING (user_id = requesting_user_id());

DROP POLICY IF EXISTS "Users can create requests" ON role_requests;
CREATE POLICY "Users can create requests" ON role_requests FOR INSERT WITH CHECK (user_id = requesting_user_id());
