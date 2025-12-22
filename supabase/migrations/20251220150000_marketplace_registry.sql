-- Foundation Builders Marketplace Schema

-- 1. Expand Modules Table
ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Starter Club',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS icon TEXT;

-- 2. Module Versions
CREATE TABLE IF NOT EXISTS module_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    changelog TEXT,
    seed_script TEXT, -- The SQL snippet to run on install
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Installed Modules
CREATE TABLE IF NOT EXISTS user_installed_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_business_id, module_id)
);

-- 4. Module Dependencies
CREATE TABLE IF NOT EXISTS module_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    requires_module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE(module_id, requires_module_id)
);

-- 5. Enable RLS
ALTER TABLE user_installed_modules ENABLE ROW LEVEL SECURITY;

-- 6. Policies
DROP POLICY IF EXISTS "Users can view their installed modules" ON user_installed_modules;
CREATE POLICY "Users can view their installed modules" ON user_installed_modules
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can install modules for their businesses" ON user_installed_modules;
CREATE POLICY "Users can install modules for their businesses" ON user_installed_modules
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid())
    );

-- 7. Marketplace Public Views
DROP POLICY IF EXISTS "Public modules are viewable by everyone" ON modules;
CREATE POLICY "Public modules are viewable by everyone" ON modules
    FOR SELECT TO authenticated USING (is_public = TRUE);
