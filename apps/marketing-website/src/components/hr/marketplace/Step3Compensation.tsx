"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Calendar, Heart, Briefcase } from "lucide-react";

import { type CompensationInfo } from "./types";

interface Step3CompensationProps {
    data: CompensationInfo;
    onChange: (data: CompensationInfo) => void;
}

export const DEFAULT_COMPENSATION_INFO: CompensationInfo = {
    salaryAmount: "",
    salaryType: "annual",
    payFrequency: "biweekly",
    bonusEligible: false,
    bonusDetails: "",
    healthInsurance: true,
    dentalInsurance: true,
    visionInsurance: true,
    retirement401k: true,
    ptodays: "15",
    stockOptions: false,
    signingBonus: "",
    otherBenefits: "",
};

const SALARY_TYPES = [
    { value: "annual", label: "Annual Salary" },
    { value: "hourly", label: "Hourly Rate" },
];

const PAY_FREQUENCIES = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-Weekly" },
    { value: "semimonthly", label: "Semi-Monthly" },
    { value: "monthly", label: "Monthly" },
];

export function Step3Compensation({ data, onChange }: Step3CompensationProps) {
    const updateField = <K extends keyof CompensationInfo>(field: K, value: CompensationInfo[K]) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Compensation & Benefits
                </CardTitle>
                <CardDescription>
                    Define salary, bonuses, and benefits package for the new hire.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Salary Section */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Compensation
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salaryAmount">Amount *</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="salaryAmount"
                                    type="text"
                                    placeholder="75,000"
                                    className="pl-7"
                                    value={data.salaryAmount || ""}
                                    onChange={(e) => updateField("salaryAmount", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={data.salaryType || "annual"} onValueChange={(v) => updateField("salaryType", v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SALARY_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Pay Frequency</Label>
                            <Select value={data.payFrequency || "biweekly"} onValueChange={(v) => updateField("payFrequency", v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAY_FREQUENCIES.map((freq) => (
                                        <SelectItem key={freq.value} value={freq.value}>
                                            {freq.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Bonus and Signing Bonus */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="bonusEligible">Bonus Eligible</Label>
                                <Switch
                                    id="bonusEligible"
                                    checked={data.bonusEligible || false}
                                    onCheckedChange={(v) => updateField("bonusEligible", v)}
                                />
                            </div>
                            {data.bonusEligible && (
                                <Input
                                    placeholder="e.g., Up to 15% annual"
                                    value={data.bonusDetails || ""}
                                    onChange={(e) => updateField("bonusDetails", e.target.value)}
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signingBonus">Signing Bonus</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="signingBonus"
                                    type="text"
                                    placeholder="5,000"
                                    className="pl-7"
                                    value={data.signingBonus || ""}
                                    onChange={(e) => updateField("signingBonus", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Benefits
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="healthInsurance">Health Insurance</Label>
                            <Switch
                                id="healthInsurance"
                                checked={data.healthInsurance || false}
                                onCheckedChange={(v) => updateField("healthInsurance", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="dentalInsurance">Dental Insurance</Label>
                            <Switch
                                id="dentalInsurance"
                                checked={data.dentalInsurance || false}
                                onCheckedChange={(v) => updateField("dentalInsurance", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="visionInsurance">Vision Insurance</Label>
                            <Switch
                                id="visionInsurance"
                                checked={data.visionInsurance || false}
                                onCheckedChange={(v) => updateField("visionInsurance", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="retirement401k">401(k) Retirement</Label>
                            <Switch
                                id="retirement401k"
                                checked={data.retirement401k || false}
                                onCheckedChange={(v) => updateField("retirement401k", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="stockOptions">Stock Options/Equity</Label>
                            <Switch
                                id="stockOptions"
                                checked={data.stockOptions || false}
                                onCheckedChange={(v) => updateField("stockOptions", v)}
                            />
                        </div>
                        <div className="space-y-2 p-3 rounded-lg border">
                            <Label htmlFor="ptodays" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                PTO Days / Year
                            </Label>
                            <Input
                                id="ptodays"
                                type="number"
                                placeholder="15"
                                value={data.ptodays || "15"}
                                onChange={(e) => updateField("ptodays", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
