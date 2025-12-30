-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT,
  role TEXT,
  start_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON employees
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Add columns to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS tenure_days INTEGER DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS last_review_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS next_review_date DATE;

-- Create employee_lifecycle_events table
DROP TABLE IF EXISTS employee_lifecycle_events;
CREATE TABLE employee_lifecycle_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('hire', 'promotion', 'transfer', 'leave_start', 'leave_end', 'exit')),
  event_date DATE NOT NULL,
  details JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for employee_lifecycle_events
ALTER TABLE employee_lifecycle_events ENABLE ROW LEVEL SECURITY;

-- Create policy for employee_lifecycle_events
CREATE POLICY "Enable all for authenticated users" ON employee_lifecycle_events
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- Create employee_tags table
DROP TABLE IF EXISTS employee_tags;
CREATE TABLE employee_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  tag_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for employee_tags
ALTER TABLE employee_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON employee_tags
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- Create saved_employee_filters table
DROP TABLE IF EXISTS saved_employee_filters;
CREATE TABLE saved_employee_filters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  filter_name TEXT NOT NULL,
  filter_config JSONB NOT NULL,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for saved_employee_filters
ALTER TABLE saved_employee_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own filters" ON saved_employee_filters
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
