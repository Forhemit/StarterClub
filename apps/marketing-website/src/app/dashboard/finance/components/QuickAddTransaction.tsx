"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Plus, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, X, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LedgerAccount } from "../types/accounting.types";

interface QuickAddTransactionProps {
    accounts: LedgerAccount[];
    onSubmit: (data: QuickTransactionData) => Promise<void>;
}

export interface QuickTransactionData {
    type: "expense" | "income" | "transfer";
    amount: number;
    description: string;
    accountId: string;
}

const TRANSACTION_TYPES = [
    { value: "expense", label: "Expense", icon: ArrowDownLeft, color: "rose" },
    { value: "income", label: "Income", icon: ArrowUpRight, color: "emerald" },
    { value: "transfer", label: "Transfer", icon: ArrowLeftRight, color: "blue" },
] as const;

/**
 * QuickAddTransaction - Simplified 3-click transaction entry
 * Goal: Add Transaction in 3 clicks (Click "New" → Fill form → Click "Save")
 */
export function QuickAddTransaction({ accounts, onSubmit }: QuickAddTransactionProps) {
    const { theme } = useTheme();
    const isRacetrack = theme === "racetrack";

    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [type, setType] = useState<"expense" | "income" | "transfer">("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [accountId, setAccountId] = useState("");

    // Filter accounts based on transaction type
    const filteredAccounts = React.useMemo(() => {
        if (type === "expense") {
            return accounts.filter((a) => a.type === "expense" || a.type === "asset");
        }
        if (type === "income") {
            return accounts.filter((a) => a.type === "revenue" || a.type === "asset");
        }
        return accounts.filter((a) => a.type === "asset");
    }, [accounts, type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !accountId) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                type,
                amount: parseFloat(amount),
                description,
                accountId,
            });

            // Success animation
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsOpen(false);
                resetForm();
            }, 1500);
        } catch (error) {
            console.error("Transaction failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setType("expense");
        setAmount("");
        setDescription("");
        setAccountId("");
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "gap-2 font-medium transition-all duration-300",
                    isRacetrack
                        ? "bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
            >
                <Plus className="h-4 w-4" />
                Quick Add
            </Button>
        );
    }

    return (
        <div className={cn(
            "rounded-xl border p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300",
            isRacetrack
                ? "border-zinc-700 bg-zinc-900/80"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        )}>
            {/* Success Overlay */}
            {showSuccess && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-500/90 rounded-xl animate-in zoom-in duration-200">
                    <div className="text-center text-white">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 animate-bounce" />
                        <p className="font-bold text-lg">Transaction Added!</p>
                        <p className="text-sm opacity-80">Books balanced perfectly ✨</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className={cn(
                    "font-semibold",
                    isRacetrack ? "text-white" : "text-zinc-900 dark:text-white"
                )}>
                    Quick Add Transaction
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setIsOpen(false);
                        resetForm();
                    }}
                    className="h-8 w-8"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Transaction Type Selector */}
                <div className="grid grid-cols-3 gap-2">
                    {TRANSACTION_TYPES.map((txType) => {
                        const Icon = txType.icon;
                        const isSelected = type === txType.value;
                        return (
                            <button
                                key={txType.value}
                                type="button"
                                onClick={() => setType(txType.value)}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-200",
                                    isSelected
                                        ? isRacetrack
                                            ? txType.color === "rose"
                                                ? "border-[#ff003c] bg-[#ff003c]/10 text-[#ff003c]"
                                                : txType.color === "emerald"
                                                    ? "border-[#00ff9d] bg-[#00ff9d]/10 text-[#00ff9d]"
                                                    : "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]"
                                            : txType.color === "rose"
                                                ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                                                : txType.color === "emerald"
                                                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                                                    : "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                                        : isRacetrack
                                            ? "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{txType.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <Label className={isRacetrack ? "text-zinc-400" : ""}>Amount</Label>
                    <div className="relative">
                        <span className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium",
                            isRacetrack ? "text-zinc-500" : "text-zinc-400"
                        )}>
                            $
                        </span>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={cn(
                                "pl-8 text-lg font-mono",
                                isRacetrack && "bg-zinc-800 border-zinc-700 text-white"
                            )}
                            required
                        />
                    </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <Label className={isRacetrack ? "text-zinc-400" : ""}>Description</Label>
                    <Input
                        placeholder="e.g., Office supplies from Staples"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={isRacetrack ? "bg-zinc-800 border-zinc-700 text-white" : ""}
                        required
                    />
                </div>

                {/* Account Selector */}
                <div className="space-y-2">
                    <Label className={isRacetrack ? "text-zinc-400" : ""}>Account</Label>
                    <Select value={accountId} onValueChange={setAccountId} required>
                        <SelectTrigger
                            className={isRacetrack ? "bg-zinc-800 border-zinc-700 text-white" : ""}
                        >
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    <span className="font-mono text-xs mr-2">{account.account_code}</span>
                                    {account.account_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isSubmitting || !amount || !description || !accountId}
                    className={cn(
                        "w-full gap-2 font-medium",
                        isRacetrack
                            ? "bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90"
                            : ""
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="h-4 w-4" />
                            Save Transaction
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}

export default QuickAddTransaction;
