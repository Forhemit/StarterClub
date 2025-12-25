"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Timer,
    Target,
    Shield,
    Sparkles,
    Wrench,
    Users,
    Gauge,
    Flag,
    Trophy,
    Zap,
    Clock
} from "lucide-react";

/**
 * CareersJourney - Section 3: Credibility / Desire Building
 * 
 * Corporate Theme (Glassmorphism Refined):
 * - Syne ExtraBold + General Sans typography
 * - Concentric circles with orbiting values
 * - Frosted glass panels with orange highlights
 * - Multi-layer blur with refractive quality
 * - Interactive proof dial (simplified)
 * 
 * Racing Theme (Maximalist/Chaos):
 * - Bebas Neue + Fira Code typography
 * - Race weekend schedule format
 * - Starting grid chaos with team colors
 * - Pit wall strategy board
 * - Achievements "lapping" the screen
 */

const milestones = [
    {
        year: "2023",
        title: "The Spark",
        description: "Identified the gap in operational infrastructure for SMBs",
        icon: Sparkles,
        session: "Practice 1",
        time: "+0.000",
    },
    {
        year: "2024 Q1",
        title: "First Prototype",
        description: "Built the first version of our diagnostic framework",
        icon: Wrench,
        session: "Practice 2",
        time: "+0.342",
    },
    {
        year: "2024 Q3",
        title: "Community Launch",
        description: "Opened doors to first cohort of businesses in SF Bay Area",
        icon: Users,
        session: "Qualifying",
        time: "+0.567",
    },
    {
        year: "2025",
        title: "Team Expansion",
        description: "Growing the pit crew to serve more businesses",
        icon: Gauge,
        session: "Race",
        time: "P1",
    },
];

const coreValues = [
    {
        title: "Customer Obsession",
        description: "We start with your problem, not our solution. Every feature, every decision flows from real customer needs.",
        icon: Heart,
        color: "#ff4d00",
    },
    {
        title: "Long-Term Thinking",
        description: "We optimize for endurance, not quick wins. Building for decades, not quarters.",
        icon: Timer,
        color: "#00f0ff",
    },
    {
        title: "Precision",
        description: "Every diagnostic, every recommendation—engineered to exactness. No guesswork.",
        icon: Target,
        color: "#ffd700",
    },
    {
        title: "Resilience",
        description: "We build systems that don't just work—they last. Stress-tested for the unexpected.",
        icon: Shield,
        color: "#00ff9d",
    },
];

// Team colors for racing chaos effect
const teamColors = [
    "#e10600", "#00d2be", "#ff8700", "#006f62", "#0090ff",
    "#2293d1", "#b6babd", "#b4a259", "#00e701", "#1e1e1e",
];

