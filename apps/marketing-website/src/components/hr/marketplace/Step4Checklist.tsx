"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, UserCheck, Mail, Building, Shield, Coffee, Check, X, Clock } from "lucide-react";

// Status options for sub-items
import { type ChecklistItem, type SubItem, type SubItemStatus } from "./types";

const DEFAULT_CHECKLIST: ChecklistItem[] = [
    {
        id: "welcome",
        label: "Welcome & Orientation",
        description: "Initial welcome session and company overview",
        enabled: true,
        icon: "Coffee",
        subItems: [
            { id: "welcome-1", label: "Send welcome email with first-day details", status: "request" },
            { id: "welcome-2", label: "Prepare welcome packet and swag", status: "request" },
            { id: "welcome-3", label: "Schedule orientation session", status: "request" },
            { id: "welcome-4", label: "Assign onboarding buddy", status: "request" },
        ]
    },
    {
        id: "paperwork",
        label: "Complete Paperwork",
        description: "I-9, W-4, direct deposit, and benefits enrollment",
        enabled: true,
        icon: "FileText",
        subItems: [
            { id: "paperwork-1", label: "Complete I-9 verification", status: "request" },
            { id: "paperwork-2", label: "Submit W-4 tax form", status: "request" },
            { id: "paperwork-3", label: "Set up direct deposit", status: "request" },
            { id: "paperwork-4", label: "Enroll in benefits (health, dental, vision)", status: "request" },
            { id: "paperwork-5", label: "Sign employee handbook acknowledgment", status: "request" },
        ]
    },
    {
        id: "it-setup",
        label: "IT Account Setup",
        description: "Email, Slack, and system access provisioning",
        enabled: true,
        icon: "Mail",
        subItems: [
            { id: "it-1", label: "Create company email account", status: "request" },
            { id: "it-2", label: "Add to Slack workspace", status: "request" },
            { id: "it-3", label: "Grant access to project management tools", status: "request" },
            { id: "it-4", label: "Set up VPN access (if remote)", status: "request" },
        ]
    },
    {
        id: "equipment",
        label: "Equipment Assignment",
        description: "Laptop, badge, and workspace setup",
        enabled: true,
        icon: "Building",
        subItems: [
            { id: "equip-1", label: "Assign and configure laptop", status: "request" },
            { id: "equip-2", label: "Issue access badge/keys", status: "request" },
            { id: "equip-3", label: "Set up desk/workspace", status: "request" },
            { id: "equip-4", label: "Provide peripheral equipment", status: "request" },
        ]
    },
    {
        id: "security",
        label: "Security Training",
        description: "Complete mandatory security awareness training",
        enabled: true,
        icon: "Shield",
        subItems: [
            { id: "sec-1", label: "Complete security awareness training", status: "request" },
            { id: "sec-2", label: "Set up two-factor authentication", status: "request" },
            { id: "sec-3", label: "Review data protection policies", status: "request" },
        ]
    },
    {
        id: "meet-team",
        label: "Meet the Team",
        description: "Introduction to team members and key stakeholders",
        enabled: true,
        icon: "UserCheck",
        subItems: [
            { id: "team-1", label: "Schedule 1:1 with manager", status: "request" },
            { id: "team-2", label: "Introduce to immediate team members", status: "request" },
            { id: "team-3", label: "Meet key stakeholders", status: "request" },
            { id: "team-4", label: "Attend team meeting", status: "request" },
        ]
    },
];

interface Step4ChecklistProps {
    checklist: ChecklistItem[];
    onChecklistChange: (items: ChecklistItem[]) => void;
}

// Color-coded pill switch component
function StatusPill({ status, onChange, disabled }: { status: SubItemStatus; onChange: (status: SubItemStatus) => void; disabled?: boolean }) {
    const statuses: SubItemStatus[] = ["request", "completed", "skip"];

    const getStatusStyle = (s: SubItemStatus, isActive: boolean) => {
        if (!isActive) return "bg-muted/50 text-muted-foreground hover:bg-muted";
        switch (s) {
            case "request":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "skip":
                return "bg-slate-100 text-slate-500 border-slate-200";
        }
    };

    const getIcon = (s: SubItemStatus) => {
        switch (s) {
            case "request":
                return <Clock className="w-3 h-3" />;
            case "completed":
                return <Check className="w-3 h-3" />;
            case "skip":
                return <X className="w-3 h-3" />;
        }
    };

    const getLabel = (s: SubItemStatus) => {
        switch (s) {
            case "request":
                return "Request";
            case "completed":
                return "Done";
            case "skip":
                return "Skip";
        }
    };

    return (
        <div className="flex rounded-full border overflow-hidden bg-muted/30">
            {statuses.map((s) => (
                <button
                    key={s}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(s)}
                    className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium transition-all border-0 ${getStatusStyle(s, status === s)} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {getIcon(s)}
                    {getLabel(s)}
                </button>
            ))}
        </div>
    );
}

