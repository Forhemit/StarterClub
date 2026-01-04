"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Briefcase,
    MapPin,
    Building2,
    Users,
    Target,
    Shield,
    CheckCircle2,
    GraduationCap,
    Calendar
} from "lucide-react";
import { PositionSOPData } from "./types";

interface SOPProfilePreviewProps {
    data: PositionSOPData;
}

export function SOPProfilePreview({ data }: SOPProfilePreviewProps) {
    const statusColors = {
        draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        pending_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        archived: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    };

    return (
        <div className="space-y-6 print:space-y-4">
            {/* Document Header */}
            <Card className="border-2">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl md:text-3xl font-bold">
                                {data.title || "Untitled Position"}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
                                {data.department && (
                                    <span className="flex items-center gap-1">
                                        <Building2 className="w-4 h-4" />
                                        {data.department}
                                    </span>
                                )}
                                {data.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {data.location}
                                    </span>
                                )}
                                {data.reports_to && (
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        Reports to: {data.reports_to}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge className={statusColors[data.status]}>
                                {data.status.replace("_", " ").toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{data.position_type}</Badge>
                            <Badge variant="outline">{data.flsa_status}</Badge>
                            <Badge variant="outline">{data.work_arrangement}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {data.version && (
                            <span>Version: {data.version}</span>
                        )}
                        {data.effective_date && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Effective: {new Date(data.effective_date).toLocaleDateString()}
                            </span>
                        )}
                        {data.review_frequency && (
                            <span>Review: {data.review_frequency}</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Mission & Impact */}
            {(data.mission_statement || data.impact_statement) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Position Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.mission_statement && (
                            <div>
                                <h4 className="font-medium mb-2">Mission Statement</h4>
                                <p className="text-muted-foreground">{data.mission_statement}</p>
                            </div>
                        )}
                        {data.impact_statement && (
                            <div>
                                <h4 className="font-medium mb-2">Impact Statement</h4>
                                <p className="text-muted-foreground">{data.impact_statement}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Key Responsibilities */}
            {data.responsibilities.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Key Responsibilities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.responsibilities.map((resp, index) => (
                                <div key={index} className="border-l-2 border-primary/20 pl-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{resp.responsibility_area}</h4>
                                        <Badge variant="secondary">{resp.time_allocation}%</Badge>
                                    </div>
                                    {resp.key_activities.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {resp.key_activities.map((activity, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="text-primary mt-1">•</span>
                                                    {activity}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Authority Matrix */}
            {data.authorities.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="w-5 h-5 text-primary" />
                            Authority Matrix
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 font-medium">Decision Area</th>
                                        <th className="text-left py-2 font-medium">Authority Level</th>
                                        <th className="text-left py-2 font-medium">Approval Required</th>
                                        <th className="text-left py-2 font-medium">Escalation Path</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.authorities.map((auth, index) => (
                                        <tr key={index} className="border-b last:border-0">
                                            <td className="py-2">{auth.decision_area}</td>
                                            <td className="py-2">{auth.authority_level}</td>
                                            <td className="py-2 text-muted-foreground">{auth.approval_required || "—"}</td>
                                            <td className="py-2 text-muted-foreground">{auth.escalation_path || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Performance Metrics */}
            {data.metrics.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="w-5 h-5 text-primary" />
                            Performance Metrics (KPIs)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {data.metrics.map((metric, index) => (
                                <div key={index} className="p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-medium">{metric.metric_name}</h4>
                                        <Badge variant="outline">{metric.metric_weight}%</Badge>
                                    </div>
                                    <p className="text-sm text-primary font-medium mt-1">Target: {metric.target}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                        <span>Measured: {metric.measurement_frequency}</span>
                                        {metric.data_source && <span>Source: {metric.data_source}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Requirements */}
            {data.requirements.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            Position Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Minimum Requirements */}
                            {data.requirements.filter(r => r.is_minimum).length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Minimum Qualifications</h4>
                                    <ul className="space-y-2">
                                        {data.requirements.filter(r => r.is_minimum).map((req, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <Badge variant="outline" className="text-xs shrink-0">
                                                    {req.requirement_type.replace("_", " ")}
                                                </Badge>
                                                <span>{req.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Preferred Requirements */}
                            {data.requirements.filter(r => r.is_preferred).length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Preferred Qualifications</h4>
                                    <ul className="space-y-2">
                                        {data.requirements.filter(r => r.is_preferred).map((req, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <Badge variant="secondary" className="text-xs shrink-0">
                                                    {req.requirement_type.replace("_", " ")}
                                                </Badge>
                                                <span>{req.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tools & Systems */}
            {(data.tools?.length || 0) > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Tools & Systems
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2">
                            {data.tools.map((tool, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{tool.tool_name}</span>
                                            {tool.is_required && (
                                                <Badge variant="default" className="text-xs">Required</Badge>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                                            <Badge variant="outline" className="text-xs">{tool.tool_category}</Badge>
                                            <span>{tool.access_level} access</span>
                                        </div>
                                        {tool.description && (
                                            <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Document Footer */}
            <div className="text-center text-xs text-muted-foreground pt-4 print:pt-8">
                <Separator className="mb-4" />
                <p>Position SOP Document • Generated {new Date().toLocaleDateString()}</p>
                {data.sop_id && <p>Document ID: {data.sop_id}</p>}
            </div>
        </div>
    );
}
