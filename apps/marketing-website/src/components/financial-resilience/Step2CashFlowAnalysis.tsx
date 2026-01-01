"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Plus, Trash2, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const REVENUE_FREQUENCIES = ["Monthly", "Quarterly", "Annually", "One-time"];
const RELIABILITY_LEVELS = ["Stable", "Variable", "Seasonal", "At-Risk"];
const EXPENSE_TYPES = ["Payroll", "Rent", "Software", "Marketing", "Operations", "Other"];
const CASH_FLOW_CYCLES = [
    { id: "weekly", label: "Weekly" },
    { id: "biweekly", label: "Bi-Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "Quarterly" },
];

export function Step2CashFlowAnalysis({ data, onSave }: StepProps) {
    const [newRevenueName, setNewRevenueName] = useState("");
    const [newExpenseName, setNewExpenseName] = useState("");

    const streams = data.revenueStreams || [];
    const expenses = data.expenseCategories || [];

    const addRevenueStream = () => {
        if (!newRevenueName.trim()) return;
        const newStream = {
            id: crypto.randomUUID(),
            name: newRevenueName,
            amount: 0,
            frequency: "Monthly",
            reliability: "Stable"
        };
        onSave({ revenueStreams: [...streams, newStream] });
        setNewRevenueName("");
    };

    const updateRevenueStream = (id: string, field: string, value: string | number) => {
        const updated = streams.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );
        onSave({ revenueStreams: updated });
    };

    const removeRevenueStream = (id: string) => {
        onSave({ revenueStreams: streams.filter(s => s.id !== id) });
    };

    const addExpenseCategory = () => {
        if (!newExpenseName.trim()) return;
        const newExpense = {
            id: crypto.randomUUID(),
            name: newExpenseName,
            amount: 0,
            type: "Operations",
            fixedOrVariable: "fixed"
        };
        onSave({ expenseCategories: [...expenses, newExpense] });
        setNewExpenseName("");
    };

    const updateExpenseCategory = (id: string, field: string, value: string | number) => {
        const updated = expenses.map(e =>
            e.id === id ? { ...e, [field]: value } : e
        );
        onSave({ expenseCategories: updated });
    };

    const removeExpenseCategory = (id: string) => {
        onSave({ expenseCategories: expenses.filter(e => e.id !== id) });
    };

    const totalMonthlyRevenue = streams.reduce((sum, s) => {
        if (s.frequency === "Monthly") return sum + (s.amount || 0);
        if (s.frequency === "Quarterly") return sum + ((s.amount || 0) / 3);
        if (s.frequency === "Annually") return sum + ((s.amount || 0) / 12);
        return sum;
    }, 0);

    const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netCashFlow = totalMonthlyRevenue - totalMonthlyExpenses;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-primary" />
                    Cash Flow Analysis
                </h3>
                <p className="text-sm text-muted-foreground">Map your revenue streams and expense categories.</p>
            </div>

            {/* Revenue Streams */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Revenue Streams
                    </Label>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                        ${totalMonthlyRevenue.toLocaleString()}/mo
                    </Badge>
                </div>

                <div className="space-y-3">
                    {streams.map((stream) => (
                        <div key={stream.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border bg-card">
                            <div className="col-span-3">
                                <span className="text-sm font-medium">{stream.name}</span>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={stream.amount || ""}
                                    onChange={(e) => updateRevenueStream(stream.id, "amount", parseFloat(e.target.value) || 0)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-3">
                                <Select value={stream.frequency} onValueChange={(v) => updateRevenueStream(stream.id, "frequency", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REVENUE_FREQUENCIES.map(f => (
                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-3">
                                <Select value={stream.reliability} onValueChange={(v) => updateRevenueStream(stream.id, "reliability", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RELIABILITY_LEVELS.map(r => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeRevenueStream(stream.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Add revenue stream..."
                        value={newRevenueName}
                        onChange={(e) => setNewRevenueName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRevenueStream()}
                        className="flex-1"
                    />
                    <Button variant="outline" onClick={addRevenueStream}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                </div>
            </div>

            {/* Expense Categories */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-base flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        Monthly Expenses
                    </Label>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                        ${totalMonthlyExpenses.toLocaleString()}/mo
                    </Badge>
                </div>

                <div className="space-y-3">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border bg-card">
                            <div className="col-span-3">
                                <span className="text-sm font-medium">{expense.name}</span>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={expense.amount || ""}
                                    onChange={(e) => updateExpenseCategory(expense.id, "amount", parseFloat(e.target.value) || 0)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-3">
                                <Select value={expense.type} onValueChange={(v) => updateExpenseCategory(expense.id, "type", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EXPENSE_TYPES.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-3">
                                <Select value={expense.fixedOrVariable} onValueChange={(v) => updateExpenseCategory(expense.id, "fixedOrVariable", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                        <SelectItem value="variable">Variable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExpenseCategory(expense.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Add expense category..."
                        value={newExpenseName}
                        onChange={(e) => setNewExpenseName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addExpenseCategory()}
                        className="flex-1"
                    />
                    <Button variant="outline" onClick={addExpenseCategory}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                </div>
            </div>

            {/* Net Cash Flow Summary */}
            <div className={cn(
                "p-4 rounded-xl border",
                netCashFlow >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
                <div className="flex justify-between items-center">
                    <span className="font-medium">Net Monthly Cash Flow</span>
                    <span className={cn(
                        "text-xl font-bold",
                        netCashFlow >= 0 ? "text-green-700" : "text-red-700"
                    )}>
                        {netCashFlow >= 0 ? "+" : ""}{netCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </span>
                </div>
            </div>

            {/* Cash Flow Cycle */}
            <div className="space-y-3">
                <Label>Cash Flow Cycle</Label>
                <div className="flex flex-wrap gap-2">
                    {CASH_FLOW_CYCLES.map((cycle) => (
                        <div
                            key={cycle.id}
                            onClick={() => onSave({ cashFlowCycle: cycle.id })}
                            className={cn(
                                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                data.cashFlowCycle === cycle.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-muted bg-background text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            {cycle.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Collection/Payment Days */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed">
                <div className="space-y-2">
                    <Label className="text-sm">Avg. Collection Days (AR)</Label>
                    <Input
                        type="number"
                        value={data.averageCollectionDays || 30}
                        onChange={(e) => onSave({ averageCollectionDays: parseInt(e.target.value) || 30 })}
                    />
                    <p className="text-[10px] text-muted-foreground">Days to receive payment from customers</p>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm">Avg. Payment Days (AP)</Label>
                    <Input
                        type="number"
                        value={data.averagePaymentDays || 30}
                        onChange={(e) => onSave({ averagePaymentDays: parseInt(e.target.value) || 30 })}
                    />
                    <p className="text-[10px] text-muted-foreground">Days to pay your vendors</p>
                </div>
            </div>
        </div>
    );
}
