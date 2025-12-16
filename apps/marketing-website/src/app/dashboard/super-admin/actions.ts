"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CreateOrgSchema, ResourceAssetSchema, CaseStudySchema } from "./schemas";
import { generateSecureToken, hashApiKey } from "@/lib/server/security";

// Helper result type
type ActionResult<T = null> = {
    success: boolean;
    data?: T;
    error?: string;
};

// --- SECURITY WRAPPER ---

async function checkAdmin() {
    const { userId } = await auth();
    if (!userId) return { allowed: false, userId: null };

    // Optimistic check: ideally we cache this claims or use custom claims
    // For now, DB check is safest
    const supabase = createAdminClient();
    const { data: user } = await supabase.from("partner_users").select("role").eq("clerk_user_id", userId).single();

    return { allowed: user?.role === 'admin', userId };
}

async function logAudit(userId: string | null, action: string, resourceType: string, resourceId: string, metadata: any = {}) {
    if (!userId) return;
    try {
        const supabase = createAdminClient();
        await supabase.from("audit_logs").insert({
            actor_id: userId,
            action,
            resource_type: resourceType,
            resource_id: resourceId,
            metadata
        });
    } catch (e) {
        console.error("Audit Log Error:", e);
    }
}

/**
 * Higher-order helper for secure admin actions.
 * - Checks Auth & Admin Role
 * - Validates Input (optional Zod)
 * - Runs Logic
 * - Handles Errors
 * - Logs Audit
 */
async function safeAdminAction<TInput, TOutput>(
    schema: z.ZodSchema<TInput> | null,
    input: TInput,
    audit: { action: string, resourceType: string, getId: (res: TOutput) => string, getMeta?: (data: TInput) => any },
    logic: (data: TInput) => Promise<TOutput>
): Promise<ActionResult<TOutput>> {
    try {
        // 1. Auth Check
        const { allowed, userId } = await checkAdmin();
        if (!allowed || !userId) return { success: false, error: "Unauthorized" };

        // 2. Validation
        let validData = input;
        if (schema) {
            const parsed = schema.safeParse(input);
            if (!parsed.success) {
                return { success: false, error: parsed.error.issues.map((e: any) => e.message).join(", ") };
            }
            validData = parsed.data;
        }

        // 3. Logic
        const result = await logic(validData);

        // 4. Audit
        await logAudit(
            userId,
            audit.action,
            audit.resourceType,
            audit.getId(result),
            audit.getMeta ? audit.getMeta(validData) : validData
        );

        return { success: true, data: result };

    } catch (e: any) {
        console.error("Action Error:", e);
        return { success: false, error: e.message || "Internal Server Error" };
    }
}


// --- USERS & ORGS ---

export async function createOrgAction(name: string) {
    return safeAdminAction(
        CreateOrgSchema,
        { name },
        { action: "create", resourceType: "partner_org", getId: (r: any) => r.id },
        async (data) => {
            const supabase = createAdminClient();
            const { data: res, error } = await supabase.from("partner_orgs").insert(data).select().single();
            if (error) throw error;
            revalidatePath("/partners/admin/users");
            return res;
        }
    );
}

export async function createUserAction(clerkId: string) {
    return safeAdminAction(
        z.object({ clerkId: z.string() }),
        { clerkId },
        { action: "create", resourceType: "partner_user", getId: (r: any) => r.id },
        async (data) => {
            const supabase = createAdminClient();
            const { data: res, error } = await supabase.from("partner_users").insert({ clerk_user_id: data.clerkId, role: "partner" }).select().single();
            if (error) throw error;
            revalidatePath("/partners/admin/users");
            return res;
        }
    );
}

