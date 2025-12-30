-- Add expanded job configuration fields
alter table job_postings
add column if not exists job_id text,
add column if not exists job_class text,
add column if not exists application_deadline date,
add column if not exists application_link text,
add column if not exists department_overview text,
add column if not exists preferred_qualifications text[],
add column if not exists eeo_statement text;
