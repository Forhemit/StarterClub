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
    const { user } = useUser();
    const { roles, isLoading, hasRole } = useUserRoles();
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoading || !mounted) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
    }

    // 1. Theme Override
    if (theme === 'racetrack') {
        return <RaceTrackDashboard />;
    }

    // 2. Role-Based Views

    // Employee / Admin View (Higher Priority)
    if (hasRole('super_admin') || hasRole('employee') || hasRole('admin')) {
        return <EmployeeDashboard />;
    }

    // Partner View
    if (hasRole('partner') || hasRole('partner_admin')) {
        return <PartnerDashboard />;
    }

    // Sponsor View
    if (hasRole('sponsor')) {
        return <SponsorDashboard />;
    }

    // Default: Member View
    return <MemberDashboard />;
}
