-- Migration: 20251229000000_granular_permissions.sql
-- Description: Adds granular permissions table, role_permissions join table, and extends profiles

-- 1. EXTEND PROFILES
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS department_id UUID, -- References a future departments table if needed, or just a generic ID for now
  ADD COLUMN IF NOT EXISTS organization_id UUID, -- References partner_orgs(id) probably
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Add index for organization lookups
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);

-- 2. RECREATE PERMISSIONS TABLE (Granular)
-- existing permissions table might be too simple, let's redefine it.
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.permissions;

CREATE TABLE public.permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- e.g., 'user_management', 'billing', 'reports'
  resource TEXT NOT NULL, -- e.g., 'users', 'invoices', 'audit_logs'
  action TEXT NOT NULL,   -- e.g., 'create', 'read', 'update', 'delete', 'approve'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(category, resource, action)
);

-- 3. ROLE PERMISSIONS JOIN TABLE
CREATE TABLE public.role_permissions (
  role_slug TEXT NOT NULL REFERENCES public.roles(slug) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (role_slug, permission_id)
);

-- 4. RLS POLICIES FOR PERMISSIONS & ROLE_PERMISSIONS

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Super Admins can do everything (handled by service role usually, but let's be explicit if they use client)
-- Actually, read access is needed for UI.
CREATE POLICY "Authenticated users can read permissions" ON public.permissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read role_permissions" ON public.role_permissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only Super Admins should be able to write (we'll enforce this via application logic or specific role check)
-- For now, relying on service role/admin dashboard policies.

-- 5. SEED INITIAL PERMISSIONS
INSERT INTO public.permissions (category, resource, action, description) VALUES
  -- User Management
  ('user_management', 'users', 'read', 'View user list'),
  ('user_management', 'users', 'create', 'Invite/create new users'),
  ('user_management', 'users', 'update', 'Edit user details'),
  ('user_management', 'users', 'delete', 'Deactivate/delete users'),
  
  -- Role Management
  ('system_management', 'roles', 'read', 'View roles and permissions'),
  ('system_management', 'roles', 'create', 'Create new roles'),
  ('system_management', 'roles', 'update', 'Edit roles'),
  ('system_management', 'roles', 'delete', 'Delete roles'),
  
  -- Billing
  ('billing', 'invoices', 'read', 'View invoices'),
  ('billing', 'invoices', 'pay', 'Pay invoices'),
  
  -- Audit
  ('system_management', 'audit_logs', 'read', 'View audit logs');

-- 6. ASSIGN PERMISSIONS TO ROLES (Seed)
-- Super Admin gets all permissions
INSERT INTO public.role_permissions (role_slug, permission_id)
SELECT 'super_admin', id FROM public.permissions;

-- Admin (Org Admin) gets user management
INSERT INTO public.role_permissions (role_slug, permission_id)
SELECT 'admin', id FROM public.permissions 
WHERE category = 'user_management' OR category = 'billing';

-- Manager gets read users
INSERT INTO public.role_permissions (role_slug, permission_id)
SELECT 'manager', id FROM public.permissions 
WHERE resource = 'users' AND action = 'read';

