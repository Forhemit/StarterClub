/**
 * Accounting Formatting Utilities
 * Centralized formatters for currency, account codes, and financial data
 */

/**
 * Format a number as currency
 */
export function formatCurrency(
    amount: number,
    locale: string = 'en-US',
    currency: string = 'USD'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format a number as compact currency (e.g., $142.8K)
 */
export function formatCurrencyCompact(
    amount: number,
    locale: string = 'en-US',
    currency: string = 'USD'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(amount);
}

/**
 * Format account code with consistent padding
 */
export function formatAccountCode(code: string): string {
    return code.padStart(4, '0');
}

/**
 * Format debit/credit amount with sign indicator
 */
export function formatDebitCredit(
    amount: number,
    type: 'debit' | 'credit'
): string {
    const formatted = formatCurrency(amount);
    return type === 'debit' ? `Dr ${formatted}` : `Cr ${formatted}`;
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format date for accounting displays
 */
export function formatAccountingDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format date for transaction tables (compact)
 */
export function formatTransactionDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
    });
}

/**
 * Get color class based on account type
 */
export function getAccountTypeColor(type: string): string {
    const colors: Record<string, string> = {
        asset: 'text-blue-600 dark:text-blue-400',
        liability: 'text-purple-600 dark:text-purple-400',
        equity: 'text-indigo-600 dark:text-indigo-400',
        revenue: 'text-emerald-600 dark:text-emerald-400',
        expense: 'text-rose-600 dark:text-rose-400',
    };
    return colors[type] || 'text-zinc-600 dark:text-zinc-400';
}

/**
 * Get badge color class based on trend
 */
export function getTrendColor(trend: string): string {
    if (trend.startsWith('+')) {
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400';
    }
    if (trend.startsWith('-')) {
        return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400';
    }
    return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
}

/**
 * Calculate variance percentage
 */
export function calculateVariance(actual: number, target: number): number {
    if (target === 0) return 0;
    return ((actual - target) / target) * 100;
}
