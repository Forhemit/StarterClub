-- Migration: Add nonprofit_type column to legal_entities
-- This stores the 501(c) subcategory for non-profit organizations

ALTER TABLE legal_entities ADD COLUMN IF NOT EXISTS nonprofit_type TEXT;
