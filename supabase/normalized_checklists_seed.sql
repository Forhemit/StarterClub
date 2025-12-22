-- 1. Cleanup everything for a clean slate
DELETE FROM module_items;
DELETE FROM checklist_items;
DELETE FROM module_versions;
DELETE FROM module_dependencies;
DELETE FROM user_installed_modules;
DELETE FROM user_checklist_status;
DELETE FROM modules;
DELETE FROM categories;
DELETE FROM statuses;

-- 2. Ensure Categories & Statuses
INSERT INTO categories (name) VALUES 
('Legal'),
('Financial'),
('Insurance'),
('Tax & Compliance'),
('Identity & Operations'),
('Credit'),
('Coaching Services'),
('Marketing'),
('Product & Inventory')
ON CONFLICT (name) DO NOTHING;

INSERT INTO statuses (name) VALUES 
('not_started'),
('in_progress'),
('complete')
ON CONFLICT (name) DO NOTHING;

-- 3. Ensure Core & Industry Modules (Parents)
INSERT INTO modules (name, description, module_type, icon, tags) VALUES
('Core Foundation', 'The absolute essentials for every business.', 'industry', 'building', '{"core", "essential"}'),

-- Goods Producing
('Agriculture & Farming', 'Business modules for agriculture and farming.', 'industry', 'leaf', '{"agriculture"}'),
('Manufacturing & Production', 'Operations for manufacturing businesses.', 'industry', 'factory', '{"manufacturing"}'),
('Construction & Contracting', 'Modules for construction and contracting.', 'industry', 'hard-hat', '{"construction"}'),
('Wholesale Trade', 'Modules for B2B distribution.', 'industry', 'container', '{"wholesale"}'),

-- Retail & Consumer
('Retail Trade', 'Systems for brick-and-mortar retail.', 'industry', 'store', '{"retail"}'),
('E-Commerce & Online Retail', 'Modules for online storefronts and sales.', 'industry', 'shopping-cart', '{"ecommerce"}'),

-- Services & Support
('Transportation & Warehousing', 'Logistics and delivery operations.', 'industry', 'truck', '{"logistics"}'),
('Information & Technology Services', 'IT and tech services.', 'industry', 'laptop', '{"tech"}'),
('Finance & Insurance Services', 'Financial services and insurance.', 'industry', 'banknote', '{"finance"}'),
('Real Estate & Property Services', 'Real estate and property management.', 'industry', 'home', '{"real-estate"}'),

-- Professional Services
('Professional Scientific & Technical Services', 'Consulting, legal, and professional services.', 'industry', 'briefcase', '{"consulting"}'),
('Education & Training Services', 'Tutoring, coaching, and training.', 'industry', 'graduation-cap', '{"education"}'),
('Healthcare & Medical Services', 'Health care and medical services.', 'industry', 'stethoscope', '{"health"}'),

-- Hospitality & Leisure
('Accommodation & Hospitality', 'Hotels and hospitality.', 'industry', 'utensils', '{"hospitality"}'),
('Arts Entertainment & Recreation', 'Entertainment and recreation.', 'industry', 'ticket', '{"arts"}'),

-- Other
('Personal Services', 'Salons, spas, and personal care.', 'industry', 'scissors', '{"services"}'),
('Administrative & Support Services', 'Admin support and office services.', 'industry', 'clipboard', '{"admin"}'),
('Nonprofit & Social Enterprise', 'Nonprofit organizations.', 'industry', 'heart', '{"nonprofit"}');


-- 4. Insert Top 25 Sub-Modules with Rich Metadata
INSERT INTO modules (name, description, module_type, parent_id, tags, icon, db_schema, checklist_template) VALUES

