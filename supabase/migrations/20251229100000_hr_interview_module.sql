-- Migration: 20251229100000_hr_interview_module.sql
-- Description: HR Interview Pipeline, Offers, and Wait Pool Module
-- Depends on: departments table, employees table

-- ============================================
-- 1. CANDIDATES TABLE (Interview Applicants)
-- ============================================
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Personal information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  
  -- Position details
  position_applied TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  
  -- Source tracking
  source TEXT CHECK (source IN ('referral', 'job_board', 'website', 'linkedin', 'recruiter', 'career_fair', 'internal', 'other')),
  source_details TEXT, -- e.g., specific job board name
  referrer_employee_id UUID REFERENCES public.employees(id),
  recruiter_id TEXT, -- clerk_user_id of recruiting partner
  
  -- Documents
  resume_url TEXT,
  cover_letter_url TEXT,
  portfolio_url TEXT,
  additional_docs_urls TEXT[],
  
  -- Pipeline status
  current_stage TEXT NOT NULL DEFAULT 'applied' CHECK (current_stage IN (
    'applied', 'screening', 'phone_interview', 'technical_interview', 
    'onsite', 'final_round', 'offer', 'hired', 'rejected', 'wait_pool', 'withdrawn'
  )),
  pipeline_score INTEGER CHECK (pipeline_score >= 0 AND pipeline_score <= 100),
  
  -- Key dates
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  
  -- Decision tracking
  final_decision TEXT CHECK (final_decision IN ('hire', 'no_hire', 'wait_pool')),
  decision_date DATE,
  decision_by TEXT, -- clerk_user_id
  rejection_reason TEXT,
  rejection_category TEXT CHECK (rejection_category IN (
    'experience', 'skills', 'culture_fit', 'salary', 'timing', 
    'background_check', 'withdrew', 'no_show', 'other'
  )),
  
  -- Notes
  hr_notes TEXT,
  hiring_manager_notes TEXT,
  
  -- Metadata
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique email per active candidate
  CONSTRAINT unique_active_candidate UNIQUE (email, position_applied)
);

-- Create indexes for candidates
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON public.candidates(current_stage);
CREATE INDEX IF NOT EXISTS idx_candidates_department ON public.candidates(department_id);
CREATE INDEX IF NOT EXISTS idx_candidates_applied_date ON public.candidates(applied_date DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_decision ON public.candidates(final_decision) WHERE final_decision IS NOT NULL;

-- ============================================
-- 2. INTERVIEW_HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.interview_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  
  -- Interview details
  interview_type TEXT NOT NULL CHECK (interview_type IN (
    'phone_screen', 'technical', 'behavioral', 'culture_fit', 
    'executive', 'panel', 'case_study', 'portfolio_review', 'other'
  )),
  interview_round INTEGER NOT NULL DEFAULT 1,
  interview_title TEXT, -- Optional custom title
  
  -- Scheduling
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  
  -- Location
  location_type TEXT DEFAULT 'virtual' CHECK (location_type IN ('virtual', 'in_person', 'hybrid')),
  location_details TEXT, -- Office address or room name
  meeting_link TEXT,
  
  -- Interviewers
  interviewer_ids TEXT[] NOT NULL, -- Array of clerk_user_ids
  lead_interviewer_id TEXT NOT NULL, -- Primary interviewer
  
  -- Status
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'confirmed', 'in_progress', 'completed', 
    'cancelled', 'no_show_candidate', 'no_show_interviewer', 'rescheduled'
  )),
  cancellation_reason TEXT,
  rescheduled_from_id UUID REFERENCES public.interview_history(id),
  
  -- Outcome (filled after interview)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  recommendation TEXT CHECK (recommendation IN (
    'strong_hire', 'hire', 'lean_hire', 'lean_no_hire', 'no_hire'
  )),
  
  -- Detailed ratings
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  culture_fit_rating INTEGER CHECK (culture_fit_rating >= 1 AND culture_fit_rating <= 5),
  problem_solving_rating INTEGER CHECK (problem_solving_rating >= 1 AND problem_solving_rating <= 5),
  
  -- Feedback
  feedback_summary TEXT,
  strengths TEXT[],
  concerns TEXT[],
  
  -- Notes
  private_notes TEXT, -- HR only, not visible to hiring team
  public_notes TEXT, -- Visible to hiring team
  follow_up_questions TEXT[],
  
  -- Metadata
  feedback_submitted_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for interview_history
