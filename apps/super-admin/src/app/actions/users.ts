"use server";

import { createAdminClient } from "@/lib/supabase/admin";
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

export async function createOrgAction(name: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") return { success: false, error: "Unauthorized" };

    const supabase = createAdminClient();
    const { error } = await supabase.from("partner_orgs").insert({ name });

    if (error) return { success: false, error: error.message };

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
    if (!currentUser || currentUser.role !== "admin") return { success: false, error: "Unauthorized" };

    try {
        // 1. Create Clerk User
        const defaultPassword = "StarterClub!2025";

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

    if (!currentUser || currentUser.role !== "admin") return { success: false, error: "Unauthorized" };

    try {
        await client.users.deleteUser(clerkId);

        const supabase = createAdminClient();
        const { error } = await supabase.from("partner_users").delete().eq("id", userId);

        if (error) return { success: false, error: error.message };

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

        revalidatePath("/system/users");
        return { success: true };
    } catch (e: any) {
        if (e.errors && e.errors[0]?.message) {
            return { success: false, error: e.errors[0].message };
        }
        return { success: false, error: e.message };
    }
}
