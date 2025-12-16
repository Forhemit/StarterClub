"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type ActionResult<T = null> = {
    success: boolean;
    data?: T;
    error?: string;
};

// Internal helper to get current user details from DB
async function getCurrentUser() {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createAdminClient();
    const { data } = await supabase.from("partner_users").select("*").eq("clerk_user_id", userId).single();
    return data; // { id, role, org_id, ... }
}

export async function inviteUserAction(
    email: string,
    targetRole: string,
    targetOrgId: string | null,
    firstName?: string,
    lastName?: string
): Promise<ActionResult<any>> {
    const client = await clerkClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: "Unauthorized" };

    // PERMISSION CHECKS
    const isSuperAdmin = currentUser.role === "admin";
    const isPartnerAdmin = currentUser.role === "partner_admin";

    if (!isSuperAdmin && !isPartnerAdmin) {
        return { success: false, error: "Insufficient permissions" };
    }

    // Enforce constraints
    let finalOrgId = targetOrgId;
    let finalRole = targetRole;

    if (isPartnerAdmin) {
        // Partner Admin can ONLY invite to their own org
        if (!currentUser.org_id) return { success: false, error: "You must belong to an organization to invite users." };
        finalOrgId = currentUser.org_id;

        // Partner Admin CANNOT create Super Admins
        if (targetRole === "admin") {
            return { success: false, error: "Cannot create Super Admin users." };
        }
    }

    try {
        // 1. Create Clerk User
        // Note: For "Guest Emails/Invites", ideally we use invitations.choose
        // But to satisfy "Create guest emails" request immediately with known credentials:
        // We will create them with a default password.
        const defaultPassword = "StarterClub!2025";

        // Check if user exists? createClerkClient handles lookup?
        // simple create
        const clerkUser = await client.users.createUser({
            emailAddress: [email],
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            password: defaultPassword,
            publicMetadata: {
                role: finalRole,
                org_id: finalOrgId
            },
            skipPasswordChecks: true,
            skipLegalChecks: true,
            // @ts-ignore - Valid in BAPI, might be missing in SDK types
            skipEmailVerification: true
        });

        // 2. Create Supabase Record
        const supabase = createAdminClient();
        const { data: dbUser, error } = await supabase.from("partner_users").insert({
            clerk_user_id: clerkUser.id,
            role: finalRole,
            org_id: finalOrgId,
            first_name: firstName || null,
            last_name: lastName || null
        }).select().single();

        if (error) {
            // Rollback: Delete the created Clerk user to maintain consistency
            try {
                await client.users.deleteUser(clerkUser.id);
                console.error("Rolled back Clerk user creation due to DB error:", error.message);
            } catch (rollbackError: any) {
                console.error("Failed to rollback Clerk user creation:", rollbackError.message);
                // Critical: We have an orphan Clerk user now. Ideally, log to a monitoring service.
            }
            return { success: false, error: `DB Error: ${error.message}` };
        }

        revalidatePath("/dashboard/super-admin/users");
        revalidatePath("/dashboard/partner-admin/team");

        return {
            success: true,
            data: {
                email,
                password: defaultPassword,
                role: finalRole,
                firstName,
                lastName
            }
        };

    } catch (e: any) {
        // Handle Clerk constraints (e.g. email exists)
        if (e.errors && e.errors[0]?.message) {
            return { success: false, error: e.errors[0].message };
        }
        return { success: false, error: e.message };
    }
}

export async function deleteUserAction(userId: string, clerkId: string): Promise<ActionResult> {
    const client = await clerkClient();
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") return { success: false, error: "Unauthorized" };

    try {
        // 1. Delete from Clerk
        await client.users.deleteUser(clerkId);

        // 2. Delete from Supabase (should cascade but explicit is good, or if not cascading)
        // Actually our schema doesn't cascade delete on partner_users usually?
        // But let's delete explicitly.
        const supabase = createAdminClient();
        const { error } = await supabase.from("partner_users").delete().eq("id", userId);

        if (error) return { success: false, error: error.message };

        revalidatePath("/dashboard/super-admin/users");
        return { success: true };
    } catch (e: any) {
        if (e.errors && e.errors[0]?.message) {
            return { success: false, error: e.errors[0].message };
        }
        return { success: false, error: e.message };
    }
}

export async function updateUserAction(
    userId: string,
    clerkId: string,
    data: { firstName: string; lastName: string; role: string; orgId: string | null }
): Promise<ActionResult> {
    const client = await clerkClient();
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") return { success: false, error: "Unauthorized" };

    try {
        // 1. Update Clerk
        await client.users.updateUser(clerkId, {
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            publicMetadata: {
                role: data.role,
                org_id: data.orgId
            }
        });

        // 2. Update Supabase
        const supabase = createAdminClient();
        const { error } = await supabase.from("partner_users").update({
            first_name: data.firstName || null,
            last_name: data.lastName || null,
            role: data.role,
            org_id: data.orgId
        }).eq("id", userId);

        if (error) return { success: false, error: error.message };

        revalidatePath("/dashboard/super-admin/users");
        return { success: true };
    } catch (e: any) {
        if (e.errors && e.errors[0]?.message) {
            return { success: false, error: e.errors[0].message };
        }
        return { success: false, error: e.message };
    }
}
