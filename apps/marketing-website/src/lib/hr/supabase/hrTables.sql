-- HR Core Tables
CREATE TABLE IF NOT EXISTS hr_employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID, -- REFERENCES companies(id) -- Commented out as companies table might not exist in context, check later
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  position TEXT,
  department TEXT,
  hire_date DATE,
  status TEXT DEFAULT 'active',
  manager_id UUID REFERENCES hr_employees(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding Workflows
CREATE TABLE IF NOT EXISTS hr_onboarding_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]',
  company_id UUID, -- REFERENCES companies(id)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_onboarding_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES hr_employees(id),
  template_id UUID REFERENCES hr_onboarding_templates(id),
  status TEXT DEFAULT 'in_progress',
  current_step INTEGER DEFAULT 0,
  completed_steps JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  start_date DATE,
  completion_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Interview & Talent Management
CREATE TABLE IF NOT EXISTS hr_interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  position TEXT NOT NULL,
  interview_date TIMESTAMP,
  interviewers TEXT[] DEFAULT '{}',
  score INTEGER,
  feedback JSONB DEFAULT '[]',
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_offer_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES hr_interviews(id),
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  expiry_date TIMESTAMP,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_wait_pool (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES hr_interviews(id),
  added_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  last_contact_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance Management
CREATE TABLE IF NOT EXISTS hr_performance_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES hr_employees(id),
  review_cycle TEXT,
  reviewer_id UUID REFERENCES hr_employees(id),
  score INTEGER,
  feedback JSONB DEFAULT '[]',
  goals JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES hr_employees(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'okr', 'kpi', 'personal'
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Time & Attendance
CREATE TABLE IF NOT EXISTS hr_time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES hr_employees(id),
  entry_type TEXT, -- 'clock_in', 'clock_out', 'break_start', 'break_end'
  timestamp TIMESTAMP DEFAULT NOW(),
  location JSONB,
  source TEXT, -- 'web', 'mobile', 'biometric'
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES hr_employees(id),
  type TEXT, -- 'vacation', 'sick', 'parental', 'unpaid'
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending',
  approver_id UUID REFERENCES hr_employees(id),
  notes TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gamification
CREATE TABLE IF NOT EXISTS hr_gamification_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_gamification_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  points_awarded INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics & Reporting
CREATE TABLE IF NOT EXISTS hr_analytics_dashboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT, -- 'turnover', 'hiring', 'engagement', 'productivity'
  widgets JSONB DEFAULT '[]',
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_onboarding_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_interviews ENABLE ROW LEVEL SECURITY;

-- Note: Policies need 'auth.uid()' which implies Supabase Auth context
-- CREATE POLICY "Employees can view their own data" ON hr_employees
--   FOR SELECT USING (auth.uid() = id OR manager_id = auth.uid());
