-- Fix user_id type for Clerk integration
-- Clerk uses string IDs (e.g. user_2...), while Supabase defaults to UUID.
-- We must change user_id columns to TEXT to support Clerk IDs.

-- CRITICAL: Must drop policies FIRST before altering columns they depend on.

-- 1. Drop existing policies that depend on user_id

-- Core Tables
DROP POLICY IF EXISTS "user_businesses_owner_access" ON user_businesses;
DROP POLICY IF EXISTS "Users can manage their own businesses" ON user_businesses;
DROP POLICY IF EXISTS "manage_own_biz" ON user_businesses;

DROP POLICY IF EXISTS "Users can manage their own checklist status" ON user_checklist_status;
DROP POLICY IF EXISTS "user_checklist_status_owner_access" ON user_checklist_status;
DROP POLICY IF EXISTS "user_checklist_status_user_access" ON user_checklist_status;
DROP POLICY IF EXISTS "user_checklist_status_authenticated_insert" ON user_checklist_status;


DROP POLICY IF EXISTS "Users can manage their own files" ON user_uploaded_files;
DROP POLICY IF EXISTS "user_uploaded_files_owner_access" ON user_uploaded_files;

-- User Checklist Progress (Optional)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_checklist_progress') THEN
    DROP POLICY IF EXISTS "Users can view their own progress" ON user_checklist_progress;
    DROP POLICY IF EXISTS "Users can update their own progress" ON user_checklist_progress;
    DROP POLICY IF EXISTS "Users can modify their own progress" ON user_checklist_progress;
    DROP POLICY IF EXISTS "user_checklist_progress_owner_access" ON user_checklist_progress;
  END IF;
END $$;

-- Module Ecosystem Tables (Optional)
DO $$ 
BEGIN 
  -- User Installed Modules
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_installed_modules') THEN
    DROP POLICY IF EXISTS "user_installed_modules_owner_access" ON user_installed_modules;
    DROP POLICY IF EXISTS "Users can view their installed modules" ON user_installed_modules;
    DROP POLICY IF EXISTS "Users can manage their installed modules" ON user_installed_modules;
  END IF;

  -- User Module Instances (New discovery)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_module_instances') THEN
    DROP POLICY IF EXISTS "Users can manage their module instances" ON user_module_instances;
  END IF;

  -- Module Reviews
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'module_reviews') THEN
    DROP POLICY IF EXISTS "module_reviews_public_select" ON module_reviews;
    DROP POLICY IF EXISTS "Public reviews are viewable" ON module_reviews;
    DROP POLICY IF EXISTS "module_reviews_owner_insert" ON module_reviews;
    DROP POLICY IF EXISTS "Users can write reviews" ON module_reviews;
    DROP POLICY IF EXISTS "module_reviews_owner_update" ON module_reviews;
  END IF;

  -- Module Forks (New discovery)
   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'module_forks') THEN
    DROP POLICY IF EXISTS "Users can create forks" ON module_forks;
  END IF;
END $$;


-- Client Module Tables (Optional)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    DROP POLICY IF EXISTS "Users can manage clients for their businesses" ON clients;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engagements') THEN
    DROP POLICY IF EXISTS "Users can manage engagements via clients" ON engagements;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions') THEN
    DROP POLICY IF EXISTS "Users can manage sessions via engagements" ON sessions;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_milestones') THEN
    DROP POLICY IF EXISTS "Users can manage milestones via engagements" ON client_milestones;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_resources') THEN
    DROP POLICY IF EXISTS "Users can manage resources via clients" ON client_resources;
  END IF;
END $$;


-- 2. Drop Foreign Key constraints that might enforce UUID
ALTER TABLE user_businesses DROP CONSTRAINT IF EXISTS user_businesses_user_id_fkey;

DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_checklist_progress') THEN
    ALTER TABLE user_checklist_progress DROP CONSTRAINT IF EXISTS user_checklist_progress_user_id_fkey;
  END IF;
END $$;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_checklist_status' AND column_name = 'verified_by') THEN
        ALTER TABLE user_checklist_status DROP CONSTRAINT IF EXISTS user_checklist_status_verified_by_fkey;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_resources') THEN
        ALTER TABLE client_resources DROP CONSTRAINT IF EXISTS client_resources_uploaded_by_fkey;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'module_reviews') THEN
        ALTER TABLE module_reviews DROP CONSTRAINT IF EXISTS module_reviews_user_id_fkey;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'module_forks') THEN
        ALTER TABLE module_forks DROP CONSTRAINT IF EXISTS module_forks_user_id_fkey;
    END IF;
END $$;

-- 3. Alter Column Types
ALTER TABLE user_businesses ALTER COLUMN user_id TYPE TEXT;

DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_checklist_progress') THEN
    ALTER TABLE user_checklist_progress ALTER COLUMN user_id TYPE TEXT;
  END IF;
