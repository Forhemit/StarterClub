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

export async function installModule(moduleId: string, businessId?: string) {
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

    // Check if already installed
    const { data: existing } = await supabase
        .from("user_installed_modules")
        .select("id")
        .eq("user_business_id", targetBusinessId)
        .eq("module_id", moduleId)
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
                module_id: moduleId,
                installed_by: userId,
                status: 'active'
            });

        if (insertError) return { error: insertError.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/marketplace");
    revalidatePath(`/dashboard/marketplace/${moduleId}`);

    return { success: true };
}

export async function uninstallModule(moduleId: string, businessId?: string) {
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

    const { error } = await supabase
        .from("user_installed_modules")
        .update({ status: 'disabled' })
        .eq("user_business_id", targetBusinessId)
        .eq("module_id", moduleId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/marketplace");

    return { success: true };
}
