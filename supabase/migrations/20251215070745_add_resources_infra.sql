-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES partner_orgs(id) ON DELETE SET NULL,
  name text NOT NULL,
  key_hash text NOT NULL, -- Storing hashed key only
  scopes text[] DEFAULT '{}',
  expires_at timestamptz,
  last_used_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at timestamptz DEFAULT now()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id text NOT NULL, -- Clerk User ID
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  action text NOT NULL, -- 'create', 'update', 'delete', 'other'
  metadata jsonb DEFAULT '{}', -- Stores diffs or extra info
  created_at timestamptz DEFAULT now()
);

-- RLS for API Keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Admins can do everything with API keys
CREATE POLICY "Admins full access to api_keys" ON api_keys
  FOR ALL
  USING (
    exists (
      select 1 from partner_users 
      where clerk_user_id = requesting_user_id() 
      and role = 'admin'
    )
  );

-- Partners can read/manage their own Org's keys
CREATE POLICY "Partners manage own org api_keys" ON api_keys
  FOR ALL
  USING (
    org_id IN (
        select org_id from partner_users where clerk_user_id = requesting_user_id()
    )
  );

-- RLS for Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all audit logs
CREATE POLICY "Admins read all audit_logs" ON audit_logs
  FOR SELECT
  USING (
    exists (
      select 1 from partner_users 
      where clerk_user_id = requesting_user_id() 
      and role = 'admin'
    )
  );

-- Partners can read audit logs for their own Org (more complex to join, simplified for now: partners don't see audit logs yet, or only see their own actions)
CREATE POLICY "Partners read own actions" ON audit_logs
  FOR SELECT
  USING (
    actor_id = requesting_user_id()
  );
