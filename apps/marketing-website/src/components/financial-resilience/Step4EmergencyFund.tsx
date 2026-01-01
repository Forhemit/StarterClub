"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Plus, Trash2, Target, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const FUNDING_SOURCE_TYPES = [
    "Operating Cash",
    "Line of Credit",
    "Investment Reserves",
    "Owner Contribution",
    "Insurance Payout",
    "Other"
];

const ACCESS_TIMES = [
    { id: "immediate", label: "Immediate" },
    { id: "1-3 days", label: "1-3 Days" },
    { id: "1 week", label: "1 Week" },
    { id: "2-4 weeks", label: "2-4 Weeks" },
];

// Color scale for coverage months
const getCoverageColor = (months: number) => {
    if (months <= 2) return { bg: "bg-red-600", text: "text-white", label: "Needs Improvement" };
    if (months <= 4) return { bg: "bg-orange-500", text: "text-white", label: "At Risk" };
    if (months <= 6) return { bg: "bg-amber-400", text: "text-amber-900", label: "Moderate" };
    if (months <= 9) return { bg: "bg-lime-400", text: "text-lime-900", label: "Good" };
    if (months <= 12) return { bg: "bg-green-500", text: "text-white", label: "Strong" };
    if (months <= 18) return { bg: "bg-emerald-500", text: "text-white", label: "Excellent" };
    return { bg: "bg-emerald-600", text: "text-white", label: "Fortress" };
};

export function Step4EmergencyFund({ data, onSave }: StepProps) {
    const [newSourceName, setNewSourceName] = useState("");
    const sources = data.fundingSources || [];

    const addFundingSource = () => {
        if (!newSourceName.trim()) return;
        const newSource = {
            id: crypto.randomUUID(),
            source: newSourceName,
            amount: 0,
            accessTime: "1-3 days",
            terms: ""
        };
        onSave({ fundingSources: [...sources, newSource] });
        setNewSourceName("");
    };

    const updateSource = (id: string, field: string, value: string | number) => {
        const updated = sources.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );
        onSave({ fundingSources: updated });
    };

    const removeSource = (id: string) => {
        onSave({ fundingSources: sources.filter(s => s.id !== id) });
    };

    const totalAvailableFunding = sources.reduce((sum, s) => sum + (s.amount || 0), 0);
    const fundProgress = data.targetFundAmount ? Math.min(100, ((data.currentFundBalance || 0) / data.targetFundAmount) * 100) : 0;
    const targetFromBurn = (data.monthlyBurnRate || 0) * (data.targetMonthsCoverage || 6);

    const currentMonths = data.targetMonthsCoverage || 6;
    const coverageStyle = getCoverageColor(currentMonths);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-primary" />
                    Emergency Fund Planning
                </h3>
                <p className="text-sm text-muted-foreground">Define your financial safety net targets.</p>
            </div>

            {/* Target Months Coverage */}
            <div className="space-y-4 p-5 bg-muted/20 rounded-xl border">
                <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        Target Months of Coverage
                    </Label>
                    <div className="flex items-center gap-2">
                        <Badge className={cn(coverageStyle.bg, coverageStyle.text, "text-xs")}>
                            {coverageStyle.label}
                        </Badge>
                        <Badge variant="outline" className="bg-background text-lg font-bold">
                            {currentMonths} months
                        </Badge>
                    </div>
                </div>

                {/* Gradient Color Bar */}
                <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-600 via-amber-400 via-50% to-emerald-600">
                    <div
                        className="absolute top-0 h-full w-1 bg-white shadow-lg border-2 border-slate-700 rounded-full transform -translate-x-1/2"
                        style={{ left: `${Math.min(100, (currentMonths / 24) * 100)}%` }}
                    />
                </div>

                <Slider
                    value={[currentMonths]}
                    min={1}
                    max={24}
                    step={1}
                    onValueChange={([v]) => onSave({ targetMonthsCoverage: v })}
                    className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="text-red-600 font-medium">1 mo (Needs Improvement)</span>
                    <span className="text-amber-600 font-medium">6 mo (Moderate)</span>
                    <span className="text-emerald-600 font-medium">24 mo (Fortress)</span>
                </div>
            </div>

            {/* Target vs Current Fund */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        Target Fund Amount
                    </Label>
                    <Input
                        type="number"
                        placeholder="$0"
                        value={data.targetFundAmount || ""}
                        onChange={(e) => onSave({ targetFundAmount: parseFloat(e.target.value) || 0 })}
                    />
                    {data.monthlyBurnRate && data.monthlyBurnRate > 0 && (
                        <p className="text-[10px] text-muted-foreground">
                            Based on burn rate: ${targetFromBurn.toLocaleString()} for {data.targetMonthsCoverage || 6} months
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        Current Fund Balance
                    </Label>
                    <Input
                        type="number"
                        placeholder="$0"
                        value={data.currentFundBalance || ""}
                        onChange={(e) => onSave({ currentFundBalance: parseFloat(e.target.value) || 0 })}
                    />
                </div>
            </div>

            {/* Progress Indicator */}
            {data.targetFundAmount && data.targetFundAmount > 0 && (
                <div className="space-y-2 p-4 rounded-xl border bg-card">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Fund Progress</span>
                        <span className={cn(
                            "font-bold",
                            fundProgress >= 100 ? "text-green-600" :
                                fundProgress >= 50 ? "text-amber-600" : "text-red-600"
                        )}>
                            {fundProgress.toFixed(0)}%
                        </span>
                    </div>
                    <Progress value={fundProgress} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${(data.currentFundBalance || 0).toLocaleString()} saved</span>
                        <span>${(data.targetFundAmount - (data.currentFundBalance || 0)).toLocaleString()} to go</span>
                    </div>
                </div>
            )}

            {/* Funding Sources */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex justify-between items-center">
                    <Label className="text-base">Available Funding Sources</Label>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                        ${totalAvailableFunding.toLocaleString()} total
                    </Badge>
                </div>

                <div className="space-y-3">
                    {sources.map((source) => (
                        <div key={source.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border bg-card">
                            <div className="col-span-3">
                                <Select value={source.source} onValueChange={(v) => updateSource(source.id, "source", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FUNDING_SOURCE_TYPES.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={source.amount || ""}
                                    onChange={(e) => updateSource(source.id, "amount", parseFloat(e.target.value) || 0)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-2">
                                <Select value={source.accessTime} onValueChange={(v) => updateSource(source.id, "accessTime", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACCESS_TIMES.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-3">
                                <Input
                                    placeholder="Terms/Notes"
                                    value={source.terms || ""}
                                    onChange={(e) => updateSource(source.id, "terms", e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSource(source.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Select value={newSourceName} onValueChange={setNewSourceName}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select funding source type..." />
                        </SelectTrigger>
                        <SelectContent>
                            {FUNDING_SOURCE_TYPES.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={addFundingSource} disabled={!newSourceName}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                </div>
            </div>
        </div>
    );
}
