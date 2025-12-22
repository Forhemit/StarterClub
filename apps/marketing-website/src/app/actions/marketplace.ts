'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMarketplaceModules() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('marketplace_modules') // Use the new View
        .select('*');

    if (error) throw error;
    return data;
}

export async function installModule(businessId: string, moduleId: string) {
    const supabase = await createSupabaseServerClient();

    // The database function install_module_for_business handles dependency checks and versioning
    const { error } = await supabase
        .rpc('install_module_for_business', {
            p_business_id: businessId,
            p_module_id: moduleId,
            p_config: {}
        });

    if (error) throw error;

    revalidatePath('/dashboard/partner/foundation');
    revalidatePath('/dashboard/partner/marketplace');

    return { success: true };
}

export async function activateModule(businessId: string, moduleId: string) {
    const supabase = await createSupabaseServerClient();

    // Update status in user_installed_modules
    const { error } = await supabase
        .from('user_installed_modules')
        .update({
            status: 'active',
            activated_at: new Date().toISOString()
        })
        .eq('user_business_id', businessId)
        .eq('module_id', moduleId);

    if (error) throw error;

    revalidatePath('/dashboard/partner/foundation');
    revalidatePath('/dashboard/partner/marketplace');

    return { success: true };
}

export async function uninstallModule(businessId: string, moduleId: string) {
    const supabase = await createSupabaseServerClient();

    // Delete from user_installed_modules
    const { error } = await supabase
        .from('user_installed_modules')
        .delete()
        .eq('user_business_id', businessId)
        .eq('module_id', moduleId);

    if (error) throw error;

    revalidatePath('/dashboard/partner/foundation');
    revalidatePath('/dashboard/partner/marketplace');

    return { success: true };
}