CREATE INDEX IF NOT EXISTS idx_interviews_candidate ON public.interview_history(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled ON public.interview_history(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interview_history(status);
CREATE INDEX IF NOT EXISTS idx_interviews_lead_interviewer ON public.interview_history(lead_interviewer_id);

-- ============================================
-- 3. CONDITIONAL_OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conditional_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  
  -- Offer identification
  offer_code TEXT UNIQUE NOT NULL, -- Auto-generated: SC-YYYYMMDD-XXXX
  offer_version INTEGER DEFAULT 1, -- For tracking revisions
  
  -- Position details
  position_title TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  reports_to_employee_id UUID REFERENCES public.employees(id),
  employment_type TEXT DEFAULT 'full_time' CHECK (employment_type IN (
    'full_time', 'part_time', 'contract', 'intern', 'seasonal'
  )),
  
  -- Compensation
  offered_salary DECIMAL(10,2),
  salary_currency TEXT DEFAULT 'USD',
  pay_frequency TEXT DEFAULT 'annually' CHECK (pay_frequency IN ('hourly', 'weekly', 'biweekly', 'monthly', 'annually')),
  
  -- Bonus & Equity
  signing_bonus DECIMAL(10,2),
  target_bonus_percentage DECIMAL(5,2),
  equity_type TEXT CHECK (equity_type IN ('stock_options', 'rsu', 'phantom', 'none')),
  equity_details TEXT,
  
  -- Benefits
  benefits_package_id UUID REFERENCES public.benefits_packages(id),
  pto_days INTEGER,
  
  -- Conditions (stored as JSONB array)
  conditions JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"type": "background_check", "description": "Clear background check", "status": "pending", "required": true}]
  all_conditions_met BOOLEAN DEFAULT FALSE,
  
  -- Timeline
  offer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  response_due_date DATE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_approval', 'approved', 'sent', 'pending_response',
    'accepted', 'declined', 'expired', 'rescinded', 'converted'
  )),
  
  -- Candidate response
  candidate_response_date DATE,
  decline_reason TEXT,
  negotiation_notes TEXT,
  
  -- Start date
  proposed_start_date DATE,
  confirmed_start_date DATE,
  
  -- Onboarding integration
  onboarding_triggered BOOLEAN DEFAULT FALSE,
  onboarding_link_sent_at TIMESTAMP WITH TIME ZONE,
  employee_id UUID REFERENCES public.employees(id), -- Linked after conversion
  
  -- Approval workflow
  approved_by TEXT,
  approval_date DATE,
  approval_notes TEXT,
  
  -- Documents
  offer_letter_url TEXT,
  signed_offer_url TEXT,
  
  -- Metadata
  created_by TEXT NOT NULL,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for conditional_offers
CREATE INDEX IF NOT EXISTS idx_offers_candidate ON public.conditional_offers(candidate_id);
CREATE INDEX IF NOT EXISTS idx_offers_code ON public.conditional_offers(offer_code);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.conditional_offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_date ON public.conditional_offers(offer_date DESC);

-- ============================================
-- 4. WAIT_POOL TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.wait_pool (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  
  -- Pool details
  pool_reason TEXT NOT NULL CHECK (pool_reason IN (
    'no_current_opening', 'great_fit_future', 'budget_freeze', 
    'timing', 'overqualified', 'underqualified_now', 'location', 'other'
  )),
  pool_reason_details TEXT,
  original_position TEXT NOT NULL,
  potential_positions TEXT[], -- Future positions to consider for
  
  -- Evaluation
  priority_score INTEGER NOT NULL DEFAULT 5 CHECK (priority_score >= 1 AND priority_score <= 10),
  skills TEXT[],
  experience_years INTEGER,
  notes TEXT,
  
  -- Timeline
  added_date DATE NOT NULL DEFAULT CURRENT_DATE,
  review_date DATE, -- Next review date
  expiry_date DATE, -- Auto-remove after this date (default 6 months)
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'contacted', 'interviewing', 'converted', 'removed', 'expired', 'declined'
  )),
  removal_reason TEXT,
  
  -- Contact tracking
  last_contacted_date DATE,
  contact_count INTEGER DEFAULT 0,
  last_contact_method TEXT CHECK (last_contact_method IN ('email', 'phone', 'linkedin', 'other')),
  last_contact_notes TEXT,
  
  -- Conversion tracking
  converted_to_candidate_id UUID REFERENCES public.candidates(id),
  converted_date DATE,
  converted_position TEXT,
  
  -- Metadata
  created_by TEXT NOT NULL,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partial unique index: candidate can only be in wait pool once when active
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_wait_pool 
  ON public.wait_pool(candidate_id) 
  WHERE status = 'active';

