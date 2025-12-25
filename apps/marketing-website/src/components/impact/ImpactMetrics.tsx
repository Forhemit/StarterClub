"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Stethoscope,
    Shield,
    DollarSign,
    Dna,
    Building2,
    ChevronDown,
    ArrowRight,
    Target,
    Compass,
    Heart,
    CheckCircle2,
    Mail,
    TrendingUp,
    Flag,
    Gauge,
    BarChart3,
    Sparkles,
    Calendar,
} from "lucide-react";

// ============================================================================
// DATA
// ============================================================================

const metricsCategories = [
    {
        id: 1,
        emoji: "🧑‍🤝‍🧑",
        title: "Access & Inclusion Metrics",
        subtitle: "Are we actually open to everyone?",
        icon: Users,
        metrics: [
            "Total active members served",
            "Percentage of members accessing free tools/services",
            "Percentage of members from low- or moderate-income backgrounds (self-reported, optional)",
            "Number of businesses served with $0 required spend",
            "Average cost to member for core services (goal: as close to $0 as possible)"
        ],
        whyItMatters: "This proves Starter Club expands opportunity, not just networks for the already-connected.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        emoji: "🩺",
        title: "Business Health & Diagnostics Metrics",
        subtitle: "Are businesses getting healthier?",
        icon: Stethoscope,
        metrics: [
            "Number of businesses receiving a diagnostic / audit / health check",
            "Baseline vs. follow-up Business Health Scores (your future secret weapon 👀)",
            "Top recurring risk categories identified (cash flow, ops, documentation, governance, etc.)",
            "Percentage of businesses that complete remediation steps"
        ],
        whyItMatters: "This shows preventative care, not emergency intervention.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        emoji: "🔧",
        title: "Resilience & Risk Reduction Metrics",
        subtitle: "Are we reducing failure points?",
        icon: Shield,
        metrics: [
            "Number of businesses implementing documented systems or SOPs",
            "Reduction in single-point-of-failure risks (founder dependency, undocumented processes)",
            "Crisis readiness indicators (backup access, financial visibility, continuity planning)",
            "Businesses supported through an actual disruption (economic, operational, leadership)"
        ],
        whyItMatters: "Resilient businesses don't just survive storms — they shorten recovery time.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        emoji: "💰",
        title: "Sustainability & Profitability Metrics",
        subtitle: "Are businesses becoming economically healthier?",
        icon: DollarSign,
        metrics: [
            "Percentage of businesses reporting improved cash flow (self-reported, ranges allowed)",
            "Percentage reporting improved operational efficiency",
            "Percentage reporting revenue stability or growth",
            "Number of businesses transitioning from fragile → sustainable operations"
        ],
        whyItMatters: "Profitability is not a dirty word — it's how businesses stay alive.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 5,
        emoji: "🧬",
        title: "Transferability & Legacy Metrics",
        subtitle: "Are businesses built to outlive their founders?",
        icon: Dna,
        metrics: [
            "Number of businesses with documented operations",
            "Number with transferable ownership structures or exit readiness",
            "Businesses that changed ownership without shutting down",
            "Founders reporting reduced day-to-day dependency"
        ],
        whyItMatters: "Transferable businesses preserve jobs, value, and community continuity.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 6,
        emoji: "🌉",
        title: "Regional Economic Durability Metrics",
        subtitle: "Is the ecosystem getting stronger?",
        icon: Building2,
        metrics: [
            "Business survival rate of Starter Club members (year over year)",
            "Average business age of active member companies",
            "Jobs supported or stabilized (direct + indirect, estimated)",
            "Neighborhoods served across San Francisco & the Bay Area"
        ],
        whyItMatters: "This reframes success as uptime, not hype.",
        image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=60"
    }
];

const timelineGoals = [
    { year: "2026", title: "Foundation Year", description: "Establish baseline metrics across all 6 pillars for our first cohort of members." },
    { year: "2027", title: "Scale Access", description: "Double the number of businesses accessing free diagnostics and tools." },
    { year: "2028", title: "Prove Resilience", description: "Demonstrate measurable reduction in failure rates among member businesses." },
    { year: "2029", title: "Regional Impact", description: "Expand coverage to 10+ Bay Area neighborhoods with documented economic impact." },
    { year: "2030", title: "Legacy Model", description: "Publish replicable framework for other regions to build durable local economies." }
];

