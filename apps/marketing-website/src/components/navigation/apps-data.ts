import { LucideIcon, LayoutGrid, Hammer, Calendar, BookOpen, Handshake, BarChart3, PieChart, Users, Settings, Shield, FileText, Sparkles } from 'lucide-react';

export interface AppDefinition {
    id: string;
    label: string;
    href: string;
    description: string;
    icon: LucideIcon;
    requiredRole?: string; // If null, open to all (or check permission)
    requiredPermission?: string;
}

export interface AppSection {
    id: string;
    label: string;
    apps: AppDefinition[];
    role?: string; // The primary role associated with this section
}

export const appsData: AppSection[] = [
    {
        id: 'member',
        label: 'Member Journeys',
        role: 'member',
        apps: [
            {
                id: 'member-hub',
                label: 'Home Base',
                href: '/dashboard',
                description: 'Your personal command center',
                icon: LayoutGrid,
                requiredRole: 'member'
            },
            {
                id: 'builder-rooms',
                label: 'Builder Rooms',
                href: '/builder',
                description: 'Focused spaces to build real things',
                icon: Hammer,
                requiredRole: 'member'
            },
            {
                id: 'events',
                label: 'Live Floor',
                href: '/events',
                description: 'Events, workshops & sessions',
                icon: Calendar,
                requiredRole: 'member'
            },
            {
                id: 'resources',
                label: 'The Playbooks',
                href: '/resources',
                description: 'Step-by-step paths',
                icon: BookOpen,
                requiredRole: 'member'
            }
        ]
    },
    {
        id: 'partner',
        label: 'Partner Journeys',
        role: 'partner',
        apps: [
            {
                id: 'partner-portal',
                label: 'Partner Studio',
                href: '/partner/studio',
                description: 'Create experiences & host events',
                icon: Handshake,
                requiredRole: 'partner'
            },
            {
                id: 'engagement',
                label: 'Engagement Insights',
                href: '/partner/insights',
                description: 'Understand who you help',
                icon: PieChart,
                requiredRole: 'partner'
            },
            {
                id: 'impact',
                label: 'Impact Hub',
                href: '/partner/impact',
                description: 'Your footprint inside the club',
                icon: BarChart3,
                requiredRole: 'partner'
            }
        ]
    },
    {
        id: 'sponsor',
        label: 'Sponsor Journeys',
        role: 'sponsor',
        apps: [
            {
                id: 'campaigns',
                label: 'Brand Experiences',
                href: '/sponsor/campaigns',
                description: 'Sponsored sessions & moments',
                icon: Sparkles, // Use direct import
                requiredRole: 'sponsor'
            },
            {
                id: 'roi',
                label: 'Growth Signals',
                href: '/sponsor/signals',
                description: 'ROI & Engagement metrics',
                icon: BarChart3,
                requiredRole: 'sponsor'
            },
            {
                id: 'assets',
                label: 'Sponsor Assets',
                href: '/sponsor/assets',
                description: 'Logos, guidelines & content',
                icon: FileText,
                requiredRole: 'sponsor'
            }
        ]
    },
    {
        id: 'internal',
        label: 'Internal Ops',
        role: 'employee',
        apps: [
            {
                id: 'admin',
                label: 'Operations Deck',
                href: '/admin/ops',
                description: 'Run the club',
                icon: Settings,
                requiredRole: 'employee'
            },
            {
                id: 'crm',
                label: 'Knowledge Vault',
                href: '/admin/knowledge',
                description: 'Institutional memory',
                icon: Users,
                requiredRole: 'employee'
            },
            {
                id: 'security',
                label: 'Systems Control',
                href: '/admin/system',
                description: 'Permissions & Integrations',
                icon: Shield,
                requiredRole: 'admin' // Specific to admin
            }
        ]
    }
];
