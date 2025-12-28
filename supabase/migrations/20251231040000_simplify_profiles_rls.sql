-- Update RLS policies to work with Clerk JWT template that uses user_metadata
-- Since 'sub' is reserved, we pass user_id via user_metadata.user_id claim

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated SELECT on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profiles" ON public.profiles;

-- Helper function to extract user ID from JWT user_metadata
CREATE OR REPLACE FUNCTION public.get_jwt_user_id() RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claims', true)::json->>'user_id', ''),
    nullif(current_setting('request.jwt.claim.user_metadata', true)::json->>'user_id', ''),
    nullif((current_setting('request.jwt.claims', true)::json->'user_metadata'->>'user_id'), '')
  )::text;
$$;

-- Allow any authenticated user to SELECT profiles (safe for public profile data)
CREATE POLICY "authenticated_select_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can UPDATE only their own profile
CREATE POLICY "users_update_own_profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = public.get_jwt_user_id())
WITH CHECK (id = public.get_jwt_user_id());

-- Service role has full access
CREATE POLICY "service_role_all_profiles"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Also update user_roles policies for consistency
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "users_read_own_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (clerk_user_id = public.get_jwt_user_id());

-- Update user_departments policies
DROP POLICY IF EXISTS "Users can view own departments" ON public.user_departments;
CREATE POLICY "users_view_own_departments"
ON public.user_departments
FOR SELECT
TO authenticated
USING (user_id = public.get_jwt_user_id());
