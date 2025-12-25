"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    Target,
    Compass,
    Shield,
    Sparkles,
    Trophy,
    Medal,
    Crown,
    PartyPopper
} from "lucide-react";

/**
 * CareersMissionVision - Section 4: Future Building / Desire
 * 
 * Corporate Theme (Luxury High-Contrast):
 * - Clash Display Variable + IBM Plex Sans typography
 * - Mission at monumental scale (50vw)
 * - Extreme contrast #fff on #000
 * - Laser-etched text effect
 * - Letter-by-letter assembly with particles
 * 
 * Racing Theme (Victory Lane):
 * - Audiowide + Rajdhani typography
 * - Victory lane with podium
 * - Gold and silver on black asphalt
 * - Checkered flag wave animation
 * - Champagne particle effects
 */

const missionStatement = "To tune the operational health of businesses—optimizing them for sustained performance, resilience, and long-term growth.";

const visionStatement = "For the San Francisco Bay Area to be recognized as the world's premier proving ground for business—where every enterprise can optimize performance, navigate challenges, and finish the long race ahead.";

const pbcCommitment = "We act as the civic pit crew for San Francisco's economic engine. By providing essential diagnostics, maintenance, and performance tuning for local businesses, we reduce failure rates, extend operational lifespans, and improve the resilience of the regional economy.";

// Podium positions representing past/present/future
const podiumPositions = [
    {
        position: 2,
        label: "Where We've Been",
        description: "Built the foundation",
        icon: Medal,
        color: "#c0c0c0" // Silver
    },
    {
        position: 1,
        label: "Where We Are",
        description: "Growing the team",
        icon: Trophy,
        color: "#ffd700" // Gold
    },
    {
        position: 3,
        label: "Where We're Going",
        description: "Scaling impact",
        icon: Crown,
        color: "#cd7f32" // Bronze
    },
];

