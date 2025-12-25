"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { partnerNetwork, builderTrackPhases } from "../data/membershipData";
import { Users, Zap, ArrowRight } from "lucide-react";

// ============================================================================
// SECTION 6: PARTNER CATALYST
// Goal: Show the partner network as a force multiplier integrated into the journey
// Both themes: Dynamic ecosystem map with timeline scrubber
// ============================================================================

// Category colors for visual distinction
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    design: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
    development: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
    finance: { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
    legal: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
    marketing: { bg: "bg-pink-500/10", text: "text-pink-500", border: "border-pink-500/30" },
    infrastructure: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30" },
};

export function PartnerCatalyst() {
    const [activePhase, setActivePhase] = useState(1);
    const shouldReduceMotion = useReducedMotion();

    // Get partners for active phase and all previous phases
    const activePartners = partnerNetwork.filter(p => p.integrationPhase <= activePhase);
    const currentPhasePartners = partnerNetwork.filter(p => p.integrationPhase === activePhase);
    const activePhaseData = builderTrackPhases.find(p => p.month === activePhase);

    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden">
            {/* ================================================================
                CORPORATE THEME
            ================================================================ */}
            <div className="block racetrack:hidden relative z-10 bg-muted/50">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 mb-6">
                            The Catalyst
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Partner Network
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
                            Strategic partners integrated at the exact moment you need them in your journey.
                        </p>
                    </motion.div>

                    {/* Timeline Scrubber */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="flex items-center justify-between gap-2">
                            {builderTrackPhases.map((phase) => (
                                <button
                                    key={phase.id}
                                    onClick={() => setActivePhase(phase.month)}
                                    className={`
                                        flex-1 py-3 px-2 text-center transition-all duration-300 rounded-lg
                                        ${activePhase === phase.month
                                            ? "bg-primary text-primary-foreground shadow-lg"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }
                                    `}
                                >
                                    <div className="text-xs font-mono mb-1">M{phase.month}</div>
                                    <div className="text-xs font-semibold hidden sm:block truncate">
                                        {phase.title.split(" ")[0]}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ecosystem Map */}
                    <div className="max-w-5xl mx-auto">
                        {/* Central Member Node */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                {/* Member Badge */}
                                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                                    <Users className="w-10 h-10 text-primary-foreground" />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-card border border-border rounded-full text-xs font-semibold">
                                    You
                                </div>
                            </motion.div>

                            {/* Connection Line */}
                            <div className="w-px h-12 bg-gradient-to-b from-primary to-border" />

                            {/* Phase Label */}
                            <motion.div
                                key={activePhase}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-8"
                            >
                                <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium">
                                    Month {activePhase}: {activePhaseData?.title}
                                </span>
                            </motion.div>
                        </div>

                        {/* Partner Cards */}
                        <motion.div
                            key={activePhase}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {currentPhasePartners.map((partner, index) => {
                                const colors = categoryColors[partner.category];
                                return (
                                    <motion.div
                                        key={partner.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`
                                            p-5 bg-card border rounded-xl transition-all duration-300
                                            hover:shadow-lg hover:-translate-y-1
                                            ${colors.border}
                                        `}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={`
                                                px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full
                                                ${colors.bg} ${colors.text}
                                            `}>
                                                {partner.category}
                                            </span>
                                            <Zap className={`w-4 h-4 ${colors.text}`} />
                                        </div>
                                        <h4 className="font-semibold text-foreground mb-1">
                                            {partner.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {partner.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Unlocked Partners Summary */}
                        <div className="mt-12 text-center">
                            <p className="text-muted-foreground text-sm mb-4">
                                By Month {activePhase}, you&apos;ll have access to:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {activePartners.map((partner) => {
                                    const colors = categoryColors[partner.category];
                                    const isCurrentPhase = partner.integrationPhase === activePhase;
                                    return (
                                        <span
                                            key={partner.id}
                                            className={`
                                                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                                ${isCurrentPhase
                                                    ? `${colors.bg} ${colors.text} ring-2 ring-offset-2 ring-offset-background ${colors.border}`
                                                    : "bg-muted text-muted-foreground"
                                                }
                                            `}
                                        >
                                            {partner.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME
            ================================================================ */}
            <div className="hidden racetrack:block relative z-10 bg-background border-t border-b border-border">
                <div className="container mx-auto px-4 py-16">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 border border-signal-green/30 bg-signal-green/5 mb-6 font-mono text-xs uppercase tracking-widest text-signal-green">
                            <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                            Sponsor Network
                        </div>
                        <h2 className="font-sans text-5xl md:text-6xl font-bold text-foreground uppercase tracking-tight mb-4">
                            Factory Partners
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                            Integrated support from the paddock's best suppliers.
                        </p>
                    </motion.div>

                    {/* Lap Selector */}
                    <div className="flex justify-center gap-2 mb-12">
                        {builderTrackPhases.map((phase) => (
                            <button
                                key={phase.id}
                                onClick={() => setActivePhase(phase.month)}
                                className={`
                                    px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all duration-300
                                    ${activePhase === phase.month
                                        ? "bg-signal-green text-carbon"
                                        : "border border-border text-muted-foreground hover:border-signal-green hover:text-signal-green"
                                    }
                                `}
                            >
                                LAP {phase.month}
                            </button>
                        ))}
                    </div>

                    {/* Partner Grid */}
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            key={activePhase}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {currentPhasePartners.map((partner, index) => (
                                <motion.div
                                    key={partner.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-5 bg-carbon-light border border-border hover:border-signal-green transition-all duration-300"
                                >
                                    {/* Category Badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-mono text-[10px] text-signal-green uppercase tracking-widest">
                                            {partner.category}
                                        </span>
                                        <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Partner Name */}
                                    <h4 className="font-sans text-lg font-bold text-foreground uppercase tracking-tight mb-2 group-hover:text-signal-green transition-colors">
                                        {partner.name}
                                    </h4>

                                    {/* Description */}
                                    <p className="font-mono text-xs text-muted-foreground">
                                        {partner.description}
                                    </p>

                                    {/* Status */}
                                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                                            Available Lap {partner.integrationPhase}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-signal-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Accumulated Partners */}
                        <div className="mt-12 p-6 border border-border bg-carbon-light">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="font-mono text-xs text-signal-green uppercase tracking-widest">
                                    Total Sponsors Unlocked
                                </span>
                                <span className="px-2 py-0.5 bg-signal-green text-carbon font-mono text-xs font-bold">
                                    {activePartners.length}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {activePartners.map((partner) => {
                                    const isCurrentPhase = partner.integrationPhase === activePhase;
                                    return (
                                        <span
                                            key={partner.id}
                                            className={`
                                                px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all
                                                ${isCurrentPhase
                                                    ? "bg-signal-green text-carbon"
                                                    : "border border-border text-muted-foreground"
                                                }
                                            `}
                                        >
                                            {partner.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
