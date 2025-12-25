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
    Network,
    ScrollText,
    Hammer,
    Video,
    Cpu,
    Monitor,
    Mic,
    Palette,
    Code2,
    LineChart,
    Flag,
    MapPin,
    Compass,
    CheckCircle2,
    Lightbulb,
    Layers,
    Package,
    TestTube,
    Camera,
    Handshake,
    Gavel,
    Coffee,
    Armchair,
    Bot,
    UserPlus,
    BookOpen,
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
// NEW TYPES FOR PAGE TRANSFORMATION
// ============================================================================

export interface EcosystemPillar {
    id: string;
    name: string;
    tagline: string;
    icon: LucideIcon;
    // Corporate theme
    corporateDescription: string;
    // Racing theme
    racingLabel: string;
    racingDescription: string;
}

export interface BuilderTrackPhase {
    id: string;
    month: number;
    title: string;
    subtitle: string;
    deliverables: string[];
    tools: string[];
    partners: string[];
    // Corporate theme - visual cue
    corporateVisual: "blueprints" | "wireframes" | "code" | "ui-renders" | "charts" | "press";
    // Racing theme - track section
    sectorType: "pit-lane" | "technical" | "chicane" | "straight" | "grandstand";
    sectorLabel: string;
}

export interface SuperStation {
    id: string;
    name: string;
    designation: string; // Racing code like "CR-LAB"
    description: string;
    icon: LucideIcon;
    specs: {
        label: string;
        value: string;
    }[];
    workflow: string[];
    // Corporate theme
    labStyle: "creative" | "power" | "command" | "audio";
    // Racing theme
    liveryStyle: "aerodynamic" | "aggressive" | "tactical" | "precision";
}

export interface Partner {
    id: string;
    name: string;
    category: "design" | "development" | "finance" | "legal" | "marketing" | "infrastructure";
    integrationPhase: number; // Which month of the builder track
    description: string;
}

export interface Room {
    id: string;
    name: string;
    description: string;
    specs: string[];
    vibe: string;
    // Corporate theme
    corporateIcon: LucideIcon;
    // Racing theme
    racingCode: string;
    capacity: string;
    // Reservation Logic
    isFreeForAll?: boolean;
    comingSoon?: boolean;
    consumesFounderHours?: boolean;
    pricing?: {
        guest: string;
        builder: string;
        founder: string;
    };
    isReservable?: boolean;
    image?: string;
    isFeatured?: boolean;
}

