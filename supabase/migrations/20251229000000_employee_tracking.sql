-- Migration: 20251229000000_employee_tracking.sql
-- Description: Comprehensive Employee Tracking System with History/Audit and RLS

-- ============================================
-- 0. DEPENDENCY TABLES (Created to satisfy FKs)
-- ============================================

CREATE TABLE IF NOT EXISTS public.benefits_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.benefits_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.benefits_packages(id),
  name TEXT NOT NULL,
  plan_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.company_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_tag TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  purchase_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 0.0. PRE-REQUISITES
-- ============================================

-- (No pre-requisites needed as we are linking to profiles.id which is PK)

-- ============================================
-- 0.1. DEPARTMENTS (From prompt, standard)
-- ============================================
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_code TEXT UNIQUE NOT NULL,
  department_name TEXT NOT NULL,
  description TEXT,
  
  -- Hierarchy
  parent_department_id UUID REFERENCES public.departments(id),
  department_level INTEGER,
  
  -- Management
  department_head_id UUID, -- Circular ref resolved later via ALTER or loose coupling
  department_admin_id UUID, 
  
  -- Financial
  cost_center TEXT,
  budget_code TEXT,
  
  -- Location
  primary_location TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 1. EMPLOYEES TABLE (Main employee record)
-- ============================================
CREATE TABLE IF NOT EXISTS public.employees (
  -- Core identifiers
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Linking to profiles.id assuming it holds the Clerk Identity.
  -- Naming it clerk_user_id for clarity in this table.
  clerk_user_id TEXT UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  internal_employee_id TEXT UNIQUE NOT NULL, -- Company-assigned ID (EMP-001)
  
  -- Current employment status
  current_status TEXT NOT NULL DEFAULT 'candidate', -- candidate, offer_pending, hired, active, on_leave, terminated, retired
  current_employment_type TEXT DEFAULT 'full_time', -- full_time, part_time, contract, intern, seasonal
  current_title TEXT,
  current_department_id UUID REFERENCES public.departments(id),
  current_manager_id UUID REFERENCES public.employees(id), -- Self-referential
  current_work_location TEXT,
  current_work_schedule TEXT, -- '9-5', 'flexible', 'remote', 'hybrid'
  
  -- Compensation
  current_salary DECIMAL(10,2),
  current_salary_currency TEXT DEFAULT 'USD',
  current_pay_frequency TEXT DEFAULT 'monthly', -- weekly, biweekly, monthly
  current_pay_type TEXT DEFAULT 'salary', -- salary, hourly, commission
  
  -- Key dates
  application_date DATE,
  offer_date DATE,
  hire_date DATE,
  original_hire_date DATE, -- In case of re-hires
  termination_date DATE,
  termination_type TEXT, -- voluntary, involuntary, retirement
  termination_reason TEXT,
  last_promotion_date DATE,
  next_review_date DATE,
  
  -- Flags
  is_active BOOLEAN DEFAULT TRUE,
  is_management BOOLEAN DEFAULT FALSE,
  requires_sponsorship BOOLEAN DEFAULT FALSE,
  has_signed_nda BOOLEAN DEFAULT FALSE,
  has_signed_ip_agreement BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  cost_center TEXT,
  business_unit TEXT,
  division TEXT,
  employee_level INTEGER, -- Career level (IC3, M2, etc.)
  employee_grade TEXT, -- A, B, C or 1, 2, 3
  
  -- Audit
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. EMPLOYMENT STATUS HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.employment_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Status details
  status TEXT NOT NULL,
  employment_type TEXT,
  effective_date DATE NOT NULL,
  end_date DATE, -- NULL = current
  
  -- Context
  reason TEXT,
  initiated_by TEXT, -- clerk_user_id
  approved_by TEXT, -- clerk_user_id
  approval_date DATE,
  
  -- Documentation
  supporting_document_url TEXT,
  notes TEXT,
  
  -- Metadata
  source_system TEXT DEFAULT 'hr_portal',
  is_automated BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR effective_date <= end_date)
);

