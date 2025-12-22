'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getChecklistData() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // 1. Fetch user businesses (for this MVP, we'll take the first one or create one if missing)
    let { data: business } = await supabase
        .from('user_businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (!business) {
        // Auto-create a default business for the user if none exists
        const { data: newBusiness, error: createError } = await supabase
            .from('user_businesses')
            .insert({ user_id: user.id, business_name: 'My Startup' })
            .select()
            .single();

        if (createError) throw createError;
        business = newBusiness;
    }

    // 2. Fetch all modules and categories
    const [modulesRes, categoriesRes, statusesRes] = await Promise.all([
        supabase.from('modules').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('statuses').select('*')
    ]);

    // 3. Fetch all items (checklist_items) and their module links
    const { data: items } = await supabase
        .from('checklist_items')
        .select(`
      *,
      category:categories(id, name),
      module_items(module_id)
    `);

    // 4. Fetch progress for this specific business
    const { data: progress } = await supabase
        .from('user_checklist_status')
        .select('*, status:statuses(name)')
        .eq('user_business_id', business.id);

    // 5. Fetch installed/staged module instances
    const { data: instances } = await supabase
        .from('user_installed_modules')
        .select('module_id, status')
        .eq('user_business_id', business.id);

    const activeModuleIds = instances?.filter(i => i.status === 'active').map(i => i.module_id) || [];
    const stagedModuleIds = instances?.filter(i => ['staged', 'installed'].includes(i.status)).map(i => i.module_id) || [];

    return {
        business,
        modules: modulesRes.data || [],
        categories: categoriesRes.data || [],
        statuses: statusesRes.data || [],
        items: items || [],
        progress: progress || [],
        activeModuleIds,
        stagedModuleIds
    };
}

export async function toggleChecklistItem(businessId: string, itemId: string, statusName: 'complete' | 'not_started' | 'in_progress') {
    const supabase = await createSupabaseServerClient();

    // Get status ID
    const { data: status } = await supabase
        .from('statuses')
        .select('*')
        .eq('name', statusName)
        .single();

    if (!status) throw new Error('Invalid status');

    const { error } = await supabase
        .from('user_checklist_status')
        .upsert({
            user_business_id: businessId,
            item_id: itemId,
            status_id: status.id,
            completed_at: statusName === 'complete' ? new Date().toISOString() : null
        }, { onConflict: 'user_business_id, item_id' });

    if (error) throw error;

    revalidatePath('/dashboard/partner/foundation');
}

export async function updateItemMetadata(businessId: string, itemId: string, metadata: any) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from('user_checklist_status')
        .upsert({
            user_business_id: businessId,
            item_id: itemId,
            metadata: metadata
        }, { onConflict: 'user_business_id, item_id' });

    if (error) throw error;
    revalidatePath('/dashboard/partner/foundation');
}
