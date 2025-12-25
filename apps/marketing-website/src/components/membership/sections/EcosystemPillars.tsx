"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ecosystemPillars } from "../data/membershipData";
import { ArrowDown } from "lucide-react";

// ============================================================================
// SECTION 2: ECOSYSTEM PILLARS
// Goal: Visually introduce the three core benefits as interconnected systems
// Corporate: Clean, interconnected triad of nodes
// Racing: Racing team schematic with pit crew hierarchy
// ============================================================================

export function EcosystemPillars() {
    const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden">
            {/* ================================================================
                CORPORATE THEME - Interconnected Triad Network
            ================================================================ */}
            <div className="block racetrack:hidden relative z-10">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                            backgroundSize: "40px 40px",
                        }}
                    />
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
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 mb-6">
                            The Ecosystem
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Four Pillars of Momentum
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
                            An interconnected system designed to transform you from idea to launched business
                        </p>
                    </motion.div>

                    {/* Pillars Grid with Connection Lines */}
                    <div className="relative max-w-5xl mx-auto">
                        {/* Connection Lines (SVG) */}
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
                            viewBox="0 0 1000 300"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Line 1: Crew -> Blueprint */}
                            <motion.line
                                x1="125" y1="150" x2="375" y2="150"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-border"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: shouldReduceMotion ? 0 : 1, delay: 0.5 }}
                            />
                            {/* Line 2: Blueprint -> Spaces */}
                            <motion.line
                                x1="375" y1="150" x2="625" y2="150"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-border"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: shouldReduceMotion ? 0 : 1, delay: 0.7 }}
                            />
                            {/* Line 3: Spaces -> Arsenal */}
                            <motion.line
                                x1="625" y1="150" x2="875" y2="150"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-border"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: shouldReduceMotion ? 0 : 1, delay: 0.9 }}
                            />

                            {/* Pulse Effect on Hover */}
                            {hoveredPillar && (
                                <motion.circle
                                    cx={
                                        hoveredPillar === "pillar-crew" ? 125 :
                                            hoveredPillar === "pillar-blueprint" ? 375 :
                                                hoveredPillar === "pillar-spaces" ? 625 :
                                                    875
                                    }
                                    cy="150"
                                    r="60"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                    initial={{ scale: 0.8, opacity: 0.8 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}
                        </svg>

                        {/* Pillars Cards */}
                        {/* Pillars Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                            {ecosystemPillars.map((pillar, index) => {
                                const Icon = pillar.icon;
                                const isHovered = hoveredPillar === pillar.id;

                                return (
                                    <motion.div
                                        key={pillar.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: shouldReduceMotion ? 0 : 0.6,
                                            delay: index * 0.15
                                        }}
                                        onMouseEnter={() => setHoveredPillar(pillar.id)}
                                        onMouseLeave={() => setHoveredPillar(null)}
                                        className={`
                                            group relative p-8 rounded-2xl cursor-pointer
                                            bg-card border border-border/50
                                            transition-all duration-500
                                            ${isHovered ? "shadow-2xl shadow-primary/10 border-primary/30 -translate-y-2" : "hover:shadow-lg"}
                                        `}
                                    >
                                        {/* Icon */}
                                        <div className={`
                                            w-16 h-16 rounded-xl flex items-center justify-center mb-6
                                            transition-all duration-500
                                            ${isHovered
                                                ? "bg-primary text-primary-foreground scale-110"
                                                : "bg-muted text-muted-foreground"
                                            }
                                        `}>
                                            <Icon className="w-8 h-8" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                                            {pillar.name}
                                        </h3>
                                        <p className="text-primary font-sans text-sm font-semibold uppercase tracking-wider mb-4">
                                            {pillar.tagline}
                                        </p>
                                        <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                                            {pillar.corporateDescription}
                                        </p>

                                        {/* Hover Arrow */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                                            className="absolute bottom-4 right-4 text-primary"
                                        >
                                            <ArrowDown className="w-5 h-5 transform rotate-[-45deg]" />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scroll Hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-center mt-16"
                    >
                        <p className="text-muted-foreground text-sm mb-3 font-sans">
                            Explore each pillar below
                        </p>
                        <motion.div
                            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ArrowDown className="w-5 h-5 mx-auto text-primary/50" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Team Schematic / Pit Crew Hierarchy
            ================================================================ */}
            <div className="hidden racetrack:block relative z-10">
                {/* Grid Background */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                                linear-gradient(#333 1px, transparent 1px),
                                linear-gradient(90deg, #333 1px, transparent 1px)
                            `,
                            backgroundSize: "50px 50px",
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 border border-signal-green/30 bg-signal-green/5 mb-6 font-mono text-xs uppercase tracking-widest text-signal-green">
                            <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                            Team Configuration
                        </div>
                        <h2 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-foreground uppercase tracking-tight mb-4">
                            Your Pit Wall
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
                            Three integrated systems. One winning formula.
                        </p>
                    </motion.div>

                    {/* Racing Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {ecosystemPillars.map((pillar, index) => {
                            const Icon = pillar.icon;
                            const isHovered = hoveredPillar === pillar.id;

                            return (
                                <motion.div
                                    key={pillar.id}
                                    initial={{ opacity: 0, x: index === 0 ? -30 : index === 2 ? 30 : 0, y: index === 1 ? 30 : 0 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0 : 0.6,
                                        delay: index * 0.15
                                    }}
                                    onMouseEnter={() => setHoveredPillar(pillar.id)}
                                    onMouseLeave={() => setHoveredPillar(null)}
                                    className={`
                                        group relative overflow-hidden cursor-pointer
                                        bg-carbon-light border transition-all duration-300
                                        ${isHovered
                                            ? "border-signal-green shadow-[0_0_30px_rgba(0,255,157,0.2)]"
                                            : "border-border hover:border-signal-green/50"
                                        }
                                    `}
                                >
                                    {/* Top Bar Indicator */}
                                    <div className={`
                                        h-1 w-full transition-all duration-300
                                        ${isHovered ? "bg-signal-green" : "bg-border"}
                                    `} />

                                    <div className="p-6">
                                        {/* Label */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-mono text-xs uppercase tracking-widest text-signal-green">
                                                {pillar.racingLabel}
                                            </span>
                                            <Icon className={`
                                                w-5 h-5 transition-colors duration-300
                                                ${isHovered ? "text-signal-green" : "text-muted-foreground"}
                                            `} />
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-sans text-2xl font-bold text-foreground uppercase tracking-tight mb-3">
                                            {pillar.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                                            {pillar.racingDescription}
                                        </p>

                                        {/* Status Indicator */}
                                        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
                                            <div className={`
                                                w-2 h-2 rounded-full transition-colors duration-300
                                                ${isHovered ? "bg-signal-green animate-pulse" : "bg-muted-foreground"}
                                            `} />
                                            <span className="font-mono text-xs text-muted-foreground uppercase">
                                                {isHovered ? "Active" : "Standby"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover Scanline Effect */}
                                    {isHovered && !shouldReduceMotion && (
                                        <motion.div
                                            initial={{ top: 0 }}
                                            animate={{ top: "100%" }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="absolute left-0 right-0 h-px bg-signal-green/50 pointer-events-none"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Connection Line Visualization */}
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-2">
                            {[0, 1, 2, 3].map((i) => (
                                <React.Fragment key={i}>
                                    <div className="w-3 h-3 rounded-full bg-signal-green/30 border border-signal-green" />
                                    {i < 3 && (
                                        <motion.div
                                            className="w-16 h-px bg-signal-green/30"
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
