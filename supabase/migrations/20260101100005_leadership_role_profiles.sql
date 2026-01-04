-- Create table for Leadership & Human Capital wizard data
-- This stores the full role profile configuration for each user's business

CREATE TABLE IF NOT EXISTS leadership_role_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
    
    -- Step 1: Role Identity
    role TEXT,
    incumbent TEXT,
    deputy TEXT,
    backup_deputy TEXT,
    interim_days TEXT DEFAULT '30', -- '30', '90', 'indefinite'
    
    -- Step 2: Response Protocols
    tier1_action TEXT,
    tier1_scope TEXT,
    tier2_action TEXT,
    tier2_scope TEXT,
    tier3_action TEXT,
    tier3_scope TEXT,
    tier4_action TEXT,
    tier4_scope TEXT,
    
    -- Step 3: Crisis Communication
    tier1_comms TEXT,
    tier2_comms TEXT,
    tier3_comms TEXT,
    tier4_comms TEXT,
    
    -- Step 4: Critical Knowledge (JSONB array)
    knowledge_items JSONB DEFAULT '[]'::jsonb,
    
    -- Step 5: Tiered Spending
    opex_limit NUMERIC DEFAULT 0,
    capex_limit NUMERIC DEFAULT 0,
    
    -- Step 6: Signing Matrix
    can_sign_ndas BOOLEAN DEFAULT FALSE,
    can_sign_vendor BOOLEAN DEFAULT FALSE,
    can_sign_employment BOOLEAN DEFAULT FALSE,
    can_sign_checks BOOLEAN DEFAULT FALSE,
    requires_dual_control BOOLEAN DEFAULT FALSE,
    
    -- Step 7: Escalation Rules
    escalation_pathway TEXT,
    approver_role TEXT,
    
    -- Step 8: Legacy Handover (JSONB arrays)
    legacy_recordings JSONB DEFAULT '[]'::jsonb,
    legacy_relationships JSONB DEFAULT '[]'::jsonb,
    mentoring_cadence TEXT,
    mentoring_focus TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one profile per business per role
    UNIQUE(user_business_id, role)
);

-- Index for faster lookups by business
CREATE INDEX IF NOT EXISTS idx_leadership_profiles_business 
ON leadership_role_profiles(user_business_id);

-- Enable RLS
ALTER TABLE leadership_role_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own business's profiles
-- RLS Policy: Users can only access their own business's profiles
DROP POLICY IF EXISTS "Users can manage their own leadership profiles" ON leadership_role_profiles;

CREATE POLICY "Users can manage their own leadership profiles"
ON leadership_role_profiles
FOR ALL
USING (
    user_business_id IN (
        SELECT id FROM user_businesses WHERE user_id = public.get_jwt_user_id()
    )
)
WITH CHECK (
    user_business_id IN (
        SELECT id FROM user_businesses WHERE user_id = public.get_jwt_user_id()
    )
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_leadership_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leadership_profile_updated ON leadership_role_profiles;

CREATE TRIGGER leadership_profile_updated
    BEFORE UPDATE ON leadership_role_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_leadership_profile_timestamp();
