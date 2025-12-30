-- Add new columns for enhanced job details
alter table job_postings 
add column if not exists education text,
add column if not exists experience text,
add column if not exists salary_min integer,
add column if not exists salary_max integer,
add column if not exists salary_currency text default 'USD',
add column if not exists salary_period text default 'yearly'; -- hourly, monthly, yearly
