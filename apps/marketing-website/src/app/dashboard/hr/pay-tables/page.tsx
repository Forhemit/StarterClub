"use client";

/**
 * Pay Tables Dashboard
 * 
 * Displays salary tables for Partner, Lead Partner, and Senior Lead Partner
 * career levels with Class A-F and 1-20 years of service.
 */

import React, { useState, useEffect } from "react";
import { DollarSign, Users, Briefcase, Award, TrendingUp, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getAllPayTables, type PayTableData, type PayGrade } from "@/actions/pay-tables";

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

function formatPercent(value: number | null): string {
    if (value === null) return "-";
    return `${value}%`;
}

// Get grade labels for display
function getGradeYearsLabel(years: number): string {
    if (years <= 2) return "0-2 Yrs";
    if (years <= 4) return "3-4 Yrs";
    if (years <= 6) return "5-6 Yrs";
    if (years <= 8) return "7-8 Yrs";
    if (years <= 10) return "9-10 Yrs";
    if (years <= 12) return "11-12 Yrs";
    if (years <= 14) return "13-14 Yrs";
    if (years <= 16) return "15-16 Yrs";
    return "17+ Yrs";
}

// Get class badge styling based on whether it's executive level or not
function getClassBadgeStyle(classCode: string, isExecutive: boolean): string {
    if (isExecutive) {
        // Executive level uses premium gold/slate gradient styling
        const executiveStyles: Record<string, string> = {
            "A": "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-200",
            "B": "bg-gradient-to-br from-stone-200 to-stone-300 text-stone-700 dark:from-stone-700 dark:to-stone-600 dark:text-stone-200",
            "C": "bg-gradient-to-br from-amber-200 to-amber-300 text-amber-800 dark:from-amber-700 dark:to-amber-600 dark:text-amber-100",
            "D": "bg-gradient-to-br from-amber-300 to-yellow-400 text-amber-900 dark:from-amber-600 dark:to-yellow-500 dark:text-amber-100",
            "E": "bg-gradient-to-br from-yellow-300 to-amber-400 text-amber-900 dark:from-yellow-500 dark:to-amber-400 dark:text-yellow-100 ring-1 ring-amber-400/50",
            "F": "bg-gradient-to-br from-yellow-400 to-amber-500 text-amber-950 dark:from-yellow-400 dark:to-amber-400 dark:text-amber-950 ring-2 ring-yellow-500/50 shadow-sm",
        };
        return executiveStyles[classCode] || "";
    } else {
        // Regular Partner/Lead Partner styling
        const regularStyles: Record<string, string> = {
            "A": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
            "B": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            "C": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            "D": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            "E": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            "F": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        };
        return regularStyles[classCode] || "";
    }
}

// ============================================
// PAY TABLE COMPONENT
// ============================================

interface PayTableProps {
    data: PayTableData;
}

