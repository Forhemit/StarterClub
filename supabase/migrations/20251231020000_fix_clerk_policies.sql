-- Fix policies to use text-safe user ID extraction for Clerk
-- Replaces auth.uid() (which casts to UUID) with raw JWT claim 'sub'

-- Ensure helper function exists in PUBLIC schema
CREATE OR REPLACE FUNCTION public.requesting_user_id() RETURNS text
LANGUAGE sql STABLE
AS $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::text;
$$;

-- 1. Fix user_departments policies
DROP POLICY IF EXISTS "Users can view own departments" ON public.user_departments;
CREATE POLICY "Users can view own departments" ON public.user_departments
  FOR SELECT
  USING (user_id = public.requesting_user_id() OR auth.role() = 'service_role');

-- 2. Fix user_roles policies
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (
    clerk_user_id = public.requesting_user_id()
  );

-- 3. Fix role_history policies
DROP POLICY IF EXISTS "Users can read own history" ON public.role_history;
CREATE POLICY "Users can read own history" ON public.role_history
  FOR SELECT USING (
    clerk_user_id = public.requesting_user_id()
  );

-- 4. Fix profiles policies
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
CREATE POLICY "Authenticated users can read profiles" ON public.profiles
  FOR SELECT
  USING ( public.requesting_user_id() IS NOT NULL );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING ( id = public.requesting_user_id() );
