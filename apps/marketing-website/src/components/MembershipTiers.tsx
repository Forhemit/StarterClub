"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { ComparisonModal } from "./ComparisonModal";
import { FoundingMemberCTA } from "@/components/FoundingMemberCTA";

// --- Types ---

type TierFeature = {
    category: string;
    items: string[];
};

type PricingTier = {
    id: string;
    name: string;
    icon: string;
    color: string;
    borderColor: string;
    bgColor: string;
    description: string;
    audience: string;
    features: TierFeature[];
};

// --- Data ---

const tiers: PricingTier[] = [
    {
        id: "starter-member",
        name: "Starter Member",
        icon: "🟦",
        color: "text-blue-600",
        borderColor: "border-blue-100",
        bgColor: "bg-blue-50/50",
        description: "For curious newcomers, early-stage dreamers, students, and locals exploring what’s possible.",
        audience: "Free",
        features: [
            {
                category: "Access & Space",
                items: [
                    "Access to The Commons during open hours",
                    "Community tables, outlets, high-speed Wi-Fi",
                    "Invitation to Open House Events, demos, and community nights",
                    "View-only access to the Starter Wall (wins & milestones)",
                ],
            },
            {
                category: "Learning & Tools",
                items: [
                    "Free intro classes (Business 101, Idea Warm-Up, YouTube Basics)",
                    "Starter Roadmap Lite (orientation + first 2 steps)",
                    "Basic templates inside the Starter Portal",
                    "Eligible to purchase Starter Packs and Add-Ons",
                ],
            },
            {
                category: "Community",
                items: [
                    "Access to community feed / Discord",
                    "Participation in public meetups & icebreakers",
                    "Passport Stamps for intro workshops",
                ],
            },
            {
                category: "Support",
                items: [
                    "On-site welcome desk assistance",
                    "Monthly group accountability check-in",
                ],
            },
            {
                category: "Perks",
                items: [
                    "Member pricing for paid events",
                    "Starter-level partner discounts",
                ],
            },
        ],
    },
    {
        id: "starter-builder",
        name: "Starter Builder",
        icon: "🟩",
        color: "text-green-600",
        borderColor: "border-green-100",
        bgColor: "bg-green-50/50",
        description: "For operators, freelancers, creatives, and founders who are actively building something and want structure, accountability, and real momentum.",
        audience: "Balanced",
        features: [
            {
                category: "Space & Access",
                items: [
                    "Full access to the Members Area",
                    "Daily access to Focus Rooms (baseline hours included)",
                    "Access to Workshop Rooms when available",
                    "Members-only kitchenette",
                    "Monthly guest passes",
                    "Access to the Operator Club + industry circles",
                ],
            },
            {
                category: "Learning & Tools",
                items: [
                    "Full Starter Roadmap (Idea → Foundation → First Wins)",
                    "Unlimited access to all weekly classes & skill labs",
                    "Builder Templates Library (pitch decks, dashboards, pricing models, COA presets)",
                    "Super Station time included (Mac + PC)",
                    "Early access to new Starter Packs and Marketplace Add-ons",
                ],
            },
            {
                category: "Community & Coaching",
                items: [
                    "Monthly 1:1 onboarding coaching session (personalized guidance)",
                    "Monthly Group Coaching Circle",
                    "Priority placement in Collaboration Pods",
                    "Eligibility for Milestone Awards",
                ],
            },
            {
                category: "Visibility",
                items: [
                    "Featured placement on the Wins Wall",
                    "Ability to post opportunities + collaborations in Member Feed",
                ],
            },
            {
                category: "Perks",
                items: [
                    "Enhanced partner discounts",
                    "Discounts on add-ons and room rentals",
                ],
            },
        ],
    },
    {
        id: "starter-founder",
        name: "Starter Founder",
        icon: "🟥",
        color: "text-red-600",
        borderColor: "border-red-100",
        bgColor: "bg-red-50/50",
        description: "For serious builders ready for acceleration, deep support, and visibility. The “I’m building something real” tier.",
        audience: "Aspirational",
        features: [
            {
                category: "Space & Access",
                items: [
                    "Priority booking for all rooms",
                    "Extended Focus Room time",
                    "Unlimited Super Station hours",
                    "Early access to new tech, pilots, and space expansions",
                    "Additional guest passes",
                    "Optional business mailbox address (or discounted add-on)",
                ],
            },
            {
                category: "Learning & Tools",
                items: [
                    "Access to advanced workshops, masterclasses, intensives",
                    "Personalized Starter Roadmap Pro with milestone tracking",
                    "Founder Toolkit Library (investor templates, KPI dashboards, advanced COAs)",
                    "Free or discounted Starter Packs included in membership",
                ],
            },
            {
                category: "Coaching & Accountability",
                items: [
                    "Monthly 1:1 Founder Session (deep strategic guidance)",
                    "Quarterly Business Review with a program lead",
                    "Guaranteed placement in Founder Roundtables",
                    "Automatic inclusion in Operator Club and the Founders Circle",
                ],
            },
            {
                category: "Visibility & Influence",
                items: [
                    "High-priority placement on the Wins Wall + digital showcases",
                    "Eligibility for Pitch Nights, Demo Days, and showcases",
                    "Featured Founder Stories (video, newsletter, social spotlights)",
                    "Opportunities to teach, mentor, or co-host events",
                ],
            },
            {
                category: "Premium Perks",
                items: [
                    "Highest-tier partner perks",
                    "Larger discounts on add-ons + room bookings",
                    "Exclusive merch drops + early-access invites",
                ],
            },
        ],
    },
];



