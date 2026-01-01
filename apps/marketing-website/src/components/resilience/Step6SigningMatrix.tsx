"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FileSignature, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SigningRule {
    id: string;
    documentType: string;
    thresholdMin: number;
    thresholdMax: number | null;
    requires2pi: boolean;
    primaryApprover: string;
    secondaryApprover: string;
}

interface Step6Props {
    data: any;
    onSave: (data: any) => void;
}

const DOCUMENT_TYPES = [
    "NDAs & Confidentiality",
    "Vendor Agreements",
    "Employment Offers",
    "Bank Wire / Checks",
    "Lease Agreements",
    "Customer Contracts",
    "Partnership Agreements",
    "Equipment Purchase",
    "Other",
];

const APPROVER_ROLES = [
    { value: "cfo", label: "CFO" },
    { value: "ceo", label: "CEO" },
    { value: "coo", label: "COO" },
    { value: "board_chair", label: "Board Chairman" },
    { value: "finance_director", label: "Finance Director" },
    { value: "department_head", label: "Department Head" },
    { value: "owner", label: "Owner / Principal" },
    { value: "legal_counsel", label: "Legal Counsel" },
];

export function Step6SigningMatrix({ data, onSave }: Step6Props) {
    const [signingRules, setSigningRules] = useState<SigningRule[]>(data.signingRules || []);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Keep legacy fields for backward compatibility
    const [legacyData, setLegacyData] = useState({
        canSignNDAs: data.canSignNDAs || false,
        canSignVendor: data.canSignVendor || false,
        canSignEmployment: data.canSignEmployment || false,
        canSignChecks: data.canSignChecks || false,
        requiresDualControl: data.requiresDualControl || false,
    });

    useEffect(() => {
        onSave({ ...data, signingRules, ...legacyData });
    }, [signingRules, legacyData]);

    const addRule = () => {
        const newRule: SigningRule = {
            id: crypto.randomUUID(),
            documentType: "",
            thresholdMin: 0,
            thresholdMax: null,
            requires2pi: false,
            primaryApprover: "",
            secondaryApprover: "",
        };
        setSigningRules([...signingRules, newRule]);
        setEditingId(newRule.id);
    };

    const updateRule = (id: string, updates: Partial<SigningRule>) => {
        setSigningRules(signingRules.map(rule =>
            rule.id === id ? { ...rule, ...updates } : rule
        ));
    };

    const removeRule = (id: string) => {
        setSigningRules(signingRules.filter(rule => rule.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const toggleLegacy = (field: keyof typeof legacyData) => {
        setLegacyData(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const formatThreshold = (min: number, max: number | null) => {
        if (min === 0 && max === null) return "Any amount";
        if (min === 0) return `Up to $${max?.toLocaleString()}`;
        if (max === null) return `$${min.toLocaleString()}+`;
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileSignature className="w-5 h-5 text-primary" />
                    Signing Authority Matrix
                </h3>
                <p className="text-sm text-muted-foreground">
                    Define document execution powers and create custom signing rules.
                </p>
            </div>

            {/* Quick Toggles - Legacy */}
            <Card className="p-5">
                <Label className="text-sm font-semibold mb-4 block">Quick Authorization Toggles</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 border p-3 rounded-md bg-background hover:bg-muted/10 transition-colors">
                        <Switch
                            checked={legacyData.canSignNDAs}
                            onCheckedChange={() => toggleLegacy('canSignNDAs')}
                        />
                        <Label className="cursor-pointer">NDAs & Confidentiality</Label>
                    </div>
                    <div className="flex items-center space-x-3 border p-3 rounded-md bg-background hover:bg-muted/10 transition-colors">
                        <Switch
                            checked={legacyData.canSignVendor}
                            onCheckedChange={() => toggleLegacy('canSignVendor')}
                        />
                        <Label className="cursor-pointer">Vendor Agreements {'<'} $50k</Label>
                    </div>
                    <div className="flex items-center space-x-3 border p-3 rounded-md bg-background hover:bg-muted/10 transition-colors">
                        <Switch
                            checked={legacyData.canSignEmployment}
                            onCheckedChange={() => toggleLegacy('canSignEmployment')}
                        />
                        <Label className="cursor-pointer">Employment Offers (Junior)</Label>
                    </div>
                    <div className="flex items-center space-x-3 border p-3 rounded-md bg-background hover:bg-muted/10 transition-colors">
                        <Switch
                            checked={legacyData.canSignChecks}
                            onCheckedChange={() => toggleLegacy('canSignChecks')}
                        />
                        <Label className="cursor-pointer">Bank Wire / Checks</Label>
                    </div>
                </div>
            </Card>

            {/* Custom Rules - CRUD */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Custom Signing Rules</Label>
                    <Button variant="outline" size="sm" onClick={addRule}>
                        <Plus className="w-4 h-4 mr-2" /> Add Rule
                    </Button>
                </div>

                <div className="space-y-3">
                    {signingRules.map((rule) => (
                        <Card key={rule.id} className={`p-4 ${editingId === rule.id ? 'ring-2 ring-primary' : ''}`}>
                            {editingId === rule.id ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Document Type</Label>
                                            <Select
                                                value={rule.documentType}
                                                onValueChange={(v) => updateRule(rule.id, { documentType: v })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DOCUMENT_TYPES.map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Threshold Range</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    type="number"
                                                    placeholder="Min"
                                                    className="w-24"
                                                    value={rule.thresholdMin || ""}
                                                    onChange={(e) => updateRule(rule.id, { thresholdMin: parseInt(e.target.value) || 0 })}
                                                />
                                                <span className="text-muted-foreground">to</span>
                                                <Input
                                                    type="number"
                                                    placeholder="Max (empty=∞)"
                                                    className="w-28"
                                                    value={rule.thresholdMax || ""}
                                                    onChange={(e) => updateRule(rule.id, { thresholdMax: e.target.value ? parseInt(e.target.value) : null })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                        <Switch
                                            checked={rule.requires2pi}
                                            onCheckedChange={(c) => updateRule(rule.id, { requires2pi: c })}
                                        />
                                        <Label className="font-medium">Requires Two-Person Integrity (2PI)</Label>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Primary Approver</Label>
                                            <Select
                                                value={rule.primaryApprover}
                                                onValueChange={(v) => updateRule(rule.id, { primaryApprover: v })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {APPROVER_ROLES.map(role => (
                                                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {rule.requires2pi && (
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Secondary Approver</Label>
                                                <Select
                                                    value={rule.secondaryApprover}
                                                    onValueChange={(v) => updateRule(rule.id, { secondaryApprover: v })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select role..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {APPROVER_ROLES.map(role => (
                                                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)}>
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                        <Button size="sm" onClick={() => setEditingId(null)}>
                                            <Check className="w-4 h-4 mr-1" /> Done
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{rule.documentType || "Untitled Rule"}</span>
                                            {rule.requires2pi && (
                                                <Badge className="bg-red-100 text-red-800 border-red-200">2PI</Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatThreshold(rule.thresholdMin, rule.thresholdMax)}
                                            {rule.primaryApprover && ` • ${APPROVER_ROLES.find(r => r.value === rule.primaryApprover)?.label || rule.primaryApprover}`}
                                            {rule.secondaryApprover && ` + ${APPROVER_ROLES.find(r => r.value === rule.secondaryApprover)?.label || rule.secondaryApprover}`}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => setEditingId(rule.id)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {signingRules.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <FileSignature className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="font-medium">No custom rules defined</p>
                            <p className="text-sm mt-1">Use the quick toggles above or add custom rules for specific scenarios.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
