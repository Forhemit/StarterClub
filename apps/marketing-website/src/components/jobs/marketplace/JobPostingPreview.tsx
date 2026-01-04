"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, BriefcaseBusiness, DollarSign, Clock, CheckCircle2, Users, Sparkles } from "lucide-react";
import { JobPostingData } from "./types";

interface JobPostingPreviewProps {
    data: JobPostingData;
    partnerTypeName?: string;
    startingSalary?: number;
}

export function JobPostingPreview({ data, partnerTypeName, startingSalary }: JobPostingPreviewProps) {
    return (
        <Card className="h-full overflow-y-auto border-dashed">
            <CardHeader className="bg-muted/30 pb-6 border-b">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold font-display tracking-tight text-primary">
                            {data.title || "Job Title"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-base">
                            <span className="font-medium text-foreground">{data.department || "Department"}</span>
                            {data.location && (
                                <>
                                    <span>•</span>
                                    <span>{data.location}</span>
                                </>
                            )}
                        </CardDescription>
                    </div>
                    {data.type && <Badge variant="secondary" className="px-3 py-1">{data.type}</Badge>}
                </div>



                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="w-4 h-4" />
                        {data.remoteType || "Remote Type"}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {Array.isArray(data.schedule) && data.schedule.length > 0 ? data.schedule.join(", ") : "Schedule"}
                    </div>
                    {partnerTypeName && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="font-medium text-foreground">{partnerTypeName}</span>
                        </div>
                    )}
                    {startingSalary && (
                        <div className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                            <Sparkles className="w-4 h-4" />
                            ${startingSalary.toLocaleString()} starting
                        </div>
                    )}
                    {(data.salaryMin && data.salaryMax) && (
                        <div className="flex items-center gap-2 font-medium text-foreground">
                            <DollarSign className="w-4 h-4" />
                            {parseInt(data.salaryMin).toLocaleString()} - {parseInt(data.salaryMax).toLocaleString()} {data.salaryCurrency} / {data.salaryPeriod}
                        </div>
                    )}
                    {(data.jobId || data.jobClass) && (
                        <div className="w-full flex gap-4 pt-2 text-xs uppercase tracking-wider font-semibold opacity-70">
                            {data.jobId && <span>ID: {data.jobId}</span>}
                            {data.jobClass && <span>Class: {data.jobClass}</span>}
                            {data.jobGrade && <span>Grade: {data.jobGrade}</span>}
                            {data.applicationDeadline && <span>Deadline: {data.applicationDeadline}</span>}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
                {/* Department Profile */}
                {data.departmentOverview && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight">Department Overview</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{data.departmentOverview}</p>
                    </div>
                )}

                {/* Description */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold tracking-tight">About the Role</h3>
                    <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed space-y-4">
                        <p>{data.description || "Job description will appear here..."}</p>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-muted/30 p-3 rounded-md border">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Experience</span>
                                <span className="font-medium">{data.experience || "Not specified"}</span>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md border">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Education</span>
                                <span className="font-medium">{data.education || "Not specified"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Responsibilities */}
                {(data.responsibilities.length > 0 || true) && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight">Responsibilities</h3>
                        {data.responsibilities.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">Add responsibilities to display them here.</p>
                        ) : (
                            <ul className="space-y-2">
                                {data.responsibilities.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="leading-normal">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {/* Success Metrics */}
                {data.successMetrics && data.successMetrics.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight">Success Metrics (KPIs)</h3>
                        <ul className="space-y-2">
                            {data.successMetrics.map((item, i) => (
                                <li key={i} className="flex gap-3 text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-2" />
                                    <span className="leading-normal">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Qualifications */}
                {(data.qualifications.length > 0 || true) && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight">Minimum Qualifications</h3>
                        {data.qualifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">Add qualifications to display them here.</p>
                        ) : (
                            <ul className="space-y-2">
                                {data.qualifications.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                        <span className="leading-normal">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Preferred Qualifications */}
                {data.preferredQualifications.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight">Preferred Qualifications</h3>
                        <ul className="space-y-2">
                            {data.preferredQualifications.map((item, i) => (
                                <li key={i} className="flex gap-3 text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0 mt-2" />
                                    <span className="leading-normal">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Restrictions */}
                {data.restrictions && data.restrictions.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight">Requirements & Restrictions</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.restrictions.map((item, i) => (
                                <Badge key={i} variant="outline" className="px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Benefits */}
                {data.benefits.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight">Benefits & Perks</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {data.benefits.map((item, i) => (
                                <div key={i} className="bg-muted/50 px-3 py-2 rounded-md text-sm text-muted-foreground border">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
            {
                data.additionalComments && (
                    <div className="px-6 pb-6 pt-0 space-y-3">
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold tracking-tight">Additional Comments</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed mt-2">
                                {data.additionalComments}
                            </p>
                        </div>
                    </div>
                )
            }
        </Card >
    );
}