export function Step4Checklist({ checklist, onChecklistChange }: Step4ChecklistProps) {
    const [newItemLabel, setNewItemLabel] = useState("");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const toggleItem = (id: string) => {
        onChecklistChange(
            checklist.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    const updateSubItemStatus = (itemId: string, subItemId: string, status: SubItemStatus) => {
        onChecklistChange(
            checklist.map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        subItems: item.subItems.map(sub =>
                            sub.id === subItemId ? { ...sub, status } : sub
                        )
                    }
                    : item
            )
        );
    };

    const removeItem = (id: string) => {
        onChecklistChange(checklist.filter(item => item.id !== id));
    };

    const addItem = () => {
        if (!newItemLabel.trim()) return;
        const newItem: ChecklistItem = {
            id: `custom-${Date.now()}`,
            label: newItemLabel,
            description: "Custom onboarding step",
            enabled: true,
            icon: "FileText",
            subItems: [
                { id: `custom-${Date.now()}-1`, label: "Add sub-task here", status: "request" }
            ]
        };
        onChecklistChange([...checklist, newItem]);
        setNewItemLabel("");
    };

    const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        Coffee, FileText, Mail, Building, Shield, UserCheck
    };

    // Count active (non-skipped) and completed items
    const getItemCounts = (item: ChecklistItem) => {
        const activeItems = item.subItems.filter(s => s.status !== "skip");
        const completedItems = item.subItems.filter(s => s.status === "completed");
        const skippedItems = item.subItems.filter(s => s.status === "skip");
        return {
            active: activeItems.length,
            completed: completedItems.length,
            skipped: skippedItems.length,
            total: item.subItems.length
        };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Hire Checklist</CardTitle>
                <CardDescription>
                    Configure onboarding tasks. Use the pill switches to set each task's status: Request (pending), Done (completed), or Skip (exclude from count).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {checklist.map((item) => {
                    const Icon = IconMap[item.icon] || FileText;
                    const isExpanded = expandedItems.has(item.id);
                    const counts = getItemCounts(item);

                    return (
                        <Collapsible key={item.id} open={isExpanded} onOpenChange={() => toggleExpanded(item.id)}>
                            <div
                                className={`rounded-lg border transition-all ${item.enabled ? 'bg-card' : 'bg-muted/30 opacity-60'
                                    }`}
                            >
                                {/* Header Row */}
                                <div className="flex items-center gap-3 p-3">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                    <div className={`p-2 rounded-md ${item.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                                        <Icon className={`w-4 h-4 ${item.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{item.label}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="text-green-600">{counts.completed} done</span>
                                            <span>•</span>
                                            <span className="text-amber-600">{counts.active - counts.completed} pending</span>
                                            {counts.skipped > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-slate-400">{counts.skipped} skipped</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Switch
                                        checked={item.enabled}
                                        onCheckedChange={() => toggleItem(item.id)}
                                    />
                                    {item.id.startsWith('custom-') && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Sub-items */}
                                <CollapsibleContent>
                                    <div className="px-3 pb-3 pt-0 border-t bg-muted/20">
                                        <div className="space-y-2 pt-3">
                                            {item.subItems.map((subItem) => (
                                                <div
                                                    key={subItem.id}
                                                    className={`flex items-center gap-3 p-2 rounded-md transition-colors ${subItem.status === "skip" ? "opacity-50" : ""
                                                        } ${subItem.status === "completed" ? "bg-green-50/50" : "hover:bg-muted/50"}`}
                                                >
                                                    <span
                                                        className={`text-sm flex-1 ${subItem.status === "completed" ? "text-green-700" : ""
                                                            } ${subItem.status === "skip" ? "line-through text-muted-foreground" : ""} ${!item.enabled ? 'opacity-50' : ''}`}
                                                    >
                                                        {subItem.label}
                                                    </span>
                                                    <StatusPill
                                                        status={subItem.status}
                                                        onChange={(status) => updateSubItemStatus(item.id, subItem.id, status)}
                                                        disabled={!item.enabled}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    );
                })}

                <div className="flex gap-2 pt-4 border-t">
                    <Input
                        placeholder="Add custom step..."
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                    <Button variant="outline" onClick={addItem} disabled={!newItemLabel.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export { DEFAULT_CHECKLIST };
export type { ChecklistItem, SubItem, SubItemStatus };
