"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step1Props {
    data: any;
    onSave: (data: any) => void;
}

const TEAM_MEMBERS = [
    { id: "tm1", name: "Alice Chen", role: "CFO", avatar: "AC", color: "bg-blue-500" },
    { id: "tm2", name: "Marcus Johnson", role: "COO", avatar: "MJ", color: "bg-green-500" },
    { id: "tm3", name: "Sarah Miller", role: "Gen. Counsel", avatar: "SM", color: "bg-purple-500" },
];

export function Step1RoleMapping({ data, onSave }: Step1Props) {
    const [showCustomDeputy, setShowCustomDeputy] = useState(false);

    const handleDeputySelect = (name: string) => {
        onSave({ ...data, deputy: name });
        setShowCustomDeputy(false);
    };

    const handleInterimChange = (value: number[]) => {
        const days = value[0];
        let valString = days.toString();
        if (days >= 180) valString = "indefinite";
        onSave({ ...data, interimDays: valString });
    };

    const getSliderValue = () => {
        if (data.interimDays === "indefinite") return 180;
        return parseInt(data.interimDays) || 30;
    };

    const getSliderLabel = (val: number) => {
        if (val >= 180) return "Indefinite";
        return `${val} Days`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Intro */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Role & Succession
                </h3>
                <p className="text-sm text-muted-foreground">Identify whom we are protecting.</p>
            </div>

            {/* 1. Target Role Pills */}
            <div className="space-y-3">
                <Label className="text-base">Target Role</Label>
                <div className="flex flex-wrap gap-2">
                    {["CEO", "CFO", "COO", "CTO", "Founder"].map((r) => (
                        <div
                            key={r}
                            onClick={() => onSave({ ...data, role: r })}
                            className={cn(
                                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all hover:bg-muted/50",
                                data.role === r
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-muted bg-background text-muted-foreground"
                            )}
                        >
                            {r}
                        </div>
                    ))}
                </div>
            </div>

            {/* 1b. Incumbent Name */}
            <div className="space-y-4">
                <Label className="text-base">Current Incumbent Name</Label>
                <Input
                    placeholder="Enter the name of the person currently in this role..."
                    value={data.incumbent || ""}
                    onChange={(e) => onSave({ ...data, incumbent: e.target.value })}
                    className="max-w-md"
                />
            </div>

            {/* 2. Deputy Selection (Titles Only) */}
            <div className="space-y-4">
                <Label className="text-base flex justify-between">
                    <span>Designated Deputy</span>
                    {data.deputy && <span className="text-primary text-sm font-normal">{data.deputy}</span>}
                </Label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Chief Financial Officer", "Chief Operating Officer", "General Counsel", "VP Engineering", "VP Sales", "Head of Product", "Chief of Staff"].map((title) => (
                        <div
                            key={title}
                            onClick={() => onSave({ ...data, deputy: title })}
                            className={cn(
                                "cursor-pointer rounded-xl border p-3 text-center transition-all hover:border-primary/50 relative overflow-hidden group",
                                data.deputy === title
                                    ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
                                    : "border-muted bg-card hover:bg-muted/30"
                            )}
                        >
                            <div className="text-xs font-medium font-medium leading-tight">{title}</div>
                            {data.deputy === title && (
                                <div className="absolute top-0 right-0 p-1">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Custom Title Input */}
                    <div
                        onClick={() => setShowCustomDeputy(true)}
                        className={cn(
                            "cursor-pointer rounded-xl border border-dashed p-3 text-center transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50",
                            showCustomDeputy ? "border-primary bg-primary/5" : ""
                        )}
                    >
                        <UserPlus className="w-4 h-4" />
                        <span className="text-xs font-medium">Other Title</span>
                    </div>
                </div>

                {showCustomDeputy && (
                    <Input
                        placeholder="Enter deputy's title..."
                        value={data.deputy || ""}
                        onChange={(e) => onSave({ ...data, deputy: e.target.value })}
                        className="animate-in fade-in slide-in-from-top-2"
                        autoFocus
                    />
                )}
            </div>

            {/* 2b. Backup & Alternate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed">
                <div className="space-y-2">
                    <Label className="text-sm">Backup Successor</Label>
                    <Input
                        placeholder="e.g. VP of Operations"
                        value={data.backupDeputy || ""}
                        onChange={(e) => onSave({ ...data, backupDeputy: e.target.value })}
                    />
                    <p className="text-[10px] text-muted-foreground">Activated if Deputy is unavailable.</p>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm">Alternate Backup</Label>
                    <Input
                        placeholder="e.g. Board Member"
                        value={data.alternateBackup || ""}
                        onChange={(e) => onSave({ ...data, alternateBackup: e.target.value })}
                    />
                    <p className="text-[10px] text-muted-foreground">Emergency failover option.</p>
                </div>
            </div>

            {/* 3. Interim Authority Slider */}
            <div className="space-y-4 p-5 bg-muted/20 rounded-xl border">
                <div className="flex justify-between items-center">
                    <Label>Interim Authority Duration</Label>
                    <Badge variant="outline" className="bg-background">{getSliderLabel(getSliderValue())}</Badge>
                </div>
                <Slider
                    defaultValue={[30]}
                    value={[getSliderValue()]}
                    max={180}
                    step={10}
                    onValueChange={handleInterimChange}
                    className="py-4"
                />
            </div>
        </div>
    );
}
