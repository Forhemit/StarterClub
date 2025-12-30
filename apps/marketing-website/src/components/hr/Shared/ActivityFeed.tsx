"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Activity {
    user: string;
    action: string;
    time: string;
    avatar?: string;
}

export function RecentActivityFeed({ limit = 5 }: { limit?: number }) {
    const activities: Activity[] = [
        { user: "Sarah Connor", action: "Completed onboarding", time: "2h ago", avatar: "SC" },
        { user: "John Doe", action: "Submitted review", time: "4h ago", avatar: "JD" },
        { user: "Mike Ross", action: "Requested time off", time: "5h ago", avatar: "MR" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.slice(0, limit).map((act, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{act.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-medium">{act.user}</p>
                                <p className="text-muted-foreground text-xs">{act.action} • {act.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
