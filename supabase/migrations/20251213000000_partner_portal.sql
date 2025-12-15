-- Helper function to get the current Clerk user ID
create or replace function requesting_user_id()
returns text
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::text;
$$;

-- Helper to inspect JWT (for debugging/verification)
create or replace function current_jwt()
returns jsonb
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true), '')::jsonb;
$$;

-- PARTNER ORGS
create table if not exists partner_orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_tags text[] default '{}',
  created_at timestamptz default now()
);

-- PARTNER USERS
create table if not exists partner_users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  org_id uuid references partner_orgs(id) on delete set null,
  role text not null check (role in ('partner', 'admin')),
  created_at timestamptz default now()
);

-- RESOURCE ASSETS
create table if not exists resource_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  track text not null check (track in ('banks', 'insurance', 'hardware', 'saas', 'shared')),
  type text not null check (type in ('pdf', 'ppt', 'zip', 'link')),
  file_url text not null,
  file_size text, -- e.g. "2.4 MB"
  visibility text not null check (visibility in ('partner', 'admin')),
  tags text[] default '{}',
  updated_at timestamptz default now()
);

-- CASE STUDIES
create table if not exists case_studies (
  id uuid primary key default gen_random_uuid(),
  track text not null,
  member_type text,
  problem text,
  intro text,
  outcome text,
  timeline text,
  partner_quote text,
  published boolean default false,
  updated_at timestamptz default now()
);

-- CALCULATOR PRESETS
create table if not exists calculator_presets (
  id uuid primary key default gen_random_uuid(),
  track text not null,
  name text not null,
  defaults jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- CALCULATOR RUNS
create table if not exists calculator_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references partner_orgs(id),
  track text not null,
  inputs jsonb not null,
  outputs jsonb not null,
  created_at timestamptz default now()
);

-- PARTNER SUBMISSIONS
create table if not exists partner_submissions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references partner_orgs(id),
  type text not null check (type in ('intro_request', 'offer', 'event')),
  payload jsonb not null,
  status text not null default 'new' check (status in ('new', 'in_review', 'done')),
  created_at timestamptz default now()
);

-- ENABLE RLS
alter table partner_orgs enable row level security;
alter table partner_users enable row level security;
alter table resource_assets enable row level security;
alter table case_studies enable row level security;
alter table calculator_presets enable row level security;
alter table calculator_runs enable row level security;
alter table partner_submissions enable row level security;

-- POLICIES

-- partner_users: Users can read their own row
drop policy if exists "Users can read own data" on partner_users;
create policy "Users can read own data" on partner_users
  for select
  using ( clerk_user_id = requesting_user_id() );

-- partner_orgs: Users can read their org
drop policy if exists "Users can read own org" on partner_orgs;
create policy "Users can read own org" on partner_orgs
  for select
  using (
    id in (
      select org_id from partner_users where clerk_user_id = requesting_user_id()
    )
  );

-- resource_assets: Partners can read 'partner' visibility, Admins can read all (simplification: everyone logged in can read 'partner' assets)
drop policy if exists "Authenticated users can read partner assets" on resource_assets;
create policy "Authenticated users can read partner assets" on resource_assets
  for select
  using (
    (visibility = 'partner' and requesting_user_id() is not null)
  );

-- case_studies: Published only for partners
drop policy if exists "Anyone can read published case studies" on case_studies;
create policy "Anyone can read published case studies" on case_studies
  for select
  using ( published = true );

-- calculator_presets: Read only
drop policy if exists "Everyone can read presets" on calculator_presets;
create policy "Everyone can read presets" on calculator_presets
  for select
  using ( true );

-- calculator_runs: Org members only
drop policy if exists "Org members can read/insert runs" on calculator_runs;
create policy "Org members can read/insert runs" on calculator_runs
  for all
  using (
    org_id in (
      select org_id from partner_users where clerk_user_id = requesting_user_id()
    )
  );

-- partner_submissions: Org members only
drop policy if exists "Org members can read/insert submissions" on partner_submissions;
create policy "Org members can read/insert submissions" on partner_submissions
  for all
  using (
    org_id in (
      select org_id from partner_users where clerk_user_id = requesting_user_id()
    )
  );


-- SEED DATA (Resources)
-- Clear existing to avoid dupes if re-running
delete from resource_assets where title in ('Bank Partner Overview (1-Pager)', 'Insurance Partner Overview (1-Pager)', 'Hardware Partner Overview (1-Pager)', 'SaaS Partner Overview (1-Pager)');

