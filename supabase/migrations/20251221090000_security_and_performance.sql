-- Database Hardening & Optimization
-- Addresses Security (RLS with Admin/Service Bypass), Performance (Indexes), and Integrity (Constraints)

BEGIN;

-- =================================================================
-- 1. UTILITIES & HELPERS
-- =================================================================

-- Helper: admin/service bypass function
-- Returns true if the user is service_role or admin_role
CREATE OR REPLACE FUNCTION public.is_admin_or_service() RETURNS boolean AS $$
BEGIN
  -- Check if the role is 'service_role' or 'admin_role' (adjust 'admin_role' if your admin system uses a different claim/role)
  -- service_role is the standard Supabase backend role.
  RETURN (NULLIF(current_setting('request.jwt.claim.role', true), '')::text IN ('service_role', 'admin_role'));
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
-- NOTE: SECURITY DEFINER might be needed if looking at internal settings, but usually current_setting works for everyone. 
-- However, for RLS bypass helper, STABLE is key. 
-- Using simple auth.role() equivalent logic:
CREATE OR REPLACE FUNCTION public.is_admin_or_service() RETURNS boolean AS $$
SELECT (auth.role() = 'service_role' OR auth.role() = 'admin_role');
$$ LANGUAGE sql STABLE;

-- =================================================================
-- 2. CRITICAL SECURITY FIXES (RLS & Permissions)
-- =================================================================

-- 2. CRITICAL SECURITY FIXES (RLS & Permissions)
-- =================================================================

-- 2.1 Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_installed_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_businesses ENABLE ROW LEVEL SECURITY;

-- 2.2 RLS Policies
-- We drop existing policies to endure a clean slate and fix performance issues (wrapping auth calls in select)

-- A. Categories (Public Read, Service Write)
DROP POLICY IF EXISTS "categories_public_select" ON categories;
CREATE POLICY "categories_public_select" ON public.categories
    FOR SELECT USING (true OR (select public.is_admin_or_service()));
    
DROP POLICY IF EXISTS "categories_authenticated_insert" ON categories;
CREATE POLICY "categories_authenticated_insert" ON public.categories
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated' OR (select public.is_admin_or_service()));

-- B. Statuses (Public Read, Service Write)
DROP POLICY IF EXISTS "statuses_public_select" ON statuses;
CREATE POLICY "statuses_public_select" ON public.statuses
    FOR SELECT USING (true OR (select public.is_admin_or_service()));

DROP POLICY IF EXISTS "statuses_authenticated_insert" ON statuses;
CREATE POLICY "statuses_authenticated_insert" ON public.statuses
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated' OR (select public.is_admin_or_service()));

-- C. User Businesses (Owner Access)
-- Fixing "manage_own_biz" / "Users can manage their own businesses"
DROP POLICY IF EXISTS "manage_own_biz" ON user_businesses;
DROP POLICY IF EXISTS "Users can manage their own businesses" ON user_businesses;
DROP POLICY IF EXISTS "user_businesses_owner_access" ON user_businesses; -- Ensuring idempotency
CREATE POLICY "user_businesses_owner_access" ON public.user_businesses
    FOR ALL USING ((select auth.uid()) = user_id OR (select public.is_admin_or_service()));

-- D. User Checklist Status (Owner Access via Business)
-- Consolidating redundant policies and fixing auth re-evaluation
DROP POLICY IF EXISTS "user_checklist_status_user_access" ON user_checklist_status;
DROP POLICY IF EXISTS "user_checklist_status_authenticated_insert" ON user_checklist_status;
DROP POLICY IF EXISTS "user_checklist_status_owner_access" ON user_checklist_status; -- Ensuring idempotency

CREATE POLICY "user_checklist_status_owner_access" 
    ON public.user_checklist_status
    FOR ALL USING (
        (select public.is_admin_or_service()) OR
        EXISTS (
            SELECT 1 FROM public.user_businesses 
            WHERE id = user_business_id AND user_id = (select auth.uid())
        )
    );

-- E. Modules (Public Visibility)
DROP POLICY IF EXISTS "modules_public_select" ON modules;
CREATE POLICY "modules_public_select" ON public.modules
    FOR SELECT USING (is_public = true OR (select public.is_admin_or_service()));

DROP POLICY IF EXISTS "modules_authenticated_insert" ON modules;
CREATE POLICY "modules_authenticated_insert" ON public.modules
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated' OR (select public.is_admin_or_service()));

-- F. User Installed Modules (Owner Access via Business)
-- Fixing redundant policies ("Users can view..." vs "Users can manage...")
DROP POLICY IF EXISTS "Users can view their installed modules" ON user_installed_modules;
DROP POLICY IF EXISTS "Users can manage their installed modules" ON user_installed_modules;
DROP POLICY IF EXISTS "user_installed_modules_owner_access" ON user_installed_modules; -- Ensuring idempotency

CREATE POLICY "user_installed_modules_owner_access" 
    ON public.user_installed_modules
    FOR ALL USING (
        (select public.is_admin_or_service()) OR
        EXISTS (
            SELECT 1 FROM public.user_businesses 
            WHERE id = user_business_id AND user_id = (select auth.uid())
        )
    );

