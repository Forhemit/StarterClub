"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { JobPostingData } from "./types";

interface Step3CompensationProps {
    data: JobPostingData;
    onChange: (data: JobPostingData) => void;
}

export function Step3Compensation({ data, onChange }: Step3CompensationProps) {
    const updateField = (field: keyof JobPostingData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addBenefit = () => {
        onChange({ ...data, benefits: [...data.benefits, ""] });
    };

    const updateBenefit = (index: number, value: string) => {
        const currentList = [...data.benefits];
        currentList[index] = value;
        onChange({ ...data, benefits: currentList });
    };

    const removeBenefit = (index: number) => {
        const currentList = data.benefits.filter((_, i) => i !== index);
        onChange({ ...data, benefits: currentList });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compensation & Benefits</CardTitle>
                <CardDescription>
                    Outline the rewards package for this position.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label>Salary Range</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salaryMin" className="text-xs text-muted-foreground">Minimum</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input
                                    id="salaryMin"
                                    type="number"
                                    className="pl-6"
                                    placeholder="80000"
                                    value={data.salaryMin}
                                    onChange={(e) => updateField("salaryMin", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salaryMax" className="text-xs text-muted-foreground">Maximum</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input
                                    id="salaryMax"
                                    type="number"
                                    className="pl-6"
                                    placeholder="120000"
                                    value={data.salaryMax}
                                    onChange={(e) => updateField("salaryMax", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Currency</Label>
                            <Input
                                value={data.salaryCurrency}
                                onChange={(e) => updateField("salaryCurrency", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Period</Label>
                            <Select value={data.salaryPeriod} onValueChange={(v) => updateField("salaryPeriod", v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hourly">Hourly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                    <Label>Benefits & Perks</Label>
                    <div className="flex flex-wrap gap-2">
                        {["Health Insurance", "Dental Insurance", "Vision Insurance", "401(k)", "Remote Work", "Unlimited PTO", "Gym Stipend", "Stock Options"].map((benefit) => {
                            const isSelected = data.benefits.includes(benefit);
                            return (
                                <div
                                    key={benefit}
                                    className={`cursor-pointer px-3 py-1.5 rounded-full text-sm border transition-all ${isSelected
                                        ? "bg-primary text-primary-foreground border-primary font-medium"
                                        : "bg-background hover:bg-muted text-muted-foreground border-input"
                                        }`}
                                    onClick={() => {
                                        if (isSelected) {
                                            onChange({ ...data, benefits: data.benefits.filter(b => b !== benefit) });
                                        } else {
                                            onChange({ ...data, benefits: [...data.benefits, benefit] });
                                        }
                                    }}
                                >
                                    {benefit}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="text-xs text-muted-foreground">Additional Custom Benefits</Label>
                            <Button variant="outline" size="sm" onClick={addBenefit}>
                                <Plus className="w-3 h-3 mr-1" /> Add Custom
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {data.benefits.filter(b => !["Health Insurance", "Dental Insurance", "Vision Insurance", "401(k)", "Remote Work", "Unlimited PTO", "Gym Stipend", "Stock Options"].includes(b)).map((item, index) => {
                                // We need to find the actual index in the full array to update it correctly, 
                                // but simpler to just manage "custom" benefits separately in UI logic if we wanted perfection. 
                                // For now, let's just show all as editable inputs if they aren't in the preset list? 
                                // Actually, mixing preset and custom in one array makes "index" based editing tricky.
                                // Let's just list ALL benefits as removable tags below, and only have an input for NEW custom benefits?
                                // OR, just render the custom ones as editable inputs.
                                return (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                const fullIndex = data.benefits.indexOf(item);
                                                if (fullIndex >= 0) updateBenefit(fullIndex, newVal);
                                            }}
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            const fullIndex = data.benefits.indexOf(item);
                                            if (fullIndex >= 0) removeBenefit(fullIndex);
                                        }}>
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Legal / EEO */}
                <div className="space-y-4 pt-4 border-t">
                    <Label htmlFor="eeo">Equal Opportunity Statement</Label>
                    <div className="space-y-2">
                        <Textarea
                            id="eeo"
                            className="min-h-[100px] text-sm text-muted-foreground"
                            value={data.eeoStatement}
                            onChange={(e) => updateField("eeoStatement", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            This statement will appear clearly at the bottom of your job posting.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
