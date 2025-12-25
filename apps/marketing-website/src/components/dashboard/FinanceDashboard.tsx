"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart } from './shared/DashboardComponents';

// Mock Data
const topEntities = [
    { entity: 'Downtown Club', type: 'Club', Revenue: '$45k', Costs: '$12k', Margin: '73%', Utilization: '85%', Action: 'Analyze' },
    { entity: 'Uptown Workspace', type: 'Space', Revenue: '$22k', Costs: '$8k', Margin: '63%', Utilization: '60%', Action: 'Promote' },
];

export const FinanceDashboard = () => (
    <Dashboard title="Financial Control Center">

        {/* Section 1: Financial Health at a Glance */}
        <Section title="Financial Pulse" width="full">
            <Row>
                <MetricCard
                    title="Monthly Recurring Revenue"
                    value="$142,850"
                    trend="+8.2%"
                    icon="💰"
                    color="green"
                    detail="vs. target $135,000"
                />
                <MetricCard
                    title="Gross Margin"
                    value="38.2%"
                    trend="+1.5%"
                    icon="📈"
                    color="green"
                    detail="+2.1% from last quarter"
                />
                <MetricCard
                    title="Cash Runway"
                    value="14.2 months"
                    trend="-0.8"
                    icon="⏳"
                    color="yellow"
                    detail="Based on current burn"
                />
                <MetricCard
                    title="AR Aging > 30 days"
                    value="$8,450"
                    trend="+$1,200"
                    icon="⚠️"
                    color="red"
                    detail="3 clients, follow-up needed"
                />
            </Row>

            <Row>
                <ChartCard title="Revenue by Stream" width="half">
                    <SimpleChart type="bar" data={{ categories: ['Memberships', 'Room Rentals', 'Events', 'Sponsorships'] }} />
                </ChartCard>

                <ChartCard title="Department P&L" width="half">
                    <SimpleChart type="bar" data={{ metrics: ['Revenue', 'Direct Costs', 'Net Profit'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Profitability Deep Dive */}
        <Section title="Profitability Analysis" width="full">
            <Row>
                <TableCard title="Top/Bottom Performing Entities" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Entity</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Revenue</th>
                                <th className="px-4 py-2">Costs</th>
                                <th className="px-4 py-2">Margin</th>
                                <th className="px-4 py-2">Utilization</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topEntities.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.entity}</td>
                                    <td className="px-4 py-2">{r.type}</td>
                                    <td className="px-4 py-2">{r.Revenue}</td>
                                    <td className="px-4 py-2">{r.Costs}</td>
                                    <td className="px-4 py-2 text-green-600">{r.Margin}</td>
                                    <td className="px-4 py-2">{r.Utilization}</td>
                                    <td className="px-4 py-2 text-blue-500 cursor-pointer">{r.Action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Margin Trends by Category" width="third">
                    <SimpleChart type="line" data={{ categories: ['Rooms', 'Workstations', 'Memberships', 'Events'] }} />
                </ChartCard>

                <ChartCard title="Cost Allocation Effectiveness" width="twoThirds">
                    <SimpleChart type="heatmap" data={{ xAxis: "Cost Categories", yAxis: "Departments" }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Compliance & Reporting */}
        <Section title="Compliance Status" width="full">
            <Row>
                <MetricCard
                    title="Month-End Close"
                    value="65%"
                    trend="In Progress"
                    icon="📅"
                    color="blue"
                    detail="Due in 2 days"
                />

                <MetricCard
                    title="Profit Sharing Calc"
                    value="Pending"
                    trend="Starts in 5 days"
                    icon="➗"
                    color="yellow"
                    detail="Q2 Review"
                />

                <MetricCard
                    title="Audit Prep"
                    value="30%"
                    trend="On Track"
                    icon="📋"
                    color="green"
                    detail="Due in 45 days"
                />
            </Row>
        </Section>

        {/* Section 4: Financial Actions */}
        <Section title="Financial Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Approve Invoices',
                            count: 12,
                            icon: '✅',
                            path: '/finance/approvals'
                        },
                        {
                            label: 'Run Financial Report',
                            type: 'revenue',
                            icon: '📊',
                            path: '/finance/reports'
                        },
                        {
                            label: 'Review Budget Variances',
                            departments: 3,
                            icon: '📋',
                            path: '/finance/budget'
                        },
                        {
                            label: 'Process Distributions',
                            amount: '$42,850',
                            icon: '💸',
                            path: '/finance/distributions'
                        }
                    ]}
                />
            </Row>
        </Section>
    </Dashboard>
);