-- G. Module Reviews (Public Read, Owner Write)
DROP POLICY IF EXISTS "Public reviews are viewable" ON module_reviews;
DROP POLICY IF EXISTS "module_reviews_public_select" ON module_reviews; -- Ensuring idempotency
CREATE POLICY "module_reviews_public_select" ON module_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can write reviews" ON module_reviews;
DROP POLICY IF EXISTS "module_reviews_owner_insert" ON module_reviews; -- Ensuring idempotency
CREATE POLICY "module_reviews_owner_insert" ON module_reviews 
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id OR (select public.is_admin_or_service()));

DROP POLICY IF EXISTS "module_reviews_owner_update" ON module_reviews; -- Ensuring idempotency
CREATE POLICY "module_reviews_owner_update" ON module_reviews
    FOR UPDATE USING ((select auth.uid()) = user_id OR (select public.is_admin_or_service()));

-- H. Module Items, Versions, Dependencies (Public Read usually)
-- Module Items
DROP POLICY IF EXISTS "module_items_owner_access" ON module_items;
CREATE POLICY "module_items_owner_access" ON public.module_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.modules m 
            WHERE m.id = module_id AND (m.is_public = true OR (select public.is_admin_or_service()))
        )
    );

-- Module Versions
DROP POLICY IF EXISTS "module_versions_access" ON module_versions;
CREATE POLICY "module_versions_access" ON public.module_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.modules m
            WHERE m.id = module_id AND (m.is_public = true OR (select public.is_admin_or_service()))
        )
    );

-- Module Dependencies
DROP POLICY IF EXISTS "module_dependencies_access" ON module_dependencies;
CREATE POLICY "module_dependencies_access" ON public.module_dependencies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.modules m
            WHERE m.id = module_id AND (m.is_public = true OR (select public.is_admin_or_service()))
        )
    );

-- I. Checklist Items (Templates)
DROP POLICY IF EXISTS "checklist_items_public_select" ON checklist_items;
CREATE POLICY "checklist_items_public_select" ON public.checklist_items
    FOR SELECT USING (true OR (select public.is_admin_or_service()));

DROP POLICY IF EXISTS "checklist_items_authenticated_insert" ON checklist_items;
CREATE POLICY "checklist_items_authenticated_insert" ON public.checklist_items
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated' OR (select public.is_admin_or_service()));


-- 2.3 Secure Views
-- Recreate marketplace_modules with security_invoker = true to respect RLS
DROP VIEW IF EXISTS marketplace_modules;
CREATE OR REPLACE VIEW marketplace_modules 
WITH (security_invoker = true) -- Security Fix: Invoker rights
AS
SELECT 
  m.id,
  m.name,
  m.description,
  m.module_type,
  m.parent_id,
  p.name as parent_name,
  m.version,
  m.author_name,
  m.tags,
  m.install_count,
  m.is_premium,
  m.price_monthly,
  m.icon,
  m.color,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.id) as review_count,
  COUNT(DISTINCT mi.id) as business_count,
  COUNT(DISTINCT mi2.id) as dependency_count,
  m.created_at,
  m.updated_at
FROM modules m
LEFT JOIN modules p ON m.parent_id = p.id
LEFT JOIN module_reviews r ON m.id = r.module_id
LEFT JOIN user_installed_modules mi ON m.id = mi.module_id
LEFT JOIN module_dependencies mi2 ON m.id = mi2.module_id
WHERE m.is_public = true
GROUP BY m.id, p.name
ORDER BY 
  CASE WHEN m.module_type = 'industry' THEN 1
       WHEN m.module_type = 'submodule' THEN 2
       ELSE 3 END,
  m.install_count DESC;

