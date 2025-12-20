"use server";

import { createAdminClient } from "@/lib/privileged/supabase-admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type ActionResult<T = null> = {
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

// ... (imports)
import { logAdminAction } from "@/lib/audit";
import { hasCapability, UserRole } from "@/lib/modules";

// ... (existing code)

export async function createOrgAction(name: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") return { success: false, error: "Unauthorized" };

    const supabase = createAdminClient();
    const { data: org, error } = await supabase.from("partner_orgs").insert({ name }).select().single();

    if (error) return { success: false, error: error.message };

    await logAdminAction(currentUser.clerk_user_id, "ORG_CREATE", org.id, "ORG", { name });

    revalidatePath("/system/users");
    return { success: true };
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

    // In super-admin, we assume the user is a Super Admin (since they can access this app)
    // But we check DB role to be safe.
    if (!currentUser || !hasCapability(currentUser.role as UserRole, 'CAN_INVITE_ADMIN')) {
        return { success: false, error: "Unauthorized: Missing Capability CAN_INVITE_ADMIN" };
    }

    try {
        // 1. Create Clerk User
        // SECURITY: Use a random password. The user should use the forgot password flow or an invite email.
        const defaultPassword = crypto.randomUUID();

        const clerkUser = await client.users.createUser({
            emailAddress: [email],
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            password: defaultPassword,
            publicMetadata: {
                role: targetRole,
                org_id: targetOrgId
            },
            skipPasswordChecks: true,
            skipLegalChecks: true,
            // @ts-ignore
            skipEmailVerification: true
        });

        // 2. Create Supabase Record
        const supabase = createAdminClient();
        const { data: dbUser, error } = await supabase.from("partner_users").insert({
            clerk_user_id: clerkUser.id,
            role: targetRole,
            org_id: targetOrgId,
            first_name: firstName || null,
            last_name: lastName || null
        }).select().single();

        if (error) {
            try {
                await client.users.deleteUser(clerkUser.id);
            } catch (rollbackError: any) {
                console.error("Failed to rollback Clerk user creation:", rollbackError.message);
            }
            return { success: false, error: `DB Error: ${error.message}` };
        }

        await logAdminAction(currentUser.clerk_user_id, "USER_INVITE", dbUser.id, "USER", {
            email, role: targetRole, orgId: targetOrgId, clerkId: clerkUser.id
        });

        revalidatePath("/system/users");

        return {
            success: true,
            data: {
                email,
                password: defaultPassword,
                role: targetRole,
                firstName,
                lastName
            }
        };

    } catch (e: any) {
        if (e.errors && e.errors[0]?.message) {
            return { success: false, error: e.errors[0].message };
        }
        return { success: false, error: e.message };
    }
}

export async function deleteUserAction(userId: string, clerkId: string): Promise<ActionResult> {
    const client = await clerkClient();
    const currentUser = await getCurrentUser();

    if (!currentUser || !hasCapability(currentUser.role as UserRole, 'CAN_INVITE_ADMIN')) return { success: false, error: "Unauthorized" };

    try {
        // Clerk Deletion (Hard Delete - Remote)
        await client.users.deleteUser(clerkId);

        // Supabase Deletion (Soft Delete - Local)
        const supabase = createAdminClient();
        const { error } = await supabase.from("partner_users").update({
            // @ts-ignore - DB Types need refresh
            deleted_at: new Date().toISOString()
        }).eq("id", userId);

        if (error) return { success: false, error: error.message };

        await logAdminAction(currentUser.clerk_user_id, "USER_DELETE", userId, "USER", { clerkId, type: "SOFT_DELETE" });

        revalidatePath("/system/users");
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
        await client.users.updateUser(clerkId, {
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            publicMetadata: {
                role: data.role,
                org_id: data.orgId
            }
        });

        const supabase = createAdminClient();
        const { error } = await supabase.from("partner_users").update({
            first_name: data.firstName || null,
            last_name: data.lastName || null,
            role: data.role,
            org_id: data.orgId
        }).eq("id", userId);

        if (error) return { success: false, error: error.message };

        await logAdminAction(currentUser.clerk_user_id, "USER_UPDATE", userId, "USER", { updates: data });

        revalidatePath("/system/users");
        return { success: true };
    } catch (e: any) {
        if (e.errors && e.errors[0]?.message) {
            return { success: false, error: e.errors[0].message };
        }
        return { success: false, error: e.message };
    }
}
