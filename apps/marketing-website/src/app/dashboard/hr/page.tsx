"use client";

import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';
import { QuickActionsPanel } from '@/components/hr/Shared/QuickAction';
import { ProgressJourney } from '@/components/hr/Gamification/ProgressJourney';
import { HRMetricsOverview } from '@/components/hr/analytics/HRMetricsOverview';
import { RecentActivityFeed } from '@/components/hr/Shared/ActivityFeed';
import { ModuleGrid } from '@/components/hr/Shared/ModuleGrid';
import {
    User,
    Star,
    TrendingUp,
    Clock,
    Heart,
    PieChart,
    Plus,
    Target,
    CheckCircle,
    ClipboardList
} from 'lucide-react';

export default function HRDashboard() {
    // Using Lucide icons instead of emojis
    const modules = [
        {
            title: 'Employee Onboarding',
            icon: User,
            description: 'Streamline new hire experience',
            progress: 85,
            color: 'hsl(var(--primary))',
            href: '/dashboard/hr/onboarding'
        },
        {
            title: 'Talent Management',
            icon: Star,
            description: 'Interview to offer workflows',
            progress: 60,
            color: 'hsl(var(--accent))',
            href: '/dashboard/hr/talent'
        },
        {
            title: 'Performance Reviews',
            icon: TrendingUp,
            description: 'Goal setting & feedback',
            progress: 45,
            color: 'hsl(var(--info))',
            href: '/dashboard/hr/performance'
        },
        {
            title: 'Time & Attendance',
            icon: Clock,
            description: 'Schedule & time tracking',
            progress: 90,
            color: 'hsl(var(--success))',
            href: '/dashboard/hr/time'
        },
        {
            title: 'Benefits Hub',
            icon: Heart,
            description: 'Health, wellness, insurance',
            progress: 30,
            color: 'hsl(var(--info))',
            href: '/dashboard/hr/benefits'
        },
        {
            title: 'HR Analytics',
            icon: PieChart,
            description: 'Reports & insights',
            progress: 75,
            color: 'hsl(var(--warning))',
            href: '/dashboard/hr/analytics'
        }
    ];

    const quickActions = [
        { label: 'Add New Employee', icon: Plus, action: 'createEmployee' },
        { label: 'Start Interview', icon: Target, action: 'startInterview' },
        { label: 'Approve Time Off', icon: CheckCircle, action: 'approveLeave' },
        { label: 'Generate Reports', icon: ClipboardList, action: 'generateReport' }
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
                    <QuickActionsPanel actions={quickActions} />

                    <HRMetricsOverview />
                    <RecentActivityFeed limit={5} />
                </div>
            </div>
        </div>
    );
}

