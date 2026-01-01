-- Migration: 20260101000012_pay_grade_tables.sql
-- Description: Pay Grade Tables for Partner, Lead Partner, and Senior Lead Partner
-- Creates career levels with Class A-F and 1-20 years of service

-- ============================================
-- 1. CAREER LEVELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.career_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  focus TEXT,
  anchor_salary DECIMAL(12,2) NOT NULL,
  longevity_increase_pct DECIMAL(5,2) DEFAULT 3.00,
  longevity_period_years INTEGER DEFAULT 2,
  promotion_increase_pct DECIMAL(5,2) DEFAULT 10.00,
  is_performance_based BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.career_levels IS 'Career level tiers: Partner, Lead Partner, Senior Lead Partner';
COMMENT ON COLUMN public.career_levels.anchor_salary IS 'Base anchor salary for this career level';
COMMENT ON COLUMN public.career_levels.is_performance_based IS 'True for executive levels with variable pay';

-- ============================================
-- 2. PAY GRADE CLASSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.pay_grade_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  career_level_id UUID NOT NULL REFERENCES public.career_levels(id) ON DELETE CASCADE,
  class_code CHAR(1) NOT NULL CHECK (class_code IN ('A', 'B', 'C', 'D', 'E', 'F')),
  class_name TEXT NOT NULL,
  class_description TEXT,
  class_order INTEGER NOT NULL CHECK (class_order BETWEEN 1 AND 6),
  promotion_multiplier DECIMAL(6,5) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_level_id, class_code)
);

COMMENT ON TABLE public.pay_grade_classes IS 'Class system A-F for each career level with promotion multipliers';
COMMENT ON COLUMN public.pay_grade_classes.promotion_multiplier IS 'Cumulative promotion multiplier (10% per class)';

-- ============================================
-- 3. PAY GRADES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.pay_grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  career_level_id UUID NOT NULL REFERENCES public.career_levels(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.pay_grade_classes(id) ON DELETE CASCADE,
  years_of_service INTEGER NOT NULL CHECK (years_of_service BETWEEN 1 AND 20),
  grade_number INTEGER NOT NULL CHECK (grade_number BETWEEN 1 AND 9),
  base_salary DECIMAL(12,2) NOT NULL,
  target_bonus_pct DECIMAL(5,2),
  stretch_bonus_pct DECIMAL(5,2),
  total_comp_min DECIMAL(12,2),
  total_comp_max DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_level_id, class_id, years_of_service)
);

COMMENT ON TABLE public.pay_grades IS 'Complete pay grade lookup table with calculated salaries';
COMMENT ON COLUMN public.pay_grades.grade_number IS 'Grade 1-9 derived from years of service';
COMMENT ON COLUMN public.pay_grades.target_bonus_pct IS 'Target bonus percentage for executive levels';
COMMENT ON COLUMN public.pay_grades.stretch_bonus_pct IS 'Stretch/exceed goals bonus percentage';

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_pay_grades_career_level ON public.pay_grades(career_level_id);
CREATE INDEX IF NOT EXISTS idx_pay_grades_class ON public.pay_grades(class_id);
CREATE INDEX IF NOT EXISTS idx_pay_grades_years ON public.pay_grades(years_of_service);
CREATE INDEX IF NOT EXISTS idx_pay_grade_classes_career_level ON public.pay_grade_classes(career_level_id);

-- ============================================
-- 4. SEED CAREER LEVELS
-- ============================================
INSERT INTO public.career_levels (code, name, description, focus, anchor_salary, is_performance_based, sort_order)
VALUES 
  ('partner', 'Partner', 'The Employee - Entry to Senior Individual Contributor', 'Execution, Skill Acquisition, and Tenure', 70000.00, FALSE, 1),
  ('lead_partner', 'Lead Partner', 'The Manager - Team Leadership and Strategy', 'Leadership, Team Stability, and Strategy', 95330.00, FALSE, 2),
  ('senior_lead_partner', 'Senior Lead Partner', 'The Executive - Performance-Based Variable Pay', 'Profitability, Growth, and Company Health', 130000.00, TRUE, 3);

-- ============================================
-- 5. SEED PAY GRADE CLASSES - PARTNER
-- ============================================
INSERT INTO public.pay_grade_classes (career_level_id, class_code, class_name, class_description, class_order, promotion_multiplier)
SELECT 
  cl.id,
  v.class_code,
  v.class_name,
  v.class_description,
  v.class_order,
  v.promotion_multiplier
