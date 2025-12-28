-- Migration: 20251230000002_add_missing_rls_policies.sql
-- Description: Add missing RLS policies for tables that have RLS enabled but no policies.

-- 1. cost_allocations
-- Only HR/Admins should manage cost allocations
CREATE POLICY "HR/Admins can manage cost_allocations" ON public.cost_allocations
    FOR ALL
    USING (public.is_hr_admin());

-- 2. payroll_deductions
-- HR/Admins can manage everything
CREATE POLICY "HR/Admins can manage payroll_deductions" ON public.payroll_deductions
    FOR ALL
    USING (public.is_hr_admin());

-- Employees can view their own deductions via the linked payroll entry
CREATE POLICY "Employees can view own payroll_deductions" ON public.payroll_deductions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM public.payroll_entries pe
            JOIN public.employees e ON pe.employee_id = e.id
            WHERE pe.id = payroll_deductions.payroll_entry_id
            AND e.clerk_user_id = (auth.jwt() ->> 'sub')
        )
    );

-- 3. organization_subscriptions
-- Admins can manage organization subscriptions
CREATE POLICY "Admins can manage organization_subscriptions" ON public.organization_subscriptions
    FOR ALL
    USING (public.is_hr_admin());
