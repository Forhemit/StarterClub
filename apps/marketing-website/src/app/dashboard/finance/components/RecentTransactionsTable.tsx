"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { JournalEntryView } from "../types/accounting.types";
import { formatCurrency, formatTransactionDate, getAccountTypeColor } from "../utils/formatting";

interface RecentTransactionsTableProps {
    transactions: JournalEntryView[];
    loading?: boolean;
    limit?: number;
}

/**
 * RecentTransactionsTable - Real-time journal entries view
 * Displays recent transactions with debit/credit indicators and drill-down links
 */
export function RecentTransactionsTable({
    transactions,
    loading = false,
    limit = 10,
}: RecentTransactionsTableProps) {
    const { theme } = useTheme();
    const isRacetrack = theme === "racetrack";

    // Group transactions by journal entry ID for a cleaner view
    const groupedTransactions = React.useMemo(() => {
        const grouped = new Map<string, JournalEntryView[]>();
        transactions.slice(0, limit * 2).forEach((tx) => {
            const existing = grouped.get(tx.journal_entry_id) || [];
            grouped.set(tx.journal_entry_id, [...existing, tx]);
        });
        return Array.from(grouped.entries()).slice(0, limit);
    }, [transactions, limit]);

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-16 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (groupedTransactions.length === 0) {
        return (
            <div className={cn(
                "text-center py-12 rounded-xl border",
                isRacetrack
                    ? "border-zinc-700 bg-zinc-900/50"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
            )}>
                <span className="text-4xl mb-4 block">📝</span>
                <p className={cn(
                    "text-sm",
                    isRacetrack ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                )}>
                    No transactions yet. Add your first entry to get started.
                </p>
                <Link
                    href="/dashboard/finance/journal/new"
                    className={cn(
                        "inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isRacetrack
                            ? "bg-[#00ff9d]/20 text-[#00ff9d] hover:bg-[#00ff9d]/30"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                >
                    Add Journal Entry
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className={cn(
            "rounded-xl border overflow-hidden",
            isRacetrack
                ? "border-zinc-700 bg-zinc-900/80"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        )}>
            {/* Header */}
            <div className={cn(
                "grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wider",
                isRacetrack
                    ? "bg-zinc-800/50 text-zinc-400 border-b border-zinc-700"
                    : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800"
            )}>
                <div className="col-span-2">Date</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Account</div>
                <div className="col-span-2 text-right">Debit</div>
                <div className="col-span-2 text-right">Credit</div>
            </div>

            {/* Transaction Rows */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {groupedTransactions.map(([entryId, lines], index) => (
                    <TransactionRow
                        key={entryId}
                        entryId={entryId}
                        lines={lines}
                        isRacetrack={isRacetrack}
                        isEven={index % 2 === 0}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className={cn(
                "px-4 py-3 border-t",
                isRacetrack
                    ? "border-zinc-700 bg-zinc-800/30"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30"
            )}>
                <Link
                    href="/dashboard/finance/journal"
                    className={cn(
                        "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                        isRacetrack
                            ? "text-[#00ff9d] hover:text-[#00ff9d]/80"
                            : "text-primary hover:text-primary/80"
                    )}
                >
                    View All Transactions
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>
        </div>
    );
}

interface TransactionRowProps {
    entryId: string;
    lines: JournalEntryView[];
    isRacetrack: boolean;
    isEven: boolean;
}

function TransactionRow({ entryId, lines, isRacetrack, isEven }: TransactionRowProps) {
    const firstLine = lines[0];
    const debits = lines.filter((l) => l.entry_type === "debit");
    const credits = lines.filter((l) => l.entry_type === "credit");
    const totalDebit = debits.reduce((sum, l) => sum + l.amount, 0);
    const totalCredit = credits.reduce((sum, l) => sum + l.amount, 0);

    return (
        <Link
            href={`/dashboard/finance/journal/${entryId}`}
            className={cn(
                "grid grid-cols-12 gap-4 px-4 py-3 items-center transition-colors group",
                isRacetrack
                    ? "hover:bg-zinc-800/50"
                    : isEven
                        ? "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        : "bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            )}
        >
            {/* Date */}
            <div className="col-span-2">
                <span className={cn(
                    "text-sm font-mono",
                    isRacetrack ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"
                )}>
                    {formatTransactionDate(firstLine.transaction_date)}
                </span>
            </div>

            {/* Description */}
            <div className="col-span-4">
                <p className={cn(
                    "text-sm font-medium truncate",
                    isRacetrack ? "text-white" : "text-zinc-900 dark:text-white"
                )}>
                    {firstLine.entry_description}
                </p>
                {firstLine.source_name && (
                    <span className={cn(
                        "text-xs",
                        isRacetrack ? "text-zinc-500" : "text-zinc-500 dark:text-zinc-500"
                    )}>
                        via {firstLine.source_name}
                    </span>
                )}
            </div>

            {/* Accounts (show first account) */}
            <div className="col-span-2">
                <span className={cn(
                    "text-xs font-mono px-2 py-0.5 rounded",
                    isRacetrack
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                )}>
                    {firstLine.account_code}
                </span>
                {lines.length > 2 && (
                    <span className={cn(
                        "ml-1 text-xs",
                        isRacetrack ? "text-zinc-500" : "text-zinc-400"
                    )}>
                        +{lines.length - 1}
                    </span>
                )}
            </div>

            {/* Debit */}
            <div className="col-span-2 text-right">
                {totalDebit > 0 && (
                    <span className={cn(
                        "text-sm font-mono font-medium",
                        isRacetrack ? "text-[#00ff9d]" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                        {formatCurrency(totalDebit)}
                    </span>
                )}
            </div>

            {/* Credit */}
            <div className="col-span-2 text-right">
                {totalCredit > 0 && (
                    <span className={cn(
                        "text-sm font-mono font-medium",
                        isRacetrack ? "text-[#00f0ff]" : "text-blue-600 dark:text-blue-400"
                    )}>
                        {formatCurrency(totalCredit)}
                    </span>
                )}
            </div>
        </Link>
    );
}

export default RecentTransactionsTable;
