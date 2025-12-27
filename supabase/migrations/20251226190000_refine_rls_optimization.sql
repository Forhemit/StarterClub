-- Refine RLS Optimization
-- Switching from (SELECT auth.uid()::text) to (SELECT auth.jwt() ->> 'sub')
-- This provides a direct TEXT value (better for Clerk IDs) and ensures stable evaluation.

-- 1. user_businesses
DROP POLICY IF EXISTS "user_businesses_owner_access" ON user_businesses;
CREATE POLICY "user_businesses_owner_access" ON user_businesses
    FOR ALL USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- 2. user_checklist_status
DROP POLICY IF EXISTS "user_checklist_status_owner_access" ON user_checklist_status;
CREATE POLICY "user_checklist_status_owner_access" ON user_checklist_status
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_checklist_status.user_business_id 
            AND user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- 3. user_uploaded_files
DROP POLICY IF EXISTS "user_uploaded_files_owner_access" ON user_uploaded_files;
CREATE POLICY "user_uploaded_files_owner_access" ON user_uploaded_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_uploaded_files.business_id 
            AND user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- 4. user_installed_modules
DROP POLICY IF EXISTS "user_installed_modules_owner_access" ON user_installed_modules;
CREATE POLICY "user_installed_modules_owner_access" ON user_installed_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_installed_modules.user_business_id 
            AND user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- 5. user_module_instances
DROP POLICY IF EXISTS "Users can manage their module instances" ON user_module_instances;
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_module_instances' AND column_name = 'user_business_id') THEN
        EXECUTE 'CREATE POLICY "Users can manage their module instances" ON user_module_instances FOR ALL USING (EXISTS (SELECT 1 FROM user_businesses WHERE id = user_module_instances.user_business_id AND user_id = (SELECT auth.jwt() ->> ''sub'')))';
   END IF;
END $$;

-- 6. module_reviews
DROP POLICY IF EXISTS "module_reviews_owner_insert" ON module_reviews;
DROP POLICY IF EXISTS "module_reviews_owner_update" ON module_reviews;
CREATE POLICY "module_reviews_owner_insert" ON module_reviews
    FOR INSERT WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));
CREATE POLICY "module_reviews_owner_update" ON module_reviews
    FOR UPDATE USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- 7. module_forks
DROP POLICY IF EXISTS "Users can create forks" ON module_forks;
CREATE POLICY "Users can create forks" ON module_forks
    FOR INSERT WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

-- 8. clients
DROP POLICY IF EXISTS "Users can manage clients for their businesses" ON clients;
CREATE POLICY "Users can manage clients for their businesses" ON clients
    FOR ALL USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- 9. engagements
DROP POLICY IF EXISTS "Users can manage engagements via clients" ON engagements;
CREATE POLICY "Users can manage engagements via clients" ON engagements
    FOR ALL USING (
        client_id IN (
            SELECT c.id FROM clients c
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- 10. sessions
DROP POLICY IF EXISTS "Users can manage sessions via engagements" ON sessions;
CREATE POLICY "Users can manage sessions via engagements" ON sessions
    FOR ALL USING (
        engagement_id IN (
            SELECT e.id FROM engagements e
            JOIN clients c ON e.client_id = c.id
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- 11. client_milestones
DROP POLICY IF EXISTS "Users can manage milestones via engagements" ON client_milestones;
CREATE POLICY "Users can manage milestones via engagements" ON client_milestones
    FOR ALL USING (
        engagement_id IN (
            SELECT e.id FROM engagements e
            JOIN clients c ON e.client_id = c.id
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- 12. client_resources
DROP POLICY IF EXISTS "Users can manage resources via clients" ON client_resources;
CREATE POLICY "Users can manage resources via clients" ON client_resources
    FOR ALL USING (
        client_id IN (
            SELECT c.id FROM clients c
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );
