-- Add detail_type to financial_accounts
alter table financial_accounts 
add column if not exists detail_type text;

-- Create COA Templates table
create table if not exists financial_coa_templates (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    industry text,
    created_at timestamptz default now()
);

-- Create COA Template Items table
create table if not exists financial_coa_template_items (
    id uuid primary key default gen_random_uuid(),
    template_id uuid references financial_coa_templates(id) on delete cascade,
    account_number text,
    account_name text not null,
    account_type text not null,
    detail_type text,
    description text,
    created_at timestamptz default now()
);

-- RLS for templates (Read only for users)
alter table financial_coa_templates enable row level security;
alter table financial_coa_template_items enable row level security;

create policy "Authenticated users can read templates"
    on financial_coa_templates for select
    to authenticated
    using (true);

create policy "Authenticated users can read template items"
    on financial_coa_template_items for select
    to authenticated
    using (true);

-- Seed Data: Retail Store General
do $$
declare
    template_id uuid;
begin
    -- Insert Template
    insert into financial_coa_templates (name, description, industry)
    values ('Retail Store General', 'Standard chart of accounts for a general retail business.', 'Retail')
    returning id into template_id;

    -- Insert Template Items
    insert into financial_coa_template_items (template_id, account_number, account_name, account_type, detail_type, description)
    values
    (template_id, '1000', 'Petty Cash', 'Bank', 'Cash on hand', 'Store register cash'),
    (template_id, '1010', 'Operating Bank Account', 'Bank', 'Checking', 'Main business checking'),
    (template_id, '1020', 'Merchant Clearing Account', 'Other Current Asset', 'Undeposited Funds', 'Holding account for Stripe/Square deposits'),
    (template_id, '1100', 'Accounts Receivable', 'Accounts Receivable', 'Accounts Receivable', 'Money owed by customers'),
    (template_id, '1200', 'Inventory - Merchandise', 'Other Current Asset', 'Inventory', 'Goods held for resale'),
    (template_id, '1250', 'Inventory - Supplies', 'Other Current Asset', 'Supplies', 'Packaging/tags (not for resale)'),
    (template_id, '1400', 'Security Deposits', 'Other Current Asset', 'Other current assets', 'Rent or utility deposits'),
    (template_id, '1700', 'Furniture & Fixtures', 'Fixed Asset', 'Furniture and fixtures', 'Shelving/Display units'),
    (template_id, '1750', 'Equipment', 'Fixed Asset', 'Machinery and equipment', 'POS systems/Computers'),
    (template_id, '1800', 'Leasehold Improvements', 'Fixed Asset', 'Leasehold improvements', 'Renovations to rented space'),
    (template_id, '2000', 'Accounts Payable', 'Accounts Payable', 'Accounts payable', 'Unpaid bills'),
    (template_id, '2200', 'Sales Tax Payable', 'Other Current Liability', 'Sales tax payable', 'Sales tax collected but not paid'),
    (template_id, '2300', 'Payroll Liabilities', 'Other Current Liability', 'Payroll clearing', 'Wages/Taxes owed'),
    (template_id, '2460', 'Gift Cards Outstanding', 'Other Current Liability', 'Unearned revenue', 'Liability for unredeemed gift cards'),
    (template_id, '3000', 'Owner Capital', 'Equity', 'Owner’s equity', 'Owner''s investment'),
    (template_id, '3100', 'Owner Draw', 'Equity', 'Owner’s draw', 'Money taken out by owner'),
    (template_id, '3200', 'Retained Earnings', 'Equity', 'Retained earnings', 'Do not post here manually'),
    (template_id, '4000', 'Sales - In-Store', 'Income', 'Sales of product income', 'Brick & mortar revenue'),
    (template_id, '4010', 'Sales - Online', 'Income', 'Sales of product income', 'E-commerce revenue'),
    (template_id, '4200', 'Returns & Refunds', 'Income', 'Discounts/refunds given', 'Contra-revenue account (negative income)'),
    (template_id, '5000', 'COGS - Merchandise', 'Cost of Goods Sold', 'Supplies and materials', 'Cost of items sold'),
    (template_id, '5100', 'Freight-In', 'Cost of Goods Sold', 'Freight and delivery', 'Shipping costs to get goods to you'),
    (template_id, '5200', 'Inventory Shrinkage', 'Cost of Goods Sold', 'Inventory adjustments', 'Lost/Stolen/Damaged inventory'),
    (template_id, '6000', 'Advertising', 'Expense', 'Advertising', 'Ads/Marketing'),
    (template_id, '6010', 'Merchant Processing Fees', 'Expense', 'Bank charges', 'Credit card swipe fees'),
    (template_id, '6500', 'Rent Expense', 'Expense', 'Rent', 'Store lease'),
    (template_id, '6600', 'Wages & Salaries', 'Expense', 'Payroll expenses', 'Staff pay'),
    (template_id, '6910', 'Software Subscriptions', 'Expense', 'Dues and subscriptions', 'POS software/Shopify'),
    (template_id, '7100', 'Bank Fees', 'Expense', 'Bank charges', 'Monthly service fees'),
    (template_id, '7400', 'Travel & Meals', 'Expense', 'Travel', 'Business travel'),
    (template_id, '7900', 'Miscellaneous', 'Expense', 'Other business expenses', 'Small uncategorized items');
end $$;
