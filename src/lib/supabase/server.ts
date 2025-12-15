import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

// NOTE: You must check "Project Settings > API" in Supabase dashboard to get these
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Get a Supabase client authenticated with the current Clerk user.
 * Use this in Server Components, Server Actions, and Route Handlers.
 */
export async function createSupabaseServerClient() {
    const { getToken } = await auth();
    let token = null;

    try {
        try {
            token = await getToken({ template: "supabase" });
        } catch (error) {
            // This usually means the "supabase" template is missing in Clerk.
            console.warn("Failed to get Supabase token from Clerk. Ensure 'supabase' JWT template exists in Clerk Dashboard.");
        }

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error("Supabase environment variables are missing on server!");
            // Return dummy client to prevent crash
            return createClient("https://placeholder.supabase.co", "placeholder");
        }

        return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            },
        });
    }
