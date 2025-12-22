-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_title TEXT NOT NULL,
    task_label TEXT NOT NULL,
    tooltip TEXT,
    partner_link TEXT,
    partner_link_label TEXT,
    is_core BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create checklist_modules table
CREATE TABLE IF NOT EXISTS checklist_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create checklist_module_items table (Many-to-Many link)
CREATE TABLE IF NOT EXISTS checklist_module_items (
    module_id UUID REFERENCES checklist_modules(id) ON DELETE CASCADE,
    item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    PRIMARY KEY (module_id, item_id)
);

-- Create user_checklist_progress table
CREATE TABLE IF NOT EXISTS user_checklist_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    PRIMARY KEY (user_id, item_id)
);

-- Enable Row Level Security
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_module_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- checklist_items: Readable by everyone (authenticated), admin writable
DROP POLICY IF EXISTS "Checklist items are viewable by authenticated users" ON checklist_items;
CREATE POLICY "Checklist items are viewable by authenticated users" 
ON checklist_items FOR SELECT TO authenticated USING (true);

-- checklist_modules: Readable by everyone
DROP POLICY IF EXISTS "Checklist modules are viewable by authenticated users" ON checklist_modules;
CREATE POLICY "Checklist modules are viewable by authenticated users" 
ON checklist_modules FOR SELECT TO authenticated USING (true);

-- checklist_module_items: Readable by everyone
DROP POLICY IF EXISTS "Module items are viewable by authenticated users" ON checklist_module_items;
CREATE POLICY "Module items are viewable by authenticated users" 
ON checklist_module_items FOR SELECT TO authenticated USING (true);

-- user_checklist_progress: Users can read/write their own progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_checklist_progress;
CREATE POLICY "Users can view their own progress" 
ON user_checklist_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON user_checklist_progress;
CREATE POLICY "Users can update their own progress" 
ON user_checklist_progress FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can modify their own progress" ON user_checklist_progress;
CREATE POLICY "Users can modify their own progress" 
ON user_checklist_progress FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checklist_module_items_module_id ON checklist_module_items(module_id);
CREATE INDEX IF NOT EXISTS idx_user_checklist_progress_user_id ON user_checklist_progress(user_id);
