"use client";

import React, { useState } from 'react';
import { Dashboard, Section, Row, GridRow, ColWrapper, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart, AlertCard, ActionList } from './shared/DashboardComponents';

// Mock Data for Super Admin
const departments = [
    { code: 'fin', name: 'Finance', head: 'Alice', title: 'Senior Partner', status: 'On Track', metric: 'Revenue', val: '$428k', alert: 0 },
    { code: 'ops', name: 'Operations', head: 'Bob', title: 'Senior Lead', status: 'At Risk', metric: 'Uptime', val: '99.5%', alert: 2 },
    { code: 'tech', name: 'Tech & Data', head: 'Charlie', title: 'Senior Lead', status: 'On Track', metric: 'Bugs', val: '12', alert: 1 },
];

const financialAlerts = [
    { title: 'Cash Flow Warning', level: 'medium', affected: ['OpEx'], trigger: 'Spending Spike', action: 'Review' }
];

const systemLogs = [
    { time: '10:42:15', type: 'Security', event: 'Failed login attempt (IP: 192.168.1.1)', status: 'Blocked' },
    { time: '10:41:02', type: 'Financial', event: 'Large transaction > $10k approved', status: 'Success' },
    { time: '10:35:22', type: 'System', event: 'Backup completed successfully', status: 'Success' },
    { time: '10:30:00', type: 'Admin', event: 'User role updated: j.doe', status: 'Success' },
];

