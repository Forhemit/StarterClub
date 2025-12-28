-- Migration: 20251231000000_fix_warnings.sql
-- Description: Resolve RLS performance warnings, add indexes, and fix linter errors

-- =============================================================================
-- 1. UTILITY FUNCTIONS
-- =============================================================================

-- Create a STABLE function to wrap auth.jwt() ->> 'sub'
-- This ensures the claim is evaluated once per statement (InitPlan) rather than per row.
CREATE OR REPLACE FUNCTION public.auth_user_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  );
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.auth_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.auth_user_id() TO anon;


-- =============================================================================
-- 2. FIX RLS POLICIES (auth_rls_initplan)
-- =============================================================================

-- user_businesses
DROP POLICY IF EXISTS "user_businesses_owner_access" ON user_businesses;
CREATE POLICY "user_businesses_owner_access" ON user_businesses
    FOR ALL USING (user_id = (SELECT auth_user_id()));

-- user_checklist_status
DROP POLICY IF EXISTS "user_checklist_status_owner_access" ON user_checklist_status;
CREATE POLICY "user_checklist_status_owner_access" ON user_checklist_status
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_checklist_status.user_business_id 
            AND user_id = (SELECT auth_user_id())
        )
    );

-- user_uploaded_files
DROP POLICY IF EXISTS "user_uploaded_files_owner_access" ON user_uploaded_files;
CREATE POLICY "user_uploaded_files_owner_access" ON user_uploaded_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_uploaded_files.business_id 
            AND user_id = (SELECT auth_user_id())
        )
    );

-- events (Update fix)
DROP POLICY IF EXISTS "Users and Admins can update events" ON events;
CREATE POLICY "Users and Admins can update events" ON events
    FOR UPDATE USING (
        created_by = (SELECT auth_user_id()) 
        OR (
            (SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
        )
    );

-- event_attendees
DROP POLICY IF EXISTS "Users can join events" ON event_attendees;
DROP POLICY IF EXISTS "Users can update own rsvp" ON event_attendees;
DROP POLICY IF EXISTS "Users can leave events" ON event_attendees;

CREATE POLICY "Users can join events" ON event_attendees 
    FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth_user_id()));

CREATE POLICY "Users can update own rsvp" ON event_attendees 
    FOR UPDATE TO authenticated USING (user_id = (SELECT auth_user_id()));

CREATE POLICY "Users can leave events" ON event_attendees 
    FOR DELETE TO authenticated USING (user_id = (SELECT auth_user_id()));


-- =============================================================================
-- 3. FIX MULTIPLE PERMISSIVE POLICIES (SELECT Split)
-- =============================================================================