// Simple updates (no complex schema needed usually, simplistic for now)
export async function linkUserOrgAction(userId: string, orgId: string | null) {
    // Manually wrapping for simple ID-based updates where schema overhead is high
    const { allowed, userId: actorId } = await checkAdmin();
    if (!allowed) return { success: false, error: "Unauthorized" };
    try {
        const supabase = createAdminClient();
        const { error } = await supabase.from("partner_users").update({ org_id: orgId }).eq("id", userId);
        if (error) throw error;
        await logAudit(actorId, "update", "partner_user", userId, { change: "link_org", org_id: orgId });
        revalidatePath("/partners/admin/users");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateUserRoleAction(userId: string, role: string) {
    const { allowed, userId: actorId } = await checkAdmin();
    if (!allowed) return { success: false, error: "Unauthorized" };
    try {
        const supabase = createAdminClient();
        const { error } = await supabase.from("partner_users").update({ role }).eq("id", userId);
        if (error) throw error;
        await logAudit(actorId, "update", "partner_user", userId, { change: "update_role", role });
        revalidatePath("/partners/admin/users");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// --- RESOURCES ---

export async function createResourceAction(data: any) {
    return safeAdminAction(
        ResourceAssetSchema,
        data,
        { action: "create", resourceType: "resource_asset", getId: (r: any) => r.id, getMeta: (d) => ({ title: d.title, type: d.doc_type }) },
        async (validData) => {
            const { userId } = await auth(); // Need author_id
            const supabase = createAdminClient();

            // Map author_id from Clerk userId (we need the UUID from partner_users really, but let's see if we can get it)
            // Ideally checkAdmin returns the UUID. Let's optimize checkAdmin to return it.
            // For now, fetch it again or optimistically assume we can insert without it if nullable (it isn't).
            const { data: user } = await supabase.from("partner_users").select("id").eq("clerk_user_id", userId).single();
            if (!user) throw new Error("User not found");

            const payload = {
                ...validData,
                author_id: user.id
            };

            const { data: res, error } = await supabase.from("resource_assets").insert(payload).select().single();
            if (error) throw error;
            revalidatePath("/partners/resources");
            revalidatePath("/partners/admin/resources");
            return res;
        }
    );
}

export async function updateResourceAction(id: string, data: any) {
    return safeAdminAction(
        ResourceAssetSchema.partial(), // Allow partial updates
        data,
        { action: "update", resourceType: "resource_asset", getId: () => id, getMeta: (d) => d },
        async (validData) => {
            const supabase = createAdminClient();
            const { data: res, error } = await supabase.from("resource_assets").update(validData).eq("id", id).select().single();
            if (error) throw error;
            revalidatePath("/partners/resources");
            revalidatePath("/partners/admin/resources");
            return res;
        }
    );
}

export async function deleteResourceAction(id: string) {
    const { allowed, userId: actorId } = await checkAdmin();
    if (!allowed) return { success: false, error: "Unauthorized" };
    try {
        const supabase = createAdminClient();
        const { error } = await supabase.from("resource_assets").delete().eq("id", id);
        if (error) throw error;
        await logAudit(actorId, "delete", "resource_asset", id);
        revalidatePath("/partners/resources");
        revalidatePath("/partners/admin/resources");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// --- CASE STUDIES ---

export async function createCaseStudyAction(data: any) {
    return safeAdminAction(
        CaseStudySchema,
        data,
        { action: "create", resourceType: "case_study", getId: (r: any) => r.id, getMeta: (d) => ({ track: d.track }) },
        async (validData) => {
            const supabase = createAdminClient();
            const { data: res, error } = await supabase.from("case_studies").insert(validData).select().single();
            if (error) throw error;
            revalidatePath("/partners/case-studies");
            revalidatePath("/partners/admin/case-studies");
            return res;
        }
    );
}

export async function deleteCaseStudyAction(id: string) {
    const { allowed, userId: actorId } = await checkAdmin();
    if (!allowed) return { success: false, error: "Unauthorized" };
    try {
        const supabase = createAdminClient();
        const { error } = await supabase.from("case_studies").delete().eq("id", id);
        if (error) throw error;
        await logAudit(actorId, "delete", "case_study", id);
        revalidatePath("/partners/case-studies");
        revalidatePath("/partners/admin/case-studies");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// --- API KEYS ---

export async function createApiKeyAction(name: string, orgId: string | null = null) {
    // Validate custom input before logic
    if (!name) return { success: false, error: "Name required" };

    return safeAdminAction(
        null, // Already validated simply above, or could use schema
        { name, orgId },
        { action: "create", resourceType: "api_key", getId: (r: any) => r.id, getMeta: (d) => ({ name: d.name }) },
        async (data) => {
            // Generate Secure Token
            const rawKey = generateSecureToken(); // sk_....
            const keyHash = await hashApiKey(rawKey);   // SHA-256 hex

            const supabase = createAdminClient();
            const { data: res, error } = await supabase.from("api_keys").insert({
                name: data.name,
                org_id: data.orgId,
                key_hash: keyHash,
                status: 'active'
            }).select().single();

            if (error) throw error;

            revalidatePath("/partners/admin/api-keys");
            // Return rawKey to user ONCE. It is not in DB.
            return { ...res, key: rawKey };
        }
    );
}

export async function revokeApiKeyAction(id: string) {
    const { allowed, userId: actorId } = await checkAdmin();
    if (!allowed) return { success: false, error: "Unauthorized" };
    try {
        const supabase = createAdminClient();
        const { error } = await supabase.from("api_keys").update({ status: 'revoked' }).eq("id", id);
        if (error) throw error;
        await logAudit(actorId, "revoke", "api_key", id);
        revalidatePath("/partners/admin/api-keys");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