END $$;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_checklist_status' AND column_name = 'verified_by') THEN
        ALTER TABLE user_checklist_status ALTER COLUMN verified_by TYPE TEXT;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_resources' AND column_name = 'uploaded_by') THEN
        ALTER TABLE client_resources ALTER COLUMN uploaded_by TYPE TEXT;
    END IF;
    
    -- Also update module_reviews if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'module_reviews' AND column_name = 'user_id') THEN
         ALTER TABLE module_reviews ALTER COLUMN user_id TYPE TEXT;
    END IF;

    -- Update module_forks
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'module_forks' AND column_name = 'user_id') THEN
         ALTER TABLE module_forks ALTER COLUMN user_id TYPE TEXT;
    END IF;
END $$;

-- 4. Recreate Policies

-- Helper to safely get user ID as text from JWT claim or auth.uid
-- Using (select auth.jwt() ->> 'sub') is safer for Clerk as auth.uid() might fail cast to uuid.
-- However, existing policies use auth.uid(). We will use auth.uid()::text to be minimal valid.

-- user_businesses policy
CREATE POLICY "user_businesses_owner_access" ON user_businesses
    FOR ALL TO authenticated USING (auth.uid()::text = user_id);

-- user_checklist_status policy
CREATE POLICY "user_checklist_status_owner_access" ON user_checklist_status
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid()::text)
    );

-- user_uploaded_files policy
CREATE POLICY "user_uploaded_files_owner_access" ON user_uploaded_files
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = business_id AND user_id = auth.uid()::text)
    );

-- User Checklist Progress (if exists)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_checklist_progress') THEN
      CREATE POLICY "user_checklist_progress_owner_access" 
      ON user_checklist_progress FOR ALL TO authenticated USING (auth.uid()::text = user_id);
  END IF;
END $$;

-- Module Ecosystem Policies (if tables exist)
DO $$ 
BEGIN 
  -- User Installed Modules
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_installed_modules') THEN
      CREATE POLICY "user_installed_modules_owner_access" 
      ON user_installed_modules FOR ALL TO authenticated USING (
          EXISTS (
              SELECT 1 FROM user_businesses 
              WHERE id = user_business_id AND user_id = auth.uid()::text
          )
      );
  END IF;

  -- User Module Instances
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_module_instances') THEN
      CREATE POLICY "Users can manage their module instances" 
      ON user_module_instances FOR ALL TO authenticated USING (
          EXISTS (
              SELECT 1 FROM user_businesses 
              WHERE id = user_business_id AND user_id = auth.uid()::text
          )
      );
  END IF;

  -- Module Reviews
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'module_reviews') THEN
      CREATE POLICY "module_reviews_public_select" ON module_reviews FOR SELECT USING (true);

      CREATE POLICY "module_reviews_owner_insert" ON module_reviews 
      FOR INSERT WITH CHECK (auth.uid()::text = user_id);

      CREATE POLICY "module_reviews_owner_update" ON module_reviews
      FOR UPDATE USING (auth.uid()::text = user_id);
  END IF;

  -- Module Forks
   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'module_forks') THEN
      CREATE POLICY "Users can create forks" ON module_forks
      FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
  END IF;
END $$;


-- Client Module Policies (if tables exist)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
      CREATE POLICY "Users can manage clients for their businesses" ON clients
        FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid()::text)
        );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engagements') THEN
      CREATE POLICY "Users can manage engagements via clients" ON engagements
        FOR ALL TO authenticated USING (
            EXISTS (
                SELECT 1 FROM clients c
                JOIN user_businesses b ON b.id = c.user_business_id
                WHERE c.id = client_id AND b.user_id = auth.uid()::text
            )
        );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions') THEN
      CREATE POLICY "Users can manage sessions via engagements" ON sessions
        FOR ALL TO authenticated USING (
            EXISTS (
                SELECT 1 FROM engagements e
                JOIN clients c ON c.id = e.client_id
                JOIN user_businesses b ON b.id = c.user_business_id
                WHERE e.id = engagement_id AND b.user_id = auth.uid()::text
            )
        );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_milestones') THEN
      CREATE POLICY "Users can manage milestones via engagements" ON client_milestones
        FOR ALL TO authenticated USING (
            EXISTS (
                SELECT 1 FROM engagements e
                JOIN clients c ON c.id = e.client_id
                JOIN user_businesses b ON b.id = c.user_business_id
                WHERE e.id = engagement_id AND b.user_id = auth.uid()::text
            )
        );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_resources') THEN
      CREATE POLICY "Users can manage resources via clients" ON client_resources
        FOR ALL TO authenticated USING (
            EXISTS (
                SELECT 1 FROM clients c
                JOIN user_businesses b ON b.id = c.user_business_id
                WHERE c.id = client_id AND b.user_id = auth.uid()::text
            )
        );
  END IF;
END $$;
