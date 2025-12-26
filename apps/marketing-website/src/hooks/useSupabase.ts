import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON!;

export function useSupabase() {
    const { getToken } = useAuth();

    return useMemo(() => {
        return createClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                global: {
                    fetch: async (url, options = {}) => {
                        const clerkToken = await getToken({ template: 'supabase' });

                        const headers = new Headers(options?.headers);

                        // Critical: Only attach Authorization header if a token actually exists.
                        // Sending "Bearer null" or "Bearer undefined" causes Supabase to error with "Expected 3 parts in JWT".
                        if (clerkToken) {
                            headers.set('Authorization', `Bearer ${clerkToken}`);
                        }

                        return fetch(url, {
                            ...options,
                            headers,
                        });
                    },
                },
            }
        );
    }, [getToken]);
}
