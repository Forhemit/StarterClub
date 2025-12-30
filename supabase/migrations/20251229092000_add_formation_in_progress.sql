-- Migration: Add formation_in_progress column to legal_entities
-- This indicates if the entity formation is still in progress

ALTER TABLE legal_entities ADD COLUMN IF NOT EXISTS formation_in_progress BOOLEAN DEFAULT FALSE;
