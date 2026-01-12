-- Refactor Financial Resilience: Link to Core Companies
-- Replaces dependency on user_businesses with core_companies

BEGIN;

-- 1. Add company_id column
ALTER TABLE public.financial_resilience_profiles
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.core_companies(id);

-- 2. Backfill company_id
-- We find the Core Company that was created from the same 'user_business' logic.
-- Note: verified via core_companies.legacy_id field which holds the old ID.
UPDATE public.financial_resilience_profiles frp
SET company_id = cc.id
FROM public.core_companies cc
WHERE frp.user_business_id::text = cc.legacy_id
AND frp.company_id IS NULL;

-- 3. Add Index
CREATE INDEX IF NOT EXISTS idx_frp_company_id ON public.financial_resilience_profiles(company_id);

-- 4. Update RLS Policies
-- Allow access if the user has access to the linked Company (via Organization)
DROP POLICY IF EXISTS "Users can manage their own financial resilience profiles" ON public.financial_resilience_profiles;

CREATE POLICY "Manage resilience via Organization" ON public.financial_resilience_profiles
FOR ALL USING (
    -- Access if the linked company belongs to the user's organization
    company_id IN (
        SELECT id FROM public.core_companies
        WHERE organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
        OR organization_id IN (
             SELECT id FROM public.organizations WHERE owner_email = (auth.jwt() ->> 'email')
        )
    )
    OR
    -- Fallback for legacy rows not yet migrated (optional, but good for safety)
    (company_id IS NULL AND user_business_id IN (
        SELECT id FROM public.user_businesses WHERE user_id = auth.uid()
    ))
);

COMMIT;
