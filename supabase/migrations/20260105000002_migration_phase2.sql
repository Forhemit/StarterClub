-- Phase 2: Core Migration Logic
-- Moves data from 'migration.staging_companies' -> 'public.organizations' & 'public.core_companies'

BEGIN;

CREATE OR REPLACE FUNCTION migration.migrate_to_core()
RETURNS TABLE(orgs_created bigint, companies_created bigint) AS $$
DECLARE
    v_orgs_count bigint;
    v_companies_count bigint;
BEGIN
    -- 1. Create Organizations (User-Centric Strategy)
    -- One Organization per unique Owner Email in staging
    -- If the user already belongs to an org (in profiles/metadata), we might want to respect that,
    -- but for this migration, we ensure every staging owner has an Org.
    
    WITH new_orgs AS (
        INSERT INTO public.organizations (name, owner_email, created_at)
        SELECT DISTINCT 
            split_part(owner_email, '@', 1) || '''s Org', -- Default Name: "stephen's Org"
            owner_email,
            MIN(created_at)
        FROM migration.staging_companies
        WHERE owner_email IS NOT NULL
        -- Check if org doesn't already exist for this email (simple check)
        AND NOT EXISTS (SELECT 1 FROM public.organizations WHERE owner_email = staging_companies.owner_email)
        GROUP BY owner_email
        RETURNING id
    )
    SELECT COUNT(*) INTO v_orgs_count FROM new_orgs;

    -- 2. Create Core Companies
    -- Only migrate 'pending' or 'auto_merged' records (that are not duplicates themselves)
    -- Map them to the Organization owned by their owner_email
    
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
        WHERE sc.duplicate_of IS NULL -- Only masters
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
    
    -- 3. Link Companies to Organizations (Owner Relationship)
    INSERT INTO public.organization_companies (organization_id, company_id, relationship_type, is_primary)
    SELECT 
        cc.organization_id,
        cc.id,
        'owner',
        TRUE
    FROM public.core_companies cc
    -- Optimization: Only link recently inserted ones if needed, but safe to ignore conflicts
    ON CONFLICT (organization_id, company_id) DO NOTHING;

    -- 4. Mark Staging as Migrated
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

COMMIT;
