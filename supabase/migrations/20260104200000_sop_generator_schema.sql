-- SOP Generator Module Schema
-- Position Master SOP Creation & Management System

-- 1. Main Position SOP Table
CREATE TABLE IF NOT EXISTS position_sops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    sop_id TEXT UNIQUE, -- Format: POS-DEPT-001 (auto-generated)
    
    -- Basic Info
    title TEXT NOT NULL,
    department TEXT,
    position_type TEXT CHECK (position_type IN ('full-time', 'part-time', 'contract')) DEFAULT 'full-time',
    flsa_status TEXT CHECK (flsa_status IN ('exempt', 'non-exempt')) DEFAULT 'non-exempt',
    work_arrangement TEXT CHECK (work_arrangement IN ('onsite', 'hybrid', 'remote')) DEFAULT 'onsite',
    location TEXT,
    reports_to TEXT,
    
    -- Position Overview
    mission_statement TEXT,
    impact_statement TEXT,
    
    -- Review & Version Control
    version TEXT DEFAULT 'v1.0',
    effective_date DATE DEFAULT CURRENT_DATE,
    review_frequency TEXT CHECK (review_frequency IN ('quarterly', 'biannual', 'annual', 'biennial')) DEFAULT 'annual',
    next_review_date DATE,
    status TEXT CHECK (status IN ('draft', 'active', 'pending_review', 'expired', 'archived')) DEFAULT 'draft',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ
);

-- 2. Position Responsibilities Table
CREATE TABLE IF NOT EXISTS position_responsibilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
    responsibility_area TEXT NOT NULL,
    key_activities JSONB DEFAULT '[]'::jsonb, -- Array of activity strings
    time_allocation INTEGER CHECK (time_allocation >= 0 AND time_allocation <= 100) DEFAULT 0,
    priority INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Authority Matrix Table
CREATE TABLE IF NOT EXISTS position_authorities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
    decision_area TEXT NOT NULL,
    authority_level TEXT NOT NULL,
    approval_required TEXT,
    escalation_path TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Performance Metrics (KPIs) Table
CREATE TABLE IF NOT EXISTS position_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    target TEXT NOT NULL,
    measurement_frequency TEXT CHECK (measurement_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually')) DEFAULT 'monthly',
    metric_weight INTEGER CHECK (metric_weight >= 0 AND metric_weight <= 100) DEFAULT 0,
    data_source TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Position Requirements Table
CREATE TABLE IF NOT EXISTS position_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
    requirement_type TEXT CHECK (requirement_type IN ('education', 'experience', 'certification', 'technical', 'soft_skill', 'physical')) DEFAULT 'technical',
    description TEXT NOT NULL,
    is_minimum BOOLEAN DEFAULT true,
    is_preferred BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SOP Review History Table
CREATE TABLE IF NOT EXISTS sop_review_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
    review_date DATE NOT NULL,
    reviewed_by TEXT, -- Clerk user ID
    action_taken TEXT CHECK (action_taken IN ('no_change', 'minor_update', 'major_revision')) DEFAULT 'no_change',
    notes TEXT,
    next_review_date DATE,
    version_result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE position_sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_review_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for position_sops
DROP POLICY IF EXISTS "Users can view their own SOPs" ON position_sops;
CREATE POLICY "Users can view their own SOPs"
ON position_sops FOR SELECT
TO authenticated
USING (user_id = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can insert their own SOPs" ON position_sops;
CREATE POLICY "Users can insert their own SOPs"
ON position_sops FOR INSERT
TO authenticated
WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can update their own SOPs" ON position_sops;
CREATE POLICY "Users can update their own SOPs"
ON position_sops FOR UPDATE
TO authenticated
USING (user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can delete their own SOPs" ON position_sops;
CREATE POLICY "Users can delete their own SOPs"
ON position_sops FOR DELETE
TO authenticated
USING (user_id = (auth.jwt() ->> 'sub'));

-- RLS Policies for position_responsibilities (via parent SOP)
DROP POLICY IF EXISTS "Users can manage responsibilities for their SOPs" ON position_responsibilities;
CREATE POLICY "Users can manage responsibilities for their SOPs"
ON position_responsibilities FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_responsibilities.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_responsibilities.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
);

-- RLS Policies for position_authorities (via parent SOP)
DROP POLICY IF EXISTS "Users can manage authorities for their SOPs" ON position_authorities;
CREATE POLICY "Users can manage authorities for their SOPs"
ON position_authorities FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_authorities.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_authorities.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
);

-- RLS Policies for position_metrics (via parent SOP)
DROP POLICY IF EXISTS "Users can manage metrics for their SOPs" ON position_metrics;
CREATE POLICY "Users can manage metrics for their SOPs"
ON position_metrics FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_metrics.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_metrics.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
);

-- RLS Policies for position_requirements (via parent SOP)
DROP POLICY IF EXISTS "Users can manage requirements for their SOPs" ON position_requirements;
CREATE POLICY "Users can manage requirements for their SOPs"
ON position_requirements FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_requirements.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_requirements.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
);

-- RLS Policies for sop_review_history (via parent SOP)
DROP POLICY IF EXISTS "Users can manage review history for their SOPs" ON sop_review_history;
CREATE POLICY "Users can manage review history for their SOPs"
ON sop_review_history FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = sop_review_history.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = sop_review_history.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_position_sops_user_id ON position_sops(user_id);
CREATE INDEX IF NOT EXISTS idx_position_sops_status ON position_sops(status);
CREATE INDEX IF NOT EXISTS idx_position_responsibilities_sop_id ON position_responsibilities(position_sop_id);
CREATE INDEX IF NOT EXISTS idx_position_authorities_sop_id ON position_authorities(position_sop_id);
CREATE INDEX IF NOT EXISTS idx_position_metrics_sop_id ON position_metrics(position_sop_id);
CREATE INDEX IF NOT EXISTS idx_position_requirements_sop_id ON position_requirements(position_sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_review_history_sop_id ON sop_review_history(position_sop_id);

-- Updated_at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for position_sops
DROP TRIGGER IF EXISTS update_position_sops_updated_at ON position_sops;
CREATE TRIGGER update_position_sops_updated_at
    BEFORE UPDATE ON position_sops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
