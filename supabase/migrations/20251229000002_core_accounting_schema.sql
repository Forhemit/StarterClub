-- Migration: 20251229000002_core_accounting_schema.sql
-- Description: Core tables for double-entry accounting system

-- ============================================
-- 0. ENUMS & TYPE DEFINITIONS
-- ============================================

-- Check if types exist before creating to make it idempotent
DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE journal_entry_type AS ENUM ('debit', 'credit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 1. LEDGER ACCOUNTS (Chart of Accounts)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ledger_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_code VARCHAR(20) NOT NULL UNIQUE,
  account_name VARCHAR(100) NOT NULL,
  type account_type NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. INCOME SOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS public.income_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'Stripe', 'Bank Wire', 'Manual Adjustment'
    description TEXT,
    is_system_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. JOURNAL ENTRIES (Transaction Headers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_date DATE NOT NULL,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT NOT NULL,
    income_source_id UUID REFERENCES public.income_sources(id) ON DELETE SET NULL,
    external_reference_id TEXT, -- e.g. Stripe Balance Transaction ID or Invoice ID
    created_by_user_id TEXT, -- Using TEXT for Clerk ID compatibility
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. JOURNAL ENTRY LINES (Debits/Credits)
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_entry_lines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    journal_entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
    ledger_account_id UUID NOT NULL REFERENCES public.ledger_accounts(id),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    entry_type journal_entry_type NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. STRIPE SYNC LOG
-- ============================================
CREATE TABLE IF NOT EXISTS public.stripe_sync_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_object_id VARCHAR(255), -- e.g. ch_12345
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processed, failed, skipped
    journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
    processing_error TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ledger_accounts_code ON public.ledger_accounts(account_code);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON public.journal_entries(transaction_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_source ON public.journal_entries(income_source_id);
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_je_id ON public.journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_account ON public.journal_entry_lines(ledger_account_id);
CREATE INDEX IF NOT EXISTS idx_stripe_sync_log_event ON public.stripe_sync_log(stripe_event_id);

-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entry_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_sync_log ENABLE ROW LEVEL SECURITY;

-- Admins: Full Access
-- Using the same pattern as payroll tables: check existence in employees table with is_management = TRUE
-- Note: 'employees' table must exist from previous migration (20251229000000_employee_tracking.sql)

-- ledger_accounts policies
DROP POLICY IF EXISTS "Admins can manage ledger accounts" ON public.ledger_accounts;
CREATE POLICY "Admins can manage ledger accounts" ON public.ledger_accounts
  USING (
    EXISTS (
      SELECT 1 FROM public.employees 
      WHERE employees.clerk_user_id = (auth.jwt() ->> 'sub') 
      AND employees.is_management = TRUE
    )
  );

-- income_sources policies
DROP POLICY IF EXISTS "Admins can manage income sources" ON public.income_sources;
CREATE POLICY "Admins can manage income sources" ON public.income_sources
  USING (
    EXISTS (
      SELECT 1 FROM public.employees 
      WHERE employees.clerk_user_id = (auth.jwt() ->> 'sub') 
      AND employees.is_management = TRUE
    )
  );

-- journal_entries policies
DROP POLICY IF EXISTS "Admins can manage journal entries" ON public.journal_entries;
CREATE POLICY "Admins can manage journal entries" ON public.journal_entries
  USING (
    EXISTS (
      SELECT 1 FROM public.employees 
      WHERE employees.clerk_user_id = (auth.jwt() ->> 'sub') 
      AND employees.is_management = TRUE
    )
  );

-- journal_entry_lines policies
DROP POLICY IF EXISTS "Admins can manage entry lines" ON public.journal_entry_lines;
CREATE POLICY "Admins can manage entry lines" ON public.journal_entry_lines
  USING (
    EXISTS (
      SELECT 1 FROM public.employees 
      WHERE employees.clerk_user_id = (auth.jwt() ->> 'sub') 
      AND employees.is_management = TRUE
    )
  );

-- stripe_sync_log policies
DROP POLICY IF EXISTS "Admins can view stripe logs" ON public.stripe_sync_log;
CREATE POLICY "Admins can view stripe logs" ON public.stripe_sync_log
  USING (
    EXISTS (
      SELECT 1 FROM public.employees 
      WHERE employees.clerk_user_id = (auth.jwt() ->> 'sub') 
      AND employees.is_management = TRUE
    )
  );

-- ============================================
-- 8. VIEWS
-- ============================================

CREATE OR REPLACE VIEW public.v_journal_entries WITH (security_invoker = true) AS
SELECT 
  je.id as journal_entry_id,
  je.transaction_date,
  je.description as entry_description,
  je.external_reference_id,
  ins.source_name,
  jel.id as line_id,
  la.account_code,
  la.account_name,
  la.type as account_type,
  jel.amount,
  jel.entry_type,
  jel.description as line_description
FROM public.journal_entries je
LEFT JOIN public.income_sources ins ON je.income_source_id = ins.id
JOIN public.journal_entry_lines jel ON je.id = jel.journal_entry_id
JOIN public.ledger_accounts la ON jel.ledger_account_id = la.id;

CREATE OR REPLACE VIEW public.v_account_balances WITH (security_invoker = true) AS
SELECT 
  la.id as account_id,
  la.account_code,
  la.account_name,
  la.type,
  COALESCE(SUM(CASE WHEN jel.entry_type = 'debit' THEN jel.amount ELSE 0 END), 0) as total_debits,
  COALESCE(SUM(CASE WHEN jel.entry_type = 'credit' THEN jel.amount ELSE 0 END), 0) as total_credits,
  CASE 
    WHEN la.type IN ('asset', 'expense') THEN 
      COALESCE(SUM(CASE WHEN jel.entry_type = 'debit' THEN jel.amount ELSE -jel.amount END), 0)
    ELSE 
      COALESCE(SUM(CASE WHEN jel.entry_type = 'credit' THEN jel.amount ELSE -jel.amount END), 0)
  END as current_balance
FROM public.ledger_accounts la
LEFT JOIN public.journal_entry_lines jel ON la.id = jel.ledger_account_id
GROUP BY la.id, la.account_code, la.account_name, la.type;
