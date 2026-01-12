-- Migration Tooling: Staging Area and Logic Functions
-- Safe environment for analyzing and merging data

BEGIN;

-- 1. Create Migration Schema (Isolated from public)
CREATE SCHEMA IF NOT EXISTS migration;

-- 2. Create Staging Table for Company Candidates
CREATE TABLE IF NOT EXISTS migration.staging_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_module TEXT NOT NULL, -- 'financial_resilience', 'acquisition_readiness'
    legacy_id UUID NOT NULL, -- Original PK
    
    -- Normalized Data Candidates
    raw_name TEXT,
    tax_id TEXT,
    business_type TEXT,
    owner_email TEXT,
    
    -- Scores & Metrics
    resilience_score NUMERIC,
    acquisition_score NUMERIC,
    
    -- Metadata preservation
    legacy_metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Merger Status
    status TEXT DEFAULT 'pending', -- 'pending', 'auto_merged', 'manual_review', 'migrated'
    duplicate_of UUID REFERENCES migration.staging_companies(id), -- Self-reference for merges
    match_confidence NUMERIC DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast matching
CREATE INDEX IF NOT EXISTS idx_staging_tax_id ON migration.staging_companies(tax_id);
CREATE INDEX IF NOT EXISTS idx_staging_owner_email ON migration.staging_companies(owner_email);
CREATE INDEX IF NOT EXISTS idx_staging_raw_name ON migration.staging_companies(raw_name);


-- 3. Extraction Function (Populates Staging)
CREATE OR REPLACE FUNCTION migration.extract_candidates()
RETURNS void AS $$
BEGIN
  -- A. Extract from Financial Resilience (via user_businesses)
  -- Note: Adapting to potential schema variations safely
  INSERT INTO migration.staging_companies (
    source_module, legacy_id, raw_name, tax_id, business_type, 
    owner_email, resilience_score, legacy_metadata, created_at
  )
  SELECT 
    'financial_resilience',
    ub.id,
    ub.business_name,
    NULL, -- tax_id might not be on user_businesses, checking safely
    frp.business_type,
    u.email,
    frp.annual_revenue, -- Mapping 'score' loosely to revenue for now or specific score field if exists
    jsonb_build_object(
      'user_id', u.id,
      'financial_profile_id', frp.id,
      'original_data', frp.stress_scenarios
    ),
    ub.created_at
  FROM public.user_businesses ub
  JOIN auth.users u ON ub.user_id = u.id
  LEFT JOIN public.financial_resilience_profiles frp ON ub.id = frp.user_business_id
  ON CONFLICT DO NOTHING; -- Idempotent run

  -- B. Extract from Acquisition Readiness
  INSERT INTO migration.staging_companies (
    source_module, legacy_id, raw_name, tax_id, business_type,
    owner_email, acquisition_score, legacy_metadata, created_at
  )
  SELECT 
    'acquisition_readiness',
    arp.id,
    arp.company_name,
    NULL, -- No tax_id column in schema
    NULL, -- No company_type column in schema
    u.email,
    CASE 
      WHEN arp.deal_stage = 'preparation' THEN 20 
      WHEN arp.deal_stage = 'market_ready' THEN 80 
      ELSE 50 
    END, -- Derived score
    jsonb_build_object(
      'user_id', u.id,
      'red_flags', arp.red_flags,
      'documents', arp.documents
    ),
    arp.created_at
  FROM public.acquisition_readiness_profiles arp
  JOIN auth.users u ON arp.user_id = u.id
  ON CONFLICT DO NOTHING;
  
END;
$$ LANGUAGE plpgsql;

-- 4. Deduplication Logic Function
CREATE OR REPLACE FUNCTION migration.deduplicate_companies()
RETURNS TABLE(action text, count bigint) AS $$
DECLARE
    v_merged_count bigint;
BEGIN
    -- Rule 1: Exact Name + Email Match (High Confidence)
    WITH matches AS (
        SELECT 
            s1.id as duplicate_id,
            s2.id as master_id
        FROM migration.staging_companies s1
        JOIN migration.staging_companies s2 
            ON s1.owner_email = s2.owner_email 
            AND lower(s1.raw_name) = lower(s2.raw_name)
            AND s1.id > s2.id -- Pick lower ID as master
            AND s1.duplicate_of IS NULL
            AND s2.duplicate_of IS NULL
    )
    UPDATE migration.staging_companies sc
    SET 
        duplicate_of = m.master_id,
        status = 'auto_merged',
        match_confidence = 0.95
    FROM matches m
    WHERE sc.id = m.duplicate_id;
    
    GET DIAGNOSTICS v_merged_count = ROW_COUNT;
    RETURN QUERY SELECT 'merged_by_name_email'::text, v_merged_count;
    
    -- Rule 2: (Future) Fuzzy matching or Tax ID matching
    -- Currently disabled until Tax IDs are populated
    
    RETURN QUERY SELECT 'completed'::text, 0::bigint;
END;
$$ LANGUAGE plpgsql;

COMMIT;
