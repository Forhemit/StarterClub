'use server';

import { auth } from '@clerk/nextjs/server';
import { RoleService } from '@/lib/services/role.service';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function completeOnboarding(selectedRoles: string[], primaryRole: string, departmentIds: string[] = []) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    try {
        // Initialize Supabase with Service Role Key for admin operations
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 1. Get current active roles directly using Service Role to bypass RLS
        const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role_slug')
            .eq('clerk_user_id', userId)
            .eq('is_active', true)
            .lte('effective_from', new Date().toISOString())
            .or(`effective_until.is.null,effective_until.gt.${new Date().toISOString()}`);

        if (rolesError) {
            console.error("Error fetching user roles:", rolesError);
            throw new Error("Failed to fetch current roles");
        }

        const currentRoles = rolesData?.map((r: any) => r.role_slug) || [];

        // 2. Calculate diff
        const rolesToAdd = selectedRoles.filter(role => !currentRoles.includes(role));
        const rolesToRemove = currentRoles.filter(role => !selectedRoles.includes(role));

        // 3. Apply changes using Service Role (RoleService uses service key internally)

        // Add new roles
        for (const roleSlug of rolesToAdd) {
            await RoleService.assignRole(
                userId,
                roleSlug,
                'system',
                'User self-assigned during onboarding'
            );
        }

        // Remove deselected roles
        for (const roleSlug of rolesToRemove) {
            await RoleService.deactivateRole(
                userId,
                roleSlug,
                'system',
                'User deselected during onboarding'
            );
        }

        // 4. Set primary role
        if (primaryRole && selectedRoles.includes(primaryRole)) {
            await RoleService.setPrimaryRole(userId, primaryRole);
        }

        // 5. Save Departments
        // (Reusing the same supabase client instance)


        // Get current active departments
        const { data: currentDepts } = await supabase
            .from('user_departments')
            .select('department_id')
            .eq('user_id', userId);

        const currentDeptIds = currentDepts?.map(d => d.department_id) || [];

        // Determine additions and removals
        const deptsToAdd = departmentIds.filter(id => !currentDeptIds.includes(id));
        const deptsToRemove = currentDeptIds.filter(id => !departmentIds.includes(id));

        // Remove deselected departments (Hard Delete as per schema)
        if (deptsToRemove.length > 0) {
            await supabase
                .from('user_departments')
                .delete()
                .eq('user_id', userId)
                .in('department_id', deptsToRemove);
        }

        // Add new departments
        if (deptsToAdd.length > 0) {
            const updates = deptsToAdd.map(deptId => ({
                user_id: userId,
                department_id: deptId,
                is_primary: false // Default to false for now
            }));

            const { error: deptError } = await supabase.from('user_departments').insert(updates);
            if (deptError) {
                console.error('Error saving departments:', deptError);
                // Don't throw here, partial success is better than total failure?
                // Or maybe throw? Let's just log for now to allow profile update.
            }
        }

        // 6. Update profile completion status
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                onboarding_completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (updateError) {
            console.error('Error updating profile completion:', updateError);
            throw new Error('Failed to update profile');
        }

    } catch (error) {
        console.error('Onboarding Server Action Error:', error);
        throw error; // Re-throw to be caught by client
    }

    // 6. Revalidate cache
    revalidatePath('/dashboard');
    revalidatePath('/onboarding');

    // Return success - client will handle redirect
    return { success: true };
}

export async function skipOnboarding() {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    await supabase
        .from('profiles')
        .update({
            onboarding_completed_at: null, // Reset timestamp
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    revalidatePath('/dashboard');
    return { success: true };
}
