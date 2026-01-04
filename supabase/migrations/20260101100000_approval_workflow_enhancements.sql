-- Approval Workflow Enhancements Migration
-- Adds new fields and tables for enhanced 2PI, signing rules, and compliance tracking

-- 1. Add new fields to leadership_role_profiles
ALTER TABLE leadership_role_profiles
ADD COLUMN IF NOT EXISTS opex_excess_approver TEXT,
ADD COLUMN IF NOT EXISTS capex_excess_approver TEXT,
ADD COLUMN IF NOT EXISTS two_person_integrity_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ;

-- 2. Create signing_authority_rules table for CRUD signing matrix
CREATE TABLE IF NOT EXISTS signing_authority_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES leadership_role_profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    threshold_min NUMERIC DEFAULT 0,
    threshold_max NUMERIC,
    requires_2pi BOOLEAN DEFAULT FALSE,
    primary_approver_role TEXT,
    secondary_approver_role TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create leadership_compliance_log for completion tracking
CREATE TABLE IF NOT EXISTS leadership_compliance_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    completion_status TEXT CHECK (completion_status IN ('pending', 'complete')) DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_signing_rules_business ON signing_authority_rules(user_business_id);
CREATE INDEX IF NOT EXISTS idx_signing_rules_profile ON signing_authority_rules(profile_id);
CREATE INDEX IF NOT EXISTS idx_compliance_log_business ON leadership_compliance_log(user_business_id);
CREATE INDEX IF NOT EXISTS idx_compliance_log_status ON leadership_compliance_log(completion_status);
CREATE INDEX IF NOT EXISTS idx_compliance_log_expiry ON leadership_compliance_log(expiry_date);

-- 5. Enable RLS on new tables
ALTER TABLE signing_authority_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_compliance_log ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for signing_authority_rules
CREATE POLICY "Users can view their business signing rules"
    ON signing_authority_rules FOR SELECT
    USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert signing rules for their business"
    ON signing_authority_rules FOR INSERT
    WITH CHECK (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update their business signing rules"
    ON signing_authority_rules FOR UPDATE
    USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete their business signing rules"
    ON signing_authority_rules FOR DELETE
    USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = auth.uid()::text
        )
    );

-- 7. Create RLS policies for leadership_compliance_log
CREATE POLICY "Users can view their business compliance log"
    ON leadership_compliance_log FOR SELECT
    USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert compliance log for their business"
    ON leadership_compliance_log FOR INSERT
    WITH CHECK (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update their business compliance log"
    ON leadership_compliance_log FOR UPDATE
    USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = auth.uid()::text
        )
    );

-- 8. Add updated_at trigger for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_signing_authority_rules_updated_at ON signing_authority_rules;
CREATE TRIGGER update_signing_authority_rules_updated_at
    BEFORE UPDATE ON signing_authority_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leadership_compliance_log_updated_at ON leadership_compliance_log;
CREATE TRIGGER update_leadership_compliance_log_updated_at
    BEFORE UPDATE ON leadership_compliance_log
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
