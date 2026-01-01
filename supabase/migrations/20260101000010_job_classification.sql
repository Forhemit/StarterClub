-- Add job_grade column to job_postings
alter table job_postings
add column if not exists job_grade text;

comment on column job_postings.job_grade is 'Job Grade (e.g. 1-9) to be used with Job Class';
