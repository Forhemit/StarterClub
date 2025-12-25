"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { membershipTiers } from "../data/membershipData";
import { ArrowRight, Users, Rocket, Crown, Check } from "lucide-react";

// ============================================================================
// SECTION 7: CALL TO ALIGNMENT
// Goal: Convert interest into commitment - "Where do you start?"
// Corporate: Minimalist decision matrix with value-oriented CTAs
// Racing: Pre-race start menu with race entry options
// ============================================================================

const tierIcons = {
    "starter-member": Users,
    "starter-builder": Rocket,
    "starter-founder": Crown,
};

const tierLabels = {
    corporate: {
        "starter-member": { cta: "Join the Commons", subtitle: "Explore the ecosystem" },
        "starter-builder": { cta: "Start Building", subtitle: "Launch your journey" },
        "starter-founder": { cta: "Schedule Strategy Session", subtitle: "Accelerate your growth" },
    },
    racing: {
        "starter-member": { cta: "Spectator Access", subtitle: "View from the stands" },
        "starter-builder": { cta: "Enter Rookie Series", subtitle: "Get on track" },
        "starter-founder": { cta: "Secure Team Garage", subtitle: "Full factory support" },
    },
};

export function CallToAlignment() {
    const [hoveredTier, setHoveredTier] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden">
            {/* ================================================================
                CORPORATE THEME - Decision Matrix
            ================================================================ */}
            <div className="block racetrack:hidden relative z-10 bg-background">
                {/* Background Accent */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                            Where Do You Start?
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
                            You have the blueprint. You have the network. You have the tools.
                            <br />
                            <span className="text-primary font-semibold">Choose your entry point.</span>
                        </p>
                    </motion.div>

                    {/* Tier Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {membershipTiers.map((tier, index) => {
                            const Icon = tierIcons[tier.id as keyof typeof tierIcons] || Users;
                            const labels = tierLabels.corporate[tier.id as keyof typeof tierLabels.corporate];
                            const isHovered = hoveredTier === tier.id;
                            const isFounder = tier.id === "starter-founder";

                            return (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0 : 0.5,
                                        delay: index * 0.1
                                    }}
                                    onMouseEnter={() => setHoveredTier(tier.id)}
                                    onMouseLeave={() => setHoveredTier(null)}
                                    className={`
                                        relative overflow-hidden rounded-2xl transition-all duration-500
                                        ${isFounder
                                            ? "bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/30"
                                            : "bg-card border border-border"
                                        }
                                        ${isHovered
                                            ? "shadow-2xl shadow-primary/10 -translate-y-2"
                                            : "shadow-lg"
                                        }
                                    `}
                                >
                                    {/* Featured Badge */}
                                    {isFounder && (
                                        <div className="absolute top-0 right-0">
                                            <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                                                Most Popular
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-8">
                                        {/* Icon */}
                                        <div className={`
                                            w-16 h-16 rounded-xl flex items-center justify-center mb-6
                                            transition-all duration-500
                                            ${isHovered || isFounder
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                            }
                                        `}>
                                            <Icon className="w-8 h-8" />
                                        </div>

                                        {/* Tier Name */}
                                        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                                            {tier.name}
                                        </h3>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-1 mb-4">
                                            <span className="text-3xl font-bold text-foreground">${tier.monthlyPrice}</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-muted-foreground text-sm mb-6">
                                            {tier.tagline}
                                        </p>

                                        {/* Key Benefits */}
                                        <ul className="space-y-3 mb-8">
                                            {tier.benefits.slice(0, 3).map((benefit) => (
                                                <li key={benefit.id} className="flex items-start gap-2 text-sm">
                                                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                    <span className="text-foreground">{benefit.title}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <button className={`
                                            w-full py-4 rounded-xl font-semibold transition-all duration-300
                                            flex items-center justify-center gap-2 group
                                            ${isFounder
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
                                                : "bg-muted text-foreground hover:bg-muted/80"
                                            }
                                        `}>
                                            <span>{labels?.cta || "Get Started"}</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        {/* Subtitle */}
                                        <p className="text-center text-xs text-muted-foreground mt-3">
                                            {labels?.subtitle || tier.tagline}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <p className="text-muted-foreground text-sm">
                            Not sure which tier is right?
                            <button className="text-primary font-semibold ml-1 hover:underline">
                                Take our 2-minute assessment
                            </button>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Pre-Race Start Menu
            ================================================================ */}
            <div className="hidden racetrack:block relative z-10 bg-muted border-t border-border">
                {/* Grid Background */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `
                                linear-gradient(#00ff9d 1px, transparent 1px),
                                linear-gradient(90deg, #00ff9d 1px, transparent 1px)
                            `,
                            backgroundSize: "50px 50px",
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 border border-signal-green/30 bg-signal-green/5 mb-6 font-mono text-xs uppercase tracking-widest text-signal-green">
                            <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                            Race Entry
                        </div>
                        <h2 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-foreground uppercase tracking-tight mb-4">
                            Select Your Grid
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                            Choose your entry class and join the grid.
                        </p>
                    </motion.div>

                    {/* Race Entry Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                        {membershipTiers.map((tier, index) => {
                            const Icon = tierIcons[tier.id as keyof typeof tierIcons] || Users;
                            const labels = tierLabels.racing[tier.id as keyof typeof tierLabels.racing];
                            const isHovered = hoveredTier === tier.id;
                            const isFounder = tier.id === "starter-founder";

                            return (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0 : 0.5,
                                        delay: index * 0.1
                                    }}
                                    onMouseEnter={() => setHoveredTier(tier.id)}
                                    onMouseLeave={() => setHoveredTier(null)}
                                    className={`
                                        relative overflow-hidden transition-all duration-300
                                        bg-carbon-light border
                                        ${isFounder
                                            ? "border-signal-green shadow-[0_0_30px_rgba(0,255,157,0.2)]"
                                            : isHovered
                                                ? "border-signal-green/50"
                                                : "border-border"
                                        }
                                    `}
                                >
                                    {/* Top Indicator */}
                                    <div className={`
                                        h-1 w-full transition-all duration-300
                                        ${isFounder || isHovered ? "bg-signal-green" : "bg-border"}
                                    `} />

                                    {/* Featured Badge */}
                                    {isFounder && (
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 bg-signal-green text-carbon font-mono text-[10px] uppercase tracking-widest">
                                                Factory Team
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Vehicle Class */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`
                                                w-12 h-12 flex items-center justify-center border transition-all duration-300
                                                ${isFounder || isHovered
                                                    ? "border-signal-green bg-signal-green/10 text-signal-green"
                                                    : "border-border text-muted-foreground"
                                                }
                                            `}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                                                    {tier.vehicleName}
                                                </span>
                                                <h3 className="font-sans text-xl font-bold text-foreground uppercase tracking-tight">
                                                    {tier.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Price Tag */}
                                        <div className="flex items-baseline gap-2 mb-4 p-3 bg-background/50 border border-border">
                                            <span className="font-mono text-2xl font-bold text-signal-green">${tier.monthlyPrice}</span>
                                            <span className="font-mono text-xs text-muted-foreground">/MONTH</span>
                                        </div>

                                        {/* Quick Stats */}
                                        <ul className="space-y-2 mb-6">
                                            {tier.benefits.slice(0, 3).map((benefit) => (
                                                <li key={benefit.id} className="flex items-center gap-2 font-mono text-xs">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-signal-green" />
                                                    <span className="text-foreground">{benefit.racingLabel || benefit.title}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <button className={`
                                            w-full py-4 font-mono text-sm uppercase tracking-wider transition-all duration-300
                                            flex items-center justify-center gap-2 group
                                            ${isFounder
                                                ? "bg-signal-green text-carbon hover:bg-signal-green/90"
                                                : "border border-border text-foreground hover:border-signal-green hover:text-signal-green"
                                            }
                                        `}>
                                            <span>{labels?.cta || "Enter"}</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        {/* Subtitle */}
                                        <p className="text-center font-mono text-[10px] text-muted-foreground mt-3 uppercase tracking-widest">
                                            {labels?.subtitle || tier.tagline}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom Assessment Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <button className="font-mono text-sm text-muted-foreground hover:text-signal-green transition-colors uppercase tracking-widest">
                            [Run Driver Assessment] →
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
