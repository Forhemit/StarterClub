"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { certificationCriteria, type CertificationCriterion } from "../data/membershipData";
import {
    TrendingUp,
    Shield,
    Eye,
    Building2,
    AlertTriangle,
    Car,
    Gauge,
    CloudRain,
    Timer,
    Zap,
    CheckCircle2,
    ArrowRight
} from "lucide-react";

// ============================================================================
// SECTION 3: CERTIFICATION BENEFITS
// Goal: Create desire by showcasing certification as the ultimate upgrade
// Speaking to both members AND external stakeholders (investors, buyers)
// ============================================================================

export function CertificationBenefits() {
    const [checkedCriteria, setCheckedCriteria] = useState<Set<string>>(new Set());
    const [viewAsAsset, setViewAsAsset] = useState(false);
    const [acquisitionMode, setAcquisitionMode] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const toggleCriterion = (id: string) => {
        const newChecked = new Set(checkedCriteria);
        if (newChecked.has(id)) {
            newChecked.delete(id);
        } else {
            newChecked.add(id);
        }
        setCheckedCriteria(newChecked);
    };

    // Calculate total metrics
    const totalImpact = certificationCriteria
        .filter((c) => checkedCriteria.has(c.id))
        .reduce((sum, c) => sum + c.investorImpact, 0);

    const totalReliability = certificationCriteria
        .filter((c) => checkedCriteria.has(c.id))
        .reduce((sum, c) => sum + c.reliabilityBonus, 0);

    return (
        <section className="relative w-full py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background z-0" />

            {/* ================================================================
                CORPORATE THEME - Dual-View Interface
                Left: Member checklist | Right: Investor dashboard (Bloomberg-style)
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
                            Business Certification
                        </Badge>
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Built for Due Diligence
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Every criterion strengthens your position. Every milestone
                            increases your valuation potential.
                        </p>
                    </motion.div>

                    {/* Asset View Toggle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-12"
                    >
                        <button
                            onClick={() => setViewAsAsset(!viewAsAsset)}
                            className={`
                                flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-300
                                ${viewAsAsset
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-primary/30 text-primary hover:bg-primary/10"
                                }
                            `}
                        >
                            <Eye className="w-4 h-4" />
                            {viewAsAsset ? "Viewing as Asset" : "View Business as Asset"}
                        </button>
                    </motion.div>

                    {/* Dual-View Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Panel - Member Checklist */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className={`
                                bg-card border p-8 transition-all duration-500
                                ${viewAsAsset ? "border-primary/30" : "border-border"}
                            `}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-5 h-5 text-primary" />
                                <h3 className="font-display text-xl font-bold text-foreground">
                                    {viewAsAsset ? "Asset Fortification Checklist" : "Certification Milestones"}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {certificationCriteria.map((criterion, index) => (
                                    <CorporateChecklistItem
                                        key={criterion.id}
                                        criterion={criterion}
                                        isChecked={checkedCriteria.has(criterion.id)}
                                        onToggle={() => toggleCriterion(criterion.id)}
                                        viewAsAsset={viewAsAsset}
                                        delay={index * 0.1}
                                        shouldReduceMotion={!!shouldReduceMotion}
                                    />
                                ))}
                            </div>

                            {/* Progress Indicator */}
                            <div className="mt-8 pt-6 border-t border-border">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Certification Progress</span>
                                    <span className="text-primary font-mono">
                                        {checkedCriteria.size}/{certificationCriteria.length}
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{
                                            width: `${(checkedCriteria.size / certificationCriteria.length) * 100}%`
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Panel - Investor Dashboard (Bloomberg Style) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`
                                bg-[#0a0a0a] border p-8 font-mono transition-all duration-500
                                ${viewAsAsset ? "border-primary/30" : "border-border"}
                            `}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-bold text-foreground">
                                        {viewAsAsset ? "VALUATION IMPACT" : "INVESTOR METRICS"}
                                    </h3>
                                </div>
                                <div className="text-xs text-muted-foreground">LIVE</div>
                            </div>

                            {/* Metric Tickers */}
                            <div className="space-y-4">
                                {certificationCriteria.map((criterion) => (
                                    <MetricTicker
                                        key={criterion.id}
                                        criterion={criterion}
                                        isActive={checkedCriteria.has(criterion.id)}
                                        shouldReduceMotion={!!shouldReduceMotion}
                                    />
                                ))}
                            </div>

                            {/* Total Impact */}
                            <div className="mt-8 pt-6 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">
                                        Transaction Risk Reduction
                                    </span>
                                    <motion.span
                                        key={totalImpact}
                                        initial={{ scale: 1.2, color: "#00ff9d" }}
                                        animate={{ scale: 1, color: "#d4af37" }}
                                        className="text-2xl font-bold text-primary"
                                    >
                                        +{totalImpact}%
                                    </motion.span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-muted-foreground text-sm">
                                        Valuation Multiple Premium
                                    </span>
                                    <motion.span
                                        key={totalImpact * 0.3}
                                        initial={{ scale: 1.2 }}
                                        animate={{ scale: 1 }}
                                        className="text-xl font-bold text-foreground"
                                    >
                                        +{(totalImpact * 0.3).toFixed(1)}x
                                    </motion.span>
                                </div>
                            </div>

                            {/* Business Architecture Diagram */}
                            <div className="mt-6 p-4 bg-[#050505] border border-border">
                                <div className="text-xs text-muted-foreground mb-3">FOUNDATION STRENGTH</div>
                                <div className="grid grid-cols-5 gap-1">
                                    {certificationCriteria.map((criterion) => (
                                        <motion.div
                                            key={criterion.id}
                                            animate={{
                                                backgroundColor: checkedCriteria.has(criterion.id)
                                                    ? "#d4af37"
                                                    : "#1a1a1a",
                                            }}
                                            className="h-8 transition-colors duration-500"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Team Reliability & Performance Index
                Certification as Vehicle Reliability Homologation tests
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
                            <Shield className="w-4 h-4 text-signal-green" />
                            <span className="font-mono text-xs text-signal-green uppercase tracking-widest">
                                Homologation Protocol
                            </span>
                        </div>
                        <h2 className="font-sans text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground mb-4">
                            Reliability Index
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                            Pass all stress tests. Earn FIA certification. Enter the factory program.
                        </p>
                    </motion.div>

                    {/* Acquisition Mode Toggle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-12"
                    >
                        <button
                            onClick={() => setAcquisitionMode(!acquisitionMode)}
                            className={`
                                flex items-center gap-3 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all
                                ${acquisitionMode
                                    ? "bg-signal-green text-carbon"
                                    : "border border-signal-green/30 text-signal-green hover:bg-signal-green/10"
                                }
                            `}
                        >
                            <Car className="w-4 h-4" />
                            {acquisitionMode ? "Factory Team Mode" : "Activate Acquisition Mode"}
                        </button>
                    </motion.div>

                    {/* Stress Tests Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {certificationCriteria.map((criterion, index) => (
                            <StressTestCard
                                key={criterion.id}
                                criterion={criterion}
                                isCompleted={checkedCriteria.has(criterion.id)}
                                onComplete={() => toggleCriterion(criterion.id)}
                                acquisitionMode={acquisitionMode}
                                delay={index * 0.1}
                                shouldReduceMotion={!!shouldReduceMotion}
                            />
                        ))}
                    </div>

                    {/* Team Shield / Reliability Accumulator */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl mx-auto"
                    >
                        <div className={`
                            relative bg-carbon border p-8 text-center transition-all duration-500
                            ${totalReliability >= 80 ? "border-signal-green" : "border-border"}
                        `}>
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-signal-green" />
                                <div className="absolute top-0 left-0 h-full w-0.5 bg-signal-green" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8">
                                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-signal-green" />
                                <div className="absolute bottom-0 right-0 h-full w-0.5 bg-signal-green" />
                            </div>

                            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                                Team Reliability Index
                            </div>

                            <motion.div
                                key={totalReliability}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                className={`
                                    text-6xl font-bold font-mono mb-4
                                    ${totalReliability >= 80 ? "text-signal-green" :
                                        totalReliability >= 50 ? "text-signal-yellow" :
                                            "text-foreground"}
                                `}
                            >
                                {totalReliability}%
                            </motion.div>

                            {/* Accumulated Badges */}
                            <div className="flex justify-center gap-2 flex-wrap">
                                {certificationCriteria.map((criterion) => (
                                    <AnimatePresence key={criterion.id}>
                                        {checkedCriteria.has(criterion.id) && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                className="px-2 py-1 bg-signal-green/20 text-signal-green text-xs font-mono uppercase"
                                            >
                                                +{criterion.reliabilityBonus}%
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                ))}
                            </div>

                            {/* Acquisition Mode Transformation */}
                            <AnimatePresence>
                                {acquisitionMode && totalReliability >= 80 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 pt-6 border-t border-signal-green/30"
                                    >
                                        <div className="text-signal-green font-mono text-sm mb-2">
                                            FACTORY TEAM ELIGIBLE
                                        </div>
                                        <div className="flex justify-center gap-2">
                                            {["🏎️", "🏎️", "🏎️"].map((car, i) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: i * 0.2 }}
                                                    className="text-2xl"
                                                >
                                                    {car}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// CORPORATE THEME - CHECKLIST ITEM
// ============================================================================

interface CorporateChecklistItemProps {
    criterion: CertificationCriterion;
    isChecked: boolean;
    onToggle: () => void;
    viewAsAsset: boolean;
    delay: number;
    shouldReduceMotion: boolean;
}

function CorporateChecklistItem({
    criterion,
    isChecked,
    onToggle,
    viewAsAsset,
    delay,
    shouldReduceMotion,
}: CorporateChecklistItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay }}
            className={`
                flex items-start gap-4 p-4 -mx-4 transition-all duration-300 cursor-pointer
                ${isChecked ? "bg-primary/5" : "hover:bg-muted/50"}
            `}
            onClick={onToggle}
        >
            <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggle()}
                className="mt-1 border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="flex-1">
                <div className="font-medium text-foreground">{criterion.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                    {viewAsAsset ? criterion.investorMetric : criterion.memberDescription}
                </div>
            </div>
            <div className={`
                text-sm font-mono transition-colors duration-300
                ${isChecked ? "text-primary" : "text-muted-foreground"}
            `}>
                +{criterion.investorImpact}%
            </div>
        </motion.div>
    );
}

// ============================================================================
// CORPORATE THEME - METRIC TICKER
// ============================================================================

interface MetricTickerProps {
    criterion: CertificationCriterion;
    isActive: boolean;
    shouldReduceMotion: boolean;
}

function MetricTicker({ criterion, isActive, shouldReduceMotion }: MetricTickerProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (shouldReduceMotion) {
            setDisplayValue(isActive ? criterion.investorImpact : 0);
            return;
        }

        const targetValue = isActive ? criterion.investorImpact : 0;
        const duration = 500;
        const startValue = displayValue;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = startValue + (targetValue - startValue) * progress;
            setDisplayValue(Math.round(current));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isActive, criterion.investorImpact, shouldReduceMotion]);

    return (
        <div className={`
            flex items-center justify-between py-2 px-3 transition-all duration-300
            ${isActive ? "bg-primary/10 border-l-2 border-primary" : "bg-transparent border-l-2 border-transparent"}
        `}>
            <span className={`text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {criterion.investorMetric}
            </span>
            <span className={`
                font-bold tabular-nums
                ${isActive ? "text-primary" : "text-muted-foreground"}
            `}>
                {displayValue > 0 ? "+" : ""}{displayValue}%
            </span>
        </div>
    );
}

// ============================================================================
// RACING THEME - STRESS TEST CARD
// ============================================================================

interface StressTestCardProps {
    criterion: CertificationCriterion;
    isCompleted: boolean;
    onComplete: () => void;
    acquisitionMode: boolean;
    delay: number;
    shouldReduceMotion: boolean;
}

function StressTestCard({
    criterion,
    isCompleted,
    onComplete,
    acquisitionMode,
    delay,
    shouldReduceMotion,
}: StressTestCardProps) {
    const getTestIcon = () => {
        switch (criterion.testType) {
            case "crash":
                return AlertTriangle;
            case "weather":
                return CloudRain;
            case "pit-stop":
                return Timer;
            case "telemetry":
                return Gauge;
            default:
                return Zap;
        }
    };

    const TestIcon = getTestIcon();

    const getTestLabel = () => {
        switch (criterion.testType) {
            case "crash":
                return "CRASH TEST";
            case "weather":
                return "WEATHER COURSE";
            case "pit-stop":
                return "HOT SWAP";
            case "telemetry":
                return "TELEMETRY CHECK";
            default:
                return "ENDURANCE";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay }}
            onClick={onComplete}
            className={`
                relative bg-carbon border p-6 cursor-pointer transition-all duration-300 group
                ${isCompleted ? "border-signal-green" : "border-border hover:border-signal-yellow"}
            `}
        >
            {/* Test Type Badge */}
            <div className={`
                inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest mb-4
                ${isCompleted ? "bg-signal-green/20 text-signal-green" : "bg-muted text-muted-foreground"}
            `}>
                <TestIcon className="w-3 h-3" />
                {getTestLabel()}
            </div>

            {/* Test Name */}
            <h4 className="font-sans text-xl font-bold uppercase tracking-tight text-foreground mb-2">
                {criterion.title}
            </h4>

            <p className="text-muted-foreground text-sm font-mono mb-4">
                {criterion.memberDescription}
            </p>

            {/* Test Status */}
            <div className="flex items-center justify-between">
                <div className={`
                    flex items-center gap-2 text-sm font-mono
                    ${isCompleted ? "text-signal-green" : "text-muted-foreground"}
                `}>
                    {isCompleted ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            PASSED
                        </>
                    ) : (
                        <>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            RUN TEST
                        </>
                    )}
                </div>
                <div className={`
                    text-lg font-bold font-mono
                    ${isCompleted ? "text-signal-green" : "text-muted-foreground"}
                `}>
                    +{criterion.reliabilityBonus}%
                </div>
            </div>

            {/* Completion Animation Overlay */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-signal-green origin-left"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
