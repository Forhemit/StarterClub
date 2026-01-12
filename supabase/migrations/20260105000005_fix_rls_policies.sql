-- Secure Core Schema: Add RLS Policies
-- Ensures users only see their own Organization and Companies

BEGIN;

-- 1. Policies for Organizations
DROP POLICY IF EXISTS "Users can view own organization" ON public.organizations;

CREATE POLICY "Users can view own organization" ON public.organizations
FOR SELECT USING (
  -- Option A: They are the owner (stored in email claim)
  owner_email = (auth.jwt() ->> 'email')
  OR
  -- Option B: They have the organization_id in their JWT (from Auth Hook)
  id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
);

-- 2. Policies for Core Companies
DROP POLICY IF EXISTS "Users can view org companies" ON public.core_companies;

CREATE POLICY "Users can view org companies" ON public.core_companies
FOR SELECT USING (
  -- The company belongs to the user's active organization
  organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
  OR
  -- Fallback: The user owns the organization that owns the company
  organization_id IN (
    SELECT id FROM public.organizations 
    WHERE owner_email = (auth.jwt() ->> 'email')
  )
);

-- 3. Policies for Organization <-> Company Link
DROP POLICY IF EXISTS "Users can view org links" ON public.organization_companies;

CREATE POLICY "Users can view org links" ON public.organization_companies
FOR SELECT USING (
  organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
  OR
  organization_id IN (
    SELECT id FROM public.organizations 
    WHERE owner_email = (auth.jwt() ->> 'email')
  )
);

COMMIT;
