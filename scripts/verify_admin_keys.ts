import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load from .env.local
dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error("Missing ENV variables:");
    console.error("URL:", url ? "Set" : "Missing");
    console.error("KEY:", key ? "Set" : "Missing");
    process.exit(1);
}

const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
    console.log("Testing Admin Connection...");
    const { data, error } = await supabase.from("partner_users").select("count").limit(1);

    if (error) {
        console.error("Connection Failed:", error.message);
        process.exit(1);
    } else {
        console.log("✅ Success! Connected to Supabase with Service Role.");
        console.log("Query result:", data);
    }
}

main();
