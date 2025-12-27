"use client";

import React from "react";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Building2, Hammer } from "lucide-react";

import { RaceTrackDashboard } from "@/components/dashboard/RaceTrackDashboard";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";
import { SponsorDashboard } from "@/components/dashboard/SponsorDashboard";
import { PartnerDashboard } from "@/components/dashboard/PartnerDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const { roles, isLoading: rolesLoading, hasRole } = useUserRoles();
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!isLoaded || rolesLoading || !mounted) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
    }

    // 1. Theme Override
    if (theme === 'racetrack') {
        return <RaceTrackDashboard />;
    }

    // 2. Intent-Based Routing (The "Brain")
    const userTrack = user?.publicMetadata?.userTrack as string | undefined;

    if (userTrack === 'support_builders') {
        return <PartnerDashboard />;
    }

    if (userTrack === 'amplify_brand') {
        return <SponsorDashboard />;
    }

    if (userTrack === 'work_with_us') {
        return <EmployeeDashboard />;
    }

    // 3. Legacy Role-Based Fallbacks (if no track selected or specific role override needed)
    // This ensures existing users without tracks still get routed correctly
    if (!userTrack) {
        if (hasRole('super_admin') || hasRole('employee') || hasRole('admin')) {
            return <EmployeeDashboard />;
        }
        if (hasRole('partner') || hasRole('partner_admin')) {
            return <PartnerDashboard />;
        }
        if (hasRole('sponsor')) {
            return <SponsorDashboard />;
        }
    }

    // 4. Default / Build Something / Explore
    return <MemberDashboard />;
}