-- ============================================
-- 3. TITLE/POSITION HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.title_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Title details
  title TEXT NOT NULL,
  job_code TEXT, -- HR job code
  job_family TEXT, -- Engineering, Sales, etc.
  job_level TEXT, -- Junior, Senior, Lead, etc.
  
  -- Effective dates
  effective_date DATE NOT NULL,
  end_date DATE,
  
  -- Change context
  change_type TEXT NOT NULL CHECK (change_type IN ('promotion', 'demotion', 'lateral', 'reorganization', 'correction')),
  change_reason TEXT,
  salary_change_percentage DECIMAL(5,2),
  
  -- Approval
  approved_by TEXT,
  approval_date DATE,
  
  -- Reporting structure
  manager_id UUID REFERENCES public.employees(id),
  matrix_manager_id UUID REFERENCES public.employees(id),
  dotted_line_reports BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. DEPARTMENT/LOCATION HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.department_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Department details
  department_id UUID REFERENCES public.departments(id),
  department_name TEXT,
  cost_center TEXT,
  business_unit TEXT,
  division TEXT,
  
  -- Location details
  work_location TEXT,
  work_location_type TEXT CHECK (work_location_type IN ('office', 'remote', 'hybrid', 'field')),
  office_number TEXT,
  desk_number TEXT,
  
  -- Dates
  effective_date DATE NOT NULL,
  end_date DATE,
  
  -- Change details
  transfer_type TEXT CHECK (transfer_type IN ('internal', 'reorganization', 'acquisition')),
  transfer_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. COMPENSATION HISTORY (PAY HISTORY)
-- ============================================
CREATE TABLE IF NOT EXISTS public.compensation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Compensation details
  base_salary DECIMAL(10,2) NOT NULL,
  salary_currency TEXT DEFAULT 'USD',
  pay_frequency TEXT DEFAULT 'monthly',
  pay_type TEXT DEFAULT 'salary',
  hourly_rate DECIMAL(8,2),
  overtime_rate_multiplier DECIMAL(3,2) DEFAULT 1.5,
  
  -- Variable compensation
  target_bonus_percentage DECIMAL(5,2),
  target_commission_percentage DECIMAL(5,2),
  equity_awards TEXT, -- Stock options, RSUs details
  equity_vesting_schedule TEXT,
  
  -- Benefits
  benefits_package_id UUID REFERENCES public.benefits_packages(id),
  retirement_contribution_percentage DECIMAL(5,2),
  healthcare_contribution DECIMAL(10,2),
  
  -- Effective dates
  effective_date DATE NOT NULL,
  end_date DATE,
  
  -- Change details
  change_reason TEXT NOT NULL CHECK (change_reason IN (
    'annual_raise', 'promotion', 'market_adjustment', 'merit', 
    'cost_of_living', 'retention', 'demotion', 'correction'
  )),
  previous_salary DECIMAL(10,2),
  percentage_change DECIMAL(5,2),
  
  -- Approval
  approved_by TEXT,
  approval_date DATE,
  budget_code TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_compensation CHECK (
    (pay_type = 'salary' AND base_salary IS NOT NULL) OR
    (pay_type = 'hourly' AND hourly_rate IS NOT NULL)
  )
);

-- ============================================
-- 6. PERSONAL INFORMATION HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.personal_info_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Name history
  legal_first_name TEXT,
  legal_last_name TEXT,
  preferred_first_name TEXT,
  preferred_last_name TEXT,
  middle_name TEXT,
  maiden_name TEXT,
  suffix TEXT, -- Jr., Sr., III, etc.
  
  -- Contact history
  personal_email TEXT,
  work_email TEXT,
  personal_phone TEXT,
  work_phone TEXT,
  emergency_phone TEXT,
  
  -- Address history
  address_type TEXT CHECK (address_type IN ('home', 'mailing', 'emergency')),
  street_address TEXT,
  street_address_2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  
  -- Government IDs (encrypted in production)
  ssn_last_four TEXT, -- Last 4 only, for identification
  government_id_type TEXT,
  government_id_number TEXT, -- Encrypted
  government_id_expiry DATE,
  
  -- Demographic data (for EEOC reporting - optional)
  date_of_birth DATE,
  gender TEXT,
  ethnicity TEXT,
  veteran_status BOOLEAN,
  disability_status BOOLEAN,
  
  -- Effective dates
  effective_date DATE NOT NULL,
  end_date DATE,
  
  -- Change reason
  change_reason TEXT CHECK (change_reason IN (
    'marriage', 'divorce', 'legal_change', 'correction', 
    'preference', 'address_update', 'contact_update'
  )),
  
  -- Verification
  verification_status TEXT DEFAULT 'pending',
  verified_by TEXT,
  verification_date DATE,
  verification_document_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Security constraints
  CONSTRAINT ssn_format CHECK (ssn_last_four IS NULL OR ssn_last_four ~ '^[0-9]{4}$')
);

