-- Migration: Consolidate Policies and Fix Performance
-- timestamp: 20251221100000

-- 1. DROP DUPLICATE / REDUNDANT POLICIES (Fix: multiple_permissive_policies)

-- Audit Logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
-- Keeping: "Unified read access for audit_logs"

-- Categories 
DROP POLICY IF EXISTS "Categories viewable by all auth" ON public.categories;
-- Keeping: "categories_public_select"

-- Checklist Items
DROP POLICY IF EXISTS "Checklist items viewable by all auth" ON public.checklist_items;
-- Keeping: "checklist_items_public_select"

-- Module Items
DROP POLICY IF EXISTS "Module items viewable by all auth" ON public.module_items;
-- Keeping: "module_items_owner_access"

-- Modules
DROP POLICY IF EXISTS "Modules viewable by all auth" ON public.modules;
DROP POLICY IF EXISTS "Public modules are viewable by everyone" ON public.modules;
-- Keeping: "modules_public_select"

-- Partner Orgs
DROP POLICY IF EXISTS "Authenticated users can view own org" ON public.partner_orgs;
-- Keeping: "Users can read own org" (Assuming this is the desired one, or unification logic handles it)

-- Partner Users
DROP POLICY IF EXISTS "Authenticated users can view own user record" ON public.partner_users;
-- Keeping: "Users can read own data"

-- Statuses
DROP POLICY IF EXISTS "Statuses viewable by all auth" ON public.statuses;
-- Keeping: "statuses_public_select"

-- User Checklist Status
DROP POLICY IF EXISTS "Users can manage their own checklist status" ON public.user_checklist_status;
-- Keeping: "user_checklist_status_owner_access"

-- User Installed Modules
DROP POLICY IF EXISTS "Users can install modules for their businesses" ON public.user_installed_modules;
DROP POLICY IF EXISTS "Users can view their installed modules" ON public.user_installed_modules;
-- Keeping: "user_installed_modules_owner_access"

-- 2. OPTIMIZE RLS PERFORMANCE (Fix: auth_rls_initplan)
-- Replace auth.uid() or auth.function() with (select auth.uid())

-- User Checklist Status (optimizing the keeper policy)
DROP POLICY IF EXISTS "user_checklist_status_owner_access" ON public.user_checklist_status;
CREATE POLICY "user_checklist_status_owner_access" 
    ON public.user_checklist_status
    FOR ALL USING (
        (select public.is_admin_or_service()) OR
        EXISTS (
            SELECT 1 FROM public.user_businesses 
            WHERE id = user_business_id AND user_id = (select auth.uid())
        )
    );

-- User Uploaded Files
DROP POLICY IF EXISTS "Users can manage their own files" ON public.user_uploaded_files;
CREATE POLICY "Users can manage their own files" ON public.user_uploaded_files
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = business_id AND user_id = (select auth.uid()))
    );

-- Clients
DROP POLICY IF EXISTS "Users can manage clients for their businesses" ON public.clients;
CREATE POLICY "Users can manage clients for their businesses" ON public.clients
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = (select auth.uid()))
    );

-- Engagements
DROP POLICY IF EXISTS "Users can manage engagements via clients" ON public.engagements;
CREATE POLICY "Users can manage engagements via clients" ON public.engagements
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM clients c
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE c.id = client_id AND b.user_id = (select auth.uid())
        )
    );

-- Sessions
DROP POLICY IF EXISTS "Users can manage sessions via engagements" ON public.sessions;
CREATE POLICY "Users can manage sessions via engagements" ON public.sessions
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM engagements e
            JOIN clients c ON c.id = e.client_id
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE e.id = engagement_id AND b.user_id = (select auth.uid())
        )
    );

-- Client Milestones
DROP POLICY IF EXISTS "Users can manage milestones via engagements" ON public.client_milestones;
CREATE POLICY "Users can manage milestones via engagements" ON public.client_milestones
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM engagements e
            JOIN clients c ON c.id = e.client_id
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE e.id = engagement_id AND b.user_id = (select auth.uid())
        )
    );

-- Client Resources
DROP POLICY IF EXISTS "Users can manage resources via clients" ON public.client_resources;
CREATE POLICY "Users can manage resources via clients" ON public.client_resources
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM clients c
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE c.id = client_id AND b.user_id = (select auth.uid())
        )
    );

-- User Installed Modules (optimizing the keeper policy)
DROP POLICY IF EXISTS "user_installed_modules_owner_access" ON public.user_installed_modules;
CREATE POLICY "user_installed_modules_owner_access" 
    ON public.user_installed_modules
    FOR ALL USING (
        (select public.is_admin_or_service()) OR
        EXISTS (
            SELECT 1 FROM public.user_businesses 
            WHERE id = user_business_id AND user_id = (select auth.uid())
        )
    );

-- User Module Instances
DROP POLICY IF EXISTS "Users can manage their module instances" ON public.user_module_instances;
CREATE POLICY "Users can manage their module instances" ON public.user_module_instances
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = (select auth.uid()))
    );

-- Module Forks
DROP POLICY IF EXISTS "Users can create forks" ON public.module_forks;
CREATE POLICY "Users can create forks" ON public.module_forks
    FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
