-- Migration: Optimize RLS Policies
-- Purpose: Consolidate multiple permissive policies into single unified policies to remove linter warnings and improve performance.

-- 1. PUBLIC.ACTIVITY_LOG
DROP POLICY IF EXISTS "Users read own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Admins read all activity" ON public.activity_log;

CREATE POLICY "Unified read access for activity_log" ON public.activity_log
  FOR SELECT
  USING (
    member_id = requesting_user_id() 
    OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = requesting_user_id() AND role = 'admin')
  );

-- 2. PUBLIC.MEMBER_PROGRESS
DROP POLICY IF EXISTS "Users read own progress" ON public.member_progress;
DROP POLICY IF EXISTS "Admins read all progress" ON public.member_progress;

CREATE POLICY "Unified read access for member_progress" ON public.member_progress
  FOR SELECT
  USING (
    member_id = requesting_user_id() 
    OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = requesting_user_id() AND role = 'admin')
  );

-- 3. PUBLIC.API_KEYS
DROP POLICY IF EXISTS "Admins full access to api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Partners manage own org api_keys" ON public.api_keys;

-- Note: We need to cover ALL actions because previous policies were FOR ALL (Admins) and FOR ALL (Partners)
-- We will split them into specific actions if needed for clarity, or combine logic.
-- The previous policies were:
-- Admins: ALL (using check role='admin')
-- Partners: ALL (using check org_id in user's orgs)

CREATE POLICY "Unified access for api_keys" ON public.api_keys
  FOR ALL
  USING (
    (org_id IN (SELECT org_id FROM partner_users WHERE clerk_user_id = requesting_user_id()))
    OR
    EXISTS (SELECT 1 FROM partner_users WHERE clerk_user_id = requesting_user_id() AND role = 'admin')
  )
  WITH CHECK (
    -- For INSERT/UPDATE, we generally want the same logic. 
    (org_id IN (SELECT org_id FROM partner_users WHERE clerk_user_id = requesting_user_id()))
    OR
    EXISTS (SELECT 1 FROM partner_users WHERE clerk_user_id = requesting_user_id() AND role = 'admin')
  );

-- 4. PUBLIC.AUDIT_LOGS
DROP POLICY IF EXISTS "Admins read all audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Partners read own actions" ON public.audit_logs;

CREATE POLICY "Unified read access for audit_logs" ON public.audit_logs
  FOR SELECT
  USING (
    actor_id = requesting_user_id() 
    OR 
    EXISTS (SELECT 1 FROM partner_users WHERE clerk_user_id = requesting_user_id() AND role = 'admin')
  );
