"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Building2,
    TrendingUp,
    ShieldCheck,
    Package,
    Store,
    CreditCard,
    Landmark,
    Trophy,
    Target,
    CheckCircle2,
    AlertTriangle,
    Hash
} from "lucide-react";
import type { BusinessCreditData, Tradeline } from "../types";
import { BUSINESS_TIERS, COMPLIANCE_ITEMS } from "../types";

interface PreviewProps {
    data: BusinessCreditData;
    tradelines: Tradeline[];
    lastUpdated?: number;
    className?: string;
}

export function BusinessCreditPreview({
    data,
    tradelines,
    className = ""
}: PreviewProps) {
    // Calculate compliance score
    const complianceScore = useMemo(() => {
        return COMPLIANCE_ITEMS.filter(item =>
            data[item.field as keyof BusinessCreditData] === true
        ).length * 25;
    }, [data]);

    // Calculate tier progress
    const tierCounts = useMemo(() => {
        return {
            tier1: tradelines.filter(t => t.tierLevel === 1).length,
            tier2: tradelines.filter(t => t.tierLevel === 2).length,
            tier3: tradelines.filter(t => t.tierLevel === 3).length,
            tier4: tradelines.filter(t => t.tierLevel === 4).length,
            nonPg: tradelines.filter(t => t.tierLevel === 4 && !t.hasPersonalGuarantee).length,
        };
    }, [tradelines]);

    // Calculate total credit available
    const totalCredit = useMemo(() => {
        return tradelines.reduce((sum, t) => sum + (t.creditLimit || 0), 0);
    }, [tradelines]);

    // Calculate current tier
    const currentTier = data.tier4Complete ? 4 :
        data.tier3Complete ? 3 :
            data.tier2Complete ? 2 :
                data.tier1Complete ? 1 : 0;

    // PAYDEX status
    const paydexStatus = data.paydexScore
        ? data.paydexScore >= 80 ? { label: "Excellent", color: "text-green-600" }
            : data.paydexScore >= 70 ? { label: "Good", color: "text-lime-600" }
                : data.paydexScore >= 50 ? { label: "Fair", color: "text-yellow-600" }
                    : { label: "Poor", color: "text-red-600" }
        : null;

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Hero Section */}
            <div className="text-center py-8 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl border">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Building2 className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-2xl font-bold">Business Credit Dashboard</h2>
                </div>

                <div className="flex justify-center gap-8">
                    {/* Tier Badge */}
                    <div className="text-center">
                        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mx-auto ${currentTier >= 4 ? "border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50" :
                            currentTier >= 3 ? "border-violet-400 bg-violet-50" :
                                currentTier >= 2 ? "border-blue-400 bg-blue-50" :
                                    currentTier >= 1 ? "border-emerald-400 bg-emerald-50" :
                                        "border-gray-200 bg-gray-50"
                            }`}>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{currentTier}</p>
                                <p className="text-xs text-muted-foreground">Tier</p>
                            </div>
                        </div>
                        <Badge className="mt-2" variant={currentTier >= 4 ? "default" : "secondary"}>
                            {currentTier >= 4 ? "Non-PG Unlocked!" : BUSINESS_TIERS[Math.max(currentTier, 1) as 1 | 2 | 3 | 4]?.name || "Getting Started"}
                        </Badge>
                    </div>

                    {/* PAYDEX Score */}
                    <div className="text-center">
                        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mx-auto ${data.paydexScore && data.paydexScore >= 80 ? "border-green-400 bg-green-50" :
                            data.paydexScore && data.paydexScore >= 70 ? "border-lime-400 bg-lime-50" :
                                "border-gray-200 bg-gray-50"
                            }`}>
                            <div className="text-center">
                                <p className={`text-3xl font-bold ${paydexStatus?.color || "text-muted-foreground"}`}>
                                    {data.paydexScore || "—"}
                                </p>
                                <p className="text-xs text-muted-foreground">PAYDEX</p>
                            </div>
                        </div>
                        <Badge className="mt-2" variant="outline">
                            {paydexStatus?.label || "Not Set"}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Compliance */}
                <div className={`p-4 rounded-xl border ${complianceScore === 100
                    ? "bg-green-50 dark:bg-green-950/30 border-green-200"
                    : "bg-amber-50 dark:bg-amber-950/30 border-amber-200"
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-medium">Compliance</span>
                    </div>
                    <p className={`text-2xl font-bold ${complianceScore === 100 ? "text-green-600" : "text-amber-600"
                        }`}>
                        {complianceScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {complianceScore === 100 ? "Complete" : "Incomplete"}
                    </p>
                </div>

                {/* Total Credit */}
                <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs font-medium">Total Credit</span>
                    </div>
                    <p className="text-2xl font-bold">
                        ${totalCredit.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {tradelines.length} accounts
                    </p>
                </div>

                {/* Non-PG Lines */}
                <div className={`p-4 rounded-xl border ${tierCounts.nonPg > 0
                    ? "bg-green-50 dark:bg-green-950/30 border-green-200"
                    : "bg-card"
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-medium">Non-PG Lines</span>
                    </div>
                    <p className={`text-2xl font-bold ${tierCounts.nonPg > 0 ? "text-green-600" : "text-muted-foreground"
                        }`}>
                        {tierCounts.nonPg}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {tierCounts.nonPg > 0 ? "🎉 Achieved!" : "Goal"}
                    </p>
                </div>

                {/* Intelliscore */}
                <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">Intelliscore</span>
                    </div>
                    <p className="text-2xl font-bold">
                        {data.intelliscorePlus || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {data.intelliscorePlus && data.intelliscorePlus >= 76 ? "Low Risk" : "Not Set"}
                    </p>
                </div>
            </div>

            {/* Business Info */}
            {data.legalBusinessName && (
                <div className="p-4 rounded-xl bg-muted/50 border">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5" />
                        {data.legalBusinessName}
                        {data.dbaName && <span className="text-muted-foreground font-normal">DBA: {data.dbaName}</span>}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.entityType && (
                            <Badge variant="outline" className="capitalize">{data.entityType.replace("_", " ")}</Badge>
                        )}
                        {data.formationState && (
                            <Badge variant="outline">{data.formationState}</Badge>
                        )}
                        {data.dunsNumber && (
                            <Badge variant="secondary" className="font-mono flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                DUNS: {data.dunsNumber}
                            </Badge>
                        )}
                    </div>
                </div>
            )}

            {/* Tier Progress */}
            <div className="space-y-4">
                <h3 className="font-semibold">Credit Building Progress</h3>

                <div className="grid gap-3">
                    {([1, 2, 3, 4] as const).map((tier) => {
                        const tierInfo = BUSINESS_TIERS[tier];
                        const count = tier === 1 ? tierCounts.tier1 :
                            tier === 2 ? tierCounts.tier2 :
                                tier === 3 ? tierCounts.tier3 :
                                    tierCounts.tier4;
                        const isComplete = currentTier >= tier;
                        const Icon = tier === 1 ? Package :
                            tier === 2 ? Store :
                                tier === 3 ? CreditCard :
                                    Landmark;

                        return (
                            <div
                                key={tier}
                                className={`flex items-center gap-4 p-3 rounded-lg border ${isComplete
                                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                    : tier === currentTier + 1
                                        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                                        : "bg-card"
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${isComplete ? "bg-green-100 dark:bg-green-900/50" : "bg-muted"
                                    }`}>
                                    <Icon className={`w-4 h-4 ${isComplete ? "text-green-600" : "text-muted-foreground"
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">{tierInfo.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{count} account{count !== 1 ? 's' : ''}</span>
                                            {isComplete && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5" />
                    Next Steps
                </h3>
                <div className="space-y-2">
                    {complianceScore < 100 && (
                        <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>Complete compliance checklist ({complianceScore}% done)</span>
                        </div>
                    )}
                    {complianceScore === 100 && currentTier === 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-emerald-500" />
                            <span>Apply for 3+ Net-30 vendors (Tier 1)</span>
                        </div>
                    )}
                    {currentTier === 1 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Store className="w-4 h-4 text-blue-500" />
                            <span>Apply for store cards after 3+ vendor trade lines</span>
                        </div>
                    )}
                    {currentTier === 2 && (
                        <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-violet-500" />
                            <span>Apply for bank business cards</span>
                        </div>
                    )}
                    {currentTier === 3 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Landmark className="w-4 h-4 text-amber-500" />
                            <span>Target Non-PG products with strong PAYDEX (80+)</span>
                        </div>
                    )}
                    {!data.paydexScore && (
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span>Check and enter your PAYDEX score</span>
                        </div>
                    )}
                    {!data.dunsNumber && (
                        <div className="flex items-center gap-2 text-sm">
                            <Hash className="w-4 h-4 text-blue-500" />
                            <span>Get your free DUNS number from dnb.com</span>
                        </div>
                    )}
                    {tierCounts.nonPg > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Congratulations! You have Non-PG credit lines. Keep building!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
