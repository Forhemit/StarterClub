"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { StepProps } from "./types";

export function Step7ReviewPreview({ data, updateData }: StepProps) {
    // Check completion status for each section
    const sections = [
        {
            title: "Position Identification",
            complete: !!data.title,
            items: [
                { label: "Title", value: data.title, required: true },
                { label: "Department", value: data.department },
                { label: "Reports To", value: data.reports_to },
                { label: "Location", value: data.location },
                { label: "Type", value: data.position_type },
                { label: "FLSA Status", value: data.flsa_status },
                { label: "Work Arrangement", value: data.work_arrangement },
            ]
        },
        {
            title: "Position Overview",
            complete: !!(data.mission_statement || data.impact_statement),
            items: [
                { label: "Mission Statement", value: data.mission_statement ? `${data.mission_statement.substring(0, 100)}...` : undefined },
                { label: "Impact Statement", value: data.impact_statement ? `${data.impact_statement.substring(0, 100)}...` : undefined },
            ]
        },
        {
            title: "Key Responsibilities",
            complete: data.responsibilities.length > 0,
            items: [
                { label: "Responsibilities", value: data.responsibilities.length > 0 ? `${data.responsibilities.length} defined` : undefined },
                { label: "Total Allocation", value: data.responsibilities.length > 0 ? `${data.responsibilities.reduce((sum, r) => sum + r.time_allocation, 0)}%` : undefined },
            ]
        },
        {
            title: "Authority & Metrics",
            complete: data.authorities.length > 0 || data.metrics.length > 0,
            items: [
                { label: "Authority Areas", value: data.authorities.length > 0 ? `${data.authorities.length} defined` : undefined },
                { label: "Performance Metrics", value: data.metrics.length > 0 ? `${data.metrics.length} defined` : undefined },
            ]
        },
        {
            title: "Requirements",
            complete: data.requirements.length > 0,
            items: [
                { label: "Required", value: data.requirements.filter(r => r.is_minimum).length > 0 ? `${data.requirements.filter(r => r.is_minimum).length} items` : undefined },
                { label: "Preferred", value: data.requirements.filter(r => r.is_preferred).length > 0 ? `${data.requirements.filter(r => r.is_preferred).length} items` : undefined },
            ]
        },
        {
            title: "Tools & Systems",
            complete: (data.tools?.length || 0) > 0,
            items: [
                { label: "Tools", value: (data.tools?.length || 0) > 0 ? `${data.tools.length} configured` : undefined },
                { label: "Required", value: data.tools?.filter(t => t.is_required).length > 0 ? `${data.tools.filter(t => t.is_required).length} required` : undefined },
            ]
        },
    ];

    const completedSections = sections.filter(s => s.complete).length;
    const totalSections = sections.length;

    return (
        <div className="space-y-6">
            {/* Completion Summary */}
            <Card className="bg-muted/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Review Summary</h3>
                            <p className="text-sm text-muted-foreground">
                                {completedSections} of {totalSections} sections completed
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-primary">
                                {Math.round((completedSections / totalSections) * 100)}%
                            </div>
                            <Badge variant={completedSections === totalSections ? "default" : "secondary"}>
                                {completedSections === totalSections ? "Ready" : "In Progress"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section Reviews */}
            <div className="grid gap-4 md:grid-cols-2">
                {sections.map((section, index) => (
                    <Card key={index} className={section.complete ? "" : "border-amber-200 dark:border-amber-800"}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                {section.complete ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                )}
                                {section.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <dl className="space-y-1 text-sm">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex justify-between">
                                        <dt className="text-muted-foreground">{item.label}</dt>
                                        <dd className="font-medium text-right max-w-[60%] truncate">
                                            {item.value || <span className="text-muted-foreground italic">Not set</span>}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Validation Messages */}
            {!data.title && (
                <Card className="border-destructive bg-destructive/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Position title is required before completing.</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="text-center text-sm text-muted-foreground pt-4">
                Click "Complete" to finish and save your Position SOP, or continue editing any section.
            </div>
        </div>
    );
}
