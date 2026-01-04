"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    CreditCard,
    Clock,
    Layers,
    Search,
    Percent
} from "lucide-react";
import type { PersonalCreditData, Tradeline, Inquiry } from "../types";
import { calculateUtilization } from "../types";

interface Step1Props {
    data: PersonalCreditData;
    onSave: (data: Partial<PersonalCreditData>) => void;
    tradelines?: Tradeline[];
    inquiries?: Inquiry[];
}

// Score dial component
function ScoreDial({ score, bureau, label }: { score?: number; bureau: string; label: string }) {
    const getScoreColor = (score: number) => {
        if (score >= 750) return "text-green-500";
        if (score >= 700) return "text-lime-500";
        if (score >= 650) return "text-yellow-500";
        if (score >= 600) return "text-orange-500";
        return "text-red-500";
    };

    const getScoreGrade = (score: number) => {
        if (score >= 800) return "Exceptional";
        if (score >= 740) return "Very Good";
        if (score >= 670) return "Good";
        if (score >= 580) return "Fair";
        return "Poor";
    };

    const scorePercent = score ? ((score - 300) / 550) * 100 : 0;

    return (
        <div className="flex flex-col items-center p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-colors">
            <span className="text-xs text-muted-foreground mb-2">{label}</span>
            <div className="relative w-20 h-20 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted/20"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${scorePercent}, 100`}
                        className={score ? getScoreColor(score) : "text-muted"}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-bold ${score ? getScoreColor(score) : "text-muted-foreground"}`}>
                        {score || "—"}
                    </span>
                </div>
            </div>
            <Badge variant="outline" className="text-xs">
                {score ? getScoreGrade(score) : "Not Set"}
            </Badge>
        </div>
    );
}

// Five factor card
function FactorCard({
    icon: Icon,
    title,
    weight,
    value,
    status
}: {
    icon: React.ElementType;
    title: string;
    weight: string;
    value: string;
    status: "good" | "fair" | "poor" | "neutral"
}) {
    const statusColors = {
        good: "text-green-500 bg-green-500/10 border-green-500/20",
        fair: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
        poor: "text-red-500 bg-red-500/10 border-red-500/20",
        neutral: "text-muted-foreground bg-muted/50 border-border"
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${statusColors[status]}`}>
            <div className={`p-2 rounded-lg ${statusColors[status]}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{title}</span>
                    <Badge variant="secondary" className="text-xs ml-2">{weight}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{value}</p>
            </div>
        </div>
    );
}

