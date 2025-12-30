"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobPostingData } from "./JobsCareersWizard";

interface Step1JobBasicsProps {
    data: JobPostingData;
    onChange: (data: JobPostingData) => void;
}

export function Step1JobBasics({ data, onChange }: Step1JobBasicsProps) {
    const updateField = (field: keyof JobPostingData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Basics</CardTitle>
                <CardDescription>
                    Let's start with the core details of the position.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Senior Product Manager"
                        value={data.title}
                        onChange={(e) => updateField("title", e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            placeholder="e.g. Engineering"
                            value={data.department}
                            onChange={(e) => updateField("department", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Employment Type</Label>
                        <Select value={data.type} onValueChange={(v) => updateField("type", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Freelance">Freelance</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="remoteType">Workplace Type</Label>
                        <Select value={data.remoteType} onValueChange={(v) => updateField("remoteType", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="On-site">On-site</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                <SelectItem value="Remote">Remote</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g. San Francisco, CA"
                            value={data.location}
                            onChange={(e) => updateField("location", e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Schedule</Label>
                    <div className="flex flex-wrap gap-2">
                        {["Monday to Friday", "Weekend availability", "Night shift", "Day shift", "Overtime", "On call"].map((item) => (
                            <div
                                key={item}
                                className={`cursor-pointer px-3 py-1.5 rounded-full text-sm border transition-all ${data.schedule.includes(item)
                                    ? "bg-primary text-primary-foreground border-primary font-medium"
                                    : "bg-background hover:bg-muted text-muted-foreground border-input"
                                    }`}
                                onClick={() => {
                                    const newSchedule = data.schedule.includes(item)
                                        ? data.schedule.filter((i) => i !== item)
                                        : [...data.schedule, item];
                                    updateField("schedule", newSchedule);
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                    {/* Fallback custom input if needed, can add later */}
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium text-muted-foreground">Admin & Logistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jobId">Recruitment ID (Optional)</Label>
                            <Input
                                id="jobId"
                                placeholder="e.g. REC-2025-001"
                                value={data.jobId}
                                onChange={(e) => updateField("jobId", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobClass">Job Classification (Optional)</Label>
                            <Input
                                id="jobClass"
                                placeholder="e.g. Class A, Pay Grade 4"
                                value={data.jobClass}
                                onChange={(e) => updateField("jobClass", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="appDeadline">Application Deadline</Label>
                            <Input
                                id="appDeadline"
                                type="date"
                                value={data.applicationDeadline}
                                onChange={(e) => updateField("applicationDeadline", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appLink">External Application Link</Label>
                            <Input
                                id="appLink"
                                placeholder="https://..."
                                value={data.applicationLink}
                                onChange={(e) => updateField("applicationLink", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
