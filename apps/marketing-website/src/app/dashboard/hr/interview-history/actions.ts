"use server";

/**
 * HR Interview History Module - Server Actions
 * 
 * Server-side actions for managing candidates, interviews, offers, and wait pool
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type {
    Candidate,
    Interview,
    ConditionalOffer,
    WaitPoolEntry,
    CandidateFilters,
    InterviewFilters,
    OfferFilters,
    WaitPoolFilters,
    CreateCandidateInput,
    CreateInterviewInput,
    SubmitFeedbackInput,
    CreateOfferInput,
    AddToWaitPoolInput,
    CandidateStage,
    OfferStatus,
    HRDecision,
    HRMetrics,
} from "@/types/hr/interview-history/types";
import { generateOfferCode } from "@/utils/hr/interview-history/utils";

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getAuthUserId(): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized: User not authenticated");
    }
    return userId;
}

function mapCandidateRow(row: Record<string, unknown>): Candidate {
    return {
        id: row.id as string,
        firstName: row.first_name as string,
        lastName: row.last_name as string,
        email: row.email as string,
        phone: row.phone as string | undefined,
        linkedinUrl: row.linkedin_url as string | undefined,
        positionApplied: row.position_applied as string,
        departmentId: row.department_id as string | undefined,
        departmentName: (row.departments as Record<string, unknown>)?.department_name as string | undefined,
        source: row.source as Candidate["source"],
        sourceDetails: row.source_details as string | undefined,
        referrerEmployeeId: row.referrer_employee_id as string | undefined,
        recruiterId: row.recruiter_id as string | undefined,
        resumeUrl: row.resume_url as string | undefined,
        coverLetterUrl: row.cover_letter_url as string | undefined,
        portfolioUrl: row.portfolio_url as string | undefined,
        additionalDocsUrls: row.additional_docs_urls as string[] | undefined,
        currentStage: row.current_stage as CandidateStage,
        pipelineScore: row.pipeline_score as number | undefined,
        appliedDate: row.applied_date as string,
        lastActivityDate: row.last_activity_date as string | undefined,
        finalDecision: row.final_decision as HRDecision | undefined,
        decisionDate: row.decision_date as string | undefined,
        decisionBy: row.decision_by as string | undefined,
        rejectionReason: row.rejection_reason as string | undefined,
        rejectionCategory: row.rejection_category as Candidate["rejectionCategory"],
        hrNotes: row.hr_notes as string | undefined,
        hiringManagerNotes: row.hiring_manager_notes as string | undefined,
        createdBy: row.created_by as string | undefined,
        updatedBy: row.updated_by as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

function mapInterviewRow(row: Record<string, unknown>): Interview {
    return {
        id: row.id as string,
        candidateId: row.candidate_id as string,
        interviewType: row.interview_type as Interview["interviewType"],
        interviewRound: row.interview_round as number,
        interviewTitle: row.interview_title as string | undefined,
        scheduledDate: row.scheduled_date as string,
        actualStartTime: row.actual_start_time as string | undefined,
        actualEndTime: row.actual_end_time as string | undefined,
        durationMinutes: row.duration_minutes as number | undefined,
        timezone: row.timezone as string,
        locationType: row.location_type as Interview["locationType"],
        locationDetails: row.location_details as string | undefined,
        meetingLink: row.meeting_link as string | undefined,
        interviewerIds: row.interviewer_ids as string[],
        leadInterviewerId: row.lead_interviewer_id as string,
        status: row.status as Interview["status"],
        cancellationReason: row.cancellation_reason as string | undefined,
        rescheduledFromId: row.rescheduled_from_id as string | undefined,
        overallRating: row.overall_rating as number | undefined,
        recommendation: row.recommendation as Interview["recommendation"],
        technicalRating: row.technical_rating as number | undefined,
        communicationRating: row.communication_rating as number | undefined,
        cultureFitRating: row.culture_fit_rating as number | undefined,
        problemSolvingRating: row.problem_solving_rating as number | undefined,
        feedbackSummary: row.feedback_summary as string | undefined,
        strengths: row.strengths as string[] | undefined,
        concerns: row.concerns as string[] | undefined,
        privateNotes: row.private_notes as string | undefined,
        publicNotes: row.public_notes as string | undefined,
        followUpQuestions: row.follow_up_questions as string[] | undefined,
        feedbackSubmittedAt: row.feedback_submitted_at as string | undefined,
        createdBy: row.created_by as string | undefined,
        updatedBy: row.updated_by as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

function mapOfferRow(row: Record<string, unknown>): ConditionalOffer {
    return {
        id: row.id as string,
        candidateId: row.candidate_id as string,
        offerCode: row.offer_code as string,
        offerVersion: row.offer_version as number,
        positionTitle: row.position_title as string,
        departmentId: row.department_id as string | undefined,
        departmentName: (row.departments as Record<string, unknown>)?.department_name as string | undefined,
        reportsToEmployeeId: row.reports_to_employee_id as string | undefined,
        employmentType: row.employment_type as ConditionalOffer["employmentType"],
        offeredSalary: row.offered_salary as number | undefined,
        salaryCurrency: row.salary_currency as string,
        payFrequency: row.pay_frequency as ConditionalOffer["payFrequency"],
        signingBonus: row.signing_bonus as number | undefined,
        targetBonusPercentage: row.target_bonus_percentage as number | undefined,
        equityType: row.equity_type as ConditionalOffer["equityType"],
        equityDetails: row.equity_details as string | undefined,
        benefitsPackageId: row.benefits_package_id as string | undefined,
        ptoDays: row.pto_days as number | undefined,
        conditions: (row.conditions as ConditionalOffer["conditions"]) || [],
        allConditionsMet: row.all_conditions_met as boolean,
        offerDate: row.offer_date as string,
        expiryDate: row.expiry_date as string | undefined,
        responseDueDate: row.response_due_date as string | undefined,
        status: row.status as OfferStatus,
        candidateResponseDate: row.candidate_response_date as string | undefined,
        declineReason: row.decline_reason as string | undefined,
        negotiationNotes: row.negotiation_notes as string | undefined,
        proposedStartDate: row.proposed_start_date as string | undefined,
        confirmedStartDate: row.confirmed_start_date as string | undefined,
        onboardingTriggered: row.onboarding_triggered as boolean,
        onboardingLinkSentAt: row.onboarding_link_sent_at as string | undefined,
        employeeId: row.employee_id as string | undefined,
        approvedBy: row.approved_by as string | undefined,
        approvalDate: row.approval_date as string | undefined,
        approvalNotes: row.approval_notes as string | undefined,
        offerLetterUrl: row.offer_letter_url as string | undefined,
        signedOfferUrl: row.signed_offer_url as string | undefined,
        createdBy: row.created_by as string,
        updatedBy: row.updated_by as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

function mapWaitPoolRow(row: Record<string, unknown>): WaitPoolEntry {
    return {
        id: row.id as string,
        candidateId: row.candidate_id as string,
        poolReason: row.pool_reason as WaitPoolEntry["poolReason"],
        poolReasonDetails: row.pool_reason_details as string | undefined,
        originalPosition: row.original_position as string,
        potentialPositions: row.potential_positions as string[] | undefined,
        priorityScore: row.priority_score as number,
        skills: row.skills as string[] | undefined,
        experienceYears: row.experience_years as number | undefined,
        notes: row.notes as string | undefined,
        addedDate: row.added_date as string,
        reviewDate: row.review_date as string | undefined,
        expiryDate: row.expiry_date as string | undefined,
        status: row.status as WaitPoolEntry["status"],
        removalReason: row.removal_reason as string | undefined,
        lastContactedDate: row.last_contacted_date as string | undefined,
        contactCount: row.contact_count as number,
        lastContactMethod: row.last_contact_method as WaitPoolEntry["lastContactMethod"],
        lastContactNotes: row.last_contact_notes as string | undefined,
        convertedToCandidateId: row.converted_to_candidate_id as string | undefined,
        convertedDate: row.converted_date as string | undefined,
        convertedPosition: row.converted_position as string | undefined,
        createdBy: row.created_by as string,
        updatedBy: row.updated_by as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

// ============================================
// CANDIDATE OPERATIONS
// ============================================

export async function getCandidates(filters?: CandidateFilters): Promise<Candidate[]> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from("candidates")
        .select("*, departments(department_name)")
        .order(filters?.sortBy === 'name' ? 'last_name' : filters?.sortBy === 'score' ? 'pipeline_score' : 'applied_date', {
            ascending: filters?.sortOrder === 'asc'
        });

    // Apply filters
    if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters?.stage) {
        if (Array.isArray(filters.stage)) {
            query = query.in("current_stage", filters.stage);
        } else {
            query = query.eq("current_stage", filters.stage);
        }
    }

    if (filters?.departmentId) {
        query = query.eq("department_id", filters.departmentId);
    }

    if (filters?.source) {
        query = query.eq("source", filters.source);
    }

    if (filters?.decision) {
        query = query.eq("final_decision", filters.decision);
    }

    if (filters?.dateFrom) {
        query = query.gte("applied_date", filters.dateFrom);
    }

    if (filters?.dateTo) {
        query = query.lte("applied_date", filters.dateTo);
    }

    if (filters?.minScore !== undefined) {
        query = query.gte("pipeline_score", filters.minScore);
    }

    if (filters?.maxScore !== undefined) {
        query = query.lte("pipeline_score", filters.maxScore);
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching candidates:", error);
        throw new Error(`Failed to fetch candidates: ${error.message}`);
    }

    return (data || []).map(mapCandidateRow);
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("candidates")
        .select("*, departments(department_name)")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`Failed to fetch candidate: ${error.message}`);
    }

    return mapCandidateRow(data);
}

export async function createCandidate(input: CreateCandidateInput): Promise<Candidate> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("candidates")
        .insert({
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            phone: input.phone,
            linkedin_url: input.linkedinUrl,
            position_applied: input.positionApplied,
            department_id: input.departmentId,
            source: input.source,
            source_details: input.sourceDetails,
            referrer_employee_id: input.referrerEmployeeId,
            recruiter_id: input.recruiterId,
            resume_url: input.resumeUrl,
            cover_letter_url: input.coverLetterUrl,
            portfolio_url: input.portfolioUrl,
            created_by: userId,
        })
        .select("*, departments(department_name)")
        .single();

    if (error) {
        throw new Error(`Failed to create candidate: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/interview-history");
    return mapCandidateRow(data);
}

export async function updateCandidateStage(id: string, stage: CandidateStage): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("candidates")
        .update({
            current_stage: stage,
            updated_by: userId,
        })
        .eq("id", id);

    if (error) {
        throw new Error(`Failed to update candidate stage: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/interview-history");
}

export async function updateCandidate(id: string, updates: Partial<CreateCandidateInput>): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const updateData: Record<string, unknown> = { updated_by: userId };

    if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.linkedinUrl !== undefined) updateData.linkedin_url = updates.linkedinUrl;
    if (updates.positionApplied !== undefined) updateData.position_applied = updates.positionApplied;
    if (updates.departmentId !== undefined) updateData.department_id = updates.departmentId;
    if (updates.source !== undefined) updateData.source = updates.source;
    if (updates.resumeUrl !== undefined) updateData.resume_url = updates.resumeUrl;

    const { error } = await supabase
        .from("candidates")
        .update(updateData)
        .eq("id", id);

    if (error) {
        throw new Error(`Failed to update candidate: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/interview-history");
}

// ============================================
// INTERVIEW OPERATIONS
// ============================================

export async function getInterviewsForCandidate(candidateId: string): Promise<Interview[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("interview_history")
        .select("*")
        .eq("candidate_id", candidateId)
        .order("scheduled_date", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch interviews: ${error.message}`);
    }

    return (data || []).map(mapInterviewRow);
}

export async function getInterviews(filters?: InterviewFilters): Promise<Interview[]> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from("interview_history")
        .select("*")
        .order("scheduled_date", { ascending: false });

    if (filters?.candidateId) {
        query = query.eq("candidate_id", filters.candidateId);
    }

    if (filters?.status) {
        if (Array.isArray(filters.status)) {
            query = query.in("status", filters.status);
        } else {
            query = query.eq("status", filters.status);
        }
    }

    if (filters?.type) {
        query = query.eq("interview_type", filters.type);
    }

    if (filters?.dateFrom) {
        query = query.gte("scheduled_date", filters.dateFrom);
    }

    if (filters?.dateTo) {
        query = query.lte("scheduled_date", filters.dateTo);
    }

    if (filters?.interviewerId) {
        query = query.contains("interviewer_ids", [filters.interviewerId]);
    }

    if (filters?.hasRating !== undefined) {
        if (filters.hasRating) {
            query = query.not("overall_rating", "is", null);
        } else {
            query = query.is("overall_rating", null);
        }
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch interviews: ${error.message}`);
    }

    return (data || []).map(mapInterviewRow);
}

export async function createInterview(input: CreateInterviewInput): Promise<Interview> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("interview_history")
        .insert({
            candidate_id: input.candidateId,
            interview_type: input.interviewType,
            interview_round: input.interviewRound || 1,
            interview_title: input.interviewTitle,
            scheduled_date: input.scheduledDate,
            duration_minutes: input.durationMinutes,
            timezone: input.timezone || "America/Los_Angeles",
            location_type: input.locationType || "virtual",
            location_details: input.locationDetails,
            meeting_link: input.meetingLink,
            interviewer_ids: input.interviewerIds,
            lead_interviewer_id: input.leadInterviewerId,
            created_by: userId,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create interview: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/interview-history");
    return mapInterviewRow(data);
}

export async function submitInterviewFeedback(interviewId: string, feedback: SubmitFeedbackInput): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("interview_history")
        .update({
            status: "completed",
            overall_rating: feedback.overallRating,
            recommendation: feedback.recommendation,
            technical_rating: feedback.technicalRating,
            communication_rating: feedback.communicationRating,
            culture_fit_rating: feedback.cultureFitRating,
            problem_solving_rating: feedback.problemSolvingRating,
            feedback_summary: feedback.feedbackSummary,
            strengths: feedback.strengths,
            concerns: feedback.concerns,
            public_notes: feedback.publicNotes,
            private_notes: feedback.privateNotes,
            follow_up_questions: feedback.followUpQuestions,
            feedback_submitted_at: new Date().toISOString(),
            updated_by: userId,
        })
        .eq("id", interviewId);

    if (error) {
        throw new Error(`Failed to submit feedback: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/interview-history");
}

export async function updateInterviewStatus(interviewId: string, status: Interview["status"], reason?: string): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const updateData: Record<string, unknown> = {
        status,
        updated_by: userId,
    };

    if (reason) {
        updateData.cancellation_reason = reason;
    }

    if (status === "completed") {
        updateData.actual_end_time = new Date().toISOString();
    }

    const { error } = await supabase
        .from("interview_history")
        .update(updateData)
        .eq("id", interviewId);

    if (error) {
        throw new Error(`Failed to update interview status: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/interview-history");
}

// ============================================
// DECISION OPERATIONS
// ============================================

export async function makeHireDecision(
    candidateId: string,
    decision: HRDecision,
    reason?: string
): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const updateData: Record<string, unknown> = {
        final_decision: decision,
        decision_date: new Date().toISOString().split("T")[0],
        decision_by: userId,
        updated_by: userId,
    };

    // Update stage based on decision
    if (decision === "hire") {
        updateData.current_stage = "offer";
    } else if (decision === "no_hire") {
        updateData.current_stage = "rejected";
        updateData.rejection_reason = reason;
    } else if (decision === "wait_pool") {
        updateData.current_stage = "wait_pool";
    }

    const { error } = await supabase
        .from("candidates")
        .update(updateData)
        .eq("id", candidateId);

    if (error) {
        throw new Error(`Failed to record decision: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/interview-history");
}

// ============================================
// OFFER OPERATIONS
// ============================================

export async function getOffersForCandidate(candidateId: string): Promise<ConditionalOffer[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("conditional_offers")
        .select("*, departments(department_name)")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch offers: ${error.message}`);
    }

    return (data || []).map(mapOfferRow);
}

export async function getOffers(filters?: OfferFilters): Promise<ConditionalOffer[]> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from("conditional_offers")
        .select("*, departments(department_name)")
        .order("created_at", { ascending: false });

    if (filters?.candidateId) {
        query = query.eq("candidate_id", filters.candidateId);
    }

    if (filters?.status) {
        if (Array.isArray(filters.status)) {
            query = query.in("status", filters.status);
        } else {
            query = query.eq("status", filters.status);
        }
    }

    if (filters?.departmentId) {
        query = query.eq("department_id", filters.departmentId);
    }

    if (filters?.dateFrom) {
        query = query.gte("offer_date", filters.dateFrom);
    }

    if (filters?.dateTo) {
        query = query.lte("offer_date", filters.dateTo);
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch offers: ${error.message}`);
    }

    return (data || []).map(mapOfferRow);
}

export async function createOffer(input: CreateOfferInput): Promise<ConditionalOffer> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const offerCode = generateOfferCode();

    const { data, error } = await supabase
        .from("conditional_offers")
        .insert({
            candidate_id: input.candidateId,
            offer_code: offerCode,
            position_title: input.positionTitle,
            department_id: input.departmentId,
            reports_to_employee_id: input.reportsToEmployeeId,
            employment_type: input.employmentType || "full_time",
            offered_salary: input.offeredSalary,
            salary_currency: input.salaryCurrency || "USD",
            pay_frequency: input.payFrequency || "annually",
            signing_bonus: input.signingBonus,
            target_bonus_percentage: input.targetBonusPercentage,
            equity_type: input.equityType,
            equity_details: input.equityDetails,
            benefits_package_id: input.benefitsPackageId,
            pto_days: input.ptoDays,
            conditions: input.conditions || [],
            expiry_date: input.expiryDate,
            response_due_date: input.responseDueDate,
            proposed_start_date: input.proposedStartDate,
            created_by: userId,
        })
        .select("*, departments(department_name)")
        .single();

    if (error) {
        throw new Error(`Failed to create offer: ${error.message}`);
    }

    // Update candidate stage to offer
    await supabase
        .from("candidates")
        .update({ current_stage: "offer", updated_by: userId })
        .eq("id", input.candidateId);

    revalidatePath("/dashboard/hr/interview-history");
    return mapOfferRow(data);
}

export async function updateOfferStatus(offerId: string, status: OfferStatus, notes?: string): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const updateData: Record<string, unknown> = {
        status,
        updated_by: userId,
    };

    if (status === "accepted" || status === "declined") {
        updateData.candidate_response_date = new Date().toISOString().split("T")[0];
    }

    if (status === "declined" && notes) {
        updateData.decline_reason = notes;
    }

    if (notes) {
        updateData.negotiation_notes = notes;
    }

    const { error } = await supabase
        .from("conditional_offers")
        .update(updateData)
        .eq("id", offerId);

    if (error) {
        throw new Error(`Failed to update offer status: ${error.message}`);
    }

    // If accepted, update candidate stage to hired
    if (status === "accepted") {
        const { data: offer } = await supabase
            .from("conditional_offers")
            .select("candidate_id")
            .eq("id", offerId)
            .single();

        if (offer) {
            await supabase
                .from("candidates")
                .update({ current_stage: "hired", updated_by: userId })
                .eq("id", offer.candidate_id);
        }
    }

    revalidatePath("/dashboard/hr/interview-history");
}

// ============================================
// WAIT POOL OPERATIONS
// ============================================

export async function getWaitPoolEntries(filters?: WaitPoolFilters): Promise<WaitPoolEntry[]> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from("wait_pool")
        .select("*, candidates:candidate_id(*)")
        .order(
            filters?.sortBy === "addedDate" ? "added_date" :
                filters?.sortBy === "reviewDate" ? "review_date" :
                    "priority_score",
            { ascending: filters?.sortOrder === "asc" }
        );

    if (filters?.status) {
        if (Array.isArray(filters.status)) {
            query = query.in("status", filters.status);
        } else {
            query = query.eq("status", filters.status);
        }
    } else {
        // Default to active entries
        query = query.eq("status", "active");
    }

    if (filters?.reason) {
        query = query.eq("pool_reason", filters.reason);
    }

    if (filters?.skills && filters.skills.length > 0) {
        query = query.overlaps("skills", filters.skills);
    }

    if (filters?.minPriority !== undefined) {
        query = query.gte("priority_score", filters.minPriority);
    }

    if (filters?.reviewDueBefore) {
        query = query.lte("review_date", filters.reviewDueBefore);
    }

    if (filters?.expiringBefore) {
        query = query.lte("expiry_date", filters.expiringBefore);
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch wait pool: ${error.message}`);
    }

    return (data || []).map((row) => {
        const entry = mapWaitPoolRow(row);
        if (row.candidates) {
            entry.candidate = mapCandidateRow(row.candidates as Record<string, unknown>);
        }
        return entry;
    });
}

export async function addToWaitPool(input: AddToWaitPoolInput): Promise<WaitPoolEntry> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("wait_pool")
        .insert({
            candidate_id: input.candidateId,
            pool_reason: input.poolReason,
            pool_reason_details: input.poolReasonDetails,
            original_position: input.originalPosition,
            potential_positions: input.potentialPositions,
            priority_score: input.priorityScore || 5,
            skills: input.skills,
            experience_years: input.experienceYears,
            notes: input.notes,
            review_date: input.reviewDate,
            created_by: userId,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to add to wait pool: ${error.message}`);
    }

    // Update candidate stage
    await supabase
        .from("candidates")
        .update({ current_stage: "wait_pool", updated_by: userId })
        .eq("id", input.candidateId);

    revalidatePath("/dashboard/hr/wait-pool");
    revalidatePath("/dashboard/hr/interview-history");
    return mapWaitPoolRow(data);
}

export async function convertWaitPoolToCandidate(waitPoolId: string, newPosition: string): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    // Get the wait pool entry
    const { data: entry, error: fetchError } = await supabase
        .from("wait_pool")
        .select("candidate_id")
        .eq("id", waitPoolId)
        .single();

    if (fetchError || !entry) {
        throw new Error("Wait pool entry not found");
    }

    // Create new candidate application
    const { data: newCandidate, error: insertError } = await supabase
        .from("candidates")
        .insert({
            first_name: "", // Will be copied from original
            last_name: "",
            email: "",
            position_applied: newPosition,
            source: "internal",
            source_details: "Converted from wait pool",
            created_by: userId,
        })
        .select()
        .single();

    // Actually, let's just update the wait pool entry and reset the candidate stage
    const { error: updateError } = await supabase
        .from("wait_pool")
        .update({
            status: "converted",
            converted_date: new Date().toISOString().split("T")[0],
            converted_position: newPosition,
            updated_by: userId,
        })
        .eq("id", waitPoolId);

    if (updateError) {
        throw new Error(`Failed to convert: ${updateError.message}`);
    }

    // Reset candidate to applied stage for new position
    await supabase
        .from("candidates")
        .update({
            current_stage: "applied",
            position_applied: newPosition,
            final_decision: null,
            decision_date: null,
            decision_by: null,
            updated_by: userId,
        })
        .eq("id", entry.candidate_id);

    revalidatePath("/dashboard/hr/wait-pool");
    revalidatePath("/dashboard/hr/interview-history");
}

export async function updateWaitPoolEntry(id: string, updates: Partial<AddToWaitPoolInput>): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const updateData: Record<string, unknown> = { updated_by: userId };

    if (updates.priorityScore !== undefined) updateData.priority_score = updates.priorityScore;
    if (updates.skills !== undefined) updateData.skills = updates.skills;
    if (updates.potentialPositions !== undefined) updateData.potential_positions = updates.potentialPositions;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.reviewDate !== undefined) updateData.review_date = updates.reviewDate;

    const { error } = await supabase
        .from("wait_pool")
        .update(updateData)
        .eq("id", id);

    if (error) {
        throw new Error(`Failed to update wait pool entry: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/wait-pool");
}

export async function removeFromWaitPool(id: string, reason: string): Promise<void> {
    const userId = await getAuthUserId();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("wait_pool")
        .update({
            status: "removed",
            removal_reason: reason,
            updated_by: userId,
        })
        .eq("id", id);

    if (error) {
        throw new Error(`Failed to remove from wait pool: ${error.message}`);
    }

    revalidatePath("/dashboard/hr/wait-pool");
}

// ============================================
// METRICS & DASHBOARD
// ============================================

export async function getHRMetrics(): Promise<HRMetrics> {
    const supabase = await createSupabaseServerClient();

    // Get candidate counts by stage
    const { data: candidates } = await supabase
        .from("candidates")
        .select("current_stage");

    const candidatesByStage: Record<CandidateStage, number> = {
        applied: 0,
        screening: 0,
        phone_interview: 0,
        technical_interview: 0,
        onsite: 0,
        final_round: 0,
        offer: 0,
        hired: 0,
        rejected: 0,
        wait_pool: 0,
        withdrawn: 0,
    };

    (candidates || []).forEach((c) => {
        const stage = c.current_stage as CandidateStage;
        candidatesByStage[stage] = (candidatesByStage[stage] || 0) + 1;
    });

    // Get pending interviews
    const { count: pendingInterviews } = await supabase
        .from("interview_history")
        .select("*", { count: "exact", head: true })
        .in("status", ["scheduled", "confirmed"]);

    // Get completed interviews this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: completedInterviewsThisWeek } = await supabase
        .from("interview_history")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("actual_end_time", weekAgo.toISOString());

    // Get active offers
    const { count: activeOffers } = await supabase
        .from("conditional_offers")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending_response", "sent"]);

    // Get offers accepted this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const { count: offersAcceptedThisMonth } = await supabase
        .from("conditional_offers")
        .select("*", { count: "exact", head: true })
        .eq("status", "accepted")
        .gte("candidate_response_date", monthAgo.toISOString().split("T")[0]);

    // Get wait pool size
    const { count: waitPoolSize } = await supabase
        .from("wait_pool")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

    return {
        totalCandidates: (candidates || []).length,
        candidatesByStage,
        pendingInterviews: pendingInterviews || 0,
        completedInterviewsThisWeek: completedInterviewsThisWeek || 0,
        activeOffers: activeOffers || 0,
        offersAcceptedThisMonth: offersAcceptedThisMonth || 0,
        waitPoolSize: waitPoolSize || 0,
        averageTimeToHire: 28, // TODO: Calculate from actual data
        offerAcceptanceRate: 75, // TODO: Calculate from actual data
    };
}

// ============================================
// DEPARTMENT OPERATIONS
// ============================================

export async function getDepartments(): Promise<{ id: string; name: string }[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("departments")
        .select("id, department_name")
        .order("department_name");

    if (error) {
        console.error("Error fetching departments:", error);
        return [];
    }

    return (data || []).map((row) => ({
        id: row.id,
        name: row.department_name,
    }));
}
