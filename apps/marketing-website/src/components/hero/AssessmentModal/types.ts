// State Machine Types

export type AssessmentStep = 'intro' | 'question' | 'calculating' | 'verdict';

export interface AssessmentState {
    step: AssessmentStep;
    questionId?: 1 | 2 | 3;
    score: number;
    answers: ('YES' | 'NO' | null)[];
}

export interface QuestionData {
    id: 1 | 2 | 3;
    title: string;
    question: string;
    icon: string;
}

export type ResultType = 'straw' | 'wood' | 'brick';

export interface ResultData {
    type: ResultType;
    title: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    reply: string;
    ctaText: string;
}

export const QUESTIONS: QuestionData[] = [
    {
        id: 1,
        title: "The Human Capital Stress Test",
        question: "If you and your top two managers vanished suddenly for 90 days, could a qualified stranger step in and run the company profitably using only your current written manuals and SOPs?",
        icon: "👥",
    },
    {
        id: 2,
        title: "The Operational Resilience Test",
        question: "If your main business bank account froze, your website crashed, and your HQ lost power simultaneously, do you have a pre-written, tested 'Disaster Playbook' that your team could execute to keep customers from noticing?",
        icon: "⚡",
    },
    {
        id: 3,
        title: "The Exit Readiness Test",
        question: "If a qualified buyer wired a $10M offer today on the condition of a 24-hour audit, is your digital 'Data Room' (clean financials, contracts, IP, Tax returns) ready to be shared right this second?",
        icon: "💰",
    },
];

export const RESULTS: Record<ResultType, ResultData> = {
    straw: {
        type: 'straw',
        title: "Verdict: Your Business is Made of STRAW",
        icon: "🏚️",
        color: "text-signal-red",
        bgColor: "bg-red-950",
        borderColor: "border-signal-red/30",
        reply: "You don't own a business; you own a high-risk job. Your revenue relies almost entirely on your personal presence and daily 'hustle.' One significant 'wolf'—personal illness, key employee departure, or market shift—will blow the entire operation down. You are currently un-investable and highly vulnerable.",
        ctaText: "Start Building Foundations",
    },
    wood: {
        type: 'wood',
        title: "Verdict: Your Business is Made of WOOD",
        icon: "🏠",
        color: "text-signal-yellow",
        bgColor: "bg-amber-950",
        borderColor: "border-signal-yellow/30",
        reply: "You have achieved fragile success. You have some structures in place, but they are brittle. You likely rely on the 'heroics' of key team members rather than boring, reliable processes. You might survive a major blow, but the repairs will decimate your profit margins and burn you out. You need to reinforce your foundations immediately.",
        ctaText: "Reinforce Your Structure",
    },
    brick: {
        type: 'brick',
        title: "Verdict: Your Business is Made of BRICK",
        icon: "🏰",
        color: "text-signal-green",
        bgColor: "bg-emerald-950",
        borderColor: "border-signal-green/30",
        reply: "You have built a true institutional-grade asset. Your business exists independently of its founders. It is resilient, transferable, and highly valuable to investors because the safety is baked into the systems, not dependent on fair weather. You are ready for the real world.",
        ctaText: "Scale Your Fortress",
    },
};

// LocalStorage key
export const STORAGE_KEY = 'resilience_assessment_v1';

// Pillar display data for intro
export const PILLARS = [
    { id: "structural", icon: "🧱", name: "Structural Integrity" },
    { id: "operational", icon: "⚡", name: "Operational Resilience" },
    { id: "financial", icon: "📊", name: "Exit Readiness" },
] as const;
