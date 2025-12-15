"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateWaitlistStatus(id: string, status: string) {
    const supabase = createAdminClient();

    // Updates bypass RLS because we are using the admin client
    const { error } = await supabase
        .from('waitlist_submissions')
        .update({ status })
        .eq('id', id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/partners/admin/submissions');
    return { success: true };
}

export async function updateInquiryStatus(id: string, status: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('partner_inquiries')
        .update({ status })
        .eq('id', id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/partners/admin/submissions');
    return { success: true };
}
