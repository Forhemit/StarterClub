"use client";

import React, { useState } from 'react';
import { Dashboard, Section, Row, GridRow, ColWrapper, MetricCard, ChartCard, TableCard, QuickActionPanel, SimpleChart, AlertCard, ActionList } from './shared/DashboardComponents';
import { RoleSwitcher } from './RoleSwitcher';
import { MemberDashboardView } from './MemberDashboardView';
import { PeopleCultureDashboard } from './PeopleCultureDashboard';

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
    const [selectedViews, setSelectedViews] = useState<string[]>(['super-admin']);

    return (
        <div className="space-y-8">
            {/* View Switcher Control - Sticky or just top level */}
            <div className="flex justify-end px-4 pt-4">
                <RoleSwitcher selectedRoles={selectedViews} onRolesChange={setSelectedViews} />
            </div>

            {selectedViews.includes('super-admin') && (
                <div className="relative">
                    {/* Visual Indicator if multiple views are open */}
                    {selectedViews.length > 1 && (
                        <div className="absolute top-0 left-0 bg-zinc-900 text-white text-xs px-2 py-1 rounded-br-lg z-10">
                            Super Admin View
                        </div>
                    )}
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

                            <GridRow>
                                <ChartCard title="Performance vs Target" width="twoThirds">
                                    <SimpleChart type="bar" data={{ metrics: ['Revenue', 'Margin', 'Growth', 'Sat', 'Uptime'] }} />
                                </ChartCard>
                                <ChartCard title="Risk Radar" width="third">
                                    <SimpleChart type="radar" data={{ categories: ['Financial', 'Ops', 'Legal', 'Reputation', 'Tech'] }} />
                                </ChartCard>
                            </GridRow>
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
                            <GridRow>
                                <ColWrapper width="third">
                                    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 h-full flex flex-col justify-between">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Cash Balance</p>
                                                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                                                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">$1.25M</span>
                                                    <span className="inline-flex items-baseline rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400">
                                                        -1.2%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="rounded-lg p-2 ring-1 ring-inset shrink-0 text-blue-600 bg-blue-50 ring-blue-600/20 dark:text-blue-400 dark:bg-blue-950/30">
                                                <span className="text-lg">🏦</span>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-400">Runway: 14.7 months</p>
                                    </div>
                                </ColWrapper>
                                <ColWrapper width="third">
                                    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 h-full flex flex-col justify-between">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Profit Share Pool</p>
                                                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                                                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">$485k</span>
                                                    <span className="inline-flex items-baseline rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                        Q2 Est
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="rounded-lg p-2 ring-1 ring-inset shrink-0 text-emerald-600 bg-emerald-50 ring-emerald-600/20 dark:text-emerald-400 dark:bg-emerald-950/30">
                                                <span className="text-lg">💸</span>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-400">42 Eligible Partners</p>
                                    </div>
                                </ColWrapper>
                                <AlertCard
                                    title="Financial Override Queue"
                                    level="low"
                                    affected={['3 Requests']}
                                    trigger="Pending Approval"
                                    action="Approve/Deny"
                                />
                            </GridRow>
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
                            {/* Emergency Control Panel - Full Width, not inside Row */}
                            <div className="w-full mb-6">
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
                                        <button className="p-3 border border-red-200 dark:border-red-900 rounded-lg bg-white dark:bg-black text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <span className="block font-bold text-red-600">Freeze Financials</span>
                                            <span className="text-xs text-zinc-500">Stop all outgoing payments</span>
                                        </button>
                                        <button className="p-3 border border-red-200 dark:border-red-900 rounded-lg bg-white dark:bg-black text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <span className="block font-bold text-red-600">System Lockdown</span>
                                            <span className="text-xs text-zinc-500">Restrict access to admins only</span>
                                        </button>
                                        <button className="p-3 border border-red-200 dark:border-red-900 rounded-lg bg-white dark:bg-black text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <span className="block font-bold text-red-600">Data Preservation</span>
                                            <span className="text-xs text-zinc-500">Snapshot & off-site backup</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Grid */}
                            <QuickActionPanel
                                actions={[
                                    { label: 'Generate Exec Report', icon: '📊', path: '/superadmin/reports' },
                                    { label: 'Audit System', icon: '🔍', path: '/superadmin/audit' },
                                    { label: 'Manage Permissions', icon: '🔐', path: '/superadmin/permissions' },
                                    { label: 'Deploy Update', icon: '🚀', path: '/superadmin/deploy' }
                                ]}
                            />
                        </Section>
                    </Dashboard>
                </div>
            )}

            {selectedViews.includes('member') && (
                <div className="border-t-4 border-blue-500 pt-4 mt-8 relative">
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg font-bold">Simulating Member View</div>
                    <MemberDashboardView
                        userEmail="simulated-member@example.com"
                        userRole="company_member"
                        isSimulated={true}
                    />
                </div>
            )}

            {selectedViews.includes('partner') && (
                <div className="border-t-4 border-purple-500 pt-4 mt-8 relative">
                    <div className="absolute top-0 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-br-lg font-bold">Simulating Partner View</div>
                    <MemberDashboardView
                        userEmail="simulated-partner@example.com"
                        userRole="partner_admin"
                        isSimulated={true}
                    />
                </div>
            )}

            {selectedViews.includes('sponsor') && (
                <div className="border-t-4 border-amber-500 pt-4 mt-8 relative">
                    <div className="absolute top-0 left-0 bg-amber-500 text-white text-xs px-2 py-1 rounded-br-lg font-bold">Simulating Sponsor View</div>
                    <MemberDashboardView
                        userEmail="simulated-sponsor@example.com"
                        userRole="sponsor_admin"
                        isSimulated={true}
                    />
                </div>
            )}

            {selectedViews.includes('employee') && (
                <div className="border-t-4 border-pink-500 pt-4 mt-8 relative">
                    <div className="absolute top-0 left-0 bg-pink-500 text-white text-xs px-2 py-1 rounded-br-lg font-bold">Simulating Employee View (People & Culture)</div>
                    {/* Using PeopleCultureDashboard as a representative employee dashboard */}
                    <div className="p-4 bg-slate-50 dark:bg-black rounded-lg">
                        <PeopleCultureDashboard />
                    </div>
                </div>
            )}

        </div>
    );
};