export function Step1ScoreOverview({ data, onSave, tradelines = [], inquiries = [] }: Step1Props) {
    const [scoreSource, setScoreSource] = useState<string>("manual");

    // Calculate utilization from tradelines
    const revolvingAccounts = tradelines.filter(t => t.accountType === "revolving" && t.accountStatus === "open");
    const totalLimit = revolvingAccounts.reduce((sum, t) => sum + (t.creditLimit || 0), 0);
    const totalBalance = revolvingAccounts.reduce((sum, t) => sum + (t.currentBalance || 0), 0);
    const overallUtilization = calculateUtilization(totalBalance, totalLimit);

    // Count hard inquiries in last 12 months
    const hardInquiriesLast12 = inquiries.filter(i => {
        if (!i.isHardPull) return false;
        const inquiryDate = new Date(i.inquiryDate);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return inquiryDate >= oneYearAgo;
    }).length;

    // Find oldest account
    const oldestAccount = tradelines
        .filter(t => t.dateOpened)
        .sort((a, b) => new Date(a.dateOpened!).getTime() - new Date(b.dateOpened!).getTime())[0];

    const accountAgeYears = oldestAccount
        ? Math.floor((Date.now() - new Date(oldestAccount.dateOpened!).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : 0;

    // Get utilization status
    const getUtilizationStatus = (percent: number): "good" | "fair" | "poor" | "neutral" => {
        if (percent === 0 && totalLimit === 0) return "neutral";
        if (percent <= 10) return "good";
        if (percent <= 30) return "fair";
        return "poor";
    };

    // Get inquiry status
    const getInquiryStatus = (count: number): "good" | "fair" | "poor" => {
        if (count <= 2) return "good";
        if (count <= 5) return "fair";
        return "poor";
    };

    return (
        <div className="space-y-8">
            {/* Score Entry Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Your Credit Scores</Label>
                    <Select value={scoreSource} onValueChange={setScoreSource}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual">Manual Entry</SelectItem>
                            <SelectItem value="experian" disabled>Experian (Coming Soon)</SelectItem>
                            <SelectItem value="creditkarma" disabled>Credit Karma (Coming Soon)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Score Dials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ScoreDial score={data.fico8Experian} bureau="experian" label="Experian FICO 8" />
                    <ScoreDial score={data.fico8Transunion} bureau="transunion" label="TransUnion FICO 8" />
                    <ScoreDial score={data.fico8Equifax} bureau="equifax" label="Equifax FICO 8" />
                    <ScoreDial score={data.vantage3Score} bureau="vantage" label="VantageScore 3.0" />
                </div>

                {/* Score Input Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label htmlFor="experian" className="text-xs text-muted-foreground">Experian</Label>
                        <Input
                            id="experian"
                            type="number"
                            min={300}
                            max={850}
                            placeholder="300-850"
                            value={data.fico8Experian || ""}
                            onChange={(e) => onSave({ fico8Experian: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="text-center"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="transunion" className="text-xs text-muted-foreground">TransUnion</Label>
                        <Input
                            id="transunion"
                            type="number"
                            min={300}
                            max={850}
                            placeholder="300-850"
                            value={data.fico8Transunion || ""}
                            onChange={(e) => onSave({ fico8Transunion: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="text-center"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="equifax" className="text-xs text-muted-foreground">Equifax</Label>
                        <Input
                            id="equifax"
                            type="number"
                            min={300}
                            max={850}
                            placeholder="300-850"
                            value={data.fico8Equifax || ""}
                            onChange={(e) => onSave({ fico8Equifax: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="text-center"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vantage" className="text-xs text-muted-foreground">VantageScore</Label>
                        <Input
                            id="vantage"
                            type="number"
                            min={300}
                            max={850}
                            placeholder="300-850"
                            value={data.vantage3Score || ""}
                            onChange={(e) => onSave({ vantage3Score: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="text-center"
                        />
                    </div>
                </div>
            </div>

            {/* Five Factor Breakdown */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">The 5 Factors Affecting Your Score</Label>
                <div className="grid gap-3">
                    <FactorCard
                        icon={CreditCard}
                        title="Payment History"
                        weight="35%"
                        value="Tracks on-time payments vs. late/missed"
                        status="neutral"
                    />
                    <FactorCard
                        icon={Percent}
                        title="Credit Utilization"
                        weight="30%"
                        value={totalLimit > 0
                            ? `Using ${overallUtilization}% of ${totalLimit.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} available`
                            : "Add accounts to track"
                        }
                        status={getUtilizationStatus(overallUtilization)}
                    />
                    <FactorCard
                        icon={Clock}
                        title="Length of Credit History"
                        weight="15%"
                        value={accountAgeYears > 0
                            ? `Oldest account: ${accountAgeYears} year${accountAgeYears !== 1 ? 's' : ''}`
                            : "Add accounts with open dates"
                        }
                        status={accountAgeYears >= 7 ? "good" : accountAgeYears >= 3 ? "fair" : "neutral"}
                    />
                    <FactorCard
                        icon={Layers}
                        title="Credit Mix"
                        weight="10%"
                        value={`${tradelines.length} account${tradelines.length !== 1 ? 's' : ''} tracked`}
                        status={tradelines.length >= 5 ? "good" : tradelines.length >= 2 ? "fair" : "neutral"}
                    />
                    <FactorCard
                        icon={Search}
                        title="New Credit Inquiries"
                        weight="10%"
                        value={`${hardInquiriesLast12} hard inquir${hardInquiriesLast12 !== 1 ? 'ies' : 'y'} in last 12 months`}
                        status={getInquiryStatus(hardInquiriesLast12)}
                    />
                </div>
            </div>
        </div>
    );
}
