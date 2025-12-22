-- Marketplace Phase 2: Safety & Sandboxing

-- 1. User Module Instances (Staging & Config)
CREATE TABLE IF NOT EXISTS user_module_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'staging', -- 'staging', 'active', 'disabled'
    config JSONB DEFAULT '{}'::jsonb,
    permissions_granted JSONB DEFAULT '{}'::jsonb,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_business_id, module_id)
);

-- 2. Module Schema Changes (Conflict Tracking)
CREATE TABLE IF NOT EXISTS module_schema_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_version_id UUID REFERENCES module_versions(id) ON DELETE CASCADE,
    change_type TEXT NOT NULL, -- 'add_table', 'add_column', 'add_field'
    target_object TEXT NOT NULL, -- e.g. 'public.clients' or 'metadata:license_number'
    definition JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Module Forks (Community Contributions)
CREATE TABLE IF NOT EXISTS module_forks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_module_id UUID REFERENCES modules(id) ON DELETE RESTRICT,
    forked_module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE user_module_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_forks ENABLE ROW LEVEL SECURITY;

-- 5. Policies
DROP POLICY IF EXISTS "Users can manage their module instances" ON user_module_instances;
CREATE POLICY "Users can manage their module instances" ON user_module_instances
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can view forks" ON module_forks;
CREATE POLICY "Users can view forks" ON module_forks
    FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Users can create forks" ON module_forks;
CREATE POLICY "Users can create forks" ON module_forks
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 6. Migrate existing installations to instances (Cleanup)
INSERT INTO user_module_instances (user_business_id, module_id, status)
SELECT user_business_id, module_id, 'active' 
FROM user_installed_modules
ON CONFLICT (user_business_id, module_id) DO NOTHING;
