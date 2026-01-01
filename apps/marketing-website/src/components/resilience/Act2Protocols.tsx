"use client";

import { MobileStepLayout } from "./MobileStepLayout";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShieldAlert, Users, PauseCircle, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Act2Props {
    data: any;
    onSave: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export function Act2Protocols({ data, onSave, onNext, onBack }: Act2Props) {
    return (
        <MobileStepLayout
            title="Response Protocols"
            description="Define actions for when you are unreachable."
            currentStep={2}
            totalSteps={4}
            onBack={onBack}
            onNext={onNext}
        >
            <div className="space-y-8">
                {/* Scenario Header */}
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50 flex gap-3">
                    <PhoneOff className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-200">Scenario: Unreachable for 48 Hours</h4>
                        <p className="text-xs text-orange-800/80 dark:text-orange-300/80">
                            It's a Tier 2 (Urgent) event. You can't be contacted. What happens immediately?
                        </p>
                    </div>
                </div>

                {/* Big Card Selection for Tier 2 Action */}
                <div className="space-y-3">
                    <Label className="text-base">Immediate Protocol</Label>
                    <RadioGroup
                        value={data.tier2Action}
                        onValueChange={(v) => onSave({ ...data, tier2Action: v })}
                        className="grid gap-3"
                    >
                        <Label
                            className={cn(
                                "flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50",
                                data.tier2Action === "activate_interim" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"
                            )}
                        >
                            <RadioGroupItem value="activate_interim" className="mt-1" id="action-1" />
                            <div className="flex-1 space-y-1">
                                <div className="font-semibold flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-primary" />
                                    Activate Deputy
                                </div>
                                <p className="text-xs text-muted-foreground">Full authority transferred to {data.deputy || "Deputy"} immediately.</p>
                            </div>
                        </Label>

                        <Label
                            className={cn(
                                "flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50",
                                data.tier2Action === "hold_non_critical" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"
                            )}
                        >
                            <RadioGroupItem value="hold_non_critical" className="mt-1" id="action-2" />
                            <div className="flex-1 space-y-1">
                                <div className="font-semibold flex items-center gap-2">
                                    <PauseCircle className="w-4 h-4 text-orange-500" />
                                    Hold Decisions
                                </div>
                                <p className="text-xs text-muted-foreground">Freeze non-critical ops. Wait for contact.</p>
                            </div>
                        </Label>

                        <Label
                            className={cn(
                                "flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50",
                                data.tier2Action === "distribute_load" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"
                            )}
                        >
                            <RadioGroupItem value="distribute_load" className="mt-1" id="action-3" />
                            <div className="flex-1 space-y-1">
                                <div className="font-semibold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    Distribute Tasks
                                </div>
                                <p className="text-xs text-muted-foreground">Split responsibilities across direct reports.</p>
                            </div>
                        </Label>
                    </RadioGroup>
                </div>

                {/* Spending Authority Scope */}
                <div className="space-y-3">
                    <Label className="text-base">Spending Authority Scope</Label>
                    <div className="grid grid-cols-1 gap-3">
                        {["emergency", "full_ktlo", "frozen"].map((scope) => (
                            <div
                                key={scope}
                                onClick={() => onSave({ ...data, tier2Scope: scope })}
                                className={cn(
                                    "p-3 rounded-lg border text-sm font-medium cursor-pointer flex justify-between items-center",
                                    data.tier2Scope === scope ? "border-primary bg-primary/5 text-primary" : "border-muted hover:bg-muted/50"
                                )}
                            >
                                <span>
                                    {scope === 'emergency' && "Emergency Spending Only"}
                                    {scope === 'full_ktlo' && "Full Operating Budget"}
                                    {scope === 'frozen' && "All Spending Frozen"}
                                </span>
                                {data.tier2Scope === scope && <Badge className="h-5 text-[10px] px-1.5">Selected</Badge>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MobileStepLayout>
    );
}
