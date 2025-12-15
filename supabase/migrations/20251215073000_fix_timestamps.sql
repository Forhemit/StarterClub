-- Add created_at to resource_assets
ALTER TABLE resource_assets 
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Add created_at to case_studies
ALTER TABLE case_studies 
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
