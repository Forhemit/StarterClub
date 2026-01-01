"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

interface Step7Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step7Escalation({ data, onSave }: Step7Props) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-primary" />
                    Elevation & Escalation
                </h3>
                <p className="text-sm text-muted-foreground">
                    Define specific triggers and "When in Doubt" rules for escalating decisions.
                </p>
            </div>

            <Card className="p-6 bg-muted/20">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="font-semibold text-base">
                            "When in Doubt" Escalation Pathway
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            List specific scenarios where decision authority is automatically revoked and must be elevated to a higher power (e.g. Board, CEO).
                        </p>
                        <Textarea
                            placeholder="- Any unbudgeted expense > $50k
- Hiring of VP level or above
- Legal threats or lawsuits
- Press inquiries regarding crisis
- Security breaches"
                            className="min-h-[200px] font-mono text-sm leading-relaxed"
                            value={data.escalationPathway || ""}
                            onChange={(e) => onSave({ ...data, escalationPathway: e.target.value })}
                        />
                    </div>
                </div>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Why this matters?</h4>
                <p className="text-xs text-blue-800 dark:text-blue-400">
                    Clear escalation rules prevent "hero mode" during crises. By defining exactly what constitutes an escalation event, you remove ambiguity for the interim successor.
                </p>
            </div>
        </div>
    );
}
