-- Migration: Fix Database Linter Suggestions
-- timestamp: 20251221093000

-- 1. Fix RLS Policies for user_checklist_progress
-- Wrap auth.uid() in (select ...) to prevent re-evaluation for each row
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_checklist_progress') THEN
        
        -- Policy: "Users can modify their own progress"
        DROP POLICY IF EXISTS "Users can modify their own progress" ON public.user_checklist_progress;
        CREATE POLICY "Users can modify their own progress" ON public.user_checklist_progress
            FOR UPDATE TO authenticated
            USING ((select auth.uid()) = user_id);

        -- Policy: "Users can view their own progress"
        DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_checklist_progress;
        CREATE POLICY "Users can view their own progress" ON public.user_checklist_progress
            FOR SELECT TO authenticated
            USING ((select auth.uid()) = user_id);

        -- Policy: "Users can update their own progress"
        DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_checklist_progress;
        CREATE POLICY "Users can update their own progress" ON public.user_checklist_progress
            FOR INSERT TO authenticated
            WITH CHECK ((select auth.uid()) = user_id);
            
    END IF;
END
$$;

-- 2. Add Missing Foreign Key Indexes (unindexed_foreign_keys)
CREATE INDEX IF NOT EXISTS idx_checklist_items_category_id_fkey ON public.checklist_items(category_id);
CREATE INDEX IF NOT EXISTS idx_module_dependencies_dependency_module_id_fkey ON public.module_dependencies(dependency_module_id);
CREATE INDEX IF NOT EXISTS idx_module_items_item_id_fkey ON public.module_items(item_id);
CREATE INDEX IF NOT EXISTS idx_modules_parent_id_fkey ON public.modules(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_checklist_status_item_id_fkey ON public.user_checklist_status(item_id);

-- 3. Remove Unused Indexes (unused_index)
DROP INDEX IF EXISTS public.idx_waitlist_status;
DROP INDEX IF EXISTS public.idx_waitlist_email;
DROP INDEX IF EXISTS public.idx_partner_status;
DROP INDEX IF EXISTS public.idx_categories_created_by;
DROP INDEX IF EXISTS public.idx_checklist_items_created_by;
DROP INDEX IF EXISTS public.idx_module_reviews_business_id;
DROP INDEX IF EXISTS public.idx_module_reviews_created_by;
DROP INDEX IF EXISTS public.idx_module_reviews_module_id;
DROP INDEX IF EXISTS public.idx_module_reviews_user_id;
DROP INDEX IF EXISTS public.idx_modules_created_by;
DROP INDEX IF EXISTS public.idx_user_businesses_created_by;
DROP INDEX IF EXISTS public.idx_user_businesses_user_id;
DROP INDEX IF EXISTS public.idx_user_checklist_status_status_id;
DROP INDEX IF EXISTS public.idx_user_installed_modules_module_id;
DROP INDEX IF EXISTS public.idx_audit_logs_created_at;
DROP INDEX IF EXISTS public.idx_audit_logs_resource;
DROP INDEX IF EXISTS public.idx_audit_logs_actor;
DROP INDEX IF EXISTS public.idx_api_keys_org_id;
DROP INDEX IF EXISTS public.idx_api_keys_key_hash;
DROP INDEX IF EXISTS public.idx_resources_author;
DROP INDEX IF EXISTS public.idx_resources_updated_at;
DROP INDEX IF EXISTS public.idx_activity_log_member_id;
DROP INDEX IF EXISTS public.idx_checklist_module_items_module_id;
DROP INDEX IF EXISTS public.idx_user_checklist_progress_user_id;
DROP INDEX IF EXISTS public.idx_partner_users_org_id;
DROP INDEX IF EXISTS public.idx_partner_submissions_org_id;
DROP INDEX IF EXISTS public.idx_calculator_runs_org_id;
DROP INDEX IF EXISTS public.idx_resource_assets_visibility;
DROP INDEX IF EXISTS public.idx_calculator_runs_inputs;
DROP INDEX IF EXISTS public.idx_profiles_phone;
DROP INDEX IF EXISTS public.idx_profiles_last_name_lower;
DROP INDEX IF EXISTS public.idx_activity_log_visit_type;
