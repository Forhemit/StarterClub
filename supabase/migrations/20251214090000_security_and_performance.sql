-- =============================================================================
-- Migration: Security Fixes & Performance Improvements
-- Purpose: Fix mutable search paths, add missing indexes
-- =============================================================================

-- 1. SECURITY: Fix Mutable Search Paths
-- Explicitly set search_path to 'public, pg_catalog' or just 'pg_catalog' where appropriate
-- to prevent search path hijacking.

CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, pg_catalog
AS $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::text;
$$;

CREATE OR REPLACE FUNCTION public.current_jwt()
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path = public, pg_catalog
AS $$
  select nullif(current_setting('request.jwt.claims', true), '')::jsonb;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 2. PERFORMANCE: Add Missing Indexes
-- Foreign keys should generally be indexed to avoid sequential scans during joins/deletes.

-- partner_users(org_id)
CREATE INDEX IF NOT EXISTS idx_partner_users_org_id ON public.partner_users(org_id);

-- partner_submissions(org_id)
CREATE INDEX IF NOT EXISTS idx_partner_submissions_org_id ON public.partner_submissions(org_id);

-- calculator_runs(org_id)
CREATE INDEX IF NOT EXISTS idx_calculator_runs_org_id ON public.calculator_runs(org_id);

-- resource_assets(visibility) - commonly queried for filtering
CREATE INDEX IF NOT EXISTS idx_resource_assets_visibility ON public.resource_assets(visibility);

-- 3. GIN Indexes for JSONB
-- calculator_runs inputs/outputs might be queried. 
-- Adding a GIN index on 'inputs' as it's likely to be filtered on.
CREATE INDEX IF NOT EXISTS idx_calculator_runs_inputs ON public.calculator_runs USING gin (inputs);
