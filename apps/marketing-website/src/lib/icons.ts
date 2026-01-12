/**
 * Centralized Icon Mapping System
 * 
 * This file provides a consistent mapping from semantic icon names to Lucide React components.
 * Use this instead of emoji icons for a professional, themeable appearance.
 */

import {
    User,
    Star,
    TrendingUp,
    Clock,
    Heart,
    BarChart3,
    Plus,
    Target,
    CheckCircle,
    ClipboardList,
    FileText,
    Users,
    Calendar,
    AlertTriangle,
    Package,
    CreditCard,
    Rocket,
    Eye,
    Shield,
    Search,
    Lock,
    BookOpen,
    DollarSign,
    PieChart,
    type LucideIcon,
} from "lucide-react";

/**
 * Emoji to Lucide icon mapping
 * Use getIcon() function to convert emoji strings to React components
 */
export const emojiToIcon: Record<string, LucideIcon> = {
    // People & Users
    '👤': User,
    '👥': Users,

    // Status & Action
    '⭐': Star,
    '✅': CheckCircle,
    '➕': Plus,
    '🎯': Target,

    // Time & Calendar
    '⏰': Clock,
    '📅': Calendar,

    // Charts & Data
    '📈': TrendingUp,
    '📊': BarChart3,
    '📋': ClipboardList,

    // Health & Benefits
    '🏥': Heart,
    '❤️': Heart,

    // Documents
    '📝': FileText,
    '📚': BookOpen,

    // Alerts & Security
    '🚨': AlertTriangle,
    '🛡️': Shield,
    '🔐': Lock,
    '🔍': Search,

    // Business
    '💸': DollarSign,
    '💳': CreditCard,
    '📦': Package,

    // Action & Launch
    '🚀': Rocket,
    '👁️': Eye,
};

/**
 * Get a Lucide icon component from an emoji string
 * Falls back to FileText if emoji not found
 */
export function getIconFromEmoji(emoji: string): LucideIcon {
    return emojiToIcon[emoji] || FileText;
}

/**
 * HR Module icon mapping
 * These map module types to their appropriate icons
 */
export const hrModuleIcons = {
    onboarding: User,
    talent: Star,
    performance: TrendingUp,
    time: Clock,
    benefits: Heart,
    analytics: PieChart,
} as const;

/**
 * Quick action icon mapping
 */
export const quickActionIcons = {
    createEmployee: Plus,
    startInterview: Target,
    approveLeave: CheckCircle,
    generateReport: ClipboardList,
} as const;

export {
    User,
    Star,
    TrendingUp,
    Clock,
    Heart,
    BarChart3,
    Plus,
    Target,
    CheckCircle,
    ClipboardList,
    FileText,
    Users,
    Calendar,
    AlertTriangle,
    Package,
    CreditCard,
    Rocket,
    Eye,
    Shield,
    Search,
    Lock,
    BookOpen,
    DollarSign,
    PieChart,
};
