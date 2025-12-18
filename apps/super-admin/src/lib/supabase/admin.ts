import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@starter-club/shared-types";

export const createAdminClient = (): SupabaseClient<Database> => {
    // Check environment variables at call time, not module load time
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        // Log this to server console so we can debug "stuck" states
        console.error("❌ createAdminClient Failed: Missing ENV variables.");
        if (!url) console.error("   - NEXT_PUBLIC_SUPABASE_URL is missing");
        if (!key) console.error("   - SUPABASE_SERVICE_ROLE_KEY is missing");

        throw new Error("Misconfigured: Missing Supabase Admin Keys");
    }

    return createClient<Database>(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
