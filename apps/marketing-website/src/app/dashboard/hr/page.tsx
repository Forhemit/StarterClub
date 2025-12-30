"use client";

import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';
import { QuickActionsPanel } from '@/components/hr/Shared/QuickAction';
import { ProgressJourney } from '@/components/hr/Gamification/ProgressJourney';
import { HRMetricsOverview } from '@/components/hr/analytics/HRMetricsOverview';
import { RecentActivityFeed } from '@/components/hr/Shared/ActivityFeed';
import { ModuleGrid } from '@/components/hr/Shared/ModuleGrid';
import { useHRTheme } from '@/themes/hrTheme';

export default function HRDashboard() {
    const { theme, isRacetrack, colors } = useHRTheme();

    const modules = [
        {
            title: 'Employee Onboarding',
            icon: '👤',
            description: 'Streamline new hire experience',
            progress: 85,
            color: colors.primary,
            href: '/dashboard/hr/onboarding'
        },
        {
            title: 'Talent Management',
            icon: '⭐',
            description: 'Interview to offer workflows',
            progress: 60,
            color: colors.secondary,
            href: '/dashboard/hr/talent'
        },
        {
            title: 'Performance Reviews',
            icon: '📈',
            description: 'Goal setting & feedback',
            progress: 45,
            color: colors.accent,
            href: '/dashboard/hr/performance'
        },
        {
            title: 'Time & Attendance',
            icon: '⏰',
            description: 'Schedule & time tracking',
            progress: 90,
            color: colors.success,
            href: '/dashboard/hr/time'
        },
        {
            title: 'Benefits Hub',
            icon: '🏥',
            description: 'Health, wellness, insurance',
            progress: 30,
            color: colors.info,
            href: '/dashboard/hr/benefits'
        },
        {
            title: 'HR Analytics',
            icon: '📊',
            description: 'Reports & insights',
            progress: 75,
            color: colors.warning,
            href: '/dashboard/hr/analytics'
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <HRDashboardHeader
                title="HR Command Center"
                subtitle="Streamline people operations with intelligent workflows"
                userType="admin"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Gamification & Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <ProgressJourney
                        milestones={[
                            { label: 'Onboarding Complete', target: 10, current: 8 },
                            { label: 'Performance Reviews', target: 50, current: 45 },
                            { label: 'Training Hours', target: 100, current: 85 },
                            { label: 'Employee Satisfaction', target: 90, current: 88 }
                        ]}
                    />

                    <ModuleGrid modules={modules} />
                </div>

                {/* Right Column: Quick Actions & Activity */}
                <div className="space-y-6">
                    <QuickActionsPanel
                        actions={[
                            { label: 'Add New Employee', icon: '➕', action: 'createEmployee' },
                            { label: 'Start Interview', icon: '🎯', action: 'startInterview' },
                            { label: 'Approve Time Off', icon: '✅', action: 'approveLeave' },
                            { label: 'Generate Reports', icon: '📋', action: 'generateReport' }
                        ]}
                    />

                    <HRMetricsOverview />
                    <RecentActivityFeed limit={5} />
                </div>
            </div>
        </div>
    );
}
