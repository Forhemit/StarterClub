import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const USER_ID = 'user_36nbmB05wun3x8Ws85gmBWVFMxf';
// Use the ID found in the previous step (e.g., Executive) or just pick one if the query returned results.
// I will query one dynamically to be safe.

async function main() {
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing environment variables.");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Fetching a valid department...");
    const { data: depts, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .limit(1);

    if (deptError || !depts || depts.length === 0) {
        console.error("Failed to fetch departments:", deptError);
        process.exit(1);
    }

    const deptId = depts[0].id;
    console.log(`Found department: ${depts[0].department_name} (${deptId})`);

    console.log(`Attempting to assign department to user ${USER_ID}...`);

    // First cleanup any existing to test fresh insert
    await supabase.from('user_departments').delete().eq('user_id', USER_ID);

    const { data: insertData, error: insertError } = await supabase
        .from('user_departments')
        .insert({
            user_id: USER_ID,
            department_id: deptId,
            is_primary: true
        })
        .select();

    if (insertError) {
        console.error("Failed to assign department:", insertError);
        process.exit(1);
    }

    console.log("Successfully assigned department:", insertData);

    // Verify read back
    console.log("Verifying read back...");
    const { data: readData, error: readError } = await supabase
        .from('user_departments')
        .select('*, departments(*)')
        .eq('user_id', USER_ID);

    if (readError) {
        console.error("Failed to read back assignment:", readError);
        process.exit(1);
    }

    console.log("Read back successful:", JSON.stringify(readData, null, 2));
}

main().catch(console.error);
