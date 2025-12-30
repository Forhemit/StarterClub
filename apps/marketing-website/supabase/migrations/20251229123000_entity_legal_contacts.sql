-- Entity Legal Contacts Table (for Registered Agent, Attorneys, etc.)
CREATE TABLE IF NOT EXISTS entity_legal_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('registered_agent', 'attorney', 'accountant', 'other')),
    name TEXT NOT NULL,
    attorney_type TEXT, -- 'Corporate', 'Tax', 'IP', 'Employment', 'Litigation', 'Real Estate', 'General'
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE entity_legal_contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON entity_legal_contacts;
CREATE POLICY "Enable all access for authenticated users" 
ON entity_legal_contacts FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_entity_legal_contacts_entity_id ON entity_legal_contacts(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_legal_contacts_role ON entity_legal_contacts(role);
