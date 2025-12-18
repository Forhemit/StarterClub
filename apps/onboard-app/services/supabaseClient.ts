import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase env vars in Onboard App");
}

import { Database } from '@starter-club/shared-types';

export const supabase = createClient<Database>(supabaseUrl || "", supabaseKey || "");
