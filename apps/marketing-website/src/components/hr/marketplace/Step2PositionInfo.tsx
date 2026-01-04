"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Building2, Users } from "lucide-react";
import { formatPhone } from "@/lib/utils";

import { type PositionInfo } from "./types";

interface Step2PositionInfoProps {
    data: PositionInfo;
    onChange: (data: PositionInfo) => void;
}

export const DEFAULT_POSITION_INFO: PositionInfo = {
    jobTitle: "",
    department: "",
    employmentType: "full-time",
    reportsTo: "",
    managerEmail: "",
    managerPhone: "",
    workLocation: "",
    remoteStatus: "onsite",
    jobDescription: "",
};

const EMPLOYMENT_TYPES = [
    { value: "full-time", label: "Full-Time" },
    { value: "part-time", label: "Part-Time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "intern", label: "Intern" },
];

const REMOTE_OPTIONS = [
    { value: "onsite", label: "On-Site" },
    { value: "remote", label: "Fully Remote" },
    { value: "hybrid", label: "Hybrid" },
];

export function Step2PositionInfo({ data, onChange }: Step2PositionInfoProps) {
    const updateField = (field: keyof PositionInfo, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Position Information
                </CardTitle>
                <CardDescription>
                    Define the role, department, and reporting structure for the new hire.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Job Title and Department */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input
                            id="jobTitle"
                            placeholder="Software Engineer"
                            value={data.jobTitle || ""}
                            onChange={(e) => updateField("jobTitle", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">
                            Department *
                        </Label>
                        <Input
                            id="department"
                            placeholder="Engineering"
                            value={data.department || ""}
                            onChange={(e) => updateField("department", e.target.value)}
                        />
                    </div>
                </div>

                {/* Employment Type */}
                <div className="space-y-2">
                    <Label>Employment Type *</Label>
                    <Select value={data.employmentType || "full-time"} onValueChange={(v) => updateField("employmentType", v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {EMPLOYMENT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Reporting Structure */}
                <div className="space-y-4 pt-2 border-t">
                    <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        Reporting Structure
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reportsTo">Reports To (Manager Name)</Label>
                            <Input
                                id="reportsTo"
                                placeholder="e.g. Sarah Smith"
                                value={data.reportsTo || ""}
                                onChange={(e) => updateField("reportsTo", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="managerEmail">Manager Email</Label>
                            <Input
                                id="managerEmail"
                                type="email"
                                placeholder="sarah@example.com"
                                value={data.managerEmail || ""}
                                onChange={(e) => updateField("managerEmail", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="managerPhone">Manager Phone</Label>
                            <Input
                                id="managerPhone"
                                placeholder="(555) 123-4567"
                                value={data.managerPhone || ""}
                                type="tel"
                                onChange={(e) => updateField("managerPhone", formatPhone(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Work Location and Remote Status */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-2">
                        <Label htmlFor="workLocation">Work Location</Label>
                        <Input
                            id="workLocation"
                            placeholder="San Francisco, CA"
                            value={data.workLocation || ""}
                            onChange={(e) => updateField("workLocation", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Remote Status</Label>
                        <Select value={data.remoteStatus || "onsite"} onValueChange={(v) => updateField("remoteStatus", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {REMOTE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description / Summary</Label>
                    <Textarea
                        id="jobDescription"
                        placeholder="Brief overview of role responsibilities..."
                        value={data.jobDescription || ""}
                        onChange={(e) => updateField("jobDescription", e.target.value)}
                        rows={4}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
