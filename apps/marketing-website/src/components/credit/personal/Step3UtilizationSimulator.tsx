"use client";

import { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    Target,
    Lightbulb,
    RotateCcw
} from "lucide-react";
import type { PersonalCreditData, Tradeline } from "../types";
import { calculateUtilization, getUtilizationBand, UTILIZATION_BANDS } from "../types";

interface Step3Props {
    data: PersonalCreditData;
    onSave: (data: Partial<PersonalCreditData>) => void;
    tradelines?: Tradeline[];
}

interface SimulatedAccount {
    id: string;
    name: string;
    currentBalance: number;
    creditLimit: number;
    simulatedBalance: number;
}

export function Step3UtilizationSimulator({ data, onSave, tradelines = [] }: Step3Props) {
    // Only include open revolving accounts
    const revolvingAccounts = useMemo(() =>
        tradelines.filter(
            t => t.accountType === "revolving" && t.accountStatus === "open" && t.creditLimit
        ),
        [tradelines]
    );

    // Initialize simulated balances
    const [simulatedAccounts, setSimulatedAccounts] = useState<SimulatedAccount[]>([]);

    // Sync simulatedAccounts when tradelines change (fixes async loading issue)
    useEffect(() => {
        setSimulatedAccounts(
            revolvingAccounts.map(t => ({
                id: t.id!,
                name: t.creditorName,
                currentBalance: t.currentBalance || 0,
                creditLimit: t.creditLimit || 0,
                simulatedBalance: t.currentBalance || 0,
            }))
        );
    }, [revolvingAccounts]);

    // Calculate current and simulated utilization
    const currentTotal = useMemo(() => {
        const totalLimit = simulatedAccounts.reduce((sum, a) => sum + a.creditLimit, 0);
        const totalBalance = simulatedAccounts.reduce((sum, a) => sum + a.currentBalance, 0);
        return { totalLimit, totalBalance, utilization: calculateUtilization(totalBalance, totalLimit) };
    }, [simulatedAccounts]);

    const simulatedTotal = useMemo(() => {
        const totalLimit = simulatedAccounts.reduce((sum, a) => sum + a.creditLimit, 0);
        const totalBalance = simulatedAccounts.reduce((sum, a) => sum + a.simulatedBalance, 0);
        return { totalLimit, totalBalance, utilization: calculateUtilization(totalBalance, totalLimit) };
    }, [simulatedAccounts]);

    // Estimate point impact
    const currentBand = getUtilizationBand(currentTotal.utilization);
    const simulatedBand = getUtilizationBand(simulatedTotal.utilization);
    const pointDifference = (simulatedBand.points - currentBand.points) * -1; // Invert so positive = gain

    // Calculate how much to pay
    const paydownAmount = currentTotal.totalBalance - simulatedTotal.totalBalance;

    const handleSliderChange = (accountId: string, newBalance: number) => {
        setSimulatedAccounts(prev =>
            prev.map(a => a.id === accountId ? { ...a, simulatedBalance: newBalance } : a)
        );
    };

    const resetSimulation = () => {
        setSimulatedAccounts(prev =>
            prev.map(a => ({ ...a, simulatedBalance: a.currentBalance }))
        );
    };

    // Target optimization suggestions
    const suggestions = useMemo(() => {
        const tips: string[] = [];

        // Find accounts over 30%
        const overUtilized = simulatedAccounts.filter(a =>
            calculateUtilization(a.simulatedBalance, a.creditLimit) > 30
        );

        if (overUtilized.length > 0) {
            tips.push(`Pay down ${overUtilized[0].name} to below 30% for best impact`);
        }

        // Check if any are at 0%
        const zeroBalance = simulatedAccounts.filter(a => a.simulatedBalance === 0);
        if (zeroBalance.length === simulatedAccounts.length && simulatedAccounts.length > 0) {
            tips.push("Keep a small balance on one card ($1-10) to show activity");
        }

        // Suggest optimal allocation
        if (simulatedTotal.utilization > 10 && paydownAmount > 0) {
            const targetTotal = simulatedTotal.totalLimit * 0.09; // Target 9%
            const neededPaydown = simulatedTotal.totalBalance - targetTotal;
            if (neededPaydown > 0) {
                tips.push(`Pay $${Math.ceil(neededPaydown).toLocaleString()} more to reach optimal 9% utilization`);
            }
        }

        return tips;
    }, [simulatedAccounts, simulatedTotal, paydownAmount]);

    if (revolvingAccounts.length === 0) {
        return (
            <div className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No Credit Cards to Simulate</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Add your credit card accounts in the previous step to use the "What-If" calculator and see how paying down balances affects your score.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Results Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Current State */}
                <Card className="bg-muted/30">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Current Utilization</p>
                        <p className={`text-3xl font-bold ${currentTotal.utilization <= 10 ? "text-green-600" :
                            currentTotal.utilization <= 30 ? "text-yellow-600" :
                                "text-red-600"
                            }`}>
                            {currentTotal.utilization}%
                        </p>
                        <Badge variant="outline" className="mt-2">{currentBand.impact}</Badge>
                    </CardContent>
                </Card>

                {/* Simulated State */}
                <Card className={`${pointDifference !== 0 ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Simulated Utilization</p>
                        <p className={`text-3xl font-bold ${simulatedTotal.utilization <= 10 ? "text-green-600" :
                            simulatedTotal.utilization <= 30 ? "text-yellow-600" :
                                "text-red-600"
                            }`}>
                            {simulatedTotal.utilization}%
                        </p>
                        <Badge variant="outline" className="mt-2">{simulatedBand.impact}</Badge>
                    </CardContent>
                </Card>

                {/* Point Impact */}
                <Card className={`${pointDifference > 0 ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" :
                    pointDifference < 0 ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" :
                        ""
                    }`}>
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Estimated Impact</p>
                        <div className="flex items-center justify-center gap-2">
                            {pointDifference > 0 ? (
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            ) : pointDifference < 0 ? (
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            ) : null}
                            <p className={`text-3xl font-bold ${pointDifference > 0 ? "text-green-600" :
                                pointDifference < 0 ? "text-red-600" :
                                    "text-muted-foreground"
                                }`}>
                                {pointDifference > 0 ? "+" : ""}{pointDifference}
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {paydownAmount > 0
                                ? `Pay $${Math.abs(paydownAmount).toLocaleString()}`
                                : paydownAmount < 0
                                    ? `Spend $${Math.abs(paydownAmount).toLocaleString()}`
                                    : "No change"
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Account Sliders */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Adjust Balances</Label>
                    <Button variant="ghost" size="sm" onClick={resetSimulation} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                </div>

                <div className="space-y-6">
                    {simulatedAccounts.map((account) => {
                        const currentUtil = calculateUtilization(account.currentBalance, account.creditLimit);
                        const simUtil = calculateUtilization(account.simulatedBalance, account.creditLimit);

                        return (
                            <div key={account.id} className="space-y-3 p-4 rounded-xl border bg-card/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">{account.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Limit: ${account.creditLimit.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ${account.simulatedBalance.toLocaleString()}
                                        </p>
                                        <p className={`text-xs ${simUtil <= 10 ? "text-green-600" :
                                            simUtil <= 30 ? "text-yellow-600" :
                                                "text-red-600"
                                            }`}>
                                            {simUtil}% utilization
                                        </p>
                                    </div>
                                </div>

                                <Slider
                                    value={[account.simulatedBalance]}
                                    max={account.creditLimit}
                                    min={0}
                                    step={10}
                                    onValueChange={([value]) => handleSliderChange(account.id, value)}
                                    className="py-2"
                                />

                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>$0</span>
                                    <div className="flex gap-4">
                                        <span className="text-green-600">|10%</span>
                                        <span className="text-yellow-600">|30%</span>
                                        <span className="text-red-600">|50%</span>
                                    </div>
                                    <span>${account.creditLimit.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tips */}
            {suggestions.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-amber-900 dark:text-amber-100">Optimization Tips</h4>
                            <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
                                {suggestions.map((tip, i) => (
                                    <li key={i}>• {tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Utilization Band Reference */}
            <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Utilization Impact Reference</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {UTILIZATION_BANDS.map((band) => (
                        <div
                            key={band.label}
                            className={`p-2 rounded-lg border text-center text-xs ${band.impact === "Excellent" ? "bg-green-50 border-green-200 dark:bg-green-950/20" :
                                band.impact === "Good" ? "bg-lime-50 border-lime-200 dark:bg-lime-950/20" :
                                    band.impact === "Fair" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20" :
                                        band.impact === "Poor" ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20" :
                                            "bg-red-50 border-red-200 dark:bg-red-950/20"
                                }`}
                        >
                            <p className="font-medium">{band.label}</p>
                            <p className="text-muted-foreground">{band.impact}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
