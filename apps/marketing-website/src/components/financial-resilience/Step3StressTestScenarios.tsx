"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Plus, Trash2, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const SCENARIO_PRESETS = [
    { name: "Mild Recession", revenueImpact: -15, expenseImpact: 0, duration: 6, probability: "moderate" },
    { name: "Major Customer Loss", revenueImpact: -25, expenseImpact: -5, duration: 3, probability: "low" },
    { name: "Economic Downturn", revenueImpact: -30, expenseImpact: 10, duration: 12, probability: "low" },
    { name: "Supply Chain Shock", revenueImpact: -20, expenseImpact: 25, duration: 4, probability: "moderate" },
    { name: "Pandemic Event", revenueImpact: -40, expenseImpact: 15, duration: 18, probability: "rare" },
];

const PROBABILITY_OPTIONS = ["rare", "low", "moderate", "high"];

export function Step3StressTestScenarios({ data, onSave }: StepProps) {
    const [showPresets, setShowPresets] = useState(false);
    const scenarios = data.stressScenarios || [];

    const addScenario = (preset?: typeof SCENARIO_PRESETS[0]) => {
        const newScenario = preset ? {
            id: crypto.randomUUID(),
            name: preset.name,
            revenueImpactPct: preset.revenueImpact,
            expenseImpactPct: preset.expenseImpact,
            durationMonths: preset.duration,
            probability: preset.probability,
        } : {
            id: crypto.randomUUID(),
            name: "New Scenario",
            revenueImpactPct: -10,
            expenseImpactPct: 0,
            durationMonths: 3,
            probability: "moderate",
        };
        onSave({ stressScenarios: [...scenarios, newScenario] });
        setShowPresets(false);
    };

    const updateScenario = (id: string, field: string, value: string | number) => {
        const updated = scenarios.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );
        onSave({ stressScenarios: updated });
    };

    const removeScenario = (id: string) => {
        onSave({ stressScenarios: scenarios.filter(s => s.id !== id) });
    };

    const getImpactColor = (impact: number) => {
        if (impact <= -30) return "text-red-700 bg-red-50";
        if (impact <= -15) return "text-orange-700 bg-orange-50";
        if (impact < 0) return "text-amber-700 bg-amber-50";
        return "text-red-700 bg-red-50";
    };

    const getProbabilityColor = (prob: string) => {
        switch (prob) {
            case "rare": return "bg-slate-100 text-slate-700";
            case "low": return "bg-blue-100 text-blue-700";
            case "moderate": return "bg-amber-100 text-amber-700";
            case "high": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    Stress Test Scenarios
                </h3>
                <p className="text-sm text-muted-foreground">Define shock scenarios to test your financial resilience.</p>
            </div>

            {/* Baseline Cash Flow */}
            <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                <Label className="text-sm">Baseline Monthly Cash Flow</Label>
                <Input
                    type="number"
                    placeholder="$0"
                    value={data.baselineMonthlyCashFlow || ""}
                    onChange={(e) => onSave({ baselineMonthlyCashFlow: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-[10px] text-muted-foreground">Your normal monthly net cash position</p>
            </div>

            {/* Scenarios List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-base">Defined Scenarios</Label>
                    <Badge variant="outline">{scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}</Badge>
                </div>

                {scenarios.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No stress scenarios defined yet</p>
                        <p className="text-xs mt-1">Add presets or create custom scenarios</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {scenarios.map((scenario) => (
                            <div key={scenario.id} className="p-4 rounded-xl border bg-card space-y-4">
                                <div className="flex justify-between items-start">
                                    <Input
                                        value={scenario.name}
                                        onChange={(e) => updateScenario(scenario.id, "name", e.target.value)}
                                        className="font-medium border-0 bg-transparent p-0 h-auto text-base focus-visible:ring-0"
                                    />
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeScenario(scenario.id)}>
                                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Revenue Impact */}
                                    <div className="space-y-2">
                                        <Label className="text-xs flex items-center gap-1">
                                            <TrendingDown className="w-3 h-3" /> Revenue Impact
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Slider
                                                value={[scenario.revenueImpactPct]}
                                                min={-100}
                                                max={0}
                                                step={5}
                                                onValueChange={([v]) => updateScenario(scenario.id, "revenueImpactPct", v)}
                                                className="flex-1"
                                            />
                                            <Badge variant="outline" className={cn("w-16 justify-center", getImpactColor(scenario.revenueImpactPct))}>
                                                {scenario.revenueImpactPct}%
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Expense Impact */}
                                    <div className="space-y-2">
                                        <Label className="text-xs">Expense Impact</Label>
                                        <div className="flex items-center gap-2">
                                            <Slider
                                                value={[scenario.expenseImpactPct]}
                                                min={-20}
                                                max={50}
                                                step={5}
                                                onValueChange={([v]) => updateScenario(scenario.id, "expenseImpactPct", v)}
                                                className="flex-1"
                                            />
                                            <Badge variant="outline" className={cn("w-16 justify-center", scenario.expenseImpactPct > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700")}>
                                                {scenario.expenseImpactPct > 0 ? "+" : ""}{scenario.expenseImpactPct}%
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="space-y-2">
                                        <Label className="text-xs flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Duration
                                        </Label>
                                        <Select
                                            value={String(scenario.durationMonths)}
                                            onValueChange={(v) => updateScenario(scenario.id, "durationMonths", parseInt(v))}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 3, 6, 9, 12, 18, 24].map(m => (
                                                    <SelectItem key={m} value={String(m)}>{m} months</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Probability */}
                                    <div className="space-y-2">
                                        <Label className="text-xs">Probability</Label>
                                        <Select
                                            value={scenario.probability}
                                            onValueChange={(v) => updateScenario(scenario.id, "probability", v)}
                                        >
                                            <SelectTrigger className={cn("h-8", getProbabilityColor(scenario.probability))}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PROBABILITY_OPTIONS.map(p => (
                                                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Scenario Buttons */}
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowPresets(!showPresets)} className="flex-1">
                        Use Preset
                    </Button>
                    <Button variant="outline" onClick={() => addScenario()} className="flex-1">
                        <Plus className="w-4 h-4 mr-1" /> Custom Scenario
                    </Button>
                </div>

                {/* Presets Grid */}
                {showPresets && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg border bg-muted/30 animate-in fade-in slide-in-from-top-2">
                        {SCENARIO_PRESETS.map((preset, idx) => (
                            <div
                                key={idx}
                                onClick={() => addScenario(preset)}
                                className="p-3 rounded-lg border bg-card hover:border-primary/50 cursor-pointer transition-all"
                            >
                                <div className="font-medium text-sm">{preset.name}</div>
                                <div className="flex gap-2 mt-2 text-xs">
                                    <Badge variant="outline" className="bg-red-50 text-red-700 text-[10px]">
                                        Rev: {preset.revenueImpact}%
                                    </Badge>
                                    <Badge variant="outline" className={cn("text-[10px]", preset.expenseImpact > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700")}>
                                        Exp: {preset.expenseImpact > 0 ? "+" : ""}{preset.expenseImpact}%
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px]">{preset.duration}mo</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