interface MembershipTiersProps {
    onWaitlistOpen: () => void;
}

export function MembershipTiers({ onWaitlistOpen }: MembershipTiersProps) {
    const [activeTier, setActiveTier] = useState<string | null>("starter-builder");
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="w-full py-24 bg-white">
            <div className="w-full max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-black"
                    >
                        Membership Levels
                    </motion.h2>
                    <p className="font-sans text-xl text-black/60 max-w-2xl mx-auto">
                        Starter • Builder • Founder
                    </p>
                </div>

                {/* Accordion Layout */}
                <div className="max-w-3xl mx-auto mb-32 space-y-4">
                    {tiers.map((tier) => {
                        const isOpen = activeTier === tier.id;
                        return (
                            <motion.div
                                key={tier.id}
                                initial={false}
                                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen ? `shadow-lg ring-1 ring-black/5 ${tier.borderColor} ${tier.bgColor}` : 'border-black/5 bg-white hover:border-black/10'}`}
                            >
                                <button
                                    onClick={() => setActiveTier(isOpen ? null : tier.id)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl">{tier.icon}</div>
                                        <div>
                                            <h3 className="font-bebas text-2xl tracking-wide text-black">
                                                {tier.name}
                                            </h3>
                                            <p className="font-sans text-xs font-bold uppercase tracking-wider text-black/40">
                                                {tier.audience}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className={`w-6 h-6 ${isOpen ? tier.color : 'text-black/20'}`} />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial="collapsed"
                                            animate="open"
                                            exit="collapsed"
                                            variants={{
                                                open: { opacity: 1, height: "auto" },
                                                collapsed: { opacity: 0, height: 0 }
                                            }}
                                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 pb-8 pt-2 border-t border-black/5">
                                                <p className="font-sans text-black/70 leading-relaxed max-w-2xl mb-8">
                                                    {tier.description}
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {tier.features.map((section, idx) => (
                                                        <div key={idx}>
                                                            <h4 className={`font-sans font-bold text-xs uppercase tracking-widest mb-3 opacity-60`}>
                                                                {section.category}
                                                            </h4>
                                                            <ul className="space-y-3">
                                                                {section.items.map((item, i) => (
                                                                    <li key={i} className="flex items-start gap-3 text-sm text-black/80 leading-snug">
                                                                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.color}`} />
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Button */}
                <div className="w-full text-center">

                    <FoundingMemberCTA onOpen={onWaitlistOpen} />

                    <div className="mb-8">
                        <h3 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide mb-4">
                            Not sure which plan is right for you?
                        </h3>
                        <p className="text-black/60 font-sans max-w-xl mx-auto">
                            Compare features, access levels, and benefits across all membership tiers to find your perfect fit.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-black/90 transition-all hover:scale-105"
                    >
                        <span>Compare All Features</span>
                        <div className="bg-white/20 rounded-full p-1">
                            <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>

                <ComparisonModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

            </div>
        </section>
    );
}
