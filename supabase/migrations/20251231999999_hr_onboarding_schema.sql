-- Create table for tracking onboarding progress
CREATE TABLE IF NOT EXISTS public.hr_onboarding_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_step integer DEFAULT 0,
    completed_steps jsonb DEFAULT '[]'::jsonb,
    total_points integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(employee_id)
);

-- Enable RLS for onboarding progress
ALTER TABLE public.hr_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Create table for equipment requests
CREATE TABLE IF NOT EXISTS public.hr_equipment_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    equipment_type text NOT NULL,
    specifications jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'provisioned', 'rejected')),
    requested_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS for equipment requests
ALTER TABLE public.hr_equipment_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding progress
DO $$ BEGIN
    -- Select policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hr_onboarding_progress' AND policyname = 'Users can view their own onboarding progress'
    ) THEN
        CREATE POLICY "Users can view their own onboarding progress" 
        ON public.hr_onboarding_progress FOR SELECT 
        USING (auth.uid()::text = employee_id);
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hr_onboarding_progress' AND policyname = 'Users can update their own onboarding progress'
    ) THEN
        CREATE POLICY "Users can update their own onboarding progress" 
        ON public.hr_onboarding_progress FOR UPDATE 
        USING (auth.uid()::text = employee_id);
    END IF;
    
    -- Insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hr_onboarding_progress' AND policyname = 'Users can insert their own onboarding progress'
    ) THEN
        CREATE POLICY "Users can insert their own onboarding progress" 
        ON public.hr_onboarding_progress FOR INSERT 
        WITH CHECK (auth.uid()::text = employee_id);
    END IF;

    -- Admin policies (assuming admin roles exist, otherwise base RLS is safer for now)
    -- For now, we will stick to owner-only or add admin logic later if roles table is standardized
END $$;

-- Create policies for equipment requests
DO $$ BEGIN
    -- Select policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hr_equipment_requests' AND policyname = 'Users can view their own equipment requests'
    ) THEN
        CREATE POLICY "Users can view their own equipment requests" 
        ON public.hr_equipment_requests FOR SELECT 
        USING (auth.uid()::text = employee_id);
    END IF;

    -- Insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hr_equipment_requests' AND policyname = 'Users can create equipment requests'
    ) THEN
        CREATE POLICY "Users can create equipment requests" 
        ON public.hr_equipment_requests FOR INSERT 
        WITH CHECK (auth.uid()::text = employee_id);
    END IF;
    
    -- Update policy (e.g. to cancel?)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hr_equipment_requests' AND policyname = 'Users can update pending requests'
    ) THEN
        CREATE POLICY "Users can update pending requests" 
        ON public.hr_equipment_requests FOR UPDATE 
        USING (auth.uid()::text = employee_id AND status = 'pending');
    END IF;

END $$;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_hr_onboarding_progress_updated_at ON public.hr_onboarding_progress;
CREATE TRIGGER update_hr_onboarding_progress_updated_at
    BEFORE UPDATE ON public.hr_onboarding_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hr_equipment_requests_updated_at ON public.hr_equipment_requests;
CREATE TRIGGER update_hr_equipment_requests_updated_at
    BEFORE UPDATE ON public.hr_equipment_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
