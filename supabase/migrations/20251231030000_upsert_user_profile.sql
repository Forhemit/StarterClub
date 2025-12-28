-- Manually Upsert Profile for blocked user to fix 406 error
-- This user likely missed the webhook event or webhook is misconfigured

INSERT INTO public.profiles (id, first_name, last_name, email, role)
VALUES (
    'user_36nbmB05wun3x8Ws85gmBWVFMxf', 
    'Stephen', 
    'Stokes', 
    'stephenstokes@example.com', -- Placeholder, update if known
    'member'
)
ON CONFLICT (id) DO UPDATE 
SET updated_at = NOW(); -- Ensure it exists
