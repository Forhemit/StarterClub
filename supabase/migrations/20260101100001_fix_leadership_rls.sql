-- Fix the RLS policy for leadership_role_profiles
-- The previous migration created a policy with auth.uid() which doesn't work with Clerk

-- Drop the existing broken policy
DROP POLICY IF EXISTS "Users can manage their own leadership profiles" ON leadership_role_profiles;

-- Recreate with the correct Clerk-compatible function
CREATE POLICY "Users can manage their own leadership profiles"
ON leadership_role_profiles
FOR ALL
USING (
    user_business_id IN (
        SELECT id FROM user_businesses WHERE user_id = public.get_jwt_user_id()
    )
)
WITH CHECK (
    user_business_id IN (
        SELECT id FROM user_businesses WHERE user_id = public.get_jwt_user_id()
    )
);
