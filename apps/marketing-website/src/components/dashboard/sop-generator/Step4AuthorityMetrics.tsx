"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, X, Shield, Target } from "lucide-react";
import { StepProps, Authority, Metric } from "./types";

export function Step4AuthorityMetrics({ data, updateData }: StepProps) {
    // Authority functions
    const addAuthority = () => {
        const newAuthority: Authority = {
            decision_area: "",
            authority_level: "",
            approval_required: "",
            escalation_path: "",
            sort_order: data.authorities.length,
        };
        updateData({ authorities: [...data.authorities, newAuthority] });
    };

    const updateAuthority = (index: number, updates: Partial<Authority>) => {
        const updated = [...data.authorities];
        updated[index] = { ...updated[index], ...updates };
        updateData({ authorities: updated });
    };

    const removeAuthority = (index: number) => {
        updateData({ authorities: data.authorities.filter((_, i) => i !== index) });
    };

    // Metric functions
    const addMetric = () => {
        const newMetric: Metric = {
            metric_name: "",
            target: "",
            measurement_frequency: "monthly",
            metric_weight: 0,
            data_source: "",
            sort_order: data.metrics.length,
        };
        updateData({ metrics: [...data.metrics, newMetric] });
    };

    const updateMetric = (index: number, updates: Partial<Metric>) => {
        const updated = [...data.metrics];
        updated[index] = { ...updated[index], ...updates };
        updateData({ metrics: updated });
    };

    const removeMetric = (index: number) => {
        updateData({ metrics: data.metrics.filter((_, i) => i !== index) });
    };

    const totalWeight = data.metrics.reduce((sum, m) => sum + m.metric_weight, 0);

    return (
        <div className="space-y-8">
            {/* Authority Matrix Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Authority Matrix</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Define decision-making authority levels for this position.
                </p>

                <div className="space-y-3">
                    {data.authorities.map((auth, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Decision Area</Label>
                                        <Input
                                            placeholder="e.g., Budget Approvals"
                                            value={auth.decision_area}
                                            onChange={(e) => updateAuthority(index, { decision_area: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Authority Level</Label>
                                        <Input
                                            placeholder="e.g., Up to $10,000"
                                            value={auth.authority_level}
                                            onChange={(e) => updateAuthority(index, { authority_level: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Approval Required From</Label>
                                        <Input
                                            placeholder="e.g., Director approval for > $10k"
                                            value={auth.approval_required || ""}
                                            onChange={(e) => updateAuthority(index, { approval_required: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Escalation Path</Label>
                                            <Input
                                                placeholder="e.g., Manager → Director → VP"
                                                value={auth.escalation_path || ""}
                                                onChange={(e) => updateAuthority(index, { escalation_path: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeAuthority(index)}
                                            className="text-muted-foreground hover:text-destructive shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button variant="outline" onClick={addAuthority} className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Authority Area
                </Button>
            </div>

            {/* Performance Metrics Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Performance Metrics (KPIs)</h3>
                    </div>
                    <span className={`text-sm ${totalWeight === 100 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {totalWeight}% weighted
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Define key performance indicators for measuring success.
                </p>

                <div className="space-y-3">
                    {data.metrics.map((metric, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Metric Name</Label>
                                        <Input
                                            placeholder="e.g., Customer Satisfaction Score"
                                            value={metric.metric_name}
                                            onChange={(e) => updateMetric(index, { metric_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Target</Label>
                                        <Input
                                            placeholder="e.g., ≥ 90%"
                                            value={metric.target}
                                            onChange={(e) => updateMetric(index, { target: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Measurement Frequency</Label>
                                        <Select
                                            value={metric.measurement_frequency}
                                            onValueChange={(value: Metric["measurement_frequency"]) => updateMetric(index, { measurement_frequency: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                                <SelectItem value="annually">Annually</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label>Weight</Label>
                                            <span className="text-sm">{metric.metric_weight}%</span>
                                        </div>
                                        <Slider
                                            value={[metric.metric_weight]}
                                            onValueChange={(value) => updateMetric(index, { metric_weight: value[0] })}
                                            max={100}
                                            step={5}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Data Source</Label>
                                            <Input
                                                placeholder="e.g., CRM Dashboard, Survey Tool"
                                                value={metric.data_source || ""}
                                                onChange={(e) => updateMetric(index, { data_source: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeMetric(index)}
                                            className="text-muted-foreground hover:text-destructive shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button variant="outline" onClick={addMetric} className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Performance Metric
                </Button>
            </div>
        </div>
    );
}
