"use client";

import { useState } from "react";
import { MobileStepLayout } from "./MobileStepLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Act1Props {
    data: any;
    onSave: (data: any) => void;
    onNext: () => void;
    onBack?: () => void;
}

// Mock data for smart suggestions (in a real app, this would come from props/context)
const TEAM_MEMBERS = [
    { id: "tm1", name: "Alice Chen", role: "CFO", avatar: "AC", color: "bg-blue-500" },
    { id: "tm2", name: "Marcus Johnson", role: "COO", avatar: "MJ", color: "bg-green-500" },
    { id: "tm3", name: "Sarah Miller", role: "Gen. Counsel", avatar: "SM", color: "bg-purple-500" },
];

export function Act1RoleIdentity({ data, onSave, onNext, onBack }: Act1Props) {
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
        <MobileStepLayout
            title="Role Identity"
            description="Define the core role and key successors."
            currentStep={1}
            totalSteps={4}
            onBack={onBack}
            onNext={onNext}
            isNextDisabled={!data.role}
        >
            <div className="space-y-8">
                {/* 1. Target Role */}
                <div className="space-y-3">
                    <Label className="text-base">Which role are we safeguarding?</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {["CEO", "CFO", "COO", "CTO"].map((r) => (
                            <div
                                key={r}
                                onClick={() => onSave({ ...data, role: r })}
                                className={cn(
                                    "cursor-pointer rounded-xl border-2 p-4 text-center transition-all hover:bg-muted/50",
                                    data.role === r
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-muted bg-card"
                                )}
                            >
                                <div className="font-semibold">{r}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Deputy Selection (Smart Defaults) */}
                <div className="space-y-4">
                    <Label className="text-base flex justify-between">
                        <span>Who is your designated Deputy?</span>
                        {data.deputy && <span className="text-primary text-sm font-normal">{data.deputy}</span>}
                    </Label>

                    {/* HScroll Avatar List */}
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {TEAM_MEMBERS.map((member) => {
                            const isSelected = data.deputy === member.name;
                            return (
                                <div
                                    key={member.id}
                                    onClick={() => handleDeputySelect(member.name)}
                                    className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                                >
                                    <div className={cn(
                                        "relative w-16 h-16 rounded-full border-2 p-0.5 transition-all",
                                        isSelected ? "border-primary" : "border-transparent group-hover:border-muted"
                                    )}>
                                        <Avatar className="w-full h-full">
                                            <AvatarFallback className={cn("text-white", member.color)}>
                                                {member.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isSelected && (
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-background">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={cn("text-xs font-medium mt-2", isSelected ? "text-primary" : "text-muted-foreground")}>{member.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{member.role}</span>
                                </div>
                            );
                        })}

                        {/* Add New Option */}
                        <div
                            onClick={() => setShowCustomDeputy(true)}
                            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors",
                                showCustomDeputy || (!TEAM_MEMBERS.find(m => m.name === data.deputy) && data.deputy)
                                    ? "border-primary bg-primary/5"
                                    : "border-muted hover:border-primary/50"
                            )}>
                                <UserPlus className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <span className="text-xs font-medium mt-2 text-muted-foreground">Other</span>
                        </div>
                    </div>

                    {showCustomDeputy && (
                        <Input
                            placeholder="Enter deputy's name..."
                            value={data.deputy || ""}
                            onChange={(e) => onSave({ ...data, deputy: e.target.value })}
                            className="animate-in fade-in slide-in-from-top-2"
                            autoFocus
                        />
                    )}
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
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                        <span>Short (30d)</span>
                        <span>Medium (90d)</span>
                        <span>Indefinite</span>
                    </div>
                </div>

                {/* 4. Dual Control */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Require Dual Control?</Label>
                        <p className="text-xs text-muted-foreground">For spending over limits.</p>
                    </div>
                    <Switch
                        checked={data.requiresDualControl || false}
                        onCheckedChange={(checked) => onSave({ ...data, requiresDualControl: checked })}
                    />
                </div>
            </div>
        </MobileStepLayout>
    );
}