-- ============================================
-- 7. EDUCATION & CERTIFICATION HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.education_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Institution
  institution_name TEXT NOT NULL,
  institution_type TEXT CHECK (institution_type IN ('university', 'college', 'trade_school', 'online', 'other')),
  
  -- Qualification
  degree_type TEXT, -- BA, BS, MA, PhD, etc.
  major TEXT,
  specialization TEXT,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  graduation_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Details
  gpa DECIMAL(3,2),
  gpa_scale DECIMAL(3,2) DEFAULT 4.0,
  honors TEXT,
  thesis_title TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by TEXT,
  verification_date DATE,
  diploma_copy_url TEXT,
  
  -- Metadata
  country TEXT,
  state TEXT,
  credits_earned INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Certification details
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  certification_number TEXT,
  
  -- Validity
  issue_date DATE NOT NULL,
  expiry_date DATE,
  is_permanent BOOLEAN DEFAULT FALSE,
  renewal_required BOOLEAN DEFAULT FALSE,
  renewal_frequency_months INTEGER,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspended')),
  
  -- Company relevance
  is_job_required BOOLEAN DEFAULT FALSE,
  company_paid BOOLEAN DEFAULT FALSE,
  reimbursement_amount DECIMAL(10,2),
  
  -- Verification
  verification_url TEXT,
  certificate_copy_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. PERFORMANCE & REVIEW HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  review_cycle_id UUID REFERENCES public.review_cycles(id),
  
  -- Review details
  review_type TEXT NOT NULL CHECK (review_type IN ('annual', 'probation', 'promotion', 'check_in', 'exit')),
  review_period_start DATE,
  review_period_end DATE,
  review_date DATE NOT NULL,
  
  -- Participants
  reviewer_id UUID REFERENCES public.employees(id),
  second_level_reviewer_id UUID REFERENCES public.employees(id),
  hr_bp_id UUID REFERENCES public.employees(id),
  
  -- Ratings
  overall_rating DECIMAL(3,2),
  rating_scale TEXT DEFAULT '1-5',
  performance_summary TEXT,
  strengths TEXT,
  development_areas TEXT,
  
  -- Goals
  previous_goals_achievement TEXT,
  new_goals TEXT,
  
  -- Compensation impact
  merit_increase_percentage DECIMAL(5,2),
  bonus_amount DECIMAL(10,2),
  promotion_recommended BOOLEAN DEFAULT FALSE,
  
  -- Status
  review_status TEXT DEFAULT 'draft' CHECK (review_status IN ('draft', 'submitted', 'approved', 'acknowledged', 'disputed')),
  employee_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledgment_date DATE,
  employee_comments TEXT,
  
  -- Documentation
  review_document_url TEXT,
  goals_document_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. LEAVE & ABSENCE HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.leave_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Leave details
  leave_type TEXT NOT NULL CHECK (leave_type IN (
    'vacation', 'sick', 'personal', 'parental', 'bereavement', 
    'jury_duty', 'military', 'unpaid', 'other'
  )),
  leave_subtype TEXT, -- For parental: maternity, paternity, adoption
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  actual_end_date DATE, -- If returned early
  total_days DECIMAL(5,1) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'denied', 'cancelled', 'in_progress', 'completed')),
  
  -- Approval
  requested_date DATE DEFAULT CURRENT_DATE,
  approved_by TEXT,
  approval_date DATE,
  denial_reason TEXT,
  
  -- Details
  reason TEXT,
  is_medical BOOLEAN DEFAULT FALSE,
  doctor_note_required BOOLEAN DEFAULT FALSE,
  doctor_note_provided BOOLEAN DEFAULT FALSE,
  
  -- Pay impact
  is_paid BOOLEAN DEFAULT TRUE,
  pay_percentage DECIMAL(5,2) DEFAULT 100.00,
  
  -- Continuation of benefits
  benefits_continue BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates_range CHECK (start_date <= end_date)
);

