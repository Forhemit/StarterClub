import { createClient } from "@supabase/supabase-js";

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client for build time when env vars are missing
const createDummyClient = () => {
    return createClient("https://placeholder.supabase.co", "placeholder", {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

// Create the actual client or a dummy for build time
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createDummyClient();

// Helper to check if supabase is properly configured
export const isSupabaseConfigured = () => {
    return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co");
};
