-- Migration: 20251228000000_enhanced_rbac.sql
-- Description: Comprehensive role management system with history and multi-role support

-- 1. CLEANUP & PREP
-- Drop existing objects to ensure clean state (careful in prod, acceptable here for full schema rewrite)
DROP TRIGGER IF EXISTS trigger_update_profile_roles ON public.user_roles;
DROP TRIGGER IF EXISTS trigger_log_role_history ON public.user_roles;
DROP FUNCTION IF EXISTS update_profile_roles();
DROP FUNCTION IF EXISTS log_role_history();
DROP FUNCTION IF EXISTS assign_user_roles(TEXT, TEXT[], TEXT, TEXT);
DROP FUNCTION IF EXISTS get_user_role_timeline(TEXT, TIMESTAMP, TIMESTAMP);
DROP TABLE IF EXISTS public.role_history;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.roles CASCADE;

-- ============================================
-- 2. ROLES TABLE (Static role definitions)
-- ============================================
CREATE TABLE public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  permission_level INTEGER DEFAULT 0, -- Higher = more permissions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed all roles
INSERT INTO public.roles (name, slug, description, is_system_role, permission_level) VALUES
  ('Super Admin', 'super_admin', 'Full system access with admin privileges', true, 100),
  ('Admin', 'admin', 'System administrator', true, 90),
  ('Manager', 'manager', 'Team manager', true, 80),
  ('Employee', 'employee', 'Company employee access', true, 70),
  ('Member', 'member', 'Regular platform member', false, 60),
  ('Partner', 'partner', 'Business partner with special access', false, 50),
  ('Sponsor', 'sponsor', 'Sponsor with visibility privileges', false, 40),
  ('Guest', 'guest', 'Limited guest access', true, 10);

-- Enable RLS on roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- RLS: Public read access for roles (needed for UI)
CREATE POLICY "Anyone can read roles" ON public.roles
  FOR SELECT USING (true);


-- ============================================
-- 3. USER ROLES TABLE (Main role assignments)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  role_slug TEXT NOT NULL REFERENCES public.roles(slug) ON DELETE CASCADE,
  
  -- Status flags
  is_active BOOLEAN DEFAULT TRUE,
  is_primary BOOLEAN DEFAULT FALSE, -- Primary role for UI/display
  
  -- Historical tracking
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by TEXT, -- Who assigned this role (clerk_user_id or system)
  assigned_reason TEXT, -- Why was this role assigned?
  
  -- Role lifecycle
  effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  effective_until TIMESTAMP WITH TIME ZONE, -- NULL = indefinite
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by TEXT,
  revoked_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb, -- Flexible field for role-specific data
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(clerk_user_id, role_slug, effective_from),
  
  -- Check that effective dates make sense
  CONSTRAINT valid_effective_dates CHECK (
    effective_until IS NULL OR effective_from < effective_until
  ),
  CONSTRAINT valid_revocation CHECK (
    (revoked_at IS NULL) OR (revoked_at >= assigned_at)
  )
);

-- Indexes for performance
CREATE INDEX idx_user_roles_clerk_user_id ON public.user_roles(clerk_user_id);
CREATE INDEX idx_user_roles_role_slug ON public.user_roles(role_slug);
CREATE INDEX idx_user_roles_active ON public.user_roles(clerk_user_id) WHERE is_active = TRUE;
CREATE INDEX idx_user_roles_primary ON public.user_roles(clerk_user_id) WHERE is_primary = TRUE;
CREATE INDEX idx_user_roles_effective ON public.user_roles(clerk_user_id, effective_from, effective_until);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can see their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (
    clerk_user_id = (auth.jwt() ->> 'sub')
  );