-- ============================================
-- 10. EQUIPMENT & ASSET HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.equipment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.company_assets(id),
  
  -- Asset details
  asset_type TEXT NOT NULL CHECK (asset_type IN (
    'laptop', 'desktop', 'monitor', 'phone', 'tablet', 
    'accessory', 'furniture', 'vehicle', 'tool', 'other'
  )),
  asset_name TEXT NOT NULL,
  serial_number TEXT,
  model_number TEXT,
  
  -- Assignment
  assignment_date DATE NOT NULL,
  expected_return_date DATE,
  actual_return_date DATE,
  
  -- Condition
  condition_assigned TEXT DEFAULT 'new',
  condition_returned TEXT,
  
  -- Cost
  purchase_price DECIMAL(10,2),
  depreciated_value DECIMAL(10,2),
  employee_responsibility_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'returned', 'lost', 'stolen', 'damaged', 'retired')),
  
  -- Agreement
  agreement_signed BOOLEAN DEFAULT FALSE,
  agreement_document_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 11. EMERGENCY CONTACTS HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.emergency_contact_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Contact details
  contact_type TEXT DEFAULT 'emergency' CHECK (contact_type IN ('emergency', 'doctor', 'lawyer', 'other')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  
  -- Contact information
  primary_phone TEXT NOT NULL,
  secondary_phone TEXT,
  email TEXT,
  
  -- Address
  street_address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  
  -- Priority
  priority INTEGER DEFAULT 1, -- 1 = primary, 2 = secondary, etc.
  
  -- Effective dates
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- Verification
  verified_by_employee BOOLEAN DEFAULT TRUE,
  verification_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 12. TRAINING & DEVELOPMENT HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.training_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Training details
  training_name TEXT NOT NULL,
  training_type TEXT CHECK (training_type IN (
    'mandatory', 'compliance', 'skill_development', 'leadership', 'safety', 'other'
  )),
  provider TEXT,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  completion_date DATE,
  
  -- Status
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'in_progress', 'completed', 'cancelled', 'failed')),
  
  -- Results
  score DECIMAL(5,2),
  pass_score DECIMAL(5,2) DEFAULT 70.00,
  passed BOOLEAN,
  certificate_issued BOOLEAN,
  certificate_url TEXT,
  
  -- Requirements
  is_required BOOLEAN DEFAULT FALSE,
  required_by_date DATE,
  
  -- Cost
  cost DECIMAL(10,2),
  company_paid BOOLEAN DEFAULT TRUE,
  reimbursement_required BOOLEAN DEFAULT FALSE,
  
  -- Hours
  total_hours DECIMAL(5,2),
  work_hours_used DECIMAL(5,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 13. BENEFITS ENROLLMENT HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.benefits_enrollment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  benefits_plan_id UUID REFERENCES public.benefits_plans(id),
  
  -- Enrollment details
  enrollment_type TEXT NOT NULL CHECK (enrollment_type IN (
    'new_hire', 'open_enrollment', 'life_event', 'correction', 'termination'
  )),
  life_event_type TEXT, -- marriage, birth, adoption, divorce, loss_of_coverage
  
  -- Coverage
  coverage_level TEXT CHECK (coverage_level IN ('employee_only', 'employee_spouse', 'employee_children', 'family')),
  effective_date DATE NOT NULL,
  termination_date DATE,
  
  -- Dependents
  dependents_count INTEGER DEFAULT 0,
  dependents_details JSONB,
  
  -- Costs
  employee_cost_per_paycheck DECIMAL(10,2),
  company_cost_per_paycheck DECIMAL(10,2),
  total_cost_per_paycheck DECIMAL(10,2),
  
  -- Status
  enrollment_status TEXT DEFAULT 'pending' CHECK (enrollment_status IN ('pending', 'approved', 'active', 'terminated', 'cancelled')),
  
  -- Documentation
  supporting_docs_url TEXT,
  enrollment_form_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 14. INCIDENTS & DISCIPLINARY HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.incident_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Incident details
  incident_type TEXT NOT NULL CHECK (incident_type IN (
    'performance', 'conduct', 'attendance', 'safety', 'harassment', 
    'discrimination', 'theft', 'violation', 'other'
  )),
  incident_date DATE NOT NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Description
  description TEXT NOT NULL,
  location TEXT,
  witnesses TEXT[], -- Array of employee IDs or names
  
  -- Investigation
  investigator_id UUID REFERENCES public.employees(id),
  investigation_date DATE,
  investigation_findings TEXT,
  
  -- Action taken
  action_taken TEXT CHECK (action_taken IN (
    'verbal_warning', 'written_warning', 'performance_plan', 
    'suspension', 'demotion', 'termination', 'training', 'none'
  )),
  action_details TEXT,
  action_date DATE,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  follow_up_result TEXT,
  
  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed', 'appealed')),
  
  -- Severity
  severity_level TEXT DEFAULT 'low' CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  
  -- Confidentiality
  is_confidential BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 20. ADDITIONAL TRACKING TABLES (FROM BRAINSTORM)
-- ============================================

-- 20.1. WORK SCHEDULE HISTORY
CREATE TABLE IF NOT EXISTS public.work_schedule_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  schedule_type TEXT NOT NULL, -- 'standard', 'flexible', 'compressed', 'shift'
  work_days TEXT[], -- ['mon', 'tue', 'wed', 'thu', 'fri']
  start_time TIME WITHOUT TIME ZONE,
  end_time TIME WITHOUT TIME ZONE,
  break_minutes INTEGER,
  effective_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.2. SKILL INVENTORY HISTORY
CREATE TABLE IF NOT EXISTS public.skill_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  skill_category TEXT NOT NULL, -- 'technical', 'soft', 'language', 'certification'
  skill_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience DECIMAL(3,1),
  last_used_date DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by TEXT,
  verification_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.3. PROJECT ASSIGNMENT HISTORY
CREATE TABLE IF NOT EXISTS public.project_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id),
  project_name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'lead', 'member', 'consultant', 'stakeholder'
  allocation_percentage INTEGER CHECK (allocation_percentage BETWEEN 0 AND 100),
  start_date DATE NOT NULL,
  end_date DATE,
  project_manager_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.4. MENTORSHIP & COACHING HISTORY
