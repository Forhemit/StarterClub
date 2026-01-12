
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function verifyAuthHooks() {
    console.log('Querying auth.users via Supabase Admin Client...');

    // Note: Standard Supabase client might not expose auth.users directly via .from('auth.users')
    // but let's try via the admin auth API which is the correct way.

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    console.log(`Found ${users.length} users.`);

    users.forEach((user) => {
        console.log(`- User: ${user.email}`);
        // Check allow mapping of snake_case to camelCase in certain client versions? 
        // Usually it's app_metadata in the object.

        // The column in DB is 'raw_app_meta_data', but API returns it as 'app_metadata'
        console.log(`  App Metadata:`, JSON.stringify(user.app_metadata, null, 2));

        const orgId = user.app_metadata?.organization_id;
        if (orgId) {
            console.log(`  ✅ Organization ID found: ${orgId}`);
        } else {
            console.log(`  ❌ No Organization ID found.`);
        }
    });
}

verifyAuthHooks();
