"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Heart,
    Target,
    Compass,
    Users,
    TrendingUp,
    FileText,
    Award,
    ChevronDown,
    ChevronRight,
    ArrowRight,
    Sparkles,
    Building,
    Handshake,
    Scale,
    Eye,
    CheckCircle2,
    Mail,
    ExternalLink,
    Gauge,
    Zap,
    Flag,
} from "lucide-react";

// ============================================================================
// DATA
// ============================================================================

const pillars = [
    {
        id: 1,
        title: "Universal Access & Inclusive Onboarding",
        icon: Users,
        commitment: "We guarantee that financial circumstance is not a barrier to foundational business support. A meaningful portion of our core programming, tools, and diagnostics will remain free or low-cost.",
        benefit: "We democratize opportunity, expanding economic mobility beyond those with pre-existing capital or privilege.",
        manifestation: "Free core diagnostics, sliding-scale memberships, and scholarship funds ensure your start doesn't depend on your starting capital.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        title: "Foundational Health & Operational Resilience",
        icon: Shield,
        commitment: "We guarantee our focus is on building unshakable operational foundations. We equip businesses with the systems, processes, and clarity needed to withstand market shifts, internal crises, and inevitable challenges.",
        benefit: "We directly reduce the rate of preventable business failure, strengthening neighborhood stability and economic security.",
        manifestation: "Our frameworks focus on the unsexy essentials: cash flow management, systems documentation, and crisis planning—the real foundations of survival.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "Sustainable Profitability & Responsible Growth",
        icon: TrendingUp,
        commitment: "We guarantee guidance that prioritizes long-term viability over short-term hype. We support the development of healthy cash flow, sound governance, and operational maturity at every stage.",
        benefit: "We cultivate businesses that create stable, quality jobs and become lasting sources of local investment and innovation.",
        manifestation: "We guide toward healthy margins and responsible growth, rejecting \"growth at all costs\" in favor of stability that creates quality jobs.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        title: "Transferable Value & Legacy Continuity",
        icon: Handshake,
        commitment: "We guarantee support for building enterprises that outlive their founders. We help owners create documented, systematized, and transferable value—whether for sale, succession, or scale.",
        benefit: "We ensure community wealth and institutional knowledge are preserved and passed forward, not dissolved when an owner steps away.",
        manifestation: "We provide tools for building a business that can outlive you, whether through succession planning, sale preparation, or scaling.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 5,
        title: "Transparent Stewardship & Ecosystem Accountability",
        icon: Eye,
        commitment: "We guarantee to measure and report on what truly matters: durability. We will publish an annual Economic Durability Report detailing outcomes in business survival rates, jobs sustained, and our contribution to a more resilient local ecosystem.",
        benefit: "We provide measurable accountability to our community, fostering trust and proving that our model strengthens the broader economic fabric.",
        manifestation: "Our annual Economic Durability Report publicly tracks the outcomes that matter: survival rates, jobs sustained, and ecosystem impact.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60"
    }
];

const timeline = [
    { year: "2021", title: "Founded", description: "Founded on the core belief that durability is a skill that can be taught." },
    { year: "2022", title: "Public Workshops", description: "Launched free Public Benefit Workshops serving 500+ Bay Area founders." },
    { year: "2023", title: "PBC Certified", description: "Certified as a PBC, legally embedding our mission into our corporate DNA." },
    { year: "Ongoing", title: "Measuring Impact", description: "Measuring our success by the longevity and health of the businesses we serve." }
];

