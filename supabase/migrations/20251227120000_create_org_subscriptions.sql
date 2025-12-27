-- Table: organization_subscriptions
-- Purpose: Track all Partner/Sponsor subscriptions (both static and dynamic) linked to Stripe

CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id text NOT NULL, -- Internal identifier (e.g., from your own organizations table or loose string)
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text, -- Can be null for fully custom deals
  status text NOT NULL, -- e.g., 'active', 'past_due', 'canceled'
  current_period_end timestamptz NOT NULL,
  tier_name text, -- Human-readable name (e.g., "Gold Sponsor", "Custom Deal")
  is_custom_deal boolean DEFAULT false NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookups by your org_id and active status
CREATE INDEX IF NOT EXISTS idx_org_subs_org_status ON public.organization_subscriptions(org_id, status);
CREATE INDEX IF NOT EXISTS idx_org_subs_stripe_customer_id ON public.organization_subscriptions(stripe_customer_id);

-- Enable RLS (Row Level Security) - Best practice, even if policy is just for service role initially
ALTER TABLE public.organization_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (This is usually default but good to be explicit if we add other policies)
-- For now, we will create a policy that allows everything for service_role and authenticated users if needed.
-- But since this is primarily for webhook ingestion, service role is key.
-- Let's just create a basic read policy for authenticated users if they belong to the org (future proofing).
-- For now, we'll leave it restricted to service role implicitly by having no public policies, 
-- or we can add one for clarity.

-- Grant access to authenticated users to read their own subscriptions (if org_id maps to something they own)
-- Since org_id logic is vague, we skipped RLS policies for USER access for now. 
-- Webhooks/Server actions using service_role will bypass RLS.
