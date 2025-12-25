"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { builderTrackPhases, partnerNetwork } from "../data/membershipData";
import {
    CheckCircle2,
    Circle,
    ChevronRight,
    Calendar,
    Package,
    Users,
    Flag
} from "lucide-react";

// ============================================================================
// SECTION 4: YOUR BLUEPRINT (6-MONTH BUILDER TRACK)
// Goal: Make the structured journey feel like an immersive, achievable adventure
// Corporate: Large-format Gantt chart / architectural timeline
// Racing: Race circuit map with 6 sectors
// ============================================================================

export function BuilderTrack() {
    const [activeMonth, setActiveMonth] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Progress bar animation based on scroll
    const progressWidth = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

    // Get partners for active month
    const activePartners = partnerNetwork.filter(p => p.integrationPhase === activeMonth);

    return (
        <section ref={containerRef} className="relative w-full py-24 md:py-32 overflow-hidden">
            {/* ================================================================
                CORPORATE THEME - Architectural Timeline / Gantt Chart
            ================================================================ */}
            <div className="block racetrack:hidden relative z-10 bg-muted/30">
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
                            Pillar 2 · The Blueprint
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Your 6-Month Journey
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
                            A structured path from idea validation to market launch. Each month builds on the last.
                        </p>
                    </motion.div>

                    {/* Timeline Progress Bar */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="relative h-2 bg-border rounded-full overflow-hidden">
                            <motion.div
                                className="absolute left-0 top-0 h-full bg-primary rounded-full"
                                style={{ width: progressWidth }}
                            />
                        </div>
                        <div className="flex justify-between mt-3">
                            {builderTrackPhases.map((phase) => (
                                <button
                                    key={phase.id}
                                    onClick={() => setActiveMonth(phase.month)}
                                    className={`
                                        flex flex-col items-center transition-all duration-300
                                        ${activeMonth === phase.month
                                            ? "text-primary scale-110"
                                            : "text-muted-foreground hover:text-foreground"
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-4 h-4 rounded-full border-2 transition-all duration-300
                                        ${activeMonth >= phase.month
                                            ? "bg-primary border-primary"
                                            : "bg-background border-border"
                                        }
                                    `} />
                                    <span className="text-xs font-mono mt-2 hidden sm:block">M{phase.month}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Month Detail Card */}
                    <motion.div
                        key={activeMonth}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-4xl mx-auto"
                    >
                        {builderTrackPhases.filter(p => p.month === activeMonth).map((phase) => (
                            <div
                                key={phase.id}
                                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
                            >
                                {/* Header */}
                                <div className="p-6 md:p-8 border-b border-border bg-muted/50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                                    Month {phase.month}
                                                </span>
                                                <span className="text-muted-foreground text-sm font-mono">
                                                    {phase.subtitle}
                                                </span>
                                            </div>
                                            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                                                {phase.title}
                                            </h3>
                                        </div>
                                        <div className="hidden md:flex w-16 h-16 rounded-xl bg-primary/10 items-center justify-center">
                                            <Calendar className="w-8 h-8 text-primary" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                                    {/* Deliverables */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Package className="w-4 h-4 text-primary" />
                                            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                                Deliverables
                                            </h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {phase.deliverables.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Tools */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Package className="w-4 h-4 text-primary" />
                                            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                                Tools Unlocked
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {phase.tools.map((tool, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 bg-muted text-foreground text-xs font-mono rounded-full"
                                                >
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Partners */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-primary" />
                                            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                                Partner Access
                                            </h4>
                                        </div>
                                        {activePartners.length > 0 ? (
                                            <ul className="space-y-2">
                                                {activePartners.map((partner) => (
                                                    <li key={partner.id} className="text-sm">
                                                        <span className="font-semibold text-foreground">{partner.name}</span>
                                                        <span className="text-muted-foreground"> · {partner.description}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                {phase.partners.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Navigation Arrows */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => setActiveMonth(Math.max(1, activeMonth - 1))}
                            disabled={activeMonth === 1}
                            className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                        >
                            Previous Month
                        </button>
                        <button
                            onClick={() => setActiveMonth(Math.min(6, activeMonth + 1))}
                            disabled={activeMonth === 6}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            Next Month
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Circuit Map with 6 Sectors
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
                            Race Strategy Board
                        </div>
                        <h2 className="font-sans text-5xl md:text-6xl font-bold text-foreground uppercase tracking-tight mb-4">
                            6-LAP Championship
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                            Each sector hones your machine. Each lap builds momentum.
                        </p>
                    </motion.div>

                    {/* Track Visualization */}
                    <div className="max-w-5xl mx-auto">
                        {/* Sector Buttons */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                            {builderTrackPhases.map((phase) => (
                                <button
                                    key={phase.id}
                                    onClick={() => setActiveMonth(phase.month)}
                                    className={`
                                        relative p-4 border transition-all duration-300
                                        ${activeMonth === phase.month
                                            ? "border-signal-green bg-signal-green/10 shadow-[0_0_20px_rgba(0,255,157,0.2)]"
                                            : "border-border bg-carbon-light hover:border-signal-green/50"
                                        }
                                    `}
                                >
                                    {/* Sector Number */}
                                    <div className="font-mono text-xs text-muted-foreground mb-2">
                                        SECTOR {phase.month}
                                    </div>

                                    {/* Sector Label */}
                                    <div className={`
                                        font-sans text-sm font-bold uppercase tracking-tight
                                        ${activeMonth === phase.month ? "text-signal-green" : "text-foreground"}
                                    `}>
                                        {phase.sectorLabel}
                                    </div>

                                    {/* Active Indicator */}
                                    {activeMonth === phase.month && (
                                        <motion.div
                                            layoutId="sector-indicator"
                                            className="absolute inset-x-0 bottom-0 h-1 bg-signal-green"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Active Sector Detail */}
                        <motion.div
                            key={activeMonth}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {builderTrackPhases.filter(p => p.month === activeMonth).map((phase) => (
                                <div
                                    key={phase.id}
                                    className="border border-border bg-carbon-light overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="p-6 border-b border-border flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Flag className="w-4 h-4 text-signal-green" />
                                                <span className="font-mono text-xs text-signal-green uppercase tracking-widest">
                                                    LAP {phase.month} OF 6
                                                </span>
                                            </div>
                                            <h3 className="font-sans text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
                                                {phase.title}
                                            </h3>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="font-mono text-xs text-muted-foreground mb-1">OBJECTIVE</div>
                                            <div className="font-mono text-sm text-signal-green">{phase.subtitle}</div>
                                        </div>
                                    </div>

                                    {/* Telemetry Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                                        {/* Checkpoints */}
                                        <div className="p-6">
                                            <div className="font-mono text-xs text-muted-foreground uppercase mb-4">
                                                Checkpoints
                                            </div>
                                            <ul className="space-y-3">
                                                {phase.deliverables.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Circle className="w-3 h-3 text-signal-green mt-1 shrink-0" />
                                                        <span className="font-mono text-sm text-foreground">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Pit Equipment */}
                                        <div className="p-6">
                                            <div className="font-mono text-xs text-muted-foreground uppercase mb-4">
                                                Pit Equipment
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {phase.tools.map((tool, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 border border-signal-green/30 bg-signal-green/5 text-signal-green text-xs font-mono"
                                                    >
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sponsor Support */}
                                        <div className="p-6">
                                            <div className="font-mono text-xs text-muted-foreground uppercase mb-4">
                                                Sponsor Support
                                            </div>
                                            {activePartners.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {activePartners.map((partner) => (
                                                        <li key={partner.id} className="font-mono text-sm text-foreground">
                                                            {partner.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="font-mono text-sm text-muted-foreground">
                                                    {phase.partners.join(" • ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="p-4 border-t border-border bg-background/50">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-xs text-muted-foreground">PROGRESS</span>
                                            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-signal-green"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(phase.month / 6) * 100}%` }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                            <span className="font-mono text-xs text-signal-green">
                                                {Math.round((phase.month / 6) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
