import dotenv from "dotenv";

// Load env
dotenv.config({ path: ".env.local" });

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
    console.error("❌ CLERK_SECRET_KEY is missing in .env.local");
    process.exit(1);
}

async function main() {
    console.log("Checking Clerk JWT Templates...");

    try {
        const res = await fetch("https://api.clerk.com/v1/jwt_templates", {
            headers: {
                Authorization: `Bearer ${CLERK_SECRET_KEY}`,
            }
        });

        if (!res.ok) {
            throw new Error(`Clerk API Error: ${res.status} ${res.statusText}`);
        }

        const templates = await res.json();

        // Find 'supabase' template
        const supabaseTemplate = templates.find((t: any) => t.name === "supabase");

        if (supabaseTemplate) {
            console.log("✅ SUCCESS: Found JWT template named 'supabase'.");
            console.log("   - ID:", supabaseTemplate.id);
            console.log("   - Claims:", JSON.stringify(supabaseTemplate.claims, null, 2));
        } else {
            console.error("❌ FAILURE: 'supabase' template NOT found.");
            console.log("   found templates:", templates.map((t: any) => t.name));
            process.exit(1);
        }

    } catch (error: any) {
        console.error("Script failed:", error.message);
        process.exit(1);
    }
}

main();
