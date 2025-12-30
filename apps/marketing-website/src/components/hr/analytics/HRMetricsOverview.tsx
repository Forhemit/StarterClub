"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Clock, TrendingUp } from "lucide-react";

export function HRMetricsOverview() {
    const metrics = [
        { label: "Total Employees", value: "142", change: "+4%", icon: Users },
        { label: "New Hires", value: "8", change: "+2", icon: UserPlus },
        { label: "Avg Tenure", value: "2.4y", change: "0%", icon: Clock },
        { label: "eNPS Score", value: "48", change: "+12", icon: TrendingUp },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
                <Card key={i}>
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                        <m.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="text-2xl font-bold">{m.value}</div>
                        <div className="text-xs text-muted-foreground">{m.label}</div>
                        <div className="text-xs text-green-500 font-medium">{m.change}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
