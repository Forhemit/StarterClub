/**
 * HR Interview History Module - TypeScript Types
 * 
 * These types correspond to the database schema in 20251229100000_hr_interview_module.sql
 */

// ============================================
// ENUMS
// ============================================

export type CandidateStage =
    | 'applied'
    | 'screening'
    | 'phone_interview'
    | 'technical_interview'
    | 'onsite'
    | 'final_round'
    | 'offer'
    | 'hired'
    | 'rejected'
    | 'wait_pool'
    | 'withdrawn';

export type CandidateSource =
    | 'referral'
    | 'job_board'
    | 'website'
    | 'linkedin'
    | 'recruiter'
    | 'career_fair'
    | 'internal'
    | 'other';

export type RejectionCategory =
    | 'experience'
    | 'skills'
    | 'culture_fit'
    | 'salary'
    | 'timing'
    | 'background_check'
    | 'withdrew'
    | 'no_show'
    | 'other';

export type InterviewType =
    | 'phone_screen'
    | 'technical'
    | 'behavioral'
    | 'culture_fit'
    | 'executive'
    | 'panel'
    | 'case_study'
    | 'portfolio_review'
    | 'other';

export type InterviewStatus =
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show_candidate'
    | 'no_show_interviewer'
    | 'rescheduled';

export type InterviewRecommendation =
    | 'strong_hire'
    | 'hire'
    | 'lean_hire'
    | 'lean_no_hire'
    | 'no_hire';

export type OfferStatus =
    | 'draft'
    | 'pending_approval'
    | 'approved'
    | 'sent'
    | 'pending_response'
    | 'accepted'
    | 'declined'
    | 'expired'
    | 'rescinded'
    | 'converted';

export type EmploymentType =
    | 'full_time'
    | 'part_time'
    | 'contract'
    | 'intern'
    | 'seasonal';

export type PayFrequency =
    | 'hourly'
    | 'weekly'
    | 'biweekly'
    | 'monthly'
    | 'annually';

export type EquityType =
    | 'stock_options'
    | 'rsu'
    | 'phantom'
    | 'none';

export type WaitPoolReason =
    | 'no_current_opening'
    | 'great_fit_future'
    | 'budget_freeze'
    | 'timing'
    | 'overqualified'
    | 'underqualified_now'
    | 'location'
    | 'other';

export type WaitPoolStatus =
    | 'active'
    | 'contacted'
    | 'interviewing'
    | 'converted'
    | 'removed'
    | 'expired'
    | 'declined';

export type ContactMethod =
    | 'email'
    | 'phone'
    | 'linkedin'
    | 'other';

export type HRDecision = 'hire' | 'no_hire' | 'wait_pool';

// ============================================
// INTERFACES
// ============================================

