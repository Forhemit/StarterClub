-- Create job_postings table
create table if not exists job_postings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
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

-- Policies
create policy "Users can view job postings in their org"
  on job_postings for select
  using (
    exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid()
      and ur.org_id = job_postings.org_id
    )
  );

create policy "Admins and HR can manage job postings"
  on job_postings for all
  using (
    exists (
      select 1 from user_roles ur
      join roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and ur.org_id = job_postings.org_id
      and r.name in ('Super Admin', 'Admin', 'HR Manager')
    )
  );

-- Add to modules registry
insert into modules (name, slug, description, version, author, image_url)
values (
  'Jobs & Careers',
  'jobs-careers',
  'Post jobs and manage your careers page.',
  '1.0.0',
  'Starter Club',
  'https://placehold.co/400x300?text=Jobs+%26+Careers'
) on conflict (slug) do nothing;
