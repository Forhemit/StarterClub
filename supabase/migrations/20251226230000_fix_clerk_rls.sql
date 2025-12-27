-- Fix RLS policies and Column Types to support Clerk IDs (Strings)
-- Re-ordering to Drop Policies FIRST, then Alter Columns, then Re-create Policies

-- =============================================================================
-- 1. DROP ALL DEPENDENT POLICIES (Required before changing column types)
-- =============================================================================

-- user_businesses
DROP POLICY IF EXISTS "user_businesses_owner_access" ON user_businesses;
DROP POLICY IF EXISTS "Users can manage their own businesses" ON user_businesses;
DROP POLICY IF EXISTS "manage_own_biz" ON user_businesses;

-- user_checklist_status
DROP POLICY IF EXISTS "user_checklist_status_owner_access" ON user_checklist_status;
DROP POLICY IF EXISTS "Users can manage their own checklist status" ON user_checklist_status;

-- user_uploaded_files
DROP POLICY IF EXISTS "user_uploaded_files_owner_access" ON user_uploaded_files;
DROP POLICY IF EXISTS "Users can manage their own files" ON user_uploaded_files;

-- scouts
DROP POLICY IF EXISTS "scouts_select_policy" ON scouts;
DROP POLICY IF EXISTS "scouts_write_policy" ON scouts;
DROP POLICY IF EXISTS "scouts_update_policy" ON scouts;
DROP POLICY IF EXISTS "scouts_delete_policy" ON scouts;
DROP POLICY IF EXISTS "Admins can manage scouts" ON scouts;
DROP POLICY IF EXISTS "Scouts can view own profile" ON scouts;

-- referrals
DROP POLICY IF EXISTS "referrals_select_policy" ON referrals;
DROP POLICY IF EXISTS "referrals_write_policy" ON referrals;
DROP POLICY IF EXISTS "referrals_update_policy" ON referrals;
DROP POLICY IF EXISTS "referrals_delete_policy" ON referrals;
DROP POLICY IF EXISTS "Admins can manage referrals" ON referrals;
DROP POLICY IF EXISTS "Scouts can view own referrals" ON referrals;

-- events
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Admins can update any event" ON events;
DROP POLICY IF EXISTS "Events are viewable by authenticated users" ON events;
DROP POLICY IF EXISTS "Users and Admins can update events" ON events; -- Added this missed policy

-- event_attendees
DROP POLICY IF EXISTS "Users can join events" ON event_attendees;
DROP POLICY IF EXISTS "Users can update own rsvp" ON event_attendees;
DROP POLICY IF EXISTS "Users can leave events" ON event_attendees;
DROP POLICY IF EXISTS "Authenticated users can view attendees" ON event_attendees;

-- Additional tables
DROP POLICY IF EXISTS "user_installed_modules_owner_access" ON user_installed_modules;
DROP POLICY IF EXISTS "Users can manage their module instances" ON user_module_instances;
DROP POLICY IF EXISTS "module_reviews_owner_insert" ON module_reviews;
DROP POLICY IF EXISTS "module_reviews_owner_update" ON module_reviews;
DROP POLICY IF EXISTS "Users can create forks" ON module_forks;
DROP POLICY IF EXISTS "Users can manage clients for their businesses" ON clients;
DROP POLICY IF EXISTS "Users can manage engagements via clients" ON engagements;
DROP POLICY IF EXISTS "Users can manage sessions via engagements" ON sessions;
DROP POLICY IF EXISTS "Users can manage milestones via engagements" ON client_milestones;
DROP POLICY IF EXISTS "Users can manage resources via clients" ON client_resources;


-- =============================================================================
-- 2. ALTER COLUMNS & DROP FKs
-- =============================================================================

-- user_businesses
DO $$ BEGIN
    ALTER TABLE user_businesses DROP CONSTRAINT IF EXISTS user_businesses_user_id_fkey;
    ALTER TABLE user_businesses ALTER COLUMN user_id TYPE TEXT;
END $$;

-- scouts
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scouts') THEN
        ALTER TABLE scouts DROP CONSTRAINT IF EXISTS scouts_user_id_fkey;
        ALTER TABLE scouts ALTER COLUMN user_id TYPE TEXT;
    END IF;
END $$;

-- events
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
        ALTER TABLE events DROP CONSTRAINT IF EXISTS events_created_by_fkey;
        ALTER TABLE events ALTER COLUMN created_by TYPE TEXT;
    END IF;
END $$;

-- event_attendees
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_attendees') THEN
        ALTER TABLE event_attendees DROP CONSTRAINT IF EXISTS event_attendees_user_id_fkey;
        ALTER TABLE event_attendees ALTER COLUMN user_id TYPE TEXT;
    END IF;
END $$;

-- Checklist Progress
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_checklist_progress') THEN
        DROP POLICY IF EXISTS "user_checklist_progress_owner_access" ON user_checklist_progress; -- Drop policy here just in case
        ALTER TABLE user_checklist_progress DROP CONSTRAINT IF EXISTS user_checklist_progress_user_id_fkey;
        ALTER TABLE user_checklist_progress ALTER COLUMN user_id TYPE TEXT;
    END IF;
END $$;

