-- Marketplace Evolution: Business OS Schema (Phase 3)
-- Upgrades the registry to support Hierarchy, Sub-modules, Versioning, and Advanced Config.

BEGIN;

-- 1. Expand Modules Table (The Core Registry)
ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS module_type VARCHAR(50) DEFAULT 'industry', -- 'industry', 'function', 'submodule'
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES modules(id),
ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255) DEFAULT 'Starter Club',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS install_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS icon VARCHAR(100),
ADD COLUMN IF NOT EXISTS color VARCHAR(7),
ADD COLUMN IF NOT EXISTS db_schema JSONB,
ADD COLUMN IF NOT EXISTS ui_schema JSONB,
ADD COLUMN IF NOT EXISTS checklist_template JSONB,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS price_monthly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Update Existing Module Types & Icons
-- Map Core Sectors to 'industry'
UPDATE modules SET module_type = 'industry', icon = 'building' WHERE name IN (
  'Core Foundation', 'Agriculture & Farming', 'Manufacturing & Production', 'Construction & Contracting',
  'Wholesale Trade', 'Retail Trade', 'E-Commerce & Online Retail', 'Transportation & Warehousing',
  'Information & Technology Services', 'Finance & Insurance Services', 'Real Estate & Property Services',
  'Professional Scientific & Technical Services', 'Education & Training Services', 'Healthcare & Medical Services',
  'Accommodation & Hospitality', 'Arts Entertainment & Recreation', 'Personal Services',
  'Administrative & Support Services', 'Nonprofit & Social Enterprise'
);

-- Map Cross-Cutting to 'function'
UPDATE modules SET module_type = 'function', icon = 'puzzle' WHERE name IN (
  'Business Credit Builder', 'Subscription & Recurring Revenue Models', 'Franchise Business Operations',
  'Knowledge Intensive Services', 'Public Sector & Government Contracting'
);

-- Fix specific icons
UPDATE modules SET icon = 'store' WHERE name = 'Retail Trade';
UPDATE modules SET icon = 'shopping-cart' WHERE name = 'E-Commerce & Online Retail';
UPDATE modules SET icon = 'truck' WHERE name = 'Transportation & Warehousing';
UPDATE modules SET icon = 'laptop' WHERE name = 'Information & Technology Services';
UPDATE modules SET icon = 'graduation-cap' WHERE name = 'Education & Training Services';
UPDATE modules SET icon = 'stethoscope' WHERE name = 'Healthcare & Medical Services';
UPDATE modules SET icon = 'utensils' WHERE name = 'Accommodation & Hospitality';

-- 3. Create New Framework Tables

-- A. Module Versions (Immutable History)
CREATE TABLE IF NOT EXISTS module_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  changelog TEXT,
  seed_script TEXT,
  compatibility JSONB DEFAULT '{"min_version": "1.0.0", "max_version": null}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, version)
);

-- B. User Installed Modules (The Source of Truth for a Business)
CREATE TABLE IF NOT EXISTS user_installed_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_business_id UUID REFERENCES user_businesses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_business_id, module_id)
);

-- Ensure all columns exist (Idempotent Upgrade)
ALTER TABLE user_installed_modules
ADD COLUMN IF NOT EXISTS module_version VARCHAR(50),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'installed' CHECK (status IN ('installing', 'staged', 'installed', 'active', 'disabled', 'uninstalling')), 
ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"read": true, "write": true, "delete": false}',
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE user_installed_modules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Users can view their installed modules" ON user_installed_modules;
DROP POLICY IF EXISTS "Users can manage their installed modules" ON user_installed_modules;

CREATE POLICY "Users can view their installed modules" ON user_installed_modules
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can manage their installed modules" ON user_installed_modules
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid())
    );

-- C. Module Dependencies (Graph)
CREATE TABLE IF NOT EXISTS module_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  dependency_module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) DEFAULT 'requires' CHECK (dependency_type IN ('requires', 'recommends', 'conflicts_with')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, dependency_module_id)
);

