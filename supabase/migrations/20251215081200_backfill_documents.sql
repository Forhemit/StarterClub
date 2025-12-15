-- Backfill existing documents with default values for new columns
UPDATE resource_assets 
SET 
    doc_type = 'asset',
    status = 'published'
WHERE doc_type IS NULL OR status IS NULL;
