"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { membershipTiers, type MembershipTier, type TierBenefit } from "../data/membershipData";
import { Check, ChevronRight, Car, Gauge, Fuel, Wrench } from "lucide-react";

// ============================================================================
// SECTION 2: MEMBERSHIP TIERS VISUALIZATION
// Goal: Generate interest by making tier comparison an immersive, exploratory experience
// ============================================================================

export function MembershipTiers() {
    const [activeTier, setActiveTier] = useState<string | null>(null);
    const [activeBenefit, setActiveBenefit] = useState<TierBenefit | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="relative w-full py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background z-0" />

            {/* ================================================================
                CORPORATE THEME - Portfolio Folio Cards
                Each tier is a dimensional financial portfolio that opens on hover
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
                            Structured Access
                        </Badge>
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Three Paths to Legacy
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Each tier is an investment in your operational foundation.
                            Choose the level that matches your ambition.
                        </p>
                    </motion.div>

                    {/* Tier Cards - Z-Axis Curve Layout */}
                    <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 perspective-1000">
                        {membershipTiers.map((tier, index) => (
                            <TierCard
                                key={tier.id}
                                tier={tier}
                                index={index}
                                isHovered={hoveredCard === tier.id}
                                isActive={activeTier === tier.id}
                                onHover={() => setHoveredCard(tier.id)}
                                onLeave={() => setHoveredCard(null)}
                                onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
                                onBenefitClick={setActiveBenefit}
                                shouldReduceMotion={!!shouldReduceMotion}
                            />
                        ))}
                    </div>

                    {/* Data Slate - Benefit Details Panel */}
                    <AnimatePresence>
                        {activeBenefit && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
                            >
                                <div className="bg-card border border-primary/30 p-6 shadow-2xl shadow-primary/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                                                <activeBenefit.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-display text-lg font-bold text-foreground">
                                                    {activeBenefit.title}
                                                </h4>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveBenefit(null)}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {activeBenefit.description}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <span className="text-xs text-primary uppercase tracking-widest">
                                            {activeBenefit.corporateType === "embossed" ? "Premium Feature" :
                                                activeBenefit.corporateType === "circuit" ? "Advanced Access" : "Core Feature"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Vehicle Spec Sheets
                Three tiers as racing vehicles on a spec sheet
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
                            <Gauge className="w-4 h-4 text-signal-green" />
                            <span className="font-mono text-xs text-signal-green uppercase tracking-widest">
                                Vehicle Selection
                            </span>
                        </div>
                        <h2 className="font-sans text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground mb-4">
                            Choose Your Machine
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                            Each chassis built for different racing conditions.
                            Select your performance level.
                        </p>
                    </motion.div>

                    {/* Vehicle Spec Cards - Horizontal Scroll on Mobile */}
                    <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4 snap-x snap-mandatory lg:snap-none">
                        {membershipTiers.map((tier, index) => (
                            <VehicleSpecCard
                                key={tier.id}
                                tier={tier}
                                index={index}
                                isActive={activeTier === tier.id}
                                onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
                                shouldReduceMotion={!!shouldReduceMotion}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// CORPORATE THEME - TIER CARD COMPONENT
// ============================================================================

interface TierCardProps {
    tier: MembershipTier;
    index: number;
    isHovered: boolean;
    isActive: boolean;
    onHover: () => void;
    onLeave: () => void;
    onClick: () => void;
    onBenefitClick: (benefit: TierBenefit) => void;
    shouldReduceMotion: boolean;
}

function TierCard({
    tier,
    index,
    isHovered,
    isActive,
    onHover,
    onLeave,
    onClick,
    onBenefitClick,
    shouldReduceMotion,
}: TierCardProps) {
    const isFounder = tier.id === "starter-founder";
    const isBuilder = tier.id === "starter-builder";

    // Material styles based on tier
    const getMaterialStyle = () => {
        switch (tier.corporateMaterial) {
            case "carbon-gold":
                return {
                    background: `linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #151515 100%)`,
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                    boxShadow: isHovered
                        ? "0 25px 80px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
                        : "0 15px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                };
            case "brushed-aluminum":
                return {
                    background: `linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #252525 100%)`,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: isHovered
                        ? "0 20px 60px rgba(0, 0, 0, 0.4)"
                        : "0 10px 40px rgba(0, 0, 0, 0.2)",
                };
            default:
                return {
                    background: `rgba(255, 255, 255, 0.02)`,
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: isHovered
                        ? "0 15px 50px rgba(0, 0, 0, 0.3)"
                        : "0 8px 30px rgba(0, 0, 0, 0.15)",
                };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -5 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: index * 0.15,
            }}
            whileHover={shouldReduceMotion ? {} : {
                y: -10,
                scale: 1.02,
                rotateY: 0,
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onClick}
            className={`
                relative w-full lg:w-[340px] cursor-pointer transition-all duration-500
                ${isFounder ? "lg:z-10 lg:scale-105" : "lg:z-0"}
            `}
            style={{
                transform: !shouldReduceMotion && !isHovered ?
                    `rotateY(${(index - 1) * 3}deg) translateZ(${isFounder ? 20 : 0}px)` :
                    undefined,
            }}
        >
            <Card
                className="overflow-hidden transition-all duration-500"
                style={getMaterialStyle()}
            >
                {/* Card Header with Tier Badge */}
                <CardHeader className="relative pb-4">
                    {isFounder && (
                        <div className="absolute -top-1 -right-1 w-20 h-20 overflow-hidden">
                            <div className="absolute top-4 -right-8 w-32 text-center transform rotate-45 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-1">
                                Premium
                            </div>
                        </div>
                    )}
                    <Badge
                        variant="outline"
                        className={`w-fit mb-2 ${isFounder ? "border-primary/50 text-primary" :
                                isBuilder ? "border-foreground/30 text-foreground" :
                                    "border-muted-foreground/30 text-muted-foreground"
                            }`}
                    >
                        {tier.id === "starter-member" ? "Essential" :
                            tier.id === "starter-builder" ? "Professional" : "Executive"}
                    </Badge>
                    <CardTitle className="font-display text-2xl text-foreground">
                        {tier.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                        {tier.tagline}
                    </p>

                    {/* Pricing */}
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                            ${tier.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground text-sm">/month</span>
                    </div>
                </CardHeader>

                {/* Benefits List */}
                <CardContent className="pt-0">
                    <div className="space-y-3">
                        {tier.benefits.slice(0, isActive ? undefined : 4).map((benefit) => (
                            <motion.button
                                key={benefit.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBenefitClick(benefit);
                                }}
                                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                                className="w-full flex items-start gap-3 text-left group p-2 -mx-2 rounded hover:bg-primary/5 transition-colors"
                            >
                                <div className={`
                                    w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                                    ${benefit.corporateType === "embossed" ? "bg-primary/20 text-primary" :
                                        benefit.corporateType === "circuit" ? "bg-foreground/10 text-foreground" :
                                            "bg-muted text-muted-foreground"}
                                `}>
                                    <Check className="w-3 h-3" />
                                </div>
                                <div className="flex-1">
                                    <span className={`text-sm ${benefit.corporateType === "embossed" ? "text-foreground font-medium" :
                                            "text-muted-foreground"
                                        }`}>
                                        {benefit.title}
                                    </span>
                                    {benefit.corporateType === "circuit" && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="w-8 h-0.5 bg-primary/30" />
                                            <div className="w-4 h-0.5 bg-primary/20" />
                                            <div className="w-2 h-0.5 bg-primary/10" />
                                        </div>
                                    )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        ))}

                        {!isActive && tier.benefits.length > 4 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick();
                                }}
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                +{tier.benefits.length - 4} more benefits
                            </button>
                        )}
                    </div>

                    {/* CTA Button */}
                    <button className={`
                        w-full mt-6 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300
                        ${isFounder
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary"
                        }
                    `}>
                        {isFounder ? "Apply Now" : "Get Started"}
                    </button>
                </CardContent>

                {/* Material texture overlay */}
                {tier.corporateMaterial === "carbon-gold" && (
                    <div
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                            backgroundImage: `
                                repeating-linear-gradient(
                                    45deg,
                                    transparent,
                                    transparent 2px,
                                    rgba(255,255,255,0.02) 2px,
                                    rgba(255,255,255,0.02) 4px
                                )
                            `,
                        }}
                    />
                )}
            </Card>
        </motion.div>
    );
}

// ============================================================================
// RACING THEME - VEHICLE SPEC CARD COMPONENT
// ============================================================================

interface VehicleSpecCardProps {
    tier: MembershipTier;
    index: number;
    isActive: boolean;
    onClick: () => void;
    shouldReduceMotion: boolean;
}

function VehicleSpecCard({
    tier,
    index,
    isActive,
    onClick,
    shouldReduceMotion,
}: VehicleSpecCardProps) {
    const isRaceCar = tier.vehicleType === "race-car";
    const isCoupe = tier.vehicleType === "coupe";

    // Vehicle stats for racing theme
    const getVehicleStats = () => {
        switch (tier.vehicleType) {
            case "race-car":
                return { power: 95, handling: 98, reliability: 100, support: 100 };
            case "coupe":
                return { power: 75, handling: 80, reliability: 85, support: 70 };
            default:
                return { power: 50, handling: 55, reliability: 60, support: 40 };
        }
    };

    const stats = getVehicleStats();

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: index * 0.2,
            }}
            onClick={onClick}
            className={`
                snap-center flex-shrink-0 w-full lg:w-[380px] cursor-pointer
                transition-all duration-300
            `}
        >
            <div className={`
                relative bg-carbon border p-6 h-full
                ${isRaceCar ? "border-signal-green" : isCoupe ? "border-signal-yellow" : "border-border"}
                hover:border-signal-green transition-colors duration-300
            `}>
                {/* Vehicle Class Badge */}
                <div className="flex items-center justify-between mb-6">
                    <div className={`
                        inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest
                        ${isRaceCar ? "bg-signal-green/20 text-signal-green" :
                            isCoupe ? "bg-signal-yellow/20 text-signal-yellow" :
                                "bg-muted text-muted-foreground"}
                    `}>
                        <Car className="w-3 h-3" />
                        {tier.vehicleType === "race-car" ? "GT1 Class" :
                            tier.vehicleType === "coupe" ? "GT3 Class" : "Touring"}
                    </div>
                    <span className="font-mono text-2xl font-bold text-foreground">
                        ${tier.monthlyPrice}
                        <span className="text-xs text-muted-foreground">/mo</span>
                    </span>
                </div>

                {/* Vehicle Name */}
                <h3 className="font-sans text-3xl font-bold uppercase tracking-tight text-foreground mb-2">
                    {tier.vehicleName}
                </h3>
                <p className="text-muted-foreground font-mono text-sm mb-6">
                    {tier.tagline}
                </p>

                {/* Vehicle Stats */}
                <div className="space-y-4 mb-6">
                    <StatBar label="Power" value={stats.power} color="signal-green" icon={Gauge} />
                    <StatBar label="Handling" value={stats.handling} color="signal-yellow" icon={Wrench} />
                    <StatBar label="Reliability" value={stats.reliability} color="hud-cyan" icon={Fuel} />
                </div>

                {/* Spec List (Benefits) */}
                <div className="border-t border-border pt-4">
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                        Standard Equipment
                    </div>
                    <div className="space-y-2">
                        {tier.benefits.slice(0, isActive ? undefined : 3).map((benefit) => (
                            <div
                                key={benefit.id}
                                className="flex items-center gap-2 text-sm font-mono"
                            >
                                <div className={`
                                    w-1.5 h-1.5 rounded-full
                                    ${isRaceCar ? "bg-signal-green" : isCoupe ? "bg-signal-yellow" : "bg-muted-foreground"}
                                `} />
                                <span className="text-foreground">{benefit.racingLabel || benefit.title}</span>
                            </div>
                        ))}
                        {!isActive && tier.benefits.length > 3 && (
                            <button className="text-signal-green text-xs font-mono hover:underline">
                                +{tier.benefits.length - 3} MORE SPECS
                            </button>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <button className={`
                    w-full mt-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all
                    ${isRaceCar
                        ? "bg-signal-green text-carbon hover:bg-signal-green/90"
                        : "border border-border text-foreground hover:border-signal-green hover:text-signal-green"
                    }
                `}>
                    {isRaceCar ? "⚡ Join Factory Team" : "Select Chassis"}
                </button>

                {/* Corner Accent */}
                {isRaceCar && (
                    <>
                        <div className="absolute top-0 right-0 w-12 h-12">
                            <div className="absolute top-0 right-0 w-full h-0.5 bg-signal-green" />
                            <div className="absolute top-0 right-0 h-full w-0.5 bg-signal-green" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-12 h-12">
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-signal-green" />
                            <div className="absolute bottom-0 left-0 h-full w-0.5 bg-signal-green" />
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}

// ============================================================================
// STAT BAR COMPONENT
// ============================================================================

interface StatBarProps {
    label: string;
    value: number;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
}

function StatBar({ label, value, color, icon: Icon }: StatBarProps) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="w-3 h-3" />
                    {label}
                </div>
                <span className={`text-${color}`}>{value}%</span>
            </div>
            <div className="h-1.5 bg-carbon-light rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full bg-${color}`}
                    style={{ backgroundColor: color === "signal-green" ? "#00ff9d" : color === "signal-yellow" ? "#ffbf00" : "#00f0ff" }}
                />
            </div>
        </div>
    );
}