FROM public.career_levels cl
CROSS JOIN (VALUES
  ('A', 'Associate', 'Entry level partner', 1, 1.00000),
  ('B', 'Senior Associate', 'Experienced associate', 2, 1.10000),
  ('C', 'Specialist', 'Domain specialist', 3, 1.21000),
  ('D', 'Senior Specialist', 'Senior domain expert', 4, 1.33100),
  ('E', 'Principal', 'Principal contributor', 5, 1.46410),
  ('F', 'Distinguished', 'Distinguished partner', 6, 1.61051)
) AS v(class_code, class_name, class_description, class_order, promotion_multiplier)
WHERE cl.code = 'partner';

-- ============================================
-- 6. SEED PAY GRADE CLASSES - LEAD PARTNER
-- ============================================
INSERT INTO public.pay_grade_classes (career_level_id, class_code, class_name, class_description, class_order, promotion_multiplier)
SELECT 
  cl.id,
  v.class_code,
  v.class_name,
  v.class_description,
  v.class_order,
  v.promotion_multiplier
FROM public.career_levels cl
CROSS JOIN (VALUES
  ('A', 'Team Lead', 'Entry level leadership', 1, 1.00000),
  ('B', 'Supervisor', 'Team supervisor', 2, 1.10000),
  ('C', 'Manager', 'Department manager', 3, 1.21000),
  ('D', 'Senior Manager', 'Senior management', 4, 1.33100),
  ('E', 'Director', 'Directorship role', 5, 1.46410),
  ('F', 'Senior Director', 'Senior directorship', 6, 1.61051)
) AS v(class_code, class_name, class_description, class_order, promotion_multiplier)
WHERE cl.code = 'lead_partner';

-- ============================================
-- 7. SEED PAY GRADE CLASSES - SENIOR LEAD PARTNER
-- ============================================
INSERT INTO public.pay_grade_classes (career_level_id, class_code, class_name, class_description, class_order, promotion_multiplier)
SELECT 
  cl.id,
  v.class_code,
  v.class_name,
  v.class_description,
  v.class_order,
  v.promotion_multiplier
FROM public.career_levels cl
CROSS JOIN (VALUES
  ('A', 'VP Level', 'Vice President', 1, 1.00000),
  ('B', 'VP Level B', 'Senior VP tier', 2, 1.10000),
  ('C', 'VP Level C', 'Executive VP tier', 3, 1.21000),
  ('D', 'VP Level D', 'Senior Executive', 4, 1.33077),
  ('E', 'VP Level E', 'Chief Officer tier', 5, 1.46154),
  ('F', 'C-Level', 'C-Suite Executive', 6, 1.61538)
) AS v(class_code, class_name, class_description, class_order, promotion_multiplier)
WHERE cl.code = 'senior_lead_partner';

