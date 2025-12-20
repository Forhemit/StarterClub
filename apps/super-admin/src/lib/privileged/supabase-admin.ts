import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@starter-club/shared-types";
import { logger } from "@/lib/logger";

// ⚠️ DANGER: Bypasses RLS. Use only for documented break-glass actions.
// This client operates with the SERVICE_ROLE_KEY and has full access to the database.
// All mutations performed with this client MUST be audited.

export const createAdminClient = (): SupabaseClient<Database> => {
    // Check environment variables at call time, not module load time
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        // Log this to server console so we can debug "stuck" states
        logger.error({
            msg: "createAdminClient Failed: Missing ENV variables",
            missingUrl: !url,
            missingKey: !key
        });

        throw new Error("Misconfigured: Missing Supabase Admin Keys");
    }

    return createClient<Database>(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
