
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exancwcrkqivoaqhmapr.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is not set. Copy .env.example to .env.local and provide the service role key before running this script.'
  )
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sql = `
-- Insert all application roles into roles table
INSERT INTO public.roles (name, slug, description) VALUES
  ('Super Admin', 'super_admin', 'Full system access with admin privileges'),
  ('Member', 'member', 'Regular platform member'),
  ('Partner', 'partner', 'Business partner with special access'),
  ('Sponsor', 'sponsor', 'Sponsor with visibility privileges'),
  ('Employee', 'employee', 'Company employee access'),
  ('Admin', 'admin', 'System administrator'),
  ('Manager', 'manager', 'Team manager'),
  ('Guest', 'guest', 'Limited guest access')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Update profiles table to include role relationship
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role_slug TEXT REFERENCES public.roles(slug),
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id);

-- Create user_roles table for RBAC (if needed for multiple roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  role_slug TEXT REFERENCES public.roles(slug),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, role_slug)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
`

async function runMigration() {
    console.log('Running RBAC migration...')
    // Supabase JS client doesn't support raw SQL execution directly on the public interface often, 
    // but let's try via rpc if a function exists, or just warn the user.
    // Actually, we can't easily run raw DDL via supabase-js unless we have a specific function exposed.
    // Wait, I can try to use the 'pg' library if I can install it, OR I can just instruct the user.
    // BUT checks in previous turns showed 'npx supabase' is available. I can use that!

    console.log('This script is a placeholder. I will use npx supabase to apply migrations if possible.')
}

runMigration()
