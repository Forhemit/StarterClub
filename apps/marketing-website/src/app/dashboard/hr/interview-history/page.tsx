"use client";

/**
 * HR Interview Pipeline Dashboard
 * 
 * Main page for viewing and managing the hiring pipeline, candidates,
 * and interview history with gamification elements.
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search, Filter, Plus, Users, FileText, Clock,
    CheckCircle2, XCircle, Hourglass, TrendingUp,
    RefreshCw, Download, MoreHorizontal, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getCandidates, getHRMetrics } from "./actions";
import type { Candidate, CandidateStage, HRMetrics, CandidateFilters } from "@/types/hr/interview-history/types";
import {
    getStageInfo,
    getStageLabel,
    getStageBgColor,
    getStageColor,
    getStageIcon,
    getActivePipelineStages,
    formatDate,
    formatRelativeTime,
    getDaysSince,
    getScoreColor,
    formatCandidateName,
    getInitials,
} from "@/utils/hr/interview-history/utils";
import { AddCandidateDialog } from "./AddCandidateDialog";

// ============================================
// METRIC CARD COMPONENT
// ============================================

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: number;
    color?: "green" | "blue" | "amber" | "purple" | "red";
}

function MetricCard({ title, value, subtitle, icon, trend, color = "blue" }: MetricCardProps) {
    const colorClasses = {
        green: "from-green-500 to-emerald-600",
        blue: "from-blue-500 to-indigo-600",
        amber: "from-amber-500 to-orange-600",
        purple: "from-purple-500 to-violet-600",
        red: "from-red-500 to-rose-600",
    };

    return (
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className={cn(
                "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity",
                `bg-gradient-to-br ${colorClasses[color]}`
            )} />
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                        <p className="text-3xl font-bold mt-1 bg-gradient-to-r bg-clip-text text-transparent from-foreground to-foreground/80">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className={cn(
                        "p-2.5 rounded-xl bg-gradient-to-br text-white shadow-lg",
                        colorClasses[color]
                    )}>
                        {icon}
                    </div>
                </div>
                {trend !== undefined && (
                    <div className="flex items-center gap-1 mt-3">
                        <TrendingUp className={cn("h-3 w-3", trend >= 0 ? "text-green-500" : "text-red-500 rotate-180")} />
                        <span className={cn("text-xs font-medium", trend >= 0 ? "text-green-500" : "text-red-500")}>
                            {trend >= 0 ? "+" : ""}{trend}%
                        </span>
                        <span className="text-xs text-muted-foreground">vs last week</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================
// PIPELINE STAGE TABS
// ============================================

interface PipelineTabsProps {
    stages: CandidateStage[];
    counts: Record<CandidateStage, number>;
    activeStage: CandidateStage | "all";
    onStageChange: (stage: CandidateStage | "all") => void;
}

function PipelineTabs({ stages, counts, activeStage, onStageChange }: PipelineTabsProps) {
    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-xl">
            <button
                onClick={() => onStageChange("all")}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeStage === "all"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
            >
                All <span className="ml-1.5 text-xs opacity-70">({totalCount})</span>
            </button>
            {stages.map((stage) => {
                const info = getStageInfo(stage);
                const count = counts[stage] || 0;
                return (
                    <button
                        key={stage}
                        onClick={() => onStageChange(stage)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            activeStage === stage
                                ? `${info.bgColor} ${info.color} shadow-sm`
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <span>{info.icon}</span>
                        <span>{info.label}</span>
                        {count > 0 && (
                            <span className="text-xs opacity-70">({count})</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ============================================
// CANDIDATE TABLE ROW
// ============================================

interface CandidateRowProps {
    candidate: Candidate;
    onView: (id: string) => void;
    onStageChange: (id: string, stage: CandidateStage) => void;
}

function CandidateRow({ candidate, onView, onStageChange }: CandidateRowProps) {
    const stageInfo = getStageInfo(candidate.currentStage);
    const daysSinceApplied = getDaysSince(candidate.appliedDate);
    const daysSinceActivity = getDaysSince(candidate.lastActivityDate);

    return (
        <TableRow className="group hover:bg-muted/50 transition-colors">
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                        "bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
                    )}>
                        {getInitials(candidate.firstName, candidate.lastName)}
                    </div>
                    <div>
                        <p className="font-medium text-foreground">
                            {formatCandidateName(candidate.firstName, candidate.lastName)}
                        </p>
                        <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <p className="font-medium text-sm">{candidate.positionApplied}</p>
                {candidate.departmentName && (
                    <p className="text-xs text-muted-foreground">{candidate.departmentName}</p>
                )}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="secondary"
                        className={cn(
                            "font-medium",
                            stageInfo.bgColor,
                            stageInfo.color
                        )}
                    >
                        {stageInfo.icon} {stageInfo.label}
                    </Badge>
                </div>
            </TableCell>
            <TableCell>
                {candidate.pipelineScore !== undefined ? (
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    candidate.pipelineScore >= 80
                                        ? "bg-green-500"
                                        : candidate.pipelineScore >= 60
                                            ? "bg-emerald-500"
                                            : candidate.pipelineScore >= 40
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                )}
                                style={{ width: `${candidate.pipelineScore}%` }}
                            />
                        </div>
                        <span className={cn("text-sm font-medium", getScoreColor(candidate.pipelineScore))}>
                            {candidate.pipelineScore}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                )}
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <p>{formatDate(candidate.appliedDate)}</p>
                    <p className="text-xs text-muted-foreground">
                        {daysSinceApplied} days ago
                    </p>
                </div>
            </TableCell>
            <TableCell>
                <p className="text-sm text-muted-foreground">
                    {formatRelativeTime(candidate.lastActivityDate)}
                </p>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(candidate.id)}
                        className="h-8 w-8 p-0"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onView(candidate.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onStageChange(candidate.id, "screening")}>
                                Move to Screening
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStageChange(candidate.id, "phone_interview")}>
                                Schedule Phone Screen
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStageChange(candidate.id, "rejected")} className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function InterviewHistoryPage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [metrics, setMetrics] = useState<HRMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStage, setActiveStage] = useState<CandidateStage | "all">("all");
    const [sortBy, setSortBy] = useState<"appliedDate" | "name" | "score">("appliedDate");

    const loadData = useCallback(async () => {
        try {
            const filters: CandidateFilters = {
                search: searchQuery || undefined,
                stage: activeStage !== "all" ? activeStage : undefined,
                sortBy,
                sortOrder: sortBy === "score" ? "desc" : "desc",
                limit: 50,
            };

            const [candidatesData, metricsData] = await Promise.all([
                getCandidates(filters),
                getHRMetrics(),
            ]);

            setCandidates(candidatesData);
            setMetrics(metricsData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchQuery, activeStage, sortBy]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
    };

    const handleViewCandidate = (id: string) => {
        router.push(`/dashboard/hr/interview-history/${id}`);
    };

    const handleStageChange = async (id: string, stage: CandidateStage) => {
        // TODO: Implement with server action
        console.log("Stage change:", id, stage);
        await loadData();
    };

    const activePipelineStages = getActivePipelineStages();

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Interview Pipeline
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track candidates and manage your hiring process
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="gap-2"
                    >
                        <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                        Refresh
                    </Button>
                    <AddCandidateDialog onSuccess={handleRefresh} />
                </div>
            </div>

            {/* Metrics Grid */}
            {metrics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Candidates"
                        value={metrics.totalCandidates}
                        subtitle="In pipeline"
                        icon={<Users className="h-5 w-5" />}
                        color="blue"
                    />
                    <MetricCard
                        title="Pending Interviews"
                        value={metrics.pendingInterviews}
                        subtitle={`${metrics.completedInterviewsThisWeek} completed this week`}
                        icon={<Clock className="h-5 w-5" />}
                        color="amber"
                        trend={12}
                    />
                    <MetricCard
                        title="Active Offers"
                        value={metrics.activeOffers}
                        subtitle={`${metrics.offersAcceptedThisMonth} accepted this month`}
                        icon={<FileText className="h-5 w-5" />}
                        color="green"
                    />
                    <MetricCard
                        title="Wait Pool"
                        value={metrics.waitPoolSize}
                        subtitle="Promising candidates"
                        icon={<Hourglass className="h-5 w-5" />}
                        color="purple"
                    />
                </div>
            )}

            {/* Pipeline Progress */}
            {metrics && (
                <Card className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium">Pipeline Distribution</p>
                            <p className="text-xs text-muted-foreground">
                                {metrics.offerAcceptanceRate}% offer acceptance rate
                            </p>
                        </div>
                        <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                            {activePipelineStages.map((stage) => {
                                const count = metrics.candidatesByStage[stage] || 0;
                                const percentage = metrics.totalCandidates > 0
                                    ? (count / metrics.totalCandidates) * 100
                                    : 0;
                                const info = getStageInfo(stage);

                                if (percentage === 0) return null;

                                return (
                                    <div
                                        key={stage}
                                        className={cn(
                                            "h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full",
                                            info.color.replace("text-", "bg-").split(" ")[0]
                                        )}
                                        style={{ width: `${percentage}%` }}
                                        title={`${info.label}: ${count} (${percentage.toFixed(1)}%)`}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3">
                            {activePipelineStages.map((stage) => {
                                const count = metrics.candidatesByStage[stage] || 0;
                                const info = getStageInfo(stage);

                                if (count === 0) return null;

                                return (
                                    <div key={stage} className="flex items-center gap-1.5 text-xs">
                                        <div className={cn("w-2 h-2 rounded-full", info.color.replace("text-", "bg-").split(" ")[0])} />
                                        <span className="text-muted-foreground">{info.label}</span>
                                        <span className="font-medium">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search candidates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="appliedDate">Applied Date</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="score">Score</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Pipeline Stage Tabs */}
            {metrics && (
                <PipelineTabs
                    stages={[...activePipelineStages, "hired", "rejected", "wait_pool"]}
                    counts={metrics.candidatesByStage}
                    activeStage={activeStage}
                    onStageChange={setActiveStage}
                />
            )}

            {/* Candidates Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[280px]">Candidate</TableHead>
                                <TableHead className="w-[200px]">Position</TableHead>
                                <TableHead className="w-[140px]">Stage</TableHead>
                                <TableHead className="w-[120px]">Score</TableHead>
                                <TableHead className="w-[140px]">Applied</TableHead>
                                <TableHead className="w-[140px]">Last Activity</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Users className="h-10 w-10 opacity-40" />
                                            <p className="font-medium">No candidates found</p>
                                            <p className="text-sm">Try adjusting your filters or add a new candidate</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                candidates.map((candidate) => (
                                    <CandidateRow
                                        key={candidate.id}
                                        candidate={candidate}
                                        onView={handleViewCandidate}
                                        onStageChange={handleStageChange}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Quick Stats Footer */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                    Showing {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
                    {activeStage !== "all" && ` in ${getStageLabel(activeStage)}`}
                </p>
                <p>
                    Avg. time to hire: <span className="font-medium text-foreground">{metrics?.averageTimeToHire || 0} days</span>
                </p>
            </div>
        </div>
    );
}