-- Create indexes for wait_pool
CREATE INDEX IF NOT EXISTS idx_wait_pool_candidate ON public.wait_pool(candidate_id);
CREATE INDEX IF NOT EXISTS idx_wait_pool_status ON public.wait_pool(status);
CREATE INDEX IF NOT EXISTS idx_wait_pool_priority ON public.wait_pool(priority_score DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_wait_pool_review_date ON public.wait_pool(review_date) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_wait_pool_skills ON public.wait_pool USING GIN(skills) WHERE status = 'active';

-- ============================================
-- 5. HR AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.hr_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Entity reference
  entity_type TEXT NOT NULL CHECK (entity_type IN ('candidate', 'interview', 'offer', 'wait_pool')),
  entity_id UUID NOT NULL,
  
  -- Action details
  action TEXT NOT NULL CHECK (action IN (
    'created', 'updated', 'deleted', 'status_changed', 
    'decision_made', 'email_sent', 'note_added', 'document_uploaded'
  )),
  old_value JSONB,
  new_value JSONB,
  
  -- Actor
  performed_by TEXT NOT NULL, -- clerk_user_id
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  notes TEXT
);

-- Create indexes for hr_audit_log
CREATE INDEX IF NOT EXISTS idx_hr_audit_entity ON public.hr_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_hr_audit_performed_at ON public.hr_audit_log(performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_hr_audit_performed_by ON public.hr_audit_log(performed_by);

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to generate offer codes
CREATE OR REPLACE FUNCTION generate_offer_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  prefix TEXT := 'SC-';
  date_part TEXT;
  random_part TEXT;
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  date_part := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  LOOP
    -- Generate random 4-character alphanumeric string
    random_part := upper(substr(md5(random()::text), 1, 4));
    new_code := prefix || date_part || '-' || random_part;
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM conditional_offers WHERE offer_code = new_code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- Function to update candidate stage based on latest activity
CREATE OR REPLACE FUNCTION update_candidate_last_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE candidates 
  SET last_activity_date = CURRENT_DATE, updated_at = NOW()
  WHERE id = NEW.candidate_id;
  RETURN NEW;
END;
$$;

-- Trigger for interview_history
DROP TRIGGER IF EXISTS trg_interview_update_candidate ON public.interview_history;
CREATE TRIGGER trg_interview_update_candidate
  AFTER INSERT OR UPDATE ON public.interview_history
  FOR EACH ROW
  EXECUTE FUNCTION update_candidate_last_activity();

-- Trigger for conditional_offers
DROP TRIGGER IF EXISTS trg_offer_update_candidate ON public.conditional_offers;
CREATE TRIGGER trg_offer_update_candidate
  AFTER INSERT OR UPDATE ON public.conditional_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_candidate_last_activity();

-- Function to auto-set expiry date on wait pool
CREATE OR REPLACE FUNCTION set_wait_pool_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.expiry_date IS NULL THEN
    NEW.expiry_date := NEW.added_date + INTERVAL '6 months';
  END IF;
  IF NEW.review_date IS NULL THEN
    NEW.review_date := NEW.added_date + INTERVAL '30 days';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_wait_pool_expiry ON public.wait_pool;
CREATE TRIGGER trg_wait_pool_expiry
  BEFORE INSERT ON public.wait_pool
  FOR EACH ROW
  EXECUTE FUNCTION set_wait_pool_expiry();

-- ============================================
-- 7. RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditional_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wait_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function to check HR access
CREATE OR REPLACE FUNCTION has_hr_access(user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_role BOOLEAN;
  has_dept BOOLEAN;
BEGIN
  -- Check for HR-related roles
  SELECT EXISTS(
    SELECT 1 FROM user_roles 
    WHERE clerk_user_id = user_id 
    AND role_slug IN ('super_admin', 'admin', 'hr', 'hr_admin', 'recruiter')
    AND is_active = TRUE
  ) INTO has_role;
  
  IF has_role THEN
    RETURN TRUE;
  END IF;
  
  -- Check for people_culture department
  SELECT EXISTS(
    SELECT 1 FROM user_departments ud
    JOIN departments d ON ud.department_id = d.id
    WHERE ud.user_id = user_id 
    AND d.department_code IN ('people_culture', 'hr', 'human_resources')
  ) INTO has_dept;
  
  RETURN has_dept;
END;
$$;

-- Candidates policies
DROP POLICY IF EXISTS "HR can view all candidates" ON public.candidates;
CREATE POLICY "HR can view all candidates"
  ON public.candidates FOR SELECT
  USING (has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "HR can insert candidates" ON public.candidates;
CREATE POLICY "HR can insert candidates"
  ON public.candidates FOR INSERT
  WITH CHECK (has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "HR can update candidates" ON public.candidates;
CREATE POLICY "HR can update candidates"
  ON public.candidates FOR UPDATE
  USING (has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "HR can delete candidates" ON public.candidates;
CREATE POLICY "HR can delete candidates"
  ON public.candidates FOR DELETE
  USING (has_hr_access(auth.jwt() ->> 'sub'));

-- Interview history policies
DROP POLICY IF EXISTS "HR can view all interviews" ON public.interview_history;
CREATE POLICY "HR can view all interviews"
  ON public.interview_history FOR SELECT
  USING (has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Interviewers can view their interviews" ON public.interview_history;
CREATE POLICY "Interviewers can view their interviews"
  ON public.interview_history FOR SELECT
  USING (auth.jwt() ->> 'sub' = ANY(interviewer_ids));

DROP POLICY IF EXISTS "HR can manage interviews" ON public.interview_history;
CREATE POLICY "HR can manage interviews"
  ON public.interview_history FOR ALL
  USING (has_hr_access(auth.jwt() ->> 'sub'));

-- Conditional offers policies
DROP POLICY IF EXISTS "HR can view all offers" ON public.conditional_offers;
CREATE POLICY "HR can view all offers"
  ON public.conditional_offers FOR SELECT
  USING (has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "HR can manage offers" ON public.conditional_offers;
CREATE POLICY "HR can manage offers"
  ON public.conditional_offers FOR ALL
  USING (has_hr_access(auth.jwt() ->> 'sub'));

-- Wait pool policies
DROP POLICY IF EXISTS "HR can view wait pool" ON public.wait_pool;
CREATE POLICY "HR can view wait pool"
  ON public.wait_pool FOR SELECT
  USING (has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "HR can manage wait pool" ON public.wait_pool;
CREATE POLICY "HR can manage wait pool"
  ON public.wait_pool FOR ALL
  USING (has_hr_access(auth.jwt() ->> 'sub'));

-- HR audit log policies (read-only for HR, write via triggers)
DROP POLICY IF EXISTS "HR can view audit log" ON public.hr_audit_log;
CREATE POLICY "HR can view audit log"
  ON public.hr_audit_log FOR SELECT
  USING (has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "System can insert audit log" ON public.hr_audit_log;
CREATE POLICY "System can insert audit log"
  ON public.hr_audit_log FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- 8. UPDATED_AT TRIGGERS
-- ============================================

-- Candidates
DROP TRIGGER IF EXISTS trg_candidates_updated_at ON public.candidates;
CREATE TRIGGER trg_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Interview history
DROP TRIGGER IF EXISTS trg_interviews_updated_at ON public.interview_history;
CREATE TRIGGER trg_interviews_updated_at
  BEFORE UPDATE ON public.interview_history
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Conditional offers
DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.conditional_offers;
CREATE TRIGGER trg_offers_updated_at
  BEFORE UPDATE ON public.conditional_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Wait pool
DROP TRIGGER IF EXISTS trg_wait_pool_updated_at ON public.wait_pool;
CREATE TRIGGER trg_wait_pool_updated_at
  BEFORE UPDATE ON public.wait_pool
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- 9. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.candidates IS 'Stores all job candidates in the hiring pipeline';
COMMENT ON TABLE public.interview_history IS 'Tracks all interviews conducted for candidates';
COMMENT ON TABLE public.conditional_offers IS 'Manages job offers with conditions and tracking';
COMMENT ON TABLE public.wait_pool IS 'Holds promising candidates for future opportunities';
COMMENT ON TABLE public.hr_audit_log IS 'Audit trail for all HR module actions';

COMMENT ON FUNCTION generate_offer_code() IS 'Generates unique offer codes in format SC-YYYYMMDD-XXXX';
COMMENT ON FUNCTION has_hr_access(TEXT) IS 'Checks if user has HR access via role or department';
