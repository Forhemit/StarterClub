"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Monitor, MessageSquare, BarChart3, Palette, Code2, Users, DollarSign, Briefcase, MoreHorizontal } from "lucide-react";
import { StepProps, Tool } from "./types";

const TOOL_CATEGORIES = [
    { value: "communication", label: "Communication", icon: MessageSquare },
    { value: "productivity", label: "Productivity", icon: Briefcase },
    { value: "development", label: "Development", icon: Code2 },
    { value: "design", label: "Design", icon: Palette },
    { value: "analytics", label: "Analytics", icon: BarChart3 },
    { value: "crm", label: "CRM", icon: Users },
    { value: "hr", label: "HR", icon: Users },
    { value: "finance", label: "Finance", icon: DollarSign },
    { value: "other", label: "Other", icon: MoreHorizontal },
] as const;

const ACCESS_LEVELS = [
    { value: "view", label: "View Only" },
    { value: "edit", label: "Edit Access" },
    { value: "admin", label: "Admin Access" },
] as const;

export function Step6ToolsSystems({ data, updateData }: StepProps) {
    const addTool = () => {
        const newTool: Tool = {
            tool_name: "",
            tool_category: "productivity",
            access_level: "edit",
            is_required: true,
            description: "",
            sort_order: data.tools.length,
        };
        updateData({ tools: [...data.tools, newTool] });
    };

    const updateTool = (index: number, updates: Partial<Tool>) => {
        const updated = [...data.tools];
        updated[index] = { ...updated[index], ...updates };
        updateData({ tools: updated });
    };

    const removeTool = (index: number) => {
        updateData({ tools: data.tools.filter((_, i) => i !== index) });
    };

    const getIcon = (category: string) => {
        const found = TOOL_CATEGORIES.find(t => t.value === category);
        return found ? found.icon : Monitor;
    };

    // Group tools by category for summary
    const categoryCounts = TOOL_CATEGORIES.map(cat => ({
        ...cat,
        count: data.tools.filter(t => t.tool_category === cat.value).length
    })).filter(cat => cat.count > 0);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-muted-foreground">
                    Add the online tools and software this position uses to perform their job duties.
                </p>
            </div>

            {/* Quick Add by Category */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground py-1">Quick add:</span>
                {TOOL_CATEGORIES.slice(0, 5).map(cat => {
                    const Icon = cat.icon;
                    return (
                        <Button
                            key={cat.value}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newTool: Tool = {
                                    tool_name: "",
                                    tool_category: cat.value,
                                    access_level: "edit",
                                    is_required: true,
                                    description: "",
                                    sort_order: data.tools.length,
                                };
                                updateData({ tools: [...data.tools, newTool] });
                            }}
                            className="gap-1.5"
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {cat.label}
                        </Button>
                    );
                })}
            </div>

            {/* Tools List */}
            <div className="space-y-3">
                {data.tools.map((tool, index) => {
                    const Icon = getIcon(tool.tool_category);
                    const categoryLabel = TOOL_CATEGORIES.find(c => c.value === tool.tool_category)?.label;

                    return (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-muted shrink-0">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Tool name (e.g., Slack, Figma, Salesforce)"
                                                    value={tool.tool_name}
                                                    onChange={(e) => updateTool(index, { tool_name: e.target.value })}
                                                    className="font-medium"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeTool(index)}
                                                className="text-muted-foreground hover:text-destructive shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label className="text-sm">Category</Label>
                                                <Select
                                                    value={tool.tool_category}
                                                    onValueChange={(value: Tool["tool_category"]) => updateTool(index, { tool_category: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TOOL_CATEGORIES.map(cat => (
                                                            <SelectItem key={cat.value} value={cat.value}>
                                                                {cat.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm">Access Level</Label>
                                                <Select
                                                    value={tool.access_level}
                                                    onValueChange={(value: Tool["access_level"]) => updateTool(index, { access_level: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ACCESS_LEVELS.map(level => (
                                                            <SelectItem key={level.value} value={level.value}>
                                                                {level.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2 flex items-end">
                                                <div className="flex items-center gap-2 pb-2">
                                                    <Switch
                                                        id={`required-${index}`}
                                                        checked={tool.is_required}
                                                        onCheckedChange={(checked) => updateTool(index, { is_required: checked })}
                                                    />
                                                    <Label htmlFor={`required-${index}`} className="text-sm cursor-pointer">
                                                        Required for role
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm">Description / Notes</Label>
                                            <Input
                                                placeholder="How this tool is used in the role..."
                                                value={tool.description || ""}
                                                onChange={(e) => updateTool(index, { description: e.target.value })}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add Tool Button */}
            <Button
                variant="outline"
                onClick={addTool}
                className="w-full border-dashed"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Tool
            </Button>

            {data.tools.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Monitor className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No tools added yet.</p>
                    <p className="text-sm">Add the software and platforms this role uses daily.</p>
                </div>
            )}

            {/* Summary */}
            {categoryCounts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Summary:</span>
                    {categoryCounts.map(cat => (
                        <Badge key={cat.value} variant="secondary">
                            {cat.label}: {cat.count}
                        </Badge>
                    ))}
                    <Badge variant="outline">
                        {data.tools.filter(t => t.is_required).length} required
                    </Badge>
                </div>
            )}
        </div>
    );
}
