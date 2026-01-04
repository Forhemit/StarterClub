-- SOP Generator Tools Table Migration
-- Add position_tools table for tracking software and systems used by positions

CREATE TABLE IF NOT EXISTS position_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL,
    tool_category TEXT CHECK (tool_category IN ('communication', 'productivity', 'development', 'design', 'analytics', 'crm', 'hr', 'finance', 'other')) DEFAULT 'other',
    access_level TEXT CHECK (access_level IN ('view', 'edit', 'admin')) DEFAULT 'edit',
    is_required BOOLEAN DEFAULT true,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE position_tools ENABLE ROW LEVEL SECURITY;

-- RLS Policy for position_tools (via parent SOP)
DROP POLICY IF EXISTS "Users can manage tools for their SOPs" ON position_tools;
CREATE POLICY "Users can manage tools for their SOPs"
ON position_tools FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_tools.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM position_sops
        WHERE position_sops.id = position_tools.position_sop_id
        AND position_sops.user_id = (auth.jwt() ->> 'sub')
    )
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_position_tools_sop_id ON position_tools(position_sop_id);
