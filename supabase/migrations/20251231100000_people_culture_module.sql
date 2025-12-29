-- Migration: 20251231100000_people_culture_module.sql
-- Description: Enhancements for People & Culture Module (Status, Lifecycle, Tags, Filters)

-- ============================================
-- 1. EXTEND EMPLOYEES TABLE
-- ============================================

-- Add new columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'status') THEN
        ALTER TABLE public.employees ADD COLUMN status TEXT DEFAULT 'active';
        ALTER TABLE public.employees ADD CONSTRAINT check_employee_status CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'engagement_score') THEN
        ALTER TABLE public.employees ADD COLUMN engagement_score INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'tenure_days') THEN
        ALTER TABLE public.employees ADD COLUMN tenure_days INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'last_review_date') THEN
        ALTER TABLE public.employees ADD COLUMN last_review_date DATE;
    END IF;
    
    -- note: next_review_date already likely exists from previous migration, but safe to ignore if so or add if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'next_review_date') THEN
        ALTER TABLE public.employees ADD COLUMN next_review_date DATE;
    END IF;
END $$;

-- ============================================
-- 2. EMPLOYEE LIFECYCLE EVENTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.employee_lifecycle_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('hire', 'promotion', 'transfer', 'leave_start', 'leave_end', 'exit')),
  event_date DATE NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_by TEXT, -- clerk_user_id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lifecycle events
CREATE INDEX IF NOT EXISTS idx_lifecycle_employee ON public.employee_lifecycle_events(employee_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_date ON public.employee_lifecycle_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_lifecycle_type ON public.employee_lifecycle_events(event_type);

-- ============================================
-- 3. EMPLOYEE TAGS
-- ============================================

CREATE TABLE IF NOT EXISTS public.employee_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  tag_color TEXT DEFAULT 'gray', -- e.g., 'red', 'blue', '#ff0000'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, tag_name) -- Prevent duplicate tags per employee
);

-- Indexes for tags
CREATE INDEX IF NOT EXISTS idx_employee_tags_employee ON public.employee_tags(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_tags_name ON public.employee_tags(tag_name);

-- ============================================
-- 4. SAVED EMPLOYEE FILTERS
-- ============================================

CREATE TABLE IF NOT EXISTS public.saved_employee_filters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- clerk_user_id
  filter_name TEXT NOT NULL,
  filter_config JSONB NOT NULL,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for filters
CREATE INDEX IF NOT EXISTS idx_saved_filters_user ON public.saved_employee_filters(user_id);

-- ============================================
-- 5. RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.employee_lifecycle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_employee_filters ENABLE ROW LEVEL SECURITY;

-- Re-use has_hr_access function from previous migrations if available, or define a basic one if not.
-- Assuming has_hr_access exists. If not, we will rely on a simple check or recreate it.
-- Based on `20251229100000_hr_interview_module.sql`, `has_hr_access` was defined.

-- Policies for employee_lifecycle_events
DROP POLICY IF EXISTS "HR can view lifecycle events" ON public.employee_lifecycle_events;
CREATE POLICY "HR can view lifecycle events"
  ON public.employee_lifecycle_events FOR SELECT
  USING (public.has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "HR can manage lifecycle events" ON public.employee_lifecycle_events;
CREATE POLICY "HR can manage lifecycle events"
  ON public.employee_lifecycle_events FOR ALL
  USING (public.has_hr_access(auth.jwt() ->> 'sub'));

-- Policies for employee_tags
DROP POLICY IF EXISTS "HR can view tags" ON public.employee_tags;
CREATE POLICY "HR can view tags"
  ON public.employee_tags FOR SELECT
  USING (public.has_hr_access(auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "HR can manage tags" ON public.employee_tags;
CREATE POLICY "HR can manage tags"
  ON public.employee_tags FOR ALL
  USING (public.has_hr_access(auth.jwt() ->> 'sub'));

-- Policies for saved_employee_filters
DROP POLICY IF EXISTS "Users can view own filters" ON public.saved_employee_filters;
CREATE POLICY "Users can view own filters"
  ON public.saved_employee_filters FOR SELECT
  USING (user_id = (auth.jwt() ->> 'sub') OR is_shared = TRUE);

DROP POLICY IF EXISTS "Users can manage own filters" ON public.saved_employee_filters;
CREATE POLICY "Users can manage own filters"
  ON public.saved_employee_filters FOR ALL
  USING (user_id = (auth.jwt() ->> 'sub'));

-- ============================================
-- 6. TRIGGERS
-- ============================================

-- Update tenure_days automatically on view? Or nightly?
-- For now, let's create a function to calculate tenure on retrieving if we were using a view,
-- but since it's a column, we might want a scheduled job.
-- Alternatively, we can use a GENERATED column if the DB version supports it involving expressions,
-- but usually dates change.
-- For this MVP, we will leave tenure_days to be updated by the application or a scheduled cron job.
