'use server';

import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Zod Schemas for Validation
const JournalEntryLineSchema = z.object({
    ledger_account_id: z.string().uuid(),
    amount: z.number().positive(),
    entry_type: z.enum(['debit', 'credit']),
    description: z.string().optional(),
});

const JournalEntrySchema = z.object({
    transaction_date: z.string(), // ISO Date
    description: z.string().min(1, 'Description is required'),
    income_source_id: z.string().uuid().optional(),
    external_reference_id: z.string().optional(),
    lines: z.array(JournalEntryLineSchema).min(2, 'At least 2 lines are required'),
});

export type JournalEntryInput = z.infer<typeof JournalEntrySchema>;

export async function getChartOfAccounts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('ledger_accounts')
        .select('*')
        .order('account_code', { ascending: true });

    if (error) throw new Error(`Failed to fetch accounts: ${error.message}`);
    return data;
}

export async function getIncomeSources() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('income_sources')
        .select('*')
        .order('source_name', { ascending: true });

    if (error) throw new Error(`Failed to fetch income sources: ${error.message}`);
    return data;
}

export async function createJournalEntry(input: JournalEntryInput) {
    const supabase = await createClient();

    // Validate Input
    const parsed = JournalEntrySchema.safeParse(input);
    if (!parsed.success) {
        return { error: parsed.error.format() };
    }

    const { transaction_date, description, income_source_id, external_reference_id, lines } = parsed.data;

    // Validate Credits = Debits
    const totalDebits = lines
        .filter((l) => l.entry_type === 'debit')
        .reduce((sum, l) => sum + l.amount, 0);
    const totalCredits = lines
        .filter((l) => l.entry_type === 'credit')
        .reduce((sum, l) => sum + l.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
        return { error: `Debits ($${totalDebits}) must equal Credits ($${totalCredits})` };
    }

    // Transaction
    // Note: Supabase JS doesn't support complex transactions easily without RPC, 
    // but we can just do sequential inserts and assume rollback isn't trivial without RPC.
    // Ideally, use an RPC or just be careful. 
    // For 'Robust' implementation, we'll try to use standard inserts.

    const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
            transaction_date,
            description,
            income_source_id,
            external_reference_id,
        })
        .select()
        .single();

    if (entryError || !entry) {
        return { error: `Failed to create entry: ${entryError?.message}` };
    }

    const linesWithId = lines.map((l) => ({
        journal_entry_id: entry.id,
        ...l,
    }));

    const { error: linesError } = await supabase.from('journal_entry_lines').insert(linesWithId);

    if (linesError) {
        // Ideally delete the entry if lines fail to avoid orphan
        await supabase.from('journal_entries').delete().eq('id', entry.id);
        return { error: `Failed to create lines: ${linesError.message}` };
    }

    revalidatePath('/admin/finance');
    return { success: true, id: entry.id };
}

export async function getJournalEntries(limit = 50) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('v_journal_entries')
        .select('*')
        .order('transaction_date', { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);
    return data;
}
