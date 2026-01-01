-- Migration to add missing columns to leadership_role_profiles
-- Addresses user feedback for refinements to the module

ALTER TABLE leadership_role_profiles
ADD COLUMN IF NOT EXISTS alternate_backup TEXT,
ADD COLUMN IF NOT EXISTS knowledge_context TEXT,
ADD COLUMN IF NOT EXISTS upstream_cadence TEXT,
ADD COLUMN IF NOT EXISTS upstream_focus TEXT;
