-- Security Fixes: Search Path & Missing RLS
-- 1. Secure functions by setting search_path = public
-- 2. Add policies for scouts and referrals

-- =============================================================================
-- 1. Secure Functions (Prevent Search Path Hijacking)
-- =============================================================================

ALTER FUNCTION set_referral_maturity() SET search_path = public;
ALTER FUNCTION request_file_access(uuid, text) SET search_path = public;

-- =============================================================================
-- 2. Scouts Policies
-- =============================================================================

-- Admin: Full Access
DROP POLICY IF EXISTS "Admins can manage scouts" ON scouts;
CREATE POLICY "Admins can manage scouts" ON scouts
    FOR ALL TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

-- User: View own profile
DROP POLICY IF EXISTS "Scouts can view own profile" ON scouts;
CREATE POLICY "Scouts can view own profile" ON scouts
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- =============================================================================
-- 3. Referrals Policies
-- =============================================================================

-- Admin: Full Access
DROP POLICY IF EXISTS "Admins can manage referrals" ON referrals;
CREATE POLICY "Admins can manage referrals" ON referrals
    FOR ALL TO authenticated
    USING (
         (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

-- Scout: View own referrals
DROP POLICY IF EXISTS "Scouts can view own referrals" ON referrals;
CREATE POLICY "Scouts can view own referrals" ON referrals
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM scouts
            WHERE scouts.id = referrals.scout_id
            AND scouts.user_id = (SELECT auth.uid())
        )
    );
