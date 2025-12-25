"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart3,
    MousePointerClick,
    Eye,
    TrendingUp,
    Smartphone,
    Monitor,
    RefreshCw,
    Trash2,
    Download
} from "lucide-react";

/**
 * Menu Analytics Dashboard
 * 
 * Displays conversion optimization data from the marketing website's super menu.
 * Data is synced from localStorage on the marketing website.
 */

interface MenuAnalyticsSummary {
    totalMenuOpens: number;
    totalNavigationClicks: number;
    totalCtaClicks: number;
    avgSectionsExpanded: number;
    topClickedItems: Array<{ label: string; href: string; count: number }>;
    deviceBreakdown: { mobile: number; desktop: number };
}

// Mock data for development - in production this would sync from the marketing website
const getMockAnalytics = (): MenuAnalyticsSummary => ({
    totalMenuOpens: 1247,
    totalNavigationClicks: 3891,
    totalCtaClicks: 456,
    avgSectionsExpanded: 2.4,
    topClickedItems: [
        { label: "Membership", href: "/membership", count: 892 },
        { label: "Programs & Offerings", href: "/programs/founders", count: 654 },
        { label: "Annual Summit", href: "/summit", count: 423 },
        { label: "Our Story & Mission", href: "/about/story", count: 312 },
        { label: "Become a Partner", href: "/partners/become", count: 289 },
        { label: "Events", href: "/events", count: 256 },
        { label: "FAQs", href: "/faq", count: 198 },
        { label: "Accelerator Programs", href: "/programs/accelerator", count: 176 },
    ],
    deviceBreakdown: { mobile: 42, desktop: 58 },
});

export default function MenuAnalyticsPage() {
    const [analytics, setAnalytics] = useState<MenuAnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadAnalytics = () => {
        setLoading(true);
        // Simulate API call - in production, this would fetch from an API endpoint
        setTimeout(() => {
            setAnalytics(getMockAnalytics());
            setLastUpdated(new Date());
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const conversionRate = analytics
        ? ((analytics.totalCtaClicks / analytics.totalMenuOpens) * 100).toFixed(1)
        : "0";

    const clickThroughRate = analytics
        ? ((analytics.totalNavigationClicks / analytics.totalMenuOpens) * 100).toFixed(1)
        : "0";

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Menu Analytics</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track super menu interactions for conversion optimization
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadAnalytics}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                    Last updated: {lastUpdated.toLocaleString()}
                </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Menu Opens */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-md">
                            <Eye className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Menu Opens</p>
                            <p className="text-2xl font-bold text-foreground">
                                {loading ? "..." : analytics?.totalMenuOpens.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Clicks */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-md">
                            <MousePointerClick className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Nav Clicks</p>
                            <p className="text-2xl font-bold text-foreground">
                                {loading ? "..." : analytics?.totalNavigationClicks.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Clicks */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-md">
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">CTA Clicks</p>
                            <p className="text-2xl font-bold text-foreground">
                                {loading ? "..." : analytics?.totalCtaClicks.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-md">
                            <BarChart3 className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Conversion Rate</p>
                            <p className="text-2xl font-bold text-foreground">
                                {loading ? "..." : `${conversionRate}%`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Clicked Items */}
                <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MousePointerClick className="w-5 h-5 text-primary" />
                        Top Clicked Items
                    </h2>
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {analytics?.topClickedItems.map((item, index) => (
                                <div
                                    key={item.href}
                                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-muted-foreground w-6">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{item.href}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{
                                                    width: `${(item.count / (analytics?.topClickedItems[0]?.count || 1)) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-mono text-foreground w-16 text-right">
                                            {item.count.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Device Breakdown */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Device Breakdown</h2>
                    {loading ? (
                        <div className="h-32 bg-muted/50 rounded animate-pulse" />
                    ) : (
                        <div className="space-y-4">
                            {/* Desktop */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-md">
                                    <Monitor className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm text-foreground">Desktop</p>
                                        <p className="text-sm font-mono text-foreground">
                                            {analytics?.deviceBreakdown.desktop}%
                                        </p>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${analytics?.deviceBreakdown.desktop}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-md">
                                    <Smartphone className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm text-foreground">Mobile</p>
                                        <p className="text-sm font-mono text-foreground">
                                            {analytics?.deviceBreakdown.mobile}%
                                        </p>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${analytics?.deviceBreakdown.mobile}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center justify-between py-2">
                                    <p className="text-sm text-muted-foreground">Click-through Rate</p>
                                    <p className="text-sm font-mono font-medium text-foreground">{clickThroughRate}%</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <p className="text-sm text-muted-foreground">Avg. Sections Expanded</p>
                                    <p className="text-sm font-mono font-medium text-foreground">
                                        {analytics?.avgSectionsExpanded.toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Analytics Data
                </button>
                <p className="text-xs text-muted-foreground">
                    Note: Analytics data is collected from user interactions with the marketing website&apos;s navigation menu.
                </p>
            </div>
        </div>
    );
}
