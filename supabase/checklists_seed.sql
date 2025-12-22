-- Seed Core Business Components
WITH core_items AS (
    INSERT INTO checklist_items (section_title, task_label, tooltip, is_core) VALUES
    -- Legal Foundation
    ('Legal Foundation', 'Choose business structure (Sole Prop / LLC / Corp / Nonprofit)', 'Determines your liability and tax structure.', true),
    ('Legal Foundation', 'Register business with state', 'Official existence of your entity.', true),
    ('Legal Foundation', 'File Articles of Organization / Incorporation', 'Birth certificate for your business.', true),
    ('Legal Foundation', 'Obtain EIN (IRS)', 'Social Security Number for your business.', true),
    ('Legal Foundation', 'Draft Operating Agreement / Bylaws', 'Rules for how your business is run.', true),
    ('Legal Foundation', 'Register business name / DBA (if applicable)', 'If operating under a different name.', true),
    
    -- Financial Foundation
    ('Financial Foundation', 'Open business bank account', 'Keep personal and business money separate.', true),
    ('Financial Foundation', 'Select accounting method (cash vs accrual)', 'How you record income and expenses.', true),
    ('Financial Foundation', 'Set up bookkeeping software', 'Track every penny.', true),
    ('Financial Foundation', 'Define chart of accounts', 'Categories for your financial transactions.', true),
    ('Financial Foundation', 'Establish expense policy', 'Rules for spending business money.', true),
    ('Financial Foundation', 'Separate personal & business finances', 'Future-you says thanks.', true),
    
    -- Insurance Foundation
    ('Insurance Foundation', 'General liability insurance', 'Basic protection against accidents.', true),
    ('Insurance Foundation', 'Professional liability / E&O (if applicable)', 'Protection for service mistakes.', true),
    ('Insurance Foundation', 'Workers’ comp (if hiring)', 'Mandatory if you have employees.', true),
    ('Insurance Foundation', 'Cyber liability (if software or data involved)', 'Protection against data breaches.', true),
    ('Insurance Foundation', 'Property insurance (if physical space)', 'Protects your equipment and office.', true),
    
    -- Tax & Compliance
    ('Tax & Compliance', 'Register for state & local taxes', 'Sales tax, franchise tax, etc.', true),
    ('Tax & Compliance', 'Sales tax permit (if selling taxable goods/services)', 'Permission to collect sales tax.', true),
    ('Tax & Compliance', 'Payroll tax setup (if hiring)', 'Withholding for employees.', true),
    ('Tax & Compliance', 'Annual filing calendar created', 'Don''t miss deadlines.', true),
    ('Tax & Compliance', 'Business licenses identified', 'Industry specific permits.', true),
    
    -- Identity & Operations
    ('Identity & Operations', 'Business email domain', 'Looks professional (not @gmail.com).', true),
    ('Identity & Operations', 'Core vendor tools selected (banking, accounting, CRM)', 'Your tech stack.', true),
    ('Identity & Operations', 'Internal documentation started', 'How we do things here.', true),
    ('Identity & Operations', 'Record-keeping system defined', 'Where documents live.', true),
    ('Identity & Operations', 'Data privacy & retention basics', 'Handling customer data responsibly.', true)
    RETURNING id, task_label
),
retail_module AS (
    INSERT INTO checklist_modules (name, description, icon) VALUES
    ('Retail Store Onboarding', 'For physical retail businesses', 'store')
    RETURNING id
),
ecommerce_module AS (
    INSERT INTO checklist_modules (name, description, icon) VALUES
    ('E-Commerce Store Onboarding', 'For online stores', 'shopping-cart')
    RETURNING id
),
credit_module AS (
    INSERT INTO checklist_modules (name, description, icon) VALUES
    ('Business Credit Builder', 'Establish and grow business credit', 'credit-card')
    RETURNING id
)
SELECT * FROM core_items;

-- Seed Retail Add-On Items
WITH retail_items AS (
    INSERT INTO checklist_items (section_title, task_label, tooltip, is_core) VALUES
    ('Location & Store Setup', 'Lease signed & reviewed', 'Secure your physical space.', false),
    ('Location & Store Setup', 'Floor plan & layout designed', 'Optimize customer flow.', false),
    ('Location & Store Setup', 'Shelving, fixtures, & signage installed', 'Make it look good.', false),
    ('Inventory & Supply Chain', 'Initial inventory purchased', 'Stock the shelves.', false),
    ('Inventory & Supply Chain', 'POS hardware installed & tested', 'Ready to take payments.', false)
    RETURNING id
)
INSERT INTO checklist_module_items (module_id, item_id)
SELECT m.id, i.id FROM checklist_modules m, retail_items i WHERE m.name = 'Retail Store Onboarding';


-- Seed E-Commerce Add-On Items
WITH ecommerce_items AS (
    INSERT INTO checklist_items (section_title, task_label, tooltip, is_core) VALUES
    ('Website & Platform Setup', 'Domain name registered', 'Your online address.', false),
    ('Website & Platform Setup', 'Hosting / e-commerce platform selected', 'Shopify, WooCommerce, etc.', false),
    ('Product & Inventory Management', 'Product catalog created', 'Images, descriptions, SKUs.', false),
    ('Customer Experience & Marketing', 'Email marketing system integrated', 'Newsletter and campaigns.', false)
    RETURNING id
)
INSERT INTO checklist_module_items (module_id, item_id)
SELECT m.id, i.id FROM checklist_modules m, ecommerce_items i WHERE m.name = 'E-Commerce Store Onboarding';


-- Seed Business Credit Builder Add-On Items
WITH credit_items AS (
    INSERT INTO checklist_items (section_title, task_label, tooltip, is_core) VALUES
    ('Business Credit Identity Setup', 'D&B profile created', 'Dun & Bradstreet profile.', false),
    ('Business Credit Identity Setup', 'D-U-N-S number issued', 'Unique 9-digit identifier.', false),
    ('Trade Lines & Vendor Credit', 'Net-30 vendor account opened', 'Build payment history.', false),
    ('Banking & Cash Flow Signals', 'Maintain minimum average balance', 'Show financial stability.', false),
    ('Credit Cards & Store Accounts', 'Business credit card approved', 'Revolving credit line.', false)
    RETURNING id
)
INSERT INTO checklist_module_items (module_id, item_id)
SELECT m.id, i.id FROM checklist_modules m, credit_items i WHERE m.name = 'Business Credit Builder';