CREATE TABLE IF NOT EXISTS public.mentorship_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES public.employees(id),
  mentee_id UUID REFERENCES public.employees(id),
  relationship_type TEXT CHECK (relationship_type IN ('mentor', 'mentee', 'peer', 'coach')),
  start_date DATE NOT NULL,
  end_date DATE,
  goals TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.5. RECOGNITION & AWARDS HISTORY
CREATE TABLE IF NOT EXISTS public.recognition_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  award_type TEXT NOT NULL, -- 'spot_bonus', 'peer_recognition', 'anniversary', 'excellence'
  award_name TEXT NOT NULL,
  award_date DATE NOT NULL,
  awarded_by TEXT,
  monetary_value DECIMAL(10,2),
  description TEXT,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.6. EXPENSE & REIMBURSEMENT HISTORY
CREATE TABLE IF NOT EXISTS public.expense_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  expense_type TEXT NOT NULL, -- 'travel', 'meal', 'equipment', 'training', 'other'
  expense_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  receipt_url TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected', 'paid')),
  approved_by TEXT,
  approval_date DATE,
  reimbursement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.7. VISA & WORK AUTHORIZATION HISTORY
CREATE TABLE IF NOT EXISTS public.visa_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  visa_type TEXT NOT NULL,
  visa_number TEXT,
  country TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  sponsorship_required BOOLEAN DEFAULT FALSE,
  sponsorship_start_date DATE,
  sponsorship_end_date DATE,
  i9_document_type TEXT,
  i9_document_number TEXT,
  i9_expiry_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.8. HEALTH & SAFETY RECORDS
CREATE TABLE IF NOT EXISTS public.health_safety_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL, -- 'vaccination', 'physical', 'training', 'incident'
  record_date DATE NOT NULL,
  description TEXT,
  provider_name TEXT,
  next_due_date DATE,
  document_url TEXT,
  is_confidential BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20.9. EXIT INTERVIEW & OFFBOARDING
CREATE TABLE IF NOT EXISTS public.exit_interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  interview_date DATE NOT NULL,
  conducted_by TEXT,
  reason_for_leaving TEXT,
  feedback TEXT,
  rehire_eligible BOOLEAN DEFAULT TRUE,
  rehire_recommendation TEXT,
  knowledge_transfer_completed BOOLEAN DEFAULT FALSE,
  equipment_returned BOOLEAN DEFAULT FALSE,
  access_revoked BOOLEAN DEFAULT FALSE,
  final_payment_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 16. AUDIT TRIGGERS FOR ALL TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.employee_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Change details
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_columns TEXT[],
  
  -- Who made the change
  changed_by TEXT NOT NULL, -- clerk_user_id
  changed_by_role TEXT,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  transaction_id TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION log_employee_changes()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  changed_cols TEXT[] := '{}';
  col_name TEXT;
  employee_uuid UUID;
