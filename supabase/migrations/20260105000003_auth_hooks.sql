-- Auth Hooks: Inject Organization ID into JWT Claims
-- Ensures RLS policies work by providing 'organization_id' in app_metadata

BEGIN;

-- 1. Create Function to Sync Organization ID to Auth Metadata
CREATE OR REPLACE FUNCTION public.sync_org_to_metadata()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
    v_org_role TEXT;
BEGIN
    -- Find the user's primary organization
    -- For now, we take the first one they own or are part of.
    -- In the future, this could be a 'last_active_org' stored in profiles.
    
    SELECT organization_id, relationship_type 
    INTO v_org_id, v_org_role
    FROM public.organization_companies oc
    JOIN public.core_companies cc ON oc.company_id = cc.id
    WHERE cc.legacy_id IS NOT NULL -- Just a heuristic to find linked companies, actually we need a user mapping
    LIMIT 1;
    
    -- Wait, the previous migration linked 'Core Companies' to 'Organizations'.
    -- But 'Auth Users' are owners of 'Organizations'.
    -- The link is: Organizations.owner_email = Auth.Users.email
    
    SELECT id INTO v_org_id
    FROM public.organizations
    WHERE owner_email = NEW.email
    ORDER BY created_at ASC
    LIMIT 1;

    -- If found, update the auth.users metadata
    IF v_org_id IS NOT NULL THEN
        UPDATE auth.users
        SET raw_app_meta_data = 
            COALESCE(raw_app_meta_data, '{}'::jsonb) || 
            jsonb_build_object(
                'organization_id', v_org_id,
                'organization_role', 'owner' -- Default to owner for now since we match on email
            )
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create Trigger on Auth.Users (Login / Update)
-- We attach this to UPDATE so it refreshes on login if mapped data changes (Clerk syncs user on login usually)
-- Also INSERT for new users.

DROP TRIGGER IF EXISTS on_auth_user_sync_org ON auth.users;

CREATE TRIGGER on_auth_user_sync_org
    AFTER INSERT OR UPDATE OF email, last_sign_in_at
    ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_org_to_metadata();

-- 3. Sync existing users immediately (Migration step)
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT * FROM auth.users LOOP
        -- perform update logic directly since trigger function can't be called here
        
        UPDATE auth.users au
        SET raw_app_meta_data = 
            COALESCE(raw_app_meta_data, '{}'::jsonb) || 
            jsonb_build_object(
                'organization_id', (
                    SELECT id FROM public.organizations 
                    WHERE owner_email = au.email 
                    ORDER BY created_at ASC LIMIT 1
                ),
                'organization_role', 'owner'
            )
        WHERE au.id = user_record.id
          AND au.email IS NOT NULL;
    END LOOP;
END;
$$;

COMMIT;
