
-- 0. Ensure table exists (Missing from previous migration)
CREATE TABLE IF NOT EXISTS entity_addresses (
    id uuid primary key default gen_random_uuid(),
    entity_id uuid references legal_entities(id) on delete cascade,
    address_type text,
    line1 text,
    line2 text,
    city text,
    state text,
    zip text,
    country text default 'US',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 1. Secure entity_addresses table
-- Add user_id column (Text) to match Clerk ID pattern
ALTER TABLE entity_addresses 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 2. Add Indexes
CREATE INDEX IF NOT EXISTS idx_entity_addresses_user_id ON entity_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_entity_addresses_entity_id ON entity_addresses(entity_id);

-- 3. Enable RLS and Add Policies
ALTER TABLE entity_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own addresses" ON entity_addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON entity_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON entity_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON entity_addresses;

-- Policy: View addresses where user_id matches OR linked entity belongs to user
-- Simplest is to trust the user_id on the address record if we enforce it on insert.
CREATE POLICY "Users can view own addresses" 
ON entity_addresses FOR SELECT 
TO authenticated 
USING (user_id = auth.uid()::text);

-- Policy: Insert
CREATE POLICY "Users can insert own addresses" 
ON entity_addresses FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid()::text);

-- Policy: Update
CREATE POLICY "Users can update own addresses" 
ON entity_addresses FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid()::text);

-- Policy: Delete
CREATE POLICY "Users can delete own addresses" 
ON entity_addresses FOR DELETE 
TO authenticated 
USING (user_id = auth.uid()::text);