BEGIN
  -- Determine employee ID
  IF TG_TABLE_NAME = 'employees' THEN
    employee_uuid := COALESCE(NEW.id, OLD.id);
  ELSE
    employee_uuid := COALESCE(NEW.employee_id, OLD.employee_id);
  END IF;
  
  -- Get old and new values
  IF TG_OP = 'INSERT' THEN
    old_data := NULL;
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    
    -- Find changed columns
    FOR col_name IN SELECT jsonb_object_keys(old_data) LOOP
      IF old_data->>col_name != new_data->>col_name THEN
        changed_cols := array_append(changed_cols, col_name);
      END IF;
    END LOOP;
  ELSIF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    new_data := NULL;
  END IF;
  
  -- Insert into audit log using safe coalesce for system contexts
  INSERT INTO public.employee_audit_log (
    table_name,
    record_id,
    employee_id,
    action,
    old_values,
    new_values,
    changed_columns,
    changed_by,
    changed_by_role,
    ip_address,
    user_agent
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    employee_uuid,
    TG_OP,
    old_data,
    new_data,
    changed_cols,
    COALESCE(current_setting('app.current_user_id', TRUE), 'system'),
    COALESCE(current_setting('app.current_user_role', TRUE), 'system'),
    NULLIF(current_setting('app.ip_address', TRUE), '')::INET,
    current_setting('app.user_agent', TRUE)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for all employee tables
DO $$ 
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'employees', 'employment_status_history', 'title_history', 
      'department_history', 'compensation_history', 'personal_info_history',
      'education_history', 'certification_history', 'performance_reviews',
      'leave_history', 'equipment_history', 'emergency_contact_history',
      'training_history', 'benefits_enrollment_history', 'incident_history',
      'work_schedule_history', 'skill_inventory', 'project_assignments',
      'mentorship_history', 'recognition_history', 'expense_history',
      'visa_history', 'health_safety_records', 'exit_interviews'
    )
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS audit_%s ON public.%I;
      CREATE TRIGGER audit_%s
      AFTER INSERT OR UPDATE OR DELETE ON public.%I
      FOR EACH ROW
      EXECUTE FUNCTION log_employee_changes();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END $$;

-- ============================================
-- 17. COMPREHENSIVE VIEWS FOR REPORTING
-- ============================================

-- Employee Current Snapshot View
CREATE OR REPLACE VIEW public.employee_current_snapshot WITH (security_invoker = true) AS
SELECT 
  e.*,
  p.first_name,
  p.last_name,
  p.email,
  d.department_name,
  -- Current compensation
  (SELECT base_salary 
   FROM public.compensation_history ch 
   WHERE ch.employee_id = e.id 
     AND ch.effective_date <= CURRENT_DATE 
     AND (ch.end_date IS NULL OR ch.end_date >= CURRENT_DATE)
   ORDER BY ch.effective_date DESC 
   LIMIT 1) as current_base_salary,
  -- Tenure in years
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, COALESCE(e.original_hire_date, e.hire_date))) as tenure_years
FROM public.employees e
LEFT JOIN public.profiles p ON e.clerk_user_id = p.id
LEFT JOIN public.departments d ON e.current_department_id = d.id;

-- Employee Timeline View
CREATE OR REPLACE VIEW public.employee_timeline WITH (security_invoker = true) AS
SELECT 
  employee_id,
  event_date,
  event_type,
  event_details
