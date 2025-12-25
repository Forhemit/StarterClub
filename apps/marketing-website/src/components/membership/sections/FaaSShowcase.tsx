"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { faasPhases, type FaaSPhase } from "../data/membershipData";
import {
    Building2,
    Rocket,
    ArrowRight,
    Check,
    Timer,
    Zap,
    Flag,
    Fuel,
    Settings,
    Radio
} from "lucide-react";

// ============================================================================
// SECTION 4: FOUNDATION-AS-A-SERVICE (FaaS) SHOWCASE
// Goal: Convert desire into action by presenting the high-ticket Done-For-You/With-You 
// offering as the definitive, zero-risk path.
// ============================================================================

export function FaaSShowcase() {
    const [activeFloor, setActiveFloor] = useState(0);
    const [pitProgress, setPitProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Update active floor based on scroll
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (value) => {
            const floorIndex = Math.min(
                Math.floor(value * faasPhases.length * 1.5),
                faasPhases.length - 1
            );
            setActiveFloor(Math.max(0, floorIndex));
            setPitProgress(Math.min(value * 150, 100));
        });

        return () => unsubscribe();
    }, [scrollYProgress]);

    // Calculate pit stop time (90 seconds max)
    const pitTime = Math.max(0, 90 - (pitProgress / 100) * 90);

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden min-h-[120vh]">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background z-0" />

            {/* ================================================================
                CORPORATE THEME - Architectural Elevator
                Multi-story building section visualization
            ================================================================ */}
            <div className="block racetrack:hidden relative z-10">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                            Foundation-as-a-Service
                        </Badge>
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                            We Build. You Launch.
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            The definitive Done-For-You path. Every floor is a phase.
                            Every phase is expertly executed.
                        </p>
                    </motion.div>

                    {/* Building Visualization + Floor Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Building Visualization */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <BuildingVisualization
                                activeFloor={activeFloor}
                                shouldReduceMotion={!!shouldReduceMotion}
                            />
                        </motion.div>

                        {/* Right: Floor Details Accordion */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Accordion
                                type="single"
                                value={`floor-${activeFloor}`}
                                onValueChange={(val) => setActiveFloor(parseInt(val.split("-")[1]) || 0)}
                                className="space-y-4"
                            >
                                {faasPhases.map((phase, index) => (
                                    <FloorAccordionItem
                                        key={phase.id}
                                        phase={phase}
                                        index={index}
                                        isActive={activeFloor === index}
                                        shouldReduceMotion={!!shouldReduceMotion}
                                    />
                                ))}
                            </Accordion>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-8 p-6 bg-card border border-primary/30"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Rocket className="w-5 h-5 text-primary" />
                                    <span className="font-display text-lg font-bold text-foreground">
                                        Ready to Elevate?
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Schedule a Foundation Assessment to see how FaaS can
                                    accelerate your operational launch.
                                </p>
                                <button className="w-full py-3 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                    Book Assessment
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Pit Stop Time Attack
                90-second pit stop visualization
            ================================================================ */}
            <div className="hidden racetrack:block relative z-10">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-signal-green/30 bg-signal-green/10 mb-4">
                            <Timer className="w-4 h-4 text-signal-green" />
                            <span className="font-mono text-xs text-signal-green uppercase tracking-widest">
                                Pit Lane Services
                            </span>
                        </div>
                        <h2 className="font-sans text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground mb-4">
                            90-Second Launch
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                            Enter the pit lane with an idea. Exit with a race-ready operation.
                        </p>
                    </motion.div>

                    {/* Pit Stop Timer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mb-12"
                    >
                        <div className="bg-carbon border border-border p-8 text-center">
                            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                                Pit Stop Time
                            </div>
                            <motion.div
                                key={Math.round(pitTime)}
                                initial={{ scale: 1.05 }}
                                animate={{ scale: 1 }}
                                className={`
                                    text-7xl md:text-9xl font-bold font-mono tabular-nums
                                    ${pitTime <= 10 ? "text-signal-green" :
                                        pitTime <= 45 ? "text-signal-yellow" :
                                            "text-foreground"}
                                `}
                            >
                                {Math.floor(pitTime / 60)}:{String(Math.floor(pitTime % 60)).padStart(2, "0")}
                                <span className="text-2xl text-muted-foreground">
                                    .{String(Math.floor((pitTime % 1) * 100)).padStart(2, "0")}
                                </span>
                            </motion.div>

                            {/* Progress Bar */}
                            <div className="mt-6 h-2 bg-carbon-light rounded-full overflow-hidden">
                                <motion.div
                                    style={{ width: `${pitProgress}%` }}
                                    className={`h-full transition-all duration-300 ${pitProgress >= 90 ? "bg-signal-green" :
                                            pitProgress >= 50 ? "bg-signal-yellow" :
                                                "bg-primary"
                                        }`}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Pit Crew Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {faasPhases.map((phase, index) => (
                            <PitCrewActionCard
                                key={phase.id}
                                phase={phase}
                                index={index}
                                isActive={activeFloor >= index}
                                isComplete={pitProgress >= ((index + 1) / faasPhases.length) * 100}
                                shouldReduceMotion={!!shouldReduceMotion}
                            />
                        ))}
                    </div>

                    {/* Final Car Exit Animation */}
                    <AnimatePresence>
                        {pitProgress >= 95 && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                                className="max-w-2xl mx-auto text-center"
                            >
                                <div className="bg-signal-green/10 border border-signal-green p-8">
                                    <div className="text-6xl mb-4">🏎️💨</div>
                                    <div className="font-sans text-3xl font-bold uppercase tracking-tight text-signal-green mb-2">
                                        PIT STOP COMPLETE
                                    </div>
                                    <p className="text-muted-foreground font-mono text-sm">
                                        Fully assembled. Fully compliant. Ready to race.
                                    </p>
                                    <button className="mt-6 px-8 py-4 bg-signal-green text-carbon font-bold uppercase tracking-widest hover:bg-signal-green/90 transition-colors">
                                        <Flag className="w-4 h-4 inline-block mr-2" />
                                        Request Pit Lane Entry
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// CORPORATE THEME - BUILDING VISUALIZATION
// ============================================================================

interface BuildingVisualizationProps {
    activeFloor: number;
    shouldReduceMotion: boolean;
}

function BuildingVisualization({ activeFloor, shouldReduceMotion }: BuildingVisualizationProps) {
    const totalFloors = faasPhases.length;

    return (
        <div className="relative w-full max-w-sm mx-auto">
            {/* Building Structure */}
            <div className="relative bg-card border border-border overflow-hidden"
                style={{
                    boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
                }}
            >
                {/* Floors - Stacked from bottom to top */}
                <div className="relative">
                    {faasPhases.slice().reverse().map((phase, reversedIndex) => {
                        const index = totalFloors - 1 - reversedIndex;
                        const isActive = activeFloor === index;
                        const isCompleted = activeFloor > index;
                        const isRoof = index === totalFloors - 1;

                        return (
                            <motion.div
                                key={phase.id}
                                animate={{
                                    backgroundColor: isCompleted || isActive
                                        ? isRoof ? "rgba(212, 175, 55, 0.2)" : "rgba(212, 175, 55, 0.1)"
                                        : "transparent",
                                }}
                                className={`
                                    relative h-24 border-b border-border transition-all duration-500
                                    ${isActive ? "border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}
                                `}
                            >
                                {/* Floor Number */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                                    {String(phase.floor).padStart(2, "0")}
                                </div>

                                {/* Floor Content */}
                                <div className="ml-12 h-full flex items-center">
                                    <div className={`
                                        transition-all duration-300
                                        ${isActive || isCompleted ? "opacity-100" : "opacity-30"}
                                    `}>
                                        <div className="font-display text-sm font-bold text-foreground">
                                            {phase.title}
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-muted-foreground mt-1"
                                            >
                                                {phase.deliverables[0]}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Completion Indicator */}
                                {isCompleted && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    >
                                        <Check className="w-5 h-5 text-primary" />
                                    </motion.div>
                                )}

                                {/* Roof - Launch Pad */}
                                {isRoof && (
                                    <motion.div
                                        animate={{
                                            backgroundColor: activeFloor === totalFloors - 1
                                                ? "rgb(34, 197, 94)"
                                                : "transparent"
                                        }}
                                        className="absolute top-0 inset-x-0 h-2 transition-colors duration-500"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Elevator Shaft */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-border">
                    <motion.div
                        animate={{
                            top: `${((totalFloors - 1 - activeFloor) / totalFloors) * 100}%`,
                        }}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.5,
                            ease: [0.43, 0.13, 0.23, 0.96]
                        }}
                        className="absolute left-0 w-1 h-24 bg-primary"
                        style={{
                            boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
                        }}
                    />
                </div>
            </div>

            {/* Building Base */}
            <div className="h-4 bg-gradient-to-t from-muted to-card border-x border-b border-border" />
        </div>
    );
}

// ============================================================================
// CORPORATE THEME - FLOOR ACCORDION ITEM
// ============================================================================

interface FloorAccordionItemProps {
    phase: FaaSPhase;
    index: number;
    isActive: boolean;
    shouldReduceMotion: boolean;
}

function FloorAccordionItem({ phase, index, isActive, shouldReduceMotion }: FloorAccordionItemProps) {
    return (
        <AccordionItem
            value={`floor-${index}`}
            className={`
                border bg-card transition-all duration-300
                ${isActive ? "border-primary/30" : "border-border"}
            `}
        >
            <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                <div className="flex items-center gap-4 w-full">
                    <div className={`
                        w-10 h-10 flex items-center justify-center font-mono text-sm font-bold transition-colors
                        ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                    `}>
                        {String(phase.floor).padStart(2, "0")}
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {phase.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {phase.deliverables.length} deliverables
                        </div>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
                <div className="pl-14 space-y-3">
                    {phase.deliverables.map((deliverable, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: shouldReduceMotion ? 0 : i * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground text-sm">{deliverable}</span>
                        </motion.div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

// ============================================================================
// RACING THEME - PIT CREW ACTION CARD
// ============================================================================

interface PitCrewActionCardProps {
    phase: FaaSPhase;
    index: number;
    isActive: boolean;
    isComplete: boolean;
    shouldReduceMotion: boolean;
}

function PitCrewActionCard({ phase, index, isActive, isComplete, shouldReduceMotion }: PitCrewActionCardProps) {
    const getActionIcon = () => {
        switch (phase.pitAction) {
            case "Wheel Change":
                return Settings;
            case "Fuel Rig Connection":
                return Fuel;
            case "Front Wing Adjustment":
                return Zap;
            case "GO Signal":
                return Flag;
            default:
                return Radio;
        }
    };

    const ActionIcon = getActionIcon();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
            className={`
                relative bg-carbon border p-6 transition-all duration-300
                ${isComplete ? "border-signal-green" : isActive ? "border-signal-yellow" : "border-border"}
            `}
        >
            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
                <motion.div
                    animate={{
                        backgroundColor: isComplete ? "#00ff9d" : isActive ? "#ffbf00" : "#333",
                    }}
                    className="w-2 h-2 rounded-full"
                />
            </div>

            {/* Action Icon */}
            <div className={`
                w-12 h-12 flex items-center justify-center mb-4 transition-colors
                ${isComplete ? "bg-signal-green/20 text-signal-green" :
                    isActive ? "bg-signal-yellow/20 text-signal-yellow" :
                        "bg-muted text-muted-foreground"}
            `}>
                <ActionIcon className="w-6 h-6" />
            </div>

            {/* Action Name */}
            <h4 className="font-sans text-lg font-bold uppercase tracking-tight text-foreground mb-1">
                {phase.pitAction}
            </h4>

            {/* Crew Position */}
            <div className="text-xs font-mono text-muted-foreground mb-3">
                {phase.crewPosition}
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-muted-foreground">
                    Duration
                </div>
                <div className={`
                    text-lg font-bold font-mono
                    ${isComplete ? "text-signal-green" : "text-foreground"}
                `}>
                    {phase.duration}s
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-1 bg-carbon-light overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isComplete ? "100%" : isActive ? "50%" : "0%" }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${isComplete ? "bg-signal-green" : "bg-signal-yellow"}`}
                />
            </div>

            {/* Completion Checkmark */}
            {isComplete && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-signal-green rounded-full flex items-center justify-center"
                >
                    <Check className="w-4 h-4 text-carbon" />
                </motion.div>
            )}
        </motion.div>
    );
}
