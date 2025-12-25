"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Timer, Flag, Gauge } from "lucide-react";

// ============================================================================
// SECTION 1: HERO / VALUE PROPOSITION
// Goal: Attract attention and frame membership as a strategic investment
// ============================================================================

export function BenefitsHero() {
    const [mounted, setMounted] = useState(false);
    const [lapTime, setLapTime] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Racing theme lap time counter animation
    useEffect(() => {
        if (!mounted) return;
        const targetTime = 1.23; // 1:23.456
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setLapTime(eased * targetTime);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        const timer = setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1500);

        return () => clearTimeout(timer);
    }, [mounted]);

    const formatLapTime = (time: number) => {
        const minutes = Math.floor(time);
        const seconds = ((time % 1) * 60).toFixed(3);
        return `${minutes}:${seconds.padStart(6, "0")}`;
    };

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
            {/* ================================================================
                CORPORATE THEME (Light/Dark) - Neo-Grotesque meets Luxury
                Vibe: High-stakes investment prospectus - precise, credible, weighty
            ================================================================ */}
            <div className="block racetrack:hidden w-full h-full relative">
                {/* Corporate Background - Deep Charcoal with Gold Nebulas */}
                <div className="absolute inset-0 z-0 bg-background overflow-hidden">
                    {/* Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none z-20" />

                    {/* Gold Ambient Glow */}
                    <div className="absolute top-[-30%] right-[-20%] w-[70vw] h-[70vw] bg-primary/5 blur-[200px] rounded-full z-0" />
                    <div className="absolute bottom-[-30%] left-[-20%] w-[60vw] h-[60vw] bg-primary/3 blur-[180px] rounded-full z-0" />

                    {/* Floating Gold Particles - only on mount */}
                    <div className="absolute inset-0 z-10">
                        {mounted &&
                            !shouldReduceMotion &&
                            Array.from({ length: 30 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{
                                        opacity: [0, 0.6, 0],
                                        scale: [0.5, 1, 0.5],
                                        y: [0, Math.random() * 80 + 40],
                                    }}
                                    transition={{
                                        duration: Math.random() * 4 + 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: Math.random() * 4,
                                    }}
                                    className="absolute w-1 h-1 rounded-full bg-primary/60 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                                />
                            ))}
                    </div>
                </div>

                {/* Corporate Content - Asymmetric Split */}
                <div className="relative z-30 container mx-auto px-4 min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
                    {/* Left Side - Massive Headline */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Status Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-3 px-4 py-2 border border-primary/20 bg-primary/5 backdrop-blur-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-primary font-sans text-xs uppercase tracking-[0.25em]">
                                Exclusive Membership
                            </span>
                        </motion.div>

                        {/* Animated Headline */}
                        <div className="font-display font-bold text-foreground leading-[0.9] tracking-tighter">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-3xl md:text-4xl lg:text-5xl mb-2"
                            >
                                BUILD TO
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-3xl md:text-4xl lg:text-5xl text-primary h-[1.1em] flex items-center justify-center lg:justify-start"
                            >
                                <TypewriterText
                                    words={["WIN", "LAST", "SUCCEED", "COMPETE", "SURVIVE", "PROFIT"]}
                                />
                            </motion.div>
                        </div>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="text-muted-foreground text-lg md:text-xl max-w-xl font-sans font-light leading-relaxed"
                        >
                            Transform from idea to launched business with our unified operating system.
                            Three tiers. Six months. One unstoppable foundation.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                        >
                            <button className="group relative px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 overflow-hidden shadow-[0_8px_32px_rgba(212,175,55,0.3)]">
                                <span className="relative z-10 font-sans text-xs uppercase tracking-[0.25em] font-semibold flex items-center gap-2">
                                    Explore Tiers
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </button>
                            <button className="px-8 py-4 bg-transparent text-foreground border border-primary/30 hover:border-primary transition-all duration-500">
                                <span className="font-sans text-xs uppercase tracking-[0.25em]">
                                    Get Certified
                                </span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Side - Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        <div className="relative w-full max-w-[600px] aspect-[1.83/1] rounded-2xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700 bg-black">
                            {/* Slideshow Images */}
                            <Slideshow />

                            {/* Overlay Gradient for integration */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Cyber-Physical meets Retro-Interface
                Vibe: Team garage + race-day dashboard - immediate, high-energy
            ================================================================ */}
            <div className="hidden racetrack:block w-full h-full relative pt-20">
                {/* Racing Background - Grid with Depth */}
                <div className="absolute inset-0 z-0">
                    {/* Topographical Grid */}
                    <div
                        className="absolute inset-0 opacity-15"
                        style={{
                            backgroundImage: `
                                linear-gradient(#333 1px, transparent 1px),
                                linear-gradient(90deg, #333 1px, transparent 1px)
                            `,
                            backgroundSize: "50px 50px",
                        }}
                    />

                    {/* Radial Depth Blur */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />

                    {/* Signal Glow Effects */}
                    <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-signal-green/5 blur-[150px] rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-signal-red/5 blur-[120px] rounded-full" />
                </div>

                {/* Racing Content */}
                <div className="relative z-10 container mx-auto px-4 min-h-[90vh] flex flex-col items-center justify-center">
                    {/* HUD Frame */}
                    <div className="relative max-w-4xl w-full">
                        {/* Helmet Visor Effect - Top Border */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-signal-green/50 to-transparent" />

                        {/* Status Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center justify-between mb-8 font-mono text-xs"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-signal-green">
                                    <Gauge className="w-4 h-4" />
                                    <span>SYSTEMS: ONLINE</span>
                                </div>
                                <div className="w-px h-4 bg-border" />
                                <div className="text-muted-foreground">
                                    SECTOR: MEMBERSHIP
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-signal-yellow">
                                <Timer className="w-4 h-4" />
                                <span>LAP: {formatLapTime(lapTime)}</span>
                            </div>
                        </motion.div>

                        {/* Main Headline with Glitch Effect */}
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative text-center"
                        >
                            <span
                                className="block font-sans text-7xl md:text-9xl font-bold uppercase tracking-tighter text-foreground"
                                style={{
                                    textShadow: mounted
                                        ? "0 0 40px rgba(0, 255, 157, 0.3)"
                                        : "none",
                                }}
                            >
                                START YOUR
                            </span>
                            <span className="block font-sans text-4xl md:text-6xl font-bold uppercase tracking-widest text-signal-green mt-2">
                                BUILD
                            </span>

                            {/* Glitch Overlay (decorative) */}
                            {mounted && !shouldReduceMotion && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{
                                        duration: 0.1,
                                        delay: 0.5,
                                        times: [0, 0.5, 1],
                                    }}
                                    className="absolute inset-0 bg-signal-green/10 mix-blend-overlay pointer-events-none"
                                    style={{
                                        clipPath:
                                            "polygon(0 30%, 100% 30%, 100% 35%, 0 35%)",
                                    }}
                                />
                            )}
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-center text-muted-foreground font-mono text-lg mt-8 max-w-2xl mx-auto"
                        >
                            Six laps. Three performance classes. One championship run.
                        </motion.p>

                        {/* Tier Garage Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex justify-center gap-4 mt-12"
                        >
                            {["MEMBER", "BUILDER", "FOUNDER"].map(
                                (tier, index) => (
                                    <div
                                        key={tier}
                                        className={`
                                        relative px-6 py-4 border bg-carbon-light/50 backdrop-blur-sm
                                        ${index === 2 ? "border-signal-green text-signal-green" : "border-border text-muted-foreground"}
                                        hover:border-signal-green hover:text-signal-green transition-colors duration-300
                                    `}
                                    >
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-signal-green opacity-50" />
                                        <span className="font-mono text-xs uppercase tracking-widest">
                                            {tier}
                                        </span>
                                    </div>
                                )
                            )}
                        </motion.div>

                        {/* CTA Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
                        >
                            <button className="group px-8 py-4 bg-signal-green text-carbon font-bold uppercase tracking-widest hover:bg-signal-green/90 transition-all flex items-center gap-2">
                                <Flag className="w-4 h-4" />
                                Start Your Lap
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 border border-border text-foreground font-mono uppercase tracking-widest hover:border-signal-green hover:text-signal-green transition-all">
                                View Telemetry
                            </button>
                        </motion.div>

                        {/* Bottom HUD Line */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// Internal Components
// ============================================================================

function TypewriterText({ words }: { words: string[] }) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const timeout2 = setTimeout(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    useEffect(() => {
        if (subIndex === words[index].length + 1 && !reverse) {
            setReverse(true);
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, Math.max(reverse ? 75 : subIndex === words[index].length ? 2000 : 150, parseInt(Math.random() * 350 + ""))); // Random typing speed

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <span>
            {words[index].substring(0, subIndex)}
            <span className={`inline-block w-[3px] md:w-[6px] h-[0.8em] bg-primary ml-1 align-baseline ${blink ? "opacity-100" : "opacity-0"}`} />
        </span>
    );
}

function Slideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        { src: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4ki2EjCWbOgcSuJ5Z9p21rUG3HYWhqTDRzvlC", alt: "Business professional 1" },
        { src: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4NknjaPuGcrS0HqFfTLKtNj2ypYVDb9QXM3Ju", alt: "Business professional 2" },
        { src: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4jpxW4BSuLn7R6SXmidGNPpD1lraOJtCjbuf2", alt: "Business professional 3" },
        { src: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4ahGnvrkYYLQv4U3qzFZNVTMbfuBArWH1y8i2", alt: "Business professional 4" },
        { src: "https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4WPTZtWGnc3TYRPZMDStjFyaVNxUKpzemGAv9", alt: "Business professional 5" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                >
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}
        </>
    );
}