FROM (
  -- Status changes
  SELECT 
    employee_id,
    effective_date as event_date,
    'status_change' as event_type,
    jsonb_build_object(
      'from', LAG(status) OVER w,
      'to', status,
      'reason', reason
    ) as event_details
  FROM public.employment_status_history
  WINDOW w AS (PARTITION BY employee_id ORDER BY effective_date)
  
  UNION ALL
  
  -- Title changes
  SELECT 
    employee_id,
    effective_date as event_date,
    'title_change' as event_type,
    jsonb_build_object(
      'from', LAG(title) OVER w,
      'to', title,
      'type', change_type
    ) as event_details
  FROM public.title_history
  WINDOW w AS (PARTITION BY employee_id ORDER BY effective_date)
  
  UNION ALL
  
  -- Department transfers
  SELECT 
    employee_id,
    effective_date as event_date,
    'department_transfer' as event_type,
    jsonb_build_object(
      'from_department', LAG(department_name) OVER w,
      'to_department', department_name,
      'type', transfer_type
    ) as event_details
  FROM public.department_history
  WINDOW w AS (PARTITION BY employee_id ORDER BY effective_date)
  
  UNION ALL
  
  -- Salary changes
  SELECT 
    employee_id,
    effective_date as event_date,
    'salary_change' as event_type,
    jsonb_build_object(
      'from', LAG(base_salary) OVER w,
      'to', base_salary,
      'change_percentage', percentage_change,
      'reason', change_reason
    ) as event_details
  FROM public.compensation_history
  WINDOW w AS (PARTITION BY employee_id ORDER BY effective_date)
  
  UNION ALL
  
  -- Performance reviews
  SELECT 
    employee_id,
    review_date as event_date,
    'performance_review' as event_type,
    jsonb_build_object(
      'rating', overall_rating,
      'type', review_type
    ) as event_details
  FROM public.performance_reviews
  
  UNION ALL
  
  -- Leaves
  SELECT 
    employee_id,
    start_date as event_date,
    'leave_start' as event_type,
    jsonb_build_object(
      'type', leave_type,
      'days', total_days
    ) as event_details
  FROM public.leave_history
) timeline_events
ORDER BY event_date DESC;

-- ============================================
-- 18. INDEXES FOR PERFORMANCE
-- ============================================

