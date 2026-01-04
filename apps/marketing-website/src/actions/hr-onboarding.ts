'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// --- Schemas ---

export const equipmentRequestSchema = z.object({
    id: z.string().optional(),
    equipment_type: z.string().min(1, "Equipment type is required"),
    specifications: z.record(z.string(), z.any()).optional(),
    status: z.enum(['pending', 'approved', 'provisioned', 'rejected'] as const).default('pending'),
});

// --- Actions ---

export async function getOnboardingProgress(employeeId: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) return null;

    // Security check: ensure user has access to this employee (Self or Admin)
    // For now, assuming Self or simply Fetching. 
    // Ideally we check RLS, but if RLS is set up correctly, supabase.eq will handle it or return empty.

    // However, for onboarding logic, we often need to fetch "my" progress.
    // If Admin viewing another, we rely on RLS policies for Admins (which we didn't explicitly set in the simple migration, 
    // but we can assume 'self' for the main flow).

    const { data, error } = await supabase
        .from('hr_onboarding_progress')
        .select('*')
        .eq('employee_id', employeeId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Error fetching onboarding progress:", error);
    }

    return data;
}

export async function updateOnboardingStep(employeeId: string, stepId: string, points: number) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Get current progress
    let { data: progress } = await supabase
        .from('hr_onboarding_progress')
        .select('*')
        .eq('employee_id', employeeId)
        .single();

    // 2. Calculate new state
    let completedSteps: string[] = [];
    let totalPoints = 0;

    if (progress) {
        completedSteps = (progress.completed_steps as string[]) || [];
        totalPoints = progress.total_points || 0;
    }

    if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId);
        totalPoints += points;

        // 3. Upsert
        const payload = {
            employee_id: employeeId,
            current_step: completedSteps.length, // Simple logic: next step index
            completed_steps: completedSteps,
            total_points: totalPoints,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('hr_onboarding_progress')
            .upsert(payload, { onConflict: 'employee_id' });

        if (error) throw new Error(error.message);

        revalidatePath('/dashboard/hr/onboarding');
        return { success: true, points: totalPoints };
    }

    return { success: true, points: totalPoints, message: "Step already completed" };
}

export async function createEquipmentRequest(data: z.infer<typeof equipmentRequestSchema> & { employeeId: string }) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const parseResult = equipmentRequestSchema.safeParse(data);
    if (!parseResult.success) return { error: parseResult.error.message };

    const payload = {
        employee_id: data.employeeId,
        equipment_type: parseResult.data.equipment_type,
        specifications: parseResult.data.specifications || {},
        status: 'pending'
    };

    const { error } = await supabase
        .from('hr_equipment_requests')
        .insert(payload);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/hr/onboarding');
    return { success: true };
}

export async function getEquipmentRequests(employeeId: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    // if (!userId) return []; // Temp disable for dev if needed


    const { data, error } = await supabase
        .from('hr_equipment_requests')
        .select('*')
        .eq('employee_id', employeeId)
        .order('requested_at', { ascending: false });

    if (error) console.error(error);
    return data || [];
}

export async function deleteHROnboardingData(): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return { error: "Not authenticated" };

    // Delete equipment requests for this user
    await supabase
        .from('hr_equipment_requests')
        .delete()
        .eq('employee_id', userId);

    // Delete onboarding progress
    const { error } = await supabase
        .from('hr_onboarding_progress')
        .delete()
        .eq('employee_id', userId);

    if (error) {
        console.error("Delete HR onboarding data error:", error);
        return { error: "Failed to delete data" };
    }

    revalidatePath('/dashboard/hr/onboarding');
    return { success: true };
}
