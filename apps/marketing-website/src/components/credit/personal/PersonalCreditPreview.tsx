"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    CreditCard,
    TrendingUp,
    Shield,
    Clock,
    Search,
    Leaf,
    AlertTriangle,
    CheckCircle2,
    Target
} from "lucide-react";
import type { PersonalCreditData, Tradeline, Inquiry } from "../types";
import { calculateUtilization, getUtilizationBand } from "../types";

interface PreviewProps {
    data: PersonalCreditData;
    tradelines: Tradeline[];
    inquiries: Inquiry[];
    lastUpdated?: number;
    className?: string;
}

export function PersonalCreditPreview({
    data,
    tradelines,
    inquiries,
    className = ""
}: PreviewProps) {
    // Calculate scores
    const scores = useMemo(() => {
        const ficoScores = [
            data.fico8Experian,
            data.fico8Transunion,
            data.fico8Equifax
        ].filter(Boolean) as number[];

        const average = ficoScores.length > 0
            ? Math.round(ficoScores.reduce((a, b) => a + b, 0) / ficoScores.length)
            : null;

        return {
            experian: data.fico8Experian,
            transunion: data.fico8Transunion,
            equifax: data.fico8Equifax,
            vantage: data.vantage3Score,
            average,
        };
    }, [data]);

    // Calculate utilization
    const utilization = useMemo(() => {
        const revolvingAccounts = tradelines.filter(
            t => t.accountType === "revolving" && t.accountStatus === "open"
        );
        const totalLimit = revolvingAccounts.reduce((sum, t) => sum + (t.creditLimit || 0), 0);
        const totalBalance = revolvingAccounts.reduce((sum, t) => sum + (t.currentBalance || 0), 0);
        const percent = calculateUtilization(totalBalance, totalLimit);
        const band = getUtilizationBand(percent);

        return { totalLimit, totalBalance, percent, band, accountCount: revolvingAccounts.length };
    }, [tradelines]);

    // Calculate inquiries
    const inquiryStats = useMemo(() => {
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const hardPullsLast12 = inquiries.filter(i =>
            i.isHardPull && new Date(i.inquiryDate) >= oneYearAgo
        ).length;

        return { total: inquiries.length, hardPullsLast12 };
    }, [inquiries]);

    // Calculate account age
    const accountAge = useMemo(() => {
        const openAccounts = tradelines.filter(t => t.dateOpened && t.accountStatus === "open");
        if (openAccounts.length === 0) return { avgYears: 0, oldestYears: 0 };

        const now = new Date();
        const ages = openAccounts.map(t => {
            const days = Math.floor((now.getTime() - new Date(t.dateOpened!).getTime()) / (1000 * 60 * 60 * 24));
            return days / 365;
        });

        return {
            avgYears: Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 10) / 10,
            oldestYears: Math.round(Math.max(...ages) * 10) / 10,
        };
    }, [tradelines]);

    // Get score grade
    const getScoreGrade = (score: number | null) => {
        if (!score) return { label: "Not Set", color: "text-muted-foreground" };
        if (score >= 800) return { label: "Exceptional", color: "text-green-600" };
        if (score >= 740) return { label: "Very Good", color: "text-lime-600" };
        if (score >= 670) return { label: "Good", color: "text-yellow-600" };
        if (score >= 580) return { label: "Fair", color: "text-orange-600" };
        return { label: "Poor", color: "text-red-600" };
    };

    const scoreGrade = getScoreGrade(scores.average);

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Hero Score Section */}
            <div className="text-center py-8 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl border">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-bold">Credit Health Dashboard</h2>
                </div>

                <div className="relative inline-block">
                    <div className="w-40 h-40 rounded-full border-8 border-primary/20 flex items-center justify-center bg-card">
                        <div className="text-center">
                            <p className={`text-5xl font-bold ${scoreGrade.color}`}>
                                {scores.average || "—"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">FICO Average</p>
                        </div>
                    </div>
                </div>

                <Badge className={`mt-4 ${scoreGrade.color} bg-transparent border`}>
                    {scoreGrade.label}
                </Badge>

                {/* Individual Scores */}
                <div className="flex justify-center gap-8 mt-6">
                    <div className="text-center">
                        <p className="text-xl font-bold">{scores.experian || "—"}</p>
                        <p className="text-xs text-muted-foreground">Experian</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{scores.transunion || "—"}</p>
                        <p className="text-xs text-muted-foreground">TransUnion</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{scores.equifax || "—"}</p>
                        <p className="text-xs text-muted-foreground">Equifax</p>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Utilization */}
                <div className={`p-4 rounded-xl border ${utilization.percent <= 10 ? "bg-green-50 dark:bg-green-950/30 border-green-200" :
                        utilization.percent <= 30 ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200" :
                            "bg-red-50 dark:bg-red-950/30 border-red-200"
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs font-medium">Utilization</span>
                    </div>
                    <p className={`text-2xl font-bold ${utilization.percent <= 10 ? "text-green-600" :
                            utilization.percent <= 30 ? "text-yellow-600" :
                                "text-red-600"
                        }`}>
                        {utilization.percent}%
                    </p>
                    <p className="text-xs text-muted-foreground">{utilization.band.impact}</p>
                </div>

                {/* Account Age */}
                <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Avg. Age</span>
                    </div>
                    <p className="text-2xl font-bold">{accountAge.avgYears}y</p>
                    <p className="text-xs text-muted-foreground">Oldest: {accountAge.oldestYears}y</p>
                </div>

                {/* Inquiries */}
                <div className={`p-4 rounded-xl border ${inquiryStats.hardPullsLast12 <= 2 ? "bg-card" :
                        inquiryStats.hardPullsLast12 <= 5 ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200" :
                            "bg-red-50 dark:bg-red-950/30 border-red-200"
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Search className="w-4 h-4" />
                        <span className="text-xs font-medium">Hard Pulls (12mo)</span>
                    </div>
                    <p className={`text-2xl font-bold ${inquiryStats.hardPullsLast12 <= 2 ? "" :
                            inquiryStats.hardPullsLast12 <= 5 ? "text-yellow-600" :
                                "text-red-600"
                        }`}>
                        {inquiryStats.hardPullsLast12}
                    </p>
                    <p className="text-xs text-muted-foreground">of {inquiryStats.total} total</p>
                </div>

                {/* Gardening Mode */}
                <div className={`p-4 rounded-xl border ${data.gardeningModeEnabled
                        ? "bg-green-50 dark:bg-green-950/30 border-green-200"
                        : "bg-card"
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-4 h-4" />
                        <span className="text-xs font-medium">Gardening</span>
                    </div>
                    <p className={`text-2xl font-bold ${data.gardeningModeEnabled ? "text-green-600" : "text-muted-foreground"
                        }`}>
                        {data.gardeningModeEnabled ? "ON" : "OFF"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {data.gardeningModeEnabled ? "Accounts aging" : "Not active"}
                    </p>
                </div>
            </div>

            {/* Accounts Summary */}
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Credit Accounts ({tradelines.length})
                </h3>

                {tradelines.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No accounts tracked yet
                    </p>
                ) : (
                    <div className="grid gap-3">
                        {tradelines.slice(0, 5).map((tradeline) => {
                            const util = tradeline.creditLimit
                                ? calculateUtilization(tradeline.currentBalance || 0, tradeline.creditLimit)
                                : null;

                            return (
                                <div key={tradeline.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium text-sm">{tradeline.creditorName}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {tradeline.accountStatus}
                                                </Badge>
                                                {tradeline.hasPersonalGuarantee && (
                                                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                                                        PG
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {util !== null && (
                                        <div className="text-right">
                                            <p className="font-medium text-sm">{util}%</p>
                                            <p className="text-xs text-muted-foreground">utilization</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {tradelines.length > 5 && (
                            <p className="text-sm text-muted-foreground text-center">
                                +{tradelines.length - 5} more accounts
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Goals / Next Steps */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5" />
                    Next Steps to 750+
                </h3>
                <div className="space-y-2">
                    {utilization.percent > 30 && (
                        <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>Pay down utilization to under 30% (currently {utilization.percent}%)</span>
                        </div>
                    )}
                    {utilization.percent > 10 && utilization.percent <= 30 && (
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span>For optimal score, reduce utilization to under 10%</span>
                        </div>
                    )}
                    {inquiryStats.hardPullsLast12 > 3 && (
                        <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>Avoid new credit applications for 6 months</span>
                        </div>
                    )}
                    {!data.gardeningModeEnabled && tradelines.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Leaf className="w-4 h-4 text-green-500" />
                            <span>Enable Gardening Mode to let accounts age</span>
                        </div>
                    )}
                    {utilization.percent <= 10 && inquiryStats.hardPullsLast12 <= 2 && (
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>You&apos;re on track! Keep utilization low and avoid new inquiries.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
