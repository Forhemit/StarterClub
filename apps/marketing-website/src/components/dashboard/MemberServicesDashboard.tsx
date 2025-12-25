"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, ActionList, QuickActionPanel, SimpleChart, AlertCard } from './shared/DashboardComponents';

const recentFeedback = [
    { member: 'John Doe', type: 'Feedback', sentiment: 'Positive', category: 'Facility', priority: 'Low', status: 'Resolved' },
    { member: 'Jane Smith', type: 'Complaint', sentiment: 'Negative', category: 'Noise', priority: 'High', status: 'Open' },
];

export const MemberServicesDashboard = () => (
    <Dashboard title="Member Services Hub">

        {/* Section 1: Member Health Metrics */}
        <Section title="Member Pulse" width="full">
            <Row>
                <MetricCard
                    title="Active Members"
                    value="342"
                    trend="+18"
                    icon="👥"
                    color="green"
                    detail="Capacity: 85%"
                />
                <MetricCard
                    title="Member Satisfaction"
                    value="4.7/5"
                    trend="+0.2"
                    icon="⭐"
                    color="green"
                    detail="From 128 surveys"
                />
                <MetricCard
                    title="Monthly Retention"
                    value="96.2%"
                    trend="+0.8%"
                    icon="📈"
                    color="green"
                    detail="Churn: 3.8%"
                />
                <MetricCard
                    title="Response Time"
                    value="1.8 hrs"
                    trend="-0.3"
                    icon="⏱️"
                    color="blue"
                    detail="Average to member inquiries"
                />
            </Row>

            <Row>
                <ChartCard title="Member Cohort Analysis" width="half">
                    <SimpleChart type="line" data={{ cohorts: ['Jan', 'Feb', 'Mar'] }} />
                </ChartCard>

                <ChartCard title="Feedback Sentiment Trend" width="half">
                    <SimpleChart type="bar" data={{ categories: ['Facility', 'Community', 'Programs'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Engagement & Experience */}
        <Section title="Member Engagement" width="full">
            <Row>
                <TableCard title="Recent Member Feedback" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Member</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Sentiment</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentFeedback.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.member}</td>
                                    <td className="px-4 py-2">{r.type}</td>
                                    <td className="px-4 py-2">{r.sentiment}</td>
                                    <td className="px-4 py-2">{r.category}</td>
                                    <td className="px-4 py-2"><span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">{r.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Program Participation" width="third">
                    <SimpleChart type="bar" data={{ metrics: ['Registration', 'Attendance'] }} />
                </ChartCard>

                <ChartCard title="Member Journey Touchpoints" width="twoThirds">
                    <SimpleChart type="sankey" data={{ stages: ['Awareness', 'Onboarding', 'Engagement'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Member Success Management */}
        <Section title="Success Management" width="full">
            <Row>
                <AlertCard
                    title="At-Risk Members (12)"
                    level="high"
                    affected={['Usage down 30%', 'Payment issues']}
                    trigger="Algorithm"
                    action="Schedule check-ins"
                />

                <AlertCard
                    title="Advocate Members (28)"
                    level="low"
                    affected={['NPS 9-10', 'High referrals']}
                    trigger="Survey"
                    action="Request testimonials"
                />

                <AlertCard
                    title="New Members (45)"
                    level="medium"
                    affected={['Joined < 30 days']}
                    trigger="Onboarding"
                    action="Complete onboarding steps"
                />
            </Row>
        </Section>

        {/* Section 4: Service Actions */}
        <Section title="Service Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Respond to Feedback',
                            count: 8,
                            icon: '💬',
                            path: '/members/feedback'
                        },
                        {
                            label: 'Process Applications',
                            pending: 14,
                            icon: '📝',
                            path: '/members/applications'
                        },
                        {
                            label: 'Plan Member Events',
                            upcoming: 3,
                            icon: '🎉',
                            path: '/members/events'
                        },
                        {
                            label: 'Review Onboarding',
                            inProgress: 12,
                            icon: '🚀',
                            path: '/members/onboarding'
                        }
                    ]}
                />
            </Row>
            <div className="mt-4">
                <ActionList
                    items={[
                        { action: 'Follow up with at-risk members (5)', priority: 'high', assignee: 'You' },
                        { action: 'Plan Q3 member appreciation events', priority: 'medium', assignee: 'Team' },
                        { action: 'Update onboarding materials', priority: 'low', assignee: 'Team' },
                        { action: 'Analyze churn reasons from last month', priority: 'medium', assignee: 'You' }
                    ]}
                />
            </div>
        </Section>
    </Dashboard>
);
