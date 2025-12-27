"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Building2, Users, Handshake, Calendar } from "lucide-react";
import { MetricCard, ChartCard, SimpleChart, TableCard } from './shared/DashboardComponents';

export function PartnerDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Partner Studio</h1>
                    <p className="text-muted-foreground">Manage events, intros, and community engagement.</p>
                </div>
                <Button>Host New Event</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Events Hosted" value="8" trend="+2" icon="📅" color="blue" />
                <MetricCard title="Avg Attendance" value="42" trend="+10%" icon="👥" color="green" />
                <MetricCard title="Intros Made" value="15" trend="New" icon="🤝" color="yellow" />
                <MetricCard title="Partner Score" value="98/100" trend="Top 5%" icon="⭐" color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TableCard title="Upcoming Events" width="full">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3">Event Name</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">RSL</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-3 font-medium">Founder Mixer: Q1</td>
                                    <td className="px-4 py-3">Jan 15, 2026</td>
                                    <td className="px-4 py-3">45/50</td>
                                    <td className="px-4 py-3"><span className="text-green-600 font-bold">Confirmed</span></td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-3 font-medium">Tech Talk: Scalability</td>
                                    <td className="px-4 py-3">Jan 22, 2026</td>
                                    <td className="px-4 py-3">12/30</td>
                                    <td className="px-4 py-3"><span className="text-amber-600 font-bold">Open</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </TableCard>
                </div>
                <div>
                    <ChartCard title="Category Impact" width="full">
                        <SimpleChart type="pie" data={{ labels: ['Networking', 'Education', 'Social'], values: [50, 30, 20] }} />
                    </ChartCard>
                </div>
            </div>
        </div>
    );
}
