"use client";

import React from 'react';
import { Dashboard, Section, Row, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart, AlertCard } from './shared/DashboardComponents';

const curriculumPipeline = [
    { program: 'Leadership 101', stage: 'Dev', owner: 'M. Scott', progress: '60%', launch: 'Nov 1', status: 'On Track' },
    { program: 'Crypto Finance', stage: 'Review', owner: 'R. Geller', progress: '90%', launch: 'Oct 15', status: 'Review' },
];

export const ProgramsDashboard = () => (
    <Dashboard title="Programs & Curriculum Studio">

        {/* Section 1: Program Performance */}
        <Section title="Program Performance" width="full">
            <Row>
                <MetricCard
                    title="Active Programs"
                    value="24"
                    trend="+3"
                    icon="📚"
                    color="green"
                    detail="8 new this quarter"
                />
                <MetricCard
                    title="Avg Program Rating"
                    value="4.8/5"
                    trend="+0.1"
                    icon="⭐"
                    color="green"
                    detail="From 342 reviews"
                />
                <MetricCard
                    title="Completion Rate"
                    value="78%"
                    trend="+4%"
                    icon="🎯"
                    color="green"
                    detail="Of enrolled participants"
                />
                <MetricCard
                    title="Revenue per Program"
                    value="$8,450"
                    trend="+12%"
                    icon="💰"
                    color="green"
                    detail="Average across programs"
                />
            </Row>

            <Row>
                <ChartCard title="Program Portfolio Health" width="half">
                    <SimpleChart type="bubble" data={{ xAxis: 'Sat', yAxis: 'Rev' }} />
                </ChartCard>

                <ChartCard title="Learning Outcome Achievement" width="half">
                    <SimpleChart type="radial-gauge" data={{ metrics: ['Knowledge', 'Skills'] }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 2: Curriculum Development */}
        <Section title="Curriculum Pipeline" width="full">
            <Row>
                <TableCard title="Curriculum Development Status" width="full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Program</th>
                                <th className="px-4 py-2">Stage</th>
                                <th className="px-4 py-2">Owner</th>
                                <th className="px-4 py-2">Progress</th>
                                <th className="px-4 py-2">Launch</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {curriculumPipeline.map((r, i) => (
                                <tr key={i} className="border-b dark:border-zinc-800">
                                    <td className="px-4 py-2 font-medium">{r.program}</td>
                                    <td className="px-4 py-2">{r.stage}</td>
                                    <td className="px-4 py-2">{r.owner}</td>
                                    <td className="px-4 py-2">{r.progress}</td>
                                    <td className="px-4 py-2">{r.launch}</td>
                                    <td className="px-4 py-2"><span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">{r.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </Row>

            <Row>
                <ChartCard title="Content Quality Metrics" width="third">
                    <SimpleChart type="radar" data={{ dimensions: ['Accuracy', 'Engagement'] }} />
                </ChartCard>

                <ChartCard title="Instructor Performance" width="twoThirds">
                    <SimpleChart type="heatmap" data={{ xAxis: 'Instructor', yAxis: 'Program' }} />
                </ChartCard>
            </Row>
        </Section>

        {/* Section 3: Innovation & Development */}
        <Section title="Innovation Pipeline" width="full">
            <Row>
                <AlertCard
                    title="New Ideas (18)"
                    level="low"
                    affected={['Concept Stage']}
                    trigger="Quarterly Review"
                    action="Review next week"
                />

                <AlertCard
                    title="Pilots Active (6)"
                    level="medium"
                    affected={['Feedback Collection']}
                    trigger="Mid-point"
                    action="Check outcomes"
                />

                <AlertCard
                    title="Improvements (12)"
                    level="low"
                    affected={['Q4 Launch']}
                    trigger="Schedule"
                    action="Monitor"
                />
            </Row>
        </Section>

        {/* Section 4: Program Actions */}
        <Section title="Program Actions" width="full">
            <Row>
                <QuickActionPanel
                    actions={[
                        {
                            label: 'Review Feedback',
                            new: 45,
                            icon: '💬',
                            path: '/programs/feedback'
                        },
                        {
                            label: 'Approve Curriculum',
                            pending: 3,
                            icon: '✅',
                            path: '/programs/approvals'
                        },
                        {
                            label: 'Instructor Training',
                            upcoming: 2,
                            icon: '👨‍🏫',
                            path: '/programs/training'
                        },
                        {
                            label: 'Launch Program',
                            ready: 1,
                            icon: '🚀',
                            path: '/programs/launch'
                        }
                    ]}
                />
            </Row>
        </Section>
    </Dashboard>
);
