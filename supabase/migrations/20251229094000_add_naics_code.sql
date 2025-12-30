-- Migration: Add naics_code column to legal_entities
-- Separating NAICS code from business purpose

ALTER TABLE legal_entities ADD COLUMN IF NOT EXISTS naics_code TEXT;
