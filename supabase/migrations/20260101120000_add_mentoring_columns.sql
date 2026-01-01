
ALTER TABLE leadership_role_profiles
ADD COLUMN IF NOT EXISTS mentoring_upstream jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mentoring_downstream jsonb DEFAULT '[]'::jsonb;
