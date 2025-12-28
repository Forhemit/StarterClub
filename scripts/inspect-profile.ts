import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const USER_ID = 'user_36nbmB05wun3x8Ws85gmBWVFMxf';

async function main() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check Profile Columns specifically
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, role, active_roles, onboarding_completed, onboarding_completed_at')
        .eq('id', USER_ID)
        .single();

    console.log("Profile Data:", JSON.stringify(profile, null, 2));
}

main().catch(console.error);
