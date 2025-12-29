/**
 * HR Interview History Module - Utility Functions
 * 
 * Helper functions for colors, labels, formatting, and code generation
 */

import { nanoid } from 'nanoid';
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import type {
    CandidateStage,
    InterviewType,
    InterviewRecommendation,
    OfferStatus,
    WaitPoolStatus,
    PipelineStageInfo,
    RecommendationInfo,
    InterviewTypeInfo,
} from '@/types/hr/interview-history/types';

// ============================================
// OFFER CODE GENERATION
// ============================================

/**
 * Generates a unique offer code in the format: SC-YYYYMMDD-XXXX
 */
export function generateOfferCode(): string {
    const prefix = process.env.NEXT_PUBLIC_OFFER_CODE_PREFIX || 'SC-';
    const dateStr = format(new Date(), 'yyyyMMdd');
    const randomStr = nanoid(4).toUpperCase();
    return `${prefix}${dateStr}-${randomStr}`;
}

// ============================================
// PIPELINE STAGE HELPERS
// ============================================

const PIPELINE_STAGES: Record<CandidateStage, PipelineStageInfo> = {
    applied: {
        stage: 'applied',
        label: 'Applied',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-300 dark:border-blue-700',
        icon: '📝',
        order: 1,
    },
    screening: {
        stage: 'screening',
        label: 'Screening',
        color: 'text-cyan-600 dark:text-cyan-400',
        bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
        borderColor: 'border-cyan-300 dark:border-cyan-700',
        icon: '🔍',
        order: 2,
    },
    phone_interview: {
        stage: 'phone_interview',
        label: 'Phone Interview',
        color: 'text-violet-600 dark:text-violet-400',
        bgColor: 'bg-violet-100 dark:bg-violet-900/30',
        borderColor: 'border-violet-300 dark:border-violet-700',
        icon: '📞',
        order: 3,
    },
    technical_interview: {
        stage: 'technical_interview',
        label: 'Technical',
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
        borderColor: 'border-indigo-300 dark:border-indigo-700',
        icon: '💻',
        order: 4,
    },
    onsite: {
        stage: 'onsite',
        label: 'Onsite',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        borderColor: 'border-amber-300 dark:border-amber-700',
        icon: '🏢',
        order: 5,
    },
    final_round: {
        stage: 'final_round',
        label: 'Final Round',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        borderColor: 'border-orange-300 dark:border-orange-700',
        icon: '⭐',
        order: 6,
    },
    offer: {
        stage: 'offer',
        label: 'Offer',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        borderColor: 'border-emerald-300 dark:border-emerald-700',
        icon: '📧',
        order: 7,
    },
    hired: {
        stage: 'hired',
        label: 'Hired',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-300 dark:border-green-700',
        icon: '🎉',
        order: 8,
    },
    rejected: {
        stage: 'rejected',
        label: 'Rejected',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-300 dark:border-red-700',
        icon: '❌',
        order: 9,
    },
    wait_pool: {
        stage: 'wait_pool',
        label: 'Wait Pool',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        borderColor: 'border-purple-300 dark:border-purple-700',
        icon: '⏳',
        order: 10,
    },
    withdrawn: {
        stage: 'withdrawn',
        label: 'Withdrawn',
        color: 'text-zinc-500 dark:text-zinc-400',
        bgColor: 'bg-zinc-100 dark:bg-zinc-800',
        borderColor: 'border-zinc-300 dark:border-zinc-600',
        icon: '🚪',
        order: 11,
    },
};

export function getStageInfo(stage: CandidateStage): PipelineStageInfo {
    return PIPELINE_STAGES[stage];
}

export function getStageColor(stage: CandidateStage): string {
    return PIPELINE_STAGES[stage].color;
}

export function getStageLabel(stage: CandidateStage): string {
    return PIPELINE_STAGES[stage].label;
}

export function getStageOrder(stage: CandidateStage): number {
    return PIPELINE_STAGES[stage].order;
}

export function getStageBgColor(stage: CandidateStage): string {
    return PIPELINE_STAGES[stage].bgColor;
}

export function getStageIcon(stage: CandidateStage): string {
    return PIPELINE_STAGES[stage].icon;
}

export function getActivePipelineStages(): CandidateStage[] {
    return ['applied', 'screening', 'phone_interview', 'technical_interview', 'onsite', 'final_round', 'offer'];
}

export function isFinalStage(stage: CandidateStage): boolean {
    return ['hired', 'rejected', 'wait_pool', 'withdrawn'].includes(stage);
}

// ============================================
// RECOMMENDATION HELPERS
// ============================================

const RECOMMENDATIONS: Record<InterviewRecommendation, RecommendationInfo> = {
    strong_hire: {
        recommendation: 'strong_hire',
        label: 'Strong Hire',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        icon: '🌟',
    },
    hire: {
        recommendation: 'hire',
        label: 'Hire',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: '✅',
    },
    lean_hire: {
        recommendation: 'lean_hire',
        label: 'Lean Hire',
        color: 'text-lime-600 dark:text-lime-400',
        bgColor: 'bg-lime-100 dark:bg-lime-900/30',
        icon: '👍',
    },
    lean_no_hire: {
        recommendation: 'lean_no_hire',
        label: 'Lean No Hire',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        icon: '👎',
    },
    no_hire: {
        recommendation: 'no_hire',
        label: 'No Hire',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        icon: '❌',
    },
};

export function getRecommendationInfo(rec: InterviewRecommendation): RecommendationInfo {
    return RECOMMENDATIONS[rec];
}

