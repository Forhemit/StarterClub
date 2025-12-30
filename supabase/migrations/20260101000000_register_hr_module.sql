-- Register HR Onboarding System as a module
INSERT INTO modules (name, description, module_type, tags, icon, is_public, is_premium)
VALUES (
    'HR Onboarding System',
    'Streamlined employee onboarding workflows with gamification and equipment provisioning.',
    'function',
    '{"hr", "onboarding", "employees", "provisioning"}',
    'users',
    true,
    false
)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    module_type = EXCLUDED.module_type,
    tags = EXCLUDED.tags,
    icon = EXCLUDED.icon;

-- Insert version
INSERT INTO module_versions (module_id, version, changelog)
SELECT id, '1.0.0', 'Initial release with gamification and document signing'
FROM modules WHERE name = 'HR Onboarding System'
ON CONFLICT (module_id, version) DO NOTHING;