-- ============================================
-- 8. HELPER FUNCTION TO CALCULATE GRADE FROM YEARS
-- ============================================
CREATE OR REPLACE FUNCTION public.years_to_grade(years INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  -- Grade mapping: 1-2 yrs = Grade 1, 3-4 = Grade 2, ..., 17+ = Grade 9
  RETURN LEAST(9, GREATEST(1, CEIL(years::DECIMAL / 2)));
END;
$$;

-- ============================================
-- 9. HELPER FUNCTION TO CALCULATE LONGEVITY MULTIPLIER
-- ============================================
CREATE OR REPLACE FUNCTION public.longevity_multiplier(years INTEGER, increase_pct DECIMAL DEFAULT 3.0, period_years INTEGER DEFAULT 2)
RETURNS DECIMAL
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  -- 3% increase every 2 years
  RETURN POWER(1 + (increase_pct / 100), FLOOR((years - 1)::DECIMAL / period_years));
END;
$$;

-- ============================================
-- 10. SEED PAY GRADES - PARTNER (Years 1-20, Class A-F)
-- ============================================
INSERT INTO public.pay_grades (career_level_id, class_id, years_of_service, grade_number, base_salary)
SELECT
  cl.id AS career_level_id,
  pc.id AS class_id,
  y.year AS years_of_service,
  public.years_to_grade(y.year) AS grade_number,
  ROUND(
    70000.00 * pc.promotion_multiplier * public.longevity_multiplier(y.year), 
    2
  ) AS base_salary
FROM public.career_levels cl
JOIN public.pay_grade_classes pc ON pc.career_level_id = cl.id
CROSS JOIN generate_series(1, 20) AS y(year)
WHERE cl.code = 'partner';

-- ============================================
-- 11. SEED PAY GRADES - LEAD PARTNER (Years 1-20, Class A-F)
-- ============================================
INSERT INTO public.pay_grades (career_level_id, class_id, years_of_service, grade_number, base_salary)
SELECT
  cl.id AS career_level_id,
  pc.id AS class_id,
  y.year AS years_of_service,
  public.years_to_grade(y.year) AS grade_number,
  ROUND(
    95330.00 * pc.promotion_multiplier * public.longevity_multiplier(y.year), 
    2
  ) AS base_salary
FROM public.career_levels cl
JOIN public.pay_grade_classes pc ON pc.career_level_id = cl.id
CROSS JOIN generate_series(1, 20) AS y(year)
WHERE cl.code = 'lead_partner';

-- ============================================
-- 12. SEED PAY GRADES - SENIOR LEAD PARTNER (Performance-Based)
-- ============================================
-- Senior Lead Partner uses base + bonus structure, no time-based grades
INSERT INTO public.pay_grades (
  career_level_id, class_id, years_of_service, grade_number, 
  base_salary, target_bonus_pct, stretch_bonus_pct, total_comp_min, total_comp_max
)
SELECT
  cl.id AS career_level_id,
  pc.id AS class_id,
  y.year AS years_of_service,
  1 AS grade_number, -- Executives don't use time-based grades
  v.base_salary,
  v.target_bonus_pct,
  v.stretch_bonus_pct,
  ROUND(v.base_salary + (v.base_salary * v.target_bonus_pct / 100), 2) AS total_comp_min,
  ROUND(v.base_salary + (v.base_salary * v.target_bonus_pct / 100) + (v.base_salary * v.stretch_bonus_pct / 100), 2) AS total_comp_max
FROM public.career_levels cl
JOIN public.pay_grade_classes pc ON pc.career_level_id = cl.id
CROSS JOIN generate_series(1, 20) AS y(year)
JOIN (VALUES
  ('A', 130000.00, 30.00, 45.00),
  ('B', 143000.00, 30.00, 45.00),
  ('C', 157300.00, 35.00, 52.50),
  ('D', 173000.00, 35.00, 52.50),
  ('E', 190000.00, 40.00, 60.00),
  ('F', 210000.00, 40.00, 60.00)
) AS v(class_code, base_salary, target_bonus_pct, stretch_bonus_pct)
ON pc.class_code = v.class_code
WHERE cl.code = 'senior_lead_partner';

-- ============================================
-- 13. SALARY LOOKUP FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.get_salary_for_position(
  p_career_level TEXT,
  p_class_code CHAR(1),
  p_years INTEGER
)
RETURNS TABLE(
  base_salary DECIMAL,
  target_bonus_pct DECIMAL,
  stretch_bonus_pct DECIMAL,
  total_comp_min DECIMAL,
  total_comp_max DECIMAL
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pg.base_salary,
    pg.target_bonus_pct,
    pg.stretch_bonus_pct,
    pg.total_comp_min,
    pg.total_comp_max
  FROM public.pay_grades pg
  JOIN public.career_levels cl ON cl.id = pg.career_level_id
  JOIN public.pay_grade_classes pc ON pc.id = pg.class_id
  WHERE cl.code = p_career_level
    AND pc.class_code = p_class_code
    AND pg.years_of_service = p_years;
END;
$$;

COMMENT ON FUNCTION public.get_salary_for_position IS 'Look up salary for a given career level, class, and years of service';

-- ============================================
-- 14. RLS POLICIES
-- ============================================
ALTER TABLE public.career_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pay_grade_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pay_grades ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users (HR/Admin can view pay scales)
CREATE POLICY "Allow read access to career levels" ON public.career_levels
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to pay grade classes" ON public.pay_grade_classes
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to pay grades" ON public.pay_grades
  FOR SELECT USING (true);

-- Only service role can modify
CREATE POLICY "Service role manages career levels" ON public.career_levels
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages pay grade classes" ON public.pay_grade_classes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages pay grades" ON public.pay_grades
  FOR ALL USING (auth.role() = 'service_role');
