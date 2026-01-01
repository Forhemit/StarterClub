-- Migration: Add missing columns, constraints, and indexes for job_postings
-- This migration brings the database schema in sync with the frontend JobPostingData interface

-- 1. Add missing core columns
ALTER TABLE job_postings
ADD COLUMN IF NOT EXISTS remote_type text,
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS experience text,
ADD COLUMN IF NOT EXISTS salary_min integer,
ADD COLUMN IF NOT EXISTS salary_max integer,
ADD COLUMN IF NOT EXISTS salary_currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS salary_period text DEFAULT 'yearly',
ADD COLUMN IF NOT EXISTS schedule text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS responsibilities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS qualifications text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS benefits text[] DEFAULT '{}';

-- 2. Add check constraints for data integrity
ALTER TABLE job_postings
DROP CONSTRAINT IF EXISTS job_postings_remote_type_check;

ALTER TABLE job_postings
ADD CONSTRAINT job_postings_remote_type_check 
CHECK (remote_type IS NULL OR remote_type IN ('On-site', 'Hybrid', 'Remote'));

ALTER TABLE job_postings
DROP CONSTRAINT IF EXISTS job_postings_salary_check;

ALTER TABLE job_postings
ADD CONSTRAINT job_postings_salary_check 
CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max);

-- 3. Add indexes for performance
-- Index on org_id for RLS and filtering
CREATE INDEX IF NOT EXISTS idx_job_postings_org_id ON job_postings(org_id);

-- Index on status for filtering published/draft jobs
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);

-- Index on created_at for ordering (most common sort)
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at DESC);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_job_postings_org_status ON job_postings(org_id, status);

-- Index on department for filtering
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department);

-- Index on type for filtering
CREATE INDEX IF NOT EXISTS idx_job_postings_type ON job_postings(type);

-- 4. Add helpful comments
COMMENT ON COLUMN job_postings.remote_type IS 'Workplace type: On-site, Hybrid, or Remote';
COMMENT ON COLUMN job_postings.education IS 'Required education level';
COMMENT ON COLUMN job_postings.experience IS 'Required experience level';
COMMENT ON COLUMN job_postings.salary_min IS 'Minimum salary (integer)';
COMMENT ON COLUMN job_postings.salary_max IS 'Maximum salary (integer)';
COMMENT ON COLUMN job_postings.salary_currency IS 'Currency code (e.g., USD, EUR)';
COMMENT ON COLUMN job_postings.salary_period IS 'Pay period: yearly, monthly, hourly';
COMMENT ON COLUMN job_postings.schedule IS 'Array of schedule options (e.g., Monday to Friday)';
COMMENT ON COLUMN job_postings.responsibilities IS 'Array of job responsibilities';
COMMENT ON COLUMN job_postings.qualifications IS 'Array of required qualifications';
COMMENT ON COLUMN job_postings.benefits IS 'Array of benefits and perks';

-- 5. Update updated_at trigger (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_job_postings_updated_at ON job_postings;

CREATE TRIGGER update_job_postings_updated_at
    BEFORE UPDATE ON job_postings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
