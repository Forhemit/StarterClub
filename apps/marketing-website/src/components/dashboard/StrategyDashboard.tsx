"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, ActionList, QuickActionPanel, SimpleChart, AlertCard } from './shared/DashboardComponents';

const departmentStrategicPerformance = [
    { dept: 'Tech', head: 'J. Doe', goals: 'Launch V2', progress: '85%', alignment: 'High', value: 'High' },
    { dept: 'Marketing', head: 'S. Smith', goals: 'Grow 20%', progress: '90%', alignment: 'High', value: 'High' },
];

export const StrategyDashboard = () => (
    <Dashboard title="Strategy & Impact Command Center">

        {/* Section 1: Mission & Impact */}
        <Section title="Impact Pulse" width="full">
            <Row>
                <MetricCard
                    title="Mission Alignment Score"
                    value="92%"
                    trend="+3%"
                    icon="🎯"
                    color="green"
                    detail="Based on strategic initiatives"
                />
                <MetricCard
                    title="Stakeholder Trust Index"
                    value="4.8/5"
                    trend="+0.2"
                    icon="🤝"
                    color="green"
                    detail="Partners, members, community"
                />
                <MetricCard
                    title="Long-Term Value Creation"
                    value="A+"
                    trend="Stable"
                    icon="📈"
                    color="green"
                    detail="5-year projection"
                />
                <MetricCard
                    title="Benefit Charter Progress"
                    value="78%"
                    trend="+8%"
                    icon="📜"
                    color="blue"
                    detail="Annual goals achievement"
                />
            </Row>

            <Row>
                <ChartCard title="Strategic Balance Scorecard" width="half">
                    <SimpleChart type="radar" data={{ perspectives: ['Financial', 'Customer', 'Internal'] }} />
                </ChartCard>

                <ChartCard title="Initiative Portfolio Value" width="half">
                    <SimpleChart type="bubble" data={{ xAxis: 'Alignment', yAxis: 'Return' }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Department Strategic Alignment */}
        <Section title="Department Alignment" width="full">
            <Row>
                <TableCard title="Department Strategic Performance" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Department</th>
                                <th className="px-4 py-2">Head</th>
                                <th className="px-4 py-2">Goals</th>
                                <th className="px-4 py-2">Progress</th>
                                <th className="px-4 py-2">Alignment</th>
                                <th className="px-4 py-2">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentStrategicPerformance.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.dept}</td>
                                    <td className="px-4 py-2">{r.head}</td>
                                    <td className="px-4 py-2">{r.goals}</td>
                                    <td className="px-4 py-2">{r.progress}</td>
                                    <td className="px-4 py-2">{r.alignment}</td>
                                    <td className="px-4 py-2">{r.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Resource Allocation vs. Strategy" width="third">
                    <SimpleChart type="sunburst" data={{ levels: ['Dept', 'Initiative'] }} />
                </ChartCard>

                <ChartCard title="Cultural vs. Financial Impact" width="twoThirds">
                    <SimpleChart type="scatter" data={{ xAxis: 'Cultural', yAxis: 'Financial' }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Founder's View */}
        <Section title="Founder's Lens" width="full">
            <Row>
                <AlertCard
                    title="Partner Progression"
                    level="medium"
                    affected={['Pipeline Health']}
                    trigger="Quarterly Check"
                    action="Review Talent"
                />

                <AlertCard
                    title="Cultural Legacy"
                    level="low"
                    affected={['Stories & Artifacts']}
                    trigger="Ongoing"
                    action="View Collection"
                />

                <AlertCard
                    title="Stewardship"
                    level="low"
                    affected={['Effectiveness']}
                    trigger="Annual Survey"
                    action="Read Feedback"
                />
            </Row>
        </Section>

        {/* Section 4: Strategic Actions */}
        <Section title="Strategic Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Review Strategy',
                            period: 'quarterly',
                            icon: '🎯',
                            path: '/strategy/review'
                        },
                        {
                            label: 'Meet Dept Heads',
                            scheduled: 4,
                            icon: '👥',
                            path: '/strategy/meetings'
                        },
                        {
                            label: 'Assess Impact',
                            metrics: 28,
                            icon: '📊',
                            path: '/strategy/impact'
                        },
                        {
                            label: 'Steward Culture',
                            initiatives: 3,
                            icon: '❤️',
                            path: '/strategy/culture'
                        }
                    ]}
                />
            </Row>

            <div className="mt-4">
                <ActionList
                    items={[
                        { action: 'Finalize 3-year strategic plan', priority: 'high', assignee: 'You' },
                        { action: 'Review PBC charter compliance', priority: 'high', assignee: 'You' },
                        { action: 'Meet with city partnership leads', priority: 'medium', assignee: 'You' },
                        { action: 'Prepare for board advisory meeting', priority: 'high', assignee: 'Team' }
                    ]}
                />
            </div>
        </Section>
    </Dashboard>
);
