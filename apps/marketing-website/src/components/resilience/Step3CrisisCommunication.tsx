"use client";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";

interface Step3Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step3CrisisCommunication({ data, onSave }: Step3Props) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Communication Strategy
                </h3>
                <p className="text-sm text-muted-foreground">
                    Establish communication protocols for internal teams, board members, and external stakeholders.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Tier 1 */}
                <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm">Tier 1: Planned / Foreseeable</div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Routine</Badge>
                    </div>
                    <div className="space-y-1 mt-2">
                        <Label className="text-xs uppercase text-muted-foreground">Communication Protocol</Label>
                        <Select value={data.tier1Comms || ""} onValueChange={(v) => onSave({ ...data, tier1Comms: v })}>
                            <SelectTrigger className="h-9 bg-white dark:bg-slate-950">
                                <SelectValue placeholder="-- Select Protocol --" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="email_notify">Email Notification (Teams)</SelectItem>
                                <SelectItem value="slack_status">Slack Status / Channel Update</SelectItem>
                                <SelectItem value="all_hands">Mention in All-Hands</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tier 2 */}
                <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm">Tier 2: Sudden, Short-Term</div>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Urgent</Badge>
                    </div>
                    <div className="space-y-1 mt-2">
                        <Label className="text-xs uppercase text-muted-foreground">Communication Protocol</Label>
                        <Select value={data.tier2Comms || ""} onValueChange={(v) => onSave({ ...data, tier2Comms: v })}>
                            <SelectTrigger className="h-9 bg-white dark:bg-slate-950">
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

                {/* Tier 3 */}
                <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm">Tier 3: Sudden, Long-Term</div>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Severe</Badge>
                    </div>
                    <div className="space-y-1 mt-2">
                        <Label className="text-xs uppercase text-muted-foreground">Communication Protocol</Label>
                        <Select value={data.tier3Comms || ""} onValueChange={(v) => onSave({ ...data, tier3Comms: v })}>
                            <SelectTrigger className="h-9 bg-white dark:bg-slate-950">
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

                {/* Tier 4 */}
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-900">
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm text-red-700 dark:text-red-400">Tier 4: Critical / MIA</div>
                        <Badge variant="destructive">CRISIS</Badge>
                    </div>
                    <div className="space-y-1 mt-2">
                        <Label className="text-xs uppercase text-red-700/70">Communication Protocol</Label>
                        <Select value={data.tier4Comms || ""} onValueChange={(v) => onSave({ ...data, tier4Comms: v })}>
                            <SelectTrigger className="h-9 bg-white dark:bg-slate-950 border-red-200 dark:border-red-800">
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
        </div>
    );
}
