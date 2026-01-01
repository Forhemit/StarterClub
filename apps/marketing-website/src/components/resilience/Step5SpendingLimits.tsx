"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DollarSign, AlertTriangle, Users } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Step5Props {
    data: any;
    onSave: (data: any) => void;
}

const APPROVER_ROLES = [
    { value: "cfo", label: "CFO" },
    { value: "ceo", label: "CEO" },
    { value: "coo", label: "COO" },
    { value: "board_chair", label: "Board Chairman" },
    { value: "finance_director", label: "Finance Director" },
    { value: "department_head", label: "Department Head" },
    { value: "owner", label: "Owner / Principal" },
];

export function Step5SpendingLimits({ data, onSave }: Step5Props) {
    const handleChange = (field: string, value: string) => {
        onSave({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Tiered Spending Limits
                </h3>
                <p className="text-sm text-muted-foreground">
                    Define maximum spending thresholds and escalation approvers.
                </p>
            </div>

            <Card className="p-6">
                <div className="grid gap-8">
                    {/* OpEx Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <Label className="text-base font-semibold">Operational Expenses (OpEx)</Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Per-Transaction Limit</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                    <Input
                                        type="text"
                                        className="pl-7 font-mono"
                                        placeholder="10,000"
                                        value={data.opexLimit || ""}
                                        onChange={(e) => handleChange('opexLimit', e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Standard recurring expenses, software, travel.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Users className="w-3 h-3" /> If Over Limit, Requires Approval From
                                </Label>
                                <Select
                                    value={data.opexExcessApprover || ""}
                                    onValueChange={(v) => handleChange('opexExcessApprover', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select approver..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {APPROVER_ROLES.map(role => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground">
                                    Who must approve amounts exceeding this limit?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CapEx Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <Label className="text-base font-semibold">Capital Expenditures (CapEx)</Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Per-Transaction Limit</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                    <Input
                                        type="text"
                                        className="pl-7 font-mono"
                                        placeholder="25,000"
                                        value={data.capexLimit || ""}
                                        onChange={(e) => handleChange('capexLimit', e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Equipment, infrastructure, major investments.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Users className="w-3 h-3" /> If Over Limit, Requires Approval From
                                </Label>
                                <Select
                                    value={data.capexExcessApprover || ""}
                                    onValueChange={(v) => handleChange('capexExcessApprover', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select approver..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {APPROVER_ROLES.map(role => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground">
                                    Who must approve amounts exceeding this limit?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-medium text-amber-900 dark:text-amber-300 mb-1">Escalation is Automatic</h4>
                    <p className="text-xs text-amber-800 dark:text-amber-400">
                        When a successor attempts to authorize a transaction exceeding these limits, they will automatically be prompted to seek approval from the designated approver before proceeding.
                    </p>
                </div>
            </div>
        </div>
    );
}
