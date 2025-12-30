
-- 1. Reset user_id column to ensure it is TEXT (Clerk ID compatible)
-- We drop it first to avoid type casting issues if it was created as UUID previously.
-- WARNING: This clears ownership data, but acceptable for this fix phase.
ALTER TABLE legal_entities DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE legal_entities ADD COLUMN user_id TEXT;

-- 2. Add Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_legal_entities_user_id ON legal_entities(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_documents_entity_id ON legal_documents(entity_id);
CREATE INDEX IF NOT EXISTS idx_legal_requirements_entity_id ON legal_requirements(entity_id);
CREATE INDEX IF NOT EXISTS idx_document_audit_logs_entity_id ON document_audit_logs(entity_id);

-- 3. Fix RLS - Secure Access to Owner Only

-- legal_entities
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON legal_entities;
DROP POLICY IF EXISTS "Users can view own legal entities" ON legal_entities;
DROP POLICY IF EXISTS "Users can insert own legal entities" ON legal_entities;
DROP POLICY IF EXISTS "Users can update own legal entities" ON legal_entities;
DROP POLICY IF EXISTS "Users can delete own legal entities" ON legal_entities;

CREATE POLICY "Users can view own legal entities" 
ON legal_entities FOR SELECT 
TO authenticated 
USING (user_id = auth.uid()::text); 
-- Note: auth.uid() in Supabase/JWT is usually the 'sub' claim. 
-- If using Clerk with Supabase custom auth, ensure the token 'sub' matches the Clerk User ID.

CREATE POLICY "Users can insert own legal entities" 
ON legal_entities FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own legal entities" 
ON legal_entities FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own legal entities" 
ON legal_entities FOR DELETE 
TO authenticated 
USING (user_id = auth.uid()::text);

-- legal_documents
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON legal_documents;
DROP POLICY IF EXISTS "Users can view own entity documents" ON legal_documents;
DROP POLICY IF EXISTS "Users can insert own entity documents" ON legal_documents;
DROP POLICY IF EXISTS "Users can update own entity documents" ON legal_documents;
DROP POLICY IF EXISTS "Users can delete own entity documents" ON legal_documents;

CREATE POLICY "Users can view own entity documents" 
ON legal_documents FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM legal_entities le 
        WHERE le.id = legal_documents.entity_id 
        AND le.user_id = auth.uid()::text
    )
);

CREATE POLICY "Users can insert own entity documents" 
ON legal_documents FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM legal_entities le 
        WHERE le.id = legal_documents.entity_id 
        AND le.user_id = auth.uid()::text
    )
);

CREATE POLICY "Users can update own entity documents" 
ON legal_documents FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM legal_entities le 
        WHERE le.id = legal_documents.entity_id 
        AND le.user_id = auth.uid()::text
    )
);

CREATE POLICY "Users can delete own entity documents" 
ON legal_documents FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM legal_entities le 
        WHERE le.id = legal_documents.entity_id 
        AND le.user_id = auth.uid()::text
    )
);

-- legal_requirements
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON legal_requirements;
DROP POLICY IF EXISTS "Users can view own entity requirements" ON legal_requirements;
DROP POLICY IF EXISTS "Users can update own entity requirements" ON legal_requirements;

CREATE POLICY "Users can view own entity requirements" 
ON legal_requirements FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM legal_entities le 
        WHERE le.id = legal_requirements.entity_id 
        AND le.user_id = auth.uid()::text
    )
);

CREATE POLICY "Users can update own entity requirements" 
ON legal_requirements FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM legal_entities le 
        WHERE le.id = legal_requirements.entity_id 
        AND le.user_id = auth.uid()::text
    )
);
