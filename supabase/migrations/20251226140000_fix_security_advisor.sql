-- Migration: Fix Security Advisor Issues
-- Description:
-- 1. Enable RLS on public tables flagged as insecure.
-- 2. Add baseline "Authenticated Read" policies to prevent breakage while satisfying the linter.
-- 3. Set `security_invoker = on` for views flagged as "Security Definer View" to ensure they respect RLS.

-- 1. Enable RLS on Tables
ALTER TABLE IF EXISTS public.department_leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.department_financial_accountability ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.module_schema_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.financial_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.revenue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.department_okrs ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies
-- Note: We apply a "Allow Authenticated Read" strategy to maintain dashboard visibility.
-- Granular access control should be refined based on specific business rules.

-- Module Schema Changes: System metadata, safe for auth read
DROP POLICY IF EXISTS "Allow authenticated read" ON public.module_schema_changes;
CREATE POLICY "Allow authenticated read" ON public.module_schema_changes
    FOR SELECT TO authenticated USING (true);

-- Departments: Reference data, safe for auth read
DROP POLICY IF EXISTS "Allow authenticated read" ON public.departments;
CREATE POLICY "Allow authenticated read" ON public.departments
    FOR SELECT TO authenticated USING (true);

-- Partners: Team directory, likely needed for organization views
DROP POLICY IF EXISTS "Allow authenticated read" ON public.partners;
CREATE POLICY "Allow authenticated read" ON public.partners
    FOR SELECT TO authenticated USING (true);

-- Department Leadership: Org chart info
DROP POLICY IF EXISTS "Allow authenticated read" ON public.department_leadership;
CREATE POLICY "Allow authenticated read" ON public.department_leadership
    FOR SELECT TO authenticated USING (true);

-- Financial/Operational Data
-- Used in dashboards. Requiring "Authenticated" ensures they aren't public to the anonymous web.
DROP POLICY IF EXISTS "Allow authenticated read" ON public.department_financial_accountability;
CREATE POLICY "Allow authenticated read" ON public.department_financial_accountability
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.financial_entities;
CREATE POLICY "Allow authenticated read" ON public.financial_entities
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.revenue_items;
CREATE POLICY "Allow authenticated read" ON public.revenue_items
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.cost_items;
CREATE POLICY "Allow authenticated read" ON public.cost_items
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.department_okrs;
CREATE POLICY "Allow authenticated read" ON public.department_okrs
    FOR SELECT TO authenticated USING (true);

-- 3. Update Views to be Security Invoker
-- This ensures the view executes with the permissions of the user calling it, avoiding "Security Definer" risks.
-- Requires Postgres 15+ (Standard on Supabase).

ALTER VIEW public.department_pl_statement SET (security_invoker = on);
ALTER VIEW public.department_entities SET (security_invoker = on);
ALTER VIEW public.partner_access_by_department SET (security_invoker = on);
ALTER VIEW public.department_scorecard SET (security_invoker = on);
ALTER VIEW public.department_head_dashboard SET (security_invoker = on);