const faqs = [
    {
        question: "What does PBC mean for me as a member?",
        answer: "As a Public Benefit Corporation, we're legally bound to balance profit with purpose. This means every tool we build, every decision we make, is measured against our mission to help you build a lasting business—not just maximize our revenue."
    },
    {
        question: "How is Starter Club different from other business support organizations?",
        answer: "We focus on durability, not just growth. While others celebrate quick wins and vanity metrics, we measure success by survival rates, operational resilience, and transferable value. We're the pit crew that helps you finish the race, not just start fast."
    },
    {
        question: "What's included in the free tier?",
        answer: "Our core Business Durability Diagnostic, foundational educational resources, and access to our community forums are always free. We believe that financial circumstance should never be a barrier to building a resilient business."
    },
    {
        question: "How do you measure 'Economic Durability'?",
        answer: "We track three core metrics: business survival rates (are the businesses we support still operating?), jobs sustained (how many stable positions have been created?), and ecosystem impact (how are we contributing to neighborhood economic resilience?)."
    }
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
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.2em]">Public Benefit Corporation</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="font-heading text-4xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight max-w-5xl mx-auto"
                    >
                        Our Commitment to Building <br />
                        <span className="text-primary font-light italic">an Economy That Lasts</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-sans font-light leading-relaxed"
                    >
                        We believe businesses that endure create lasting value for everyone.
                        San Francisco's strength isn't in its skyline—it's in its storefronts, studios, and startups.
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
                        <Shield className="w-3 h-3" />
                        <span>PBC Status: Active</span>
                    </div>

                    <h1 className="font-sans text-5xl md:text-8xl font-bold text-foreground leading-tight uppercase tracking-tighter">
                        Public Benefit <br /><span className="text-signal-green">Commitment</span>
                    </h1>

                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
                        Building the economic immune system for the Bay Area. Our mission is legally binding and central to our corporate purpose.
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
                            <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Official Declaration</span>
                            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                                Our Public Benefit Commitment
                            </h2>
                        </div>

                        <motion.blockquote
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="border-l-4 border-primary pl-8 py-4 text-xl md:text-2xl text-foreground/90 font-heading italic leading-relaxed"
                        >
                            Starter Club Public Benefit Corporation exists to build a more durable, equitable, and prosperous economy for San Francisco and the Bay Area. We fulfill this commitment by ensuring that the businesses which form our community's backbone are not merely started, but are built to last.
                        </motion.blockquote>

                        <div className="space-y-8 text-muted-foreground text-lg leading-relaxed font-light">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="p-8 bg-background border border-border"
                            >
                                <h3 className="text-foreground font-medium text-xl mb-4">The Problem We Couldn't Ignore</h3>
                                <p className="mb-4">
                                    We watched talented founders with vital ideas pour everything into businesses that faltered not for lack of passion, but for lack of foundation. We saw preventable closures ripple through neighborhoods, dissolving jobs, eroding community character, and weakening our local economy.
                                </p>
                                <p>
                                    The spark was clear: too many promising businesses were failing simply because essential, durable-building knowledge and systems were inaccessible, fragmented, or drowned out by short-term "hustle" culture.
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
                                <FileText className="w-4 h-4" />
                                <span>Official Declaration</span>
                            </div>

                            <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                                Mission <span className="text-signal-green">Statement</span>
                            </h2>

                            <div className="bg-signal-green/10 border-l-4 border-signal-green p-6 space-y-4">
                                <p className="text-foreground font-mono text-lg leading-relaxed">
                                    Starter Club PBC exists to build a more durable, equitable, and prosperous economy for San Francisco and the Bay Area.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 lg:pt-20">
                            <div className="bg-background border border-border p-6 font-mono text-sm space-y-4">
                                <p className="text-signal-yellow">&gt; Analyzing market conditions...</p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-red">[PROBLEM]</span> Talented founders failing due to lack of foundation
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-yellow">[CAUSE]</span> Essential knowledge inaccessible or fragmented
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-signal-yellow">[CAUSE]</span> Short-term "hustle" culture drowning durability
                                </p>
                                <p className="text-signal-green">&gt; Solution: Economic resilience requires building businesses that survive, profit, and endure</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// PILLARS SECTION
