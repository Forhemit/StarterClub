CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location VARCHAR(500),
  event_type VARCHAR(100), -- meeting, workshop, social, etc.
  created_by UUID REFERENCES auth.users(id),
  company_id UUID, -- Removed REFERENCES companies(id) as table might not exist
  status VARCHAR(50) DEFAULT 'scheduled',
  max_attendees INTEGER,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB, -- for recurring events
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_company ON events(company_id);

CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rsvp_status VARCHAR(20) DEFAULT 'pending',
  attended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table policies
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;

-- Everyone can read events
DROP POLICY IF EXISTS "Events are viewable by all company employees" ON events;
-- Note: 'Events are viewable by everyone' is handled in 20251226_events_rls_public.sql
-- We are keeping this migration focused on schema but keeping original intent if logical

-- Revised Policy for View - handling collision with 20251226_events_rls_public.sql
-- If that other file runs first, this might conflict if names are identical.
-- 20251226_events_rls_public.sql creates "Events are viewable by everyone" (idempotently now).
-- This file tries "Events are viewable by authenticated users".
DROP POLICY IF EXISTS "Events are viewable by authenticated users" ON events;
CREATE POLICY "Events are viewable by authenticated users"
ON events FOR SELECT
USING (auth.role() = 'authenticated');

-- Employees can create events
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
CREATE POLICY "Authenticated users can create events"
ON events FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own events
DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events"
ON events FOR UPDATE
USING (created_by = auth.uid());

-- Admins can update any event
DROP POLICY IF EXISTS "Admins can update any event" ON events;
CREATE POLICY "Admins can update any event"
ON events FOR UPDATE
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin') 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);
