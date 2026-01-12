-- Seed Test Data and Run Full Migration Pipeline
-- This simulates a real migration run with mock data

BEGIN;

-- 1. Insert Mock Data into Staging (matching the test emails we saw)
INSERT INTO migration.staging_companies (source_module, legacy_id, raw_name, owner_email, status, business_type)
VALUES 
-- Matches 'partner_admin@test.com'
(
    'financial_resilience', 
    gen_random_uuid(), 
    'Partner Admin Corp', 
    'partner_admin@test.com', 
    'pending',
    'saas'
),
-- Matches 'company_admin@test.com'
(
    'acquisition_readiness', 
    gen_random_uuid(), 
    'Company Admin Ltd', 
    'company_admin@test.com', 
    'pending',
    'ecommerce'
),
-- Matches 'company_member1@test.com' (will create a separate org/company)
(
    'financial_resilience', 
    gen_random_uuid(), 
    'Member One LLC', 
    'company_member1@test.com', 
    'pending',
    'services'
)
ON CONFLICT DO NOTHING;



-- 2. Ensure Function Exists (Fix for missing function error)
CREATE OR REPLACE FUNCTION migration.migrate_to_core()
RETURNS TABLE(orgs_created bigint, companies_created bigint) AS $$
DECLARE
    v_orgs_count bigint;
    v_companies_count bigint;
BEGIN
    WITH new_orgs AS (
        INSERT INTO public.organizations (name, owner_email, created_at)
        SELECT DISTINCT 
            split_part(owner_email, '@', 1) || '''s Org',
            owner_email,
            MIN(created_at)
        FROM migration.staging_companies
        WHERE owner_email IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM public.organizations WHERE owner_email = staging_companies.owner_email)
        GROUP BY owner_email
        RETURNING id
    )
    SELECT COUNT(*) INTO v_orgs_count FROM new_orgs;

    WITH to_migrate AS (
        SELECT 
            sc.id as staging_id,
            o.id as target_org_id,
            sc.raw_name,
            sc.tax_id,
            sc.source_module,
            sc.legacy_id::text,
            sc.created_at
        FROM migration.staging_companies sc
        JOIN public.organizations o ON sc.owner_email = o.owner_email
        WHERE sc.duplicate_of IS NULL 
        AND sc.status IN ('pending', 'auto_merged')
    ),
    inserted_companies AS (
        INSERT INTO public.core_companies (
            organization_id, canonical_name, tax_id, source_module, legacy_id, created_at
        )
        SELECT 
            target_org_id,
            raw_name,
            tax_id,
            source_module,
            legacy_id,
            created_at
        FROM to_migrate
        RETURNING id, legacy_id
    )
    SELECT COUNT(*) INTO v_companies_count FROM inserted_companies;
    
    INSERT INTO public.organization_companies (organization_id, company_id, relationship_type, is_primary)
    SELECT 
        cc.organization_id,
        cc.id,
        'owner',
        TRUE
    FROM public.core_companies cc
    ON CONFLICT (organization_id, company_id) DO NOTHING;

    UPDATE migration.staging_companies
    SET status = 'migrated'
    WHERE duplicate_of IS NULL 
    AND status IN ('pending', 'auto_merged')
    AND EXISTS (
        SELECT 1 FROM public.core_companies 
        WHERE legacy_id = staging_companies.legacy_id::text
    );

    RETURN QUERY SELECT v_orgs_count, v_companies_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Execute the Pipeline Logic (in order)
DO $$
DECLARE
    v_deduped_count bigint;
    v_orgs_count bigint;
    v_companies_count bigint;
BEGIN
    -- A. Run Deduplication
    -- (We don't expect duplicates in this simple seed, but good to run)
    PERFORM migration.deduplicate_companies();
    RAISE NOTICE 'Deduplication complete';

    -- B. Migrate to Core
    -- Capture results (this query returns a row, so SELECT INTO works)
    SELECT orgs_created, companies_created 
    INTO v_orgs_count, v_companies_count
    FROM migration.migrate_to_core();
    
    RAISE NOTICE 'Migration Phase 2 complete. Orgs: %, Companies: %', v_orgs_count, v_companies_count;

    -- C. Sync Auth Metadata
    -- Re-run the update logic to link users to their newly created Core Organizations
    UPDATE auth.users au
    SET raw_app_meta_data = 
        COALESCE(raw_app_meta_data, '{}'::jsonb) || 
        jsonb_build_object(
            'organization_id', (
                SELECT id FROM public.organizations 
                WHERE owner_email = au.email 
                ORDER BY created_at ASC LIMIT 1
            ),
            'organization_role', 'owner'
        )
    WHERE au.email IN ('partner_admin@test.com', 'company_admin@test.com', 'company_member1@test.com');
    
    RAISE NOTICE 'Auth metadata synced for test users';
END;
$$;

COMMIT;
