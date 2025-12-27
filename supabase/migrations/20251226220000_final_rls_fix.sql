-- Final RLS & Policy Fixes
-- 1. Resolve auth_rls_initplan by strictly using (SELECT auth.uid()::text) or (SELECT auth.uid()).
-- 2. Resolve multiple_permissive_policies by consolidating overlapping permissions.

-- =============================================================================
-- 1. Helper Logic
-- =============================================================================

-- We will apply these changes to:
-- user_businesses, user_checklist_status, user_uploaded_files, user_installed_modules, 
-- user_module_instances, module_reviews, module_forks, clients, engagements, sessions, 
-- client_milestones, client_resources, scouts, referrals.

-- =============================================================================
-- 2. Policy Definitions
-- =============================================================================

-- user_businesses
DROP POLICY IF EXISTS "user_businesses_owner_access" ON user_businesses;
CREATE POLICY "user_businesses_owner_access" ON user_businesses
    FOR ALL USING (user_id = (SELECT auth.uid()::text));

-- user_checklist_status
DROP POLICY IF EXISTS "user_checklist_status_owner_access" ON user_checklist_status;
CREATE POLICY "user_checklist_status_owner_access" ON user_checklist_status
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_checklist_status.user_business_id 
            AND user_id = (SELECT auth.uid()::text)
        )
    );

-- user_uploaded_files
DROP POLICY IF EXISTS "user_uploaded_files_owner_access" ON user_uploaded_files;
CREATE POLICY "user_uploaded_files_owner_access" ON user_uploaded_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_uploaded_files.business_id 
            AND user_id = (SELECT auth.uid()::text)
        )
    );

-- user_installed_modules
DROP POLICY IF EXISTS "user_installed_modules_owner_access" ON user_installed_modules;
CREATE POLICY "user_installed_modules_owner_access" ON user_installed_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_installed_modules.user_business_id 
            AND user_id = (SELECT auth.uid()::text)
        )
    );

-- user_module_instances
DROP POLICY IF EXISTS "Users can manage their module instances" ON user_module_instances;
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_module_instances' AND column_name = 'user_business_id') THEN
        EXECUTE 'CREATE POLICY "Users can manage their module instances" ON user_module_instances FOR ALL USING (EXISTS (SELECT 1 FROM user_businesses WHERE id = user_module_instances.user_business_id AND user_id = (SELECT auth.uid()::text)))';
   END IF;
END $$;

-- module_reviews
DROP POLICY IF EXISTS "module_reviews_owner_insert" ON module_reviews;
DROP POLICY IF EXISTS "module_reviews_owner_update" ON module_reviews;
CREATE POLICY "module_reviews_owner_insert" ON module_reviews
    FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()::text));
CREATE POLICY "module_reviews_owner_update" ON module_reviews
    FOR UPDATE USING (user_id = (SELECT auth.uid()::text));

-- module_forks
DROP POLICY IF EXISTS "Users can create forks" ON module_forks;
CREATE POLICY "Users can create forks" ON module_forks
    FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()::text));

-- clients
DROP POLICY IF EXISTS "Users can manage clients for their businesses" ON clients;
CREATE POLICY "Users can manage clients for their businesses" ON clients
    FOR ALL USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = (SELECT auth.uid()::text)
        )
    );

-- engagements
DROP POLICY IF EXISTS "Users can manage engagements via clients" ON engagements;
CREATE POLICY "Users can manage engagements via clients" ON engagements
    FOR ALL USING (
        client_id IN (
            SELECT c.id FROM clients c
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.uid()::text)
        )
    );

-- sessions
DROP POLICY IF EXISTS "Users can manage sessions via engagements" ON sessions;
CREATE POLICY "Users can manage sessions via engagements" ON sessions
    FOR ALL USING (
        engagement_id IN (
            SELECT e.id FROM engagements e
            JOIN clients c ON e.client_id = c.id
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.uid()::text)
        )
    );

-- client_milestones
DROP POLICY IF EXISTS "Users can manage milestones via engagements" ON client_milestones;
CREATE POLICY "Users can manage milestones via engagements" ON client_milestones
    FOR ALL USING (
        engagement_id IN (
            SELECT e.id FROM engagements e
            JOIN clients c ON e.client_id = c.id
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.uid()::text)
        )
    );

-- client_resources
DROP POLICY IF EXISTS "Users can manage resources via clients" ON client_resources;
CREATE POLICY "Users can manage resources via clients" ON client_resources
    FOR ALL USING (
        client_id IN (
            SELECT c.id FROM clients c
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.uid()::text)
        )
    );

-- =============================================================================
-- 3. Consolidated Policies (Scouts & Referrals)
-- =============================================================================

-- Scouts: Consolidate Admin (ALL) and User (SELECT)
DROP POLICY IF EXISTS "Admins can manage scouts" ON scouts;
DROP POLICY IF EXISTS "Scouts can view own profile" ON scouts;

CREATE POLICY "scouts_select_policy" ON scouts
    FOR SELECT TO authenticated
    USING (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
        OR
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "scouts_write_policy" ON scouts
    FOR INSERT TO authenticated
    WITH CHECK (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );
CREATE POLICY "scouts_update_policy" ON scouts
    FOR UPDATE TO authenticated
    USING (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );
CREATE POLICY "scouts_delete_policy" ON scouts
    FOR DELETE TO authenticated
    USING (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );


-- Referrals: Consolidate Admin (ALL) and User (SELECT)
DROP POLICY IF EXISTS "Admins can manage referrals" ON referrals;
DROP POLICY IF EXISTS "Scouts can view own referrals" ON referrals;

CREATE POLICY "referrals_select_policy" ON referrals
    FOR SELECT TO authenticated
    USING (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
        OR
        EXISTS (
            SELECT 1 FROM scouts
            WHERE scouts.id = referrals.scout_id
            AND scouts.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "referrals_write_policy" ON referrals
    FOR INSERT TO authenticated
    WITH CHECK (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );
CREATE POLICY "referrals_update_policy" ON referrals
    FOR UPDATE TO authenticated
    USING (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );
CREATE POLICY "referrals_delete_policy" ON referrals
    FOR DELETE TO authenticated
    USING (
        ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );
