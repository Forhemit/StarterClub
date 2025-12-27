-- Enable Row Level Security
-- App JWT secret is managed by Supabase platform

-- Members table with better constraints
CREATE TABLE IF NOT EXISTS members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text UNIQUE NOT NULL,
    email text NOT NULL,
    full_name text,
    role text CHECK (role IN ('starter_member', 'starter_builder', 'starter_founder', 'sponsor', 'partner')),
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Subscriptions table with better tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    clerk_subscription_id text UNIQUE NOT NULL,
    clerk_price_id text NOT NULL,
    product_slug text NOT NULL,
    product_name text NOT NULL,
    price_cents integer NOT NULL CHECK (price_cents >= 0),
    currency text NOT NULL DEFAULT 'usd',
    interval text NOT NULL CHECK (interval IN ('month', 'year')),
    status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
    current_period_start timestamptz NOT NULL,
    current_period_end timestamptz NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    canceled_at timestamptz,
    trial_start timestamptz,
    trial_end timestamptz,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Add-ons table with foreign key constraint
CREATE TABLE IF NOT EXISTS subscription_addons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
    member_id uuid REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    addon_slug text NOT NULL,
    addon_name text NOT NULL,
    clerk_price_id text NOT NULL,
    price_cents integer NOT NULL CHECK (price_cents >= 0),
    currency text NOT NULL DEFAULT 'usd',
    interval text NOT NULL CHECK (interval = 'year'),
    status text DEFAULT 'active' CHECK (status IN ('active', 'canceled')),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_addons ENABLE ROW LEVEL SECURITY;

-- Audit log table for subscription changes
CREATE TABLE IF NOT EXISTS subscription_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
    member_id uuid REFERENCES members(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    old_status text,
    new_status text,
    changes jsonb,
    clerk_event_id text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_audit_log ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_clerk_user_id ON members(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_product_slug ON subscriptions(product_slug);
CREATE INDEX IF NOT EXISTS idx_subscription_addons_member_id ON subscription_addons(member_id);
CREATE INDEX IF NOT EXISTS idx_subscription_addons_subscription_id ON subscription_addons(subscription_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_addons_updated_at ON subscription_addons;
CREATE TRIGGER update_subscription_addons_updated_at BEFORE UPDATE ON subscription_addons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get member's active subscription
CREATE OR REPLACE FUNCTION get_member_active_subscription(member_uuid uuid)
RETURNS TABLE (
    subscription_id uuid,
    product_slug text,
    product_name text,
    price_cents integer,
    currency text,
    "interval" text,
    status text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.product_slug,
        s.product_name,
        s.price_cents,
        s.currency,
        s.interval,
        s.status
    FROM subscriptions s
    WHERE s.member_id = member_uuid
        AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- View for member summary
CREATE OR REPLACE VIEW member_summary AS
SELECT 
    m.id,
    m.clerk_user_id,
    m.email,
    m.full_name,
    m.role,
    m.status as member_status,
    s.product_slug as active_plan,
    s.status as subscription_status,
    s.current_period_end,
    COUNT(DISTINCT sa.id) as active_addons_count,
    COALESCE(SUM(s.price_cents + COALESCE(sa_total.addon_total, 0)), 0) as total_monthly_cents
FROM members m
LEFT JOIN subscriptions s ON m.id = s.member_id AND s.status = 'active'
LEFT JOIN (
    SELECT member_id, SUM(price_cents) as addon_total
    FROM subscription_addons
    WHERE status = 'active'
    GROUP BY member_id
) sa_total ON m.id = sa_total.member_id
LEFT JOIN subscription_addons sa ON m.id = sa.member_id AND sa.status = 'active'
GROUP BY m.id, m.clerk_user_id, m.email, m.full_name, m.role, m.status, 
         s.product_slug, s.status, s.current_period_end;

-- RLS Policies
-- Members can view their own data
CREATE POLICY "Users can view their own member data" ON members
    FOR SELECT USING (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (member_id IN (SELECT id FROM members WHERE clerk_user_id = (auth.jwt() ->> 'sub')));

CREATE POLICY "Users can view their own addons" ON subscription_addons
    FOR SELECT USING (member_id IN (SELECT id FROM members WHERE clerk_user_id = (auth.jwt() ->> 'sub')));

-- Service role policies (full access for webhooks/admin)
CREATE POLICY "Service role has full access to members" ON members
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to addons" ON subscription_addons
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to audit log" ON subscription_audit_log
    FOR ALL USING (auth.role() = 'service_role');
