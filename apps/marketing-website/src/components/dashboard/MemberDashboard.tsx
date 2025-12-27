"use client";

import React, { useEffect, useState } from 'react';
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Circle, Clock, Award, Hammer, Rocket } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface ChecklistItem {
    id: string;
    title: string;
    description: string | null;
}

interface ChecklistStatus {
    id: string;
    completed_at: string | null;
    checklist_items: ChecklistItem | null;
    statuses: { name: string } | null;
}

interface BusinessData {
    id: string;
    business_name: string;
}

export function MemberDashboard() {
    const supabase = useSupabase();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [business, setBusiness] = useState<BusinessData | null>(null);
    const [checklistData, setChecklistData] = useState<ChecklistStatus[]>([]);

    useEffect(() => {
        async function loadData() {
            if (!user || !supabase) return;

            try {
                // 1. Get User Business
                const { data: businessData, error: businessError } = await supabase
                    .from('user_businesses')
                    .select('id, business_name')
                    .eq('user_id', user.id)
                    .single();

                if (businessError) {
                    // Ignore "no rows found" error as it just means new user
                    if (businessError.code !== 'PGRST116') {
                        console.error("Error fetching business:", {
                            code: businessError.code,
                            message: businessError.message,
                            details: businessError.details,
                            hint: businessError.hint
                        });
                    }
                }

                if (businessData) {
                    setBusiness(businessData as any);

                    // 2. Get Checklist Status
                    const { data: statusData, error: statusError } = await supabase
                        .from('user_checklist_status')
                        .select(`
                            id,
                            completed_at,
                            checklist_items (
                                id,
                                title,
                                description
                            ),
                            statuses (
                                name
                            )
                        `)
                        .eq('user_business_id', businessData.id);

                    if (statusError) {
                        console.error("Error fetching checklist:", statusError);
                    } else {
                        setChecklistData((statusData as any) || []);
                    }
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [user, supabase]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    // No Business Found State
    if (!business) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 bg-card border rounded-xl shadow-sm p-12">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                    <Rocket className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Prepare for Takeoff</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                    Welcome to Starter Club! You haven't registered your business on the Flight Deck yet.
                    Let's get your mission started.
                </p>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/grid-access">Start Business Registration</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Exploring for now</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Calculate Stats
    const totalItems = checklistData.length;
    const completedItems = checklistData.filter(item => item.statuses?.name === 'complete').length;
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Next Actions
    const nextActions = checklistData
        .filter(item => item.statuses?.name !== 'complete')
        .sort((a, b) => {
            if (a.statuses?.name === 'in_progress' && b.statuses?.name !== 'in_progress') return -1;
            if (a.statuses?.name !== 'in_progress' && b.statuses?.name === 'in_progress') return 1;
            return 0;
        })
        .slice(0, 5);

    // Recent Wins
    const recentWins = checklistData
        .filter(item => item.statuses?.name === 'complete')
        .sort((a, b) => {
            const dateA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
            const dateB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 5);

    // Context Intelligence
    const memberContext = user?.publicMetadata?.memberContext as { stage: 'new' | 'existing', primaryGoal: string } | undefined;

    const getTrackLabel = () => {
        if (!memberContext) return "Flight Deck Overview";
        if (memberContext.stage === 'new') return "🌱 Foundation Track";
        if (memberContext.stage === 'existing') return "🚀 Optimization Track";
        return "Flight Deck Overview";
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {business.business_name}
                        </h1>
                        {memberContext && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${memberContext.stage === 'new' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                {memberContext.stage === 'new' ? 'Startup' : 'Scaling'}
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground">
                        {getTrackLabel()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild size="sm">
                        <Link href="/member-onboarding">
                            Update Context
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()} size="sm">
                        Refresh Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Flight Status Widget */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Mission Progress</CardTitle>
                        <Rocket className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between mb-4">
                            <span className="text-4xl font-bold">{progress}%</span>
                            <span className="text-sm text-muted-foreground">{completedItems} / {totalItems} Tasks</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                            {progress === 100 ? "Ready for orbit!" : "Keep pushing forward."}
                        </p>
                    </CardContent>
                </Card>

                {/* Next Actions Widget */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Next Actions</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {nextActions.length > 0 ? (
                            <ul className="space-y-4">
                                {nextActions.map((action) => (
                                    <li key={action.id} className="flex items-start gap-3 group">
                                        <div className={`mt-0.5 h-4 w-4 rounded-full border flex-shrink-0 ${action.statuses?.name === 'in_progress' ? 'border-amber-500 bg-amber-500/10' : 'border-muted-foreground'}`} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium leading-none truncate group-hover:text-primary transition-colors">
                                                {action.checklist_items?.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {action.checklist_items?.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                All clear! No pending actions.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Wins Widget */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Recent Wins</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {recentWins.length > 0 ? (
                            <ul className="space-y-4">
                                {recentWins.map((win) => (
                                    <li key={win.id} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium leading-none truncate">
                                                {win.checklist_items?.title}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                                                {win.completed_at ? new Date(win.completed_at).toLocaleDateString() : 'Completed'}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No wins recorded yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Links Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                            <Link href="/builder">
                                <Hammer className="h-6 w-6 mb-1" />
                                <span>Builder Rooms</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                            <Link href="/resources">
                                <Rocket className="h-6 w-6 mb-1" />
                                <span>Playbooks</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