// ============================================================================
// HERO SECTION
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
                <div className="absolute inset-0 z-0 bg-background overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none z-20" />
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse z-0" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full mix-blend-screen animate-pulse delay-1000 z-0" />

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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
                    >
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.2em]">Annual Public Benefit Metrics</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="font-heading text-4xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight max-w-5xl mx-auto"
                    >
                        Creating the Best Place in the World to <br />
                        <span className="text-primary font-light italic">Start, Operate & Own a Business</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-sans font-light leading-relaxed"
                    >
                        We measure what matters: access, health, resilience, sustainability, legacy, and regional durability.
                        Think of it as your annual inspection sticker.
                    </motion.p>

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
                    <div className="inline-flex items-center gap-2 border border-signal-green/30 bg-signal-green/10 px-3 py-1 rounded text-xs font-mono text-signal-green uppercase tracking-widest">
                        <BarChart3 className="w-3 h-3" />
                        <span>Impact Metrics: Active</span>
                    </div>

                    <h1 className="font-sans text-5xl md:text-8xl font-bold text-foreground leading-tight uppercase tracking-tighter">
                        Our <span className="text-signal-green">Impact</span>
                    </h1>

                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
                        PBC-grade annual metrics framework. Measuring durability, not vanity.
                    </p>

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
// DECLARATION SECTION
// ============================================================================
function DeclarationSection() {
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
                        <div className="text-center space-y-4">
                            <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Our Impact Statement</span>
                            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                                The Impact of Our Vision
                            </h2>
                        </div>

                        <motion.blockquote
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="border-l-4 border-primary pl-8 py-4 text-xl md:text-2xl text-foreground/90 font-heading italic leading-relaxed"
                        >
                            "This year, Starter Club improved the operational health, resilience, and longevity of X businesses, expanded access to free business support for Y members, reduced critical failure risks across Z companies, and contributed to a more durable local economy in San Francisco and the Bay Area."
                        </motion.blockquote>

                        <div className="space-y-8 text-muted-foreground text-lg leading-relaxed font-light">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="p-8 bg-background border border-border"
                            >
                                <h3 className="text-foreground font-medium text-xl mb-4">Your Annual Inspection Sticker</h3>
                                <p className="mb-4">
                                    We're mechanics for business health. Just like a car needs regular maintenance and inspections to stay on the road, businesses need regular diagnostics to stay operational.
                                </p>
                                <p>
                                    Our annual Public Benefit Report is your proof that we're doing the work—not just talking about it. Every metric we track is designed to demonstrate measurable impact on business durability.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-card border-t border-b border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest">
                                <TrendingUp className="w-4 h-4" />
                                <span>Impact Statement</span>
                            </div>

                            <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                                Annual <span className="text-signal-green">Report</span>
                            </h2>

                            <div className="bg-signal-green/10 border-l-4 border-signal-green p-6 space-y-4">
                                <p className="text-foreground font-mono text-lg leading-relaxed">
                                    "Starter Club improved health, resilience, and longevity of X businesses this year."
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 lg:pt-20">
                            <div className="bg-background border border-border p-6 font-mono text-sm space-y-4">
                                <p className="text-signal-yellow">&gt; Loading impact metrics...</p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-green">[STATUS]</span> Framework: Active
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-green">[STATUS]</span> Tracking: 6 pillars
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-yellow">[GOAL]</span> Annual report: Q1 2025
                                </p>
                                <p className="text-signal-green">&gt; Think of it as your annual inspection sticker</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// METRICS PILLARS SECTION
// ============================================================================
function MetricsPillarsSection() {
    const [expandedId, setExpandedId] = useState<number | null>(null);

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
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">What We Measure</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            Six Pillars of Impact
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Our PBC-grade metrics framework tracks what truly matters for business durability.
                        </p>
                    </motion.div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {metricsCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="border border-border bg-card overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === category.id ? null : category.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                                            {category.emoji}
                                        </div>
                                        <div className="text-left">
                                            <span className="text-primary text-xs font-mono">Pillar {category.id}</span>
                                            <h3 className="text-foreground font-medium text-lg">{category.title}</h3>
                                            <p className="text-muted-foreground text-sm">{category.subtitle}</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedId === category.id ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {expandedId === category.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-primary text-sm font-medium mb-3">What We Measure</h4>
                                                        <ul className="space-y-2">
                                                            {category.metrics.map((metric, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                                    <span>{metric}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-primary text-sm font-medium mb-2">Why It Matters</h4>
                                                        <p className="text-muted-foreground text-sm">{category.whyItMatters}</p>
                                                    </div>
                                                </div>
                                                <div className="relative h-48 md:h-auto overflow-hidden rounded">
                                                    <img
                                                        src={category.image}
                                                        alt={category.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-muted border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest">
                            <Gauge className="w-4 h-4" />
                            <span>Metrics Framework</span>
                        </div>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            Six <span className="text-signal-green">Pillars</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {metricsCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border p-6 hover:border-signal-green/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{category.emoji}</span>
                                    <span className="text-signal-green font-mono text-xs">P{category.id}</span>
                                </div>
                                <h4 className="text-foreground font-bold uppercase text-sm tracking-widest mb-2">{category.title}</h4>
                                <p className="text-muted-foreground font-mono text-xs mb-4">{category.subtitle}</p>
                                <div className="border-t border-border pt-4 mt-4">
                                    <p className="text-signal-green font-mono text-xs">{category.whyItMatters}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// CORE METRICS TABLE SECTION
// ============================================================================
function CoreMetricsTableSection() {
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
                        className="text-center mb-16 space-y-4"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Impact Manifestation</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            How Our Impact Manifests
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="overflow-hidden border border-border bg-background"
                    >
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="p-4 text-left text-primary font-medium text-sm uppercase tracking-wider">Pillar</th>
                                    <th className="p-4 text-left text-primary font-medium text-sm uppercase tracking-wider">Why It Matters</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metricsCategories.map((category, index) => (
                                    <tr key={category.id} className={`border-b border-border ${index % 2 === 0 ? '' : 'bg-muted/20'}`}>
                                        <td className="p-4 text-foreground font-medium">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{category.emoji}</span>
                                                <span>{category.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground text-sm">{category.whyItMatters}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-background border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest">
                            <Gauge className="w-4 h-4" />
                            <span>Impact Matrix</span>
                        </div>
                        <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tighter">
                            Pillars <span className="text-signal-green">In Action</span>
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border border-border font-mono text-sm">
                            <thead>
                                <tr className="bg-signal-green/10 border-b border-border">
                                    <th className="p-4 text-left text-signal-green uppercase tracking-widest">Pillar</th>
                                    <th className="p-4 text-left text-signal-green uppercase tracking-widest">Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metricsCategories.map((category) => (
                                    <tr key={category.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="p-4 text-foreground">
                                            <span className="mr-2">{category.emoji}</span>
                                            {category.title}
                                        </td>
                                        <td className="p-4 text-muted-foreground">{category.whyItMatters}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// TIMELINE GOALS SECTION
// ============================================================================
function TimelineGoalsSection() {
    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="w-full py-32 bg-background relative overflow-hidden block racetrack:hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Our Roadmap</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            2026–2030 Milestones
                        </h2>
                    </motion.div>

                    <div className="space-y-8">
                        {timelineGoals.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-6 items-start group"
                            >
                                <div className="flex-shrink-0 w-20 text-right">
                                    <span className="text-primary font-heading text-2xl font-bold">{item.year}</span>
                                </div>
                                <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-2 group-hover:scale-125 transition-transform" />
                                <div className="space-y-1">
                                    <h4 className="text-foreground font-medium text-lg">{item.title}</h4>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-muted border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest">
                            <Flag className="w-4 h-4" />
                            <span>Roadmap</span>
                        </div>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            2026–<span className="text-signal-green">2030</span>
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
                        <div className="flex justify-between items-center relative">
                            {timelineGoals.map((item, index) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center w-1/5 px-2"
                                >
                                    <div className="w-12 h-12 bg-card border-2 border-signal-green rounded-full flex items-center justify-center mb-4 relative z-10">
                                        <Calendar className="w-5 h-5 text-signal-green" />
                                    </div>
                                    <span className="text-signal-green font-mono text-xs">{item.year}</span>
                                    <h4 className="text-foreground font-bold uppercase text-sm mt-1">{item.title}</h4>
                                    <p className="text-muted-foreground font-mono text-xs mt-1 hidden md:block">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// FUTURE VISION SECTION
// ============================================================================
function FutureVisionSection() {
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
                            Mission, Vision & Promise
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
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
                            <p className="text-primary text-xl font-medium leading-relaxed italic pl-16">
                                To build a more durable, equitable, and prosperous economy for San Francisco and the Bay Area.
                            </p>
                        </motion.div>

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
                            <p className="text-primary text-xl font-medium leading-relaxed italic pl-16">
                                A world where every neighborhood is anchored by thriving local businesses that withstand challenges, create generational wealth, and provide stable employment.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="p-10 bg-background border border-primary/20 relative"
                    >
                        <div className="absolute -top-4 left-8 px-4 py-1 bg-primary text-primary-foreground text-xs uppercase tracking-widest">
                            Plain-English Promise
                        </div>
                        <div className="flex items-start gap-6">
                            <Heart className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
                            <div className="space-y-4">
                                <p className="text-foreground text-lg leading-relaxed">
                                    That annual report sentence alone is worth its weight in <strong>grants, partnerships, and trust</strong>. It's proof that we're doing the work.
                                </p>
                                <p className="text-muted-foreground">
                                    We measure what matters: access, health, resilience, sustainability, legacy, and regional durability. Every year, we'll publish our results—transparently and publicly.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-background border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
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
                                To build a more durable, equitable, and prosperous economy for San Francisco and the Bay Area.
                            </p>
                        </motion.div>

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
                                Every neighborhood anchored by thriving businesses that withstand challenges and create generational wealth.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-signal-green/5 border border-signal-green/30 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 bg-signal-green rounded-full animate-pulse" />
                            <span className="text-signal-green font-mono text-xs uppercase tracking-widest">Annual Report Value</span>
                        </div>
                        <p className="text-foreground font-mono text-lg">
                            That sentence is worth its weight in grants, partnerships, and trust.
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// CTA SECTION
// ============================================================================
function CTASection() {
    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="w-full py-32 bg-muted/50 relative overflow-hidden block racetrack:hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full" />

                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center space-y-10"
                    >
                        <div className="space-y-6">
                            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                                Ready to Get Your Inspection Sticker?
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                                Start with a free durability assessment and see how your business measures up against our six pillars of impact.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                            <a
                                href="/"
                                className="group relative px-10 py-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 font-sans text-sm uppercase tracking-[0.2em] font-semibold flex items-center gap-3">
                                    Start Your Durability Assessment
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </a>

                            <a
                                href="/"
                                className="group px-10 py-5 border border-primary/30 text-foreground hover:border-primary transition-all duration-500"
                            >
                                <span className="font-sans text-sm uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                                    View Our Mission
                                </span>
                            </a>
                        </div>

                        <div className="pt-12 space-y-6">
                            <p className="text-muted-foreground text-sm">Want to stay connected to our impact?</p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 border border-border hover:border-primary/30 transition-colors cursor-pointer">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-foreground text-sm">Subscribe to Our Economic Durability Digest</span>
                            </div>
                        </div>

                        <div className="pt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>San Francisco Based</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>California PBC</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>2024 Report Coming Q1 2025</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACE TRACK MODE ========== */}
            <section className="w-full py-24 bg-background border-t border-border relative overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 border border-signal-green/30 bg-signal-green/10 px-6 py-3 mb-8"
                    >
                        <Sparkles className="w-5 h-5 text-signal-green" />
                        <span className="text-signal-green font-mono uppercase tracking-widest">Get Started</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="font-sans text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tighter mb-6"
                    >
                        Ready for Your <span className="text-signal-green">Inspection</span>?
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
                    >
                        <a
                            href="/"
                            className="px-10 py-5 bg-signal-green text-carbon font-bold uppercase tracking-widest hover:bg-signal-green/90 transition-all flex items-center gap-3"
                        >
                            Start Assessment
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <a
                            href="/"
                            className="px-10 py-5 border border-border text-foreground font-mono uppercase tracking-widest hover:bg-secondary/50 transition-all"
                        >
                            View Mission
                        </a>
                    </motion.div>

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
                            <span>California PBC</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-signal-green rounded-full" />
                            <span>Report: Q1 2025</span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// LEGAL FOOTER
// ============================================================================
function LegalFooter() {
    return (
        <section className="w-full py-8 bg-muted/30 border-t border-border">
            <div className="container mx-auto px-4">
                <p className="text-muted-foreground text-xs text-center max-w-3xl mx-auto">
                    Starter Club PBC is a certified Public Benefit Corporation incorporated in California. Our annual Public Benefit Report with complete impact metrics will be published and available on this page in Q1 2025.
                </p>
            </div>
        </section>
    );
}

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export function ImpactMetrics() {
    return (
        <>
            <HeroSection />
            <DeclarationSection />
            <MetricsPillarsSection />
            <CoreMetricsTableSection />
            <TimelineGoalsSection />
            <FutureVisionSection />
            <CTASection />
            <LegalFooter />
        </>
    );
}
