"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart } from './shared/DashboardComponents';

const dataQualityIssues = [
    { dataset: 'User Profiles', issue: 'Missing Fields', severity: 'Low', affected: 15, status: 'Open' },
    { dataset: 'Transactions', issue: 'Duplicate Ref', severity: 'High', affected: 2, status: 'Investigating' },
];

export const TechDataDashboard = () => (
    <Dashboard title="Technology & Data Ops Center">

        {/* Section 1: System Health */}
        <Section title="System Pulse" width="full">
            <Row>
                <MetricCard
                    title="System Uptime"
                    value="99.95%"
                    trend="+0.02%"
                    icon="✅"
                    color="green"
                    detail="MTTR: 1.2 hours"
                />
                <MetricCard
                    title="API Response Time"
                    value="142ms"
                    trend="-8ms"
                    icon="⚡"
                    color="green"
                    detail="P95: 245ms"
                />
                <MetricCard
                    title="Data Freshness"
                    value="98.8%"
                    trend="+0.5%"
                    icon="📊"
                    color="green"
                    detail="Within SLA"
                />
                <MetricCard
                    title="Security Score"
                    value="A+"
                    trend="Stable"
                    icon="🛡️"
                    color="green"
                    detail="Last scan: 2 days ago"
                />
            </Row>

            <Row>
                <ChartCard title="System Performance Trends" width="half">
                    <SimpleChart type="line" data={{ metrics: ['Response', 'Error Rate'] }} />
                </ChartCard>

                <ChartCard title="Infrastructure Health" width="half">
                    <SimpleChart type="radial-gauge" data={{ components: ['CPU', 'Mem', 'Disk'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Data & Analytics */}
        <Section title="Data Integrity" width="full">
            <Row>
                <TableCard title="Data Quality Issues" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Dataset</th>
                                <th className="px-4 py-2">Issue</th>
                                <th className="px-4 py-2">Severity</th>
                                <th className="px-4 py-2">Affected</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataQualityIssues.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.dataset}</td>
                                    <td className="px-4 py-2">{r.issue}</td>
                                    <td className={r.severity === 'High' ? 'px-4 py-2 text-red-500' : 'px-4 py-2'}>{r.severity}</td>
                                    <td className="px-4 py-2">{r.affected}</td>
                                    <td className="px-4 py-2">{r.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Data Pipeline Health" width="third">
                    <SimpleChart type="pipeline" data={{ stages: ['Ingest', 'Transform', 'Load'] }} />
                </ChartCard>

                <ChartCard title="Dashboard Usage & Performance" width="twoThirds">
                    <SimpleChart type="heatmap" data={{ xAxis: "Dashboards", yAxis: "Users" }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Development & Projects */}
        <Section title="Development Pipeline" width="full">
            <Row>
                <MetricCard
                    title="Active Projects"
                    value="8"
                    trend="On Track"
                    icon="🔨"
                    color="blue"
                    detail="Next sprint starts Monday"
                />

                <MetricCard
                    title="Backlog Items"
                    value="24"
                    trend="+5"
                    icon="📝"
                    color="yellow"
                    detail="Prioritized by RICE"
                />

                <MetricCard
                    title="Incidents"
                    value="2"
                    trend="-1"
                    icon="🚨"
                    color="red"
                    detail="MTTR 1.8h"
                />
            </Row>
        </Section>

        {/* Section 4: Tech Actions */}
        <Section title="Tech Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Deploy Updates',
                            pending: 3,
                            icon: '🚀',
                            path: '/tech/deployments'
                        },
                        {
                            label: 'Monitor Systems',
                            alerts: 2,
                            icon: '👁️',
                            path: '/tech/monitoring'
                        },
                        {
                            label: 'Review Security',
                            scans: 1,
                            icon: '🛡️',
                            path: '/tech/security'
                        },
                        {
                            label: 'Data Governance',
                            policies: 4,
                            icon: '📋',
                            path: '/tech/governance'
                        }
                    ]}
                />
            </Row>
        </Section>
    </Dashboard>
);
