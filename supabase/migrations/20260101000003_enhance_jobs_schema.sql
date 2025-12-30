-- Add new columns to job_postings
alter table job_postings 
add column if not exists responsibilities text[],
add column if not exists qualifications text[],
add column if not exists benefits text[],
add column if not exists schedule text,
add column if not exists remote_type text check (remote_type in ('Remote', 'Hybrid', 'On-site'));
