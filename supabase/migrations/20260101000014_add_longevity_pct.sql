-- Migration: 20260101000014_add_longevity_pct.sql
-- Description: Add longevity increase percentage field to career levels

-- Add longevity_increase_pct column to career_levels
ALTER TABLE public.career_levels
ADD COLUMN IF NOT EXISTS longevity_increase_pct DECIMAL(5,2) DEFAULT 3.00;

COMMENT ON COLUMN public.career_levels.longevity_increase_pct IS 'Percentage increase for longevity (every 2 years of service)';

-- Add longevity_period_years column to career_levels
ALTER TABLE public.career_levels
ADD COLUMN IF NOT EXISTS longevity_period_years INTEGER DEFAULT 2;

COMMENT ON COLUMN public.career_levels.longevity_period_years IS 'Number of years between longevity increases';

-- Update default values for existing rows
UPDATE public.career_levels
SET 
    longevity_increase_pct = 3.00,
    longevity_period_years = 2
WHERE longevity_increase_pct IS NULL;

-- For executives, longevity doesn't apply (set to 0)
UPDATE public.career_levels
SET longevity_increase_pct = 0
WHERE is_performance_based = true;
