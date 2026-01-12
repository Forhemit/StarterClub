-- Migration: 20260112100000_add_onboarding_intent_columns.sql
-- Description: Add columns for tracking user intent during onboarding

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_intent TEXT,
ADD COLUMN IF NOT EXISTS secondary_interest TEXT,
ADD COLUMN IF NOT EXISTS org_affiliation TEXT;

-- Add index for potential routing performance
CREATE INDEX IF NOT EXISTS idx_profiles_primary_intent ON public.profiles(primary_intent);
