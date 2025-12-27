-- Migration: Performance Fixes (Indexes)
-- Generated based on Supabase Performance Advisor suggestions

-- 1. Add missing indexes for Foreign Keys
CREATE INDEX IF NOT EXISTS idx_activity_log_member_id ON public.activity_log(member_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON public.api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_calculator_runs_org_id ON public.calculator_runs(org_id);
CREATE INDEX IF NOT EXISTS idx_categories_created_by ON public.categories(created_by);
CREATE INDEX IF NOT EXISTS idx_checklist_items_created_by ON public.checklist_items(created_by);
CREATE INDEX IF NOT EXISTS idx_client_milestones_engagement_id ON public.client_milestones(engagement_id);
CREATE INDEX IF NOT EXISTS idx_client_resources_client_id ON public.client_resources(client_id);
CREATE INDEX IF NOT EXISTS idx_client_resources_engagement_id ON public.client_resources(engagement_id);
CREATE INDEX IF NOT EXISTS idx_client_resources_session_id ON public.client_resources(session_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_business_id ON public.clients(user_business_id);
CREATE INDEX IF NOT EXISTS idx_cost_items_financial_entity_id ON public.cost_items(financial_entity_id);
CREATE INDEX IF NOT EXISTS idx_department_leadership_appointed_by ON public.department_leadership(appointed_by);
CREATE INDEX IF NOT EXISTS idx_department_leadership_backup_leadership_id ON public.department_leadership(backup_leadership_id);
CREATE INDEX IF NOT EXISTS idx_department_leadership_partner_id ON public.department_leadership(partner_id);
CREATE INDEX IF NOT EXISTS idx_department_leadership_reports_to_leadership_id ON public.department_leadership(reports_to_leadership_id);
CREATE INDEX IF NOT EXISTS idx_department_okrs_accountable_partner_id ON public.department_okrs(accountable_partner_id);
CREATE INDEX IF NOT EXISTS idx_department_okrs_department_id ON public.department_okrs(department_id);
CREATE INDEX IF NOT EXISTS idx_departments_steward_department_code ON public.departments(steward_department_code);
CREATE INDEX IF NOT EXISTS idx_engagements_client_id ON public.engagements(client_id);
CREATE INDEX IF NOT EXISTS idx_module_forks_forked_module_id ON public.module_forks(forked_module_id);
CREATE INDEX IF NOT EXISTS idx_module_forks_original_module_id ON public.module_forks(original_module_id);
CREATE INDEX IF NOT EXISTS idx_module_reviews_business_id ON public.module_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_module_reviews_created_by ON public.module_reviews(created_by);
CREATE INDEX IF NOT EXISTS idx_module_reviews_module_id ON public.module_reviews(module_id);
CREATE INDEX IF NOT EXISTS idx_module_schema_changes_module_version_id ON public.module_schema_changes(module_version_id);
CREATE INDEX IF NOT EXISTS idx_modules_created_by ON public.modules(created_by);
CREATE INDEX IF NOT EXISTS idx_partner_submissions_org_id ON public.partner_submissions(org_id);
CREATE INDEX IF NOT EXISTS idx_partner_users_org_id ON public.partner_users(org_id);
CREATE INDEX IF NOT EXISTS idx_resource_assets_author_id ON public.resource_assets(author_id);
CREATE INDEX IF NOT EXISTS idx_revenue_items_financial_entity_id ON public.revenue_items(financial_entity_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_role_requests_user_id ON public.role_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_engagement_id ON public.sessions(engagement_id);
CREATE INDEX IF NOT EXISTS idx_user_businesses_created_by ON public.user_businesses(created_by);
CREATE INDEX IF NOT EXISTS idx_user_checklist_status_status_id ON public.user_checklist_status(status_id);
CREATE INDEX IF NOT EXISTS idx_user_installed_modules_module_id ON public.user_installed_modules(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_instances_module_id ON public.user_module_instances(module_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_uploaded_files_business_id ON public.user_uploaded_files(business_id);
CREATE INDEX IF NOT EXISTS idx_user_uploaded_files_item_id ON public.user_uploaded_files(item_id);

-- 2. Drop unused indexes
DROP INDEX IF EXISTS public.idx_checklist_items_category_id_fkey;
DROP INDEX IF EXISTS public.idx_module_dependencies_dependency_module_id_fkey;
DROP INDEX IF EXISTS public.idx_module_items_item_id_fkey;
DROP INDEX IF EXISTS public.idx_modules_parent_id_fkey;
DROP INDEX IF EXISTS public.idx_user_checklist_status_item_id_fkey;
DROP INDEX IF EXISTS public.idx_dept_leadership_dept_partner;
DROP INDEX IF EXISTS public.idx_dept_fin_acc_dept_entity;
DROP INDEX IF EXISTS public.idx_partners_department_id;
DROP INDEX IF EXISTS public.idx_partners_steward_department_id;
DROP INDEX IF EXISTS public.idx_events_created_by;

