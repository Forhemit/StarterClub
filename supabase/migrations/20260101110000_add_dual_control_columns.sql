
ALTER TABLE leadership_role_profiles
ADD COLUMN IF NOT EXISTS tier4_dual_control_1 text,
ADD COLUMN IF NOT EXISTS tier4_dual_control_2 text;
