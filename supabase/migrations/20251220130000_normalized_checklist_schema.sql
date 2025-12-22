-- Refactor to Normalized Schema

-- 1. Drop old tables/policies if they exist (Clean state)
-- Note: usage of CASCADE can be dangerous in production, but if we are normalizing, we want to clear old structure.
-- However, for idempotency on re-runs where we might want to keep data if the table was just created, we should be careful.
-- Since the user is hitting "exists" errors, it implies the new structure might already be partially there.
-- But lines 4-7 are reducing old specific tables.
DROP TABLE IF EXISTS user_checklist_progress CASCADE;
DROP TABLE IF EXISTS checklist_module_items CASCADE;
DROP TABLE IF EXISTS checklist_modules CASCADE;
DROP TABLE IF EXISTS checklist_items CASCADE;

-- 2. Create Lookup Tables
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- 'not_started', 'in_progress', 'complete'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Core Tables
CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    metadata_schema JSONB DEFAULT '{}'::jsonb, -- Defines fields for metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS module_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    UNIQUE(module_id, item_id)
);

-- 4. Create Business Identity & tracking
CREATE TABLE IF NOT EXISTS user_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    primary_module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    legal_structure TEXT,
    ein TEXT,
    start_date DATE,
    address TEXT,
    contact_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_checklist_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID REFERENCES user_businesses(id) ON DELETE CASCADE,
    item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    status_id UUID REFERENCES statuses(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb, -- Stores license #, dates, etc.
    completed_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ, -- Admin verification
    verified_by UUID REFERENCES auth.users(id),
    notes TEXT,
    UNIQUE(user_business_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES user_businesses(id) ON DELETE CASCADE,
    item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT false, -- For version control
    description TEXT
);

-- 5. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_uploaded_files ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "Categories viewable by all auth" ON categories;
CREATE POLICY "Categories viewable by all auth" ON categories FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Statuses viewable by all auth" ON statuses;
CREATE POLICY "Statuses viewable by all auth" ON statuses FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Checklist items viewable by all auth" ON checklist_items;
CREATE POLICY "Checklist items viewable by all auth" ON checklist_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Modules viewable by all auth" ON modules;
CREATE POLICY "Modules viewable by all auth" ON modules FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Module items viewable by all auth" ON module_items;
CREATE POLICY "Module items viewable by all auth" ON module_items FOR SELECT TO authenticated USING (true);

-- User-specific data
DROP POLICY IF EXISTS "Users can manage their own businesses" ON user_businesses;
CREATE POLICY "Users can manage their own businesses" ON user_businesses
    FOR ALL TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own checklist status" ON user_checklist_status;
CREATE POLICY "Users can manage their own checklist status" ON user_checklist_status
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can manage their own files" ON user_uploaded_files;
CREATE POLICY "Users can manage their own files" ON user_uploaded_files
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = business_id AND user_id = auth.uid())
    );

-- 7. Seed initial lookups
-- Use ON CONFLICT DO NOTHING to prevent dupes
INSERT INTO statuses (name) VALUES ('not_started'), ('in_progress'), ('complete') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Legal'), ('Financial'), ('Insurance'), ('Tax & Compliance'), ('Identity & Operations'), ('Location'), ('Inventory'), ('Marketing'), ('Customer Experience') ON CONFLICT (name) DO NOTHING;