export const SuperAdminDashboard = () => {
    const [emergencyMode, setEmergencyMode] = useState(false);

    return (
        <Dashboard title="Super Admin Command Center">

            {/* Section 1: Enterprise Overview */}
            <Section title="Enterprise Overview" width="full">
                <Row>
                    <MetricCard
                        title="Total Enterprise Value"
                        value="$8.2M"
                        trend="+12.8%"
                        icon="🏢"
                        color="green"
                        detail="Multiple: 8.5x EBITDA"
                    />
                    <MetricCard
                        title="Recurring Revenue (MRR)"
                        value="$428,500"
                        trend="+8.2%"
                        icon="💰"
                        color="green"
                        detail="Annualized: $5.14M"
                    />
                    <MetricCard
                        title="Enterprise Health"
                        value="92/100"
                        trend="+4"
                        icon="❤️"
                        color="green"
                        detail="Ops, Fin, Culture"
                    />
                    <MetricCard
                        title="System Security"
                        value="A+"
                        trend="Stable"
                        icon="🛡️"
                        color="green"
                        detail="0 Breaches"
                    />
                </Row>

                <Row>
                    <ChartCard title="Performance vs Target" width="twoThirds">
                        <SimpleChart type="bar" data={{ metrics: ['Revenue', 'Margin', 'Growth', 'Sat', 'Uptime'] }} />
                    </ChartCard>
                    <ChartCard title="Risk Radar" width="third">
                        <SimpleChart type="radar" data={{ categories: ['Financial', 'Ops', 'Legal', 'Reputation', 'Tech'] }} />
                    </ChartCard>
                </Row>
            </Section>

            {/* Section 2: Department Command Center */}
            <Section title="Department Status" width="full">
                <Row>
                    <TableCard title="Department Scorecards" width="full">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-4 py-2">Department</th>
                                    <th className="px-4 py-2">Head</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Key Metric</th>
                                    <th className="px-4 py-2">Value</th>
                                    <th className="px-4 py-2">Alerts</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((dept, i) => (
                                    <tr key={i} className="border-b dark:border-zinc-800">
                                        <td className="px-4 py-2 font-medium">{dept.name}</td>
                                        <td className="px-4 py-2">{dept.head} ({dept.title})</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded ${dept.status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {dept.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{dept.metric}</td>
                                        <td className="px-4 py-2">{dept.val}</td>
                                        <td className="px-4 py-2 text-red-500 font-bold">{dept.alert > 0 ? dept.alert : '-'}</td>
                                        <td className="px-4 py-2 text-blue-500 hover:underline cursor-pointer">Drill Down</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableCard>
                </Row>
            </Section>

            {/* Section 3: Financial & Controls */}
            <Section title="Financial & System Controls" width="full">
                <Row>
                    <MetricCard
                        title="Cash Balance"
                        value="$1.25M"
                        trend="-1.2%"
                        icon="🏦"
                        color="blue"
                        detail="Runway: 14.7 months"
                    />
                    <MetricCard
                        title="Profit Share Pool"
                        value="$485k"
                        trend="Q2 Est"
                        icon="💸"
                        color="green"
                        detail="42 Eligible Partners"
                    />
                    <AlertCard
                        title="Financial Override Queue"
                        level="low"
                        affected={['3 Requests']}
                        trigger="Pending Approval"
                        action="Approve/Deny"
                    />
                </Row>
            </Section>

            {/* Section 4: System & Security */}
            <Section title="System & Security Ops" width="full">
                <GridRow>
                    <ColWrapper width="third">
                        <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-full">
                            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Infrastructure Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm"><span className="text-zinc-500 font-medium">API Server</span> <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-bold dark:bg-green-900/30 dark:text-green-400">Operational</span></div>
                                <div className="flex justify-between items-center text-sm"><span className="text-zinc-500 font-medium">Database</span> <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-bold dark:bg-green-900/30 dark:text-green-400">Operational</span></div>
                                <div className="flex justify-between items-center text-sm"><span className="text-zinc-500 font-medium">Auth Service</span> <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-bold dark:bg-green-900/30 dark:text-green-400">Operational</span></div>
                                <div className="flex justify-between items-center text-sm"><span className="text-zinc-500 font-medium">CDN</span> <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-bold dark:bg-yellow-900/30 dark:text-yellow-400">Degraded</span></div>
                            </div>
                        </div>
                    </ColWrapper>

                    <ChartCard title="Real-Time Activity Log" width="twoThirds">
                        <div className="w-full">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-xs text-zinc-500 uppercase">
                                        <th className="px-4 py-2">Time</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Event</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {systemLogs.map((log, i) => (
                                        <tr key={i} className="border-b dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                            <td className="px-4 py-3 font-mono text-xs">{log.time}</td>
                                            <td className="px-4 py-3 text-xs">{log.type}</td>
                                            <td className="px-4 py-3">{log.event}</td>
                                            <td className={`px-4 py-3 text-xs font-bold ${log.status === 'Success' ? 'text-green-500' : 'text-red-500'}`}>{log.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ChartCard>
                </GridRow>
            </Section>

            {/* Section 5: Crisis & Controls */}
            <Section title="Crisis Management & Controls" width="full">
                <Row>
                    <div className="w-full px-2 mb-4">
                        <div className={`p-6 rounded-2xl border-2 ${emergencyMode ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    🚨 Emergency Control Panel
                                    {emergencyMode && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse">ACTIVE</span>}
                                </h3>
                                <button
                                    onClick={() => setEmergencyMode(!emergencyMode)}
                                    className={`px-4 py-2 rounded font-bold transition-colors ${emergencyMode ? 'bg-zinc-200 text-zinc-800' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                >
                                    {emergencyMode ? 'DEACTIVATE PROTOCOLS' : 'ACTIVATE EMERGENCY PROTOCOLS'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="p-3 border border-red-200 dark:border-red-900 rounded bg-white dark:bg-black text-left hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <span className="block font-bold text-red-600">Freeze Financials</span>
                                    <span className="text-xs text-zinc-500">Stop all outgoing payments</span>
                                </button>
                                <button className="p-3 border border-red-200 dark:border-red-900 rounded bg-white dark:bg-black text-left hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <span className="block font-bold text-red-600">System Lockdown</span>
                                    <span className="text-xs text-zinc-500">Restrict access to admins only</span>
                                </button>
                                <button className="p-3 border border-red-200 dark:border-red-900 rounded bg-white dark:bg-black text-left hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <span className="block font-bold text-red-600">Data Preservation</span>
                                    <span className="text-xs text-zinc-500">Snapshot & off-site backup</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Row>

                <Row>
                    <QuickActionPanel
                        actions={[
                            { label: 'Generate Exec Report', icon: '📊', path: '/superadmin/reports' },
                            { label: 'Audit System', icon: '🔍', path: '/superadmin/audit' },
                            { label: 'Manage Permissions', icon: '🔐', path: '/superadmin/permissions' },
                            { label: 'Deploy Update', icon: '🚀', path: '/superadmin/deploy' }
                        ]}
                    />
                </Row>
            </Section>
        </Dashboard>
    );
};
