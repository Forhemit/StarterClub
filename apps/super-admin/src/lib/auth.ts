import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/privileged/supabase-admin";
import { headers } from "next/headers";

export type AdminUser = {
    id: string;
    clerk_user_id: string;
    role: string;
    org_id: string | null;
};

/**
 * Hard-gated authorization check for Super Admin actions.
 * Throws an error if the user is not authenticated or not an admin.
 * @returns The authenticated admin user record from the database.
 */
export async function requireAdmin(): Promise<AdminUser> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized: No active session");
    }

    const supabase = createAdminClient();
    const { data: user, error } = await supabase
        .from("partner_users")
        .select("id, clerk_user_id, role, org_id")
        .eq("clerk_user_id", userId)
        .single();

    if (error || !user) {
        console.error(`[Security] Failed to fetch user role for ${userId}:`, error);
        throw new Error("Unauthorized: User record not found");
    }

    if (user.role !== "admin") {
        console.warn(`[Security] Unauthorized access attempt by ${userId} (Role: ${user.role})`);
        throw new Error("Forbidden: insufficient privileges");
    }

    return user;
}
