-- Migration: Fix timestamp defaults for proper UTC storage
-- Description: Corrects the default value for installed_at to avoid double timezone conversion
-- Previous default: timezone('utc'::text, now()) -> converting to naive timestamp then back to TZ
-- New default: now() -> correct timestamptz

DO $$
BEGIN
  -- 1. Fix user_installed_modules
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_installed_modules' 
    AND column_name = 'installed_at'
  ) THEN
    ALTER TABLE public.user_installed_modules 
    ALTER COLUMN installed_at SET DEFAULT now();
  END IF;

END $$;
