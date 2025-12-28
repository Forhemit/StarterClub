-- Migration: 20251230000001_fix_function_search_paths.sql
-- Description: Fix "Function Search Path Mutable" warnings by setting search_path = public
-- This prevents search_path manipulation attacks.

-- 1. is_hr_admin
ALTER FUNCTION public.is_hr_admin() SET search_path = public;

-- 2. get_user_role_timeline
ALTER FUNCTION public.get_user_role_timeline(TEXT, TIMESTAMP, TIMESTAMP) SET search_path = public;

-- 3. get_employee_full_history
ALTER FUNCTION public.get_employee_full_history(UUID) SET search_path = public;

-- 4. update_updated_at_column
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- 5. update_profile_roles
ALTER FUNCTION public.update_profile_roles() SET search_path = public;

-- 6. log_employee_changes
ALTER FUNCTION public.log_employee_changes() SET search_path = public;

-- 7. assign_user_roles
ALTER FUNCTION public.assign_user_roles(TEXT, TEXT[], TEXT, TEXT) SET search_path = public;

-- 8. log_role_history
ALTER FUNCTION public.log_role_history() SET search_path = public;

-- 9. calculate_employee_tenure
ALTER FUNCTION public.calculate_employee_tenure(UUID) SET search_path = public;

-- 10. get_member_active_subscription
ALTER FUNCTION public.get_member_active_subscription(UUID) SET search_path = public;

-- 11. handle_member_subscriptions_updated_at
ALTER FUNCTION public.handle_member_subscriptions_updated_at() SET search_path = public;
