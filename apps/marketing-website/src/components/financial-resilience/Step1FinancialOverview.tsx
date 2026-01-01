"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, TrendingDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const BUSINESS_TYPES = [
    { id: "saas", label: "SaaS", icon: "💻" },
    { id: "ecommerce", label: "E-Commerce", icon: "🛒" },
    { id: "services", label: "Services", icon: "🤝" },
    { id: "manufacturing", label: "Manufacturing", icon: "🏭" },
    { id: "retail", label: "Retail", icon: "🏪" },
    { id: "other", label: "Other", icon: "📦" },
];

const FISCAL_YEAR_ENDS = [
    { id: "december", label: "December" },
    { id: "march", label: "March" },
    { id: "june", label: "June" },
    { id: "september", label: "September" },
];

export function Step1FinancialOverview({ data, onSave }: StepProps) {
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
                    <Building2 className="w-5 h-5 text-primary" />
                    Business Financial Profile
                </h3>
                <p className="text-sm text-muted-foreground">Establish your financial baseline.</p>
            </div>

            {/* Business Type Selection */}
            <div className="space-y-3">
                <Label className="text-base">Business Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BUSINESS_TYPES.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => onSave({ businessType: type.id })}
                            className={cn(
                                "cursor-pointer rounded-xl border p-4 text-center transition-all hover:border-primary/50 relative overflow-hidden group",
                                data.businessType === type.id
                                    ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
                                    : "border-muted bg-card hover:bg-muted/30"
                            )}
                        >
                            <div className="text-2xl mb-2">{type.icon}</div>
                            <div className="text-sm font-medium">{type.label}</div>
                        </div>
                    ))}
                </div>
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

            {/* Fiscal Year End */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Fiscal Year End
                </Label>
                <div className="flex flex-wrap gap-2">
                    {FISCAL_YEAR_ENDS.map((fy) => (
                        <div
                            key={fy.id}
                            onClick={() => onSave({ fiscalYearEnd: fy.id })}
                            className={cn(
                                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all hover:bg-muted/50",
                                data.fiscalYearEnd === fy.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-muted bg-background text-muted-foreground"
                            )}
                        >
                            {fy.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
