"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Signal, Radio, Navigation2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

/**
 * ContactHero - Section 1: Contact Prologue
 * 
 * Corporate Theme (Luxury/High-Contrast + Neo-Grotesque):
 * - Fractured glass card that reassembles on scroll
 * - Clash Display at 45° rotation
 * - Multiple glass layers with blur
 * - Rotary dial phone visualization
 * 
 * Racing Theme (Cyber-Physical + Maximalist):
 * - Racing helmet HUD with visor reflection
 * - Orbitron with text-stroke
 * - 3D visor that opens on hover
 * - GPS coordinates with signal strength
 */

// Contact info
const CONTACT = {
    address: "55 9th Street, San Francisco 94103",
    phone: "(202) 505-3567",
    phoneDigits: ["2", "0", "2", "5", "0", "5", "3", "5", "6", "7"],
    coordinates: { lat: "37.7749° N", lng: "122.4194° W" },
};

// Rotary dial positions (0-9)
const dialPositions = [
    { digit: "1", angle: 0 },
    { digit: "2", angle: 30 },
    { digit: "3", angle: 60 },
    { digit: "4", angle: 90 },
    { digit: "5", angle: 120 },
    { digit: "6", angle: 150 },
    { digit: "7", angle: 180 },
    { digit: "8", angle: 210 },
    { digit: "9", angle: 240 },
    { digit: "0", angle: 270 },
];

// Glass fragment animation
const fragmentVariants = {
    initial: (custom: { x: number; y: number; rotate: number }) => ({
        x: custom.x,
        y: custom.y,
        rotate: custom.rotate,
        opacity: 0,
    }),
    animate: {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
            delay: 0.5,
        },
    },
};

// Generate fragment positions
const fragments = [
    { x: -200, y: -150, rotate: -45 },
    { x: 200, y: -100, rotate: 30 },
    { x: -150, y: 150, rotate: 60 },
    { x: 180, y: 120, rotate: -30 },
    { x: 0, y: -200, rotate: 15 },
];

