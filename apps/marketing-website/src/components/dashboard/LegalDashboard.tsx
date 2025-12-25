"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart, AlertCard } from './shared/DashboardComponents';

const activeRisks = [
    { risk: 'Data Privacy', category: 'Compliance', score: 'High', owner: 'Legal Team', status: 'Mitigating' },
    { risk: 'Contract Renewal', category: 'Operational', score: 'Medium', owner: 'Sales Ops', status: 'Reviewing' },
];

export const LegalDashboard = () => (
    <Dashboard title="Legal & Compliance Hub">

        {/* Section 1: Compliance Status */}
        <Section title="Compliance Pulse" width="full">
            <Row>
                <MetricCard
                    title="Active Contracts"
                    value="142"
                    trend="+8"
                    icon="📝"
                    color="blue"
                    detail="12 expiring in 30 days"
                />
                <MetricCard
                    title="Compliance Score"
                    value="96%"
                    trend="+2%"
                    icon="✅"
                    color="green"
                    detail="Based on 28 requirements"
                />
                <MetricCard
                    title="Open Risks"
                    value="8"
                    trend="-2"
                    icon="⚠️"
                    color="yellow"
                    detail="3 high priority"
                />
                <MetricCard
                    title="Audit Readiness"
                    value="88%"
                    trend="+5%"
                    icon="📋"
                    color="green"
                    detail="Next audit: Q4 2024"
                />
            </Row>

            <Row>
                <ChartCard title="Compliance by Area" width="half">
                    <SimpleChart type="bar" data={{ areas: ['Privacy', 'Employment', 'Financial'] }} />
                </ChartCard>

                <ChartCard title="Contract Lifecycle" width="half">
                    <SimpleChart type="gantt" data={{ stages: ['Draft', 'Review', 'Active'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Risk Management */}
        <Section title="Risk Register" width="full">
            <Row>
                <TableCard title="Active Risks" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Risk</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Score</th>
                                <th className="px-4 py-2">Owner</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeRisks.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.risk}</td>
                                    <td className="px-4 py-2">{r.category}</td>
                                    <td className={r.score === 'High' ? 'text-red-500 px-4 py-2' : 'px-4 py-2'}>{r.score}</td>
                                    <td className="px-4 py-2">{r.owner}</td>
                                    <td className="px-4 py-2">{r.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Risk Heat Map" width="third">
                    <SimpleChart type="heatmap" data={{ xAxis: 'Impact', yAxis: 'Likelihood' }} />
                </ChartCard>

                <ChartCard title="Regulatory Change Impact" width="twoThirds">
                    <SimpleChart type="timeline" data={{ regulations: ['GDPR', 'CCPA'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Document Management */}
        <Section title="Document Management" width="full">
            <Row>
                <AlertCard
                    title="Contract Repository"
                    level="low"
                    affected={['142 Documents']}
                    trigger="Expiring soon: 12"
                    action="Review Expirations"
                />

                <AlertCard
                    title="Policy Library"
                    level="low"
                    affected={['45 Policies']}
                    trigger="Review Due Q3"
                    action="Schedule Review"
                />

                <AlertCard
                    title="Audit Trail"
                    level="low"
                    affected={['System Access']}
                    trigger="Monitoring"
                    action="View Logs"
                />
            </Row>
        </Section>

        {/* Section 4: Legal Actions */}
        <Section title="Legal Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Review Contracts',
                            pending: 8,
                            icon: '📝',
                            path: '/legal/contracts'
                        },
                        {
                            label: 'Update Policies',
                            outdated: 3,
                            icon: '📋',
                            path: '/legal/policies'
                        },
                        {
                            label: 'Assess Compliance',
                            areas: 5,
                            icon: '✅',
                            path: '/legal/compliance'
                        },
                        {
                            label: 'Manage Risks',
                            new: 2,
                            icon: '⚠️',
                            path: '/legal/risks'
                        }
                    ]}
                />
            </Row>
        </Section>
    </Dashboard>
);