-- 1. Consulting / Freelance Design
('Consulting / Freelance Design', 'Complete framework for solo consultants and designers.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Professional Scientific & Technical Services'),
 '{"consulting", "freelance", "design"}', 'pen-tool',
 '{"tables": [{"name": "clients", "columns": [{"name": "name", "type": "text"}, {"name": "contract_url", "type": "text"}]}, {"name": "invoices", "columns": [{"name": "amount", "type": "decimal"}, {"name": "due_date", "type": "date"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Draft standard client agreement"}]}]}'),

-- 2. Rideshare / Delivery Driver
('Rideshare / Delivery Driver', 'Tracking for gig economy drivers.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Transportation & Warehousing'),
 '{"gig", "delivery", "rideshare"}', 'car',
 '{"tables": [{"name": "trips", "columns": [{"name": "date", "type": "date"}, {"name": "miles", "type": "decimal"}, {"name": "earnings", "type": "decimal"}]}]}',
 '{"categories": [{"name": "Financial", "items": [{"title": "Open separate business bank account"}]}]}'),

-- 3. Real-Estate Agent / Property Manager
('Real-Estate Agent / Property Manager', 'Systems for agents and property managers.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Real Estate & Property Services'),
 '{"real-estate", "agent", "property-mgmt"}', 'key',
 '{"tables": [{"name": "listings", "columns": [{"name": "address", "type": "text"}, {"name": "price", "type": "decimal"}]}, {"name": "showings", "columns": [{"name": "date", "type": "timestamp"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "State License Verification"}]}]}'),

-- 4. Handyman / General Contractor
('Handyman / General Contractor', 'Workflows for trade services and contractors.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Construction & Contracting'),
 '{"handyman", "contractor", "trades"}', 'hammer',
 '{"tables": [{"name": "jobs", "columns": [{"name": "client", "type": "text"}, {"name": "quote", "type": "decimal"}]}, {"name": "materials", "columns": [{"name": "item", "type": "text"}, {"name": "cost", "type": "decimal"}]}]}',
 '{"categories": [{"name": "Insurance", "items": [{"title": "Liability Insurance"}]}]}'),

-- 5. Virtual Assistant / Cleaning Service
('Virtual Assistant / Cleaning Service', 'Service setup for VAs and cleaners.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Administrative & Support Services'),
 '{"va", "cleaning", "service"}', 'sparkles',
 '{"tables": [{"name": "appointments", "columns": [{"name": "client", "type": "text"}, {"name": "time", "type": "timestamp"}]}, {"name": "checklists", "columns": [{"name": "task", "type": "text"}, {"name": "done", "type": "boolean"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Service Agreement Template"}]}]}'),

-- 6. E-commerce Store / Online Retail
('E-commerce Store / Online Retail Sub', 'Setup for Shopify/Etsy stores.', 'submodule',
 (SELECT id FROM modules WHERE name = 'E-Commerce & Online Retail'),
 '{"shopify", "etsy", "online-store"}', 'shopping-bag',
 '{"tables": [{"name": "products", "columns": [{"name": "sku", "type": "text"}, {"name": "price", "type": "decimal"}]}, {"name": "orders", "columns": [{"name": "total", "type": "decimal"}, {"name": "status", "type": "text"}]}]}',
 '{"categories": [{"name": "Financial", "items": [{"title": "Payment Gateway Setup"}]}]}'),

-- 7. Personal Trainer / Wellness Coach
('Personal Trainer / Wellness Coach', 'Client tracking for fitness pros.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Healthcare & Medical Services'),
 '{"fitness", "training", "wellness"}', 'dumbbell',
 '{"tables": [{"name": "workouts", "columns": [{"name": "client", "type": "text"}, {"name": "exercises", "type": "jsonb"}]}, {"name": "measurements", "columns": [{"name": "weight", "type": "decimal"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Liability Waiver"}]}]}'),

-- 8. Photographer / Music Teacher
('Photographer / Music Teacher', 'Booking and portfolios for creatives.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Arts Entertainment & Recreation'),
 '{"creative", "photo", "music"}', 'camera',
 '{"tables": [{"name": "sessions", "columns": [{"name": "date", "type": "timestamp"}, {"name": "location", "type": "text"}]}, {"name": "galleries", "columns": [{"name": "url", "type": "text"}]}]}',
 '{"categories": [{"name": "Insurance", "items": [{"title": "Equipment Insurance"}]}]}'),

