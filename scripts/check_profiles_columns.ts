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

async function checkProfilesColumns() {
    console.log('🔍 Checking profiles table columns...');

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error querying profiles:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Columns found:', Object.keys(data[0]));
    } else {
        // If no rows, we can't see keys from data. 
        // Try to insert a dummy and see error, or just trust the developer knows... 
        // actually, let's try to select 'id' and 'user_id' specifically.
        console.log('No rows in profiles. Trying to probe columns...');

        const possibleCols = ['id', 'user_id', 'clerk_user_id', 'email', 'userId', 'clerkId'];
        for (const col of possibleCols) {
            const { error: probeError } = await supabase.from('profiles').select(col).limit(1);
            if (!probeError) {
                console.log(`✅ Column exists: ${col}`);
            } else {
                console.log(`❌ Column missing: ${col} (${probeError.message})`);
            }
        }
    }
}

checkProfilesColumns();