-- D. Module Reviews
CREATE TABLE IF NOT EXISTS module_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES user_businesses(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE module_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Public reviews are viewable" ON module_reviews;
DROP POLICY IF EXISTS "Users can write reviews" ON module_reviews;

CREATE POLICY "Public reviews are viewable" ON module_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can write reviews" ON module_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. Populate Initial Data
-- Seed versions for all current modules (idempotent)
INSERT INTO module_versions (module_id, version, changelog)
SELECT id, COALESCE(version, '1.0.0'), 'Initial release' 
FROM modules
ON CONFLICT (module_id, version) DO NOTHING;

-- 5. Add Sub-Modules (Drill-down Capabilities)
INSERT INTO modules (name, description, module_type, parent_id, tags, icon) VALUES
-- Retail Subs
('Brick & Mortar Retail', 'Physical store operations, inventory, and customer service', 'submodule', 
  (SELECT id FROM modules WHERE name = 'Retail Trade'), 
  '{"retail", "store", "inventory"}', 'store'),
('Online Marketplace Seller', 'Multi-channel sales, marketplace integrations, and fulfillment', 'submodule',
  (SELECT id FROM modules WHERE name = 'E-Commerce & Online Retail'),
  '{"ecommerce", "marketplace", "amazon", "etsy"}', 'shopping-bag'),

-- Professional Subs
('Legal Practice Management', 'Case management, client intake, and billing for law firms', 'submodule',
  (SELECT id FROM modules WHERE name = 'Professional Scientific & Technical Services'),
  '{"legal", "law", "practice"}', 'scale'),
('Marketing Agency', 'Client campaign management, creative workflows, and performance tracking', 'submodule',
  (SELECT id FROM modules WHERE name = 'Professional Scientific & Technical Services'),
  '{"marketing", "agency", "advertising"}', 'megaphone'),

-- Education Subs
('Online Coaching Business', 'Client coaching programs, session scheduling, and progress tracking', 'submodule',
  (SELECT id FROM modules WHERE name = 'Education & Training Services'),
  '{"coaching", "online", "consulting"}', 'users'),
('Course Creator Platform', 'Digital course creation, student management, and content delivery', 'submodule',
  (SELECT id FROM modules WHERE name = 'Education & Training Services'),
  '{"courses", "online", "education"}', 'video'),

-- Healthcare Subs
('Medical Practice Management', 'Patient records, appointment scheduling, and medical billing', 'submodule',
  (SELECT id FROM modules WHERE name = 'Healthcare & Medical Services'),
  '{"medical", "healthcare", "practice"}', 'activity'),

-- Hospitality Subs
('Restaurant Operations', 'Menu management, kitchen operations, and front-of-house service', 'submodule',
  (SELECT id FROM modules WHERE name = 'Accommodation & Hospitality'),
  '{"restaurant", "food", "hospitality"}', 'coffee')

ON CONFLICT (name) DO NOTHING;

-- 6. Enhance Checklist Items
ALTER TABLE checklist_items 
ADD COLUMN IF NOT EXISTS template_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS estimated_hours INTEGER,
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '[]';

-- Update existing items with template data from metadata_schema (idempotent, just updates)
UPDATE checklist_items 
SET template_data = jsonb_build_object(
  'fields', COALESCE(metadata_schema::jsonb->'fields', '[]'::jsonb),
  'resources', '[]'::jsonb,
  'instructions', description
)
WHERE metadata_schema IS NOT NULL;


-- 7. Views & Functions

-- View: Marketplace Modules
CREATE OR REPLACE VIEW marketplace_modules AS
SELECT 
  m.id,
  m.name,
  m.description,
  m.module_type,
  m.parent_id,
  p.name as parent_name,
  m.version,
  m.author_name,
  m.tags,
  m.install_count,
  m.is_premium,
  m.price_monthly,
  m.icon,
  m.color,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.id) as review_count,
  COUNT(DISTINCT mi.id) as business_count,
  COUNT(DISTINCT mi2.id) as dependency_count,
  m.created_at,
  m.updated_at
FROM modules m
LEFT JOIN modules p ON m.parent_id = p.id
LEFT JOIN module_reviews r ON m.id = r.module_id
LEFT JOIN user_installed_modules mi ON m.id = mi.module_id
LEFT JOIN module_dependencies mi2 ON m.id = mi2.module_id
WHERE m.is_public = true
GROUP BY m.id, p.name
ORDER BY 
  CASE WHEN m.module_type = 'industry' THEN 1
       WHEN m.module_type = 'submodule' THEN 2
       ELSE 3 END,
  m.install_count DESC;

-- Function: Install Module (Business Logic)
CREATE OR REPLACE FUNCTION install_module_for_business(
  p_business_id UUID,
  p_module_id UUID,
  p_config JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_installation_id UUID;
  v_module_version VARCHAR;
  v_dependency_record RECORD;
BEGIN
  -- 1. Get the latest version of the module
  SELECT version INTO v_module_version
  FROM module_versions 
  WHERE module_id = p_module_id 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- If no version found in versions table, fall back to module table or default
  IF v_module_version IS NULL THEN
     SELECT version INTO v_module_version FROM modules WHERE id = p_module_id;
  END IF;
  
  -- 2. Check dependencies
  FOR v_dependency_record IN 
    SELECT md.dependency_module_id, md.dependency_type, m.name
    FROM module_dependencies md
    JOIN modules m ON md.dependency_module_id = m.id
    WHERE md.module_id = p_module_id
    AND md.dependency_type = 'requires'
  LOOP
    -- Check if dependency is installed and active
    IF NOT EXISTS (
      SELECT 1 FROM user_installed_modules 
      WHERE user_business_id = p_business_id 
      AND module_id = v_dependency_record.dependency_module_id
      AND status IN ('installed', 'active')
    ) THEN
      RAISE EXCEPTION 'Missing required dependency: %', v_dependency_record.name;
    END IF;
  END LOOP;
  
  -- 3. Create (or Update) the installation record
  -- Default status is 'staged' for safety, unless configured otherwise
  INSERT INTO user_installed_modules 
    (user_business_id, module_id, module_version, config, status)
  VALUES 
    (p_business_id, p_module_id, v_module_version, p_config, 'staged')
  ON CONFLICT (user_business_id, module_id) 
  DO UPDATE SET status = 'staged', config = p_config, last_used_at = NOW()
  RETURNING id INTO v_installation_id;
  
  RETURN v_installation_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;
