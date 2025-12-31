-- Add hiring accountability fields to job_postings table
alter table job_postings
add column if not exists hr_lead text,
add column if not exists hiring_team_lead text,
add column if not exists hiring_team_email text,
add column if not exists requesting_department text;

comment on column job_postings.hr_lead is 'The HR person accountable for this position';
comment on column job_postings.hiring_team_lead is 'The department lead requesting the position';
comment on column job_postings.hiring_team_email is 'Email of the hiring team lead';
comment on column job_postings.requesting_department is 'The department requesting the hire (can differ from job department)';