export interface RoomCategory {
    id: string;
    title: string;
    description: string;
    rooms: Room[];
    // Racing theme
    sectorName: string;
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
// ECOSYSTEM PILLARS DATA
// ============================================================================

export const ecosystemPillars: EcosystemPillar[] = [
    {
        id: "pillar-crew",
        name: "The Crew",
        tagline: "Your Peer Circle",
        icon: Network,
        corporateDescription: "A tiered community of founders, builders, and operators at every stage of their journey",
        racingLabel: "PIT CREW",
        racingDescription: "Your dedicated support team from tire changers to chief strategist",
    },
    {
        id: "pillar-blueprint",
        name: "The Blueprint",
        tagline: "Your Proven Path",
        icon: ScrollText,
        corporateDescription: "A structured 6-month track from idea validation to market launch",
        racingLabel: "RACE STRATEGY",
        racingDescription: "Lap-by-lap tactics for the championship season ahead",
    },
    {
        id: "pillar-spaces",
        name: "The Spaces",
        tagline: "Your Elite HQ",
        icon: Building2,
        corporateDescription: "Quietly elite, deeply useful rooms designed for deep work and collaboration",
        racingLabel: "TRACK FACILITIES",
        racingDescription: "High-performance zones for tuning, testing, and execution",
    },
    {
        id: "pillar-arsenal",
        name: "The Arsenal",
        tagline: "Your Pro Tools",
        icon: Hammer,
        corporateDescription: "Premium Super Stations equipped with professional-grade hardware and software",
        racingLabel: "TEAM GARAGE",
        racingDescription: "Four specialized car setups ready for any track condition",
    },
];

// ============================================================================
// 6-MONTH BUILDER TRACK DATA
// ============================================================================

export const builderTrackPhases: BuilderTrackPhase[] = [
    {
        id: "track-1",
        month: 1,
        title: "Orientation & Discovery",
        subtitle: "Map your terrain",
        deliverables: [
            "Completed founder assessment",
            "Market opportunity brief",
            "Initial business model canvas",
            "Resource allocation plan",
        ],
        tools: ["Notion", "Miro", "Loom"],
        partners: ["Legal consultation intro"],
        corporateVisual: "blueprints",
        sectorType: "pit-lane",
        sectorLabel: "Garage Exit",
    },
    {
        id: "track-2",
        month: 2,
        title: "Validation Sprint",
        subtitle: "Test your assumptions",
        deliverables: [
            "Customer interview insights",
            "Landing page live",
            "Waitlist captured",
            "Pricing validation complete",
        ],
        tools: ["Figma", "Webflow", "Typeform"],
        partners: ["Stripe", "Mailchimp"],
        corporateVisual: "wireframes",
        sectorType: "technical",
        sectorLabel: "Turn 1-2",
    },
    {
        id: "track-3",
        month: 3,
        title: "MVP Build",
        subtitle: "Ship your first version",
        deliverables: [
            "Core feature set defined",
            "MVP development started",
            "Technical architecture documented",
            "First beta users onboarded",
        ],
        tools: ["Vercel", "GitHub", "Linear"],
        partners: ["AWS credits", "Developer network"],
        corporateVisual: "code",
        sectorType: "technical",
        sectorLabel: "Technical Section",
    },
    {
        id: "track-4",
        month: 4,
        title: "Product Polish",
        subtitle: "Refine the experience",
        deliverables: [
            "User feedback integrated",
            "Core flows optimized",
            "Design system established",
            "Analytics instrumented",
        ],
        tools: ["Mixpanel", "Hotjar", "Intercom"],
        partners: ["Design partners", "UX review"],
        corporateVisual: "ui-renders",
        sectorType: "chicane",
        sectorLabel: "Chicane Complex",
    },
    {
        id: "track-5",
        month: 5,
        title: "Go-to-Market Prep",
        subtitle: "Build your launch engine",
        deliverables: [
            "Marketing strategy finalized",
            "Content calendar created",
            "PR pitch deck ready",
            "Launch partners confirmed",
        ],
        tools: ["Buffer", "Canva", "Pitch"],
        partners: ["PR agencies", "Influencer network"],
        corporateVisual: "charts",
        sectorType: "straight",
        sectorLabel: "Back Straight",
    },
    {
        id: "track-6",
        month: 6,
        title: "Launch & Scale",
        subtitle: "Cross the finish line",
        deliverables: [
            "Public launch executed",
            "Growth metrics established",
            "Revenue generation active",
            "Next phase roadmap defined",
        ],
        tools: ["Amplitude", "Stripe Dashboard", "Slack"],
        partners: ["Investor introductions", "Press coverage"],
        corporateVisual: "press",
        sectorType: "grandstand",
        sectorLabel: "Start/Finish",
    },
];

// ============================================================================
// SUPER STATIONS DATA
// ============================================================================

export const superStations: SuperStation[] = [
    {
        id: "station-creator",
        name: "The Creator Lab",
        designation: "CR-LAB",
        description: "Professional video and content creation suite for founders who build in public",
        icon: Video,
        specs: [
            { label: "Display", value: "32\" 4K ProDisplay" },
            { label: "Camera", value: "Sony A7IV + Teleprompter" },
            { label: "Audio", value: "Shure SM7B + GoXLR" },
            { label: "Lighting", value: "Aputure 300D II Kit" },
        ],
        workflow: [
            "Script in teleprompter",
            "Record with pro camera",
            "Edit in DaVinci Resolve",
            "Export for all platforms",
        ],
        labStyle: "creative",
        liveryStyle: "aerodynamic",
    },
    {
        id: "station-power",
        name: "Power Forge",
        designation: "PF-1",
        description: "High-performance compute station for AI, data science, and heavy development",
        icon: Cpu,
        specs: [
            { label: "GPU", value: "NVIDIA RTX 4090 24GB" },
            { label: "CPU", value: "Intel i9-14900K" },
            { label: "RAM", value: "128GB DDR5" },
            { label: "Storage", value: "4TB NVMe RAID" },
        ],
        workflow: [
            "Connect to cloud datasets",
            "Train ML models locally",
            "Run inference tests",
            "Deploy to production",
        ],
        labStyle: "power",
        liveryStyle: "aggressive",
    },
    {
        id: "station-command",
        name: "Command Center",
        designation: "CMD-1",
        description: "Multi-monitor analytics and operations hub for data-driven founders",
        icon: Monitor,
        specs: [
            { label: "Displays", value: "3x 27\" 4K Curved" },
            { label: "Processor", value: "M3 Max MacBook Pro" },
            { label: "Peripherals", value: "Ergonomic keyboard + trackpad" },
            { label: "Connectivity", value: "Thunderbolt 4 dock" },
        ],
        workflow: [
            "Monitor real-time dashboards",
            "Analyze multi-source data",
            "Coordinate team comms",
            "Execute strategic decisions",
        ],
        labStyle: "command",
        liveryStyle: "tactical",
    },
    {
        id: "station-sound",
        name: "Sound Stage",
        designation: "SS-1",
        description: "Professional audio production for podcasts, music, and voiceover",
        icon: Mic,
        specs: [
            { label: "Interface", value: "Universal Audio Apollo x4" },
            { label: "Monitors", value: "Focal Shape 65" },
            { label: "Mics", value: "Neumann U87 + SM7B" },
            { label: "Treatment", value: "Acoustically treated booth" },
        ],
        workflow: [
            "Set up session in Logic Pro",
            "Record in treated space",
            "Mix with pro plugins",
            "Master for distribution",
        ],
        labStyle: "audio",
        liveryStyle: "precision",
    },
];

// ============================================================================
// PARTNER NETWORK DATA
// ============================================================================

export const partnerNetwork: Partner[] = [
    // Month 1 - Orientation
    { id: "p-1", name: "Startup Law Inc", category: "legal", integrationPhase: 1, description: "Entity formation and founder agreements" },
    { id: "p-2", name: "Notion", category: "infrastructure", integrationPhase: 1, description: "Knowledge base and documentation" },

    // Month 2 - Validation
    { id: "p-3", name: "Figma", category: "design", integrationPhase: 2, description: "Design and prototyping" },
    { id: "p-4", name: "Stripe", category: "finance", integrationPhase: 2, description: "Payment processing" },
    { id: "p-5", name: "Mailchimp", category: "marketing", integrationPhase: 2, description: "Email marketing and automation" },

    // Month 3 - MVP Build
    { id: "p-6", name: "Vercel", category: "infrastructure", integrationPhase: 3, description: "Frontend deployment" },
    { id: "p-7", name: "AWS", category: "infrastructure", integrationPhase: 3, description: "Cloud computing credits" },
    { id: "p-8", name: "GitHub", category: "development", integrationPhase: 3, description: "Code repository and CI/CD" },

    // Month 4 - Polish
    { id: "p-9", name: "Mixpanel", category: "development", integrationPhase: 4, description: "Product analytics" },
    { id: "p-10", name: "Intercom", category: "marketing", integrationPhase: 4, description: "Customer communication" },

    // Month 5 - GTM
    { id: "p-11", name: "Buffer", category: "marketing", integrationPhase: 5, description: "Social media management" },
    { id: "p-12", name: "PR Network", category: "marketing", integrationPhase: 5, description: "Press and media outreach" },

    // Month 6 - Launch
    { id: "p-13", name: "Investor Network", category: "finance", integrationPhase: 6, description: "Curated investor introductions" },
    { id: "p-14", name: "Amplitude", category: "development", integrationPhase: 6, description: "Growth analytics platform" },
];

// ============================================================================
// ROOMS DATA
// ============================================================================

export const benefitRooms: RoomCategory[] = [
    {
        id: "rooms-core",
        title: "Core Builders Rooms",
        description: "High-Impact, Always Relevant",
        sectorName: "SECTOR 1: ESSENTIALS",
        rooms: [
            {
                id: "room-build",
                name: "Build Room",
                description: "For heads-down execution. Silent or near-silent.",
                specs: ["Large desks", "Dual monitors", "Phone booths nearby"],
                vibe: "Library meets command center",
                corporateIcon: Wrench,
                racingCode: "ENGINEERING",
                capacity: "Team / Project",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4OIyrMMXZ9qdiUuDMhoptO0LJ6BkwGP3HcYaf",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$75/hr", // Fallback standard rate
                    builder: "$40/hr",
                    founder: "$40/hr",
                },
                isReservable: true,
            },
            {
                id: "room-strategy",
                name: "Strategy Room",
                description: "Whiteboards, acoustic privacy, serious planning.",
                specs: ["Whiteboards", "Acoustic privacy", "Planning"],
                vibe: "We need a breakthrough",
                corporateIcon: Compass,
                racingCode: "WAR ROOM",
                capacity: "4-6 Strategy Team",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4hW5OFH4UQ3jwa6yFtYW125Zoxkcvun4LqXVm",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$75/hr",
                    builder: "$40/hr",
                    founder: "$40/hr",
                },
                isReservable: true,
            },
            {
                id: "room-proto",
                name: "Prototype Lab",
                description: "3D printers, soldering, messy work allowed.",
                specs: ["3D printers", "Soldering stations", "Ventilation"],
                vibe: "Move fast and break things",
                corporateIcon: TestTube,
                racingCode: "WIND TUNNEL",
                capacity: "Maker Space",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4UiKWJvlCoTXf3SuOKzRnJ8qYtUGQL49e5lAr",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$130/hr",
                    builder: "$70/hr",
                    founder: "$70/hr",
                },
                isReservable: true,
            },
            {
                id: "room-super",
                name: "Super Station Suites",
                description: "High-spec Mac + PC stations for design, dev, video, AI, 3D.",
                specs: ["High-spec Mac + PC", "Design, dev, video, AI, 3D", "Reservable"],
                vibe: "I should’ve charged clients more",
                corporateIcon: Monitor,
                racingCode: "SIMULATOR RIGS",
                capacity: "Individual Pro",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4S2xHYMUvNJ3Vu4k9TDpej2hnfzsWOZIaQMbg",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$65/hr", // High-end rate
                    builder: "$40/hr",
                    founder: "$40/hr",
                },
                isReservable: true,
            },
        ],
    },
    {
        id: "rooms-creator",
        title: "Creator & Communication",
        description: "Beyond YouTube",
        sectorName: "SECTOR 2: MEDIA",
        rooms: [
            {
                id: "room-podcast",
                name: "Podcast / Audio Room",
                description: "Not everyone wants to be on camera.",
                specs: ["Pro mics", "Sound treatment", "Great for voiceovers"],
                vibe: "NPR but cooler",
                corporateIcon: Mic,
                racingCode: "COMMS CENTER",
                capacity: "2-4 People",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4i0Gj3ZPZmLlwuGtAOzUdC68HFc2SyEf5aJMh",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$120/hr",
                    builder: "$65/hr",
                    founder: "$65/hr",
                },
                isReservable: true,
            },
            {
                id: "room-youtube",
                name: "YouTube Creators Room",
                description: "High-fidelity production suite for long-form video content.",
                specs: ["4K Cinema Cams", "Pro Lighting Grid", "Acoustically Tuned"],
                vibe: "Studio Grade",
                corporateIcon: Video,
                racingCode: "MEDIA BROADCAST",
                capacity: "Production Team",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4gm24Q53MosxJGwkWj709SBXnAvEaTfN8tHFb",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$140/hr",
                    builder: "$75/hr",
                    founder: "$75/hr",
                },
                isReservable: true,
            },
            {
                id: "room-photo",
                name: "Photo + Product Shoot",
                description: "For founders who need assets now.",
                specs: ["Neutral backdrops", "Basic lighting", "Product shots"],
                vibe: "Clean, modern, no cheese",
                corporateIcon: Camera,
                racingCode: "MEDIA ZONE",
                capacity: "Studio Setup",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4G92QCf6PFSLElQM27UKC5ikde0gzyAofmRbj",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$150/hr",
                    builder: "$85/hr",
                    founder: "$85/hr",
                },
                isReservable: true,
            },
            {
                id: "room-studio",
                name: "TikTok Creators Room",
                description: "TikTok, Reels, Shorts. Blink and it’s uploaded.",
                specs: ["Vertical framing", "Quick setup", "No excuses left"],
                vibe: "Blink and it’s uploaded",
                corporateIcon: Video,
                racingCode: "BROADCAST",
                capacity: "1 Person + Cam",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4OkeYLUXZ9qdiUuDMhoptO0LJ6BkwGP3HcYaf",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$110/hr",
                    builder: "$60/hr",
                    founder: "$60/hr",
                },
                isReservable: true,
            },
        ],
    },
    {
        id: "rooms-business",
        title: "Business-Critical Rooms",
        description: "Underrated but Essential",
        sectorName: "SECTOR 3: OPS",
        rooms: [
            {
                id: "room-finance",
                name: "Finance & Admin Room",
                description: "Because taxes don’t care about vibes.",
                specs: ["Quiet, private", "Accounting", "Legal calls"],
                vibe: "Adulting, but supported",
                corporateIcon: TrendingUp,
                racingCode: "DATA TELEMETRY",
                capacity: "Private Office",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4o3UV3npRw3MsPATq4D12KOQJXxym8rvWEVjI",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$65/hr",
                    builder: "$35/hr",
                    founder: "$35/hr",
                },
                isReservable: true,
            },
            {
                id: "room-client",
                name: "Client Meeting Room",
                description: "For “yes, we’re a real business.”",
                specs: ["Polished but not stiff", "Screen for decks", "Demos"],
                vibe: "Confident, not corporate",
                corporateIcon: Handshake,
                racingCode: "HOSPITALITY",
                capacity: "6-8 People",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4MWfo6gAXehzPOLgZrAwvmTWM2iHk5o731Bdj",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$85/hr",
                    builder: "$45/hr",
                    founder: "$45/hr",
                },
                isReservable: true,
            },
            {
                id: "room-advisor",
                name: "Advisor / Office Hours",
                description: "Used by mentors, legal, finance, coaches.",
                specs: ["Bookable sessions", "Keeps wisdom centralized"],
                vibe: "Jedi Council (minus the robes)",
                corporateIcon: Gavel,
                racingCode: "STEWARDS",
                capacity: "1-on-1 / Small Group",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4K2mGBzrxeu5moFlNZ4LbPSX32YDMOwqcUTBv",
                isFeatured: true,
                isFreeForAll: true,
                isReservable: true,
            },
        ],
    },
    {
        id: "rooms-human",
        title: "Human Sustainability",
        description: "Very Important",
        sectorName: "SECTOR 4: RECOVERY",
        rooms: [
            {
                id: "room-kitchen",
                name: "Builders Kitchen",
                description: "Espresso, snacks, fridge. Casual collisions happen here.",
                specs: ["Espresso & Snacks", "Soft seating", "Casual collisions"],
                vibe: "Where partnerships form",
                corporateIcon: Coffee,
                racingCode: "CATERING",
                capacity: "Communal",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4hdrbg84UQ3jwa6yFtYW125Zoxkcvun4LqXVm",
                isFeatured: true,
                isFreeForAll: true,
                isReservable: false,
            },
            {
                id: "room-reset",
                name: "Focus Reset Room",
                description: "Burnout prevention. Low light, comfy chairs, no laptops.",
                specs: ["Low light", "Comfy chairs", "10–15 min reset"],
                vibe: "I’m not quitting, just need a minute",
                corporateIcon: Armchair,
                racingCode: "DRIVER LOUNGE",
                capacity: "Quiet Zone",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4AQS7EjONFUtr8CjzxYQ9kbi6aguyHROsBc2J",
                isFeatured: true,
                consumesFounderHours: true,
                pricing: {
                    guest: "$35/hr", // Estimated low rate relative to others
                    builder: "$15/hr",
                    founder: "$15/hr",
                },
                isReservable: false,
            },
        ],
    },
    {
        id: "rooms-power",
        title: "Smaller Power Rooms",
        description: "Specialized Functions",
        sectorName: "SECTOR 5: R&D",
        rooms: [
            {
                id: "room-ai",
                name: "AI Lab",
                description: "Prompt testing, workflows, automation.",
                specs: ["High compute", "Testing rigs"],
                vibe: "The Future",
                corporateIcon: Bot,
                racingCode: "SIMULATION",
                capacity: "Lab",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4iNmFg2PZmLlwuGtAOzUdC68HFc2SyEf5aJMh",
                isFeatured: true,
                comingSoon: true,
                isReservable: true,
            },
            {
                id: "room-hiring",
                name: "Hiring & Team Room",
                description: "Interviews, role design, team syncs.",
                specs: ["Private", "Interview setup"],
                vibe: "Growth",
                corporateIcon: UserPlus,
                racingCode: "SCOUTING",
                capacity: "Small Group",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4iNmFg2PZmLlwuGtAOzUdC68HFc2SyEf5aJMh",
                isFeatured: true,
                comingSoon: true,
                isReservable: true,
            },
            {
                id: "room-library",
                name: "Members Library",
                description: "Books, resources, calm.",
                specs: ["Curated books", "Reading nook"],
                vibe: "Wisdom",
                corporateIcon: BookOpen,
                racingCode: "ARCHIVE",
                capacity: "Quiet Reading",
                image: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4iNmFg2PZmLlwuGtAOzUdC68HFc2SyEf5aJMh",
                isFeatured: true,
                isFreeForAll: true,
                isReservable: false,
            },
        ],
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
