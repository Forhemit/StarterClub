-- Add slug column to modules
ALTER TABLE modules ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Update existing modules with slugs based on name
UPDATE modules SET slug = 'hr-onboarding' WHERE name = 'HR Onboarding System';
UPDATE modules SET slug = 'legal-vault' WHERE name = 'Legal Vault Template';
UPDATE modules SET slug = 'financial-controls' WHERE name = 'Financial Controls Package';
UPDATE modules SET slug = 'monthly-close' WHERE name = 'Monthly Close Playbook';
UPDATE modules SET slug = 'vendor-management' WHERE name = 'Vendor Management System';
UPDATE modules SET slug = 'compliance-tracking' WHERE name = 'Compliance Tracking';
UPDATE modules SET slug = 'investor-reporting' WHERE name = 'Investor Reporting Suite';
UPDATE modules SET slug = 'acquisition-readiness' WHERE name = 'Acquisition Readiness Pack';
UPDATE modules SET slug = 'valuation-optimizer' WHERE name = 'Valuation Optimizer';

-- Fallback for any others (slugify name)
UPDATE modules 
SET slug = lower(regexp_replace(name, '\s+', '-', 'g')) 
WHERE slug IS NULL;
