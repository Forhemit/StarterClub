"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Plus, Trash2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const ACCOUNT_TYPES = [
    "Checking",
    "Savings",
    "Money Market",
    "CD",
    "Line of Credit",
    "Investment Account",
    "Other"
];

const TIER_DESCRIPTIONS = [
    { tier: 1, label: "Tier 1 – Immediate", description: "Instantly accessible (checking, petty cash)", color: "text-green-700 bg-green-50 border-green-200" },
    { tier: 2, label: "Tier 2 – Short-term", description: "1-7 day access (savings, money market)", color: "text-blue-700 bg-blue-50 border-blue-200" },
    { tier: 3, label: "Tier 3 – Medium-term", description: "7-30 day access (CDs, credit lines)", color: "text-purple-700 bg-purple-50 border-purple-200" },
];

export function Step5LiquidityBuffers({ data, onSave }: StepProps) {
    const [newInstitution, setNewInstitution] = useState("");
    const locations = data.bufferLocations || [];

    const addLocation = () => {
        if (!newInstitution.trim()) return;
        const newLocation = {
            id: crypto.randomUUID(),
            institution: newInstitution,
            accountType: "Checking",
            balance: 0,
            tier: 1
        };
        onSave({ bufferLocations: [...locations, newLocation] });
        setNewInstitution("");
    };

    const updateLocation = (id: string, field: string, value: string | number) => {
        const updated = locations.map(l =>
            l.id === id ? { ...l, [field]: value } : l
        );
        onSave({ bufferLocations: updated });
    };

    const removeLocation = (id: string) => {
        onSave({ bufferLocations: locations.filter(l => l.id !== id) });
    };

    // Calculate tier totals from locations
    const calculateTierTotal = (tier: number) => {
        return locations.filter(l => l.tier === tier).reduce((sum, l) => sum + (l.balance || 0), 0);
    };

    const totalLiquidity = (data.tier1Buffer || 0) + (data.tier2Buffer || 0) + (data.tier3Buffer || 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Liquidity Buffers
                </h3>
                <p className="text-sm text-muted-foreground">Configure tiered cash reserves by access speed.</p>
            </div>

            {/* Tier Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIER_DESCRIPTIONS.map((tierInfo) => (
                    <div
                        key={tierInfo.tier}
                        className={cn("p-4 rounded-xl border space-y-3", tierInfo.color)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-semibold text-sm">{tierInfo.label}</div>
                                <div className="text-[10px] opacity-80 mt-0.5">{tierInfo.description}</div>
                            </div>
                            <Badge variant="outline" className="bg-white/50">
                                {tierInfo.tier === 1 ? calculateTierTotal(1) || data.tier1Buffer || 0 :
                                    tierInfo.tier === 2 ? calculateTierTotal(2) || data.tier2Buffer || 0 :
                                        calculateTierTotal(3) || data.tier3Buffer || 0}
                            </Badge>
                        </div>
                        <Input
                            type="number"
                            placeholder="$0"
                            value={
                                tierInfo.tier === 1 ? (data.tier1Buffer || "") :
                                    tierInfo.tier === 2 ? (data.tier2Buffer || "") :
                                        (data.tier3Buffer || "")
                            }
                            onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                if (tierInfo.tier === 1) onSave({ tier1Buffer: value });
                                else if (tierInfo.tier === 2) onSave({ tier2Buffer: value });
                                else onSave({ tier3Buffer: value });
                            }}
                            className="bg-white/70"
                        />
                    </div>
                ))}
            </div>

            {/* Total Liquidity Summary */}
            <div className="p-4 rounded-xl border bg-muted/30 flex justify-between items-center">
                <span className="font-medium">Total Liquidity Buffer</span>
                <span className="text-xl font-bold text-primary">
                    ${totalLiquidity.toLocaleString()}
                </span>
            </div>

            {/* Buffer Locations */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex justify-between items-center">
                    <Label className="text-base flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        Account Locations
                    </Label>
                    <Badge variant="outline">{locations.length} account{locations.length !== 1 ? 's' : ''}</Badge>
                </div>

                <div className="space-y-3">
                    {locations.map((location) => (
                        <div key={location.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border bg-card">
                            <div className="col-span-3">
                                <Input
                                    placeholder="Institution"
                                    value={location.institution}
                                    onChange={(e) => updateLocation(location.id, "institution", e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-2">
                                <Select value={location.accountType} onValueChange={(v) => updateLocation(location.id, "accountType", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACCOUNT_TYPES.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    placeholder="Balance"
                                    value={location.balance || ""}
                                    onChange={(e) => updateLocation(location.id, "balance", parseFloat(e.target.value) || 0)}
                                    className="h-8 text-sm"
                                />
                            </div>
                            <div className="col-span-3">
                                <Select value={String(location.tier)} onValueChange={(v) => updateLocation(location.id, "tier", parseInt(v))}>
                                    <SelectTrigger className={cn("h-8 text-sm",
                                        location.tier === 1 ? "border-green-200 bg-green-50" :
                                            location.tier === 2 ? "border-blue-200 bg-blue-50" :
                                                "border-purple-200 bg-purple-50"
                                    )}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Tier 1 (Immediate)</SelectItem>
                                        <SelectItem value="2">Tier 2 (Short-term)</SelectItem>
                                        <SelectItem value="3">Tier 3 (Medium-term)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeLocation(location.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Add institution name..."
                        value={newInstitution}
                        onChange={(e) => setNewInstitution(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addLocation()}
                        className="flex-1"
                    />
                    <Button variant="outline" onClick={addLocation} disabled={!newInstitution.trim()}>
                        <Plus className="w-4 h-4 mr-1" /> Add Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