-- 9. Tutor / Online Course Creator
('Tutor / Online Course Creator', 'Course structures and student mgmt.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Education & Training Services'),
 '{"tutor", "courses", "education"}', 'book-open',
 '{"tables": [{"name": "courses", "columns": [{"name": "title", "type": "text"}, {"name": "price", "type": "decimal"}]}, {"name": "enrollments", "columns": [{"name": "student", "type": "text"}]}]}',
 '{"categories": [{"name": "Product", "items": [{"title": "Curriculum Outline"}]}]}'),

-- 10. Financial Advisor / Insurance Agent
('Financial Advisor / Insurance Agent', 'Compliance and client mgmt for finance pros.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Finance & Insurance Services'),
 '{"finance", "advisor", "insurance"}', 'shield',
 '{"tables": [{"name": "clients", "columns": [{"name": "risk_tolerance", "type": "text"}]}, {"name": "policies", "columns": [{"name": "carrier", "type": "text"}, {"name": "premium", "type": "decimal"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Compliance Manual"}]}]}'),

-- 11. Social-Media Management
('Social-Media Management', 'Client onboarding & content tracking.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Professional Scientific & Technical Services'),
 '{"social-media", "marketing", "freelance"}', 'share-2',
 '{"tables": [{"name": "campaigns", "columns": [{"name": "platform", "type": "text"}, {"name": "date", "type": "date"}]}, {"name": "analytics", "columns": [{"name": "impressions", "type": "integer"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Draft social-media service agreement"}]}]}'),

-- 12. Home-Based Catering / Meal Prep
('Home-Based Catering / Meal Prep', 'Menu planning & food safety.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Accommodation & Hospitality'),
 '{"catering", "food", "home-business"}', 'coffee',
 '{"tables": [{"name": "menus", "columns": [{"name": "item", "type": "text"}, {"name": "cost", "type": "decimal"}]}, {"name": "orders", "columns": [{"name": "delivery_date", "type": "timestamp"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Obtain food-handler license"}]}]}'),

-- 13. Personal Stylist / Wardrobe Consultant
('Personal Stylist / Wardrobe Consultant', 'Client style profiles & shopping.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Personal Services'),
 '{"stylist", "fashion", "consulting"}', 'watch',
 '{"tables": [{"name": "wardrobes", "columns": [{"name": "brand", "type": "text"}, {"name": "size", "type": "text"}]}, {"name": "shopping_lists", "columns": [{"name": "budget", "type": "decimal"}]}]}',
 '{"categories": [{"name": "Product", "items": [{"title": "Client style-profile questionnaire"}]}]}'),

-- 14. Mobile Car-Detailing / Auto-Repair
('Mobile Car-Detailing / Auto-Repair', 'Vehicle tracking & service logs.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Personal Services'), -- Note: Could also be 'Other Services' but mapping to Personal/Repair for now
 '{"auto", "detailing", "repair"}', 'tool',
 '{"tables": [{"name": "vehicles", "columns": [{"name": "vin", "type": "text"}, {"name": "model", "type": "text"}]}, {"name": "services", "columns": [{"name": "cost", "type": "decimal"}]}]}',
 '{"categories": [{"name": "Insurance", "items": [{"title": "Liability Insurance"}]}]}'),

-- 15. Freelance Writing / Copywriting
('Freelance Writing / Copywriting', 'Project mgmt & portfolios.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Professional Scientific & Technical Services'),
 '{"writing", "copy", "freelance"}', 'edit-3',
 '{"tables": [{"name": "projects", "columns": [{"name": "word_count", "type": "integer"}, {"name": "deadline", "type": "date"}]}, {"name": "submissions", "columns": [{"name": "link", "type": "text"}]}]}',
 '{"categories": [{"name": "Marketing", "items": [{"title": "Portfolio Website"}]}]}'),

