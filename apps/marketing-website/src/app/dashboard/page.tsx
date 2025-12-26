"use client";

import React from "react";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useUser } from "@clerk/nextjs";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Building2, Hammer } from "lucide-react";
import Link from "next/link";

import { useTheme } from "next-themes";
import { RaceTrackDashboard } from "@/components/dashboard/RaceTrackDashboard";

export default function DashboardPage() {
    const { user } = useUser();
    const { roles, isLoading, hasRole } = useUserRoles();
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoading || !mounted) {
        return <div className="p-8 text-center text-muted-foreground">Loading specific layout...</div>;
    }

    if (theme === 'racetrack') {
        return <RaceTrackDashboard />;
    }

    return (
        <div className="space-y-8">
            {/* Common Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, {user?.firstName || "Founder"}
                    </h1>
                    <p className="text-muted-foreground">
                        Here is what's happening across your ecosystem.
                    </p>
                </div>
                {/* Optional Role Switcher or Context could go here */}
            </div>

            {/* Member Content (Available to all usually, or filtered) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Builder Updates */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Builder Rooms</CardTitle>
                        <Hammer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Active</div>
                        <p className="text-xs text-muted-foreground">
                            You have access to 3 active rooms
                        </p>
                        <Button variant="link" className="px-0 mt-2 h-auto" asChild>
                            <Link href="/builder">Go to Rooms <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Partner Content (Guarded) */}
                <PermissionGuard requiredRole="partner" fallback={
                    <Card className="opacity-75 border-dashed">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Partner Studio</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">
                                Hosting events and building for the community?
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/partners/become">Become a Partner</Link>
                            </Button>
                        </CardContent>
                    </Card>
                }>
                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-blue-700">Partner Stats</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900">+12%</div>
                            <p className="text-xs text-blue-600">
                                Engagement in your hosted events
                            </p>
                            <Button variant="link" className="px-0 mt-2 h-auto text-blue-700" asChild>
                                <Link href="/dashboard/partner">View Insights <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </PermissionGuard>

                {/* Sponsor Content (Guarded) */}
                <PermissionGuard requiredRole="sponsor" fallback={
                    <Card className="opacity-75 border-dashed">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Sponsor Campaigns</CardTitle>
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">
                                Want to amplify your brand presence?
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/contact">Inquire about Sponsorship</Link>
                            </Button>
                        </CardContent>
                    </Card>
                }>
                    <Card className="bg-amber-50/50 border-amber-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-amber-700">Campaign ROI</CardTitle>
                            <Sparkles className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-900">2.4k</div>
                            <p className="text-xs text-amber-600">
                                Impressions this week
                            </p>
                            <Button variant="link" className="px-0 mt-2 h-auto text-amber-700" asChild>
                                <Link href="/dashboard/sponsor">View Report <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </PermissionGuard>
            </div>

            {/* Quick Actions / Recommendations */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <Hammer className="h-5 w-5" />
                        <span>New Project</span>
                    </Button>
                    {/* More items */}
                </div>
            </div>
        </div>
    );
}
