-- Add internal_notes and additional_comments columns to job_postings table
alter table job_postings 
add column if not exists internal_notes text,
add column if not exists additional_comments text;
