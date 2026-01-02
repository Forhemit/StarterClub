"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

export function Step1bFinancialMetrics({ data, onSave }: StepProps) {
    const formatCurrency = (value: number | undefined) => {
        if (!value) return "";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    const parseCurrency = (value: string) => {
        const cleaned = value.replace(/[^0-9.]/g, "");
        return parseFloat(cleaned) || 0;
    };

    const calculateRunway = () => {
        if (!data.monthlyBurnRate || data.monthlyBurnRate === 0) return 0;
        const totalFunds = (data.tier1Buffer || 0) + (data.tier2Buffer || 0) + (data.currentFundBalance || 0);
        return Math.round(totalFunds / data.monthlyBurnRate);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Key Financial Metrics
                </h3>
                <p className="text-sm text-muted-foreground">Input your core revenue and expense data.</p>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        Annual Revenue
                    </Label>
                    <Input
                        placeholder="$0"
                        value={data.annualRevenue ? formatCurrency(data.annualRevenue) : ""}
                        onChange={(e) => onSave({ annualRevenue: parseCurrency(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        Monthly Burn Rate
                    </Label>
                    <Input
                        placeholder="$0"
                        value={data.monthlyBurnRate ? formatCurrency(data.monthlyBurnRate) : ""}
                        onChange={(e) => onSave({ monthlyBurnRate: parseCurrency(e.target.value) })}
                    />
                    <p className="text-[10px] text-muted-foreground">Net cash outflow per month</p>
                </div>
            </div>

            {/* Runway Indicator */}
            {data.monthlyBurnRate && data.monthlyBurnRate > 0 && (
                <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Estimated Runway</span>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-sm font-bold",
                                calculateRunway() < 3 ? "bg-red-100 text-red-700 border-red-200" :
                                    calculateRunway() < 6 ? "bg-amber-100 text-amber-700 border-amber-200" :
                                        "bg-green-100 text-green-700 border-green-200"
                            )}
                        >
                            {calculateRunway()} months
                        </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Based on current reserves and burn rate</p>
                </div>
            )}
        </div>
    );
}
