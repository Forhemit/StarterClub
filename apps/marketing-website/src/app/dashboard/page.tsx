"use client";


import React, { useState, useEffect } from "react";
// import { useUserRoles } from "@/hooks/useUserRoles"; // Deprecated in favor of DB check
import { useUser, useSession } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CompleteProfileNotice from '@/components/CompleteProfileNotice';

import { PermissionGuard } from "@/components/auth/PermissionGuard";
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Building2, Hammer } from "lucide-react";

import { RaceTrackDashboard } from "@/components/dashboard/RaceTrackDashboard";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";
import { SponsorDashboard } from "@/components/dashboard/SponsorDashboard";
import { PartnerDashboard } from "@/components/dashboard/PartnerDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";



export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const { session } = useSession();
    const router = useRouter();
    const { theme } = useTheme();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            fetchUserData();
        }
    }, [isLoaded, user]);

    const fetchUserData = async () => {
        try {
            const token = await session?.getToken({ template: 'supabase' });

            if (!token) {
                console.error('❌ No Supabase JWT token available!');
                console.error('This means the Clerk JWT template is not configured.');
                console.error('See: /Users/stephenstokes/.gemini/antigravity/brain/d9834e1f-8048-45a6-911f-e7ff546ca3c8/clerk-jwt-config.md');
                setLoading(false);
                return;
            }

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    global: {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                }
            );

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user!.id)
                .maybeSingle();

            if (error) {
                console.error("Error fetching profile:", error);
                console.error("Error code:", error.code);
                console.error("Error message:", error.message);

                if (error.code === 'PGRST116') {
                    console.log('No profile found - this may be normal for new users');
                }
            }

            if (data) {
                setProfile(data);

                // active_roles is already a cached array in the profile
                // No need to check user_roles separately
            } else {
                console.log('No profile data returned');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded || loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
    }

    // 1. Theme Override
    if (theme === 'racetrack') {
        return <RaceTrackDashboard />;
    }

    // Determine Role - use primary_role or first active role
    const userRole = profile?.primary_role ||
        profile?.active_roles?.[0] ||
        'guest';

    const hasCompletedOnboarding = !!profile?.onboarding_completed_at;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Show notice if onboarding not completed */}
            {!hasCompletedOnboarding && userRole !== 'guest' && (
                <CompleteProfileNotice
                    userName={profile?.first_name || user?.firstName || 'User'}
                    role={userRole.replace('_', ' ').toUpperCase()}
                    onComplete={() => router.push('/onboarding')}
                />
            )}

            {/* Role-Specific Dashboard Content */}
            {userRole === 'super_admin' && <SuperAdminDashboard />}
            {userRole === 'member' && <MemberDashboard />}
            {userRole === 'partner' && <PartnerDashboard />}
            {userRole === 'sponsor' && <SponsorDashboard />}
            {userRole === 'employee' && <EmployeeDashboard />}

            {/* Fallbacks / Guest */}
            {userRole === 'guest' && (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Welcome Guest</h2>
                    <p className="text-muted-foreground mb-6">Please complete your onboarding to access the full platform.</p>
                    <Link href="/onboarding" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                        Complete Onboarding
                    </Link>
                </div>
            )}
        </div>
    );
}