insert into resource_assets (title, description, track, type, file_url, visibility) values
-- Banks
('Bank Partner Overview (1-Pager)', 'Executive summary of warm intros.', 'banks', 'pdf', '#', 'partner'),
('How Warm Intros Work (Process Map PDF)', 'Step-by-step path from walk-in to intro.', 'banks', 'pdf', '#', 'partner'),
('“Ready for Banking” Checklist', 'Member readiness checklist.', 'banks', 'pdf', '#', 'partner'),
('Intro Context Card Template', 'Sample profile shared with consent.', 'banks', 'pdf', '#', 'partner'),
('Banking Foundations Workshop Kit', 'Slides and run-of-show.', 'banks', 'ppt', '#', 'partner'),
('Merchant Services Add-On Kit', 'Script for introducing card processing.', 'banks', 'pdf', '#', 'partner'),
('Monthly Partner Report (Sample)', 'Example report format.', 'banks', 'pdf', '#', 'partner'),
('Community Impact Summary', 'CRA-friendly impact dashboard.', 'banks', 'pdf', '#', 'partner'),

-- Insurance
('Insurance Partner Overview (1-Pager)', 'Overview of insurance intros.', 'insurance', 'pdf', '#', 'partner'),
('“Protect Your Project” Risk Checklist', 'Plain-English coverage guide.', 'insurance', 'pdf', '#', 'partner'),
('Intro Context Card Template', 'Member context sample.', 'insurance', 'pdf', '#', 'partner'),
('Insurance in Plain English Workshop Kit', 'Slides and QA guide.', 'insurance', 'ppt', '#', 'partner'),
('Coverage Guide Handouts', 'General/Prof Liability, Cyber, Workers Comp.', 'insurance', 'pdf', '#', 'partner'),
('Quote-to-Bind Follow-Up Scripts', '3 friendly templates.', 'insurance', 'pdf', '#', 'partner'),
('Monthly Partner Report (Sample)', 'Intros, quotes, binds metrics.', 'insurance', 'pdf', '#', 'partner'),
('Starter Contract Basics', 'Partner-friendly handout.', 'insurance', 'pdf', '#', 'partner'),

-- Hardware
('Hardware Partner Overview (1-Pager)', 'Turning gear into touchpoints.', 'hardware', 'pdf', '#', 'partner'),
('Placement & Sponsorship Menu', 'Super Stations, desk zones, etc.', 'hardware', 'pdf', '#', 'partner'),
('Starter Gear Bundles', 'Curated shopping lists.', 'hardware', 'pdf', '#', 'partner'),
('Super Stations Spec Sheet', 'What’s inside a sponsored station.', 'hardware', 'pdf', '#', 'partner'),
('Creator Room Kit List', 'Camera, mic, lights specs.', 'hardware', 'pdf', '#', 'partner'),
('Discount Code + Attribution Guide', 'Tracking redemptions.', 'hardware', 'pdf', '#', 'partner'),
('In-Space Brand Guidelines', 'Do/Don’t sheet for screens.', 'hardware', 'pdf', '#', 'partner'),
('Monthly Exposure Report (Sample)', 'Impressions and usage.', 'hardware', 'pdf', '#', 'partner'),

-- SaaS
('SaaS Partner Overview (1-Pager)', 'Driving trials and activation.', 'saas', 'pdf', '#', 'partner'),
('Activation Options Menu', 'Starter Packs, Roadmaps, Workshops.', 'saas', 'pdf', '#', 'partner'),
('Co-Branded Starter Pack Template', 'Copy structure for offer page.', 'saas', 'pdf', '#', 'partner'),
('Workshop-in-a-Box Kit', 'Slides and signup flow.', 'saas', 'ppt', '#', 'partner'),
('Use-Case Library', 'Realistic scenarios for builders.', 'saas', 'pdf', '#', 'partner'),
('Adoption Reporting Template', 'Trials, activation, upgrades.', 'saas', 'pdf', '#', 'partner'),
('Partner Asset Pack', 'Logos and screen creatives.', 'saas', 'zip', '#', 'partner'),
('Intro Context Card Template', 'For CS/sales teams.', 'saas', 'pdf', '#', 'partner'),

-- Shared
('Starter Club Partnership Playbook', 'Master guide.', 'shared', 'pdf', '#', 'partner'),
('Consent & Privacy Standard', 'What we share and don’t.', 'shared', 'pdf', '#', 'partner'),
('Monthly Partner Report Archive', 'Example reports.', 'shared', 'pdf', '#', 'partner');

-- SEED CALCULATOR PRESETS
-- Avoid duplicates by deleting strict matches or just existing ones if we don't care about ID preservation
delete from calculator_presets where track in ('banks', 'insurance', 'hardware', 'saas');
insert into calculator_presets (track, name, defaults) values
('banks', 'Standard Bank Model', '{"avg_profit": 500, "retention_years": 5}'::jsonb),
('insurance', 'Standard Broker Model', '{"commission_pct": 15, "retention_years": 3}'::jsonb),
('hardware', 'DTC Hardware Model', '{"margin_pct": 40, "avg_order": 200}'::jsonb),
('saas', 'B2B SaaS Model', '{"churn_rate": 5, "arpa": 50}'::jsonb);
