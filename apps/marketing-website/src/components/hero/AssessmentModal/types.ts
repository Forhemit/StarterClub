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
    image: string;
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
    image: string;
}

export const QUESTIONS: QuestionData[] = [
    {
        id: 1,
        title: "The Human Capital Stress Test",
        question: "If you and your top two managers vanished suddenly for 90 days, could a qualified stranger step in and run the company profitably using only your current written manuals and SOPs?",
        icon: "👥",
        image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=800&q=80",
    },
    {
        id: 2,
        title: "The Operational Resilience Test",
        question: "If your main business bank account froze, your website crashed, and your HQ lost power simultaneously, do you have a pre-written, tested 'Disaster Playbook' that your team could execute to keep customers from noticing?",
        icon: "⚡",
        image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=800&q=80",
    },
    {
        id: 3,
        title: "The Exit Readiness Test",
        question: "If a qualified buyer wired a $10M offer today on the condition of a 24-hour audit, is your digital 'Data Room' (clean financials, contracts, IP, Tax returns) ready to be shared right this second?",
        icon: "💰",
        image: "https://images.unsplash.com/photo-1603202662747-00e33e7d1468?w=800&q=80",
    },
];

export const RESULTS: Record<ResultType, ResultData> = {
    straw: {
        type: 'straw',
        title: "Verdict: Your Business is Made of STRAW",
        icon: "🏚️",
        color: "text-signal-red",
        bgColor: "bg-signal-red/10",
        borderColor: "border-signal-red/30",
        reply: "You don't own a business; you own a high-risk job. Your revenue relies almost entirely on your personal presence and daily 'hustle.' One significant 'wolf'—personal illness, key employee departure, or market shift—will blow the entire operation down. You are currently un-investable and highly vulnerable.",
        ctaText: "Start Building Foundations",
        image: "https://images.unsplash.com/photo-1699800709647-649643a39de7?w=800&q=80",
    },
    wood: {
        type: 'wood',
        title: "Verdict: Your Business is Made of WOOD",
        icon: "🏠",
        color: "text-signal-yellow",
        bgColor: "bg-signal-yellow/10",
        borderColor: "border-signal-yellow/30",
        reply: "You have achieved fragile success. You have some structures in place, but they are brittle. You likely rely on the 'heroics' of key team members rather than boring, reliable processes. You might survive a major blow, but the repairs will decimate your profit margins and burn you out. You need to reinforce your foundations immediately.",
        ctaText: "Reinforce Your Structure",
        image: "https://images.unsplash.com/photo-1614346538769-f6d05af37383?w=800&q=80",
    },
    brick: {
        type: 'brick',
        title: "Verdict: Your Business is Made of BRICK",
        icon: "🏰",
        color: "text-signal-green",
        bgColor: "bg-signal-green/10",
        borderColor: "border-signal-green/30",
        reply: "You have built a true institutional-grade asset. Your business exists independently of its founders. It is resilient, transferable, and highly valuable to investors because the safety is baked into the systems, not dependent on fair weather. You are ready for the real world.",
        ctaText: "Scale Your Fortress",
        image: "https://images.unsplash.com/photo-1702234657992-cfc2e7b690a3?w=800&q=80",
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
