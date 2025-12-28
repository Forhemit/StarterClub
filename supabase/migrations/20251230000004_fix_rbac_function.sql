CREATE OR REPLACE FUNCTION update_profile_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profiles table with current active roles
  UPDATE public.profiles p
  SET 
    active_roles = (
      SELECT array_agg(DISTINCT ur.role_slug)
      FROM public.user_roles ur
      WHERE ur.clerk_user_id = NEW.clerk_user_id
        AND ur.is_active = TRUE
        AND (ur.effective_until IS NULL OR ur.effective_until > NOW())
        AND ur.effective_from <= NOW()
    ),
    primary_role = (
      SELECT ur.role_slug
      FROM public.user_roles ur
      WHERE ur.clerk_user_id = NEW.clerk_user_id
        AND ur.is_primary = TRUE
        AND ur.is_active = TRUE
        AND (ur.effective_until IS NULL OR ur.effective_until > NOW())
        AND ur.effective_from <= NOW()
      LIMIT 1
    ),
    highest_permission_level = (
      SELECT MAX(r.permission_level)
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_slug = r.slug
      WHERE ur.clerk_user_id = NEW.clerk_user_id
        AND ur.is_active = TRUE
        AND (ur.effective_until IS NULL OR ur.effective_until > NOW())
        AND ur.effective_from <= NOW()
    ),
    last_role_change_at = NOW(),
    updated_at = NOW()
  WHERE p.id = NEW.clerk_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
