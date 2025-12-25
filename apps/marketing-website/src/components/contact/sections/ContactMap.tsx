"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    MapPin,
    Train,
    Car,
    Navigation2,
    Flag,
    Timer,
    Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * ContactMap - Section 4: Map & Location Visualization
 * 
 * Corporate Theme (Neo-Grotesque data viz):
 * - Isometric technical drawing style
 * - Blueprint overlays
 * - Building extrusion effects
 * - Transit flow diagrams
 * - Cable car route animation
 * 
 * Racing Theme (Maximalist race track):
 * - SF as race circuit
 * - Mario Kart style exaggeration
 * - Pit lane at our address
 * - Ghost car visualization
 * - Lap time calculator
 */

const LOCATION = {
    address: "55 9th Street",
    city: "San Francisco 94103",
    coordinates: { lat: "37.7749", lng: "-122.4194" },
    nearbyLandmarks: [
        { name: "Civic Center BART", distance: "0.2 mi", icon: Train },
        { name: "City Hall", distance: "0.3 mi", icon: MapPin },
        { name: "Parking Garage", distance: "0.1 mi", icon: Car },
    ],
};

// Isometric building blocks for corporate theme
const buildings = [
    { id: 1, x: 20, y: 60, width: 40, height: 80, isTarget: false },
    { id: 2, x: 70, y: 40, width: 35, height: 100, isTarget: false },
    { id: 3, x: 120, y: 50, width: 50, height: 120, isTarget: true }, // Our building
    { id: 4, x: 180, y: 55, width: 30, height: 70, isTarget: false },
    { id: 5, x: 220, y: 45, width: 45, height: 90, isTarget: false },
];

// Race track waypoints for racing theme
const trackPoints = [
    { x: 50, y: 150, name: "Start" },
    { x: 120, y: 80, name: "T1" },
    { x: 220, y: 60, name: "T2" },
    { x: 300, y: 100, name: "T3" },
    { x: 280, y: 180, name: "T4" },
    { x: 200, y: 200, name: "PIT" }, // Our location
    { x: 100, y: 190, name: "T5" },
    { x: 50, y: 150, name: "Finish" },
];

