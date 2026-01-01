-- Add success_metrics and restrictions arrays to job_postings
alter table job_postings
add column if not exists success_metrics text[] default '{}',
add column if not exists restrictions text[] default '{}';

comment on column job_postings.success_metrics is 'List of success criteria/metrics for the role';
comment on column job_postings.restrictions is 'List of restrictions/requirements (e.g. US Citizen, Background Check)';
