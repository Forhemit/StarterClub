"use client";

import React, { useEffect, useState } from 'react';
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket } from "lucide-react";
import { MemberDashboardUI, ChecklistStatus } from "./MemberDashboardUI";
import { MarketplaceModule } from "@/lib/marketplace/types";
import { getInstalledModules } from "@/actions/marketplace";
import { MARKETPLACE_MODULES } from "@/lib/marketplace/data";

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
    const [installedModules, setInstalledModules] = useState<MarketplaceModule[]>([]);

    useEffect(() => {
        loadData();
    }, [user, supabase]);

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
                if (businessError.code !== 'PGRST116') {
                    console.error("Error fetching business:", businessError);
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

                // 3. Get Installed Modules
                const { data: installedData } = await getInstalledModules(businessData.id);
                if (installedData && installedData.length > 0) {
                    const moduleIds = new Set(installedData.map((m: any) => m.module_id));
                    const modules = MARKETPLACE_MODULES.filter(m => moduleIds.has(m.id));
                    setInstalledModules(modules);
                } else {
                    setInstalledModules([]);
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    }

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
    const memberStage = memberContext?.stage || 'new';

    const getTrackLabel = () => {
        if (!memberContext) return "Flight Deck Overview";
        if (memberContext.stage === 'new') return "🌱 Foundation Track";
        if (memberContext.stage === 'existing') return "🚀 Optimization Track";
        return "Flight Deck Overview";
    };

    return (
        <MemberDashboardUI
            businessName={business.business_name}
            memberStage={memberStage}
            trackLabel={getTrackLabel()}
            progress={progress}
            completedItems={completedItems}
            totalItems={totalItems}
            nextActions={nextActions}
            recentWins={recentWins}
            installedModules={installedModules}
            onRefreshData={() => window.location.reload()}
        />
    );
}