export function getRecommendationColor(rec: InterviewRecommendation): string {
    return RECOMMENDATIONS[rec].color;
}

export function getRecommendationLabel(rec: InterviewRecommendation): string {
    return RECOMMENDATIONS[rec].label;
}

export function isPositiveRecommendation(rec: InterviewRecommendation): boolean {
    return ['strong_hire', 'hire', 'lean_hire'].includes(rec);
}

// ============================================
// INTERVIEW TYPE HELPERS
// ============================================

const INTERVIEW_TYPES: Record<InterviewType, InterviewTypeInfo> = {
    phone_screen: { type: 'phone_screen', label: 'Phone Screen', icon: '📞', defaultDuration: 30 },
    technical: { type: 'technical', label: 'Technical', icon: '💻', defaultDuration: 60 },
    behavioral: { type: 'behavioral', label: 'Behavioral', icon: '🗣️', defaultDuration: 45 },
    culture_fit: { type: 'culture_fit', label: 'Culture Fit', icon: '🤝', defaultDuration: 30 },
    executive: { type: 'executive', label: 'Executive', icon: '👔', defaultDuration: 45 },
    panel: { type: 'panel', label: 'Panel', icon: '👥', defaultDuration: 90 },
    case_study: { type: 'case_study', label: 'Case Study', icon: '📊', defaultDuration: 60 },
    portfolio_review: { type: 'portfolio_review', label: 'Portfolio', icon: '🎨', defaultDuration: 45 },
    other: { type: 'other', label: 'Other', icon: '📋', defaultDuration: 30 },
};

export function getInterviewTypeInfo(type: InterviewType): InterviewTypeInfo {
    return INTERVIEW_TYPES[type];
}

export function getInterviewTypeLabel(type: InterviewType): string {
    return INTERVIEW_TYPES[type].label;
}

export function getInterviewTypeIcon(type: InterviewType): string {
    return INTERVIEW_TYPES[type].icon;
}

// ============================================
// OFFER STATUS HELPERS
// ============================================

const OFFER_STATUS_COLORS: Record<OfferStatus, { color: string; bgColor: string }> = {
    draft: { color: 'text-zinc-500', bgColor: 'bg-zinc-100 dark:bg-zinc-800' },
    pending_approval: { color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    approved: { color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    sent: { color: 'text-violet-600', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
    pending_response: { color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    accepted: { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    declined: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    expired: { color: 'text-zinc-500', bgColor: 'bg-zinc-100 dark:bg-zinc-800' },
    rescinded: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    converted: { color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
};

export function getOfferStatusColor(status: OfferStatus): string {
    return OFFER_STATUS_COLORS[status].color;
}

export function getOfferStatusBgColor(status: OfferStatus): string {
    return OFFER_STATUS_COLORS[status].bgColor;
}

export function getOfferStatusLabel(status: OfferStatus): string {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ============================================
// WAIT POOL STATUS HELPERS
// ============================================

const WAIT_POOL_STATUS_COLORS: Record<WaitPoolStatus, { color: string; bgColor: string }> = {
    active: { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    contacted: { color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    interviewing: { color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    converted: { color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    removed: { color: 'text-zinc-500', bgColor: 'bg-zinc-100 dark:bg-zinc-800' },
    expired: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    declined: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
};

export function getWaitPoolStatusColor(status: WaitPoolStatus): string {
    return WAIT_POOL_STATUS_COLORS[status].color;
}

export function getWaitPoolStatusBgColor(status: WaitPoolStatus): string {
    return WAIT_POOL_STATUS_COLORS[status].bgColor;
}

// ============================================
// DATE & TIME HELPERS
// ============================================

export function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '—';
    try {
        return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
        return dateStr;
    }
}

export function formatDateTime(dateStr: string | undefined): string {
    if (!dateStr) return '—';
    try {
        return format(parseISO(dateStr), 'MMM d, yyyy h:mm a');
    } catch {
        return dateStr;
    }
}

export function formatRelativeTime(dateStr: string | undefined): string {
    if (!dateStr) return '—';
    try {
        return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
        return dateStr;
    }
}

export function getDaysSince(dateStr: string | undefined): number {
    if (!dateStr) return 0;
    try {
        return differenceInDays(new Date(), parseISO(dateStr));
    } catch {
        return 0;
    }
}

export function getDaysUntil(dateStr: string | undefined): number {
    if (!dateStr) return 0;
    try {
        return differenceInDays(parseISO(dateStr), new Date());
    } catch {
        return 0;
    }
}

// ============================================
// FORMATTING HELPERS
// ============================================

export function formatCurrency(amount: number | undefined, currency = 'USD'): string {
    if (amount === undefined || amount === null) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPercentage(value: number | undefined): string {
    if (value === undefined || value === null) return '—';
    return `${value.toFixed(1)}%`;
}

export function formatPhoneNumber(phone: string | undefined): string {
    if (!phone) return '—';
    // Basic US phone formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

export function formatCandidateName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
}

export function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// ============================================
// SCORE & RATING HELPERS
// ============================================

export function getRatingColor(rating: number): string {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 3.5) return 'text-emerald-600 dark:text-emerald-400';
    if (rating >= 2.5) return 'text-amber-600 dark:text-amber-400';
    if (rating >= 1.5) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
}

export function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    if (score >= 20) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
}

export function getPriorityColor(priority: number): string {
    if (priority >= 8) return 'text-green-600 dark:text-green-400';
    if (priority >= 6) return 'text-emerald-600 dark:text-emerald-400';
    if (priority >= 4) return 'text-amber-600 dark:text-amber-400';
    return 'text-zinc-500 dark:text-zinc-400';
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
