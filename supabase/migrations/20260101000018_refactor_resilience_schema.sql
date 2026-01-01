-- Refactor: Extend existing checklist system to support Resilience Modules

-- 1. Ensure modules has module_type and category
ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS module_type TEXT DEFAULT 'industry',
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS price TEXT DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0';

-- 2. Extend module_items to support Sections and Weights
ALTER TABLE module_items
ADD COLUMN IF NOT EXISTS section_title TEXT,
ADD COLUMN IF NOT EXISTS weight INTEGER DEFAULT 1;

-- 3. Cleanup custom tables (if they exist from prior attempts)
DROP TABLE IF EXISTS card_completions;
DROP TABLE IF EXISTS module_cards;
DROP TABLE IF EXISTS module_sections;

-- 4. Re-seed Resilience Modules using the unified schema
DO $$ 
DECLARE
    v_module_id UUID;
    v_item_id UUID;
    v_category_id_resilience UUID;
BEGIN
    -- Ensure "Business Resilience" category exists in categories table
    INSERT INTO categories (name) VALUES ('Business Resilience') 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_category_id_resilience;

    ---------------------------------------------------------------------------
    -- 1. Leadership & Human Capital
    ---------------------------------------------------------------------------
    -- Using 'core' as module_type since 'resilience' is not in the allowed list
    INSERT INTO modules (name, description, category, slug, icon, is_public, module_type)
    VALUES (
        'Leadership & Human Capital',
        'Remove key-person risk and decision paralysis.',
        'Business Resilience',
        'leadership-human-capital',
        'Users',
        TRUE,
        'core'
    )
    ON CONFLICT (slug) DO UPDATE SET 
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = 'Business Resilience',
        module_type = 'core'
    RETURNING id INTO v_module_id;

    -- Delete existing items for this module to ensure clean seed
    DELETE FROM module_items WHERE module_id = v_module_id;

    -- SECTION: Succession Planning
    
    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Role → Deputy Mapping', 'Identify specific deputies for all critical leadership roles.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Succession Planning', 5, 1);

    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Interim Authority Definitions', 'Define legally what a deputy can do when acting as interim.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Succession Planning', 4, 2);

    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('30 / 60 / 90-day Takeover Plans', 'Detailed roadmap for the first 3 months of an interim leader.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Succession Planning', 5, 3);


    -- SECTION: Key Person Dependency Tracking
    
    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Irreplaceable Knowledge Holders', 'List individuals holding unique, undocumented institutional knowledge.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Key Person Dependency Tracking', 3, 4);

    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Critical Systems Access Map', 'Identify systems/vendors that only one person can access.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Key Person Dependency Tracking', 3, 5);

    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Bus Factor Scorecard', 'Quantify the risk per role.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Key Person Dependency Tracking', 2, 6);


    -- SECTION: Decision Authority Matrix

    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Spending Thresholds', 'Clear limits on who can spend what without approval.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Decision Authority & Delegation Matrix', 4, 7);

    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Contract Signing Authority', 'Define who can legally bind the company.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Decision Authority & Delegation Matrix', 5, 8);

    INSERT INTO checklist_items (title, description, category_id)
    VALUES ('Emergency Override Rules', 'Protocol for decision making when normal approvers are unreachable.', v_category_id_resilience)
    RETURNING id INTO v_item_id;
    INSERT INTO module_items (module_id, item_id, section_title, weight, display_order)
    VALUES (v_module_id, v_item_id, 'Decision Authority & Delegation Matrix', 5, 9);


    ---------------------------------------------------------------------------
    -- Other Modules (Placeholders)
    ---------------------------------------------------------------------------
    
    INSERT INTO modules (name, description, category, slug, icon, is_public, module_type)
    VALUES ('Financial Resilience', 'Fortify your financial position against shocks.', 'Business Resilience', 'financial-resilience', 'Landmark', TRUE, 'core')
    ON CONFLICT (slug) DO UPDATE SET category = 'Business Resilience', module_type = 'core';

    INSERT INTO modules (name, description, category, slug, icon, is_public, module_type)
    VALUES ('Operations & Supply Chain', 'Secure your operational capabilities and supply lines.', 'Business Resilience', 'operations-supply-chain', 'Truck', TRUE, 'core')
    ON CONFLICT (slug) DO UPDATE SET category = 'Business Resilience', module_type = 'core';

    INSERT INTO modules (name, description, category, slug, icon, is_public, module_type)
    VALUES ('Crisis Protocol', 'Standardized responses for critical incidents.', 'Business Resilience', 'crisis-protocol', 'Siren', TRUE, 'core')
    ON CONFLICT (slug) DO UPDATE SET category = 'Business Resilience', module_type = 'core';

    INSERT INTO modules (name, description, category, slug, icon, is_public, module_type)
    VALUES ('Maintenance & Audits', 'Regular checks to prevent system failures.', 'Business Resilience', 'maintenance-audits', 'ClipboardCheck', TRUE, 'core')
    ON CONFLICT (slug) DO UPDATE SET category = 'Business Resilience', module_type = 'core';

END $$;
