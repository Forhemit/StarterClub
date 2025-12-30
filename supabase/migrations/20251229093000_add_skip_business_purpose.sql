-- Migration: Add skip_business_purpose column to legal_entities
-- This indicates if the user chose to skip providing a business purpose

ALTER TABLE legal_entities ADD COLUMN IF NOT EXISTS skip_business_purpose BOOLEAN DEFAULT FALSE;
