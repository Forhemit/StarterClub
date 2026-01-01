-- Create table for Financial Resilience module data
-- Stores comprehensive financial resilience profiles for stress testing and emergency planning

CREATE TABLE IF NOT EXISTS financial_resilience_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
    
    -- Step 1: Financial Overview
    business_type TEXT, -- 'saas', 'ecommerce', 'services', 'manufacturing', 'other'
    annual_revenue NUMERIC DEFAULT 0,
    monthly_burn_rate NUMERIC DEFAULT 0,
    runway_months INTEGER DEFAULT 0,
    fiscal_year_end TEXT, -- 'december', 'march', 'june', etc.
    
    -- Step 2: Cash Flow Analysis
    revenue_streams JSONB DEFAULT '[]'::jsonb, -- [{id, name, amount, frequency, reliability}]
    expense_categories JSONB DEFAULT '[]'::jsonb, -- [{id, name, amount, type, fixed_or_variable}]
    cash_flow_cycle TEXT, -- 'weekly', 'biweekly', 'monthly', 'quarterly'
    average_collection_days INTEGER DEFAULT 30,
    average_payment_days INTEGER DEFAULT 30,
    
    -- Step 3: Stress Test Scenarios
    stress_scenarios JSONB DEFAULT '[]'::jsonb, -- [{id, name, revenue_impact_pct, expense_impact_pct, duration_months, probability}]
    baseline_monthly_cash_flow NUMERIC DEFAULT 0,
    
    -- Step 4: Emergency Fund
    target_fund_amount NUMERIC DEFAULT 0,
    current_fund_balance NUMERIC DEFAULT 0,
    target_months_coverage INTEGER DEFAULT 6,
    funding_sources JSONB DEFAULT '[]'::jsonb, -- [{id, source, amount, access_time, terms}]
    
    -- Step 5: Liquidity Buffers
    tier1_buffer NUMERIC DEFAULT 0, -- Immediate access (checking)
    tier2_buffer NUMERIC DEFAULT 0, -- Short-term (savings, money market)
    tier3_buffer NUMERIC DEFAULT 0, -- Medium-term (CDs, credit lines)
    buffer_locations JSONB DEFAULT '[]'::jsonb, -- [{id, institution, account_type, balance, tier}]
    
    -- Step 6: Insurance Coverage
    insurance_policies JSONB DEFAULT '[]'::jsonb, -- [{id, type, provider, coverage_amount, deductible, premium, expiry_date, policy_number}]
    insurance_gaps JSONB DEFAULT '[]'::jsonb, -- [{id, gap_type, description, priority}]
    
    -- Step 7: Banking Relationships
    banking_contacts JSONB DEFAULT '[]'::jsonb, -- [{id, bank_name, account_type, contact_name, contact_phone, contact_email, is_primary, credit_line_amount}]
    primary_bank TEXT,
    backup_bank TEXT,
    total_credit_available NUMERIC DEFAULT 0,
    
    -- Step 8: Financial Backup Contacts
    financial_contacts JSONB DEFAULT '[]'::jsonb, -- [{id, role, name, email, phone, company, access_level, has_credentials, is_successor}]
    cfo_successor TEXT,
    accountant_successor TEXT,
    
    -- Step 9: Recovery Protocols
    recovery_protocols JSONB DEFAULT '[]'::jsonb, -- [{id, scenario_id, trigger_condition, immediate_actions, responsible_party, timeline_days}]
    escalation_threshold NUMERIC DEFAULT 0,
    board_notification_threshold NUMERIC DEFAULT 0,
    
    -- Step 10: Financial Controls
    require_dual_signature BOOLEAN DEFAULT FALSE,
    dual_signature_threshold NUMERIC DEFAULT 10000,
    approval_thresholds JSONB DEFAULT '{}'::jsonb, -- {opex: {tier1: 1000, tier2: 5000, tier3: 25000}, capex: {...}}
    access_controls JSONB DEFAULT '[]'::jsonb, -- [{id, system, users, access_level, requires_2fa}]
    segregation_of_duties BOOLEAN DEFAULT FALSE,
    
    -- Step 11: Compliance & Review
    last_review_date TIMESTAMPTZ,
    next_review_date TIMESTAMPTZ,
    compliance_log JSONB DEFAULT '[]'::jsonb, -- [{id, date, reviewer, status, notes}]
    completed_at TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One profile per business
    UNIQUE(user_business_id)
);

-- Index for faster lookups by business
CREATE INDEX IF NOT EXISTS idx_financial_resilience_profiles_business 
ON financial_resilience_profiles(user_business_id);

-- Enable RLS
ALTER TABLE financial_resilience_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own business's profiles
CREATE POLICY "Users can manage their own financial resilience profiles"
ON financial_resilience_profiles
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
CREATE OR REPLACE FUNCTION update_financial_resilience_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER financial_resilience_profile_updated
    BEFORE UPDATE ON financial_resilience_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_financial_resilience_profile_timestamp();
