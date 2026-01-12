-- Core Schema Setup: Organizations and Unified Companies
-- Enables the "Modular Monolith" architecture

BEGIN;

-- 1. Create Organizations Table (The root of all permissions)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_email TEXT, -- Initial owner, used for mapping
    slug TEXT UNIQUE, -- For URL routing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata handling
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Create Core Companies Table (The single source of truth)
CREATE TABLE IF NOT EXISTS public.core_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    
    -- Identity fields
    canonical_name TEXT NOT NULL, -- The "Display Name"
    legal_name TEXT,
    tax_id TEXT, -- EIN/SSN/VAT used for deduplication
    
    -- Metadata
    source_module TEXT, -- 'financial_resilience', 'acquisition', 'direct', etc.
    legacy_id TEXT, -- ID from the original siloed table
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ, -- Soft delete support
    
    CONSTRAINT unique_tax_id_per_org UNIQUE (organization_id, tax_id)
);

-- 3. Create Organization <> Companies Link Table (Many-to-Many)
-- Allows a company to be shared/accessed by multiple orgs (e.g. Accountant + Business Owner)
CREATE TABLE IF NOT EXISTS public.organization_companies (
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.core_companies(id) ON DELETE CASCADE,
    
    relationship_type TEXT CHECK (relationship_type IN ('owner', 'subsidiary', 'client', 'partner')),
    is_primary BOOLEAN DEFAULT FALSE,
    
    permissions JSONB DEFAULT '{}'::jsonb, -- Granular overrides
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (organization_id, company_id)
);

-- 4. Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_companies ENABLE ROW LEVEL SECURITY;

-- 5. Create Indexes for Common Lookups
CREATE INDEX IF NOT EXISTS idx_core_companies_org ON public.core_companies(organization_id);
CREATE INDEX IF NOT EXISTS idx_core_companies_tax_id ON public.core_companies(tax_id);
CREATE INDEX IF NOT EXISTS idx_org_companies_company ON public.organization_companies(company_id);

-- 6. Trigger for Updated At
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_orgs
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_timestamp_companies
  BEFORE UPDATE ON public.core_companies
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

COMMIT;
