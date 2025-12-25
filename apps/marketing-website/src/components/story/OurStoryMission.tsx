"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Target,
    Compass,
    Heart,
    Shield,
    Rocket,
    Users,
    Award,
    ArrowRight,
    Sparkles,
    Gauge,
    Wrench,
    Timer,
    Flag,
    Zap,
    CheckCircle2,
} from "lucide-react";

// ============================================================================
// SECTION 1: HERO HEADER / EMOTIONAL HOOK
// ============================================================================
function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden block racetrack:hidden">
                {/* Cinematic Background */}
                <div className="absolute inset-0 z-0 bg-background overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none z-20" />
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse z-0" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full mix-blend-screen animate-pulse delay-1000 z-0" />

                    {/* Glowing Particles */}
                    <div className="absolute inset-0 z-10 w-full h-full">
                        {mounted && Array.from({ length: 30 }).map((_, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    background: "radial-gradient(circle at 30% 30%, #ffffff, #d4af37, #8a6e1d)",
                                }}
                                initial={{ opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
                                animate={{
                                    opacity: [0, Math.random() * 0.6 + 0.3, 0],
                                    scale: [0.5, 1.2, 0.5],
                                    y: [0, Math.random() * 80 + 40]
                                }}
                                transition={{
                                    duration: Math.random() * 4 + 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: Math.random() * 5
                                }}
                                className="absolute w-1.5 h-1.5 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                            />
                        ))}
                    </div>
                </div>

                <div className="relative z-30 container mx-auto px-4 text-center space-y-10">
                    {/* Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
                    >
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.2em]">Our Story & Mission</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="font-heading text-4xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight max-w-5xl mx-auto"
                    >
                        Building Tools to Unleash Your <br />
                        <span className="text-primary font-light italic">Business Potential</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-sans font-light leading-relaxed"
                    >
                        It all started with a simple frustration we all share—watching great businesses
                        fail not because of lack of talent, but lack of infrastructure.
                    </motion.p>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="pt-12"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-6 h-10 border-2 border-primary/30 rounded-full mx-auto flex items-start justify-center pt-2"
                        >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden hidden racetrack:block pt-20">
                {/* Grid Background */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 border border-signal-green/30 bg-signal-green/10 px-3 py-1 rounded text-xs font-mono text-signal-green uppercase tracking-widest">
                        <Gauge className="w-3 h-3" />
                        <span>Mission Control</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="font-sans text-5xl md:text-8xl font-bold text-foreground leading-tight uppercase tracking-tighter">
                        Your <span className="text-signal-green">Pit Crew</span><br />
                        For Business Health
                    </h1>

                    {/* Subheadline */}
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
                        We are mechanics for business health. We diagnose, tune, and fortify operations
                        so companies can perform at their peak—and sustain it.
                    </p>

                    {/* Scroll Indicator */}
                    <div className="pt-12">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-8 h-12 border-2 border-signal-green/30 rounded mx-auto flex items-start justify-center pt-2"
                        >
                            <div className="w-2 h-2 bg-signal-green rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// SECTION 2: ORIGIN STORY - THE "WHY"
// ============================================================================
function OriginStorySection() {
    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="w-full py-32 bg-muted/30 relative overflow-hidden block racetrack:hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">The Problem We Couldn't Ignore</span>
                            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                                It All Started When...
                            </h2>
                        </div>

                        {/* Story Paragraphs */}
                        <div className="space-y-8 text-muted-foreground text-lg leading-relaxed font-light">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-foreground font-medium">The Before State:</span> We watched brilliant entrepreneurs—people with incredible vision and relentless drive—stumble and fall. Not because their ideas weren't good enough. Not because they didn't work hard enough. But because the operational infrastructure beneath them was built on sand.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-foreground font-medium">The Catalyst:</span> We saw businesses collapse under compliance issues they didn't know existed. We witnessed founders burn out managing chaos instead of building dreams. The existing solutions were Band-Aids—generic checklists that expired the moment they were completed, consultants who charged fortunes for advice that didn't stick.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-foreground font-medium">The Decision:</span> That's when we knew something had to change. We decided to build what we wished existed—a continuous operational health system that diagnoses, monitors, and fortifies businesses for the long race ahead.
                            </motion.p>
                        </div>

                        {/* Decorative Quote */}
                        <motion.blockquote
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            viewport={{ once: true }}
                            className="border-l-4 border-primary pl-8 py-4 italic text-2xl text-foreground/80 font-heading"
                        >
                            "We are mechanics for business health. We diagnose, tune, and fortify operations so companies can perform at their peak—and sustain it."
                        </motion.blockquote>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-card border-t border-b border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Terminal-style Story */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 text-signal-yellow font-mono text-xs uppercase tracking-widest">
                                <Timer className="w-4 h-4" />
                                <span>System Log: Origin</span>
                            </div>

                            <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                                The Problem We<br />
                                <span className="text-signal-red">Couldn't Ignore</span>
                            </h2>

                            <div className="bg-background border border-border p-6 font-mono text-sm space-y-4">
                                <p className="text-signal-green">&gt; Scanning market conditions...</p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-red">[ERROR]</span> 60% of businesses fail within first 5 years
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-yellow">[WARN]</span> Root cause: operational infrastructure failure
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-yellow">[WARN]</span> Existing solutions: generic, static, expired on delivery
                                </p>
                                <p className="text-signal-green">&gt; Solution required: Continuous diagnostic system</p>
                                <p className="text-signal-green">&gt; Initializing Starter Club...</p>
                            </div>
                        </div>

                        {/* Right: Decision Statement */}
                        <div className="space-y-6 lg:pt-20">
                            <div className="bg-signal-green/10 border-l-4 border-signal-green p-6 space-y-4">
                                <h3 className="text-signal-green font-bold uppercase tracking-widest text-sm">The Decision</h3>
                                <p className="text-foreground font-mono text-lg">
                                    Build what we wished existed—a continuous operational health system that diagnoses, monitors, and fortifies businesses for the long race ahead.
                                </p>
                            </div>

                            <div className="bg-muted p-6 border border-border">
                                <p className="text-muted-foreground font-mono text-sm italic">
                                    "We are mechanics for business health. We diagnose, tune, and fortify operations so companies can perform at their peak—and sustain it."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// SECTION 3: JOURNEY & PROOF - BUILDING CREDIBILITY
// ============================================================================
const milestones = [
    { year: "2023", title: "The Spark", description: "Identified the gap in operational infrastructure for SMBs", icon: Sparkles },
    { year: "2024", title: "First Prototype", description: "Built the first version of our diagnostic framework", icon: Wrench },
    { year: "2024", title: "Community Launch", description: "Opened doors to first cohort of businesses in SF Bay Area", icon: Users },
    { year: "2025", title: "Continuous Engine", description: "Launched decay-aware compliance monitoring system", icon: Gauge },
];

const coreValues = [
    {
        title: "Customer Obsession",
        description: "We start with your problem, not our solution.",
        icon: Heart,
    },
    {
        title: "Long-Term Thinking",
        description: "We optimize for endurance, not quick wins.",
        icon: Timer,
    },
    {
        title: "Precision",
        description: "Every diagnostic, every recommendation—engineered to exactness.",
        icon: Target,
    },
    {
        title: "Resilience",
        description: "We build systems that don't just work—they last.",
        icon: Shield,
    },
];

function JourneySection() {
    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="w-full py-32 bg-background relative overflow-hidden block racetrack:hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center mb-20 space-y-4"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Our Journey</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            Guided by Our Core Beliefs
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left: Timeline */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-medium text-foreground border-b border-border pb-4">Milestones</h3>
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.year + milestone.title}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex gap-6 items-start group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <milestone.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-primary text-sm font-medium">{milestone.year}</span>
                                        <h4 className="text-foreground font-medium text-lg">{milestone.title}</h4>
                                        <p className="text-muted-foreground text-sm">{milestone.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right: Core Values */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-medium text-foreground border-b border-border pb-4">Core Values</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {coreValues.map((value, index) => (
                                    <motion.div
                                        key={value.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-6 bg-muted/30 border border-border hover:border-primary/30 transition-colors group"
                                    >
                                        <value.icon className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                        <h4 className="text-foreground font-medium mb-2">{value.title}</h4>
                                        <p className="text-muted-foreground text-sm">{value.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-muted border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest">
                            <Flag className="w-4 h-4" />
                            <span>Race Log</span>
                        </div>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            Our Journey to <span className="text-signal-green">Get Here</span>
                        </h2>
                    </div>

                    {/* Timeline - Horizontal Race Track Style */}
                    <div className="relative mb-20">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
                        <div className="flex justify-between items-center relative">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.year + milestone.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center w-1/4 px-2"
                                >
                                    <div className="w-12 h-12 bg-card border-2 border-signal-green rounded-full flex items-center justify-center mb-4 relative z-10">
                                        <milestone.icon className="w-5 h-5 text-signal-green" />
                                    </div>
                                    <span className="text-signal-green font-mono text-xs">{milestone.year}</span>
                                    <h4 className="text-foreground font-bold uppercase text-sm mt-1">{milestone.title}</h4>
                                    <p className="text-muted-foreground font-mono text-xs mt-1 hidden md:block">{milestone.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Core Values Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {coreValues.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border p-6 text-center hover:border-signal-green/50 transition-colors"
                            >
                                <value.icon className="w-8 h-8 text-signal-green mx-auto mb-4" />
                                <h4 className="text-foreground font-bold uppercase text-xs tracking-widest">{value.title}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// SECTION 4: MISSION & VISION TODAY
// ============================================================================
function MissionVisionSection() {
    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="w-full py-32 bg-muted/50 relative overflow-hidden block racetrack:hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center mb-20 space-y-4"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">The Future We're Building</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            Mission & Vision
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold text-foreground">Our Mission</h3>
                            </div>
                            <div className="pl-16">
                                <p className="text-foreground text-lg leading-relaxed">
                                    Our mission is simple:
                                </p>
                                <p className="text-primary text-xl font-medium mt-4 leading-relaxed italic">
                                    To tune the operational health of businesses—optimizing them for sustained performance, resilience, and long-term growth.
                                </p>
                            </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Compass className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold text-foreground">Our Vision</h3>
                            </div>
                            <div className="pl-16">
                                <p className="text-foreground text-lg leading-relaxed">
                                    We envision a world where:
                                </p>
                                <p className="text-primary text-xl font-medium mt-4 leading-relaxed italic">
                                    The San Francisco Bay Area is recognized as the world's premier proving ground for business—where every enterprise can optimize performance, navigate challenges, and finish the long race ahead.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* PBC Statement */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-20 p-10 bg-background border border-primary/20 relative"
                    >
                        <div className="absolute -top-4 left-8 px-4 py-1 bg-primary text-primary-foreground text-xs uppercase tracking-widest">
                            Public Benefit Corporation
                        </div>
                        <div className="flex items-start gap-6">
                            <Shield className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
                            <div className="space-y-4">
                                <p className="text-foreground text-lg leading-relaxed">
                                    We act as the civic pit crew for San Francisco's economic engine. By providing essential diagnostics, maintenance, and performance tuning for local businesses, we reduce failure rates, extend operational lifespans, and improve the resilience of the regional economy.
                                </p>
                                <p className="text-muted-foreground italic">
                                    Our public benefit is measured in economic durability: uptime, resilience, and longevity of community businesses that form the backbone of our city.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-background border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest">
                            <Rocket className="w-4 h-4" />
                            <span>Mission Control</span>
                        </div>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            Mission & <span className="text-signal-green">Vision</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border p-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <Target className="w-8 h-8 text-signal-green" />
                                <h3 className="text-foreground font-bold uppercase tracking-widest">Mission</h3>
                            </div>
                            <p className="text-foreground font-mono text-lg leading-relaxed border-l-4 border-signal-green pl-6">
                                To tune the operational health of businesses—optimizing them for sustained performance, resilience, and long-term growth.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border p-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <Compass className="w-8 h-8 text-signal-green" />
                                <h3 className="text-foreground font-bold uppercase tracking-widest">Vision</h3>
                            </div>
                            <p className="text-foreground font-mono text-lg leading-relaxed border-l-4 border-signal-green pl-6">
                                For the San Francisco Bay Area to be recognized as the world's premier proving ground for business.
                            </p>
                        </motion.div>
                    </div>

                    {/* PBC Telemetry Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-signal-green/5 border border-signal-green/30 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 bg-signal-green rounded-full animate-pulse" />
                            <span className="text-signal-green font-mono text-xs uppercase tracking-widest">Public Benefit Corporation Status: Active</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-signal-green font-mono text-3xl font-bold">UPTIME</p>
                                <p className="text-muted-foreground font-mono text-sm mt-2">Economic Durability KPI</p>
                            </div>
                            <div>
                                <p className="text-signal-green font-mono text-3xl font-bold">RESILIENCE</p>
                                <p className="text-muted-foreground font-mono text-sm mt-2">Regional Backbone Strength</p>
                            </div>
                            <div>
                                <p className="text-signal-green font-mono text-3xl font-bold">LONGEVITY</p>
                                <p className="text-muted-foreground font-mono text-sm mt-2">Community Business Lifespan</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground font-mono text-sm mt-8 text-center italic">
                            "We are the civic pit crew, ensuring the local economy doesn't just start fast—but finishes strong."
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// SECTION 5: INVITATION & CTA - THE PIVOT
// ============================================================================
function InvitationSection() {
    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="w-full py-32 bg-background relative overflow-hidden block racetrack:hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full" />

                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center space-y-10"
                    >
                        {/* Tagline */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20"
                        >
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="text-primary font-heading text-lg tracking-widest">Diagnose. Tune. Endure.</span>
                        </motion.div>

                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            This Mission Drives Everything We Do
                        </h2>

                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Including how we design our tools and services to help you build a business that doesn't just win—but lasts.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                            <a
                                href="/"
                                className="group relative px-10 py-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 font-sans text-sm uppercase tracking-[0.2em] font-semibold flex items-center gap-3">
                                    See How We Put This Into Action
                                    <ArrowRight className="w-4 h-4  group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </a>

                            <a
                                href="/"
                                className="group px-10 py-5 border border-primary/30 text-foreground hover:border-primary transition-all duration-500"
                            >
                                <span className="font-sans text-sm uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                                    Join Our Mission
                                </span>
                            </a>
                        </div>

                        {/* Trust Signals */}
                        <div className="pt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>San Francisco Based</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>Public Benefit Corporation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>Built for Longevity</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-muted border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4 text-center">
                    {/* Tagline Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 border border-signal-green/30 bg-signal-green/10 px-6 py-3 mb-8"
                    >
                        <Zap className="w-5 h-5 text-signal-green" />
                        <span className="text-signal-green font-mono uppercase tracking-widest">Diagnose. Tune. Endure.</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="font-sans text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tighter mb-6"
                    >
                        Ready to <span className="text-signal-green">Tune Up</span>?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto mb-12"
                    >
                        This mission drives everything we build. See how our tools help you win the long race.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <a
                            href="/"
                            className="px-10 py-5 bg-signal-green text-carbon font-bold uppercase tracking-widest hover:bg-signal-green/90 transition-all flex items-center gap-3"
                        >
                            See It In Action
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <a
                            href="/"
                            className="px-10 py-5 border border-border text-foreground font-mono uppercase tracking-widest hover:bg-secondary/50 transition-all"
                        >
                            Join the Mission
                        </a>
                    </motion.div>

                    {/* Trust Signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="pt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground font-mono text-xs uppercase tracking-widest"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-signal-green rounded-full" />
                            <span>SF Bay Area</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-signal-green rounded-full" />
                            <span>PBC Certified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-signal-green rounded-full" />
                            <span>Built for Endurance</span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export function OurStoryMission() {
    return (
        <>
            <HeroSection />
            <OriginStorySection />
            <JourneySection />
            <MissionVisionSection />
            <InvitationSection />
        </>
    );
}
