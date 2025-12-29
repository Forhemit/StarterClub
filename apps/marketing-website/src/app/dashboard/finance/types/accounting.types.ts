/**
 * Accounting System Type Definitions
 * Following strict TypeScript conventions from GEMINI.md
 */

// ============================================
// Database Types (matching Supabase schema)
// ============================================

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type JournalEntryType = 'debit' | 'credit';

export interface LedgerAccount {
    id: string;
    account_code: string;
    account_name: string;
    type: AccountType;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface IncomeSource {
    id: string;
    source_name: string;
    description: string | null;
    is_system_default: boolean;
    created_at: string;
}

export interface JournalEntry {
    id: string;
    transaction_date: string;
    posted_at: string;
    description: string;
    income_source_id: string | null;
    external_reference_id: string | null;
    created_by_user_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface JournalEntryLine {
    id: string;
    journal_entry_id: string;
    ledger_account_id: string;
    amount: number;
    entry_type: JournalEntryType;
    description: string | null;
    created_at: string;
}

// ============================================
// View Types (from v_journal_entries, v_account_balances)
// ============================================

export interface JournalEntryView {
    journal_entry_id: string;
    transaction_date: string;
    entry_description: string;
    external_reference_id: string | null;
    source_name: string | null;
    line_id: string;
    account_code: string;
    account_name: string;
    account_type: AccountType;
    amount: number;
    entry_type: JournalEntryType;
    line_description: string | null;
}

export interface AccountBalance {
    account_id: string;
    account_code: string;
    account_name: string;
    type: AccountType;
    total_debits: number;
    total_credits: number;
    current_balance: number;
}

// ============================================
// Input Types
// ============================================

export interface JournalEntryLineInput {
    ledger_account_id: string;
    amount: number;
    entry_type: JournalEntryType;
    description?: string;
}

export interface JournalEntryInput {
    transaction_date: string;
    description: string;
    income_source_id?: string;
    external_reference_id?: string;
    lines: JournalEntryLineInput[];
}

// ============================================
// Dashboard / UI Types
// ============================================

export interface FinancialKPI {
    label: string;
    value: string | number;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    icon: string;
    color: 'green' | 'yellow' | 'red' | 'blue';
    detail?: string;
}

export interface TransactionQuickAdd {
    type: 'expense' | 'income' | 'transfer';
    amount: number;
    description: string;
    category: string;
}

// ============================================
// Gamification Types
// ============================================

export interface AccountingStreaks {
    balancedBooks: number;       // Days with balanced books
    onTimeClosing: number;       // Months closed on time
    perfectReconciliation: number; // Perfect reconciliations streak
}

export interface AccountingBadges {
    rookieAccountant: boolean;
    reconciliationMaster: boolean;
    auditReady: boolean;
    financialAnalyst: boolean;
}

export interface AccountingScores {
    accuracy: number;        // 0-100 based on error rate
    efficiency: number;      // 0-100 based on time to close
    completeness: number;    // 0-100 based on data entered
}

export interface AccountingGamification {
    streaks: AccountingStreaks;
    badges: AccountingBadges;
    scores: AccountingScores;
}

// ============================================
// Stripe Sync Types
// ============================================

export type SyncStatus = 'pending' | 'processed' | 'failed' | 'skipped';

export interface StripeSyncLog {
    id: string;
    stripe_event_id: string;
    stripe_object_id: string | null;
    event_type: string;
    status: SyncStatus;
    journal_entry_id: string | null;
    processing_error: string | null;
    processed_at: string | null;
    created_at: string;
}