export function CareersMissionVision() {
    const [mounted, setMounted] = useState(false);
    const [champagneActive, setChampagneActive] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                setChampagneActive(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isInView]);

    // Generate champagne particles
    const champagneParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: -Math.random() * 150 - 50,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 1.5 + 1,
        delay: Math.random() * 0.5,
    }));

    return (
        <>
            {/* ========== CORPORATE / LUXURY HIGH-CONTRAST THEME ========== */}
            <section className="relative w-full py-32 overflow-hidden block racetrack:hidden">
                {/* Background - Extreme contrast */}
                <div className="absolute inset-0 bg-foreground" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

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
                            The Future We're Building
                        </span>
                        <h2 className="font-heading text-4xl md:text-6xl font-bold text-background">
                            Mission & Vision
                        </h2>
                    </motion.div>

                    {/* Mission - Monumental Scale */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto mb-24"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                <Target className="w-8 h-8 text-primary-foreground" />
                            </div>
                            <h3 className="text-background text-2xl font-light uppercase tracking-widest">
                                Our Mission
                            </h3>
                        </div>

                        {/* Laser-etched text effect */}
                        <p
                            className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight laser-etch text-background"
                            style={{
                                textShadow: `
                                    0 1px 0 rgba(255,255,255,0.1),
                                    0 2px 0 rgba(255,255,255,0.08),
                                    0 3px 0 rgba(255,255,255,0.05),
                                    0 4px 10px rgba(0,0,0,0.3)
                                `,
                            }}
                        >
                            {missionStatement}
                        </p>
                    </motion.div>

                    {/* Vision - Delicate Footnote Style */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mb-24"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 border border-background/30 rounded-full flex items-center justify-center">
                                <Compass className="w-6 h-6 text-background/80" />
                            </div>
                            <h3 className="text-background/80 text-lg font-light uppercase tracking-widest">
                                Our Vision
                            </h3>
                        </div>

                        <p className="text-xl md:text-2xl text-background/70 font-light leading-relaxed italic">
                            {visionStatement}
                        </p>
                    </motion.div>

                    {/* PBC Commitment */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-background p-10 lg:p-16 relative overflow-hidden">
                            {/* Corner accent */}
                            <div className="absolute top-0 left-0 w-20 h-20 bg-primary" />

                            <div className="absolute -top-4 left-24 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold">
                                Public Benefit Corporation
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-8 pt-8">
                                <Shield className="w-16 h-16 text-primary flex-shrink-0" />
                                <div className="space-y-4">
                                    <p className="text-foreground text-lg leading-relaxed">
                                        {pbcCommitment}
                                    </p>
                                    <p className="text-muted-foreground italic text-sm">
                                        Our public benefit is measured in economic durability: uptime, resilience, and longevity of community businesses that form the backbone of our city.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACING / VICTORY LANE THEME ========== */}
            <section
                ref={sectionRef}
                className="relative w-full py-24 overflow-hidden hidden racetrack:block bg-background"
            >
                {/* Checkered Flag Pattern Border */}
                <div className="absolute top-0 left-0 right-0 h-8 checkered-flag opacity-30" />

                {/* Asphalt texture */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%),
                                radial-gradient(circle at 80% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)
                            `,
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-signal-yellow font-mono text-xs uppercase tracking-widest mb-4">
                            <Trophy className="w-4 h-4" />
                            <span>Victory Lane</span>
                        </div>
                        <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tighter">
                            Mission & <span className="text-signal-green">Vision</span>
                        </h2>
                    </div>

                    {/* Mission & Vision Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-card border border-signal-green/30 p-8 relative overflow-hidden"
                        >
                            {/* Gold accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffd700] via-[#ffed4a] to-[#ffd700]" />

                            <div className="flex items-center gap-4 mb-6">
                                <Target className="w-8 h-8 text-[#ffd700]" />
                                <h3 className="text-foreground font-bold uppercase tracking-widest">Mission</h3>
                            </div>
                            <p className="text-foreground font-mono text-lg leading-relaxed border-l-4 border-signal-green pl-6">
                                {missionStatement}
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card border border-signal-green/30 p-8 relative overflow-hidden"
                        >
                            {/* Silver accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c0c0c0] via-[#e8e8e8] to-[#c0c0c0]" />

                            <div className="flex items-center gap-4 mb-6">
                                <Compass className="w-8 h-8 text-[#c0c0c0]" />
                                <h3 className="text-foreground font-bold uppercase tracking-widest">Vision</h3>
                            </div>
                            <p className="text-foreground font-mono text-lg leading-relaxed border-l-4 border-signal-green pl-6">
                                {visionStatement.split('—')[0]}.
                            </p>
                        </motion.div>
                    </div>

                    {/* Podium Visualization */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <h3 className="text-center font-bold uppercase tracking-widest text-muted-foreground mb-8">
                            The Journey
                        </h3>

                        <div className="flex items-end justify-center gap-4 relative min-h-[300px]">
                            {/* Champagne Particles */}
                            <AnimatePresence>
                                {champagneActive && mounted && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                                        {champagneParticles.map((particle) => (
                                            <motion.div
                                                key={particle.id}
                                                initial={{
                                                    opacity: 1,
                                                    x: 0,
                                                    y: 0,
                                                    scale: 1
                                                }}
                                                animate={{
                                                    opacity: 0,
                                                    x: particle.x,
                                                    y: particle.y,
                                                    scale: 0.5
                                                }}
                                                transition={{
                                                    duration: particle.duration,
                                                    delay: particle.delay,
                                                    ease: "easeOut"
                                                }}
                                                className="absolute rounded-full"
                                                style={{
                                                    width: particle.size,
                                                    height: particle.size,
                                                    background: `linear-gradient(135deg, #ffd700, #ffed4a)`,
                                                    boxShadow: "0 0 6px rgba(255,215,0,0.6)",
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Podium Steps - Reordered: 2nd, 1st, 3rd */}
                            {[podiumPositions[0], podiumPositions[1], podiumPositions[2]].map((pos, index) => {
                                const heights = { 1: 180, 2: 140, 3: 100 };
                                const height = heights[pos.position as keyof typeof heights];

                                return (
                                    <motion.div
                                        key={pos.position}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.15 }}
                                        viewport={{ once: true }}
                                        className="flex flex-col items-center"
                                    >
                                        {/* Icon */}
                                        <motion.div
                                            animate={pos.position === 1 ? { y: [0, -10, 0] } : {}}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="mb-4"
                                        >
                                            <pos.icon
                                                className="w-10 h-10"
                                                style={{ color: pos.color }}
                                            />
                                        </motion.div>

                                        {/* Label */}
                                        <div className="text-center mb-4">
                                            <div className="text-foreground font-bold text-sm uppercase tracking-widest">
                                                {pos.label}
                                            </div>
                                            <div className="text-muted-foreground font-mono text-xs">
                                                {pos.description}
                                            </div>
                                        </div>

                                        {/* Podium Block */}
                                        <div
                                            className="w-28 md:w-36 flex items-center justify-center font-orbitron text-4xl font-bold"
                                            style={{
                                                height: `${height}px`,
                                                background: `linear-gradient(180deg, ${pos.color} 0%, ${pos.color}80 100%)`,
                                                boxShadow: `0 10px 30px ${pos.color}40`,
                                            }}
                                        >
                                            <span className="text-black opacity-80">
                                                {pos.position}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* PBC Telemetry Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-signal-green/5 border border-signal-green/30 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <motion.div
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-3 h-3 bg-signal-green rounded-full"
                            />
                            <span className="text-signal-green font-mono text-xs uppercase tracking-widest">
                                Public Benefit Corporation Status: Active
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                            {[
                                { label: "Economic Durability KPI", value: "UPTIME" },
                                { label: "Regional Backbone Strength", value: "RESILIENCE" },
                                { label: "Community Business Lifespan", value: "LONGEVITY" },
                            ].map((stat) => (
                                <div key={stat.value}>
                                    <p className="text-signal-green font-orbitron text-2xl md:text-3xl font-bold">
                                        {stat.value}
                                    </p>
                                    <p className="text-muted-foreground font-mono text-xs mt-2">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="text-muted-foreground font-mono text-sm text-center italic">
                            "We are the civic pit crew, ensuring the local economy doesn't just start fast—but finishes strong."
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Checkered Flag */}
                <div className="absolute bottom-0 left-0 right-0 h-8 checkered-flag opacity-30" />
            </section>
        </>
    );
}