export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    linkedinUrl?: string;

    // Position
    positionApplied: string;
    departmentId?: string;
    departmentName?: string; // Joined from departments table

    // Source
    source?: CandidateSource;
    sourceDetails?: string;
    referrerEmployeeId?: string;
    referrerName?: string; // Joined
    recruiterId?: string;

    // Documents
    resumeUrl?: string;
    coverLetterUrl?: string;
    portfolioUrl?: string;
    additionalDocsUrls?: string[];

    // Pipeline
    currentStage: CandidateStage;
    pipelineScore?: number;

    // Dates
    appliedDate: string;
    lastActivityDate?: string;

    // Decision
    finalDecision?: HRDecision;
    decisionDate?: string;
    decisionBy?: string;
    decisionByName?: string; // Joined
    rejectionReason?: string;
    rejectionCategory?: RejectionCategory;

    // Notes
    hrNotes?: string;
    hiringManagerNotes?: string;

    // Metadata
    createdBy?: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Interview {
    id: string;
    candidateId: string;
    candidate?: Candidate; // Joined

    // Details
    interviewType: InterviewType;
    interviewRound: number;
    interviewTitle?: string;

    // Scheduling
    scheduledDate: string;
    actualStartTime?: string;
    actualEndTime?: string;
    durationMinutes?: number;
    timezone: string;

    // Location
    locationType: 'virtual' | 'in_person' | 'hybrid';
    locationDetails?: string;
    meetingLink?: string;

    // Interviewers
    interviewerIds: string[];
    leadInterviewerId: string;
    interviewers?: { id: string; name: string; avatar?: string }[]; // Joined

    // Status
    status: InterviewStatus;
    cancellationReason?: string;
    rescheduledFromId?: string;

    // Outcome
    overallRating?: number;
    recommendation?: InterviewRecommendation;

    // Detailed ratings
    technicalRating?: number;
    communicationRating?: number;
    cultureFitRating?: number;
    problemSolvingRating?: number;

    // Feedback
    feedbackSummary?: string;
    strengths?: string[];
    concerns?: string[];

    // Notes
    privateNotes?: string;
    publicNotes?: string;
    followUpQuestions?: string[];

    // Metadata
    feedbackSubmittedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OfferCondition {
    type: string;
    description: string;
    status: 'pending' | 'passed' | 'failed' | 'waived';
    required: boolean;
    notes?: string;
    completedDate?: string;
}

export interface ConditionalOffer {
    id: string;
    candidateId: string;
    candidate?: Candidate; // Joined

    // Identification
    offerCode: string;
    offerVersion: number;

    // Position
    positionTitle: string;
    departmentId?: string;
    departmentName?: string; // Joined
    reportsToEmployeeId?: string;
    reportsToName?: string; // Joined
    employmentType: EmploymentType;

    // Compensation
    offeredSalary?: number;
    salaryCurrency: string;
    payFrequency: PayFrequency;

    // Bonus & Equity
    signingBonus?: number;
    targetBonusPercentage?: number;
    equityType?: EquityType;
    equityDetails?: string;

    // Benefits
    benefitsPackageId?: string;
    ptoDays?: number;

    // Conditions
    conditions: OfferCondition[];
    allConditionsMet: boolean;

    // Timeline
    offerDate: string;
    expiryDate?: string;
    responseDueDate?: string;

    // Status
    status: OfferStatus;

    // Response
    candidateResponseDate?: string;
    declineReason?: string;
    negotiationNotes?: string;

    // Start date
    proposedStartDate?: string;
    confirmedStartDate?: string;

    // Onboarding
    onboardingTriggered: boolean;
    onboardingLinkSentAt?: string;
    employeeId?: string;

    // Approval
    approvedBy?: string;
    approvalDate?: string;
    approvalNotes?: string;

    // Documents
    offerLetterUrl?: string;
    signedOfferUrl?: string;

    // Metadata
    createdBy: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WaitPoolEntry {
    id: string;
    candidateId: string;
    candidate?: Candidate; // Joined

    // Pool details
    poolReason: WaitPoolReason;
    poolReasonDetails?: string;
    originalPosition: string;
    potentialPositions?: string[];

    // Evaluation
    priorityScore: number;
    skills?: string[];
    experienceYears?: number;
    notes?: string;

    // Timeline
    addedDate: string;
    reviewDate?: string;
    expiryDate?: string;

    // Status
    status: WaitPoolStatus;
    removalReason?: string;

    // Contact tracking
    lastContactedDate?: string;
    contactCount: number;
    lastContactMethod?: ContactMethod;
    lastContactNotes?: string;

    // Conversion
    convertedToCandidateId?: string;
    convertedDate?: string;
    convertedPosition?: string;

    // Metadata
    createdBy: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface HRAuditLog {
    id: string;
    entityType: 'candidate' | 'interview' | 'offer' | 'wait_pool';
    entityId: string;
    action: string;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    performedBy: string;
    performedAt: string;
    ipAddress?: string;
    userAgent?: string;
    notes?: string;
}

// ============================================
// FILTER & INPUT TYPES
// ============================================

export interface CandidateFilters {
    search?: string;
    stage?: CandidateStage | CandidateStage[];
    departmentId?: string;
    source?: CandidateSource;
    decision?: HRDecision;
    dateFrom?: string;
    dateTo?: string;
    minScore?: number;
    maxScore?: number;
    sortBy?: 'appliedDate' | 'lastActivity' | 'name' | 'score';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface InterviewFilters {
    candidateId?: string;
    status?: InterviewStatus | InterviewStatus[];
    type?: InterviewType;
    dateFrom?: string;
    dateTo?: string;
    interviewerId?: string;
    hasRating?: boolean;
    limit?: number;
    offset?: number;
}

export interface OfferFilters {
    candidateId?: string;
    status?: OfferStatus | OfferStatus[];
    dateFrom?: string;
    dateTo?: string;
    departmentId?: string;
    limit?: number;
    offset?: number;
}

export interface WaitPoolFilters {
    status?: WaitPoolStatus | WaitPoolStatus[];
    reason?: WaitPoolReason;
    skills?: string[];
    minPriority?: number;
    reviewDueBefore?: string;
    expiringBefore?: string;
    sortBy?: 'priority' | 'addedDate' | 'reviewDate';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface CreateCandidateInput {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    linkedinUrl?: string;
    positionApplied: string;
    departmentId?: string;
    source?: CandidateSource;
    sourceDetails?: string;
    referrerEmployeeId?: string;
    recruiterId?: string;
    resumeUrl?: string;
    coverLetterUrl?: string;
    portfolioUrl?: string;
}

export interface CreateInterviewInput {
    candidateId: string;
    interviewType: InterviewType;
    interviewRound?: number;
    interviewTitle?: string;
    scheduledDate: string;
    durationMinutes?: number;
    timezone?: string;
    locationType?: 'virtual' | 'in_person' | 'hybrid';
    locationDetails?: string;
    meetingLink?: string;
    interviewerIds: string[];
    leadInterviewerId: string;
}

export interface SubmitFeedbackInput {
    overallRating: number;
    recommendation: InterviewRecommendation;
    technicalRating?: number;
    communicationRating?: number;
    cultureFitRating?: number;
    problemSolvingRating?: number;
    feedbackSummary?: string;
    strengths?: string[];
    concerns?: string[];
    publicNotes?: string;
    privateNotes?: string;
    followUpQuestions?: string[];
}

export interface CreateOfferInput {
    candidateId: string;
    positionTitle: string;
    departmentId?: string;
    reportsToEmployeeId?: string;
    employmentType?: EmploymentType;
    offeredSalary?: number;
    salaryCurrency?: string;
    payFrequency?: PayFrequency;
    signingBonus?: number;
    targetBonusPercentage?: number;
    equityType?: EquityType;
    equityDetails?: string;
    benefitsPackageId?: string;
    ptoDays?: number;
    conditions?: Omit<OfferCondition, 'completedDate'>[];
    expiryDate?: string;
    responseDueDate?: string;
    proposedStartDate?: string;
}

export interface AddToWaitPoolInput {
    candidateId: string;
    poolReason: WaitPoolReason;
    poolReasonDetails?: string;
    originalPosition: string;
    potentialPositions?: string[];
    priorityScore?: number;
    skills?: string[];
    experienceYears?: number;
    notes?: string;
    reviewDate?: string;
}

// ============================================
// UI HELPER TYPES
// ============================================

export interface PipelineStageInfo {
    stage: CandidateStage;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
    order: number;
}

export interface RecommendationInfo {
    recommendation: InterviewRecommendation;
    label: string;
    color: string;
    bgColor: string;
    icon: string;
}

export interface InterviewTypeInfo {
    type: InterviewType;
    label: string;
    icon: string;
    defaultDuration: number;
}

export interface HRMetrics {
    totalCandidates: number;
    candidatesByStage: Record<CandidateStage, number>;
    pendingInterviews: number;
    completedInterviewsThisWeek: number;
    activeOffers: number;
    offersAcceptedThisMonth: number;
    waitPoolSize: number;
    averageTimeToHire: number; // in days
    offerAcceptanceRate: number; // percentage
}

export interface HRAchievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    progress?: number;
    target?: number;
}

export interface HRStreak {
    type: 'interview_completion' | 'feedback_submitted' | 'decision_made';
    count: number;
    lastDate: string;
}
