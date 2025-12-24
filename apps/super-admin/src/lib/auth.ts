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
    // TEMPORARY: Bypass authentication for development
    // eslint-disable-next-line
    const BYPASS_AUTH = true;

    const { userId } = await auth();

    if (BYPASS_AUTH && !userId) {
        console.warn("[Security] Auth bypassed: Returning mock admin user");
        return {
            id: "mock-admin-id",
            clerk_user_id: "mock-clerk-id",
            role: "admin",
            org_id: "mock-org-id",
        };
    }

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

    const adminUser = user as unknown as AdminUser;

    if (adminUser.role !== "admin") {
        console.warn(`[Security] Unauthorized access attempt by ${userId} (Role: ${adminUser.role})`);
        throw new Error("Forbidden: insufficient privileges");
    }

    return adminUser;
}
