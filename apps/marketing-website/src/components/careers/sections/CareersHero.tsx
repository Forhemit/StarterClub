"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Code2, Gauge, Zap, ChevronDown } from "lucide-react";

/**
 * CareersHero - Section 1: Emotional Hook / Attention
 * 
 * Corporate Theme (Neo-Grotesque):
 * - Chakra Petch Bold + Space Grotesk Light typography
 * - Asymmetric grid with 40° angled text
 * - Deep charcoal with signal.blue accents
 * - Multi-layer parallax with floating UI cards
 * - Letters assemble from scattered positions
 * - Live code terminal effect
 * 
 * Racing Theme (Cyber-Physical):
 * - Orbitron Black + JetBrains Mono typography
 * - POV racing perspective with vanishing point
 * - Absolute black with signal.green/red
 * - 3D extruded text with tire tracks
 * - RPM gauge revs to redline
 * - Pit lane lights animation
 */

// Letter assembly animation config - using inline styles to avoid Variants type complexity
const getLetterAnimation = (custom: { x: number; y: number; rotate: number }, delay: number) => ({
    initial: {
        opacity: 0,
        x: custom.x,
        y: custom.y,
        rotate: custom.rotate,
    },
    animate: {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
            delay,
        },
    },
});

// Generate random scatter positions for letters
const generateScatter = () => ({
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 300,
    rotate: (Math.random() - 0.5) * 90,
});

