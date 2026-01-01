"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, PlayCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Deputy {
    id: string;
    role: string;
    incumbent: string;
    deputy: string;
    backupDeputy?: string;
}

interface Step1Props {
    data: any;
    onSave: (data: any) => void;
}

const DEFAULT_ROLES = [
    "CEO",
    "CFO",
    "COO",
    "CTO",
    "VP Engineering",
    "VP Sales",
    "VP Marketing",
    "Head of Product",
    "Head of HR",
    "General Counsel"
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

export function Step1SuccessionPlanning({ data, onSave }: Step1Props) {


    return (
        <Tabs defaultValue="mapping" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mapping">Role Mapping</TabsTrigger>
                <TabsTrigger value="playbooks">Response Protocols</TabsTrigger>
                <TabsTrigger value="comms">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="mapping" className="space-y-6 pt-4">
                <div className="bg-muted/30 p-6 rounded-lg border space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-base">Role to Plan For</Label>
                            <Select
                                value={data.role || ""}
                                onValueChange={(v) => onSave({ ...data, role: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Critical Role..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEFAULT_ROLES.map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">The specific position this succession plan covers.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base">Current Incumbent</Label>
                            <Input
                                placeholder="e.g. John Smith"
                                value={data.incumbent || ""}
                                onChange={(e) => onSave({ ...data, incumbent: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-base text-blue-600 dark:text-blue-400">Designated Successor (Interim)</Label>
                            <Input
                                placeholder="e.g. Jane Doe"
                                value={data.deputy || ""}
                                onChange={(e) => onSave({ ...data, deputy: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">Who steps in immediately upon a triggering event?</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base text-slate-600 dark:text-slate-400">Backup Successor</Label>
                            <Input
                                placeholder="e.g. Bob Wilson (Optional)"
                                value={data.backupDeputy || ""}
                                onChange={(e) => onSave({ ...data, backupDeputy: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label>Interim Authority Duration (KTLO Mandate)</Label>
                        <Select
                            value={data.interimDays || "30"}
                            onValueChange={(v) => onSave({ ...data, interimDays: v })}
                        >
                            <SelectTrigger className="w-full sm:w-64">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 Days</SelectItem>
                                <SelectItem value="60">60 Days</SelectItem>
                                <SelectItem value="90">90 Days</SelectItem>
                                <SelectItem value="indefinite">Indefinite (Crisis)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Explicit "Keep-the-Lights-On" mandate duration for the interim leader.</p>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="playbooks" className="pt-4 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Succession & Continuity Protocol (Tiered Response)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="tier1" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="tier1" className="text-xs">Tier 1: Planned</TabsTrigger>
                                <TabsTrigger value="tier2" className="text-xs">Tier 2: Short-Term</TabsTrigger>
                                <TabsTrigger value="tier3" className="text-xs">Tier 3: Long-Term</TabsTrigger>
                                <TabsTrigger value="tier4" className="text-xs text-red-500 font-bold">Tier 4: Critical/MIA</TabsTrigger>
                            </TabsList>

                            <TabsContent value="tier1" className="space-y-4">
                                <div className="bg-muted/30 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-sm">Tier 1: Planned or Foreseeable Absence</div>
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Processing</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Medical leave, sabbatical, etc. (30-90 days). Contact available.
                                    </p>
                                    <div className="grid gap-4 text-sm">
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Immediate Action</Label>
                                            <Select value={data.tier1Action || ""} onValueChange={(v) => onSave({ ...data, tier1Action: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Action --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="activate_interim">Activate Interim Successor (Standard)</SelectItem>
                                                    <SelectItem value="distribute_load">Distribute Direct Reports</SelectItem>
                                                    <SelectItem value="pause_role">Pause Role Responsibilities</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Authority Scope</Label>
                                            <Select value={data.tier1Scope || ""} onValueChange={(v) => onSave({ ...data, tier1Scope: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Authority Scope --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ktlo">"Keep-the-Lights-On" (KTLO) Only</SelectItem>
                                                    <SelectItem value="full">Full Strategic Authority</SelectItem>
                                                    <SelectItem value="limited">Limited Spending Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Communication</Label>
                                            <Select value={data.tier1Comms || ""} onValueChange={(v) => onSave({ ...data, tier1Comms: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Protocol --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="internal">Internal Only</SelectItem>
                                                    <SelectItem value="board_notify">Board Notification</SelectItem>
                                                    <SelectItem value="public">Public Announcement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="tier2" className="space-y-4">
                                <div className="bg-muted/30 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-sm">Tier 2: Sudden, Short-Term</div>
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Urgent</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Personal emergency, jury duty. Contact irregular. {'<'}30 days.
                                    </p>
                                    <div className="grid gap-4 text-sm">
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Immediate Action</Label>
                                            <Select value={data.tier2Action || ""} onValueChange={(v) => onSave({ ...data, tier2Action: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Action --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="activate_interim">Activate Interim Successor</SelectItem>
                                                    <SelectItem value="triage_ops">Critical Ops Triage (72hr)</SelectItem>
                                                    <SelectItem value="delegate_down">Delegate to Direct Reports</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Authority Scope</Label>
                                            <Select value={data.tier2Scope || ""} onValueChange={(v) => onSave({ ...data, tier2Scope: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Authority Scope --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="emergency">Emergency Spending Only</SelectItem>
                                                    <SelectItem value="full_ktlo">Full KTLO Authority</SelectItem>
                                                    <SelectItem value="frozen">Spending Frozen</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Communication</Label>
                                            <Select value={data.tier2Comms || ""} onValueChange={(v) => onSave({ ...data, tier2Comms: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Protocol --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ceo_daily">Daily CEO Standup</SelectItem>
                                                    <SelectItem value="async_update">Async Updates (Slack/Email)</SelectItem>
                                                    <SelectItem value="leadership_team">Leadership Team Notify</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="tier3" className="space-y-4">
                                <div className="bg-muted/30 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-sm">Tier 3: Sudden, Long-Term</div>
                                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Severe</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Serious illness, personal crisis. Contact possible but limited. Indefinite.
                                    </p>
                                    <div className="grid gap-4 text-sm">
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Immediate Action</Label>
                                            <Select value={data.tier3Action || ""} onValueChange={(v) => onSave({ ...data, tier3Action: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Action --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="acting_title">Appoint "Acting" Title</SelectItem>
                                                    <SelectItem value="knowledge_harvest">Execute Knowledge Harvest</SelectItem>
                                                    <SelectItem value="external_search">Launch External Search</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Authority Scope</Label>
                                            <Select value={data.tier3Scope || ""} onValueChange={(v) => onSave({ ...data, tier3Scope: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Authority Scope --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="near_full">Near-Full Authority</SelectItem>
                                                    <SelectItem value="strategic_hold">Strategic Decisions on Hold</SelectItem>
                                                    <SelectItem value="board_oversight">Direct Board Oversight</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-muted-foreground">Communication</Label>
                                            <Select value={data.tier3Comms || ""} onValueChange={(v) => onSave({ ...data, tier3Comms: v })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="-- Select Protocol --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="board_formal">Formal Board Plan (7 Days)</SelectItem>
                                                    <SelectItem value="company_wide">Company-Wide Town Hall</SelectItem>
                                                    <SelectItem value="press_release">Press Release Issued</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="tier4" className="space-y-4">
                                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-900">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-sm text-red-700 dark:text-red-400">Tier 4: Critical / MIA</div>
                                        <Badge variant="destructive">CRISIS</Badge>
                                    </div>
                                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-4">
                                        Unreachable, missing, or incapacitated. NO CONTACT. Crisis-level event.
                                    </p>
                                    <div className="grid gap-4 text-sm">
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-red-700/70">Immediate Action</Label>
                                            <Select value={data.tier4Action || ""} onValueChange={(v) => onSave({ ...data, tier4Action: v })}>
                                                <SelectTrigger className="h-8 border-red-200 dark:border-red-800">
                                                    <SelectValue placeholder="-- Select Action --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="emergency_lockdown">Security Lockdown (Hour 0)</SelectItem>
                                                    <SelectItem value="activate_crisis">Activate Crisis Team</SelectItem>
                                                    <SelectItem value="appoint_successor">Immediate Successor Appt</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-red-700/70">Authority Scope</Label>
                                            <Select value={data.tier4Scope || ""} onValueChange={(v) => onSave({ ...data, tier4Scope: v })}>
                                                <SelectTrigger className="h-8 border-red-200 dark:border-red-800">
                                                    <SelectValue placeholder="-- Select Authority Scope --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="full_emergency">Full Emergency Authority</SelectItem>
                                                    <SelectItem value="dual_control">Strict Dual Control Only</SelectItem>
                                                    <SelectItem value="board_direct">Direct Board Order Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {data.tier4Scope === "dual_control" && (
                                            <div className="grid gap-3 p-3 bg-red-100/50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800/50">
                                                <div className="space-y-1">
                                                    <Label className="text-xs uppercase text-red-700/70">Controller 1 (Shared)</Label>
                                                    <Select value={data.tier4DualControl1 || ""} onValueChange={(v) => onSave({ ...data, tier4DualControl1: v })}>
                                                        <SelectTrigger className="h-8 border-red-200 dark:border-red-800">
                                                            <SelectValue placeholder="-- Select Role --" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {APPROVER_ROLES.map((role) => (
                                                                <SelectItem key={role.value} value={role.value}>
                                                                    {role.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs uppercase text-red-700/70">Controller 2 (Shared)</Label>
                                                    <Select value={data.tier4DualControl2 || ""} onValueChange={(v) => onSave({ ...data, tier4DualControl2: v })}>
                                                        <SelectTrigger className="h-8 border-red-200 dark:border-red-800">
                                                            <SelectValue placeholder="-- Select Role --" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {APPROVER_ROLES.map((role) => (
                                                                <SelectItem key={role.value} value={role.value}>
                                                                    {role.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-red-700/70">Communication</Label>
                                            <Select value={data.tier4Comms || ""} onValueChange={(v) => onSave({ ...data, tier4Comms: v })}>
                                                <SelectTrigger className="h-8 border-red-200 dark:border-red-800">
                                                    <SelectValue placeholder="-- Select Protocol --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="crisis_team">Crisis Team Control (Sole Spokesperson)</SelectItem>
                                                    <SelectItem value="blackout">Comms Blackout (Legal Review)</SelectItem>
                                                    <SelectItem value="emergency_notify">Emergency Services / Authorities</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="w-full">
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Run Table-Top Simulation
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="comms" className="pt-4 space-y-4">
                <Card>
                    <CardContent className="p-6">
                        <Label className="mb-4 block">Crisis Communication Templates</Label>
                        <div className="grid gap-2">
                            <Button variant="ghost" className="justify-start">📄 Board Notification Email</Button>
                            <Button variant="ghost" className="justify-start">📄 All-Hands Meeting Script</Button>
                            <Button variant="ghost" className="justify-start">📄 Key Customer Reassurance</Button>
                            <Button variant="ghost" className="justify-start">📄 Press Release / Public Statement</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs >
    );
}
