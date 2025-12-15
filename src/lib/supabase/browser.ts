import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

// NOTE: You must check "Project Settings > API" in Supabase dashboard to get these
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * React hook to get a Supabase client authenticated with the current Clerk user.
 * Use this in Client Components.
 */
export function useSupabase() {
    const { getToken } = useAuth();

    return useMemo(() => {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error("Supabase environment variables are missing!");
            // Return a dummy client or handle gracefully to prevent crash
            return createClient("https://placeholder.supabase.co", "placeholder", {
                global: { fetch: () => Promise.resolve(new Response(null, { status: 500 })) }
            });
        }

        return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: {
                // Get the Supabase token from Clerk
                fetch: async (url, options = {}) => {
                    const clerkToken = await getToken({ template: "supabase" });

                    const headers = new Headers(options?.headers);
                    if (clerkToken) {
                        headers.set("Authorization", `Bearer ${clerkToken}`);
                    }

                    return fetch(url, {
                        ...options,
                        headers,
                    });
                },
            },
        });
    }, [getToken]);
}
