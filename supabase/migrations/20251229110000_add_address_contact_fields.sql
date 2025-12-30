-- Add address and contact fields to legal_entities
alter table legal_entities
add column if not exists business_address_line1 text,
add column if not exists business_address_line2 text,
add column if not exists business_city text,
add column if not exists business_state text,
add column if not exists business_zip text,
add column if not exists company_phone text,
add column if not exists company_email text,
add column if not exists registered_agent_name text;
