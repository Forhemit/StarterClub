"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const BUSINESS_TYPES = [
    { id: "saas-ecommerce", label: "SaaS / E-commerce", icon: "💻" },
    { id: "services", label: "Services", icon: "🤝" },
    { id: "hybrid", label: "Hybrid Brick and Mortar / Online", icon: "🏭" },
    { id: "retail", label: "Retail", icon: "🏪" },
    { id: "other", label: "Other", icon: "📦" },
];

const FISCAL_YEAR_ENDS = [
    { id: "december", label: "December" },
    { id: "march", label: "March" },
    { id: "june", label: "June" },
    { id: "september", label: "September" },
    { id: "custom", label: "Custom" },
];

export function Step1FinancialOverview({ data, onSave }: StepProps) {
    const [showOtherBusinessType, setShowOtherBusinessType] = useState(
        data.businessType && !BUSINESS_TYPES.slice(0, -1).some(t => t.id === data.businessType)
    );
    const [showCustomFiscalYear, setShowCustomFiscalYear] = useState(
        data.fiscalYearEnd === "custom" || (data.fiscalYearEnd && !FISCAL_YEAR_ENDS.slice(0, -1).some(f => f.id === data.fiscalYearEnd))
    );

    const handleBusinessTypeSelect = (typeId: string) => {
        if (typeId === "other") {
            setShowOtherBusinessType(true);
            onSave({ businessType: "" });
        } else {
            setShowOtherBusinessType(false);
            onSave({ businessType: typeId });
        }
    };

    const handleFiscalYearSelect = (fyId: string) => {
        if (fyId === "custom") {
            setShowCustomFiscalYear(true);
            onSave({ fiscalYearEnd: "" });
        } else {
            setShowCustomFiscalYear(false);
            onSave({ fiscalYearEnd: fyId });
        }
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {BUSINESS_TYPES.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => handleBusinessTypeSelect(type.id)}
                            className={cn(
                                "cursor-pointer rounded-xl border p-4 text-center transition-all hover:border-primary/50 relative overflow-hidden group",
                                (type.id === "other" && showOtherBusinessType) || data.businessType === type.id
                                    ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
                                    : "border-muted bg-card hover:bg-muted/30"
                            )}
                        >
                            <div className="text-2xl mb-2">{type.icon}</div>
                            <div className="text-sm font-medium">{type.label}</div>
                        </div>
                    ))}
                </div>
                {showOtherBusinessType && (
                    <Input
                        placeholder="Enter your business type..."
                        value={data.businessType || ""}
                        onChange={(e) => onSave({ businessType: e.target.value })}
                        className="mt-2"
                        autoFocus
                    />
                )}
            </div>

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
                            onClick={() => handleFiscalYearSelect(fy.id)}
                            className={cn(
                                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all hover:bg-muted/50",
                                (fy.id === "custom" && showCustomFiscalYear) ||
                                    (fy.id !== "custom" && data.fiscalYearEnd === fy.id)
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-muted bg-background text-muted-foreground"
                            )}
                        >
                            {fy.label}
                        </div>
                    ))}
                </div>
                {showCustomFiscalYear && (
                    <Input
                        placeholder="Enter custom fiscal year end (e.g., January, February 15)..."
                        value={data.fiscalYearEnd === "custom" ? "" : (data.fiscalYearEnd || "")}
                        onChange={(e) => onSave({ fiscalYearEnd: e.target.value })}
                        className="mt-2"
                        autoFocus
                    />
                )}
            </div>
        </div>
    );
}
