"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Leaf,
    Clock,
    ShieldCheck,
    Calendar,
    AlertTriangle,
    Info
} from "lucide-react";
import type { PersonalCreditData, Tradeline, Inquiry } from "../types";

interface Step5Props {
    data: PersonalCreditData;
    onSave: (data: Partial<PersonalCreditData>) => void;
    tradelines?: Tradeline[];
    inquiries?: Inquiry[];
}

export function Step5GardeningMode({ data, onSave, tradelines = [], inquiries = [] }: Step5Props) {
    const isEnabled = data.gardeningModeEnabled ?? false;
    const startDate = data.gardeningModeStartDate
        ? new Date(data.gardeningModeStartDate)
        : null;

    // Calculate gardening progress (24 month rule)
    const gardeningProgress = useMemo(() => {
        if (!startDate) return { days: 0, months: 0, percent: 0 };

        const now = new Date();
        const diffTime = now.getTime() - startDate.getTime();
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const percent = Math.min((days / 730) * 100, 100); // 730 days = 24 months

        return { days, months, percent };
    }, [startDate]);

    // Calculate account ages
    const accountAges = useMemo(() => {
        const now = new Date();
        return tradelines
            .filter(t => t.dateOpened && t.accountStatus === "open")
            .map(t => {
                const opened = new Date(t.dateOpened!);
                const days = Math.floor((now.getTime() - opened.getTime()) / (1000 * 60 * 60 * 24));
                const years = Math.floor(days / 365);
                const months = Math.floor((days % 365) / 30);
                return {
                    name: t.creditorName,
                    days,
                    years,
                    months,
                    ageText: years > 0
                        ? `${years}y ${months}m`
                        : `${months}m`
                };
            })
            .sort((a, b) => a.days - b.days);
    }, [tradelines]);

    // Average account age
    const avgAge = useMemo(() => {
        if (accountAges.length === 0) return null;
        const totalDays = accountAges.reduce((sum, a) => sum + a.days, 0);
        const avgDays = totalDays / accountAges.length;
        const years = Math.floor(avgDays / 365);
        const months = Math.floor((avgDays % 365) / 30);
        return { years, months };
    }, [accountAges]);

    // Hard inquiries in last 6 months (should avoid applications)
    const recentInquiries = inquiries.filter(i => {
        if (!i.isHardPull) return false;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return new Date(i.inquiryDate) >= sixMonthsAgo;
    }).length;

    const handleToggle = (enabled: boolean) => {
        if (enabled) {
            onSave({
                gardeningModeEnabled: true,
                gardeningModeStartDate: new Date().toISOString().split('T')[0],
            });
        } else {
            onSave({
                gardeningModeEnabled: false,
                gardeningModeStartDate: undefined,
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Main Toggle Card */}
            <div className={`p-6 rounded-2xl border-2 transition-all ${isEnabled
                    ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                    : "bg-card border-border"
                }`}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${isEnabled
                                ? "bg-green-100 dark:bg-green-900/50"
                                : "bg-muted"
                            }`}>
                            <Leaf className={`w-6 h-6 ${isEnabled ? "text-green-600" : "text-muted-foreground"
                                }`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                Gardening Mode
                                {isEnabled && (
                                    <Badge className="bg-green-600">Active</Badge>
                                )}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                Stop applying for new credit and let your accounts age.
                                This improves your average account age and reduces inquiry impact.
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={handleToggle}
                        className="scale-125"
                    />
                </div>

                {/* Progress when enabled */}
                {isEnabled && startDate && (
                    <div className="mt-6 pt-6 border-t border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">24-Month Goal</span>
                            <span className="text-sm text-muted-foreground">
                                {gardeningProgress.months} of 24 months
                            </span>
                        </div>
                        <Progress
                            value={gardeningProgress.percent}
                            className="h-3 bg-green-100 dark:bg-green-900/30"
                        />
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Started {startDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Age Summary */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Account Age Analysis</Label>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 border">
                        <p className="text-xs text-muted-foreground mb-1">Average Account Age</p>
                        <p className="text-2xl font-bold">
                            {avgAge
                                ? `${avgAge.years}y ${avgAge.months}m`
                                : "—"
                            }
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                            {avgAge && avgAge.years >= 7 ? "Excellent" :
                                avgAge && avgAge.years >= 3 ? "Good" :
                                    avgAge && avgAge.years >= 1 ? "Fair" :
                                        "Building"}
                        </Badge>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border">
                        <p className="text-xs text-muted-foreground mb-1">Oldest Account</p>
                        <p className="text-2xl font-bold">
                            {accountAges.length > 0
                                ? `${accountAges[accountAges.length - 1].years}y ${accountAges[accountAges.length - 1].months}m`
                                : "—"
                            }
                        </p>
                        {accountAges.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2 truncate">
                                {accountAges[accountAges.length - 1].name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Account list */}
                {accountAges.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Account Ages (newest first)</p>
                        <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                            {accountAges.slice().reverse().map((account, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                                >
                                    <span className="text-sm truncate max-w-[200px]">{account.name}</span>
                                    <Badge variant="outline">{account.ageText}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Warnings */}
            {isEnabled && (
                <div className="space-y-3">
                    {recentInquiries > 0 && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-amber-900 dark:text-amber-100">
                                    {recentInquiries} recent inquir{recentInquiries > 1 ? 'ies' : 'y'}
                                </h4>
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    You have hard inquiries in the last 6 months. Avoid new applications to let them age.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Gardening Mode Tips</h4>
                            <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                <li>• Avoid opening new accounts for at least 6-12 months</li>
                                <li>• Keep existing accounts open and active (small purchases)</li>
                                <li>• Pay all balances in full each month</li>
                                <li>• Check your reports for errors (won't affect score)</li>
                                <li>• 24 months is ideal for maximum age benefit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Benefits Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-card/50 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Longer History</p>
                    <p className="text-xs text-muted-foreground">15% of your score</p>
                </div>
                <div className="p-4 rounded-xl border bg-card/50 text-center">
                    <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Fewer Inquiries</p>
                    <p className="text-xs text-muted-foreground">10% of your score</p>
                </div>
                <div className="p-4 rounded-xl border bg-card/50 text-center">
                    <Leaf className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Stability</p>
                    <p className="text-xs text-muted-foreground">Lenders prefer it</p>
                </div>
            </div>
        </div>
    );
}