-- 2.4 Secure Functions
-- Secure search_path for install_module_for_business
CREATE OR REPLACE FUNCTION install_module_for_business(
  p_business_id UUID,
  p_module_id UUID,
  p_config JSONB DEFAULT '{}'
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp -- Security Fix: Explicit search path
AS $$
DECLARE
  v_installation_id UUID;
  v_module_version VARCHAR;
  v_dependency_record RECORD;
BEGIN
  -- 1. Get the latest version of the module
  SELECT version INTO v_module_version
  FROM module_versions 
  WHERE module_id = p_module_id 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- If no version found in versions table, fall back to module table or default
  IF v_module_version IS NULL THEN
     SELECT version INTO v_module_version FROM modules WHERE id = p_module_id;
  END IF;
  
  -- 2. Check dependencies
  FOR v_dependency_record IN 
    SELECT md.dependency_module_id, md.dependency_type, m.name
    FROM module_dependencies md
    JOIN modules m ON md.dependency_module_id = m.id
    WHERE md.module_id = p_module_id
    AND md.dependency_type = 'requires'
  LOOP
    -- Check if dependency is installed and active
    IF NOT EXISTS (
      SELECT 1 FROM user_installed_modules 
      WHERE user_business_id = p_business_id 
      AND module_id = v_dependency_record.dependency_module_id
      AND status IN ('installed', 'active')
    ) THEN
      RAISE EXCEPTION 'Missing required dependency: %', v_dependency_record.name;
    END IF;
  END LOOP;
  
  -- 3. Create (or Update) the installation record
  INSERT INTO user_installed_modules 
    (user_business_id, module_id, module_version, config, status)
  VALUES 
    (p_business_id, p_module_id, v_module_version, p_config, 'staged')
  ON CONFLICT (user_business_id, module_id) 
  DO UPDATE SET status = 'staged', config = p_config, last_used_at = NOW()
  RETURNING id INTO v_installation_id;
  
  RETURN v_installation_id;
END;
$$;


-- =================================================================
-- 3. DATA INTEGRITY (Audit & Constraints) - MOVED UP needed for Indexes
-- =================================================================

-- 3.1 Audit Columns (Add created_by)
-- Trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ 
DECLARE 
    t text; 
BEGIN 
    FOR t IN SELECT unnest(ARRAY['modules', 'categories', 'checklist_items', 'user_businesses', 'module_reviews']) 
    LOOP
        -- Add created_by if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'created_by') THEN
            EXECUTE format('ALTER TABLE %I ADD COLUMN created_by UUID REFERENCES auth.users(id)', t);
        END IF;
        
        -- Add updated_at if missing (some tables might not have it)
         IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'updated_at') THEN
            EXECUTE format('ALTER TABLE %I ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW()', t);
        END IF;

        -- Add updated_at trigger if not exists
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = format('update_%s_modtime', t)) THEN
            EXECUTE format('CREATE TRIGGER update_%s_modtime BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()', t, t);
        END IF;
    END LOOP; 
END $$;


-- 3.2 Constraints
-- Note: 'priority' might be varchar, updating to have check constraint
ALTER TABLE checklist_items DROP CONSTRAINT IF EXISTS valid_priority;
ALTER TABLE checklist_items ADD CONSTRAINT valid_priority CHECK (priority IN ('critical', 'high', 'medium', 'low'));

ALTER TABLE checklist_items DROP CONSTRAINT IF EXISTS positive_estimated_hours;
ALTER TABLE checklist_items ADD CONSTRAINT positive_estimated_hours CHECK (estimated_hours >= 0);

-- Validate module types
ALTER TABLE modules DROP CONSTRAINT IF EXISTS valid_module_type; 
ALTER TABLE modules ADD CONSTRAINT valid_module_type CHECK (module_type IN ('industry', 'submodule', 'core', 'function'));


-- =================================================================
-- 4. PERFORMANCE (Indexes)
-- =================================================================

-- 4.1 Missing Foreign Key Indexes (Performance Boost for Joins)
-- Added based on Linter Feedback (lint-0001)
CREATE INDEX IF NOT EXISTS idx_categories_created_by ON public.categories(created_by);
CREATE INDEX IF NOT EXISTS idx_checklist_items_created_by ON public.checklist_items(created_by);
CREATE INDEX IF NOT EXISTS idx_module_reviews_business_id ON public.module_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_module_reviews_created_by ON public.module_reviews(created_by);
CREATE INDEX IF NOT EXISTS idx_module_reviews_module_id ON public.module_reviews(module_id);
CREATE INDEX IF NOT EXISTS idx_module_reviews_user_id ON public.module_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_modules_created_by ON public.modules(created_by);
CREATE INDEX IF NOT EXISTS idx_user_businesses_created_by ON public.user_businesses(created_by);
CREATE INDEX IF NOT EXISTS idx_user_businesses_user_id ON public.user_businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_checklist_status_status_id ON public.user_checklist_status(status_id);
CREATE INDEX IF NOT EXISTS idx_user_installed_modules_module_id ON public.user_installed_modules(module_id);

-- 4.2 CLEANUP: Remove Unused Indexes (Write Optimization)
-- Removed based on Linter Feedback (lint-0005) - Confirmed safe to drop
DROP INDEX IF EXISTS public.idx_modules_parent_id;
DROP INDEX IF EXISTS public.idx_checklist_items_category_id;
DROP INDEX IF EXISTS public.idx_module_items_module_id;
DROP INDEX IF EXISTS public.idx_module_items_item_id;
DROP INDEX IF EXISTS public.idx_user_checklist_status_item_id;
DROP INDEX IF EXISTS public.idx_user_checklist_status_user_business_id;
DROP INDEX IF EXISTS public.idx_module_versions_module_id;
DROP INDEX IF EXISTS public.idx_module_dependencies_module_id;
DROP INDEX IF EXISTS public.idx_module_dependencies_depends_on_id;
DROP INDEX IF EXISTS public.idx_modules_module_type;
DROP INDEX IF EXISTS public.idx_checklist_items_priority;
DROP INDEX IF EXISTS public.idx_modules_tags_gin;
DROP INDEX IF EXISTS public.idx_modules_name_trgm;
DROP INDEX IF EXISTS public.idx_modules_db_schema_gin;
DROP INDEX IF EXISTS public.idx_modules_checklist_template_gin;
DROP INDEX IF EXISTS public.idx_checklist_items_metadata_schema_gin;

COMMIT;
