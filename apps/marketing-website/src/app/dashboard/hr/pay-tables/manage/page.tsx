"use client";

/**
 * Pay Tables Manager
 * 
 * Allows HR to manage anchor salaries and Senior Lead Partner bonus configurations.
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Settings, DollarSign, Save, RefreshCw, ArrowLeft, Users, Briefcase, Award,
    Percent, TrendingUp, AlertCircle, CheckCircle2, Zap, Target, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    getAllPayTables,
    updateCareerLevel,
    updateExecutiveConfig,
    type PayTableData,
} from "@/actions/pay-tables";

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// ============================================
// SALARY EDITOR COMPONENT (for Partner/Lead Partner)
// ============================================

interface SalaryEditorProps {
    data: PayTableData;
    onUpdate: () => void;
}

function SalaryEditor({ data, onUpdate }: SalaryEditorProps) {
    const { careerLevel } = data;
    const [anchorSalary, setAnchorSalary] = useState(careerLevel.anchor_salary);
    const [promotionPct, setPromotionPct] = useState(careerLevel.promotion_increase_pct || 10);
    const [longevityPct, setLongevityPct] = useState(careerLevel.longevity_increase_pct || 3);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync state with props when careerLevel data changes (e.g., after refresh)
    useEffect(() => {
        setAnchorSalary(careerLevel.anchor_salary);
        setPromotionPct(careerLevel.promotion_increase_pct || 10);
        setLongevityPct(careerLevel.longevity_increase_pct || 3);
    }, [careerLevel.anchor_salary, careerLevel.promotion_increase_pct, careerLevel.longevity_increase_pct]);

    const hasChanges =
        anchorSalary !== careerLevel.anchor_salary ||
        promotionPct !== (careerLevel.promotion_increase_pct || 10) ||
        longevityPct !== (careerLevel.longevity_increase_pct || 3);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        const result = await updateCareerLevel(careerLevel.id, {
            anchor_salary: anchorSalary,
            promotion_increase_pct: promotionPct,
            longevity_increase_pct: longevityPct
        });

        setSaving(false);

        if (result.success) {
            setSuccess(true);
            onUpdate();
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || "Failed to update");
        }
    };

    const Icon = careerLevel.code === "partner" ? Users : Briefcase;

    return (
        <Card className={cn(
            "transition-all duration-300",
            hasChanges && "ring-2 ring-primary/50"
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        careerLevel.code === "partner" && "bg-blue-100 dark:bg-blue-900/30",
                        careerLevel.code === "lead_partner" && "bg-purple-100 dark:bg-purple-900/30"
                    )}>
                        <Icon className={cn(
                            "h-5 w-5",
                            careerLevel.code === "partner" && "text-blue-600 dark:text-blue-400",
                            careerLevel.code === "lead_partner" && "text-purple-600 dark:text-purple-400"
                        )} />
                    </div>
                    <div>
                        <CardTitle className="text-lg">{careerLevel.name}</CardTitle>
                        <CardDescription>{careerLevel.description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Anchor Salary */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <DollarSign className="h-4 w-4" />
                        Anchor Salary
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                            type="number"
                            value={anchorSalary}
                            onChange={(e) => setAnchorSalary(Number(e.target.value))}
                            className="pl-7 font-mono"
                            min={0}
                            step={1000}
                        />
                    </div>
                </div>

                {/* Promotion & Longevity Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                            <Award className="h-4 w-4" />
                            Promotion %
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={promotionPct}
                                onChange={(e) => setPromotionPct(Number(e.target.value))}
                                className="pr-7 font-mono"
                                min={0}
                                max={50}
                                step={1}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Per class level (A→F)</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            Longevity %
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={longevityPct}
                                onChange={(e) => setLongevityPct(Number(e.target.value))}
                                className="pr-7 font-mono"
                                min={0}
                                max={20}
                                step={0.5}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Every 2 years</p>
                    </div>
                </div>

                {success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Settings saved and pay grades recalculated!
                        </p>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground italic">
                    Focus: {careerLevel.focus}
                </p>
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="gap-2"
                    size="sm"
                >
                    {saving ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {hasChanges ? "Save" : "No Changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}


// ============================================
// EXECUTIVE CONFIG EDITOR COMPONENT
// ============================================

interface ExecutiveConfigEditorProps {
    data: PayTableData;
    onUpdate: () => void;
}

function ExecutiveConfigEditor({ data, onUpdate }: ExecutiveConfigEditorProps) {
    const { careerLevel, grades } = data;

    // Get current values from first grade
    const firstGrade = grades[0];

    const [baseVpSalary, setBaseVpSalary] = useState(careerLevel.anchor_salary);
    const [promotionIncreasePct, setPromotionIncreasePct] = useState(careerLevel.promotion_increase_pct || 10);
    const [targetBonusPct, setTargetBonusPct] = useState(firstGrade?.target_bonus_pct || 30);
    const [stretchBonusPct, setStretchBonusPct] = useState(firstGrade?.stretch_bonus_pct || 45);
    const [homeRunBonusPct, setHomeRunBonusPct] = useState(firstGrade?.home_run_bonus_pct || 60);

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync state with props when data changes (e.g., after refresh)
    useEffect(() => {
        setBaseVpSalary(careerLevel.anchor_salary);
        setPromotionIncreasePct(careerLevel.promotion_increase_pct || 10);
        setTargetBonusPct(firstGrade?.target_bonus_pct || 30);
        setStretchBonusPct(firstGrade?.stretch_bonus_pct || 45);
        setHomeRunBonusPct(firstGrade?.home_run_bonus_pct || 60);
    }, [careerLevel.anchor_salary, careerLevel.promotion_increase_pct, firstGrade?.target_bonus_pct, firstGrade?.stretch_bonus_pct, firstGrade?.home_run_bonus_pct]);

    const hasChanges =
        baseVpSalary !== careerLevel.anchor_salary ||
        promotionIncreasePct !== (careerLevel.promotion_increase_pct || 10) ||
        targetBonusPct !== (firstGrade?.target_bonus_pct || 30) ||
        stretchBonusPct !== (firstGrade?.stretch_bonus_pct || 45) ||
        homeRunBonusPct !== (firstGrade?.home_run_bonus_pct || 60);

    // Calculate preview for each class
    const classPreview = [
        { code: "A", name: "VP Level", multiplier: 1 },
        { code: "B", name: "VP Level B", multiplier: Math.pow(1 + promotionIncreasePct / 100, 1) },
        { code: "C", name: "VP Level C", multiplier: Math.pow(1 + promotionIncreasePct / 100, 2) },
        { code: "D", name: "SVP Level", multiplier: Math.pow(1 + promotionIncreasePct / 100, 3) },
        { code: "E", name: "EVP Level", multiplier: Math.pow(1 + promotionIncreasePct / 100, 4) },
        { code: "F", name: "C-Suite", multiplier: Math.pow(1 + promotionIncreasePct / 100, 5) },
    ];

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        const result = await updateExecutiveConfig({
            careerLevelId: careerLevel.id,
            baseVpSalary,
            promotionIncreasePct,
            targetBonusPct,
            stretchBonusPct,
            homeRunBonusPct
        });

        setSaving(false);

        if (result.success) {
            setSuccess(true);
            onUpdate();
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || "Failed to update");
        }
    };

    return (
        <Card className={cn(
            "transition-all duration-300",
            hasChanges && "ring-2 ring-amber-400/50"
        )}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30">
                        <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            Senior Lead Partner Configuration
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                Performance-Based
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Configure base VP salary, promotion increase, and bonus percentages
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Row 1: Base VP Salary + Promotion Increase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-base font-semibold">
                            <DollarSign className="h-4 w-4 text-amber-600" />
                            Base VP Level Salary
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Starting salary for Class A (VP Level). All other classes are calculated from this.
                        </p>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                                type="number"
                                value={baseVpSalary}
                                onChange={(e) => setBaseVpSalary(Number(e.target.value))}
                                className="pl-7 font-mono text-lg h-12"
                                min={0}
                                step={5000}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-base font-semibold">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            Promotion Increase %
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Salary increase for each promotion level (A → B → C → D → E → F)
                        </p>
                        <div className="relative">
                            <Input
                                type="number"
                                value={promotionIncreasePct}
                                onChange={(e) => setPromotionIncreasePct(Number(e.target.value))}
                                className="pr-8 font-mono text-lg h-12"
                                min={0}
                                max={50}
                                step={1}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Row 2: Bonus Percentages - Now in rows */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Performance Bonus Structure
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Bonus percentages are calculated on top of the base salary. Higher tiers reward exceptional performance.
                    </p>

                    {/* Target Bonus Row */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <Label className="text-base font-medium text-green-800 dark:text-green-300">
                                Target Bonus
                            </Label>
                            <p className="text-sm text-green-700/80 dark:text-green-400/80">
                                For meeting performance goals
                            </p>
                        </div>
                        <div className="relative w-32">
                            <Input
                                type="number"
                                value={targetBonusPct}
                                onChange={(e) => setTargetBonusPct(Number(e.target.value))}
                                className="pr-8 font-mono text-center"
                                min={0}
                                max={100}
                                step={5}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                    </div>

                    {/* Stretch Bonus Row */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <Label className="text-base font-medium text-blue-800 dark:text-blue-300">
                                Stretch Bonus
                            </Label>
                            <p className="text-sm text-blue-700/80 dark:text-blue-400/80">
                                For exceeding performance goals
                            </p>
                        </div>
                        <div className="relative w-32">
                            <Input
                                type="number"
                                value={stretchBonusPct}
                                onChange={(e) => setStretchBonusPct(Number(e.target.value))}
                                className="pr-8 font-mono text-center"
                                min={0}
                                max={100}
                                step={5}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                    </div>

                    {/* Home Run Bonus Row */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <Label className="text-base font-medium text-amber-800 dark:text-amber-300">
                                Home Run Bonus
                            </Label>
                            <p className="text-sm text-amber-700/80 dark:text-amber-400/80">
                                For exceptional, transformational results
                            </p>
                        </div>
                        <div className="relative w-32">
                            <Input
                                type="number"
                                value={homeRunBonusPct}
                                onChange={(e) => setHomeRunBonusPct(Number(e.target.value))}
                                className="pr-8 font-mono text-center"
                                min={0}
                                max={200}
                                step={5}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Class Preview Table */}
                <div className="space-y-3">
                    <h3 className="font-semibold">Calculated Salaries by Class</h3>
                    <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Class</th>
                                    <th className="px-4 py-2 text-left font-medium">Title</th>
                                    <th className="px-4 py-2 text-right font-medium">Base Salary</th>
                                    <th className="px-4 py-2 text-right font-medium">Total Comp Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classPreview.map((cls, idx) => {
                                    const salary = Math.round(baseVpSalary * cls.multiplier);
                                    const minComp = salary + (salary * targetBonusPct / 100);
                                    const maxComp = salary + (salary * targetBonusPct / 100) +
                                        (salary * stretchBonusPct / 100) +
                                        (salary * homeRunBonusPct / 100);
                                    return (
                                        <tr key={cls.code} className={idx % 2 === 0 ? "bg-muted/20" : ""}>
                                            <td className="px-4 py-2">
                                                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 text-amber-800 inline-flex items-center justify-center text-xs font-bold">
                                                    {cls.code}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 font-medium">{cls.name}</td>
                                            <td className="px-4 py-2 text-right font-mono">
                                                {formatCurrency(salary)}
                                            </td>
                                            <td className="px-4 py-2 text-right font-mono text-primary">
                                                {formatCurrency(minComp)} - {formatCurrency(maxComp)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Executive configuration saved and all pay grades recalculated!
                        </p>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="w-full gap-2"
                    size="lg"
                    variant={hasChanges ? "default" : "outline"}
                >
                    {saving ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {hasChanges ? "Save All Changes" : "No Changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}

// ============================================
// MAIN MANAGER PAGE
// ============================================

export default function PayTablesManagerPage() {
    const router = useRouter();
    const [payTables, setPayTables] = useState<PayTableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getAllPayTables();
                setPayTables(data);
            } catch (error) {
                console.error("Failed to load pay tables:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [refreshKey]);

    const handleRefresh = () => {
        setLoading(true);
        setRefreshKey(prev => prev + 1);
    };

    // Separate executive from regular levels
    const regularLevels = payTables.filter(t => !t.careerLevel.is_performance_based);
    const executiveLevel = payTables.find(t => t.careerLevel.is_performance_based);

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-48" />)}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard/hr/pay-tables")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manage Pay Tables</h1>
                        <p className="text-muted-foreground">
                            Configure anchor salaries and executive compensation
                        </p>
                    </div>
                </div>
                <Button variant="outline" onClick={handleRefresh} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Partner & Lead Partner Anchor Salaries */}
            <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Partner & Lead Partner Configuration
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Configure anchor salary, promotion increase %, and longevity increase % for each level.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regularLevels.map((tableData) => (
                        <SalaryEditor
                            key={tableData.careerLevel.id}
                            data={tableData}
                            onUpdate={handleRefresh}
                        />
                    ))}
                </div>
            </div>

            <Separator />

            {/* Senior Lead Partner Configuration */}
            {executiveLevel && (
                <ExecutiveConfigEditor
                    data={executiveLevel}
                    onUpdate={handleRefresh}
                />
            )}
        </div>
    );
}
