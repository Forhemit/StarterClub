"use client";

import { useState } from "react";
import { MobileStepLayout } from "./MobileStepLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, Key, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Act3Props {
    data: any;
    onSave: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

const COMMON_DOMAINS = [
    "Payroll Processing", "Bank Access", "AWS Root", "Tax Filings", "Social Media"
];

export function Act3Assets({ data, onSave, onNext, onBack }: Act3Props) {
    const [suggestions] = useState(COMMON_DOMAINS);

    const handleAddDomain = (domain: string) => {
        const current = data.knowledgeItems || [];
        if (current.find((i: any) => i.domain === domain)) return;

        const newItem = {
            id: crypto.randomUUID(),
            domain,
            busFactor: "medium"
        };
        onSave({ ...data, knowledgeItems: [...current, newItem] });
    };

    const handleRemoveDomain = (id: string) => {
        const current = data.knowledgeItems || [];
        onSave({ ...data, knowledgeItems: current.filter((i: any) => i.id !== id) });
    };

    return (
        <MobileStepLayout
            title="Critical Assets"
            description="Knowledge and financial controls."
            currentStep={3}
            totalSteps={4}
            onBack={onBack}
            onNext={onNext}
        >
            <div className="space-y-8">
                {/* 1. Critical Knowledge Smart Defaults */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary" />
                        <Label className="text-base">Critical Knowledge Domains</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Tap to add common critical systems.</p>

                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(s => {
                            const isAdded = (data.knowledgeItems || []).find((i: any) => i.domain === s);
                            return (
                                <Badge
                                    key={s}
                                    variant={isAdded ? "default" : "outline"}
                                    className={cn("cursor-pointer py-1.5 px-3", isAdded ? "hover:bg-primary/90" : "hover:bg-muted")}
                                    onClick={() => !isAdded && handleAddDomain(s)}
                                >
                                    {s}
                                    {isAdded && <X className="w-3 h-3 ml-1" onClick={(e) => { e.stopPropagation(); handleRemoveDomain((data.knowledgeItems.find((i: any) => i.domain === s) as any).id) }} />}
                                    {!isAdded && <Plus className="w-3 h-3 ml-1" />}
                                </Badge>
                            );
                        })}
                    </div>

                    {/* Custom Add */}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full border-dashed text-muted-foreground" onClick={() => handleAddDomain("Custom Domain")}>
                            <Plus className="w-4 h-4 mr-2" /> Add Custom
                        </Button>
                    </div>
                </div>

                <div className="h-px bg-border w-full" />

                {/* 2. Spending Limits */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <Label className="text-base">Spending Limits</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase">OpEx Limit</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    className="pl-8"
                                    placeholder="5000"
                                    value={data.opexLimit || ""}
                                    onChange={(e) => onSave({ ...data, opexLimit: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase">CapEx Limit</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    className="pl-8"
                                    placeholder="10000"
                                    value={data.capexLimit || ""}
                                    onChange={(e) => onSave({ ...data, capexLimit: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MobileStepLayout>
    );
}
