"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart, AlertCard } from './shared/DashboardComponents';

const partnerReviews = [
    { partner: 'Alice Wong', level: 'Club Lead', last: 'Jan 15', next: 'Jul 15', performance: 'Exceeds', share: '1.2%', action: 'Schedule' },
    { partner: 'Bob Smith', level: 'Senior', last: 'Feb 20', next: 'Aug 20', performance: 'Meets', share: '2.5%', action: 'Review' },
];

export const PartnerServicesDashboard = () => (
    <Dashboard title="Partner Services Command Center">

        {/* Section 1: Partner Performance Overview */}
        <Section title="Partner Performance" width="full">
            <Row>
                <MetricCard
                    title="Active Partners"
                    value="76"
                    trend="+8"
                    icon="👥"
                    color="green"
                    detail="Including 12 new this quarter"
                />
                <MetricCard
                    title="Avg Partner Satisfaction"
                    value="4.6/5"
                    trend="+0.3"
                    icon="❤️"
                    color="green"
                    detail="From quarterly reviews"
                />
                <MetricCard
                    title="Profit Share Pool"
                    value="$124,850"
                    trend="+12.5%"
                    icon="💰"
                    color="green"
                    detail="Q2 distribution pool"
                />
                <MetricCard
                    title="Enablement Completion"
                    value="78%"
                    trend="+15%"
                    icon="🎯"
                    color="blue"
                    detail="Required training & certifications"
                />
            </Row>

            <Row>
                <ChartCard title="Partner Performance Distribution" width="half">
                    <SimpleChart type="violin" data={{ metric: "Performance", by: "Level" }} />
                </ChartCard>

                <ChartCard title="Profit Share Projections" width="half">
                    <SimpleChart type="waterfall" data={{ categories: ['Base', 'Bonus'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Individual Partner Management */}
        <Section title="Partner Management" width="full">
            <Row>
                <TableCard title="Partner Performance Review Status" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Partner</th>
                                <th className="px-4 py-2">Level</th>
                                <th className="px-4 py-2">Last Review</th>
                                <th className="px-4 py-2">Next Due</th>
                                <th className="px-4 py-2">Performance</th>
                                <th className="px-4 py-2">Profit Share</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partnerReviews.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.partner}</td>
                                    <td className="px-4 py-2">{r.level}</td>
                                    <td className="px-4 py-2">{r.last}</td>
                                    <td className="px-4 py-2">{r.next}</td>
                                    <td className="px-4 py-2">{r.performance}</td>
                                    <td className="px-4 py-2">{r.share}</td>
                                    <td className="px-4 py-2 text-blue-500 cursor-pointer">{r.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Partner Development Progress" width="third">
                    <SimpleChart type="radar" data={{ metrics: ['Skills', 'Impact'] }} />
                </ChartCard>

                <ChartCard title="Partner Contribution Mix" width="twoThirds">
                    <SimpleChart type="stacked-area" data={{ categories: ['Revenue', 'Operations'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Profit Sharing & Incentives */}
        <Section title="Incentive Management" width="full">
            <Row>
                <AlertCard
                    title="Q2 Profit Sharing"
                    level="medium"
                    affected={['42 Eligible Partners']}
                    trigger="Calculation Pending"
                    action="Review Calculations"
                />

                <MetricCard
                    title="Perf Bonuses Awarded"
                    value="$28.5k"
                    trend="May 15"
                    icon="🏆"
                    color="yellow"
                    detail="15 recipients"
                />

                <MetricCard
                    title="Retention Locked"
                    value="$156k"
                    trend="4 Yr Vest"
                    icon="🔒"
                    color="blue"
                    detail="Next cliff: Dec 2024"
                />
            </Row>
        </Section>

        {/* Section 4: Partner Actions */}
        <Section title="Partner Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Schedule Reviews',
                            overdue: 5,
                            icon: '📅',
                            path: '/partners/reviews'
                        },
                        {
                            label: 'Process Profit Share',
                            pending: '$124,850',
                            icon: '💸',
                            path: '/partners/profit-share'
                        },
                        {
                            label: 'Approve Requests',
                            count: 8,
                            icon: '✅',
                            path: '/partners/requests'
                        },
                        {
                            label: 'Update Enablement',
                            modules: 3,
                            icon: '📚',
                            path: '/partners/enablement'
                        }
                    ]}
                />
            </Row>
        </Section>
    </Dashboard>
);
