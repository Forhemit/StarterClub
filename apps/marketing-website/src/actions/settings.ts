"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getBusinessSettings() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    const { data: userBusiness } = await supabase
        .from("user_businesses")
        .select("timezone")
        .eq("user_id", userId)
        .single();

    if (!userBusiness) {
        // Return default if no business found yet (or handle as error depending on logic)
        return { timezone: "America/Los_Angeles" };
    }

    return { timezone: userBusiness.timezone || "America/Los_Angeles" };
}

export async function updateBusinessSettings(settings: { timezone: string }) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    // Get business ID first
    const { data: userBusiness } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!userBusiness) {
        return { error: "Business profile not found" };
    }

    const { error } = await supabase
        .from("user_businesses")
        .update({ timezone: settings.timezone })
        .eq("id", userBusiness.id);

    if (error) {
        console.error("Error updating settings:", error);
        return { error: "Failed to update settings" };
    }

    revalidatePath("/dashboard");
    return { success: true };
}