-- RLS: Service role management (implicit full access, but being explicit doesn't hurt if we use a specific service user)
-- Note: 'postgres' role and service_role bypass RLS, but if we access via tailored clients:
CREATE POLICY "Service role manages all roles" ON public.user_roles
  USING (true)
  WITH CHECK (true);


-- ============================================
-- 4. ROLE HISTORY TABLE (Audit log)
-- ============================================
CREATE TABLE public.role_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL,
  clerk_user_id TEXT NOT NULL,
  role_slug TEXT NOT NULL,
  
  -- What changed
  action TEXT NOT NULL CHECK (action IN ('assigned', 'activated', 'deactivated', 'revoked', 'primary_changed', 'metadata_updated')),
  old_value JSONB,
  new_value JSONB,
  
  -- Who did it
  performed_by TEXT, -- clerk_user_id of who made the change
  performed_by_system BOOLEAN DEFAULT FALSE, -- Was this an automated system action?
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on role_history
ALTER TABLE public.role_history ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read their own history
CREATE POLICY "Users can read own history" ON public.role_history
  FOR SELECT USING (
    clerk_user_id = (auth.jwt() ->> 'sub')
  );


-- ============================================
-- 5. UPDATE PROFILES (Ensure columns exist)
-- ============================================
-- Make sure profile tracking columns exist
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role_slug TEXT REFERENCES public.roles(slug),
  ADD COLUMN IF NOT EXISTS active_roles TEXT[],
  ADD COLUMN IF NOT EXISTS primary_role TEXT,
  ADD COLUMN IF NOT EXISTS highest_permission_level INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_role_change_at TIMESTAMP WITH TIME ZONE;


-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update profile role arrays
CREATE OR REPLACE FUNCTION update_profile_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profiles table with current active roles
  UPDATE public.profiles p
  SET 
    active_roles = (
      SELECT array_agg(DISTINCT ur.role_slug)
      FROM public.user_roles ur
      WHERE ur.clerk_user_id = NEW.clerk_user_id
        AND ur.is_active = TRUE
        AND (ur.effective_until IS NULL OR ur.effective_until > NOW())
        AND ur.effective_from <= NOW()
    ),
    primary_role = (
      SELECT ur.role_slug
      FROM public.user_roles ur
      WHERE ur.clerk_user_id = NEW.clerk_user_id
        AND ur.is_primary = TRUE
        AND ur.is_active = TRUE
        AND (ur.effective_until IS NULL OR ur.effective_until > NOW())
        AND ur.effective_from <= NOW()
      LIMIT 1
    ),
    highest_permission_level = (
      SELECT MAX(r.permission_level)
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_slug = r.slug
      WHERE ur.clerk_user_id = NEW.clerk_user_id
        AND ur.is_active = TRUE
        AND (ur.effective_until IS NULL OR ur.effective_until > NOW())
        AND ur.effective_from <= NOW()
    ),
    last_role_change_at = NOW(),
    updated_at = NOW()
  WHERE p.id = NEW.clerk_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Use Security Definer to allow updating profiles even if user lacks direct write access

-- Trigger on user_roles changes
CREATE TRIGGER trigger_update_profile_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_roles();

-- Function to log role history
CREATE OR REPLACE FUNCTION log_role_history()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  old_val JSONB;
  new_val JSONB;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'assigned';
    new_val := jsonb_build_object(
      'is_active', NEW.is_active,
      'is_primary', NEW.is_primary,
      'effective_from', NEW.effective_from,
      'effective_until', NEW.effective_until
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check what changed
    IF OLD.is_active != NEW.is_active THEN
      action_type := CASE WHEN NEW.is_active THEN 'activated' ELSE 'deactivated' END;
    ELSIF OLD.is_primary != NEW.is_primary THEN
      action_type := 'primary_changed';
    ELSIF OLD.metadata != NEW.metadata THEN
      action_type := 'metadata_updated';
    ELSIF NEW.revoked_at IS NOT NULL AND OLD.revoked_at IS NULL THEN
      action_type := 'revoked';
    ELSE
      action_type := 'metadata_updated';
    END IF;
    
    old_val := jsonb_build_object(
      'is_active', OLD.is_active,
      'is_primary', OLD.is_primary,
      'metadata', OLD.metadata
    );
    new_val := jsonb_build_object(
      'is_active', NEW.is_active,
      'is_primary', NEW.is_primary,
      'metadata', NEW.metadata
    );
  END IF;
  
  -- Insert into history
  INSERT INTO public.role_history (
    user_role_id,
    clerk_user_id,
    role_slug,
    action,
    old_value,
    new_value,
    performed_by,
    performed_by_system
  ) VALUES (
    NEW.id,
    NEW.clerk_user_id,
    NEW.role_slug,
    action_type,
    old_val,
    new_val,
    current_setting('role_history.performed_by', TRUE),
    COALESCE(current_setting('role_history.performed_by_system', TRUE), 'false')::BOOLEAN
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 

-- Trigger for role history logging
CREATE TRIGGER trigger_log_role_history
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION log_role_history();

-- ============================================
-- 7. API FUNCTIONS
-- ============================================

-- Function to assign multiple roles to a user
CREATE OR REPLACE FUNCTION assign_user_roles(
  p_clerk_user_id TEXT,
  p_role_slugs TEXT[],
  p_assigned_by TEXT DEFAULT 'system',
  p_assigned_reason TEXT DEFAULT 'Initial assignment'
)
RETURNS JSONB AS $$
DECLARE
  role_slug_iter TEXT; -- Renamed variable to avoid collision with column name
  result JSONB := '{"assigned": [], "skipped": []}'::JSONB;
BEGIN
  -- Set context for history logging
  PERFORM set_config('role_history.performed_by', p_assigned_by, FALSE);
  PERFORM set_config('role_history.performed_by_system', 
    CASE WHEN p_assigned_by = 'system' THEN 'true' ELSE 'false' END, FALSE);
  
  FOREACH role_slug_iter IN ARRAY p_role_slugs
  LOOP
    -- Check if role exists
    IF EXISTS (SELECT 1 FROM public.roles WHERE slug = role_slug_iter) THEN
      -- Check if user already has this role active
      IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE clerk_user_id = p_clerk_user_id 
          AND role_slug = role_slug_iter
          AND is_active = TRUE
          AND (effective_until IS NULL OR effective_until > NOW())
      ) THEN
        -- Assign the role
        INSERT INTO public.user_roles (
          clerk_user_id,
          role_slug,
          assigned_by,
          assigned_reason,
          is_primary
        ) VALUES (
          p_clerk_user_id,
          role_slug_iter,
          p_assigned_by,
          p_assigned_reason,
          -- Make first role primary if no primary exists
          NOT EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE clerk_user_id = p_clerk_user_id AND is_primary = TRUE AND is_active = TRUE
          )
        );
        
        result := jsonb_set(result, '{assigned}', result->'assigned' || to_jsonb(role_slug_iter));
      ELSE
        result := jsonb_set(result, '{skipped}', result->'skipped' || to_jsonb(role_slug_iter));
      END IF;
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role timeline
CREATE OR REPLACE FUNCTION get_user_role_timeline(
  p_clerk_user_id TEXT,
  p_start_date TIMESTAMP DEFAULT NOW() - INTERVAL '1 year',
  p_end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
  date DATE,
  role_slug TEXT,
  is_active BOOLEAN,
  action TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      p_start_date::date, 
      p_end_date::date, 
      '1 day'::interval
    )::date as date
  )
  SELECT 
    ds.date,
    ur.role_slug,
    (ur.is_active AND 
      ds.date BETWEEN ur.effective_from::date 
      AND COALESCE(ur.effective_until::date, '9999-12-31'::date)) as is_active,
    rh.action
  FROM date_series ds
  LEFT JOIN public.user_roles ur ON 
    ur.clerk_user_id = p_clerk_user_id AND
    ds.date BETWEEN ur.assigned_at::date AND COALESCE(ur.revoked_at::date, '9999-12-31'::date)
  LEFT JOIN public.role_history rh ON 
    rh.user_role_id = ur.id AND
    DATE(rh.created_at) = ds.date
  ORDER BY ds.date DESC, ur.role_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