export function CareersJourney() {
    const [activeYear, setActiveYear] = useState("all");

    return (
        <>
            {/* ========== CORPORATE / GLASSMORPHISM THEME ========== */}
            <section className="relative w-full py-32 overflow-hidden block racetrack:hidden bg-background">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                    {/* Concentric Circles Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                        {[1, 2, 3, 4, 5].map((ring) => (
                            <motion.div
                                key={ring}
                                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                                transition={{ duration: 60 + ring * 10, ease: "linear", repeat: Infinity }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary/30 rounded-full"
                                style={{
                                    width: `${ring * 200}px`,
                                    height: `${ring * 200}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Gradient Orbs */}
                    <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#ff4d00]/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-primary/10 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em] mb-4 block">
                            Our Journey
                        </span>
                        <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
                            Built on Core Beliefs
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            These aren't just words on a wall. They're the decision-making framework that guides every hire, every feature, every customer interaction.
                        </p>
                    </motion.div>

                    {/* Year Filter (Simplified Proof Dial) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex justify-center gap-4 mb-16"
                    >
                        {["all", "2023", "2024", "2025"].map((year) => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                className={`px-6 py-2 font-mono text-sm uppercase tracking-widest transition-all ${activeYear === year
                                        ? "bg-[#ff4d00] text-white"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left: Timeline */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-foreground border-b border-border pb-4 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[#ff4d00]" />
                                Milestones
                            </h3>

                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff4d00] via-primary/50 to-transparent" />

                                <div className="space-y-8">
                                    {milestones
                                        .filter(m => activeYear === "all" || m.year.includes(activeYear))
                                        .map((milestone, index) => (
                                            <motion.div
                                                key={milestone.title}
                                                initial={{ opacity: 0, x: -30 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                                viewport={{ once: true }}
                                                className="flex gap-6 items-start group"
                                            >
                                                <div className="flex-shrink-0 w-12 h-12 glass-card rounded-full flex items-center justify-center group-hover:bg-[#ff4d00]/20 transition-colors z-10">
                                                    <milestone.icon className="w-5 h-5 text-[#ff4d00]" />
                                                </div>
                                                <div className="glass-card p-6 flex-1 group-hover:border-[#ff4d00]/30 transition-colors">
                                                    <span className="text-[#ff4d00] text-sm font-mono">{milestone.year}</span>
                                                    <h4 className="text-foreground font-medium text-lg mt-1">{milestone.title}</h4>
                                                    <p className="text-muted-foreground text-sm mt-2">{milestone.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Core Values */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-foreground border-b border-border pb-4 flex items-center gap-3">
                                <Heart className="w-5 h-5 text-[#ff4d00]" />
                                Core Values
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {coreValues.map((value, index) => (
                                    <motion.div
                                        key={value.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="glass-card p-6 hover:border-[#ff4d00]/30 transition-all group"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${value.color}20` }}
                                        >
                                            <value.icon className="w-5 h-5" style={{ color: value.color }} />
                                        </div>
                                        <h4 className="text-foreground font-medium mb-2">{value.title}</h4>
                                        <p className="text-muted-foreground text-sm">{value.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== RACING / MAXIMALIST THEME ========== */}
            <section className="relative w-full py-24 overflow-hidden hidden racetrack:block bg-background border-t border-border">
                {/* Racing Grid Background */}
                <div className="absolute inset-0 racing-grid opacity-30" />

                {/* Team Color Chaos Stripes */}
                <div className="absolute top-0 left-0 right-0 h-2 flex">
                    {teamColors.map((color, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest mb-4">
                            <Flag className="w-4 h-4" />
                            <span>Race Weekend</span>
                        </div>
                        <h2 className="font-sans text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tighter">
                            Our Journey to <span className="text-signal-green">Get Here</span>
                        </h2>
                    </div>

                    {/* Race Weekend Schedule */}
                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="bg-card border border-border">
                            {/* Header Row */}
                            <div className="grid grid-cols-4 gap-4 p-4 bg-muted border-b border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                                <div>Session</div>
                                <div>Milestone</div>
                                <div className="hidden sm:block">Status</div>
                                <div className="text-right">Gap</div>
                            </div>

                            {/* Session Rows */}
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: teamColors[index] }}
                                        />
                                        <span className="font-mono text-sm text-muted-foreground">
                                            {milestone.session}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-foreground font-bold">{milestone.title}</span>
                                        <p className="text-muted-foreground text-xs mt-1 hidden md:block">
                                            {milestone.description}
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex items-center">
                                        <span className="px-2 py-1 bg-signal-green/20 text-signal-green text-xs font-mono uppercase">
                                            Complete
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-mono text-lg font-bold ${index === milestones.length - 1 ? "text-signal-green" : "text-muted-foreground"
                                            }`}>
                                            {milestone.time}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pit Wall Strategy Board - Core Values */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <Trophy className="w-6 h-6 text-signal-yellow" />
                            <h3 className="font-sans text-2xl font-bold text-foreground uppercase tracking-tighter">
                                Pit Wall Strategy
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {coreValues.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-card border border-border p-6 text-center hover:border-signal-green/50 transition-colors relative overflow-hidden"
                                >
                                    {/* Color accent bar */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1"
                                        style={{ backgroundColor: value.color }}
                                    />

                                    <value.icon className="w-8 h-8 mx-auto mb-4" style={{ color: value.color }} />
                                    <h4 className="text-foreground font-bold uppercase text-sm tracking-widest mb-2">
                                        {value.title}
                                    </h4>
                                    <p className="text-muted-foreground font-mono text-xs">
                                        {value.description.split('.')[0]}.
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Achievement Counter */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="mt-16 flex justify-center gap-8 md:gap-16"
                    >
                        {[
                            { label: "Milestones Hit", value: "4" },
                            { label: "Values Defined", value: "4" },
                            { label: "Race Position", value: "P1" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl md:text-5xl font-orbitron font-bold text-signal-green">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-2">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom Team Color Stripes */}
                <div className="absolute bottom-0 left-0 right-0 h-2 flex">
                    {teamColors.slice().reverse().map((color, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}
