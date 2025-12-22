-- Client Progress Tracking Module (Optional Add-on)

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_business_id UUID NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Engagements Table
CREATE TABLE IF NOT EXISTS engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    program_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    session_date TIMESTAMPTZ DEFAULT NOW(),
    session_type TEXT, -- 'video', 'phone', 'in-person'
    goals_set JSONB DEFAULT '[]'::jsonb,
    outcomes JSONB DEFAULT '{}'::jsonb,
    coach_notes TEXT,
    client_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Milestones Table
CREATE TABLE IF NOT EXISTS client_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    achieved_date DATE,
    status TEXT DEFAULT 'pending', -- 'pending', 'achieved', 'delayed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Resources Table
CREATE TABLE IF NOT EXISTS client_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_resources ENABLE ROW LEVEL SECURITY;

-- 7. Policies (Business-Level Privacy)
CREATE POLICY "Users can manage clients for their businesses" ON clients
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM user_businesses WHERE id = user_business_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can manage engagements via clients" ON engagements
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM clients c
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE c.id = client_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage sessions via engagements" ON sessions
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM engagements e
            JOIN clients c ON c.id = e.client_id
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE e.id = engagement_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage milestones via engagements" ON client_milestones
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM engagements e
            JOIN clients c ON c.id = e.client_id
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE e.id = engagement_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage resources via clients" ON client_resources
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM clients c
            JOIN user_businesses b ON b.id = c.user_business_id
            WHERE c.id = client_id AND b.user_id = auth.uid()
        )
    );
