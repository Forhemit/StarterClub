// ============================================================================
// MEMBERSHIP DATA - Centralized data for tiers, benefits, and certification
// ============================================================================

import {
    Crown,
    Rocket,
    Gem,
    Shield,
    Zap,
    Users,
    Clock,
    FileCheck,
    Building2,
    Briefcase,
    Target,
    Award,
    TrendingUp,
    Lock,
    Gauge,
    Wrench,
    Car,
    type LucideIcon
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface TierBenefit {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    // Racing theme specific
    racingLabel?: string;
    // Corporate theme specific
    corporateType?: "standard" | "circuit" | "embossed";
}

export interface MembershipTier {
    id: string;
    name: string;
    tagline: string;
    monthlyPrice: number;
    benefits: TierBenefit[];
    // Corporate theme
    corporateMaterial: "frosted-glass" | "brushed-aluminum" | "carbon-gold";
    // Racing theme
    vehicleType: "sedan" | "coupe" | "race-car";
    vehicleName: string;
}

export interface CertificationCriterion {
    id: string;
    title: string;
    memberDescription: string;
    investorMetric: string;
    investorImpact: number; // percentage
    // Racing theme
    testType: "crash" | "weather" | "pit-stop" | "endurance" | "telemetry";
    reliabilityBonus: number;
}

export interface FaaSPhase {
    id: string;
    floor: number;
    title: string;
    deliverables: string[];
    // Racing theme
    pitAction: string;
    crewPosition: string;
    duration: number; // seconds out of 90
}

// ============================================================================
// MEMBERSHIP TIERS DATA
// ============================================================================

export const membershipTiers: MembershipTier[] = [
    {
        id: "starter-member",
        name: "Starter Member",
        tagline: "Begin your journey with foundational access",
        monthlyPrice: 99,
        corporateMaterial: "frosted-glass",
        vehicleType: "sedan",
        vehicleName: "Foundation S1",
        benefits: [
            {
                id: "sm-1",
                title: "Super Station Access",
                description: "8 hours/month of premium workspace access",
                icon: Building2,
                racingLabel: "Home Garage: 8hr/month",
                corporateType: "standard",
            },
            {
                id: "sm-2",
                title: "Community Events",
                description: "Access to monthly networking sessions",
                icon: Users,
                racingLabel: "Club Racing Series Entry",
                corporateType: "standard",
            },
            {
                id: "sm-3",
                title: "Resource Library",
                description: "Curated business templates and guides",
                icon: FileCheck,
                racingLabel: "Basic Owner's Manual",
                corporateType: "standard",
            },
            {
                id: "sm-4",
                title: "Member Portal",
                description: "Digital dashboard for tracking progress",
                icon: Gauge,
                racingLabel: "Standard Telemetry",
                corporateType: "standard",
            },
        ],
    },
    {
        id: "starter-builder",
        name: "Starter Builder",
        tagline: "Accelerate with advanced tools and mentorship",
        monthlyPrice: 299,
        corporateMaterial: "brushed-aluminum",
        vehicleType: "coupe",
        vehicleName: "Builder GT",
        benefits: [
            {
                id: "sb-1",
                title: "Unlimited Super Station",
                description: "24/7 access to all premium workspaces",
                icon: Building2,
                racingLabel: "Private Garage: 24/7 Access",
                corporateType: "circuit",
            },
            {
                id: "sb-2",
                title: "Monthly Strategy Call",
                description: "1-on-1 session with a business advisor",
                icon: Target,
                racingLabel: "Race Engineer Briefing",
                corporateType: "circuit",
            },
            {
                id: "sb-3",
                title: "Partner Discounts",
                description: "Exclusive rates with vetted service providers",
                icon: Briefcase,
                racingLabel: "Sponsor Deals: -20%",
                corporateType: "circuit",
            },
            {
                id: "sb-4",
                title: "Advanced Toolkit",
                description: "Premium software licenses and integrations",
                icon: Wrench,
                racingLabel: "Performance Upgrades",
                corporateType: "circuit",
            },
            {
                id: "sb-5",
                title: "Priority Support",
                description: "48-hour response time on all inquiries",
                icon: Zap,
                racingLabel: "Pit Radio: Priority Channel",
                corporateType: "circuit",
            },
        ],
    },
    {
        id: "starter-founder",
        name: "Starter Founder",
        tagline: "The definitive tier for serious builders",
        monthlyPrice: 999,
        corporateMaterial: "carbon-gold",
        vehicleType: "race-car",
        vehicleName: "Founder Pro X1",
        benefits: [
            {
                id: "sf-1",
                title: "Everything in Builder",
                description: "All Builder benefits included",
                icon: Crown,
                racingLabel: "Full Factory Support",
                corporateType: "embossed",
            },
            {
                id: "sf-2",
                title: "Quarterly Business Review",
                description: "Deep-dive analysis with executive team",
                icon: TrendingUp,
                racingLabel: "Season Strategy Planning",
                corporateType: "embossed",
            },
            {
                id: "sf-3",
                title: "Founder Toolkit",
                description: "Legal templates, cap table tools, and more",
                icon: Lock,
                racingLabel: "Homologation Package",
                corporateType: "embossed",
            },
            {
                id: "sf-4",
                title: "Investor Network Access",
                description: "Curated introductions to vetted investors",
                icon: Gem,
                racingLabel: "Factory Team Backing",
                corporateType: "embossed",
            },
            {
                id: "sf-5",
                title: "Certification Pathway",
                description: "Eligibility for Starter Club Business Certification",
                icon: Award,
                racingLabel: "FIA Superlicense Track",
                corporateType: "embossed",
            },
            {
                id: "sf-6",
                title: "Dedicated Success Manager",
                description: "Your personal advocate within Starter Club",
                icon: Shield,
                racingLabel: "Dedicated Race Engineer",
                corporateType: "embossed",
            },
        ],
    },
];

// ============================================================================
// CERTIFICATION DATA
// ============================================================================

export const certificationCriteria: CertificationCriterion[] = [
    {
        id: "cert-1",
        title: "Business Continuity Plan",
        memberDescription: "Document operational procedures for business continuity",
        investorMetric: "Reduced Transaction Risk",
        investorImpact: 15,
        testType: "crash",
        reliabilityBonus: 20,
    },
    {
        id: "cert-2",
        title: "Financial Controls",
        memberDescription: "Implement robust financial tracking and controls",
        investorMetric: "Financial Transparency Score",
        investorImpact: 22,
        testType: "telemetry",
        reliabilityBonus: 18,
    },
    {
        id: "cert-3",
        title: "Crisis Response Protocol",
        memberDescription: "Establish documented crisis management procedures",
        investorMetric: "Crisis Resilience Rating",
        investorImpact: 18,
        testType: "weather",
        reliabilityBonus: 15,
    },
    {
        id: "cert-4",
        title: "Key Person Redundancy",
        memberDescription: "Cross-train team on critical business functions",
        investorMetric: "Key Person Risk Score",
        investorImpact: 25,
        testType: "pit-stop",
        reliabilityBonus: 22,
    },
    {
        id: "cert-5",
        title: "Legal & IP Protection",
        memberDescription: "Secure intellectual property and legal foundations",
        investorMetric: "Legal Foundation Strength",
        investorImpact: 20,
        testType: "endurance",
        reliabilityBonus: 25,
    },
];

// ============================================================================
// FAAS PHASES DATA
// ============================================================================

export const faasPhases: FaaSPhase[] = [
    {
        id: "faas-1",
        floor: 1,
        title: "Entity Formation",
        deliverables: [
            "Articles of Incorporation filed",
            "EIN obtained",
            "Operating Agreement drafted",
            "Registered Agent established",
        ],
        pitAction: "Wheel Change",
        crewPosition: "Front Jack Operator",
        duration: 22,
    },
    {
        id: "faas-2",
        floor: 2,
        title: "Compliance Setup",
        deliverables: [
            "Business licenses secured",
            "Tax registrations completed",
            "Insurance policies bound",
            "Employment compliance verified",
        ],
        pitAction: "Fuel Rig Connection",
        crewPosition: "Fuel Man",
        duration: 25,
    },
    {
        id: "faas-3",
        floor: 3,
        title: "Systems Integration",
        deliverables: [
            "Accounting platform deployed",
            "HR system configured",
            "Document management live",
            "Communication stack active",
        ],
        pitAction: "Front Wing Adjustment",
        crewPosition: "Aero Tech",
        duration: 28,
    },
    {
        id: "faas-4",
        floor: 4,
        title: "Operational Handoff",
        deliverables: [
            "Complete documentation transfer",
            "Team training completed",
            "90-day support activated",
            "Success metrics dashboard live",
        ],
        pitAction: "GO Signal",
        crewPosition: "Team Principal",
        duration: 15,
    },
];

// ============================================================================
// ANIMATION CONFIGS
// ============================================================================

export const animationConfig = {
    stagger: {
        fast: 0.05,
        normal: 0.1,
        slow: 0.2,
    },
    duration: {
        fast: 0.3,
        normal: 0.5,
        slow: 0.8,
        verySlow: 1.2,
    },
    ease: {
        smooth: [0.43, 0.13, 0.23, 0.96],
        bounce: [0.68, -0.55, 0.265, 1.55],
        sharp: [0.4, 0, 0.2, 1],
    },
};
