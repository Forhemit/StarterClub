"use client";

/**
 * Wait Pool Dashboard
 * 
 * Manages promising candidates who weren't hired immediately
 * but are strong fits for future positions.
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search, Filter, RefreshCw, Users, Clock, Star,
    ArrowUpRight, Mail, Phone, Calendar, MoreHorizontal,
    ChevronUp, ChevronDown, Eye, UserPlus, Trash2,
    Sparkles, TrendingUp, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    getWaitPoolEntries,
    updateWaitPoolEntry,
    removeFromWaitPool,
    convertWaitPoolToCandidate,
} from "../interview-history/actions";
import type { WaitPoolEntry, WaitPoolFilters } from "@/types/hr/interview-history/types";
import {
    getWaitPoolStatusColor,
    getWaitPoolStatusBgColor,
    getPriorityColor,
    formatDate,
    formatRelativeTime,
    getDaysUntil,
    formatCandidateName,
    getInitials,
} from "@/utils/hr/interview-history/utils";

// ============================================
// WAIT POOL CARD COMPONENT
// ============================================

interface WaitPoolCardProps {
    entry: WaitPoolEntry;
    onView: (id: string) => void;
    onConvert: (id: string) => void;
    onContact: (id: string) => void;
    onUpdatePriority: (id: string, priority: number) => void;
    onRemove: (id: string) => void;
}

function WaitPoolCard({
    entry,
    onView,
    onConvert,
    onContact,
    onUpdatePriority,
    onRemove,
}: WaitPoolCardProps) {
    const candidate = entry.candidate;
    const daysUntilReview = entry.reviewDate ? getDaysUntil(entry.reviewDate) : null;
    const daysUntilExpiry = entry.expiryDate ? getDaysUntil(entry.expiryDate) : null;
    const isReviewDue = daysUntilReview !== null && daysUntilReview <= 7;
    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30;

    return (
        <Card className={cn(
            "group hover:shadow-lg transition-all duration-300",
            isReviewDue && "ring-2 ring-amber-500/50",
            isExpiringSoon && "ring-2 ring-red-500/50"
        )}>
            <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
                            "bg-gradient-to-br from-purple-500/20 to-violet-500/10 text-purple-600 dark:text-purple-400"
                        )}>
                            {candidate
                                ? getInitials(candidate.firstName, candidate.lastName)
                                : "??"
                            }
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">
                                {candidate
                                    ? formatCandidateName(candidate.firstName, candidate.lastName)
                                    : "Unknown Candidate"
                                }
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Originally applied for: <span className="font-medium">{entry.originalPosition}</span>
                            </p>
                        </div>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onUpdatePriority(entry.id, Math.min(10, entry.priorityScore + 1))}
                            >
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                            <span className={cn(
                                "text-xl font-bold",
                                getPriorityColor(entry.priorityScore)
                            )}>
                                {entry.priorityScore}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onUpdatePriority(entry.id, Math.max(1, entry.priorityScore - 1))}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <span className="text-xs text-muted-foreground uppercase">Priority</span>
                    </div>
                </div>

                {/* Reason Badge */}
                <div className="mt-4">
                    <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    >
                        {entry.poolReason.replace(/_/g, " ")}
                    </Badge>
                    {entry.poolReasonDetails && (
                        <p className="text-sm text-muted-foreground mt-2">
                            {entry.poolReasonDetails}
                        </p>
                    )}
                </div>

                {/* Skills */}
                {entry.skills && entry.skills.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                            {entry.skills.slice(0, 5).map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                            {entry.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                    +{entry.skills.length - 5} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Potential Positions */}
                {entry.potentialPositions && entry.potentialPositions.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                            Potential Positions
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {entry.potentialPositions.map((position, i) => (
                                <Badge key={i} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    {position}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Added {formatRelativeTime(entry.addedDate)}</span>
                        </div>
                        {entry.contactCount > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>Contacted {entry.contactCount}x</span>
                            </div>
                        )}
                    </div>

                    {/* Alerts */}
                    <div className="flex items-center gap-2">
                        {isReviewDue && (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-900/20">
                                <Clock className="h-3 w-3 mr-1" />
                                Review due
                            </Badge>
                        )}
                        {isExpiringSoon && (
                            <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 dark:bg-red-900/20">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Expires soon
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="default"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => onConvert(entry.id)}
                    >
                        <UserPlus className="h-4 w-4" />
                        Convert to Candidate
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => onContact(entry.id)}
                    >
                        <Mail className="h-4 w-4" />
                        Contact
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(entry.candidateId)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onRemove(entry.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from Pool
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// MAIN WAIT POOL PAGE
// ============================================

export default function WaitPoolPage() {
    const router = useRouter();
    const [entries, setEntries] = useState<WaitPoolEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"priority" | "addedDate" | "reviewDate">("priority");
    const [reasonFilter, setReasonFilter] = useState<string>("all");

    // Dialog states
    const [convertDialogOpen, setConvertDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
    const [newPosition, setNewPosition] = useState("");
    const [removeReason, setRemoveReason] = useState("");

    const loadData = useCallback(async () => {
        try {
            const filters: WaitPoolFilters = {
                status: ["active", "contacted"],
                sortBy,
                sortOrder: sortBy === "priority" ? "desc" : "asc",
                limit: 50,
            };

            if (reasonFilter !== "all") {
                filters.reason = reasonFilter as WaitPoolFilters["reason"];
            }

            const data = await getWaitPoolEntries(filters);
            setEntries(data);
        } catch (error) {
            console.error("Failed to load wait pool:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [sortBy, reasonFilter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
    };

    const handleViewCandidate = (candidateId: string) => {
        router.push(`/dashboard/hr/interview-history/${candidateId}`);
    };

    const handleConvert = (entryId: string) => {
        setSelectedEntryId(entryId);
        setConvertDialogOpen(true);
    };

    const handleConfirmConvert = async () => {
        if (!selectedEntryId || !newPosition) return;

        try {
            await convertWaitPoolToCandidate(selectedEntryId, newPosition);
            await loadData();
            setConvertDialogOpen(false);
            setNewPosition("");
            setSelectedEntryId(null);
        } catch (error) {
            console.error("Failed to convert:", error);
        }
    };

    const handleContact = async (entryId: string) => {
        // TODO: Open email composer or log contact
        console.log("Contact:", entryId);
    };

    const handleUpdatePriority = async (entryId: string, priority: number) => {
        try {
            await updateWaitPoolEntry(entryId, { priorityScore: priority });
            setEntries(prev =>
                prev.map(e =>
                    e.id === entryId ? { ...e, priorityScore: priority } : e
                )
            );
        } catch (error) {
            console.error("Failed to update priority:", error);
        }
    };

    const handleRemove = (entryId: string) => {
        setSelectedEntryId(entryId);
        setRemoveDialogOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (!selectedEntryId) return;

        try {
            await removeFromWaitPool(selectedEntryId, removeReason);
            await loadData();
            setRemoveDialogOpen(false);
            setRemoveReason("");
            setSelectedEntryId(null);
        } catch (error) {
            console.error("Failed to remove:", error);
        }
    };

    // Calculate stats
    const highPriorityCount = entries.filter(e => e.priorityScore >= 8).length;
    const reviewDueCount = entries.filter(e => {
        const daysUntil = e.reviewDate ? getDaysUntil(e.reviewDate) : null;
        return daysUntil !== null && daysUntil <= 7;
    }).length;
    const expiringSoonCount = entries.filter(e => {
        const daysUntil = e.expiryDate ? getDaysUntil(e.expiryDate) : null;
        return daysUntil !== null && daysUntil <= 30;
    }).length;

    // Filter entries by search
    const filteredEntries = entries.filter(entry => {
        if (!searchQuery) return true;
        const search = searchQuery.toLowerCase();
        const candidate = entry.candidate;
        if (!candidate) return false;
        return (
            candidate.firstName.toLowerCase().includes(search) ||
            candidate.lastName.toLowerCase().includes(search) ||
            candidate.email.toLowerCase().includes(search) ||
            entry.originalPosition.toLowerCase().includes(search) ||
            entry.skills?.some(s => s.toLowerCase().includes(search))
        );
    });

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Wait Pool</h1>
                            <p className="text-muted-foreground">
                                {entries.length} promising candidate{entries.length !== 1 ? "s" : ""} for future opportunities
                            </p>
                        </div>
                    </div>
                </div>
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
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total in Pool</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {entries.length}
                                </p>
                            </div>
                            <Sparkles className="h-8 w-8 text-purple-500/40" />
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "border-green-200 dark:border-green-800",
                    highPriorityCount > 0 && "bg-gradient-to-br from-green-500/10 to-emerald-500/5"
                )}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">High Priority</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {highPriorityCount}
                                </p>
                                <p className="text-xs text-muted-foreground">Score 8+</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500/40" />
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "border-amber-200 dark:border-amber-800",
                    (reviewDueCount > 0 || expiringSoonCount > 0) && "bg-gradient-to-br from-amber-500/10 to-orange-500/5"
                )}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Action Required</p>
                                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                    {reviewDueCount + expiringSoonCount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {reviewDueCount} reviews, {expiringSoonCount} expiring
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-amber-500/40" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, skills, or position..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="priority">Priority (High First)</SelectItem>
                        <SelectItem value="addedDate">Recently Added</SelectItem>
                        <SelectItem value="reviewDate">Review Date</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={reasonFilter} onValueChange={setReasonFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by reason" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reasons</SelectItem>
                        <SelectItem value="no_current_opening">No Current Opening</SelectItem>
                        <SelectItem value="great_fit_future">Great Future Fit</SelectItem>
                        <SelectItem value="budget_freeze">Budget Freeze</SelectItem>
                        <SelectItem value="timing">Timing</SelectItem>
                        <SelectItem value="overqualified">Overqualified</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Entries Grid */}
            {filteredEntries.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold">No candidates in wait pool</h3>
                        <p className="text-muted-foreground mt-1">
                            {searchQuery
                                ? "Try adjusting your search or filters"
                                : "Candidates added to the wait pool will appear here"
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredEntries.map(entry => (
                        <WaitPoolCard
                            key={entry.id}
                            entry={entry}
                            onView={handleViewCandidate}
                            onConvert={handleConvert}
                            onContact={handleContact}
                            onUpdatePriority={handleUpdatePriority}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>
            )}

            {/* Convert Dialog */}
            <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Convert to Active Candidate</DialogTitle>
                        <DialogDescription>
                            Re-enter this candidate into the hiring pipeline for a new position.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium">New Position</label>
                        <Input
                            placeholder="e.g., Senior Software Engineer"
                            value={newPosition}
                            onChange={(e) => setNewPosition(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmConvert}
                            disabled={!newPosition}
                            className="gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            Convert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Dialog */}
            <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove from Wait Pool</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this candidate from the wait pool?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium">Reason (optional)</label>
                        <Textarea
                            placeholder="Why are you removing this candidate?"
                            value={removeReason}
                            onChange={(e) => setRemoveReason(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmRemove}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
