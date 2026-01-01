-- Migration: Add partner_type (career_level) to job_postings
-- Description: Links job postings to career levels for Partner Type selection

-- Add partner_type column (references career_levels)
ALTER TABLE job_postings
ADD COLUMN IF NOT EXISTS partner_type UUID REFERENCES public.career_levels(id);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_job_postings_partner_type ON job_postings(partner_type);

-- Add comment
COMMENT ON COLUMN job_postings.partner_type IS 'Partner type/career level for this position (Partner, Lead Partner, Senior Lead Partner)';
