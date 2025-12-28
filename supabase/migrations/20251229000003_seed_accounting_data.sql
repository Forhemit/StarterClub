-- Migration: 20251229000003_seed_accounting_data.sql
-- Description: Seed initial Chart of Accounts and Income Sources

-- 1. Seed Income Sources
INSERT INTO public.income_sources (source_name, description, is_system_default)
VALUES 
    ('Stripe', 'Automatic import from Stripe Webhooks', TRUE),
    ('Manual', 'Manual journal entry adjustment', TRUE)
ON CONFLICT (source_name) DO NOTHING;

-- 2. Seed Chart of Accounts
-- Using a simplified standard chart of accounts for SaaS

INSERT INTO public.ledger_accounts (account_code, account_name, type, description)
VALUES
    -- ASSETS (1000-1999)
    ('1000', 'Cash / Bank', 'asset', 'Main business bank account'),
    ('1001', 'Stripe Clearing', 'asset', 'Funds held in Stripe before payout'),
    ('1200', 'Accounts Receivable', 'asset', 'Unpaid invoices'),

    -- LIABILITIES (2000-2999)
    ('2000', 'Accounts Payable', 'liability', 'Unpaid bills'),
    ('2100', 'Deferred Revenue', 'liability', 'Prepaid subscriptions not yet earned'),

    -- EQUITY (3000-3999)
    ('3000', 'Owner Equity', 'equity', 'Capital invested'),
    ('3100', 'Retained Earnings', 'equity', 'Accumulated profits'),

    -- REVENUE (4000-4999)
    ('4000', 'Subscription Revenue', 'revenue', 'Recurring application fees'),
    ('4100', 'Service Revenue', 'revenue', 'One-time consulting or setup fees'),

    -- EXPENSES (5000-5999)
    ('5000', 'Stripe Fees', 'expense', 'Payment processing fees'),
    ('5100', 'Hosting & Infrastructure', 'expense', 'Server costs (AWS, Vercel, Supabase)'),
    ('5200', 'Software Subscriptions', 'expense', 'Tools and SaaS used'),
    ('5300', 'Contractor Expense', 'expense', 'Payments to contractors'),
    ('5400', 'Bank Charges', 'expense', 'General banking fees')

ON CONFLICT (account_code) DO NOTHING;
