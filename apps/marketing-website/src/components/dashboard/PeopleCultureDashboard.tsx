"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, ActionList, AlertCard, SimpleChart } from './shared/DashboardComponents';

// Mock Data
const cultureData = { labels: ['Mentorship', 'Process', 'Member Exp', 'Community'], values: [30, 20, 40, 60] };
const upcomingReviews = [
    { partner: 'Sarah Jones', title: 'Club Partner', tenure: '8m', readiness: 'High', date: 'Oct 15', action: 'Review' },
    { partner: 'Mike Ross', title: 'Senior Partner', tenure: '24m', readiness: 'Medium', date: 'Oct 20', action: 'Review' },
];
const compensationData = { points: [{ x: 10, y: 50 }, { x: 20, y: 80 }] };
const departmentCulturalScores = { trust: 4.8, autonomy: 4.5, mastery: 4.7, purpose: 4.9, impact: 4.6 };

export const PeopleCultureDashboard = () => (
    <Dashboard title="People & Culture Command Center">

        {/* Section 1: Cultural Health Pulse */}
        <Section title="Culture Pulse" width="full">
            <Row>
                <MetricCard
                    title="Partner Satisfaction"
                    value="4.8/5"
                    trend="+0.2"
                    icon="❤️"
                    color="green"
                    detail="Based on 45 surveys this month"
                />
                <MetricCard
                    title="Retention Rate"
                    value="94%"
                    trend="+3%"
                    icon="📊"
                    color="green"
                    detail="12-month rolling"
                />
                <MetricCard
                    title="Progression Pace"
                    value="8.2 months"
                    trend="-0.5"
                    icon="⏱️"
                    color="blue"
                    detail="Avg time to promotion"
                />
                <MetricCard
                    title="Mentorship Index"
                    value="82%"
                    trend="+5%"
                    icon="🤝"
                    color="blue"
                    detail="Active mentor-mentee pairs"
                />
            </Row>

            <Row>
                <ChartCard title="Partner Progression Funnel" width="half">
                    <SimpleChart type="bar" data={{ stages: ['Club Partner', 'Club Lead', 'Senior', 'Senior Lead', 'Founder'], counts: [45, 18, 9, 3, 1] }} />
                </ChartCard>

                <ChartCard title="Cultural Contribution Trends" width="half">
                    <SimpleChart type="bar" data={cultureData} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Partner Performance & Growth */}
        <Section title="Partner Development" width="full">
            <Row>
                <TableCard title="Upcoming Progression Reviews" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Partner</th>
                                <th className="px-4 py-2">Current Title</th>
                                <th className="px-4 py-2">Time in Role</th>
                                <th className="px-4 py-2">Readiness</th>
                                <th className="px-4 py-2">Review Date</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingReviews.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.partner}</td>
                                    <td className="px-4 py-2">{r.title}</td>
                                    <td className="px-4 py-2">{r.tenure}</td>
                                    <td className="px-4 py-2">{r.readiness}</td>
                                    <td className="px-4 py-2">{r.date}</td>
                                    <td className="px-4 py-2 text-blue-500 cursor-pointer">{r.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Compensation Alignment" width="third">
                    <SimpleChart type="scatter" data={compensationData} />
                </ChartCard>

                <ChartCard title="Department Cultural Scores" width="twoThirds">
                    <SimpleChart type="radar" data={departmentCulturalScores} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Risk & Opportunity */}
        <Section title="Risk Radar" width="full">
            <Row>
                <AlertCard
                    title="Attrition Risk"
                    level="medium"
                    affected={['Partner Services (2 partners)', 'Tech (1 partner)']}
                    trigger="Below target satisfaction scores for 2+ months"
                    action="Schedule stay interviews this week"
                />
                <AlertCard
                    title="Progression Bottleneck"
                    level="low"
                    affected={['Club Partner -> Club Lead: 8 waiting']}
                    trigger="Average time increased 15% last quarter"
                    action="Review progression criteria"
                />
                <AlertCard
                    title="Compression Risk"
                    level="high"
                    affected={['Senior Partners in Member Services']}
                    trigger="New hire comp 12% above tenure equivalent"
                    action="Schedule comp review meeting"
                />
            </Row>
        </Section>

        {/* Section 4: Actions */}
        <Section title="Immediate Actions" width="full">
            <ActionList
                items={[
                    { action: 'Approve 3 progression recommendations', priority: 'high', assignee: 'You' },
                    { action: 'Review Q2 comp adjustments', priority: 'high', assignee: 'You' },
                    { action: 'Plan Q3 cultural initiatives', priority: 'medium', assignee: 'Team' },
                    { action: 'Update progression framework', priority: 'low', assignee: 'Team' }
                ]}
            />
        </Section>
    </Dashboard>
);
