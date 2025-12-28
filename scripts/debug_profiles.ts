import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectProfiles() {
    console.log('🔍 Inspecting profiles table...');

    // Check columns
    const { data: cols, error: colError } = await supabase
        .rpc('get_table_info', { table_name: 'profiles' })
        .catch(() => ({ data: null, error: 'RPC not available, trying manual' }));

    // Since we might not have a handy rpc, let's just try to add a unique constraint and see if it fails (it implies it exists)
    // Or better, query pg_indexes if we could (we can't easily via headers).

    // Alternative: Try to fetch a dummy profile by clerk_user_id to confirm column name.
    const { data: profile, error: err } = await supabase
        .from('profiles')
        .select('clerk_user_id')
        .limit(1);

    if (err) {
        console.error('Error selecting clerk_user_id:', err.message);
    } else {
        console.log('✅ Column clerk_user_id exists.');
    }

    // We can't easily check constraints via JS client without specific SQL functions exposed.
    // Strategy: We will assume the error "referenced in foreign key constraint does not exist" 
    // means exactly that the UNIQUE constraint is missing (Postgres requirement).

    console.log('Recommendation: Add UNIQUE constraint to profiles.clerk_user_id');
}

inspectProfiles();
