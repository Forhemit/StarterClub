"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Plus, Sparkles } from "lucide-react";
import { JobPostingData } from "./types";
import { getCareerLevels, getStartingSalary, type CareerLevel } from "@/actions/jobs";

interface Step1JobBasicsProps {
    data: JobPostingData;
    onChange: (data: JobPostingData) => void;
}

export function Step1JobBasics({ data, onChange }: Step1JobBasicsProps) {
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [careerLevels, setCareerLevels] = useState<CareerLevel[]>([]);
    const [startingSalary, setStartingSalary] = useState<{ amount: number; className: string; levelName: string } | null>(null);
    const [isLoadingSalary, setIsLoadingSalary] = useState(false);

    useEffect(() => {
        async function fetchCareerLevels() {
            const result = await getCareerLevels();
            if (result.data) {
                setCareerLevels(result.data);
            }
        }
        fetchCareerLevels();
    }, []);

    // Fetch starting salary when both Partner Type and Job Class are selected
    useEffect(() => {
        async function fetchStartingSalary() {
            if (data.partnerType && data.jobClass) {
                setIsLoadingSalary(true);
                const result = await getStartingSalary(data.partnerType, data.jobClass);
                if (result.data) {
                    setStartingSalary({
                        amount: result.data.baseSalary,
                        className: result.data.className,
                        levelName: result.data.careerLevelName,
                    });
                } else {
                    setStartingSalary(null);
                }
                setIsLoadingSalary(false);
            } else {
                setStartingSalary(null);
            }
        }
        fetchStartingSalary();
    }, [data.partnerType, data.jobClass]);

    const updateField = (field: keyof JobPostingData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const hasTitle = data.title.length > 0;
    const hasDept = data.department.length > 0;
    const hasLocation = data.location.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Basics</CardTitle>
                <CardDescription>
                    Let's start with the core details of the position.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Stage 1: Job Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Senior Product Manager"
                        value={data.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="text-lg font-medium"
                        autoFocus
                    />
                </div>

                {/* Stage 2: Department & Type (Reveals after Title) */}
                <div className={`transition-all duration-500 ease-in-out ${hasTitle ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
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
                </div>

                {/* Stage 3: Workplace & Location (Reveals after Department) */}
                <div className={`transition-all duration-500 ease-in-out ${hasDept ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
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
                </div>

                {/* Stage 4: Schedule (Reveals after Location) */}
                <div className={`transition-all duration-500 ease-in-out ${hasLocation ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
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
                    </div>
                </div>

                {/* Admin - Always visible as Collapsible at bottom */}
                <div className="pt-4 border-t">
                    <Collapsible open={isAdminOpen} onOpenChange={setIsAdminOpen} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-muted-foreground">Admin & Logistics (Optional)</Label>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-fit p-0 hover:bg-transparent text-primary hover:text-primary/80">
                                    {isAdminOpen ? (
                                        <span className="flex items-center gap-1">Hide Details <ChevronUp className="h-4 w-4" /></span>
                                    ) : (
                                        <span className="flex items-center gap-1"><Plus className="h-4 w-4" /> Add Admin Details</span>
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="space-y-4 pt-2 animate-in slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 overflow-hidden">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="jobId">Recruitment ID</Label>
                                    <Input
                                        id="jobId"
                                        placeholder="e.g. REC-2025-001"
                                        value={data.jobId}
                                        onChange={(e) => updateField("jobId", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Job Classification</Label>
                                    <div className="flex gap-2">
                                        <Select value={data.jobClass} onValueChange={(v) => updateField("jobClass", v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Class A", "Class B", "Class C", "Class D", "Class E", "Class F"].map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={data.jobGrade} onValueChange={(v) => updateField("jobGrade", v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
                                                    <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Partner Type</Label>
                                    <Select value={data.partnerType} onValueChange={(v) => updateField("partnerType", v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Partner Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {careerLevels.map(level => (
                                                <SelectItem key={level.id} value={level.id}>
                                                    {level.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Dynamic Starting Salary Display */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                        Starting Salary
                                    </Label>
                                    {isLoadingSalary ? (
                                        <div className="h-10 bg-muted/50 rounded-md animate-pulse flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground">Calculating...</span>
                                        </div>
                                    ) : startingSalary ? (
                                        <div className="h-10 px-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-md flex items-center">
                                            <span className="font-semibold text-green-700 dark:text-green-400">
                                                ${startingSalary.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="h-10 px-3 bg-muted/30 border border-dashed rounded-md flex items-center">
                                            <span className="text-xs text-muted-foreground">
                                                Select Partner Type & Job Class
                                            </span>
                                        </div>
                                    )}
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

                            <div className="space-y-4 pt-4 border-t border-dashed">
                                <h4 className="text-sm font-medium">Hiring Accountability</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hrLead">HR Lead</Label>
                                        <Input
                                            id="hrLead"
                                            placeholder="e.g. Sarah Connor"
                                            value={data.hrLead || ""}
                                            onChange={(e) => updateField("hrLead", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reqDept">Requesting Department</Label>
                                        <Input
                                            id="reqDept"
                                            placeholder="Defaults to Department"
                                            value={data.requestingDepartment || ""}
                                            onChange={(e) => updateField("requestingDepartment", e.target.value)}
                                        />
                                        <p className="text-[10px] text-muted-foreground">
                                            Leave blank to use "{data.department || 'Job Department'}"
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="teamLead">Hiring Manager</Label>
                                        <Input
                                            id="teamLead"
                                            placeholder="e.g. John Doe"
                                            value={data.hiringTeamLead || ""}
                                            onChange={(e) => updateField("hiringTeamLead", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teamEmail">Manager Email</Label>
                                        <Input
                                            id="teamEmail"
                                            placeholder="e.g. john@company.com"
                                            value={data.hiringTeamEmail || ""}
                                            onChange={(e) => updateField("hiringTeamEmail", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>

            </CardContent>
        </Card >
    );
}
