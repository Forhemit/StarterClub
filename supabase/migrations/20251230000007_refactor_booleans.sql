-- Refactor profiles: replace boolean with timestamp
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Migrate existing data
UPDATE public.profiles 
SET onboarding_completed_at = NOW() 
WHERE onboarding_completed = TRUE;

-- Drop old column
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS onboarding_completed;

-- Refactor user_departments: add status and history tracking
ALTER TABLE public.user_departments 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS left_at TIMESTAMP WITH TIME ZONE;

-- Remove the unique constraint that prevents history
ALTER TABLE public.user_departments 
DROP CONSTRAINT IF EXISTS user_departments_user_id_department_id_key;

-- Add a partial index to ensure only one ACTIVE assignment per department
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_departments_active_assignment 
ON public.user_departments (user_id, department_id) 
WHERE status = 'active';

-- Update RLS to allow viewing inactive (history) but maybe filter in UI
-- Existing policy "Users can view own departments" covers all rows for the user, which is correct for history.
