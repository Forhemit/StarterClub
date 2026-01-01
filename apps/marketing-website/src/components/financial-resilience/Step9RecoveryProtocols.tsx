"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LifeBuoy, Plus, Trash2, AlertTriangle, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

export function Step9RecoveryProtocols({ data, onSave }: StepProps) {
    const protocols = data.recoveryProtocols || [];
    const scenarios = data.stressScenarios || [];

    const addProtocol = () => {
        const newProtocol = {
            id: crypto.randomUUID(),
            scenarioId: scenarios[0]?.id || "",
            triggerCondition: "",
            immediateActions: "",
            responsibleParty: "",
            timelineDays: 7
        };
        onSave({ recoveryProtocols: [...protocols, newProtocol] });
    };

    const updateProtocol = (id: string, field: string, value: string | number) => {
        const updated = protocols.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        onSave({ recoveryProtocols: updated });
    };

    const removeProtocol = (id: string) => {
        onSave({ recoveryProtocols: protocols.filter(p => p.id !== id) });
    };

    const getScenarioName = (scenarioId: string) => {
        return scenarios.find(s => s.id === scenarioId)?.name || "Unknown Scenario";
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-primary" />
                    Recovery Protocols
                </h3>
                <p className="text-sm text-muted-foreground">Define action plans for each stress scenario.</p>
            </div>

            {/* Escalation Thresholds */}
            <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border bg-muted/30">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Escalation Threshold
                    </Label>
                    <Input
                        type="number"
                        placeholder="$0"
                        value={data.escalationThreshold || ""}
                        onChange={(e) => onSave({ escalationThreshold: parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-[10px] text-muted-foreground">Loss amount that triggers escalation</p>
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Board Notification Threshold
                    </Label>
                    <Input
                        type="number"
                        placeholder="$0"
                        value={data.boardNotificationThreshold || ""}
                        onChange={(e) => onSave({ boardNotificationThreshold: parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-[10px] text-muted-foreground">Loss amount requiring board notification</p>
                </div>
            </div>

            {/* No Scenarios Warning */}
            {scenarios.length === 0 && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    <div>
                        <div className="font-medium">No stress scenarios defined</div>
                        <div className="text-sm opacity-80">Go back to Step 3 to define scenarios first</div>
                    </div>
                </div>
            )}

            {/* Recovery Protocols */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-base">Response Protocols</Label>
                    <Badge variant="outline">{protocols.length} protocol{protocols.length !== 1 ? 's' : ''}</Badge>
                </div>

                <div className="space-y-4">
                    {protocols.map((protocol, idx) => (
                        <div key={protocol.id} className="p-4 rounded-xl border bg-card space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-primary">Protocol {idx + 1}</Badge>
                                    {protocol.scenarioId && scenarios.length > 0 && (
                                        <Badge variant="outline">
                                            {getScenarioName(protocol.scenarioId)}
                                        </Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeProtocol(protocol.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>

                            {scenarios.length > 0 && (
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Linked Scenario</Label>
                                    <Select
                                        value={protocol.scenarioId}
                                        onValueChange={(v) => updateProtocol(protocol.id, "scenarioId", v)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Select scenario..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {scenarios.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Trigger Condition</Label>
                                <Input
                                    placeholder="When to activate this protocol..."
                                    value={protocol.triggerCondition}
                                    onChange={(e) => updateProtocol(protocol.id, "triggerCondition", e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Immediate Actions</Label>
                                <Textarea
                                    placeholder="List the immediate steps to take..."
                                    value={protocol.immediateActions}
                                    onChange={(e) => updateProtocol(protocol.id, "immediateActions", e.target.value)}
                                    className="min-h-[80px] text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <User className="w-3 h-3" /> Responsible Party
                                    </Label>
                                    <Input
                                        placeholder="Who leads the response?"
                                        value={protocol.responsibleParty}
                                        onChange={(e) => updateProtocol(protocol.id, "responsibleParty", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Timeline (Days)
                                    </Label>
                                    <Select
                                        value={String(protocol.timelineDays)}
                                        onValueChange={(v) => updateProtocol(protocol.id, "timelineDays", parseInt(v))}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 3, 7, 14, 30, 60, 90].map(d => (
                                                <SelectItem key={d} value={String(d)}>{d} days</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="outline" onClick={addProtocol} className="w-full">
                    <Plus className="w-4 h-4 mr-1" /> Add Recovery Protocol
                </Button>
            </div>
        </div>
    );
}
