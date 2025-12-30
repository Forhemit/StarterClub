-- Migration: Add company_name and dba_name columns to legal_entities
-- These are the foundational fields for the Legal Vault

ALTER TABLE legal_entities ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE legal_entities ADD COLUMN IF NOT EXISTS dba_name TEXT;
