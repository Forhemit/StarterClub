"use client";

import { ComplianceData } from "./types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, ShieldCheck, FileCheck } from "lucide-react";

interface ComplianceTrackingPreviewProps {
    data: ComplianceData;
    mode?: 'preview' | 'full';
}

export function ComplianceTrackingPreview({ data }: ComplianceTrackingPreviewProps) {
    const allEvents = [
        ...(data.tax_events || []).map(e => ({ ...e, type: 'Tax' })),
        ...(data.registrations || []).map(e => ({ ...e, type: 'Registration' })),
        ...(data.licenses || []).map(e => ({ ...e, type: 'License' })),
        ...(data.other_documents || []).map(e => ({ ...e, type: 'Document' }))
    ].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    const pendingCount = allEvents.filter(e => e.status === 'pending').length;
    const completedCount = allEvents.filter(e => e.status === 'completed').length;
    const overdueCount = allEvents.filter(e => e.status === 'overdue').length;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {allEvents.length > 0
                                ? Math.round((completedCount / allEvents.length) * 100)
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Based on tracked items
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled for future
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{overdueCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Overdue deadlines
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="border rounded-lg bg-card">
                <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">Upcoming Deadlines</h3>
                </div>
                <div className="divide-y">
                    {allEvents.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No compliance events tracked yet.
                        </div>
                    ) : (
                        allEvents.map((event, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{event.type}</Badge>
                                        <span className="font-medium">{event.title}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 ml-1">{format(new Date(event.due_date), "PPP")}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant={event.status === 'completed' ? 'default' : event.status === 'overdue' ? 'destructive' : 'secondary'}>
                                        {event.status}
                                    </Badge>
                                    {event.jurisdiction && <div className="text-xs text-muted-foreground mt-1">{event.jurisdiction}</div>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
