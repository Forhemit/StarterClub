-- Migration: Restore Critical Performance Indexes
-- Description: Re-adding indexes that were dropped as 'unused' but are required for Foreign Key constraints.

-- 1. Restore indexes for Unindexed Foreign Keys identified in latest report
CREATE INDEX IF NOT EXISTS idx_checklist_items_category_id ON public.checklist_items(category_id);
CREATE INDEX IF NOT EXISTS idx_department_financial_accountability_department_id ON public.department_financial_accountability(department_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_module_dependencies_dependency_module_id ON public.module_dependencies(dependency_module_id);
CREATE INDEX IF NOT EXISTS idx_modules_parent_id ON public.modules(parent_id);
CREATE INDEX IF NOT EXISTS idx_partners_department_id ON public.partners(department_id);
CREATE INDEX IF NOT EXISTS idx_partners_steward_of_department_id ON public.partners(steward_of_department_id);