export function CareersHero() {
    const [mounted, setMounted] = useState(false);
    const [rpmValue, setRpmValue] = useState(0);
    const [pitLightsActive, setPitLightsActive] = useState<number[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const parallaxY3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

    useEffect(() => {
        setMounted(true);

        // RPM gauge animation for racing theme
        const rpmInterval = setInterval(() => {
            setRpmValue((prev) => {
                if (prev >= 9000) return 9000;
                return prev + Math.random() * 500;
            });
        }, 100);

        // Pit lane lights sequence
        const lightSequence = () => {
            const lights = [0, 1, 2, 3, 4];
            lights.forEach((light, index) => {
                setTimeout(() => {
                    setPitLightsActive((prev) => [...prev, light]);
                }, index * 200);
            });

            setTimeout(() => {
                setPitLightsActive([]);
            }, 2000);
        };

        const lightInterval = setInterval(lightSequence, 4000);
        lightSequence();

        return () => {
            clearInterval(rpmInterval);
            clearInterval(lightInterval);
        };
    }, []);

    // Headline text for animation
    const headline = "BUILD WITH US";
    const scatterPositions = headline.split("").map(() => generateScatter());

    // CSS Variables for the code terminal
    const cssVariables = [
        { name: "--careers-signal-blue", value: "#00f0ff" },
        { name: "--careers-charcoal", value: "#0a0a0f" },
        { name: "--careers-paper", value: "#f5f1e8" },
        { name: "--careers-gold", value: "#ffd700" },
    ];

    return (
        <>
            {/* ========== CORPORATE / LUXURY THEME ========== */}
            <section
                ref={sectionRef}
                className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden block racetrack:hidden"
            >
                {/* Geometric Mesh Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-background" />
                    <motion.div
                        style={{ y: parallaxY1 }}
                        className="absolute inset-0 careers-mesh-bg"
                    />
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

                    {/* Ambient Glow Orbs */}
                    <motion.div
                        style={{ y: parallaxY2 }}
                        className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#00f0ff]/10 blur-[150px] rounded-full"
                    />
                    <motion.div
                        style={{ y: parallaxY3 }}
                        className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary/10 blur-[120px] rounded-full"
                    />
                </div>

                {/* Floating UI Cards (Parallax Depth) */}
                {mounted && (
                    <>
                        <motion.div
                            style={{ y: parallaxY2 }}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 0.6, x: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute left-[5%] top-[20%] hidden lg:block"
                        >
                            <div className="glass-card p-4 w-48 transform rotate-[-8deg]">
                                <div className="text-xs font-mono text-[#00f0ff] mb-2">// open_positions</div>
                                <div className="text-2xl font-bold text-foreground font-chakra">12</div>
                                <div className="text-xs text-muted-foreground">Roles Available</div>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: parallaxY3 }}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 0.6, x: 0 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="absolute right-[8%] top-[30%] hidden lg:block"
                        >
                            <div className="glass-card p-4 w-44 transform rotate-[5deg]">
                                <div className="text-xs font-mono text-[#00f0ff] mb-2">// team_size</div>
                                <div className="text-2xl font-bold text-foreground font-chakra">24</div>
                                <div className="text-xs text-muted-foreground">Team Members</div>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: parallaxY1 }}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 0.5, y: 0 }}
                            transition={{ delay: 1.4, duration: 1 }}
                            className="absolute left-[15%] bottom-[15%] hidden lg:block"
                        >
                            <div className="glass-card-deep p-4 w-52 transform rotate-[3deg]">
                                <div className="text-xs font-mono text-[#00f0ff] mb-2">// culture</div>
                                <div className="text-sm text-foreground">"Remote-first, impact-driven"</div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Main Content */}
                <div className="relative z-30 container mx-auto px-4 text-center">
                    {/* Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 backdrop-blur-sm mb-12"
                    >
                        <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                        <span className="text-[#00f0ff] font-sans text-xs uppercase tracking-[0.25em]">We're Hiring</span>
                    </motion.div>

                    {/* Animated Headline - Letters assemble */}
                    <div className="mb-8 overflow-hidden">
                        <motion.h1
                            className="font-chakra text-5xl md:text-8xl lg:text-9xl font-bold text-foreground leading-none tracking-tight transform rotate-[-2deg]"
                            style={{ transformOrigin: "center" }}
                        >
                            {mounted ? (
                                headline.split("").map((letter, index) => {
                                    const anim = getLetterAnimation(scatterPositions[index], index * 0.05);
                                    return (
                                        <motion.span
                                            key={index}
                                            initial={anim.initial}
                                            animate={anim.animate}
                                            className={`inline-block ${letter === " " ? "w-4 md:w-8" : ""}`}
                                        >
                                            {letter === " " ? "\u00A0" : letter}
                                        </motion.span>
                                    );
                                })
                            ) : (
                                <span className="opacity-0">{headline}</span>
                            )}
                        </motion.h1>
                    </div>

                    {/* Subheadline with typewriter effect */}
                    <motion.p
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-sans font-light leading-relaxed mb-12 overflow-hidden whitespace-nowrap md:whitespace-normal"
                    >
                        Join the mission to build infrastructure that makes businesses unstoppable.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <a
                            href="#open-positions"
                            className="group relative px-10 py-5 bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 transition-all duration-500 overflow-hidden"
                        >
                            <span className="relative z-10 font-chakra text-sm uppercase tracking-[0.2em] font-semibold flex items-center gap-3">
                                View Open Roles
                                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </a>

                        <a
                            href="#culture"
                            className="group px-10 py-5 border border-[#00f0ff]/30 text-foreground hover:border-[#00f0ff] transition-all duration-500"
                        >
                            <span className="font-sans text-sm uppercase tracking-[0.2em] group-hover:text-[#00f0ff] transition-colors">
                                Our Culture
                            </span>
                        </a>
                    </motion.div>
                </div>

                {/* Live Code Terminal Effect */}
                {mounted && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 0.4, y: 0 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-8 right-8 hidden xl:block"
                    >
                        <div className="bg-black/80 backdrop-blur-sm border border-[#00f0ff]/20 p-4 font-mono text-xs w-72">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#00f0ff]/10">
                                <Code2 className="w-3 h-3 text-[#00f0ff]" />
                                <span className="text-[#00f0ff]">careers.css</span>
                            </div>
                            {cssVariables.map((variable, index) => (
                                <motion.div
                                    key={variable.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.5 + index * 0.3 }}
                                    className="mb-1"
                                >
                                    <span className="text-purple-400">{variable.name}</span>
                                    <span className="text-white">: </span>
                                    <span className="text-green-400">{variable.value}</span>
                                    <span className="text-white">;</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2 text-muted-foreground"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ========== RACING / F1 TELEMETRY THEME ========== */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden hidden racetrack:flex pt-20">
                {/* Speed Blur Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black" />

                    {/* Perspective Grid */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background: `
                                linear-gradient(transparent 0%, transparent 49%, rgba(0,255,157,0.3) 50%, transparent 51%),
                                linear-gradient(90deg, transparent 0%, transparent 49%, rgba(0,255,157,0.1) 50%, transparent 51%)
                            `,
                            backgroundSize: "100px 100px",
                            perspective: "1000px",
                            transform: "rotateX(60deg)",
                            transformOrigin: "center bottom",
                        }}
                    />

                    {/* Speed Lines */}
                    <div className="absolute inset-0 racing-speed-lines opacity-30" />

                    {/* Tire Track Pattern */}
                    {mounted && (
                        <>
                            <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute left-[20%] top-0 bottom-0 w-8 opacity-10"
                                style={{
                                    background: "repeating-linear-gradient(0deg, transparent, transparent 20px, #333 20px, #333 40px)",
                                    transformOrigin: "bottom",
                                }}
                            />
                            <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                className="absolute right-[20%] top-0 bottom-0 w-8 opacity-10"
                                style={{
                                    background: "repeating-linear-gradient(0deg, transparent, transparent 20px, #333 20px, #333 40px)",
                                    transformOrigin: "bottom",
                                }}
                            />
                        </>
                    )}
                </div>

                {/* Pit Lane Lights Border */}
                <div className="absolute top-0 left-0 right-0 h-16 border-b border-signal-green/20 flex items-center justify-center gap-3 bg-black/50">
                    {[0, 1, 2, 3, 4].map((light) => (
                        <div
                            key={light}
                            className={`pit-light ${pitLightsActive.includes(light) ? "active" : ""}`}
                        />
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Copy */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 border border-signal-green/30 bg-signal-green/10 px-4 py-2 text-xs font-mono text-signal-green uppercase tracking-widest">
                            <motion.div
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 bg-signal-green rounded-full"
                            />
                            <span>Hiring: Active</span>
                        </div>

                        {/* 3D Extruded Headline */}
                        <motion.h1
                            initial={{ z: -500, opacity: 0 }}
                            animate={{ z: 0, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-none uppercase tracking-tighter"
                            style={{
                                textShadow: `
                                    1px 1px 0 #00ff9d,
                                    2px 2px 0 #00cc7d,
                                    3px 3px 0 #009960,
                                    4px 4px 0 #006640,
                                    5px 5px 10px rgba(0,0,0,0.5)
                                `,
                            }}
                        >
                            Join The
                            <br />
                            <span className="text-signal-green">Pit Crew</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <p className="text-muted-foreground text-lg font-jetbrains max-w-lg">
                            We're mechanics for business health. Ready to tune some engines?
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href="#open-positions"
                                className="px-8 py-4 bg-signal-green text-black font-bold uppercase tracking-widest hover:bg-signal-green/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Gauge className="w-5 h-5" />
                                Open Positions
                            </a>
                            <a
                                href="#culture"
                                className="px-8 py-4 border border-signal-green/30 text-signal-green font-mono uppercase tracking-widest hover:bg-signal-green/10 transition-all"
                            >
                                Team Culture
                            </a>
                        </div>
                    </div>

                    {/* Right: RPM Gauge */}
                    <div className="relative flex items-center justify-center">
                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                            {/* Outer Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                                className="absolute inset-0 border-2 border-dashed border-signal-green/30 rounded-full"
                            />

                            {/* Gauge Body */}
                            <div className="absolute inset-4 bg-black border-4 border-signal-green/50 rounded-full flex items-center justify-center overflow-hidden">
                                {/* Redline Zone */}
                                <div
                                    className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20"
                                    style={{
                                        background: "conic-gradient(from 0deg, transparent 0%, #ff0040 50%, transparent 100%)",
                                        transform: "rotate(45deg)",
                                    }}
                                />

                                {/* Center Display */}
                                <div className="text-center z-10">
                                    <div className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-2">
                                        Team Velocity
                                    </div>
                                    <motion.div
                                        className="text-6xl md:text-7xl font-bold font-orbitron text-signal-green tabular-nums"
                                        animate={{ scale: rpmValue >= 8000 ? [1, 1.02, 1] : 1 }}
                                        transition={{ duration: 0.2, repeat: rpmValue >= 8000 ? Infinity : 0 }}
                                    >
                                        {Math.floor(rpmValue)}
                                    </motion.div>
                                    <div className="text-signal-yellow text-xs font-mono uppercase tracking-widest animate-pulse">
                                        RPM · MAX EFFORT
                                    </div>
                                </div>

                                {/* Needle */}
                                <motion.div
                                    className="absolute w-full h-1"
                                    animate={{ rotate: -90 + (rpmValue / 9000) * 270 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                >
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-signal-red to-signal-red rounded-full" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-signal-green text-xs font-mono uppercase tracking-widest">Scroll Down</span>
                    <ChevronDown className="w-6 h-6 text-signal-green" />
                </motion.div>
            </section>
        </>
    );
}
