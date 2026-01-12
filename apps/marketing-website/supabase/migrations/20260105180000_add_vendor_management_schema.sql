-- Migration: Add Vendor Management Schema
-- Creates tables for vendor profiles, vendors, contracts, and spend tracking

-- Vendor profiles table (one per user)
CREATE TABLE IF NOT EXISTS vendor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_user_id ON vendor_profiles(user_id);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for profile_id
CREATE INDEX IF NOT EXISTS idx_vendors_profile_id ON vendors(profile_id);

-- Vendor contracts table
CREATE TABLE IF NOT EXISTS vendor_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    contract_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    value NUMERIC(12,2),
    renewal_alert_days INTEGER DEFAULT 30,
    auto_renew BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for contracts
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_profile_id ON vendor_contracts(profile_id);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_vendor_id ON vendor_contracts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_end_date ON vendor_contracts(end_date);

-- Vendor spend records table
CREATE TABLE IF NOT EXISTS vendor_spend (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    period TEXT NOT NULL,
    period_date DATE,
    category TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for spend
CREATE INDEX IF NOT EXISTS idx_vendor_spend_profile_id ON vendor_spend(profile_id);
CREATE INDEX IF NOT EXISTS idx_vendor_spend_vendor_id ON vendor_spend(vendor_id);

-- Enable Row Level Security on all tables
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_spend ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_profiles
-- Users can only see their own profiles
CREATE POLICY "Users can view own vendor profiles"
    ON vendor_profiles FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own vendor profiles"
    ON vendor_profiles FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own vendor profiles"
    ON vendor_profiles FOR UPDATE
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own vendor profiles"
    ON vendor_profiles FOR DELETE
    USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for vendors
-- Users can only manage vendors in their own profiles
CREATE POLICY "Users can view own vendors"
    ON vendors FOR SELECT
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert own vendors"
    ON vendors FOR INSERT
    WITH CHECK (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update own vendors"
    ON vendors FOR UPDATE
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can delete own vendors"
    ON vendors FOR DELETE
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

-- RLS Policies for vendor_contracts
CREATE POLICY "Users can view own contracts"
    ON vendor_contracts FOR SELECT
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert own contracts"
    ON vendor_contracts FOR INSERT
    WITH CHECK (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update own contracts"
    ON vendor_contracts FOR UPDATE
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can delete own contracts"
    ON vendor_contracts FOR DELETE
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

-- RLS Policies for vendor_spend
CREATE POLICY "Users can view own spend"
    ON vendor_spend FOR SELECT
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert own spend"
    ON vendor_spend FOR INSERT
    WITH CHECK (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update own spend"
    ON vendor_spend FOR UPDATE
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can delete own spend"
    ON vendor_spend FOR DELETE
    USING (profile_id IN (
        SELECT id FROM vendor_profiles WHERE user_id = auth.jwt() ->> 'sub'
    ));
