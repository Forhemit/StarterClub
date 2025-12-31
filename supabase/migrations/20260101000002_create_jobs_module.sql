-- Create job_postings table
create table if not exists job_postings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null, -- Organization ID (no FK constraint - organizations table may not exist)
  title text not null,
  description text,
  department text,
  location text,
  type text check (type in ('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary')),
  salary_range text,
  status text check (status in ('draft', 'published', 'closed')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table job_postings enable row level security;

-- Simple policies (authenticated users can manage their org's postings)
-- Note: In production, add proper org membership checks when user_roles table exists
create policy "Authenticated users can view job postings"
  on job_postings for select
  using (auth.uid() is not null);

create policy "Authenticated users can manage job postings"
  on job_postings for all
  using (auth.uid() is not null);