export function ContactMap() {
    const [hoveredBuilding, setHoveredBuilding] = useState<number | null>(null);
    const [lapTime, setLapTime] = useState(0);
    const [isRacing, setIsRacing] = useState(false);
    const [carProgress, setCarProgress] = useState(0);
    const sectionRef = React.useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const routeProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    // Lap timer for racing theme
    useEffect(() => {
        if (isRacing) {
            const interval = setInterval(() => {
                setLapTime(prev => prev + 0.1);
                setCarProgress(prev => {
                    if (prev >= 100) {
                        setIsRacing(false);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isRacing]);

    const startLap = () => {
        setLapTime(0);
        setCarProgress(0);
        setIsRacing(true);
    };

    // Generate track path
    const trackPath = trackPoints.map((p, i) =>
        (i === 0 ? "M" : "L") + `${p.x} ${p.y}`
    ).join(" ");

    return (
        <>
            {/* ========== CORPORATE / LUXURY THEME ========== */}
            <section
                ref={sectionRef}
                className="relative py-24 md:py-32 bg-background overflow-hidden block racetrack:hidden"
            >
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00f0ff]/20 bg-[#00f0ff]/5 text-[#00f0ff] text-xs uppercase tracking-widest mb-6">
                            <Navigation2 className="w-4 h-4" />
                            Location Intel
                        </div>
                        <h2 className="font-chakra text-3xl md:text-5xl font-bold text-foreground mb-4">
                            Find <span className="text-[#00f0ff]">Headquarters</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Strategic positioning in the heart of San Francisco's civic district
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Isometric Map Visualization */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/3] isometric-grid rounded-lg overflow-hidden bg-[#0a1a2a]"
                        >
                            {/* Grid Lines */}
                            <svg className="absolute inset-0 w-full h-full">
                                {/* Isometric grid */}
                                <defs>
                                    <pattern id="iso-grid" width="30" height="17.32" patternUnits="userSpaceOnUse">
                                        <path d="M0 0 l15 8.66 l15 -8.66" fill="none" stroke="rgba(0,240,255,0.1)" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#iso-grid)" />

                                {/* Cable car route - animated on scroll */}
                                <motion.path
                                    d="M 0 200 Q 100 180 200 160 T 400 120"
                                    fill="none"
                                    stroke="#00f0ff"
                                    strokeWidth="2"
                                    strokeDasharray="10 5"
                                    style={{
                                        pathLength: routeProgress,
                                        opacity: 0.6,
                                    }}
                                />
                            </svg>

                            {/* Isometric Buildings */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 300 200" className="w-full max-w-md">
                                    {buildings.map((building) => {
                                        const isHovered = hoveredBuilding === building.id;
                                        const height = building.isTarget ? building.height * 1.3 : building.height;
                                        return (
                                            <g
                                                key={building.id}
                                                onMouseEnter={() => setHoveredBuilding(building.id)}
                                                onMouseLeave={() => setHoveredBuilding(null)}
                                                className="cursor-pointer"
                                            >
                                                <motion.g
                                                    animate={{
                                                        y: isHovered || building.isTarget ? -10 : 0,
                                                    }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    {/* Building face */}
                                                    <rect
                                                        x={building.x}
                                                        y={200 - height}
                                                        width={building.width}
                                                        height={height}
                                                        fill={building.isTarget ? "#00f0ff" : isHovered ? "#334466" : "#223344"}
                                                        stroke={building.isTarget ? "#00f0ff" : "rgba(0,240,255,0.3)"}
                                                        strokeWidth="1"
                                                    />
                                                    {/* Windows */}
                                                    {[...Array(Math.floor(height / 20))].map((_, i) => (
                                                        <rect
                                                            key={i}
                                                            x={building.x + 5}
                                                            y={200 - height + 10 + i * 20}
                                                            width={building.width - 10}
                                                            height={8}
                                                            fill={building.isTarget ? "rgba(255,255,255,0.9)" : "rgba(255,235,153,0.3)"}
                                                        />
                                                    ))}
                                                </motion.g>
                                            </g>
                                        );
                                    })}

                                    {/* Target marker */}
                                    <motion.g
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <circle cx="145" cy="50" r="8" fill="#00f0ff" />
                                        <circle cx="145" cy="50" r="12" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.5" />
                                        <circle cx="145" cy="50" r="16" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
                                    </motion.g>
                                </svg>
                            </div>

                            {/* Fog Effect Overlay */}
                            <motion.div
                                style={{
                                    opacity: useTransform(scrollYProgress, [0, 0.3], [0.8, 0]),
                                }}
                                className="absolute inset-0 bg-gradient-to-t from-[#0a1a2a] via-[#0a1a2a]/50 to-transparent pointer-events-none"
                            />
                        </motion.div>

                        {/* Location Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {/* Address Card */}
                            <Card className="bg-card/80 backdrop-blur border-[#00f0ff]/10 overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-[#00f0ff]/10">
                                            <MapPin className="w-6 h-6 text-[#00f0ff]" />
                                        </div>
                                        <div>
                                            <h3 className="font-chakra text-xl text-foreground mb-1">{LOCATION.address}</h3>
                                            <p className="text-muted-foreground">{LOCATION.city}</p>
                                            <p className="text-xs font-mono text-[#00f0ff] mt-2">
                                                {LOCATION.coordinates.lat}° N, {LOCATION.coordinates.lng}° W
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Transit Options */}
                            <div className="grid gap-4">
                                {LOCATION.nearbyLandmarks.map((landmark, index) => {
                                    const Icon = landmark.icon;
                                    return (
                                        <motion.div
                                            key={landmark.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-4 p-4 border border-border/50 bg-card/50"
                                        >
                                            <Icon className="w-5 h-5 text-[#00f0ff]" />
                                            <span className="flex-1 text-foreground">{landmark.name}</span>
                                            <span className="text-sm text-muted-foreground font-mono">{landmark.distance}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Directions CTA */}
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(LOCATION.address + ", " + LOCATION.city)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full p-4 text-center bg-[#00f0ff] text-black font-chakra uppercase tracking-widest hover:bg-[#00f0ff]/90 transition-colors"
                            >
                                Get Directions
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== RACING / CIRCUIT THEME ========== */}
            <section className="relative py-24 md:py-32 bg-black overflow-hidden hidden racetrack:block">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-orbitron text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter mb-4">
                            Circuit <span className="text-signal-green">Map</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto font-jetbrains">
                            Navigate to pit box. Fastest route wins.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Race Circuit SVG */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/3] bg-[#0a0a0a] border-2 border-signal-green/30 rounded-lg overflow-hidden"
                        >
                            {/* Track Background */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 350 250">
                                {/* Track surface */}
                                <path
                                    d={trackPath}
                                    fill="none"
                                    stroke="#333"
                                    strokeWidth="30"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Track outline */}
                                <path
                                    d={trackPath}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="32"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray="4 6"
                                    opacity="0.3"
                                />

                                {/* Racing line */}
                                <motion.path
                                    d={trackPath}
                                    fill="none"
                                    stroke="#00ff9d"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: isRacing ? carProgress / 100 : 1 }}
                                    transition={{ duration: 0.1 }}
                                />

                                {/* Waypoints */}
                                {trackPoints.map((point, index) => (
                                    <g key={index}>
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r={point.name === "PIT" ? 12 : 6}
                                            fill={point.name === "PIT" ? "#00ff9d" : "#ff0040"}
                                        />
                                        <text
                                            x={point.x + 15}
                                            y={point.y + 4}
                                            fill="white"
                                            fontSize="10"
                                            fontFamily="monospace"
                                        >
                                            {point.name}
                                        </text>
                                    </g>
                                ))}

                                {/* Ghost Car (animated dot) */}
                                {isRacing && (
                                    <motion.circle
                                        r="8"
                                        fill="#ff0040"
                                        filter="url(#glow)"
                                        animate={{
                                            offsetDistance: `${carProgress}%`,
                                        }}
                                        style={{
                                            offsetPath: `path("${trackPath}")`,
                                        }}
                                    />
                                )}

                                {/* Glow filter */}
                                <defs>
                                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                            </svg>

                            {/* Pit Box Label */}
                            <div className="absolute bottom-4 left-4 pit-lane-marker">
                                <div className="font-orbitron text-black text-sm">PIT BOX</div>
                                <div className="font-jetbrains text-black/70 text-xs">{LOCATION.address}</div>
                            </div>
                        </motion.div>

                        {/* Lap Timer & Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {/* Timing Board */}
                            <div className="telemetry-screen p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <Timer className="w-6 h-6 text-signal-green" />
                                    <span className="font-jetbrains text-sm uppercase tracking-widest">LAP TIMER</span>
                                </div>

                                <div className="text-5xl font-orbitron text-signal-green tabular-nums mb-4">
                                    {lapTime.toFixed(1)}s
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={startLap}
                                        disabled={isRacing}
                                        className="flex-1 py-3 bg-signal-green text-black font-bold uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Flag className="w-5 h-5" />
                                        {isRacing ? "RACING..." : "START LAP"}
                                    </button>
                                </div>

                                {carProgress >= 100 && (
                                    <div className="mt-4 p-3 bg-signal-green/10 border border-signal-green/30">
                                        <div className="font-jetbrains text-xs text-signal-green">FASTEST LAP</div>
                                        <div className="font-orbitron text-xl text-foreground">{lapTime.toFixed(1)}s</div>
                                    </div>
                                )}
                            </div>

                            {/* Pit Box Coordinates */}
                            <div className="border border-signal-green/20 p-6 bg-black/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-signal-red" />
                                    <span className="font-bebas text-xl uppercase">Pit Box Location</span>
                                </div>
                                <div className="font-orbitron text-signal-green text-lg mb-2">
                                    {LOCATION.address}
                                </div>
                                <div className="font-jetbrains text-muted-foreground text-sm">
                                    {LOCATION.city}
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="font-jetbrains text-signal-green/70">LAT</div>
                                        <div className="font-orbitron text-foreground">{LOCATION.coordinates.lat}°</div>
                                    </div>
                                    <div>
                                        <div className="font-jetbrains text-signal-green/70">LNG</div>
                                        <div className="font-orbitron text-foreground">{LOCATION.coordinates.lng}°</div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigate Button */}
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(LOCATION.address + ", " + LOCATION.city)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full p-4 text-center border-2 border-signal-green text-signal-green font-orbitron uppercase tracking-widest hover:bg-signal-green hover:text-black transition-all flex items-center justify-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Navigate to Pit
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
