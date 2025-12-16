import { createClient } from "@supabase/supabase-js";

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "Supabase environment variables are missing. Form submissions will not work."
    );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl || "",
    supabaseAnonKey || ""
);
