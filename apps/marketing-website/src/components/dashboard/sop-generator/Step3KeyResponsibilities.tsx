"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Plus, X, GripVertical } from "lucide-react";
import { StepProps, Responsibility } from "./types";

export function Step3KeyResponsibilities({ data, updateData }: StepProps) {
    const [newActivity, setNewActivity] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const addResponsibility = () => {
        const newResponsibility: Responsibility = {
            responsibility_area: "",
            key_activities: [],
            time_allocation: 0,
            priority: data.responsibilities.length + 1,
            sort_order: data.responsibilities.length,
        };
        updateData({
            responsibilities: [...data.responsibilities, newResponsibility]
        });
        setEditingIndex(data.responsibilities.length);
    };

    const updateResponsibility = (index: number, updates: Partial<Responsibility>) => {
        const updated = [...data.responsibilities];
        updated[index] = { ...updated[index], ...updates };
        updateData({ responsibilities: updated });
    };

    const removeResponsibility = (index: number) => {
        const updated = data.responsibilities.filter((_, i) => i !== index);
        updateData({ responsibilities: updated });
        if (editingIndex === index) setEditingIndex(null);
    };

    const addActivity = (respIndex: number) => {
        if (!newActivity.trim()) return;
        const resp = data.responsibilities[respIndex];
        updateResponsibility(respIndex, {
            key_activities: [...resp.key_activities, newActivity.trim()]
        });
        setNewActivity("");
    };

    const removeActivity = (respIndex: number, actIndex: number) => {
        const resp = data.responsibilities[respIndex];
        updateResponsibility(respIndex, {
            key_activities: resp.key_activities.filter((_, i) => i !== actIndex)
        });
    };

    const totalAllocation = data.responsibilities.reduce((sum, r) => sum + r.time_allocation, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Add the key responsibility areas for this position and allocate time.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={totalAllocation === 100 ? "default" : totalAllocation > 100 ? "destructive" : "secondary"}>
                        {totalAllocation}% allocated
                    </Badge>
                </div>
            </div>

            {/* Responsibilities List */}
            <div className="space-y-4">
                {data.responsibilities.map((resp, index) => (
                    <Card key={index} className="relative">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="cursor-move text-muted-foreground hover:text-foreground">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <Input
                                            placeholder="Responsibility Area (e.g., Team Leadership)"
                                            value={resp.responsibility_area}
                                            onChange={(e) => updateResponsibility(index, { responsibility_area: e.target.value })}
                                            className="font-medium"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeResponsibility(index)}
                                            className="text-muted-foreground hover:text-destructive shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* Time Allocation Slider */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm">Time Allocation</Label>
                                            <span className="text-sm font-medium">{resp.time_allocation}%</span>
                                        </div>
                                        <Slider
                                            value={[resp.time_allocation]}
                                            onValueChange={(value) => updateResponsibility(index, { time_allocation: value[0] })}
                                            max={100}
                                            step={5}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Key Activities */}
                                    <div className="space-y-2">
                                        <Label className="text-sm">Key Activities</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {resp.key_activities.map((activity, actIndex) => (
                                                <Badge key={actIndex} variant="secondary" className="gap-1 pr-1">
                                                    {activity}
                                                    <button
                                                        onClick={() => removeActivity(index, actIndex)}
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add an activity..."
                                                value={editingIndex === index ? newActivity : ""}
                                                onChange={(e) => {
                                                    setEditingIndex(index);
                                                    setNewActivity(e.target.value);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addActivity(index);
                                                    }
                                                }}
                                                className="text-sm"
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => addActivity(index)}
                                                disabled={editingIndex !== index || !newActivity.trim()}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Responsibility Button */}
            <Button
                variant="outline"
                onClick={addResponsibility}
                className="w-full border-dashed"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Responsibility Area
            </Button>

            {data.responsibilities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No responsibilities added yet.</p>
                    <p className="text-sm">Click the button above to add a responsibility area.</p>
                </div>
            )}
        </div>
    );
}
