"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart, AlertCard } from './shared/DashboardComponents';

const activeCampaigns = [
    { campaign: 'Summer Sprint', channel: 'Social', budget: '$5k', spent: '$2k', results: '200 Leads', roi: '3.5x', status: 'Active' },
    { campaign: 'Corp Outreach', channel: 'Email', budget: '$2k', spent: '$1.8k', results: '45 Leads', roi: '1.2x', status: 'To Review' },
];

export const GrowthDashboard = () => (
    <Dashboard title="Growth Command Center">

        {/* Section 1: Growth Metrics */}
        <Section title="Growth Pulse" width="full">
            <Row>
                <MetricCard
                    title="MQLs This Month"
                    value="142"
                    trend="+18%"
                    icon="📥"
                    color="green"
                    detail="35% from content"
                />
                <MetricCard
                    title="CAC"
                    value="$425"
                    trend="-$15"
                    icon="💰"
                    color="green"
                    detail="Below target of $450"
                />
                <MetricCard
                    title="Conversion Rate"
                    value="8.2%"
                    trend="+0.8%"
                    icon="📈"
                    color="green"
                    detail="MQL to Member"
                />
                <MetricCard
                    title="LTV:CAC Ratio"
                    value="4.2:1"
                    trend="+0.3"
                    icon="⚖️"
                    color="green"
                    detail="Healthy (>3:1)"
                />
            </Row>

            <Row>
                <ChartCard title="Acquisition Funnel" width="half">
                    <SimpleChart type="funnel" data={{ stages: ['Awareness', 'Consideration', 'Member'] }} />
                </ChartCard>

                <ChartCard title="Channel Performance" width="half">
                    <SimpleChart type="stacked-bar" data={{ channels: ['Social', 'Content', 'Referral'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Campaign Performance */}
        <Section title="Campaign Performance" width="full">
            <Row>
                <TableCard title="Active Campaigns" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Campaign</th>
                                <th className="px-4 py-2">Channel</th>
                                <th className="px-4 py-2">Budget</th>
                                <th className="px-4 py-2">Spent</th>
                                <th className="px-4 py-2">Results</th>
                                <th className="px-4 py-2">ROI</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCampaigns.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.campaign}</td>
                                    <td className="px-4 py-2">{r.channel}</td>
                                    <td className="px-4 py-2">{r.budget}</td>
                                    <td className="px-4 py-2">{r.spent}</td>
                                    <td className="px-4 py-2">{r.results}</td>
                                    <td className="px-4 py-2">{r.roi}</td>
                                    <td className="px-4 py-2"><span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">{r.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="ROI by Campaign Type" width="third">
                    <SimpleChart type="bar" data={{ types: ['Brand', 'Conversion'] }} />
                </ChartCard>

                <ChartCard title="Content Performance" width="twoThirds">
                    <SimpleChart type="line" data={{ metrics: ['Views', 'Leads'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Pipeline & Forecasting */}
        <Section title="Pipeline Management" width="full">
            <Row>
                <AlertCard
                    title="Sales Pipeline"
                    level="medium"
                    affected={['$485k Total Value']}
                    trigger="Active"
                    action="Review Wins"
                />

                <AlertCard
                    title="Q3 Forecast"
                    level="low"
                    affected={['Target $450k', 'Forecast $465k']}
                    trigger="Confidence 85%"
                    action="Verify Assumptions"
                />

                <MetricCard
                    title="Market Trends"
                    value="Positive"
                    trend="Up"
                    icon="🌍"
                    color="blue"
                    detail="Competitor activity low"
                />
            </Row>
        </Section>

        {/* Section 4: Growth Actions */}
        <Section title="Growth Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Launch Campaign',
                            scheduled: 2,
                            icon: '🚀',
                            path: '/growth/campaigns'
                        },
                        {
                            label: 'Review Performance',
                            period: 'weekly',
                            icon: '📊',
                            path: '/growth/performance'
                        },
                        {
                            label: 'Optimize Channels',
                            opportunities: 5,
                            icon: '🎯',
                            path: '/growth/optimization'
                        },
                        {
                            label: 'Plan Content',
                            calendar: 'August',
                            icon: '📅',
                            path: '/growth/content'
                        }
                    ]}
                />
            </Row>
        </Section>
    </Dashboard>
);
