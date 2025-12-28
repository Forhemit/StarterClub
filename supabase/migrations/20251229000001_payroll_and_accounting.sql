-- Migration: 20251229000001_payroll_and_accounting.sql
-- Description: Core tables for payroll processing and cost accounting

-- ============================================
-- 1. PAYROLL RUNS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payroll_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_name TEXT NOT NULL, -- e.g., "2025-01 Biweekly"
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  processed_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processed', 'approved', 'paid', 'reconciled')),
  total_gross DECIMAL(12,2),
  total_net DECIMAL(12,2),
  total_employer_taxes DECIMAL(12,2),
  journal_entry_id UUID, -- Link to accounting general ledger (future integration)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PAYROLL ENTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.payroll_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payroll_run_id UUID NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  
  -- Calculated amounts
  gross_pay DECIMAL(10,2) NOT NULL,
  total_deductions DECIMAL(10,2) NOT NULL,
  net_pay DECIMAL(10,2) NOT NULL,
  
  -- Source references
  salary_snapshot JSONB, -- Captures the effective compensation_history record at time of run
  regular_hours DECIMAL(5,2),
  overtime_hours DECIMAL(5,2),
  
  -- Payment info
  payment_method TEXT,
  bank_account_last_four TEXT,
  check_number TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payroll_entries_run_id ON public.payroll_entries(payroll_run_id);
CREATE INDEX IF NOT EXISTS idx_payroll_entries_employee_id ON public.payroll_entries(employee_id);

-- ============================================
-- 3. PAYROLL DEDUCTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payroll_deductions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payroll_entry_id UUID NOT NULL REFERENCES public.payroll_entries(id) ON DELETE CASCADE,
  
  deduction_type TEXT NOT NULL CHECK (deduction_type IN (
    'federal_tax', 'state_tax', 'social_security', 'medicare', 
    'retirement_401k', 'health_insurance', 'garnishments', 'other'
  )),
  
  -- Financials
  employee_amount DECIMAL(10,2) NOT NULL, -- Withheld from employee
  employer_amount DECIMAL(10,2) NOT NULL, -- Additional cost to company
  calculation_logic TEXT, -- Description of how the amount was derived
  
  -- Allocation (3-level analysis: Org, Employee, Pay Element) 
  cost_center_id UUID, -- Could reference departments or projects
  allocation_percentage DECIMAL(5,2) DEFAULT 100.00,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payroll_deductions_entry_id ON public.payroll_deductions(payroll_entry_id);

-- ============================================
-- 4. COST ALLOCATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.cost_allocations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('salary', 'expense', 'benefit', 'overhead')),
  source_id UUID NOT NULL, -- References payroll_entries.id, expense_history.id, etc.
  
  -- What is being allocated
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Allocation targets (support for multiple dimensions)
  allocated_to_type TEXT NOT NULL CHECK (allocated_to_type IN ('project', 'department', 'cost_center', 'fund', 'client')),
  allocated_to_id UUID NOT NULL, -- References projects.id, departments.id, etc.
  allocation_percentage DECIMAL(5,2) NOT NULL CHECK (allocation_percentage BETWEEN 0 AND 100),
  
  -- Time period for allocation
  allocation_start DATE NOT NULL,
  allocation_end DATE,
  
  -- For project-based allocation 
  billable_hours DECIMAL(6,2),
  billable_rate DECIMAL(10,2),
  is_billable BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_dates CHECK (allocation_end IS NULL OR allocation_start <= allocation_end)
);

CREATE INDEX IF NOT EXISTS idx_cost_allocations_source ON public.cost_allocations(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_cost_allocations_target ON public.cost_allocations(allocated_to_type, allocated_to_id);

-- ============================================
-- 5. RLS POLICIES (Preliminary)
-- ============================================

-- Enable RLS
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_allocations ENABLE ROW LEVEL SECURITY;

-- Admins and HR can view all
CREATE POLICY "Admins and HR can view payroll runs" ON public.payroll_runs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employees 
      WHERE employees.clerk_user_id = (auth.jwt() ->> 'sub') 
      AND (employees.is_management = TRUE OR employees.current_department_id IN (SELECT id FROM public.departments WHERE department_code = 'HR')) -- Simplified check
    )
  );

-- Employees can view their own payroll entries
CREATE POLICY "Employees can view own payroll entries" ON public.payroll_entries
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM public.employees 
      WHERE clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );
  
-- Admins/HR can view all payroll entries
CREATE POLICY "Admins and HR can view all payroll entries" ON public.payroll_entries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employees 
      WHERE employees.clerk_user_id = (auth.jwt() ->> 'sub') 
      AND (employees.is_management = TRUE OR employees.division = 'HR') -- Adjust based on actual role implementation
    )
  );

