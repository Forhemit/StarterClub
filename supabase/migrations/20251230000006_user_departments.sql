-- Create user_departments junction table
CREATE TABLE IF NOT EXISTS public.user_departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique pair of user and department
  CONSTRAINT user_departments_user_id_department_id_key UNIQUE (user_id, department_id)
);

-- Enable RLS
ALTER TABLE public.user_departments ENABLE ROW LEVEL SECURITY;

-- Policies
-- View: Users can view their own department associations
CREATE POLICY "Users can view own departments" ON public.user_departments
  FOR SELECT
  USING (user_id = auth.uid()::text OR auth.role() = 'service_role');

-- View: Service Role can view all
  
-- Insert/Update/Delete: Service Role only (managed via Server Actions)
CREATE POLICY "Service Role full access on user_departments" ON public.user_departments
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_departments_user_id ON public.user_departments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_departments_department_id ON public.user_departments(department_id);
