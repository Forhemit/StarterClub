-- Add Identifiers Fields
alter table legal_entities
add column if not exists state_tax_id text,
add column if not exists state_tax_id_status text default 'to_do', -- 'to_do', 'in_progress', 'completed', 'not_needed'
add column if not exists duns_number text;
