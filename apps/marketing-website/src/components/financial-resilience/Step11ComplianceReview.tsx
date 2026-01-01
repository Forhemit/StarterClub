"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, Plus, Trash2, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const STATUS_OPTIONS = [
    { id: "pending", label: "Pending", color: "bg-slate-100 text-slate-700" },
    { id: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
    { id: "completed", label: "Completed", color: "bg-green-100 text-green-700" },
    { id: "needs_attention", label: "Needs Attention", color: "bg-amber-100 text-amber-700" },
];

export function Step11ComplianceReview({ data, onSave }: StepProps) {
    const complianceLog = data.complianceLog || [];

    const addLogEntry = () => {
        const newEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            reviewer: "",
            status: "pending",
            notes: ""
        };
        onSave({ complianceLog: [...complianceLog, newEntry] });
    };

    const updateEntry = (id: string, field: string, value: string) => {
        const updated = complianceLog.map(e =>
            e.id === id ? { ...e, [field]: value } : e
        );
        onSave({ complianceLog: updated });
    };

    const removeEntry = (id: string) => {
        onSave({ complianceLog: complianceLog.filter(e => e.id !== id) });
    };

    const getStatusColor = (status: string) => {
        return STATUS_OPTIONS.find(s => s.id === status)?.color || "bg-slate-100 text-slate-700";
    };

    const getStatusLabel = (status: string) => {
        return STATUS_OPTIONS.find(s => s.id === status)?.label || status;
    };

    // Calculate completion summary
    const totalSteps = 11;
    const filledSteps = [
        data.businessType,
        data.revenueStreams?.length || data.expenseCategories?.length,
        data.stressScenarios?.length,
        data.targetFundAmount,
        data.tier1Buffer || data.tier2Buffer || data.tier3Buffer,
        data.insurancePolicies?.length,
        data.bankingContacts?.length,
        data.financialContacts?.length,
        data.recoveryProtocols?.length,
        data.requireDualSignature !== undefined,
        true // This step
    ].filter(Boolean).length;

    const completionPercentage = Math.round((filledSteps / totalSteps) * 100);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-primary" />
                    Compliance & Review
                </h3>
                <p className="text-sm text-muted-foreground">Track completion and schedule reviews.</p>
            </div>

            {/* Completion Summary */}
            <div className="p-5 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Profile Completion</div>
                        <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">{filledSteps} of {totalSteps} sections</div>
                        {completionPercentage >= 80 ? (
                            <Badge className="bg-green-500 mt-1">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 mt-1">
                                <Clock className="w-3 h-3 mr-1" /> In Progress
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="h-3 bg-background rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-500",
                            completionPercentage >= 80 ? "bg-green-500" :
                                completionPercentage >= 50 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>

            {/* Review Dates */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Last Review Date
                    </Label>
                    <Input
                        type="date"
                        value={data.lastReviewDate || ""}
                        onChange={(e) => onSave({ lastReviewDate: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Next Review Date
                    </Label>
                    <Input
                        type="date"
                        value={data.nextReviewDate || ""}
                        onChange={(e) => onSave({ nextReviewDate: e.target.value })}
                    />
                </div>
            </div>

            {/* Expiry Warning */}
            {data.nextReviewDate && new Date(data.nextReviewDate) < new Date() && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                        <div className="font-medium">Review Overdue</div>
                        <div className="text-sm opacity-80">Your financial resilience profile needs to be reviewed</div>
                    </div>
                </div>
            )}

            {/* Compliance Log */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex justify-between items-center">
                    <Label className="text-base">Review History</Label>
                    <Badge variant="outline">{complianceLog.length} entr{complianceLog.length !== 1 ? 'ies' : 'y'}</Badge>
                </div>

                <div className="space-y-3">
                    {complianceLog.map((entry) => (
                        <div key={entry.id} className="p-4 rounded-xl border bg-card space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(entry.status)}>
                                        {getStatusLabel(entry.status)}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">{entry.date}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEntry(entry.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Date</Label>
                                    <Input
                                        type="date"
                                        value={entry.date}
                                        onChange={(e) => updateEntry(entry.id, "date", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Reviewer</Label>
                                    <Input
                                        placeholder="Name of reviewer"
                                        value={entry.reviewer}
                                        onChange={(e) => updateEntry(entry.id, "reviewer", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Status</Label>
                                    <Select value={entry.status} onValueChange={(v) => updateEntry(entry.id, "status", v)}>
                                        <SelectTrigger className={cn("h-8 text-sm", getStatusColor(entry.status))}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Notes</Label>
                                <Textarea
                                    placeholder="Review notes..."
                                    value={entry.notes}
                                    onChange={(e) => updateEntry(entry.id, "notes", e.target.value)}
                                    className="min-h-[60px] text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="outline" onClick={addLogEntry} className="w-full">
                    <Plus className="w-4 h-4 mr-1" /> Add Review Entry
                </Button>
            </div>
        </div>
    );
}