-- 16. Event DJ / Audio-Visual Services
('Event DJ / Audio-Visual Services', 'Event planning & gear usage.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Arts Entertainment & Recreation'),
 '{"dj", "music", "events"}', 'music',
 '{"tables": [{"name": "events", "columns": [{"name": "venue", "type": "text"}, {"name": "date", "type": "timestamp"}]}, {"name": "playlists", "columns": [{"name": "song", "type": "text"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Music-license agreement"}]}]}'),

-- 17. Pet-Sitting / Dog-Walking
('Pet-Sitting / Dog-Walking', 'Pet profiles & visit logs.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Personal Services'),
 '{"pets", "walking", "care"}', 'heart', 
 '{"tables": [{"name": "pets", "columns": [{"name": "name", "type": "text"}, {"name": "breed", "type": "text"}]}, {"name": "visits", "columns": [{"name": "duration", "type": "integer"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Pet-care agreement"}]}]}'),

-- 18. Home-Inspection Services
('Home-Inspection Services', 'Property audits & reports.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Real Estate & Property Services'), -- Closest match
 '{"inspection", "real-estate", "audit"}', 'search',
 '{"tables": [{"name": "inspections", "columns": [{"name": "address", "type": "text"}, {"name": "defects", "type": "jsonb"}]}, {"name": "reports", "columns": [{"name": "pdf_url", "type": "text"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "State certification"}]}]}'),

-- 19. Personal Chef / Cooking Lessons
('Personal Chef / Cooking Lessons', 'Recipes & class rosters.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Accommodation & Hospitality'),
 '{"chef", "cooking", "food"}', 'chef-hat',
 '{"tables": [{"name": "recipes", "columns": [{"name": "ingredients", "type": "jsonb"}]}, {"name": "classes", "columns": [{"name": "attendees", "type": "integer"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Food-safety certification"}]}]}'),

-- 20. Solar-Panel Installation Consultant
('Solar-Panel Installation Consultant', 'Site assessments & quotes.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Construction & Contracting'),
 '{"solar", "green", "energy"}', 'sun',
 '{"tables": [{"name": "sites", "columns": [{"name": "sun_exposure", "type": "decimal"}]}, {"name": "quotes", "columns": [{"name": "system_size", "type": "decimal"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Industry certification"}]}]}'),

-- 21. Notary Public / Document-Signing Agent
('Notary Public / Document-Signing Agent', 'Signing logs & journals.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Professional Scientific & Technical Services'),
 '{"notary", "legal", "signing"}', 'file-text',
 '{"tables": [{"name": "signings", "columns": [{"name": "document_type", "type": "text"}, {"name": "fee", "type": "decimal"}]}, {"name": "journal", "columns": [{"name": "signer_id", "type": "text"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Notary bond"}]}]}'),

-- 22. Vintage-Clothing Reseller
('Vintage-Clothing Reseller', 'Inventory sourcing & sales.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Retail Trade'),
 '{"vintage", "resale", "fashion"}', 'tag',
 '{"tables": [{"name": "inventory", "columns": [{"name": "era", "type": "text"}, {"name": "condition", "type": "text"}]}, {"name": "sales", "columns": [{"name": "platform", "type": "text"}]}]}',
 '{"categories": [{"name": "Product", "items": [{"title": "Sourcing checklist"}]}]}'),

-- 23. Home-Organization / Decluttering Service
('Home-Organization / Decluttering Service', 'Project spaces & task tracking.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Personal Services'),
 '{"organization", "home", "declutter"}', 'layers',
 '{"tables": [{"name": "areas", "columns": [{"name": "room", "type": "text"}, {"name": "status", "type": "text"}]}, {"name": "donations", "columns": [{"name": "charity", "type": "text"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Before-after photo release"}]}]}'),

