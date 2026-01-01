
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Or SERVICE_ROLE_KEY if we need bypass RLS, but anonymous key with public query (which I enabled) should work

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkModules() {
    console.log('Checking modules in DB...');
    const { data, error } = await supabase
        .from('modules')
        .select('title, slug, category')
        .eq('category', 'Business Resilience');

    if (error) {
        console.error('Error fetching modules:', error);
    } else {
        console.log('Found Resilience Modules:', data);
    }
}

checkModules();
