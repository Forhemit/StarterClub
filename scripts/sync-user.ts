import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const clerkSecretKey = process.env.CLERK_SECRET_KEY!;

const USER_ID = 'user_36nbmB05wun3x8Ws85gmBWVFMxf';

async function main() {
    if (!supabaseUrl || !supabaseServiceKey || !clerkSecretKey) {
        console.error("Missing environment variables.");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Checking if user ${USER_ID} exists in Supabase...`);
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', USER_ID)
        .single();

    if (existingUser) {
        console.log("User already exists in Supabase:", existingUser);
        return;
    }

    console.log("User not found in Supabase. Fetching from Clerk...");

    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${USER_ID}`, {
        headers: {
            'Authorization': `Bearer ${clerkSecretKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (!clerkResponse.ok) {
        console.error("Failed to fetch user from Clerk:", await clerkResponse.text());
        process.exit(1);
    }

    const clerkUser = await clerkResponse.json();

    // Extract info
    const email = clerkUser.email_addresses[0]?.email_address;
    const firstName = clerkUser.first_name;
    const lastName = clerkUser.last_name;
    const photoUrl = clerkUser.image_url;

    console.log("Found Clerk user:", { email, firstName, lastName });

    const { error: insertError } = await supabase
        .from('profiles')
        .insert({
            id: USER_ID,
            email,
            first_name: firstName,
            last_name: lastName,
            photo_url: photoUrl,
            role: 'member' // Default role
        });

    if (insertError) {
        console.error("Failed to insert user into Supabase:", insertError);
        process.exit(1);
    }

    console.log("Successfully synced user to Supabase!");
}

main().catch(console.error);
