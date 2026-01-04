-- =============================================
-- CREDIT COMMAND SYSTEM SCHEMA
-- Migration: 20260102000000_credit_command_schema.sql
-- =============================================

-- 1. PERSONAL CREDIT PROFILES (Module 1: The Guardian)
CREATE TABLE IF NOT EXISTS personal_credit_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    
    -- Personal Identity
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    ssn_last_four VARCHAR(4), -- Only store last 4 digits
    date_of_birth DATE,
    current_address TEXT,
    
    -- Verification Status
    is_identity_verified BOOLEAN DEFAULT FALSE,
    
    -- Gardening Mode
    gardening_mode_enabled BOOLEAN DEFAULT FALSE,
    gardening_mode_start_date DATE,
    
    -- Scores (manual entry)
    fico_8_experian INT,
    fico_8_transunion INT,
    fico_8_equifax INT,
    vantage_3_score INT,
    
    -- Score Date
    scores_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT unique_user_personal_credit UNIQUE (user_id)
);

-- 2. BUSINESS CREDIT PROFILES (Module 2: The Tycoon)
CREATE TABLE IF NOT EXISTS business_credit_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    
    -- Business Identity
    legal_business_name VARCHAR(255),
    dba_name VARCHAR(255),
    ein_last_four VARCHAR(4), -- Only store last 4 digits
    entity_type VARCHAR(50), -- LLC, Corp, Sole Prop, Partnership
    formation_state VARCHAR(2),
    formation_date DATE,
    
    -- Bureau IDs
    duns_number VARCHAR(20),
    experian_bin VARCHAR(20),
    
    -- COMPLIANCE FLAGS (Critical for business credit)
    is_sos_active BOOLEAN DEFAULT FALSE,
    is_ein_verified BOOLEAN DEFAULT FALSE,
    is_411_listed BOOLEAN DEFAULT FALSE,
    is_address_commercial BOOLEAN DEFAULT FALSE,
    naics_code VARCHAR(10),
    naics_risk_level VARCHAR(20), -- 'low', 'medium', 'high'
    
    -- Compliance Score (0-100)
    compliance_score INT DEFAULT 0,
    
    -- Business Scores (manual entry)
    paydex_score INT, -- Target 80+
    intelliscore_plus INT,
    fico_sbss INT,
    
    -- Score Date
    scores_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Tier Progress
    current_tier INT DEFAULT 0, -- 0=Not Started, 1-4=Tier Level
    tier_1_complete BOOLEAN DEFAULT FALSE,
    tier_2_complete BOOLEAN DEFAULT FALSE,
    tier_3_complete BOOLEAN DEFAULT FALSE,
    tier_4_complete BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT unique_user_business_credit UNIQUE (user_id)
);

-- 3. TRADELINES (Unified for Personal & Business)
CREATE TABLE IF NOT EXISTS credit_tradelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    
    -- Link to profiles (one will be null)
    personal_profile_id UUID REFERENCES personal_credit_profiles(id) ON DELETE CASCADE,
    business_profile_id UUID REFERENCES business_credit_profiles(id) ON DELETE CASCADE,
    
    -- Core Account Data
    creditor_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50), -- 'revolving', 'installment', 'net-30', 'net-60', 'mortgage'
    account_status VARCHAR(50), -- 'open', 'closed', 'collection', 'chargeoff'
    
    -- Financials
    credit_limit DECIMAL(12,2),
    current_balance DECIMAL(12,2),
    minimum_payment DECIMAL(12,2),
    
    -- Dates
    date_opened DATE,
    last_payment_date DATE,
    statement_close_date INT, -- Day of month (1-31)
    
    -- CATEGORIZATION FLAGS
    is_business_credit BOOLEAN DEFAULT FALSE,
    tier_level INT DEFAULT 0, -- For Business: 1 (Net-30) to 4 (Corp)
    
    -- CROSS-MODULE LINKING (The Bridge)
    has_personal_guarantee BOOLEAN DEFAULT FALSE,
    reports_to_personal BOOLEAN DEFAULT FALSE, -- e.g., CapOne Spark
    
    -- Reporting Bureaus
    reports_to_experian BOOLEAN DEFAULT FALSE,
    reports_to_transunion BOOLEAN DEFAULT FALSE,
    reports_to_equifax BOOLEAN DEFAULT FALSE,
    reports_to_dnb BOOLEAN DEFAULT FALSE, -- Dun & Bradstreet
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT at_least_one_profile CHECK (
        personal_profile_id IS NOT NULL OR business_profile_id IS NOT NULL
    )
);

