-- Migration: 20260101000013_add_home_run_bonus.sql
-- Description: Add home run bonus field and update executive pay structure

-- Add home_run_bonus_pct column to pay_grades
ALTER TABLE public.pay_grades
ADD COLUMN IF NOT EXISTS home_run_bonus_pct DECIMAL(5,2);

COMMENT ON COLUMN public.pay_grades.home_run_bonus_pct IS 'Home run bonus percentage for exceptional performance (executives only)';

-- Update existing Senior Lead Partner grades with home run bonus (1.5x stretch)
UPDATE public.pay_grades pg
SET home_run_bonus_pct = pg.stretch_bonus_pct * 1.5
WHERE pg.career_level_id IN (
  SELECT id FROM public.career_levels WHERE code = 'senior_lead_partner'
);

-- Add promotion_increase_pct column to career_levels for executives
ALTER TABLE public.career_levels
ADD COLUMN IF NOT EXISTS promotion_increase_pct DECIMAL(5,2) DEFAULT 10.00;

COMMENT ON COLUMN public.career_levels.promotion_increase_pct IS 'Percentage increase per promotion/class level';
