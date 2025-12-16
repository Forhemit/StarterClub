"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export async function seedDatabaseAction() {
    const user = await currentUser();
    // Debugging: Strict check
    if (!user || user.publicMetadata.role !== "admin") {
        const role = user?.publicMetadata?.role || "undefined";
        return {
            success: false,
            error: `Unauthorized: Clerk Metadata role is '${role}' (User ID: ${user?.id})`
        };
    }

    const log: string[] = [];
    const supabase = createAdminClient();
    const client = await clerkClient();

    // Helper to create user
    const ensureUser = async (email: string, role: string, orgId: string | null) => {
        try {
            // 1. Clerk Create (or get)
            let clerkId = "";
            try {
                const list = await client.users.getUserList({ emailAddress: [email] });
                if (list.data.length > 0) {
                    clerkId = list.data[0].id;
                    log.push(`User ${email} exists (${clerkId}). Updating metadata...`);
                    // Update metadata to match expected seed role
                    await client.users.updateUser(clerkId, {
                        publicMetadata: { role, org_id: orgId }
                    });
                } else {
                    log.push(`Creating Clerk user ${email}...`);
                    const newUser = await client.users.createUser({
                        emailAddress: [email],
                        password: "StarterClub!2025",
                        publicMetadata: { role, org_id: orgId },
                        skipPasswordChecks: true,
                        skipLegalChecks: true,
                        // @ts-ignore - Valid in BAPI, might be missing in SDK types
                        skipEmailVerification: true
                    });
                    clerkId = newUser.id;
                }
            } catch (e: any) {
                log.push(`Clerk Error for ${email}: ${e.message}`);
                return;
            }

            // 2. DB Sync
            // Check if exists
            const { data: existing } = await supabase.from("partner_users").select("*").eq("clerk_user_id", clerkId).single();
            if (existing) {
                log.push(`DB: Updating ${email} role to ${role}...`);
                await supabase.from("partner_users").update({ role, org_id: orgId }).eq("id", existing.id);
            } else {
                log.push(`DB: Creating ${email} record...`);
                await supabase.from("partner_users").insert({
                    clerk_user_id: clerkId,
                    role,
                    org_id: orgId
                });
            }
            log.push(`Synced ${email} successfully.`);

        } catch (e: any) {
            log.push(`Error processing ${email}: ${e.message}`);
        }
    };

    try {
        log.push("Starting Seed...");

        // 1. Org
        let orgId = "";
        const { data: org } = await supabase.from("partner_orgs").select("*").eq("name", "Acme Corp").single();
        if (org) {
            orgId = org.id;
            log.push("Org 'Acme Corp' found.");
        } else {
            log.push("Creating 'Acme Corp'...");
            const { data: newOrg } = await supabase.from("partner_orgs").insert({ name: "Acme Corp" }).select().single();
            if (newOrg) orgId = newOrg.id;
        }

        // 2. Users
        await ensureUser("stephenobamastokes@gmail.com", "admin", null);

        if (orgId) {
            await ensureUser("partneradmin@acme.com", "partner_admin", orgId);
            await ensureUser("partner@acme.com", "partner", orgId);
        } else {
            log.push("Skipping Org users (Org creation failed).");
        }

        return { success: true, logs: log };

    } catch (e: any) {
        return { success: false, error: e.message, logs: log };
    }
}