function PayTable({ data }: PayTableProps) {
    const { careerLevel, classes, grades } = data;
    const isExecutive = careerLevel.is_performance_based;

    // Get dynamic bonus percentages from first grade
    const firstGrade = grades[0];
    const targetBonusPct = firstGrade?.target_bonus_pct || 0;
    const stretchBonusPct = firstGrade?.stretch_bonus_pct || 0;
    const homeRunBonusPct = firstGrade?.home_run_bonus_pct || 0;
    const totalBonusRange = targetBonusPct > 0 ?
        `${targetBonusPct}-${targetBonusPct + stretchBonusPct + homeRunBonusPct}%` :
        "Variable";
    const promotionIncreasePct = careerLevel.promotion_increase_pct || 10;

    // Group grades by years of service (showing fewer years on mobile)
    const displayYears = [1, 5, 9, 13, 17, 20];
    const mobileDisplayYears = [1, 9, 17]; // Fewer columns on mobile

    // Create a lookup for grades by class and year
    const gradesByClassAndYear: { [key: string]: { [year: number]: PayGrade } } = {};
    grades.forEach(grade => {
        const classCode = grade.class_code || "A";
        if (!gradesByClassAndYear[classCode]) {
            gradesByClassAndYear[classCode] = {};
        }
        gradesByClassAndYear[classCode][grade.years_of_service] = grade;
    });

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                        <CardTitle className="text-lg sm:text-xl flex flex-wrap items-center gap-2">
                            {careerLevel.name}
                            {isExecutive && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    Performance-Based
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {careerLevel.description}
                        </CardDescription>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                        <p className="text-sm text-muted-foreground">
                            {isExecutive ? "Base VP Salary" : "Anchor Salary"}
                        </p>
                        <p className="text-lg font-bold text-primary">
                            {formatCurrency(careerLevel.anchor_salary)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-3 text-sm flex-wrap">
                    {isExecutive ? (
                        <>
                            <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                <DollarSign className="h-3 w-3" />
                                Base + Variable Pay
                            </Badge>
                            <Badge variant="outline" className="gap-1 border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/30 dark:text-green-400">
                                <TrendingUp className="h-3 w-3" />
                                {totalBonusRange} At-Risk Bonus
                            </Badge>
                            <Badge variant="outline" className="gap-1 border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                                <Award className="h-3 w-3" />
                                {promotionIncreasePct}% per Promotion
                            </Badge>
                        </>
                    ) : (
                        <>
                            <Badge variant="outline" className="gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {careerLevel.longevity_increase_pct || 3}% every 2 years
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <Award className="h-3 w-3" />
                                {promotionIncreasePct}% per Promotion
                            </Badge>
                        </>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 italic">
                    Focus: {careerLevel.focus}
                </p>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
                <div className="text-xs text-muted-foreground mb-2 sm:hidden flex items-center gap-1">
                    <span>←</span> Scroll to see more <span>→</span>
                </div>
                <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-lg border">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-40 sm:w-48 font-semibold sticky left-0 bg-muted/50 z-10">Class</TableHead>
                                {displayYears.map((year) => (
                                    <TableHead key={year} className="text-center font-semibold min-w-[100px]">
                                        <div>Grade {Math.ceil(year / 2)}</div>
                                        <div className="text-xs font-normal text-muted-foreground">
                                            ({getGradeYearsLabel(year)})
                                        </div>
                                    </TableHead>
                                ))}
                                {isExecutive && (
                                    <>
                                        <TableHead className="text-center font-semibold min-w-[70px] text-green-700 dark:text-green-400">
                                            Target
                                        </TableHead>
                                        <TableHead className="text-center font-semibold min-w-[70px] text-blue-700 dark:text-blue-400">
                                            Stretch
                                        </TableHead>
                                        <TableHead className="text-center font-semibold min-w-[70px] text-amber-700 dark:text-amber-400">
                                            Home Run
                                        </TableHead>
                                        <TableHead className="text-center font-semibold min-w-[120px]">
                                            Total Comp Range
                                        </TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classes.map((cls, idx) => {
                                const rowGrades = gradesByClassAndYear[cls.class_code] || {};
                                const firstGrade = rowGrades[1];

                                return (
                                    <TableRow
                                        key={cls.id}
                                        className={cn(
                                            "hover:bg-muted/50 transition-colors",
                                            idx % 2 === 0 && "bg-muted/20"
                                        )}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                                    getClassBadgeStyle(cls.class_code, isExecutive)
                                                )}>
                                                    {cls.class_code}
                                                </span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger className="text-left">
                                                            <span>{cls.class_name}</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{cls.class_description}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Multiplier: {cls.promotion_multiplier.toFixed(2)}x
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                        {displayYears.map((year) => {
                                            const grade = rowGrades[year];
                                            return (
                                                <TableCell key={year} className="text-center font-mono">
                                                    {grade ? formatCurrency(grade.base_salary) : "-"}
                                                </TableCell>
                                            );
                                        })}
                                        {isExecutive && firstGrade && (
                                            <>
                                                <TableCell className="text-center font-mono text-green-600 dark:text-green-400">
                                                    {formatPercent(firstGrade.target_bonus_pct)}
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-blue-600 dark:text-blue-400">
                                                    {formatPercent(firstGrade.stretch_bonus_pct)}
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-amber-600 dark:text-amber-400">
                                                    {formatPercent(firstGrade.home_run_bonus_pct)}
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-sm">
                                                    {firstGrade.total_comp_min && firstGrade.total_comp_max ? (
                                                        <span className="text-primary font-semibold">
                                                            {formatCurrency(firstGrade.total_comp_min)} - {formatCurrency(firstGrade.total_comp_max)}
                                                        </span>
                                                    ) : "-"}
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// MAIN PAY TABLES PAGE
// ============================================

export default function PayTablesPage() {
    const [payTables, setPayTables] = useState<PayTableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("partner");

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
    }, []);

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
                <Skeleton className="h-12 w-full max-w-lg" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    const tabConfig = [
        { value: "partner", label: "Partner", icon: Users, description: "Employee Level" },
        { value: "lead_partner", label: "Lead Partner", icon: Briefcase, description: "Manager Level" },
        { value: "senior_lead_partner", label: "Senior Lead Partner", icon: Award, description: "Executive Level" },
    ];

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pay Tables</h1>
                        <p className="text-muted-foreground">
                            Compensation structure by career level, class, and years of service
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium text-blue-800 dark:text-blue-300">
                                How the Pay Structure Works
                            </p>
                            <p className="text-blue-700/80 dark:text-blue-400/80 mt-1">
                                <strong>Class (A-F):</strong> Skill-based promotions with 10% increase per level.
                                <strong className="ml-2">Grade (1-9):</strong> Time-based with 3% increase every 2 years.
                                The "Anchor" salary (Class C, Grade 5) bridges to the next career level.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-3 h-auto p-1">
                    {tabConfig.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span className="font-medium">{tab.label}</span>
                                </div>
                                <span className="text-xs opacity-70">{tab.description}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {payTables.map((tableData) => (
                    <TabsContent key={tableData.careerLevel.code} value={tableData.careerLevel.code}>
                        <PayTable data={tableData} />
                    </TabsContent>
                ))}

                {payTables.length === 0 && (
                    <Card className="mt-6">
                        <CardContent className="p-12 text-center">
                            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                            <h3 className="text-lg font-semibold">No Pay Tables Found</h3>
                            <p className="text-muted-foreground mt-1">
                                The pay grade tables have not been configured yet.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </Tabs>
        </div>
    );
}