-- Other misc columns
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_checklist_status' AND column_name = 'verified_by') THEN
        ALTER TABLE user_checklist_status DROP CONSTRAINT IF EXISTS user_checklist_status_verified_by_fkey;
        ALTER TABLE user_checklist_status ALTER COLUMN verified_by TYPE TEXT;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_resources' AND column_name = 'uploaded_by') THEN
        ALTER TABLE client_resources DROP CONSTRAINT IF EXISTS client_resources_uploaded_by_fkey;
        ALTER TABLE client_resources ALTER COLUMN uploaded_by TYPE TEXT;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'module_reviews' AND column_name = 'user_id') THEN
        ALTER TABLE module_reviews DROP CONSTRAINT IF EXISTS module_reviews_user_id_fkey;
        ALTER TABLE module_reviews ALTER COLUMN user_id TYPE TEXT;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'module_forks' AND column_name = 'user_id') THEN
        ALTER TABLE module_forks DROP CONSTRAINT IF EXISTS module_forks_user_id_fkey;
        ALTER TABLE module_forks ALTER COLUMN user_id TYPE TEXT;
    END IF;
END $$;


-- =============================================================================
-- 3. RE-CREATE POLICIES
-- =============================================================================

-- user_businesses
CREATE POLICY "user_businesses_owner_access" ON user_businesses
    FOR ALL USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- user_checklist_status
CREATE POLICY "user_checklist_status_owner_access" ON user_checklist_status
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_checklist_status.user_business_id 
            AND user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- user_uploaded_files
CREATE POLICY "user_uploaded_files_owner_access" ON user_uploaded_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_uploaded_files.business_id 
            AND user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- user_installed_modules
CREATE POLICY "user_installed_modules_owner_access" ON user_installed_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_businesses 
            WHERE id = user_installed_modules.user_business_id 
            AND user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- user_module_instances
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_module_instances' AND column_name = 'user_business_id') THEN
        EXECUTE 'CREATE POLICY "Users can manage their module instances" ON user_module_instances FOR ALL USING (EXISTS (SELECT 1 FROM user_businesses WHERE id = user_module_instances.user_business_id AND user_id = (SELECT auth.jwt() ->> ''sub'')))';
   END IF;
END $$;

-- module_reviews
CREATE POLICY "module_reviews_owner_insert" ON module_reviews
    FOR INSERT WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));
CREATE POLICY "module_reviews_owner_update" ON module_reviews
    FOR UPDATE USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- module_forks
CREATE POLICY "Users can create forks" ON module_forks
    FOR INSERT WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

-- clients
CREATE POLICY "Users can manage clients for their businesses" ON clients
    FOR ALL USING (
        user_business_id IN (
            SELECT id FROM user_businesses WHERE user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- engagements
CREATE POLICY "Users can manage engagements via clients" ON engagements
    FOR ALL USING (
        client_id IN (
            SELECT c.id FROM clients c
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- sessions
CREATE POLICY "Users can manage sessions via engagements" ON sessions
    FOR ALL USING (
        engagement_id IN (
            SELECT e.id FROM engagements e
            JOIN clients c ON e.client_id = c.id
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- client_milestones
CREATE POLICY "Users can manage milestones via engagements" ON client_milestones
    FOR ALL USING (
        engagement_id IN (
            SELECT e.id FROM engagements e
            JOIN clients c ON e.client_id = c.id
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- client_resources
CREATE POLICY "Users can manage resources via clients" ON client_resources
    FOR ALL USING (
        client_id IN (
            SELECT c.id FROM clients c
            JOIN user_businesses ub ON c.user_business_id = ub.id
            WHERE ub.user_id = (SELECT auth.jwt() ->> 'sub')
        )
    );

-- scouts
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scouts') THEN
        EXECUTE 'CREATE POLICY "scouts_select_policy" ON scouts FOR SELECT TO authenticated USING (((SELECT auth.jwt()) -> ''app_metadata'' ->> ''role'') IN (''admin'', ''super_admin'') OR user_id = (SELECT auth.jwt() ->> ''sub''))';
    END IF;
END $$;


-- referrals
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrals') THEN
        EXECUTE 'CREATE POLICY "referrals_select_policy" ON referrals FOR SELECT TO authenticated USING (((SELECT auth.jwt()) -> ''app_metadata'' ->> ''role'') IN (''admin'', ''super_admin'') OR EXISTS (SELECT 1 FROM scouts WHERE scouts.id = referrals.scout_id AND scouts.user_id = (SELECT auth.jwt() ->> ''sub'')))';
    END IF;
END $$;

-- events
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
        EXECUTE 'CREATE POLICY "Users and Admins can update events" ON events FOR UPDATE USING (created_by = (SELECT auth.jwt() ->> ''sub'') OR (((SELECT auth.jwt()) -> ''app_metadata'' ->> ''role'') IN (''admin'', ''super_admin'')))';
    END IF;
END $$;

-- event_attendees
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_attendees') THEN
        EXECUTE 'CREATE POLICY "Users can join events" ON event_attendees FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.jwt() ->> ''sub''))';
        EXECUTE 'CREATE POLICY "Users can update own rsvp" ON event_attendees FOR UPDATE TO authenticated USING (user_id = (SELECT auth.jwt() ->> ''sub''))';
        EXECUTE 'CREATE POLICY "Users can leave events" ON event_attendees FOR DELETE TO authenticated USING (user_id = (SELECT auth.jwt() ->> ''sub''))';
    END IF;
END $$;
