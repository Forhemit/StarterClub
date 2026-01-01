"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, Trash2, AlertTriangle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const INSURANCE_TYPES = [
    "General Liability",
    "Professional Liability (E&O)",
    "Directors & Officers (D&O)",
    "Cyber Liability",
    "Property",
    "Workers' Compensation",
    "Business Interruption",
    "Key Person",
    "Employment Practices (EPLI)",
    "Commercial Auto",
    "Umbrella/Excess",
    "Other"
];

const GAP_PRIORITIES = ["Critical", "High", "Medium", "Low"];

export function Step6InsuranceCoverage({ data, onSave }: StepProps) {
    const [selectedType, setSelectedType] = useState("");
    const [newGapType, setNewGapType] = useState("");

    const policies = data.insurancePolicies || [];
    const gaps = data.insuranceGaps || [];

    const addPolicy = () => {
        if (!selectedType) return;
        const newPolicy = {
            id: crypto.randomUUID(),
            type: selectedType,
            provider: "",
            coverageAmount: 0,
            deductible: 0,
            premium: 0,
            expiryDate: "",
            policyNumber: ""
        };
        onSave({ insurancePolicies: [...policies, newPolicy] });
        setSelectedType("");
    };

    const updatePolicy = (id: string, field: string, value: string | number) => {
        const updated = policies.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        onSave({ insurancePolicies: updated });
    };

    const removePolicy = (id: string) => {
        onSave({ insurancePolicies: policies.filter(p => p.id !== id) });
    };

    const addGap = () => {
        if (!newGapType.trim()) return;
        const newGap = {
            id: crypto.randomUUID(),
            gapType: newGapType,
            description: "",
            priority: "Medium"
        };
        onSave({ insuranceGaps: [...gaps, newGap] });
        setNewGapType("");
    };

    const updateGap = (id: string, field: string, value: string) => {
        const updated = gaps.map(g =>
            g.id === id ? { ...g, [field]: value } : g
        );
        onSave({ insuranceGaps: updated });
    };

    const removeGap = (id: string) => {
        onSave({ insuranceGaps: gaps.filter(g => g.id !== id) });
    };

    const totalPremium = policies.reduce((sum, p) => sum + (p.premium || 0), 0);
    const totalCoverage = policies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0);

    const isExpiringSoon = (dateStr: string) => {
        if (!dateStr) return false;
        const expiry = new Date(dateStr);
        const now = new Date();
        const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30 && diffDays > 0;
    };

    const isExpired = (dateStr: string) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Insurance Coverage Review
                </h3>
                <p className="text-sm text-muted-foreground">Inventory your insurance policies and identify gaps.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-muted/30">
                    <div className="text-sm text-muted-foreground">Annual Premium</div>
                    <div className="text-xl font-bold">${totalPremium.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl border bg-muted/30">
                    <div className="text-sm text-muted-foreground">Total Coverage</div>
                    <div className="text-xl font-bold">${(totalCoverage / 1000000).toFixed(1)}M</div>
                </div>
            </div>

            {/* Policy Inventory */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-base">Policy Inventory</Label>
                    <Badge variant="outline">{policies.length} polic{policies.length !== 1 ? 'ies' : 'y'}</Badge>
                </div>

                <div className="space-y-3">
                    {policies.map((policy) => (
                        <div key={policy.id} className="p-4 rounded-xl border bg-card space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                        {policy.type}
                                    </Badge>
                                    {isExpired(policy.expiryDate) && (
                                        <Badge className="bg-red-500">Expired</Badge>
                                    )}
                                    {isExpiringSoon(policy.expiryDate) && !isExpired(policy.expiryDate) && (
                                        <Badge className="bg-amber-500">Expiring Soon</Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removePolicy(policy.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Provider</Label>
                                    <Input
                                        placeholder="Insurance Co."
                                        value={policy.provider}
                                        onChange={(e) => updatePolicy(policy.id, "provider", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Coverage Amount</Label>
                                    <Input
                                        type="number"
                                        placeholder="$0"
                                        value={policy.coverageAmount || ""}
                                        onChange={(e) => updatePolicy(policy.id, "coverageAmount", parseFloat(e.target.value) || 0)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Annual Premium</Label>
                                    <Input
                                        type="number"
                                        placeholder="$0"
                                        value={policy.premium || ""}
                                        onChange={(e) => updatePolicy(policy.id, "premium", parseFloat(e.target.value) || 0)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Expiry Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={policy.expiryDate}
                                        onChange={(e) => updatePolicy(policy.id, "expiryDate", e.target.value)}
                                        className={cn("h-8 text-sm",
                                            isExpired(policy.expiryDate) ? "border-red-500" :
                                                isExpiringSoon(policy.expiryDate) ? "border-amber-500" : ""
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Deductible</Label>
                                    <Input
                                        type="number"
                                        placeholder="$0"
                                        value={policy.deductible || ""}
                                        onChange={(e) => updatePolicy(policy.id, "deductible", parseFloat(e.target.value) || 0)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Policy Number</Label>
                                    <Input
                                        placeholder="POL-123456"
                                        value={policy.policyNumber}
                                        onChange={(e) => updatePolicy(policy.id, "policyNumber", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select policy type..." />
                        </SelectTrigger>
                        <SelectContent>
                            {INSURANCE_TYPES.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={addPolicy} disabled={!selectedType}>
                        <Plus className="w-4 h-4 mr-1" /> Add Policy
                    </Button>
                </div>
            </div>

            {/* Coverage Gaps */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex justify-between items-center">
                    <Label className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Identified Coverage Gaps
                    </Label>
                    <Badge variant="outline" className={gaps.length > 0 ? "bg-amber-50 text-amber-700" : ""}>
                        {gaps.length} gap{gaps.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                <div className="space-y-3">
                    {gaps.map((gap) => (
                        <div key={gap.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border bg-amber-50/50">
                            <div className="col-span-3">
                                <Input
                                    placeholder="Gap type"
                                    value={gap.gapType}
                                    onChange={(e) => updateGap(gap.id, "gapType", e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-5">
                                <Input
                                    placeholder="Description"
                                    value={gap.description}
                                    onChange={(e) => updateGap(gap.id, "description", e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-3">
                                <Select value={gap.priority} onValueChange={(v) => updateGap(gap.id, "priority", v)}>
                                    <SelectTrigger className={cn("h-8 text-sm",
                                        gap.priority === "Critical" ? "border-red-300 bg-red-50" :
                                            gap.priority === "High" ? "border-orange-300 bg-orange-50" :
                                                gap.priority === "Medium" ? "border-amber-300 bg-amber-50" :
                                                    "border-slate-300"
                                    )}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GAP_PRIORITIES.map(p => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeGap(gap.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Add coverage gap..."
                        value={newGapType}
                        onChange={(e) => setNewGapType(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addGap()}
                        className="flex-1"
                    />
                    <Button variant="outline" onClick={addGap} disabled={!newGapType.trim()}>
                        <Plus className="w-4 h-4 mr-1" /> Add Gap
                    </Button>
                </div>
            </div>
        </div>
    );
}
