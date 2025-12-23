-- Scout Program (Referral System)

-- 1. Scouts Table
CREATE TABLE IF NOT EXISTS scouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id), -- Optional link to auth user
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    payout_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;

-- 2. Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scout_id UUID REFERENCES scouts(id) ON DELETE SET NULL,
    referred_business_id UUID REFERENCES user_businesses(id) ON DELETE CASCADE,
    
    -- Commission Details
    commission_type TEXT NOT NULL, -- 'factory_team_flat', 'grid_access_mrr'
    commission_amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    -- Status Tracking
    status TEXT DEFAULT 'pending_maturity', -- 'ready_for_payout', 'paid', 'voided_churn'
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    maturity_date TIMESTAMPTZ, -- When it is safe to pay (e.g. +90 days)
    paid_at TIMESTAMPTZ
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- 3. Trigger for Clawback/Maturity date
-- When a referral is created, set the maturity date (Clawback period)
CREATE OR REPLACE FUNCTION set_referral_maturity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.maturity_date IS NULL THEN
        NEW.maturity_date := NEW.created_at + INTERVAL '90 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER referral_maturity_trigger
BEFORE INSERT ON referrals
FOR EACH ROW
EXECUTE FUNCTION set_referral_maturity();