-- 24. Language-Translation / Interpreting
('Language-Translation / Interpreting', 'Assignments & glossaries.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Professional Scientific & Technical Services'),
 '{"translation", "language", "interpreting"}', 'globe',
 '{"tables": [{"name": "assignments", "columns": [{"name": "language_pair", "type": "text"}, {"name": "word_count", "type": "integer"}]}, {"name": "glossary", "columns": [{"name": "term", "type": "text"}]}]}',
 '{"categories": [{"name": "Legal", "items": [{"title": "Language-proficiency certification"}]}]}'),

-- 25. Cybersecurity Consultant
('Cybersecurity Consultant', 'Security audits & reports.', 'submodule',
 (SELECT id FROM modules WHERE name = 'Information & Technology Services'),
 '{"security", "cyber", "consulting"}', 'lock',
 '{"tables": [{"name": "assessments", "columns": [{"name": "vulnerabilities", "type": "jsonb"}]}, {"name": "assets", "columns": [{"name": "risk_level", "type": "text"}]}]}',
 '{"categories": [{"name": "Insurance", "items": [{"title": "Liability Insurance"}]}]}')
;


-- 5. Seed Checklist Items
WITH cat AS (SELECT id, name FROM categories),
     new_items AS (
        INSERT INTO checklist_items (title, description, category_id, metadata_schema, priority, estimated_hours) VALUES
        -- Core Items (Shared)
        ('Register business with state', 'Entity formation', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["entity_id"]}', 'critical', 2),
        ('Obtain EIN', 'Tax ID from IRS', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["ein"]}', 'critical', 1),
        ('Open business bank account', 'Separate finances', (SELECT id FROM cat WHERE name='Financial'), '{"fields": ["bank_name"]}', 'critical', 2),
        
        -- 1. Consulting
        ('Draft Consulting Agreement', 'Standard client contract', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["template_url"]}', 'high', 2),
        ('Set up Invoicing', 'Hourly/Project billing setup', (SELECT id FROM cat WHERE name='Financial'), '{"fields": ["software"]}', 'high', 1),
        
        -- 2. Rideshare
        ('Vehicle Registration & Insurance', 'Commercial/Rideshare coverage', (SELECT id FROM cat WHERE name='Insurance'), '{"fields": ["policy_number"]}', 'critical', 3),
        ('Mileage Tracker Setup', 'Track tax deductions', (SELECT id FROM cat WHERE name='Tax & Compliance'), '{"fields": ["app_name"]}', 'high', 1),
        
        -- 3. Real Estate
        ('State License Verification', 'Ensure active license', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["license_number"]}', 'critical', 1),
        ('MLS Access Setup', 'Join local board', (SELECT id FROM cat WHERE name='Identity & Operations'), '{"fields": ["board_name"]}', 'critical', 5),
        
        -- 4. Handyman
        ('Contractor License', 'General/Specialty license', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["license_no"]}', 'critical', 10),
        ('Liability Insurance', 'General liability coverage', (SELECT id FROM cat WHERE name='Insurance'), '{"fields": ["policy_no"]}', 'critical', 2),
        
        -- 5. VA
        ('Service Agreement Template', 'Scope of work contract', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["url"]}', 'high', 2),
        ('Scheduling Software', 'Booking management', (SELECT id FROM cat WHERE name='Identity & Operations'), '{"fields": ["tool_name"]}', 'high', 1),
        
        -- 6. E-commerce
        ('Domain & Hosting', 'Store URL setup', (SELECT id FROM cat WHERE name='Identity & Operations'), '{"fields": ["domain"]}', 'high', 2),
        ('Payment Gateway', 'Stripe/PayPal setup', (SELECT id FROM cat WHERE name='Financial'), '{"fields": ["provider"]}', 'critical', 1),
        
        -- 7. Personal Trainer
        ('Liability Waiver', 'Client safety waiver', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["url"]}', 'critical', 2),
        ('Booking Calendar', 'Session scheduling', (SELECT id FROM cat WHERE name='Identity & Operations'), '{"fields": ["scheduler"]}', 'high', 1),
        
        -- 8. Photographer
        ('Equipment Insurance', 'Camera gear coverage', (SELECT id FROM cat WHERE name='Insurance'), '{"fields": ["policy"]}', 'high', 2),
        ('Copyright Release Form', 'Client usage rights', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["url"]}', 'medium', 2),
        
        -- 9. Tutor
        ('Curriculum Outline', 'Course structure plan', (SELECT id FROM cat WHERE name='Product & Inventory'), '{"fields": ["url"]}', 'high', 10),
        
        -- 10. Finance
        ('Compliance Manual', 'Regulatory procedures', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["url"]}', 'critical', 20),
        ('E&O Insurance', 'Errors & Omissions coverage', (SELECT id FROM cat WHERE name='Insurance'), '{"fields": ["policy"]}', 'critical', 3),

        -- 11. Social Media
        ('Draft social-media service agreement', 'Create a contract outlining scope and payment.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["template_url"]}', 'high', 2),
        ('Set up monthly retainer invoicing', 'Recurring invoices for clients.', (SELECT id FROM cat WHERE name='Financial'), '{"fields": ["software"]}', 'high', 1),

        -- 12. Catering
        ('Obtain food-handler license', 'State-required safety course.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["license_number"]}', 'critical', 4),
        ('Register for sales-tax permit', 'Apply for state sales tax.', (SELECT id FROM cat WHERE name='Tax & Compliance'), '{"fields": ["permit_number"]}', 'high', 2),

        -- 13. Stylist
        ('Client style-profile questionnaire', 'Intake form for preferences.', (SELECT id FROM cat WHERE name='Marketing'), '{"fields": ["url"]}', 'medium', 2),

        -- 14. Detailer
        ('Service-package pricing', 'Define detailing tiers.', (SELECT id FROM cat WHERE name='Marketing'), '{"fields": ["pricing_sheet"]}', 'high', 2),

        -- 15. Writer
        ('Portfolio Website', 'Showcase writing samples.', (SELECT id FROM cat WHERE name='Marketing'), '{"fields": ["url"]}', 'high', 5),

        -- 16. DJ
        ('Music-license agreement', 'Performance rights compliance.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["license"]}', 'high', 2),
        
        -- 17. Pet Sitting
        ('Pet-care agreement', 'Medical release and terms.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["url"]}', 'high', 2),

        -- 18. Inspector
        ('State certification', 'Exam and licensing.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["cert_id"]}', 'critical', 20),

        -- 19. Chef
        ('Food-safety certification', 'ServSafe or equivalent.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["cert_id"]}', 'critical', 4),

        -- 20. Solar
        ('Industry certification', 'NABCEP or similar.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["cert_id"]}', 'critical', 20),

        -- 21. Notary
        ('Notary bond', 'Purchase surety bond.', (SELECT id FROM cat WHERE name='Insurance'), '{"fields": ["bond_number"]}', 'critical', 1),

        -- 22. Reseller
        ('Sourcing checklist', 'Locations and schedule.', (SELECT id FROM cat WHERE name='Product & Inventory'), '{"fields": ["locations"]}', 'medium', 2),

        -- 23. Organizer
        ('Before-after photo release', 'Marketing permission.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["url"]}', 'medium', 1),

        -- 24. Translator
        ('Language-proficiency certification', 'ATA or similar.', (SELECT id FROM cat WHERE name='Legal'), '{"fields": ["cert_id"]}', 'high', 10),

        -- 25. Cyber
        ('Security-assessment template', 'Audit checklist.', (SELECT id FROM cat WHERE name='Product & Inventory'), '{"fields": ["template_url"]}', 'high', 5)

        RETURNING id, title
     )