// ============================================================================
function PillarsSection() {
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
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Our Commitments</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            The Five Pillars of Economic Durability
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            We translate our mission into measurable action through these core commitments.
                        </p>
                    </motion.div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={pillar.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="border border-border bg-card overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === pillar.id ? null : pillar.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <pillar.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-primary text-xs font-mono">Pillar {pillar.id}</span>
                                            <h3 className="text-foreground font-medium text-lg">{pillar.title}</h3>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedId === pillar.id ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {expandedId === pillar.id && (
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
                                                        <h4 className="text-primary text-sm font-medium mb-2">Our Commitment</h4>
                                                        <p className="text-muted-foreground text-sm">{pillar.commitment}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-primary text-sm font-medium mb-2">Public Benefit</h4>
                                                        <p className="text-muted-foreground text-sm">{pillar.benefit}</p>
                                                    </div>
                                                </div>
                                                <div className="relative h-48 md:h-auto overflow-hidden rounded">
                                                    <img
                                                        src={pillar.image}
                                                        alt={pillar.title}
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
                            <Target className="w-4 h-4" />
                            <span>Core Systems</span>
                        </div>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            Five <span className="text-signal-green">Pillars</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={pillar.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border p-6 hover:border-signal-green/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <pillar.icon className="w-6 h-6 text-signal-green" />
                                    <span className="text-signal-green font-mono text-xs">P{pillar.id}</span>
                                </div>
                                <h4 className="text-foreground font-bold uppercase text-sm tracking-widest mb-3">{pillar.title}</h4>
                                <p className="text-muted-foreground font-mono text-xs">{pillar.manifestation}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// PILLARS TABLE SECTION
// ============================================================================
function PillarsTableSection() {
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
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Our Journey & Guiding Principles</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            Our Core Pillars in Action
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
                                    <th className="p-4 text-left text-primary font-medium text-sm uppercase tracking-wider">Our Commitment</th>
                                    <th className="p-4 text-left text-primary font-medium text-sm uppercase tracking-wider">How It Manifests</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pillars.map((pillar, index) => (
                                    <tr key={pillar.id} className={`border-b border-border ${index % 2 === 0 ? '' : 'bg-muted/20'}`}>
                                        <td className="p-4 text-foreground font-medium">{pillar.title}</td>
                                        <td className="p-4 text-muted-foreground text-sm">{pillar.manifestation}</td>
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
                            <span>System Matrix</span>
                        </div>
                        <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tighter">
                            Pillars <span className="text-signal-green">In Action</span>
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border border-border font-mono text-sm">
                            <thead>
                                <tr className="bg-signal-green/10 border-b border-border">
                                    <th className="p-4 text-left text-signal-green uppercase tracking-widest">Commitment</th>
                                    <th className="p-4 text-left text-signal-green uppercase tracking-widest">Manifestation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pillars.map((pillar, index) => (
                                    <tr key={pillar.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="p-4 text-foreground">{pillar.title}</td>
                                        <td className="p-4 text-muted-foreground">{pillar.manifestation}</td>
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
// TIMELINE SECTION
// ============================================================================
function TimelineSection() {
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
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Our Evolution</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            Building Durability, Year by Year
                        </h2>
                    </motion.div>

                    <div className="space-y-8">
                        {timeline.map((item, index) => (
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
                            <span>Race Log</span>
                        </div>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            Our <span className="text-signal-green">Evolution</span>
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
                        <div className="flex justify-between items-center relative">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center w-1/4 px-2"
                                >
                                    <div className="w-12 h-12 bg-card border-2 border-signal-green rounded-full flex items-center justify-center mb-4 relative z-10">
                                        <Sparkles className="w-5 h-5 text-signal-green" />
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
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">The Future We're Building—Together</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            Our Mission & Vision
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
                                    Starter Club is here for one reason: <strong>to help build businesses that last.</strong> We believe anyone with a good idea deserves a real shot—so we keep our core support accessible to all.
                                </p>
                                <p className="text-muted-foreground">
                                    We're not about quick wins. We're the strategic partner who helps you build a rock-solid foundation, navigate tough challenges, and create a business that's profitable, resilient, and built to carry on without you.
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
                            <span className="text-signal-green font-mono text-xs uppercase tracking-widest">Promise to Members</span>
                        </div>
                        <p className="text-foreground font-mono text-lg">
                            We succeed only when the businesses we support become permanent, positive fixtures in the Bay Area.
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

// ============================================================================
// FAQ SECTION
// ============================================================================
function FAQSection() {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    return (
        <>
            {/* ========== LUXURY MODE ========== */}
            <section className="w-full py-32 bg-background relative overflow-hidden block racetrack:hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em]">Questions</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                            Frequently Asked
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="border border-border bg-card overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === index ? null : index)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                                >
                                    <span className="text-foreground font-medium">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 ml-4 transition-transform ${expandedId === index ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {expandedId === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-muted-foreground">
                                                {faq.answer}
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
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 text-signal-green font-mono text-xs uppercase tracking-widest">
                            <FileText className="w-4 h-4" />
                            <span>FAQ Database</span>
                        </div>
                        <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tighter">
                            Questions <span className="text-signal-green">Answered</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border p-6"
                            >
                                <h4 className="text-foreground font-bold uppercase text-sm mb-3">{faq.question}</h4>
                                <p className="text-muted-foreground font-mono text-sm">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
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
                                Join Us in Building Resilience
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                                This commitment shapes every tool we build, every guide we write, and every conversation we have with our members.
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
                                    Join Our Mission
                                </span>
                            </a>
                        </div>

                        <div className="pt-12 space-y-6">
                            <p className="text-muted-foreground text-sm">Want to stay connected to our mission?</p>
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
                        <Zap className="w-5 h-5 text-signal-green" />
                        <span className="text-signal-green font-mono uppercase tracking-widest">Join the Mission</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="font-sans text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tighter mb-6"
                    >
                        Ready to Build <span className="text-signal-green">Durability</span>?
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
                            Access Free Tools
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
                    Starter Club PBC is a certified Public Benefit Corporation incorporated in California. Our Public Benefit Commitment is legally binding and central to our corporate purpose. Our 2024 Annual Economic Durability Report will be published and available on this page in Q1 2025.
                </p>
            </div>
        </section>
    );
}

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export function PublicBenefitCommitment() {
    return (
        <>
            <HeroSection />
            <DeclarationSection />
            <PillarsSection />
            <PillarsTableSection />
            <TimelineSection />
            <FutureVisionSection />
            <FAQSection />
            <CTASection />
            <LegalFooter />
        </>
    );
}
