"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getInstalledModules(businessId?: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    let targetBusinessId = businessId;

    // If no business ID provided, try to find the user's business
    if (!targetBusinessId) {
        const { data: userBusiness } = await supabase
            .from("user_businesses")
            .select("id")
            .eq("user_id", userId)
            .single();

        if (userBusiness) {
            targetBusinessId = userBusiness.id;
        }
    }

    if (!targetBusinessId) {
        return { data: [] }; // No business, so no modules
    }

    const { data, error } = await supabase
        .from("user_installed_modules")
        .select("module_id, status, installed_at")
        .eq("user_business_id", targetBusinessId)
        .eq("status", "active");

    if (error) {
        console.error("Error fetching installed modules:", error);
        return { error: error.message };
    }

    return { data: data || [] };
}

export async function installModule(moduleIdentifier: string, businessId?: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    let targetBusinessId = businessId;

    if (!targetBusinessId) {
        const { data: userBusiness } = await supabase
            .from("user_businesses")
            .select("id")
            .eq("user_id", userId)
            .single();

        if (userBusiness) {
            targetBusinessId = userBusiness.id;
        } else {
            return { error: "No business found for user" };
        }
    }

    // Resolve Module ID if it's a slug
    let targetModuleId = moduleIdentifier;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleIdentifier);

    if (!isUuid) {
        const { data: moduleData } = await supabase
            .from("modules")
            .select("id")
            .eq("slug", moduleIdentifier) // Query by slug first
            .single();

        if (!moduleData) {
            // Fallback to name check if slug fails (legacy)
            const { data: moduleByName } = await supabase
                .from("modules")
                .select("id")
                .eq("name", moduleIdentifier) // Or name?
                .single();
            if (moduleByName) targetModuleId = moduleByName.id;
            else return { error: `Module not found: ${moduleIdentifier}` };
        } else {
            targetModuleId = moduleData.id;
        }
    }

    // Check if already installed
    const { data: existing } = await supabase
        .from("user_installed_modules")
        .select("id")
        .eq("user_business_id", targetBusinessId)
        .eq("module_id", targetModuleId)
        .single();

    if (existing) {
        // Provide idempotent success or update status if it was disabled
        const { error: updateError } = await supabase
            .from("user_installed_modules")
            .update({ status: 'active', installed_at: new Date().toISOString() })
            .eq("id", existing.id);

        if (updateError) return { error: updateError.message };
    } else {
        // Insert new
        const { error: insertError } = await supabase
            .from("user_installed_modules")
            .insert({
                user_business_id: targetBusinessId,
                module_id: targetModuleId,
                installed_by: userId,
                status: 'active'
            });

        if (insertError) return { error: insertError.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/marketplace");
    revalidatePath(`/dashboard/marketplace/${moduleIdentifier}`);

    return { success: true };
}

export async function uninstallModule(moduleIdentifier: string, businessId?: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return { error: "Unauthorized" };

    let targetBusinessId = businessId;

    if (!targetBusinessId) {
        const { data: userBusiness } = await supabase
            .from("user_businesses")
            .select("id")
            .eq("user_id", userId)
            .single();

        targetBusinessId = userBusiness?.id;
    }

    if (!targetBusinessId) return { error: "No business found" };

    // Resolve Module ID if it's a slug
    let targetModuleId = moduleIdentifier;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleIdentifier);

    if (!isUuid) {
        const { data: moduleData } = await supabase
            .from("modules")
            .select("id")
            .eq("slug", moduleIdentifier)
            .single();

        if (moduleData) {
            targetModuleId = moduleData.id;
        } else {
            // Try name as backup
            const { data: moduleByName } = await supabase
                .from("modules")
                .select("id")
                .eq("name", moduleIdentifier)
                .single();
            if (moduleByName) targetModuleId = moduleByName.id;
            else return { error: `Module not found: ${moduleIdentifier}` };
        }
    }

    const { error } = await supabase
        .from("user_installed_modules")
        .update({ status: 'disabled' })
        .eq("user_business_id", targetBusinessId)
        .eq("module_id", targetModuleId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/marketplace");

    return { success: true };
}
// ... existing code ...

export async function isModuleInstalled(moduleIdentifier: string, byName: boolean = false) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return false;

    // Get user business
    const { data: userBusiness } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!userBusiness) return false;

    let targetModuleId = moduleIdentifier;

    if (byName) {
        const { data: moduleData } = await supabase
            .from("modules")
            .select("id")
            .eq("name", moduleIdentifier)
            .single();

        if (!moduleData) return false;
        targetModuleId = moduleData.id;
    }

    const { data } = await supabase
        .from("user_installed_modules")
        .select("id")
        .eq("user_business_id", userBusiness.id)
        .eq("module_id", targetModuleId)
        .eq("status", "active")
        .single();

    return !!data;
}
