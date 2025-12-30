-- Add Registered Agent contact information columns
ALTER TABLE legal_entities
ADD COLUMN IF NOT EXISTS registered_agent_phone TEXT,
ADD COLUMN IF NOT EXISTS registered_agent_email TEXT,
ADD COLUMN IF NOT EXISTS registered_agent_website TEXT;
