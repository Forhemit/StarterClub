"use client";

/**
 * Candidate Detail View Component
 * 
 * Displays complete candidate profile with interview history,
 * documents, notes, and action buttons.
 */

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Mail, Phone, Linkedin, FileText, ExternalLink,
    Calendar, Clock, Star, CheckCircle2, XCircle, Users,
    MessageSquare, Paperclip, Edit, MoreHorizontal, Send,
    Building2, MapPin, Briefcase, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    getCandidateById,
    getInterviewsForCandidate,
    getOffersForCandidate,
    makeHireDecision,
    updateCandidateStage,
} from "../actions";
import type {
    Candidate,
    Interview,
    ConditionalOffer,
    CandidateStage,
    HRDecision,
} from "@/types/hr/interview-history/types";
import {
    getStageInfo,
    getRecommendationInfo,
    getInterviewTypeInfo,
    getOfferStatusColor,
    getOfferStatusBgColor,
    getOfferStatusLabel,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatCurrency,
    formatPhoneNumber,
    getRatingColor,
    getInitials,
} from "@/utils/hr/interview-history/utils";

// ============================================
// INTERVIEW TIMELINE COMPONENT
// ============================================

interface InterviewTimelineProps {
    interviews: Interview[];
}

function InterviewTimeline({ interviews }: InterviewTimelineProps) {
    if (interviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Calendar className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium">No interviews scheduled</p>
                <p className="text-sm">Schedule the first interview to get started</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
                {interviews.map((interview, index) => {
                    const typeInfo = getInterviewTypeInfo(interview.interviewType);
                    const isCompleted = interview.status === "completed";
                    const isCancelled = interview.status === "cancelled" || interview.status.includes("no_show");
                    const recInfo = interview.recommendation
                        ? getRecommendationInfo(interview.recommendation)
                        : null;

                    return (
                        <div key={interview.id} className="relative pl-14">
                            {/* Timeline node */}
                            <div
                                className={cn(
                                    "absolute left-4 w-5 h-5 rounded-full border-2 bg-background",
                                    isCompleted
                                        ? "border-green-500 bg-green-500"
                                        : isCancelled
                                            ? "border-red-500 bg-red-500"
                                            : "border-primary"
                                )}
                            >
                                {isCompleted && <CheckCircle2 className="h-3 w-3 text-white absolute -top-0.5 -left-0.5" />}
                                {isCancelled && <XCircle className="h-3 w-3 text-white absolute -top-0.5 -left-0.5" />}
                            </div>

                            <Card className={cn(
                                "transition-all duration-200 hover:shadow-md",
                                isCancelled && "opacity-60"
                            )}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-lg">{typeInfo.icon}</span>
                                                <h4 className="font-semibold">
                                                    {interview.interviewTitle || typeInfo.label}
                                                </h4>
                                                <Badge variant="outline" className="text-xs">
                                                    Round {interview.interviewRound}
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "text-xs",
                                                        isCompleted && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                                        isCancelled && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    )}
                                                >
                                                    {interview.status.replace(/_/g, " ")}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDateTime(interview.scheduledDate)}
                                                </span>
                                                {interview.durationMinutes && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {interview.durationMinutes} min
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {interview.locationType === "virtual" ? "Virtual" : interview.locationDetails || "Office"}
                                                </span>
                                            </div>

                                            {/* Rating & Recommendation */}
                                            {isCompleted && interview.overallRating && (
                                                <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={cn(
                                                                    "h-4 w-4",
                                                                    star <= interview.overallRating!
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-muted-foreground"
                                                                )}
                                                            />
                                                        ))}
                                                        <span className={cn("ml-1 font-medium", getRatingColor(interview.overallRating))}>
                                                            {interview.overallRating}/5
                                                        </span>
                                                    </div>
                                                    {recInfo && (
                                                        <Badge className={cn("font-medium", recInfo.bgColor, recInfo.color)}>
                                                            {recInfo.icon} {recInfo.label}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Feedback Summary */}
                                            {interview.feedbackSummary && (
                                                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                                    {interview.feedbackSummary}
                                                </p>
                                            )}

                                            {/* Strengths & Concerns */}
                                            {(interview.strengths?.length || interview.concerns?.length) && (
                                                <div className="flex flex-wrap gap-4 mt-3">
                                                    {interview.strengths && interview.strengths.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-green-600 font-medium">Strengths:</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {interview.strengths.slice(0, 3).map((s, i) => (
                                                                    <Badge key={i} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 border-green-200">
                                                                        {s}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {interview.concerns && interview.concerns.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-amber-600 font-medium">Concerns:</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {interview.concerns.slice(0, 3).map((c, i) => (
                                                                    <Badge key={i} variant="outline" className="text-xs bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                                                                        {c}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Interviewers */}
                                        <div className="flex -space-x-2">
                                            {interview.interviewerIds.slice(0, 3).map((id, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                                                    title={id}
                                                >
                                                    {id.slice(0, 2).toUpperCase()}
                                                </div>
                                            ))}
                                            {interview.interviewerIds.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                                                    +{interview.interviewerIds.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================
// DECISION PANEL COMPONENT
// ============================================

interface DecisionPanelProps {
    candidate: Candidate;
    onDecision: (decision: HRDecision, reason?: string) => Promise<void>;
}

function DecisionPanel({ candidate, onDecision }: DecisionPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [decision, setDecision] = useState<HRDecision | null>(null);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    const handleSubmit = async () => {
        if (!decision) return;
        setIsSubmitting(true);
        try {
            await onDecision(decision, reason);
            if (decision === "hire") {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 3000);
            }
            setIsOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Already decided
    if (candidate.finalDecision) {
        const decisionInfo = {
            hire: { label: "Hired", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30", icon: "🎉" },
            no_hire: { label: "Not Hired", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30", icon: "❌" },
            wait_pool: { label: "Wait Pool", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30", icon: "⏳" },
        }[candidate.finalDecision];

        return (
            <Card className={cn("border-2", decisionInfo.bgColor.replace("bg-", "border-").split(" ")[0])}>
                <CardContent className="p-6 text-center">
                    <span className="text-4xl">{decisionInfo.icon}</span>
                    <h3 className={cn("text-xl font-bold mt-2", decisionInfo.color)}>
                        {decisionInfo.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Decision made on {formatDate(candidate.decisionDate)}
                    </p>
                    {candidate.rejectionReason && (
                        <p className="text-sm mt-2 p-2 bg-muted rounded">
                            Reason: {candidate.rejectionReason}
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/* Celebration Animation */}
            {showCelebration && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <div className="text-8xl animate-bounce">🎉</div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Make Decision</CardTitle>
                    <CardDescription>
                        Record your final hiring decision for this candidate
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <Button
                            variant="outline"
                            className="h-24 flex-col gap-2 group hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                            onClick={() => {
                                setDecision("hire");
                                setIsOpen(true);
                            }}
                        >
                            <span className="text-3xl group-hover:scale-125 transition-transform">✅</span>
                            <span className="font-semibold text-green-600">Hire</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-24 flex-col gap-2 group hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                            onClick={() => {
                                setDecision("wait_pool");
                                setIsOpen(true);
                            }}
                        >
                            <span className="text-3xl group-hover:scale-125 transition-transform">⏳</span>
                            <span className="font-semibold text-purple-600">Wait Pool</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-24 flex-col gap-2 group hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                            onClick={() => {
                                setDecision("no_hire");
                                setIsOpen(true);
                            }}
                        >
                            <span className="text-3xl group-hover:scale-125 transition-transform">❌</span>
                            <span className="font-semibold text-red-600">No Hire</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Confirm Decision: {decision === "hire" ? "Hire" : decision === "wait_pool" ? "Add to Wait Pool" : "Do Not Hire"}
                        </DialogTitle>
                        <DialogDescription>
                            This action will update the candidate's status and send appropriate notifications.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {decision === "no_hire" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rejection Reason</label>
                                <Textarea
                                    placeholder="Please provide a reason for not hiring this candidate..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        )}
                        {decision === "wait_pool" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea
                                    placeholder="Why is this candidate a good fit for future positions?"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        )}
                        {decision === "hire" && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                <span className="text-4xl mb-2 block">🎉</span>
                                <p className="font-medium text-green-700 dark:text-green-400">
                                    Great choice! The next step is to create an offer.
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || (decision === "no_hire" && !reason)}
                            className={cn(
                                decision === "hire" && "bg-green-600 hover:bg-green-700",
                                decision === "no_hire" && "bg-red-600 hover:bg-red-700",
                                decision === "wait_pool" && "bg-purple-600 hover:bg-purple-700"
                            )}
                        >
                            {isSubmitting ? "Saving..." : "Confirm Decision"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ============================================
// MAIN CANDIDATE DETAIL PAGE
// ============================================

export default function CandidateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const candidateId = params?.id as string;

    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [offers, setOffers] = useState<ConditionalOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        async function loadData() {
            if (!candidateId) return;

            try {
                const [candidateData, interviewsData, offersData] = await Promise.all([
                    getCandidateById(candidateId),
                    getInterviewsForCandidate(candidateId),
                    getOffersForCandidate(candidateId),
                ]);

                setCandidate(candidateData);
                setInterviews(interviewsData);
                setOffers(offersData);
            } catch (error) {
                console.error("Failed to load candidate:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [candidateId]);

    const handleDecision = async (decision: HRDecision, reason?: string) => {
        await makeHireDecision(candidateId, decision, reason);
        // Reload candidate data
        const updatedCandidate = await getCandidateById(candidateId);
        setCandidate(updatedCandidate);
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-96" />
                    </div>
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="p-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Card>
                    <CardContent className="p-12 text-center">
                        <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">Candidate Not Found</h2>
                        <p className="text-muted-foreground mt-2">
                            The candidate you're looking for doesn't exist or has been removed.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stageInfo = getStageInfo(candidate.currentStage);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                            {getInitials(candidate.firstName, candidate.lastName)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {candidate.firstName} {candidate.lastName}
                            </h1>
                            <p className="text-muted-foreground">{candidate.positionApplied}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className={cn(stageInfo.bgColor, stageInfo.color)}>
                                    {stageInfo.icon} {stageInfo.label}
                                </Badge>
                                {candidate.pipelineScore !== undefined && (
                                    <Badge variant="outline">
                                        Score: {candidate.pipelineScore}/100
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule Interview
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Send className="h-4 w-4" />
                        Send Email
                    </Button>
                    <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact & Details Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                                    <a href={`mailto:${candidate.email}`} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                        <Mail className="h-4 w-4" />
                                        {candidate.email}
                                    </a>
                                </div>
                                {candidate.phone && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                                        <a href={`tel:${candidate.phone}`} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                            <Phone className="h-4 w-4" />
                                            {formatPhoneNumber(candidate.phone)}
                                        </a>
                                    </div>
                                )}
                                {candidate.linkedinUrl && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">LinkedIn</p>
                                        <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                            Profile
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Applied</p>
                                    <p className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(candidate.appliedDate)}
                                    </p>
                                </div>
                            </div>

                            {/* Documents */}
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Documents</p>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.resumeUrl && (
                                        <a
                                            href={candidate.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                                        >
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            Resume
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </a>
                                    )}
                                    {candidate.coverLetterUrl && (
                                        <a
                                            href={candidate.coverLetterUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                                        >
                                            <FileText className="h-4 w-4 text-green-500" />
                                            Cover Letter
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </a>
                                    )}
                                    {candidate.portfolioUrl && (
                                        <a
                                            href={candidate.portfolioUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                                        >
                                            <Briefcase className="h-4 w-4 text-purple-500" />
                                            Portfolio
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </a>
                                    )}
                                    {!candidate.resumeUrl && !candidate.coverLetterUrl && !candidate.portfolioUrl && (
                                        <p className="text-sm text-muted-foreground">No documents uploaded</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="overview" className="gap-2">
                                <Users className="h-4 w-4" />
                                Interviews ({interviews.length})
                            </TabsTrigger>
                            <TabsTrigger value="offers" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Offers ({offers.length})
                            </TabsTrigger>
                            <TabsTrigger value="notes" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Notes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Interview Timeline</CardTitle>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Schedule New
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <InterviewTimeline interviews={interviews} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="offers" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Offers</CardTitle>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <FileText className="h-4 w-4" />
                                            Create Offer
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {offers.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <FileText className="h-10 w-10 mb-3 opacity-40" />
                                            <p className="font-medium">No offers yet</p>
                                            <p className="text-sm">Create an offer once you decide to hire</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {offers.map((offer) => (
                                                <Card key={offer.id} className="bg-muted/50">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-semibold">{offer.positionTitle}</h4>
                                                                    <Badge className={cn(getOfferStatusBgColor(offer.status), getOfferStatusColor(offer.status))}>
                                                                        {getOfferStatusLabel(offer.status)}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Offer Code: <code className="bg-background px-1 rounded">{offer.offerCode}</code>
                                                                </p>
                                                                <div className="flex items-center gap-4 mt-2 text-sm">
                                                                    {offer.offeredSalary && (
                                                                        <span className="font-medium">{formatCurrency(offer.offeredSalary, offer.salaryCurrency)}</span>
                                                                    )}
                                                                    <span className="text-muted-foreground">Sent {formatRelativeTime(offer.offerDate)}</span>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm">
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {candidate.hrNotes && (
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">HR Notes</p>
                                            <p className="text-sm bg-muted p-3 rounded-lg">{candidate.hrNotes}</p>
                                        </div>
                                    )}
                                    {candidate.hiringManagerNotes && (
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Hiring Manager Notes</p>
                                            <p className="text-sm bg-muted p-3 rounded-lg">{candidate.hiringManagerNotes}</p>
                                        </div>
                                    )}
                                    {!candidate.hrNotes && !candidate.hiringManagerNotes && (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
                                            <p className="font-medium">No notes yet</p>
                                            <Button variant="outline" size="sm" className="mt-3">
                                                Add Note
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Decision Panel */}
                    <DecisionPanel candidate={candidate} onDecision={handleDecision} />

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Interviews</span>
                                <span className="font-semibold">{interviews.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <span className="font-semibold text-green-600">
                                    {interviews.filter((i) => i.status === "completed").length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avg. Rating</span>
                                <span className="font-semibold">
                                    {interviews.filter((i) => i.overallRating).length > 0
                                        ? (
                                            interviews
                                                .filter((i) => i.overallRating)
                                                .reduce((acc, i) => acc + (i.overallRating || 0), 0) /
                                            interviews.filter((i) => i.overallRating).length
                                        ).toFixed(1)
                                        : "—"}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Days in Pipeline</span>
                                <span className="font-semibold">
                                    {Math.floor(
                                        (new Date().getTime() - new Date(candidate.appliedDate).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Source</span>
                                <Badge variant="outline" className="capitalize">
                                    {candidate.source?.replace(/_/g, " ") || "Unknown"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-muted-foreground">Last activity</span>
                                    <span className="ml-auto font-medium">
                                        {formatRelativeTime(candidate.lastActivityDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-muted-foreground">Applied</span>
                                    <span className="ml-auto font-medium">
                                        {formatRelativeTime(candidate.appliedDate)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