-- 6. Link Items to Modules
INSERT INTO module_items (module_id, item_id, display_order)
-- Core links
SELECT (SELECT id FROM modules WHERE name='Core Foundation'), id, 1 FROM new_items WHERE title IN ('Register business with state', 'Obtain EIN', 'Open business bank account')
UNION ALL
-- 1-10 Links (Condensed)
SELECT (SELECT id FROM modules WHERE name='Consulting / Freelance Design'), id, 1 FROM new_items WHERE title LIKE '%Consulting Agreement%' OR title LIKE '%Invoicing%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Rideshare / Delivery Driver'), id, 1 FROM new_items WHERE title LIKE '%Vehicle Registration%' OR title LIKE '%Mileage%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Real-Estate Agent / Property Manager'), id, 1 FROM new_items WHERE title LIKE '%State License%' OR title LIKE '%MLS Access%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Handyman / General Contractor'), id, 1 FROM new_items WHERE title LIKE '%Contractor License%' OR title LIKE '%Liability Insurance%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Virtual Assistant / Cleaning Service'), id, 1 FROM new_items WHERE title LIKE '%Service Agreement%' OR title LIKE '%Scheduling%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='E-commerce Store / Online Retail Sub'), id, 1 FROM new_items WHERE title LIKE '%Domain%' OR title LIKE '%Payment%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Personal Trainer / Wellness Coach'), id, 1 FROM new_items WHERE title LIKE '%Liability Waiver%' OR title LIKE '%Booking%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Photographer / Music Teacher'), id, 1 FROM new_items WHERE title LIKE '%Equipment Insurance%' OR title LIKE '%Copyright%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Tutor / Online Course Creator'), id, 1 FROM new_items WHERE title LIKE '%Curriculum%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Financial Advisor / Insurance Agent'), id, 1 FROM new_items WHERE title LIKE '%Compliance%' OR title LIKE '%E&O%'
UNION ALL
-- 11-25 Links
SELECT (SELECT id FROM modules WHERE name='Social-Media Management'), id, 1 FROM new_items WHERE title LIKE '%social-media service%' OR title LIKE '%monthly retainer%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Home-Based Catering / Meal Prep'), id, 1 FROM new_items WHERE title LIKE '%food-handler%' OR title LIKE '%sales-tax%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Personal Stylist / Wardrobe Consultant'), id, 1 FROM new_items WHERE title LIKE '%style-profile%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Mobile Car-Detailing / Auto-Repair'), id, 1 FROM new_items WHERE title LIKE '%Service-package%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Freelance Writing / Copywriting'), id, 1 FROM new_items WHERE title LIKE '%Portfolio Website%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Event DJ / Audio-Visual Services'), id, 1 FROM new_items WHERE title LIKE '%Music-license%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Pet-Sitting / Dog-Walking'), id, 1 FROM new_items WHERE title LIKE '%Pet-care%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Home-Inspection Services'), id, 1 FROM new_items WHERE title LIKE '%State certification%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Personal Chef / Cooking Lessons'), id, 1 FROM new_items WHERE title LIKE '%Food-safety%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Solar-Panel Installation Consultant'), id, 1 FROM new_items WHERE title LIKE '%Industry certification%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Notary Public / Document-Signing Agent'), id, 1 FROM new_items WHERE title LIKE '%Notary bond%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Vintage-Clothing Reseller'), id, 1 FROM new_items WHERE title LIKE '%Sourcing checklist%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Home-Organization / Decluttering Service'), id, 1 FROM new_items WHERE title LIKE '%Before-after%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Language-Translation / Interpreting'), id, 1 FROM new_items WHERE title LIKE '%Language-proficiency%'
UNION ALL
SELECT (SELECT id FROM modules WHERE name='Cybersecurity Consultant'), id, 1 FROM new_items WHERE title LIKE '%Security-assessment%'
;

-- 7. Seed Versions for All 25 Modules
INSERT INTO module_versions (module_id, version, changelog)
SELECT id, '1.0.0', 'Initial release from Top 25 Pack' FROM modules
ON CONFLICT (module_id, version) DO NOTHING;
