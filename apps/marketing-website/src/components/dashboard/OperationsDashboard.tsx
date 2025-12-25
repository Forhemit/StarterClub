"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, ActionList, QuickActionPanel, SimpleChart, AlertCard } from './shared/DashboardComponents';

const vendorPerformance = [
    { vendor: 'Cleaning Co.', service: 'Janitorial', sla: '98%', cost: '$2k', rating: '4.5' },
    { vendor: 'TechFix', service: 'IT Support', sla: '92%', cost: '$1.5k', rating: '4.0' },
];

export const OperationsDashboard = () => (
    <Dashboard title="Operations Command Center">

        {/* Section 1: Facility Health & Utilization */}
        <Section title="Facility Pulse" width="full">
            <Row>
                <MetricCard
                    title="Overall Utilization"
                    value="72.4%"
                    trend="+3.8%"
                    icon="📊"
                    color="green"
                    detail="Peak: 89% at 2 PM"
                />
                <MetricCard
                    title="Facility Up-Time"
                    value="99.8%"
                    trend="+0.1%"
                    icon="✅"
                    color="green"
                    detail="Last incident: 14 days ago"
                />
                <MetricCard
                    title="Cost per Member Hour"
                    value="$4.82"
                    trend="-$0.15"
                    icon="💰"
                    color="green"
                    detail="Below target of $5.20"
                />
                <MetricCard
                    title="Member Satisfaction"
                    value="4.6/5"
                    trend="+0.1"
                    icon="⭐"
                    color="green"
                    detail="Facility-related feedback"
                />
            </Row>

            <Row>
                <ChartCard title="Hourly Utilization Heatmap" width="twoThirds">
                    <SimpleChart type="heatmap" data={{ xAxis: "Hour", yAxis: "Day" }} />
                </ChartCard>

                <ChartCard title="Space Type Efficiency" width="third">
                    <SimpleChart type="radial" data={{ categories: ['Rooms', 'Workstations', 'Lounges'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Vendor & Maintenance Management */}
        <Section title="Vendor Performance" width="full">
            <Row>
                <TableCard title="Active Vendor Performance" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Vendor</th>
                                <th className="px-4 py-2">Service</th>
                                <th className="px-4 py-2">SLA Met</th>
                                <th className="px-4 py-2">Cost/Mo</th>
                                <th className="px-4 py-2">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendorPerformance.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.vendor}</td>
                                    <td className="px-4 py-2">{r.service}</td>
                                    <td className="px-4 py-2">{r.sla}</td>
                                    <td className="px-4 py-2">{r.cost}</td>
                                    <td className="px-4 py-2">{r.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Maintenance Schedule" width="half">
                    <SimpleChart type="gantt" data={{ tasks: 12, timeframe: '90 days' }} />
                </ChartCard>

                <ChartCard title="Operational Cost Breakdown" width="half">
                    <SimpleChart type="sunburst" data={{ categories: ['Cleaning', 'Utilities', 'Security'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Inventory & Supply Chain */}
        <Section title="Inventory Status" width="full">
            <Row>
                <AlertCard
                    title="Coffee & Supplies"
                    level="low"
                    affected={['Coffee Beans (65%)', 'Milk (40%)']}
                    trigger="Weekly check"
                    action="Order in 3 days"
                />

                <AlertCard
                    title="Equipment Health"
                    level="medium"
                    affected={['HVAC (Warning)', 'Kitchen Appliances (Maint Due)']}
                    trigger="Sensor alert"
                    action="Schedule service"
                />

                <MetricCard
                    title="Sustainability"
                    value="LEED Gold"
                    trend="Improving"
                    icon="🌿"
                    color="green"
                    detail="Energy down 12%"
                />
            </Row>
        </Section>

        {/* Section 4: Operational Actions */}
        <Section title="Operational Actions" width="full">
            <Row>
                <ActionList
                    items={[
                        { action: 'Approve vendor contract renewals (3)', priority: 'high', assignee: 'You' },
                        { action: 'Schedule Q3 preventative maintenance', priority: 'high', assignee: 'Team' },
                        { action: 'Review space reconfiguration proposals', priority: 'medium', assignee: 'You' },
                        { action: 'Update emergency procedures', priority: 'low', assignee: 'Team' }
                    ]}
                />
            </Row>
            <div className="mt-4">
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Manage Bookings',
                            conflicts: 2,
                            icon: '📅',
                            path: '/operations/bookings'
                        },
                        {
                            label: 'Review Incidents',
                            open: 3,
                            icon: '🚨',
                            path: '/operations/incidents'
                        },
                        {
                            label: 'Order Supplies',
                            lowStock: 5,
                            icon: '📦',
                            path: '/operations/inventory'
                        },
                        {
                            label: 'Vendor Payments',
                            pending: '$8,450',
                            icon: '💳',
                            path: '/operations/vendors'
                        }
                    ]}
                />
            </div>
        </Section>
    </Dashboard>
);
