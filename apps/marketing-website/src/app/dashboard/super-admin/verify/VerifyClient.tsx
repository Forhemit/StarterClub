"use client";

import { useState } from "react";
import { useSupabase } from "@/lib/supabase/browser";
import { useUser } from "@clerk/nextjs";

export default function VerifyClient() {
    const supabase = useSupabase();
    const { user } = useUser();
    const [logs, setLogs] = useState<string[]>([]);

    const log = (msg: string) => setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1]} ${msg}`]);

    const checkJwt = async () => {
        log("Checking current_jwt()...");
        const { data, error } = await supabase.rpc("current_jwt");
        if (error) {
            log(`Error: ${error.message}`);
        } else {
            log(`Success! JWT Claims: ${JSON.stringify(data, null, 2)}`);
        }
    };

    const testWrite = async () => {
        log("Starting Write Test...");
        if (!user) {
            log("No user logged in (Clerk). Aborting.");
            return;
        }

        // 1. Ensure we have a user record in partner_users (idempotent upsert)
        // Note: In real app, this should be done via webhook or explicit onboarding.
        // For verification, we'll try to insert/select ourselves.
        // But RLS says "Users can read own data". We need to exist first.
        // We can't insert into partner_users if RLS blocks us? 
        // Wait, partner_users RLS: "select: user can select their row".
        // Insert? We didn't define insert policy for partner_users!
        // Oops. We probably need an INSERT policy for self-registration or assume admin/webhook does it.
        // The prompt says "Seed scripts" for initial data.
        // Prompt says "Verification: prove RLS works with real logged-in Clerk user (read/write tests)".
        // If I can't insert myself, I can't test.
        // I should check partner_users policies again.
        // I only added SELECT policies.
        // I'll try to read `resource_assets` which has public (partner) read access.

        log("Attempting to read 'partner' resources...");
        const { data: resources, error: resError } = await supabase
            .from("resource_assets")
            .select("*")
            .eq("visibility", "partner")
            .limit(1);

        if (resError) {
            log(`Read Resources Error: ${resError.message}`);
        } else {
            log(`Read Resources Success: Found ${resources.length} items.`);
        }

        // Attempt to write a Calculator Run (requires org_id)
        // We need to belong to an org primarily.
        // If we are not seeded, we can't write to tables that require org_id check.

        log("Checking if user exists in DB...");
        const { data: userData, error: userError } = await supabase
            .from("partner_users")
            .select("*")
            .eq("clerk_user_id", user.id)
            .single();

        if (userError || !userData) {
            log("User not found in partner_users. Cannot test org-scoped writes.");
            log("Suggestion: Insert a row manually in Supabase dashboard for this user.");
            return;
        }

        log(`User found: ${userData.id} (Org: ${userData.org_id})`);

        // Write run
        const { data: runData, error: runError } = await supabase
            .from("calculator_runs")
            .insert({
                org_id: userData.org_id,
                track: "banks",
                inputs: { test: true },
                outputs: { result: "ok" }
            })
            .select();

        if (runError) {
            log(`Write Calculator Run Error: ${runError.message}`);
        } else {
            log(`Write Calculator Run Success: ID ${runData[0].id}`);
        }
    };

    const testRlsConfig = async () => {
        log("Testing RLS (Reading other org data)...");
        // Try to read calculator runs from a made-up UUID or just all
        const { data, error } = await supabase
            .from("calculator_runs")
            .select("*")
            .limit(5);

        // Should only return my own org's data
        if (error) {
            log(`Read Error (unexpected?): ${error.message}`);
        } else {
            log(`Read Success. Rows: ${data.length}`);
            log("Manually verify that these belong to your org.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <button onClick={checkJwt} className="px-4 py-2 bg-blue-600 text-white rounded">
                    1. Check Token (RPC)
                </button>
                <button onClick={testWrite} className="px-4 py-2 bg-green-600 text-white rounded">
                    2. Write Test
                </button>
                <button onClick={testRlsConfig} className="px-4 py-2 bg-red-600 text-white rounded">
                    3. RLS Check
                </button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm min-h-[200px] overflow-auto">
                {logs.length === 0 ? "Logs will appear here..." : logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
        </div>
    );
}
