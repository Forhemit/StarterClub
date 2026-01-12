"use client";


import React, { useState, useEffect } from "react";
// import { useUserRoles } from "@/hooks/useUserRoles"; // Deprecated in favor of DB check
import { useUser, useSession } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CompleteProfileNotice from '@/components/CompleteProfileNotice';

import { ArrowRight, Sparkles, Building2, Hammer, Settings2 } from "lucide-react";

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

    const intent = profile?.primary_intent;

    const hasCompletedOnboarding = !!profile?.onboarding_completed_at;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    {intent && (
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                            Track: {intent.replace('_', ' ')}
                        </p>
                    )}
                </div>
                <Link
                    href="/onboarding"
                    className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted"
                >
                    <Settings2 size={14} />
                    Update my journey
                </Link>
            </div>

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

            {/* Fallbacks / Guest / Intent-Based Previews */}
            {userRole === 'guest' && (
                <div className="space-y-8">
                    <div className="text-center py-12 bg-card border rounded-xl shadow-sm">
                        <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Welcome to the Club</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8 font-light text-lg">
                            {intent === 'explore'
                                ? "You're currently exploring. Take a look at what's happening in the community below."
                                : "Your journey is being prepared. Complete your full profile to unlock all features."}
                        </p>
                        <Link href="/onboarding" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-none font-bold uppercase tracking-tighter hover:translate-x-1 transition-all">
                            Complete Onboarding <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Intent-Aware Widgets for Guests */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-card border rounded-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Building2 size={24} className="text-primary" />
                                Community Highlights
                            </h3>
                            <div className="space-y-4 opacity-70">
                                <div className="h-20 bg-muted rounded animate-pulse" />
                                <div className="h-20 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="p-6 bg-card border rounded-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Hammer size={24} className="text-primary" />
                                Upcoming Events
                            </h3>
                            <div className="space-y-4 opacity-70">
                                <div className="h-32 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
