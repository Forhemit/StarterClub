-- Security Fixes Migration
-- 1. Enable RLS on event_attendees (was public without RLS)
-- 2. Fix insecure reference to user_metadata in events policy

-- =============================================================================
-- 1. event_attendees RLS
-- =============================================================================
ALTER TABLE IF EXISTS event_attendees ENABLE ROW LEVEL SECURITY;

-- View: Authenticated users can see who is attending events
DROP POLICY IF EXISTS "Authenticated users can view attendees" ON event_attendees;
CREATE POLICY "Authenticated users can view attendees"
ON event_attendees FOR SELECT
TO authenticated
USING (true);

-- Insert: Users can RSVP (create their own attendance record)
DROP POLICY IF EXISTS "Users can join events" ON event_attendees;
CREATE POLICY "Users can join events"
ON event_attendees FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Update: Users can update their own RSVP status
DROP POLICY IF EXISTS "Users can update own rsvp" ON event_attendees;
CREATE POLICY "Users can update own rsvp"
ON event_attendees FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Delete: Users can leave events (delete their own row)
DROP POLICY IF EXISTS "Users can leave events" ON event_attendees;
CREATE POLICY "Users can leave events"
ON event_attendees FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- =============================================================================
-- 2. Fix Insecure Policy on events
-- Remove user_metadata check from the consolidated update policy
-- =============================================================================

DROP POLICY IF EXISTS "Users and Admins can update events" ON events;

CREATE POLICY "Users and Admins can update events" ON events
    FOR UPDATE USING (
        created_by = (SELECT auth.uid()) -- Owner
        OR 
        (
            -- ADMIN OVERRIDE
            -- SECURE: Only trust app_metadata for admin roles.
            -- INSECURE: user_metadata was removed as it is user-editable.
            ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin') 
        )
    );
