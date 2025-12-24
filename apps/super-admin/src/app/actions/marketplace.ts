'use server'

import { createAdminClient } from '@/lib/privileged/supabase-admin';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/lib/audit';

export type ActionResult<T = null> = {
    success: boolean;
    data?: T;
    error?: string;
};

// --- Modules ---

export async function getModulesAction(options?: { search?: string; type?: string }) {
    try {
        await requireAdmin();
        const supabase = createAdminClient() as any;

        let query = supabase
            .from('modules')
            .select(`
                *,
                parent:parent_id(name),
                reviews:module_reviews(count),
                installs:user_installed_modules(count)
            `)
            .order('created_at', { ascending: false });

        if (options?.search) {
            query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
        }

        if (options?.type && options.type !== 'all') {
            query = query.eq('module_type', options.type);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform counts if needed or return raw
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getModuleByIdAction(id: string) {
    try {
        await requireAdmin();
        const supabase = createAdminClient() as any;

        const { data, error } = await supabase
            .from('modules')
            .select(`
                *,
                reviews:module_reviews(count),
                installs:user_installed_modules(count)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createModuleAction(moduleData: any) {
    try {
        const currentUser = await requireAdmin();
        const supabase = createAdminClient() as any;

        const { data, error } = await supabase
            .from('modules')
            .insert(moduleData)
            .select()
            .single();

        if (error) throw error;

        await logAdminAction(currentUser.clerk_user_id, "MODULE_CREATE", data.id, "MODULE", { name: data.name });
        revalidatePath('/marketplace');
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateModuleAction(moduleId: string, moduleData: any) {
    try {
        const currentUser = await requireAdmin();
        const supabase = createAdminClient() as any;

        const { data, error } = await supabase
            .from('modules')
            .update(moduleData)
            .eq('id', moduleId)
            .select()
            .single();

        if (error) throw error;

        await logAdminAction(currentUser.clerk_user_id, "MODULE_UPDATE", moduleId, "MODULE", { updates: moduleData });
        revalidatePath('/marketplace');
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteModuleAction(moduleId: string) {
    try {
        const currentUser = await requireAdmin();
        const supabase = createAdminClient() as any;

        const { error } = await supabase
            .from('modules')
            .delete()
            .eq('id', moduleId);

        if (error) throw error;

        await logAdminAction(currentUser.clerk_user_id, "MODULE_DELETE", moduleId, "MODULE", {});
        revalidatePath('/marketplace');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// --- Checklist Items (Global Pool) ---

export async function getChecklistItemsAction(search?: string) {
    try {
        await requireAdmin();
        const supabase = createAdminClient() as any;

        let query = supabase.from('checklist_items').select('*, category:categories(name)').order('created_at', { ascending: false });

        if (search) {
            query = query.ilike('title', `%${search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createChecklistItemAction(itemData: any) {
    try {
        const currentUser = await requireAdmin();
        const supabase = createAdminClient() as any;

        const { data, error } = await supabase
            .from('checklist_items')
            .insert(itemData)
            .select()
            .single();

        if (error) throw error;

        await logAdminAction(currentUser.clerk_user_id, "ITEM_CREATE", data.id, "CHECKLIST_ITEM", { title: data.title });
        // No strict path to revalidate unless we view lists of all items
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// --- Module Items (Linking) ---

export async function getModuleItemsAction(moduleId: string) {
    try {
        await requireAdmin();
        const supabase = createAdminClient() as any;

        // Get items linked to this module
        const { data, error } = await supabase
            .from('module_items')
            .select(`
                id,
                display_order,
                item:checklist_items (*)
            `)
            .eq('module_id', moduleId)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function addModuleItemAction(moduleId: string, itemId: string) {
    try {
        const currentUser = await requireAdmin();
        const supabase = createAdminClient() as any;

        // Check if already exists
        const { data: existing } = await supabase
            .from('module_items')
            .select('id')
            .eq('module_id', moduleId)
            .eq('item_id', itemId)
            .single();

        if (existing) return { success: false, error: "Item already in module" };

        const { data, error } = await supabase
            .from('module_items')
            .insert({ module_id: moduleId, item_id: itemId })
            .select()
            .single();

        if (error) throw error;

        await logAdminAction(currentUser.clerk_user_id, "MODULE_ADD_ITEM", moduleId, "MODULE", { itemId });
        revalidatePath(`/marketplace/${moduleId}`); // Assuming detail page
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function removeModuleItemAction(moduleItemId: string) {
    try {
        const currentUser = await requireAdmin();
        const supabase = createAdminClient() as any;

        const { error } = await supabase
            .from('module_items')
            .delete()
            .eq('id', moduleItemId);

        if (error) throw error;

        await logAdminAction(currentUser.clerk_user_id, "MODULE_REMOVE_ITEM", moduleItemId, "MODULE_ITEM", {});
        // Path reval handled by client or generic path
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