-- 4. CREDIT SCORE HISTORY (Versioning)
CREATE TABLE IF NOT EXISTS credit_score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    
    -- Link to profiles
    personal_profile_id UUID REFERENCES personal_credit_profiles(id) ON DELETE CASCADE,
    business_profile_id UUID REFERENCES business_credit_profiles(id) ON DELETE CASCADE,
    
    -- Score Details
    bureau VARCHAR(50) NOT NULL, -- 'experian', 'transunion', 'equifax', 'dnb'
    scoring_model VARCHAR(50) NOT NULL, -- 'FICO 8', 'FICO 2', 'Vantage 3.0', 'PAYDEX', 'Intelliscore'
    score_value INT NOT NULL,
    score_date DATE DEFAULT CURRENT_DATE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INQUIRIES (Hard/Soft Pulls)
CREATE TABLE IF NOT EXISTS credit_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    
    -- Link to profiles
    personal_profile_id UUID REFERENCES personal_credit_profiles(id) ON DELETE CASCADE,
    business_profile_id UUID REFERENCES business_credit_profiles(id) ON DELETE CASCADE,
    
    -- Inquiry Details
    creditor_name VARCHAR(255) NOT NULL,
    inquiry_date DATE NOT NULL,
    is_hard_pull BOOLEAN DEFAULT TRUE,
    
    -- Bureau
    bureau VARCHAR(50), -- 'experian', 'transunion', 'equifax'
    
    -- Impact tracking (hard pulls affect score for 12 months, visible for 24)
    impact_ends_date DATE,
    visibility_ends_date DATE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_personal_credit_user ON personal_credit_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_credit_user ON business_credit_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tradelines_user ON credit_tradelines(user_id);
CREATE INDEX IF NOT EXISTS idx_tradelines_personal ON credit_tradelines(personal_profile_id);
CREATE INDEX IF NOT EXISTS idx_tradelines_business ON credit_tradelines(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_score_history_user ON credit_score_history(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user ON credit_inquiries(user_id);

-- 7. ROW LEVEL SECURITY
ALTER TABLE personal_credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_tradelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
DROP POLICY IF EXISTS "Users can view own personal credit" ON personal_credit_profiles;
CREATE POLICY "Users can view own personal credit" ON personal_credit_profiles
    FOR ALL USING (user_id = public.get_jwt_user_id());

DROP POLICY IF EXISTS "Users can view own business credit" ON business_credit_profiles;
CREATE POLICY "Users can view own business credit" ON business_credit_profiles
    FOR ALL USING (user_id = public.get_jwt_user_id());

DROP POLICY IF EXISTS "Users can view own tradelines" ON credit_tradelines;
CREATE POLICY "Users can view own tradelines" ON credit_tradelines
    FOR ALL USING (user_id = public.get_jwt_user_id());

DROP POLICY IF EXISTS "Users can view own score history" ON credit_score_history;
CREATE POLICY "Users can view own score history" ON credit_score_history
    FOR ALL USING (user_id = public.get_jwt_user_id());

DROP POLICY IF EXISTS "Users can view own inquiries" ON credit_inquiries;
CREATE POLICY "Users can view own inquiries" ON credit_inquiries
    FOR ALL USING (user_id = public.get_jwt_user_id());

-- 8. UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION update_credit_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_personal_credit_updated ON personal_credit_profiles;
CREATE TRIGGER trigger_personal_credit_updated
    BEFORE UPDATE ON personal_credit_profiles
    FOR EACH ROW EXECUTE FUNCTION update_credit_updated_at();

DROP TRIGGER IF EXISTS trigger_business_credit_updated ON business_credit_profiles;
CREATE TRIGGER trigger_business_credit_updated
    BEFORE UPDATE ON business_credit_profiles
    FOR EACH ROW EXECUTE FUNCTION update_credit_updated_at();

DROP TRIGGER IF EXISTS trigger_tradelines_updated ON credit_tradelines;
CREATE TRIGGER trigger_tradelines_updated
    BEFORE UPDATE ON credit_tradelines
    FOR EACH ROW EXECUTE FUNCTION update_credit_updated_at();

-- Migration complete
