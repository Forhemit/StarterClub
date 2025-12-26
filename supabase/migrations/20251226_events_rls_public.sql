-- Allow public read access to events
DROP POLICY IF EXISTS "Events are viewable by authenticated users" ON events;
DROP POLICY IF EXISTS "Events are viewable by all company employees" ON events;

CREATE POLICY "Events are viewable by everyone"
ON events FOR SELECT
USING (true);

-- Keep creation restricted to authenticated users (employees)
-- existing policy: "Authenticated users can create events"

-- Keep update restricted to creators/admins
-- existing policy: "Users can update their own events"
-- existing policy: "Admins can update any event"