-- Employees table indexes
CREATE INDEX IF NOT EXISTS idx_employees_clerk_user_id ON public.employees(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_employees_internal_id ON public.employees(internal_employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(current_department_id);
CREATE INDEX IF NOT EXISTS idx_employees_manager ON public.employees(current_manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(current_status) WHERE is_active = TRUE;

-- History tables indexes
CREATE INDEX IF NOT EXISTS idx_status_history_employee ON public.employment_status_history(employee_id, effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_title_history_employee ON public.title_history(employee_id, effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_department_history_employee ON public.department_history(employee_id, effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_comp_history_employee ON public.compensation_history(employee_id, effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_personal_info_employee ON public.personal_info_history(employee_id, effective_date DESC);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_employee ON public.employee_audit_log(employee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_table ON public.employee_audit_log(table_name, record_id);

-- ============================================
-- 19. HELPER FUNCTIONS
-- ============================================

-- Function to get employee's full history
CREATE OR REPLACE FUNCTION get_employee_full_history(p_employee_id UUID)
RETURNS TABLE (
  event_date DATE,
  event_type TEXT,
  event_details JSONB,
  source_table TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (
    SELECT effective_date, 'status' as event_type, 
           jsonb_build_object('status', status, 'reason', reason) as event_details,
           'employment_status_history' as source_table
    FROM public.employment_status_history WHERE employee_id = p_employee_id
    
    UNION ALL
    
    SELECT effective_date, 'title', 
           jsonb_build_object('title', title, 'change_type', change_type),
           'title_history'
    FROM public.title_history WHERE employee_id = p_employee_id
    
    UNION ALL
    
    SELECT effective_date, 'department', 
           jsonb_build_object('department', department_name, 'location', work_location),
           'department_history'
    FROM public.department_history WHERE employee_id = p_employee_id
    
    UNION ALL
    
    SELECT effective_date, 'compensation', 
           jsonb_build_object('salary', base_salary, 'change_percentage', percentage_change),
           'compensation_history'
    FROM public.compensation_history WHERE employee_id = p_employee_id
    
    UNION ALL
    
    SELECT review_date, 'performance_review', 
           jsonb_build_object('rating', overall_rating, 'type', review_type),
           'performance_reviews'
    FROM public.performance_reviews WHERE employee_id = p_employee_id
  ) all_events
  ORDER BY event_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate employee tenure
CREATE OR REPLACE FUNCTION calculate_employee_tenure(p_employee_id UUID)
RETURNS TABLE (
  total_years INTEGER,
  total_months INTEGER,
  total_days INTEGER,
  company_years INTEGER,
  position_years INTEGER,
  department_years INTEGER
) AS $$
DECLARE
  hire_dt DATE;
  term_dt DATE;
  current_title_start DATE;
  current_dept_start DATE;
BEGIN
  -- Get hire and termination dates
  SELECT hire_date, termination_date 
  INTO hire_dt, term_dt
  FROM public.employees 
  WHERE id = p_employee_id;
  
  -- Get current title start date
  SELECT MIN(effective_date)
  INTO current_title_start
  FROM public.title_history
  WHERE employee_id = p_employee_id
    AND end_date IS NULL;
  
  -- Get current department start date
  SELECT MIN(effective_date)
  INTO current_dept_start
  FROM public.department_history
  WHERE employee_id = p_employee_id
    AND end_date IS NULL;
  
  RETURN QUERY
  SELECT 
    EXTRACT(YEAR FROM AGE(COALESCE(term_dt, CURRENT_DATE), hire_dt))::INTEGER,
    EXTRACT(MONTH FROM AGE(COALESCE(term_dt, CURRENT_DATE), hire_dt))::INTEGER,
    EXTRACT(DAY FROM AGE(COALESCE(term_dt, CURRENT_DATE), hire_dt))::INTEGER,
    EXTRACT(YEAR FROM AGE(COALESCE(term_dt, CURRENT_DATE), hire_dt))::INTEGER,
    EXTRACT(YEAR FROM AGE(COALESCE(term_dt, CURRENT_DATE), COALESCE(current_title_start, hire_dt)))::INTEGER,
    EXTRACT(YEAR FROM AGE(COALESCE(term_dt, CURRENT_DATE), COALESCE(current_dept_start, hire_dt)))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 20. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Function to check if user is HR/Admin
CREATE OR REPLACE FUNCTION public.is_hr_admin() 
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_slug = r.slug
    WHERE ur.clerk_user_id = (auth.jwt() ->> 'sub')
    AND (
      r.slug IN ('super_admin', 'admin', 'hr_manager') 
      OR r.permission_level >= 80
      OR (ur.metadata->>'is_hr_admin')::boolean = true
    )
    AND ur.is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- Loop through all tables to enable RLS and add standard strict policies
DO $block$ 
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'employees', 'employment_status_history', 'title_history', 'departments',
      'department_history', 'compensation_history', 'personal_info_history',
      'education_history', 'certification_history', 'performance_reviews',
      'leave_history', 'equipment_history', 'emergency_contact_history',
      'training_history', 'benefits_enrollment_history', 'incident_history',
      'work_schedule_history', 'skill_inventory', 'project_assignments',
      'mentorship_history', 'recognition_history', 'expense_history',
      'visa_history', 'health_safety_records', 'exit_interviews',
      'employee_audit_log', 'benefits_packages', 'benefits_plans', 'company_assets',
      'projects', 'review_cycles'
    )
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    
    EXECUTE format('
      DROP POLICY IF EXISTS "HR/Admins can do everything on %I" ON public.%I;
      CREATE POLICY "HR/Admins can do everything on %I" ON public.%I
      FOR ALL USING ( public.is_hr_admin() );
    ', tbl, tbl, tbl, tbl);

    IF tbl NOT IN (
        'compensation_history', 'performance_reviews', 'incident_history', 'employee_audit_log', 
        'security_records',
        'benefits_packages', 'benefits_plans', 'company_assets', 'projects', 'review_cycles', 'departments'
    ) THEN
      IF tbl = 'employees' THEN
          EXECUTE format('
            DROP POLICY IF EXISTS "Employees can view own record on %I" ON public.%I;
            CREATE POLICY "Employees can view own record on %I" ON public.%I
            FOR SELECT USING ( clerk_user_id = (auth.jwt() ->> ''sub'') );
          ', tbl, tbl, tbl, tbl);
      ELSE
          EXECUTE format('
            DROP POLICY IF EXISTS "Employees can view own history on %I" ON public.%I;
            CREATE POLICY "Employees can view own history on %I" ON public.%I
            FOR SELECT USING ( 
              employee_id IN (
                SELECT id FROM public.employees 
                WHERE clerk_user_id = (auth.jwt() ->> ''sub'')
              )
            );
          ', tbl, tbl, tbl, tbl);
      END IF;
    END IF;
    
    IF tbl IN ('benefits_packages', 'benefits_plans', 'company_assets', 'projects', 'review_cycles', 'departments') THEN
        EXECUTE format('
            DROP POLICY IF EXISTS "Employees can view reference data on %I" ON public.%I;
            CREATE POLICY "Employees can view reference data on %I" ON public.%I
            FOR SELECT USING ( auth.role() = ''authenticated'' );
        ', tbl, tbl, tbl, tbl);
    END IF;

  END LOOP;
END $block$;
