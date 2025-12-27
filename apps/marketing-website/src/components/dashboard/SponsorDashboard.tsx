"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BarChart, Eye, MousePointer } from "lucide-react";
import { MetricCard, ChartCard, SimpleChart } from './shared/DashboardComponents';

export function SponsorDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sponsor Command Center</h1>
                    <p className="text-muted-foreground">Monitor your campaign performance and ROI.</p>
                </div>
                <Button>Create New Campaign</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Total Impressions" value="45.2k" trend="+12%" icon="👁️" color="blue" />
                <MetricCard title="Clicks" value="1,204" trend="+5%" icon="🖱️" color="green" />
                <MetricCard title="Conversion Rate" value="2.6%" trend="-0.4%" icon="📉" color="yellow" />
                <MetricCard title="Active Campaigns" value="3" trend="Stable" icon="✨" color="blue" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Impression Trends" width="full">
                    <SimpleChart type="line" data={{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [5000, 7000, 6000, 8500, 9000] }} />
                </ChartCard>
                <ChartCard title="Demographic Reach" width="full">
                    <SimpleChart type="bar" data={{ categories: ['Founders', 'Devs', 'Investors'], values: [40, 35, 25] }} />
                </ChartCard>
            </div>
        </div>
    );
}
