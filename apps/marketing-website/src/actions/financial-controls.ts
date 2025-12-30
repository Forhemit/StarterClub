'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// --- Schemas ---

const financialSettingsSchema = z.object({
    id: z.string().optional(),
    reporting_currency: z.string().default('USD'),
    fiscal_year_end: z.string().default('12-31'),
    accounting_method: z.enum(['cash', 'accrual']).default('accrual'),
});

const financialAccountSchema = z.object({
    id: z.string().optional(),
    account_name: z.string().min(1, "Account name is required"),
    account_type: z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense', 'Bank', 'Other Current Asset', 'Fixed Asset', 'Accounts Payable', 'Other Current Liability', 'Cost of Goods Sold', 'Income']),
    detail_type: z.string().optional(),
    account_number: z.string().optional(),
    description: z.string().optional(),
});

const closeItemSchema = z.object({
    id: z.string().optional(),
    task_name: z.string().min(1, "Task name is required"),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'complete']).default('pending'),
    due_day: z.number().optional(),
    assigned_to: z.string().optional(),
});

// --- Actions ---

export async function createOrUpdateFinancialSettings(data: z.infer<typeof financialSettingsSchema>) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const parseResult = financialSettingsSchema.safeParse(data);
    if (!parseResult.success) return { error: parseResult.error.message };

    // Check if settings exist for user
    const { data: existing } = await supabase
        .from('financial_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

    const payload = {
        ...parseResult.data,
        user_id: userId
    };

    if (existing?.id) {
        // Update
        const { error } = await supabase
            .from('financial_settings')
            .update(payload)
            .eq('id', existing.id);
        if (error) throw new Error(error.message);
        return { id: existing.id };
    } else {
        // Insert
        const { data: newSettings, error } = await supabase
            .from('financial_settings')
            .insert(payload)
            .select('id')
            .single();
        if (error) throw new Error(error.message);
        return { id: newSettings.id };
    }
}

export async function getFinancialSettings() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) return null;

    const { data, error } = await supabase
        .from('financial_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') console.error(error);
    return data;
}

export async function createAccount(data: z.infer<typeof financialAccountSchema>) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Allow expanded types for now by relaxing validation or updating enum above
    const parseResult = financialAccountSchema.safeParse(data);
    if (!parseResult.success) return { error: parseResult.error.message };

    const payload = {
        ...parseResult.data,
        user_id: userId
    };

    const { data: newAccount, error } = await supabase
        .from('financial_accounts')
        .insert(payload)
        .select('id')
        .single();

    if (error) throw new Error(error.message);
    return { id: newAccount.id };
}

export async function getAccounts() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) return [];

    const { data, error } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('account_number', { ascending: true });

    if (error) console.error(error);

    return data || [];
}

export async function updateAccount(data: z.infer<typeof financialAccountSchema> & { id: string }) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Re-validate
    const parseResult = financialAccountSchema.safeParse(data);
    if (!parseResult.success) return { error: parseResult.error.message };

    const payload = {
        ...parseResult.data,
        user_id: userId
    };

    const { error } = await supabase
        .from('financial_accounts')
        .update(payload)
        .eq('id', data.id)
        .eq('user_id', userId); // Security check

    if (error) throw new Error(error.message);
    return { success: true };
}

export async function deleteAccount(id: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('financial_accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return { success: true };
}

// --- Template Actions ---

export async function getCoaTemplates() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) return [];

    const { data, error } = await supabase
        .from('financial_coa_templates')
        .select('*')
        .order('name');

    if (error) console.error(error);
    return data || [];
}

export async function importCoaTemplate(templateId: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Get template items
    const { data: items, error: itemsError } = await supabase
        .from('financial_coa_template_items')
        .select('*')
        .eq('template_id', templateId);

    if (itemsError) throw new Error(itemsError.message);
    if (!items || items.length === 0) return { count: 0 };

    // 2. Prepare bulk insert payload
    const payload = items.map(item => ({
        user_id: userId,
        account_name: item.account_name,
        account_type: item.account_type,
        detail_type: item.detail_type,
        account_number: item.account_number,
        description: item.description
    }));

    // 3. Bulk insert
    const { error: insertError } = await supabase
        .from('financial_accounts')
        .insert(payload);

    if (insertError) throw new Error(insertError.message);
    return { count: payload.length };
}

export async function createCloseItem(data: z.infer<typeof closeItemSchema>) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const parseResult = closeItemSchema.safeParse(data);
    if (!parseResult.success) return { error: parseResult.error.message };

    const payload = {
        ...parseResult.data,
        user_id: userId
    };

    const { data: newItem, error } = await supabase
        .from('monthly_close_items')
        .insert(payload)
        .select('id')
        .single();

    if (error) throw new Error(error.message);
    return { id: newItem.id };
}




export async function getCloseItems() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) return [];

    const { data, error } = await supabase
        .from('monthly_close_items')
        .select('*')
        .eq('user_id', userId)
        .order('due_day', { ascending: true });

    if (error) console.error(error);
    return data || [];
}

export async function resetFinancialData() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Delete in order to respect any FKs, although cascade might handle it

    // 1. Delete Accounts
    const { error: accountsError } = await supabase
        .from('financial_accounts')
        .delete()
        .eq('user_id', userId);
    if (accountsError) throw new Error(accountsError.message);

    // 2. Delete Close Items
    const { error: closeItemsError } = await supabase
        .from('monthly_close_items')
        .delete()
        .eq('user_id', userId);
    if (closeItemsError) throw new Error(closeItemsError.message);

    // 3. Delete Settings
    const { error: settingsError } = await supabase
        .from('financial_settings')
        .delete()
        .eq('user_id', userId);
    if (settingsError) throw new Error(settingsError.message);

    return { success: true };
}
