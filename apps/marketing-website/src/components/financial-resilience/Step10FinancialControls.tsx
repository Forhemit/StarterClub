"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Plus, Trash2, Shield, Users, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const SYSTEM_TYPES = [
    "Banking Portal",
    "Accounting Software",
    "Payroll System",
    "Expense Management",
    "Bill Pay",
    "Investment Accounts",
    "Tax Software",
    "ERP System",
    "Other"
];

const ACCESS_LEVELS = ["Admin", "Editor", "Viewer", "Approver"];

export function Step10FinancialControls({ data, onSave }: StepProps) {
    const [newSystem, setNewSystem] = useState("");
    const accessControls = data.accessControls || [];

    const addAccessControl = () => {
        if (!newSystem) return;
        const newControl = {
            id: crypto.randomUUID(),
            system: newSystem,
            users: [],
            accessLevel: "Viewer",
            requires2fa: true
        };
        onSave({ accessControls: [...accessControls, newControl] });
        setNewSystem("");
    };

    const updateControl = (id: string, field: string, value: string | string[] | boolean) => {
        const updated = accessControls.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        );
        onSave({ accessControls: updated });
    };

    const removeControl = (id: string) => {
        onSave({ accessControls: accessControls.filter(c => c.id !== id) });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Financial Controls
                </h3>
                <p className="text-sm text-muted-foreground">Configure dual signature requirements and access controls.</p>
            </div>

            {/* Dual Signature Controls */}
            <div className="space-y-4 p-5 rounded-xl border bg-muted/20">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <Label className="text-base flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Require Dual Signature
                        </Label>
                        <p className="text-xs text-muted-foreground">Two authorized signers required above threshold</p>
                    </div>
                    <Switch
                        checked={data.requireDualSignature || false}
                        onCheckedChange={(v) => onSave({ requireDualSignature: v })}
                    />
                </div>

                {data.requireDualSignature && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <Label>Dual Signature Threshold</Label>
                            <Badge variant="outline" className="text-lg px-3 py-1 font-bold bg-background">
                                {formatCurrency(data.dualSignatureThreshold || 10000)}
                            </Badge>
                        </div>
                        <Slider
                            value={[data.dualSignatureThreshold || 10000]}
                            min={1000}
                            max={100000}
                            step={1000}
                            onValueChange={([v]) => onSave({ dualSignatureThreshold: v })}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$1,000</span>
                            <span>$50,000</span>
                            <span>$100,000</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Segregation of Duties */}
            <div className="flex justify-between items-center p-4 rounded-xl border bg-card">
                <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Segregation of Duties
                    </Label>
                    <p className="text-xs text-muted-foreground">Separate roles for initiating and approving transactions</p>
                </div>
                <Switch
                    checked={data.segregationOfDuties || false}
                    onCheckedChange={(v) => onSave({ segregationOfDuties: v })}
                />
            </div>

            {/* Access Controls */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex justify-between items-center">
                    <Label className="text-base flex items-center gap-2">
                        <Key className="w-4 h-4 text-muted-foreground" />
                        System Access Controls
                    </Label>
                    <Badge variant="outline">{accessControls.length} system{accessControls.length !== 1 ? 's' : ''}</Badge>
                </div>

                <div className="space-y-3">
                    {accessControls.map((control) => (
                        <div key={control.id} className="p-4 rounded-xl border bg-card space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                        {control.system}
                                    </Badge>
                                    {control.requires2fa && (
                                        <Badge className="bg-green-500">
                                            <Shield className="w-3 h-3 mr-1" /> 2FA Required
                                        </Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeControl(control.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">System</Label>
                                    <Select value={control.system} onValueChange={(v) => updateControl(control.id, "system", v)}>
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SYSTEM_TYPES.map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Access Level</Label>
                                    <Select value={control.accessLevel} onValueChange={(v) => updateControl(control.id, "accessLevel", v)}>
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ACCESS_LEVELS.map(l => (
                                                <SelectItem key={l} value={l}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
                                    <span className="text-xs font-medium">Requires 2FA</span>
                                    <Switch
                                        checked={control.requires2fa}
                                        onCheckedChange={(v) => updateControl(control.id, "requires2fa", v)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Authorized Users (comma-separated)</Label>
                                <Input
                                    placeholder="John Smith, Jane Doe, ..."
                                    value={(control.users || []).join(", ")}
                                    onChange={(e) => updateControl(control.id, "users", e.target.value.split(",").map(u => u.trim()).filter(Boolean))}
                                    className="h-8 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Select value={newSystem} onValueChange={setNewSystem}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select system type..." />
                        </SelectTrigger>
                        <SelectContent>
                            {SYSTEM_TYPES.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={addAccessControl} disabled={!newSystem}>
                        <Plus className="w-4 h-4 mr-1" /> Add System
                    </Button>
                </div>
            </div>
        </div>
    );
}
