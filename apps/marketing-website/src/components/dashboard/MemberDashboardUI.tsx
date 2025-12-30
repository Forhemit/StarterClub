"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, Award, Hammer, Rocket, Package } from "lucide-react";
import Link from "next/link";
import { MarketplaceModule } from "@/lib/marketplace/types";

export interface ChecklistItem {
    id: string;
    title: string;
    description: string | null;
}

export interface ChecklistStatus {
    id: string;
    completed_at: string | null;
    checklist_items: ChecklistItem | null;
    statuses: { name: string } | null;
}

export interface MemberDashboardUIProps {
    businessName: string;
    memberStage: 'new' | 'existing';
    trackLabel: string;
    progress: number;
    completedItems: number;
    totalItems: number;
    nextActions: ChecklistStatus[];
    recentWins: ChecklistStatus[];
    installedModules: MarketplaceModule[];
    onRefreshData?: () => void;
}

export function MemberDashboardUI({
    businessName,
    memberStage,
    trackLabel,
    progress,
    completedItems,
    totalItems,
    nextActions,
    recentWins,
    installedModules,
    onRefreshData
}: MemberDashboardUIProps) {

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {businessName}
                        </h1>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${memberStage === 'new' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                            {memberStage === 'new' ? 'Startup' : 'Established'}
                        </span>
                    </div>
                    <p className="text-muted-foreground">
                        {trackLabel}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild size="sm">
                        <Link href="/member-onboarding">
                            Update Context
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={onRefreshData} size="sm">
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
                                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
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

            {/* Installed Modules Section */}
            {installedModules.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Active Modules
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {installedModules.map(module => (
                            <div key={module.id} className="p-4 rounded-lg bg-card border shadow-sm flex flex-col gap-3 hover:border-primary/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground font-medium">
                                        {module.category}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm">{module.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{module.description}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="mt-auto w-full justify-start h-8 px-0 hover:bg-transparent hover:text-primary hover:underline">
                                    Open Module <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
