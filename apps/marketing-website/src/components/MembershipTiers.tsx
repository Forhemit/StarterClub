"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { ComparisonModal } from "./ComparisonModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
                <div className="max-w-3xl mx-auto mb-32">
                    <Accordion type="single" collapsible defaultValue="starter-builder" className="space-y-4">
                        {tiers.map((tier) => (
                            <AccordionItem
                                key={tier.id}
                                value={tier.id}
                                className={`rounded-2xl border overflow-hidden transition-all duration-300 border-black/5 bg-white data-[state=open]:shadow-lg data-[state=open]:ring-1 data-[state=open]:ring-black/5 ${tier.borderColor} data-[state=open]:${tier.bgColor} hover:border-black/10`}
                            >
                                <AccordionTrigger className="w-full flex items-center justify-between p-6 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                                    <div className="flex items-center gap-4 text-left">
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
                                    {/* Chevron is handled by AccordionTrigger but getting custom styling right is tricky. 
                                        Shadcn AccordionTrigger usually includes a Chevron. 
                                        I should check accordion.tsx or bring my own Chevron and hide the default if needed.
                                        But wait, standard simple AccordionTrigger usually contains the children AND the icon.
                                        If I use the standard imports, I might get a default icon.
                                        Let's assume I can compose the trigger content.
                                    */}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-8 pt-0 border-t border-black/5">
                                    <div className="pt-6">
                                        <p className="font-sans text-black/70 leading-relaxed max-w-2xl mb-8 text-base">
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
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
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
