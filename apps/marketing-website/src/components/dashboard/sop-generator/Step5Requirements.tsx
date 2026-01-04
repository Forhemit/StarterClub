"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X, GraduationCap, Briefcase, Award, Code, Heart, Dumbbell } from "lucide-react";
import { StepProps, Requirement } from "./types";

const REQUIREMENT_TYPES = [
    { value: "education", label: "Education", icon: GraduationCap },
    { value: "experience", label: "Experience", icon: Briefcase },
    { value: "certification", label: "Certification", icon: Award },
    { value: "technical", label: "Technical Skill", icon: Code },
    { value: "soft_skill", label: "Soft Skill", icon: Heart },
    { value: "physical", label: "Physical", icon: Dumbbell },
] as const;

export function Step5Requirements({ data, updateData }: StepProps) {
    const addRequirement = (type: Requirement["requirement_type"]) => {
        const newReq: Requirement = {
            requirement_type: type,
            description: "",
            is_minimum: true,
            is_preferred: false,
            sort_order: data.requirements.length,
        };
        updateData({ requirements: [...data.requirements, newReq] });
    };

    const updateRequirement = (index: number, updates: Partial<Requirement>) => {
        const updated = [...data.requirements];
        updated[index] = { ...updated[index], ...updates };
        updateData({ requirements: updated });
    };

    const removeRequirement = (index: number) => {
        updateData({ requirements: data.requirements.filter((_, i) => i !== index) });
    };

    // Group requirements by type
    const groupedRequirements = REQUIREMENT_TYPES.map(type => ({
        ...type,
        items: data.requirements.filter(r => r.requirement_type === type.value)
    }));

    const getIcon = (type: string) => {
        const found = REQUIREMENT_TYPES.find(t => t.value === type);
        return found ? found.icon : Code;
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Define the requirements for this position. Mark items as minimum (required) or preferred.
            </p>

            {/* Quick Add Buttons */}
            <div className="flex flex-wrap gap-2">
                {REQUIREMENT_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                        <Button
                            key={type.value}
                            variant="outline"
                            size="sm"
                            onClick={() => addRequirement(type.value)}
                            className="gap-2"
                        >
                            <Icon className="w-4 h-4" />
                            Add {type.label}
                        </Button>
                    );
                })}
            </div>

            {/* Requirements List */}
            <div className="space-y-4">
                {data.requirements.map((req, index) => {
                    const Icon = getIcon(req.requirement_type);
                    const typeLabel = REQUIREMENT_TYPES.find(t => t.value === req.requirement_type)?.label;

                    return (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <Badge variant="outline" className="mb-2">{typeLabel}</Badge>
                                                <Input
                                                    placeholder={`Describe the ${typeLabel?.toLowerCase()} requirement...`}
                                                    value={req.description}
                                                    onChange={(e) => updateRequirement(index, { description: e.target.value })}
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeRequirement(index)}
                                                className="text-muted-foreground hover:text-destructive shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`min-${index}`}
                                                    checked={req.is_minimum}
                                                    onCheckedChange={(checked) => updateRequirement(index, {
                                                        is_minimum: checked,
                                                        is_preferred: checked ? false : req.is_preferred
                                                    })}
                                                />
                                                <Label htmlFor={`min-${index}`} className="text-sm cursor-pointer">
                                                    Required (Minimum)
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`pref-${index}`}
                                                    checked={req.is_preferred}
                                                    onCheckedChange={(checked) => updateRequirement(index, {
                                                        is_preferred: checked,
                                                        is_minimum: checked ? false : req.is_minimum
                                                    })}
                                                />
                                                <Label htmlFor={`pref-${index}`} className="text-sm cursor-pointer">
                                                    Preferred
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {data.requirements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No requirements added yet.</p>
                    <p className="text-sm">Use the buttons above to add requirements.</p>
                </div>
            )}

            {/* Summary */}
            {data.requirements.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                    <div className="text-sm">
                        <span className="font-medium">{data.requirements.filter(r => r.is_minimum).length}</span>
                        <span className="text-muted-foreground ml-1">Required</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">{data.requirements.filter(r => r.is_preferred).length}</span>
                        <span className="text-muted-foreground ml-1">Preferred</span>
                    </div>
                </div>
            )}
        </div>
    );
}
