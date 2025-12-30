-- Add Comments field to legal_entities
alter table legal_entities
add column if not exists comments text;