-- Re-implement loop for employee tables to split Write vs Read policies
DO $block$ 
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'employees', 'employment_status_history', 'title_history', 'departments',
      'department_history', 'compensation_history', 'personal_info_history',
      'education_history', 'certification_history', 'performance_reviews',
      'leave_history', 'equipment_history', 'emergency_contact_history',
      'training_history', 'benefits_enrollment_history', 'incident_history',
      'work_schedule_history', 'skill_inventory', 'project_assignments',
      'mentorship_history', 'recognition_history', 'expense_history',
      'visa_history', 'health_safety_records', 'exit_interviews',
      'employee_audit_log'
    )
  LOOP
    -- 1. Drop old "everything" policy
    EXECUTE format('DROP POLICY IF EXISTS "HR/Admins can do everything on %I" ON public.%I', tbl, tbl);
    
    -- 2. Create Write-only policy for HR/Admins (Insert, Update, Delete)
    EXECUTE format('
      CREATE POLICY "HR/Admins can manage %I" ON public.%I
      FOR ALL USING ( public.is_hr_admin() )
      WITH CHECK ( public.is_hr_admin() );
    ', tbl, tbl);

    -- 3. Create consolidated READ policy (Select)
    -- This combines HR access AND Employee access into a single SELECT policy
    IF tbl = 'employees' THEN
        -- Employees table logic
        EXECUTE format('
             DROP POLICY IF EXISTS "Employees can view own record on %I" ON public.%I;
             CREATE POLICY "Unified view access on %I" ON public.%I
             FOR SELECT USING (
                public.is_hr_admin() 
                OR clerk_user_id = (SELECT auth_user_id())
             );
        ', tbl, tbl, tbl, tbl);
    ELSIF tbl IN ('departments', 'benefits_packages', 'benefits_plans', 'company_assets', 'projects', 'review_cycles') THEN
        -- Reference tables logic (Public to authenticated)
        EXECUTE format('
             DROP POLICY IF EXISTS "Employees can view reference data on %I" ON public.%I;
             CREATE POLICY "Unified view access on %I" ON public.%I
             FOR SELECT USING (
                auth.role() = ''authenticated''
             );
        ', tbl, tbl, tbl, tbl);
    ELSIF tbl = 'employee_audit_log' THEN
        -- Audit log logic (Admin only or own record if applicable, but audit log usually has employee_id, let's treat as history)
        -- However, previous error said clerk_user_id missing. 
        -- Checking schema: employee_audit_log has employee_id.
        -- So it should fall into the ELSE block actually? 
        -- Ah, wait, if I put it in ELSE, it joins on employee_id. 
        EXECUTE format('
             DROP POLICY IF EXISTS "Employees can view own history on %I" ON public.%I;
             CREATE POLICY "Unified view access on %I" ON public.%I
             FOR SELECT USING (
                public.is_hr_admin() 
                OR employee_id IN (
                    SELECT id FROM public.employees 
                    WHERE clerk_user_id = (SELECT auth_user_id())
                )
             );
        ', tbl, tbl, tbl, tbl);
    ELSE
        -- Other history tables logic
        EXECUTE format('
             DROP POLICY IF EXISTS "Employees can view own history on %I" ON public.%I;
             CREATE POLICY "Unified view access on %I" ON public.%I
             FOR SELECT USING (
                public.is_hr_admin() 
                OR employee_id IN (
                    SELECT id FROM public.employees 
                    WHERE clerk_user_id = (SELECT auth_user_id())
                )
             );
        ', tbl, tbl, tbl, tbl);
    END IF;

  END LOOP;
END $block$;


-- =============================================================================
-- 4. ADD MISSING INDEXES (unindexed_foreign_keys)
-- =============================================================================

-- Fix: Add missing columns to departments table (skipped in 20251229 due to IF NOT EXISTS)
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS parent_department_id UUID REFERENCES public.departments(id);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS department_head_id UUID; -- Referenced in 20251229 but potentially missing
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS department_level INTEGER;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS department_admin_id UUID;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS cost_center TEXT;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS budget_code TEXT;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS primary_location TEXT;

CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token); 
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON departments(parent_department_id);
CREATE INDEX IF NOT EXISTS idx_departments_head_id ON departments(department_head_id);
CREATE INDEX IF NOT EXISTS idx_employees_current_dept ON employees(current_department_id);
CREATE INDEX IF NOT EXISTS idx_employees_current_mgr ON employees(current_manager_id);
CREATE INDEX IF NOT EXISTS idx_benefits_plans_package_id ON benefits_plans(package_id);
CREATE INDEX IF NOT EXISTS idx_benefits_enrollment_plan_id ON benefits_enrollment_history(benefits_plan_id);
CREATE INDEX IF NOT EXISTS idx_comp_history_benefits_pkg ON compensation_history(benefits_package_id);
CREATE INDEX IF NOT EXISTS idx_incident_investigator ON incident_history(investigator_id);
CREATE INDEX IF NOT EXISTS idx_equipment_asset ON equipment_history(asset_id);
CREATE INDEX IF NOT EXISTS idx_proj_assign_project ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_proj_assign_manager ON project_assignments(project_manager_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_mentor ON mentorship_history(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_mentee ON mentorship_history(mentee_id);
CREATE INDEX IF NOT EXISTS idx_perf_review_cycle ON performance_reviews(review_cycle_id);
CREATE INDEX IF NOT EXISTS idx_perf_review_reviewer ON performance_reviews(reviewer_id);

-- =============================================================================
-- 5. FIX LINT WARNINGS (function_search_path_mutable)
-- =============================================================================

ALTER FUNCTION public.is_hr_admin() SET search_path = public;
ALTER FUNCTION public.get_employee_full_history(UUID) SET search_path = public;
ALTER FUNCTION public.log_employee_changes() SET search_path = public;
ALTER FUNCTION public.calculate_employee_tenure(UUID) SET search_path = public;

-- =============================================================================
-- 6. FIX LINT WARNINGS (rls_enabled_no_policy)
-- =============================================================================

-- organization_subscriptions
DROP POLICY IF EXISTS "Admins can manage org subscriptions" ON organization_subscriptions;
CREATE POLICY "Admins can manage org subscriptions" ON organization_subscriptions
    FOR ALL USING (
        (SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

-- payroll_deductions
-- Assuming this relates to payroll_runs or employee deductions
DROP POLICY IF EXISTS "HR/Admins can manage payroll deductions" ON payroll_deductions;
CREATE POLICY "HR/Admins can manage payroll deductions" ON payroll_deductions
    FOR ALL USING ( public.is_hr_admin() );

-- cost_allocations
DROP POLICY IF EXISTS "HR/Admins can manage cost allocations" ON cost_allocations;
CREATE POLICY "HR/Admins can manage cost allocations" ON cost_allocations
    FOR ALL USING ( public.is_hr_admin() );
