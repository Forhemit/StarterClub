"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StepProps } from "./types";

export function Step1PositionIdentification({ data, updateData }: StepProps) {
    return (
        <div className="space-y-6">
            {/* Position Title */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                    Position Title <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={data.title}
                    onChange={(e) => updateData({ title: e.target.value })}
                    className="text-lg"
                />
            </div>

            {/* Department */}
            <div className="space-y-2">
                <Label htmlFor="department" className="text-base font-medium">
                    Department
                </Label>
                <Input
                    id="department"
                    placeholder="e.g., Engineering, Marketing, Operations"
                    value={data.department || ""}
                    onChange={(e) => updateData({ department: e.target.value })}
                />
            </div>

            {/* Reports To */}
            <div className="space-y-2">
                <Label htmlFor="reports_to" className="text-base font-medium">
                    Reports To
                </Label>
                <Input
                    id="reports_to"
                    placeholder="e.g., VP of Engineering"
                    value={data.reports_to || ""}
                    onChange={(e) => updateData({ reports_to: e.target.value })}
                />
            </div>

            {/* Location */}
            <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-medium">
                    Location
                </Label>
                <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA or Remote"
                    value={data.location || ""}
                    onChange={(e) => updateData({ location: e.target.value })}
                />
            </div>

            {/* Position Type */}
            <div className="space-y-3">
                <Label className="text-base font-medium">Position Type</Label>
                <RadioGroup
                    value={data.position_type}
                    onValueChange={(value: "full-time" | "part-time" | "contract") => updateData({ position_type: value })}
                    className="flex flex-wrap gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full-time" id="full-time" />
                        <Label htmlFor="full-time" className="cursor-pointer">Full-Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="part-time" id="part-time" />
                        <Label htmlFor="part-time" className="cursor-pointer">Part-Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contract" id="contract" />
                        <Label htmlFor="contract" className="cursor-pointer">Contract</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* FLSA Status */}
            <div className="space-y-3">
                <Label className="text-base font-medium">FLSA Status</Label>
                <RadioGroup
                    value={data.flsa_status}
                    onValueChange={(value: "exempt" | "non-exempt") => updateData({ flsa_status: value })}
                    className="flex flex-wrap gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="exempt" id="exempt" />
                        <Label htmlFor="exempt" className="cursor-pointer">Exempt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non-exempt" id="non-exempt" />
                        <Label htmlFor="non-exempt" className="cursor-pointer">Non-Exempt</Label>
                    </div>
                </RadioGroup>
                <p className="text-sm text-muted-foreground">
                    Exempt employees are typically salaried and not eligible for overtime.
                </p>
            </div>

            {/* Work Arrangement */}
            <div className="space-y-3">
                <Label className="text-base font-medium">Work Arrangement</Label>
                <RadioGroup
                    value={data.work_arrangement}
                    onValueChange={(value: "onsite" | "hybrid" | "remote") => updateData({ work_arrangement: value })}
                    className="flex flex-wrap gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="onsite" id="onsite" />
                        <Label htmlFor="onsite" className="cursor-pointer">On-Site</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hybrid" id="hybrid" />
                        <Label htmlFor="hybrid" className="cursor-pointer">Hybrid</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="remote" id="remote" />
                        <Label htmlFor="remote" className="cursor-pointer">Remote</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
