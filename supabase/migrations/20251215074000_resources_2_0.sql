-- Upgrade resource_assets to full Document model

-- 1. Add new columns
ALTER TABLE resource_assets 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS doc_type text DEFAULT 'asset' CHECK (doc_type IN ('policy', 'guide', 'template', 'api', 'asset')),
ADD COLUMN IF NOT EXISTS content text, -- For Markdown or text content
ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES partner_users(id);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_status ON resource_assets(status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resource_assets(doc_type);
CREATE INDEX IF NOT EXISTS idx_resources_author ON resource_assets(author_id);
CREATE INDEX IF NOT EXISTS idx_resources_updated_at ON resource_assets(updated_at DESC);

-- 3. Backfill existing data
UPDATE resource_assets SET status = 'published' WHERE status IS NULL;
UPDATE resource_assets SET doc_type = 'asset' WHERE doc_type IS NULL;
