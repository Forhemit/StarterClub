import type { BadgeVariant } from "./NavigationBadge";

/**
 * Navigation Data Structure
 * 
 * Intent-First Navigation: Grouped by visitor mindset, not internal structure
 * Progressive Disclosure: Show just enough to guide, not overwhelm
 * Credibility Arc: Build trust through logical sequence
 */

export interface NavigationItem {
    label: string;
    href: string;
    badge?: BadgeVariant;
    description?: string;
    subItems?: Array<{ label: string; href: string }>;
}

export interface NavigationSectionData {
    id: string;
    label: string;
    description: string;
    visualCue: "foundation" | "connection" | "structure" | "discovery" | "elevated";
    items: NavigationItem[];
}

export const navigationData: NavigationSectionData[] = [
    // ============================================================
    // 1. ABOUT US - Trust & Legitimacy
    // Visual Cue: Subtle foundation/structure pattern
    // Sequence: Belief → Action → Accountability → People
    // ============================================================
    {
        id: "about-us",
        label: "About Us",
        description: "The story, mission, and people behind Starter Club",
        visualCue: "foundation",
        items: [
            {
                label: "Our Story & Mission",
                href: "/about/story",
                description: "The why behind everything we build",
            },
            {
                label: "Our Impact",
                href: "/about/impact",
                description: "Proof of our mission in action",
            },
            {
                label: "Public Benefit Commitment",
                href: "/about/public-benefit",
                description: "Values + legal backbone",
            },
            {
                label: "Our Team",
                href: "/about/team",
                description: "The humans making it happen",
            },
            {
                label: "Careers",
                href: "/about/careers",
                description: "Join the team",
            },
            {
                label: "Contact Us",
                href: "/contact",
                description: "Get in touch",
            },
        ],
    },

    // ============================================================
    // 2. JOIN THE COMMUNITY - Action Hub
    // Visual Cue: Warmer tone, subtle "connection" pattern
    // Key Insight: Membership positioned as hero content
    // ============================================================
    {
        id: "join-community",
        label: "Join the Community",
        description: "Your gateway to San Francisco's most intentional startup ecosystem",
        visualCue: "connection",
        items: [
            {
                label: "Membership",
                href: "/membership",
                badge: "popular",
                description: "Full access to the Starter Club ecosystem",
            },
            {
                label: "Benefits & How to Join",
                href: "/membership/benefits",
                description: "Everything included with your membership",
            },
            {
                label: "Events",
                href: "/events",
                description: "Workshops, meetups, and community gatherings",
                subItems: [
                    { label: "Upcoming Events", href: "/events/upcoming" },
                    { label: "Past Highlights", href: "/events/past" },
                ],
            },
            {
                label: "Host an Event / Partner with Us",
                href: "/events/host",
                description: "Bring your event to our spaces",
            },
            {
                label: "Annual Summit",
                href: "/summit",
                badge: "flagship",
                description: "Our signature annual gathering",
            },
        ],
    },

    // ============================================================
    // 3. PROGRAMS & OFFERINGS - Solutions
    // Visual Cue: Clean, structured layout
    // Mandatory Page Structure: Who it's for | What you get | How it works | How to apply
    // ============================================================
    {
        id: "programs",
        label: "Programs & Offerings",
        description: "Tailored pathways for founders at every stage",
        visualCue: "structure",
        items: [
            {
                label: "For Founders & Startups",
                href: "/programs/founders",
                description: "From idea to product–market fit",
            },
            {
                label: "For Established Businesses",
                href: "/programs/established",
                description: "Scaling, resilience & legacy",
            },
            {
                label: "Accelerator Programs",
                href: "/programs/accelerator",
                badge: "required",
                description: "Cohort-based growth with accountability",
            },
        ],
    },

    // ============================================================
    // 4. RESOURCES - Discovery & Learning
    // Visual Cue: "Explore Starter Club" energy
    // ============================================================
    {
        id: "resources",
        label: "Resources",
        description: "Tools, insights, and inspiration for your journey",
        visualCue: "discovery",
        items: [
            {
                label: "Insights & Blog",
                href: "/blog",
                description: "Thoughts from our community",
            },
            {
                label: "Virtual Tour of Spaces",
                href: "/spaces/tour",
                description: "Explore where the magic happens",
            },
            {
                label: "FAQs",
                href: "/faq",
                description: "Common questions answered",
            },
            {
                label: "Starter Toolkit",
                href: "/resources/toolkit",
                description: "Templates, playbooks & frameworks",
            },
            {
                label: "Success Stories",
                href: "/stories",
                description: "Founders who built it here",
            },
        ],
    },

    // ============================================================
    // 5. PARTNER WITH US - High-Intent Path
    // Visual Cue: Distinct visual separation, elevated treatment
    // ============================================================
    {
        id: "partners",
        label: "Partner With Us",
        description: "Strategic collaboration opportunities for aligned organizations",
        visualCue: "elevated",
        items: [
            {
                label: "Our Partners & Sponsors",
                href: "/partners",
                description: "Organizations building alongside us",
            },
            {
                label: "Become a Partner",
                href: "/partners/become",
                description: "Opportunities, benefits & next steps",
            },
            {
                label: "Partner FAQ",
                href: "/partners/faq",
                description: "Common partnership questions",
            },
        ],
    },
];
