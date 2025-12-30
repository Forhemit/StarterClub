-- Enhance legal_documents table
ALTER TABLE legal_documents 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS expiration_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create document_audit_logs table
CREATE TABLE IF NOT EXISTS document_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
    document_id UUID REFERENCES legal_documents(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('UPLOAD', 'UPDATE', 'DELETE')),
    performed_by TEXT, -- potentially user ID or name
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE document_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for document_audit_logs
-- Allow users to view logs for entities they have access to (simplified for now: authenticated users)
DROP POLICY IF EXISTS "Users can view audit logs" ON document_audit_logs;
CREATE POLICY "Users can view audit logs" ON document_audit_logs
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Allow service role (or users via fetch) to insert logs
DROP POLICY IF EXISTS "Users can insert audit logs" ON document_audit_logs;
CREATE POLICY "Users can insert audit logs" ON document_audit_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