export function ContactHero() {
    const [mounted, setMounted] = useState(false);
    const [dialRotation, setDialRotation] = useState(0);
    const [isDialing, setIsDialing] = useState(false);
    const [visorOpen, setVisorOpen] = useState(false);
    const [signalStrength, setSignalStrength] = useState(4);
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

    useEffect(() => {
        setMounted(true);

        // Simulate signal strength fluctuation
        const signalInterval = setInterval(() => {
            setSignalStrength(Math.floor(Math.random() * 2) + 3); // 3-4 bars
        }, 2000);

        return () => clearInterval(signalInterval);
    }, []);

    // Handle rotary dial hover animation
    const handleDialHover = (digit: string) => {
        if (isDialing) return;
        setIsDialing(true);
        const position = dialPositions.find(p => p.digit === digit);
        if (position) {
            setDialRotation(position.angle);
            setTimeout(() => {
                setDialRotation(0);
                setIsDialing(false);
            }, 600);
        }
    };

    return (
        <>
            {/* ========== CORPORATE / LUXURY THEME ========== */}
            <section
                ref={sectionRef}
                className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden block racetrack:hidden"
            >
                {/* Background Layers */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-background" />

                    {/* Geometric Pattern */}
                    <motion.div
                        style={{ y: parallaxY1 }}
                        className="absolute inset-0 opacity-5"
                    >
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(45deg, transparent 48%, rgba(0,240,255,0.1) 50%, transparent 52%),
                                linear-gradient(-45deg, transparent 48%, rgba(0,240,255,0.1) 50%, transparent 52%)
                            `,
                            backgroundSize: "60px 60px",
                        }} />
                    </motion.div>

                    {/* Ambient Glow */}
                    <motion.div
                        style={{ y: parallaxY2 }}
                        className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#00f0ff]/5 blur-[150px] rounded-full"
                    />
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 py-20">
                    {/* Fractured Glass Card */}
                    <div className="relative max-w-4xl mx-auto">
                        {mounted && (
                            <AnimatePresence>
                                {fragments.map((fragment, index) => (
                                    <motion.div
                                        key={index}
                                        custom={fragment}
                                        variants={fragmentVariants}
                                        initial="initial"
                                        animate="animate"
                                        className="absolute inset-0"
                                        style={{
                                            zIndex: fragments.length - index,
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 fractured-glass rounded-lg"
                                            style={{
                                                clipPath: `polygon(${index * 20}% 0%, ${(index + 1) * 20}% 0%, ${(index + 1) * 25}% 100%, ${index * 25}% 100%)`,
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}

                        {/* Main Card */}
                        <Card className="relative float-shadow bg-card/80 backdrop-blur-xl border-[#00f0ff]/10">
                            <CardHeader
                                className="relative overflow-hidden"
                                style={{
                                    clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)",
                                }}
                            >
                                {/* Glass Crack Decorations */}
                                <div className="glass-crack absolute top-[30%] left-0 w-[40%]" style={{ transform: "rotate(15deg)" }} />
                                <div className="glass-crack absolute top-[60%] right-0 w-[35%]" style={{ transform: "rotate(-10deg)" }} />

                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 text-[#00f0ff] text-xs uppercase tracking-[0.25em] mb-6"
                                >
                                    <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                                    Direct Line
                                </motion.div>

                                {/* Headline - 45° rotation accent */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1, duration: 0.8 }}
                                    className="relative"
                                >
                                    <h1 className="font-clash text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-none tracking-tight">
                                        <span className="inline-block transform -rotate-2">Get In</span>
                                        <br />
                                        <span className="inline-block transform rotate-1 text-[#00f0ff]">Touch</span>
                                    </h1>
                                </motion.div>
                            </CardHeader>

                            <CardContent className="pt-8 pb-12">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className="text-muted-foreground text-lg max-w-xl mb-12 font-space-grotesk"
                                >
                                    Ready to build infrastructure that makes your business unstoppable?
                                    We're here to listen, strategize, and execute.
                                </motion.p>

                                {/* Contact Info Grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Address */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.4 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="p-3 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Location</div>
                                            <div className="text-foreground font-medium">{CONTACT.address}</div>
                                        </div>
                                    </motion.div>

                                    {/* Phone with Rotary Dial */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.6 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="p-3 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Call Us</div>
                                            <div className="text-foreground font-medium">{CONTACT.phone}</div>
                                        </div>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rotary Dial Decoration - Desktop Only */}
                        {mounted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 2, duration: 0.8 }}
                                className="absolute -right-24 top-1/2 -translate-y-1/2 hidden xl:block"
                            >
                                <div className="rotary-dial">
                                    <motion.div
                                        animate={{ rotate: dialRotation }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        className="absolute inset-0"
                                    >
                                        {dialPositions.map((pos, i) => {
                                            const radius = 70;
                                            const angleRad = (pos.angle - 90) * (Math.PI / 180);
                                            const x = Math.cos(angleRad) * radius + 100 - 14;
                                            const y = Math.sin(angleRad) * radius + 100 - 14;
                                            return (
                                                <div
                                                    key={i}
                                                    className="dial-hole"
                                                    style={{ left: x, top: y }}
                                                    onMouseEnter={() => handleDialHover(pos.digit)}
                                                >
                                                    {pos.digit}
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

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
                        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ========== RACING / F1 TELEMETRY THEME ========== */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden hidden racetrack:flex pt-20">
                {/* Background */}
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
                    <div className="absolute inset-0 racing-speed-lines opacity-20" style={{
                        background: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,255,157,0.1) 2px, rgba(0,255,157,0.1) 4px)",
                    }} />
                </div>

                {/* Helmet HUD Card */}
                <div className="relative z-10 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto"
                        onMouseEnter={() => setVisorOpen(true)}
                        onMouseLeave={() => setVisorOpen(false)}
                    >
                        <div className="helmet-hud rounded-t-[100px] rounded-b-3xl p-8 md:p-12 neon-pulse">
                            {/* Visor Reflection */}
                            <div className="visor-reflection rounded-t-[90px]" />

                            {/* Visor Content */}
                            <motion.div
                                animate={{
                                    y: visorOpen ? 0 : 20,
                                    opacity: visorOpen ? 1 : 0.7,
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="relative z-10"
                            >
                                {/* Status Badge */}
                                <div className="inline-flex items-center gap-2 border border-signal-green/30 bg-signal-green/10 px-4 py-2 text-xs font-mono text-signal-green uppercase tracking-widest mb-8">
                                    <motion.div
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-2 h-2 bg-signal-green rounded-full"
                                    />
                                    <span>COMMS: ACTIVE</span>
                                </div>

                                {/* Headline */}
                                <h1
                                    className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-none uppercase tracking-tighter mb-6"
                                    style={{
                                        textShadow: `
                                            1px 1px 0 #00ff9d,
                                            2px 2px 0 #00cc7d,
                                            3px 3px 0 #009960,
                                            4px 4px 0 #006640,
                                            5px 5px 10px rgba(0,0,0,0.5)
                                        `,
                                        WebkitTextStroke: "1px rgba(0,255,157,0.3)",
                                    }}
                                >
                                    Radio
                                    <br />
                                    <span className="text-signal-green">Check</span>
                                </h1>

                                <p className="text-muted-foreground text-lg font-jetbrains max-w-lg mb-10">
                                    Establish direct comms with pit wall. Ready to receive your transmission.
                                </p>

                                {/* Contact Info as GPS/Radio */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* GPS Coordinates */}
                                    <div className="flex items-center gap-4 p-4 bg-signal-green/5 border border-signal-green/20">
                                        <Navigation2 className="w-6 h-6 text-signal-green" />
                                        <div>
                                            <div className="text-xs font-mono text-signal-green/70 mb-1">GPS LOCK</div>
                                            <div className="font-jetbrains text-signal-green text-sm">
                                                {CONTACT.coordinates.lat}
                                            </div>
                                            <div className="font-jetbrains text-signal-green text-sm">
                                                {CONTACT.coordinates.lng}
                                            </div>
                                        </div>
                                        {/* Signal Strength */}
                                        <div className="ml-auto gps-signal">
                                            {[1, 2, 3, 4, 5].map((bar) => (
                                                <div
                                                    key={bar}
                                                    className={`signal-bar ${bar <= signalStrength ? "active" : ""}`}
                                                    style={{
                                                        height: bar * 4 + 4,
                                                        opacity: bar <= signalStrength ? 1 : 0.3,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Radio Frequency */}
                                    <div className="flex items-center gap-4 p-4 bg-signal-green/5 border border-signal-green/20">
                                        <Radio className="w-6 h-6 text-signal-green" />
                                        <div>
                                            <div className="text-xs font-mono text-signal-green/70 mb-1">RADIO FREQ</div>
                                            <div className="font-orbitron text-signal-green text-lg tabular-nums">
                                                {CONTACT.phone.replace(/\D/g, "").split("").join(" ")}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address as Pit Box */}
                                <div className="mt-6 p-4 bg-black/50 border-l-4 border-signal-red">
                                    <div className="text-xs font-mono text-signal-red mb-1">PIT BOX LOCATION</div>
                                    <div className="font-jetbrains text-foreground">{CONTACT.address}</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Visor Opening Indicator */}
                        <div className="text-center mt-4">
                            <span className="text-signal-green/50 text-xs font-mono uppercase tracking-widest">
                                {visorOpen ? "// visor open" : "// hover to open visor"}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-signal-green text-xs font-mono uppercase tracking-widest">Scroll Down</span>
                    <div className="w-6 h-10 rounded-full border-2 border-signal-green/30 flex items-start justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 16, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-2 h-2 rounded-full bg-signal-green"
                        />
                    </div>
                </motion.div>
            </section>
        </>
    );
}
