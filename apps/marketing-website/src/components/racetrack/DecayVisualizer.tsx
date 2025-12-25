"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Clock, ShieldCheck, FileText, Briefcase, ChevronRight, X } from "lucide-react";

// Business Health Card Data with importance explanations
const businessHealthCards = [
    {
        title: "Legal",
        status: "VERIFIED",
        statusColor: "emerald",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60",
        verifiedDaysAgo: 2,
        icon: CheckCircle,
        importance: "Your legal foundation is the backbone of your business. Without proper legal structures in place, your business is vulnerable to lawsuits, regulatory issues, and partnership disputes.",
        howWeHelp: "We help you establish and maintain proper corporate bylaws, operating agreements, and legal entity structures. Our team ensures your legal documents are always current and compliant with the latest regulations."
    },
    {
        title: "Insurances",
        status: "NEEDS UPDATE",
        statusColor: "amber",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
        verifiedDaysAgo: 140,
        icon: AlertTriangle,
        importance: "Insurance protects your business from unexpected losses, liability claims, and catastrophic events. Inadequate coverage can mean the difference between surviving a crisis and closing your doors.",
        howWeHelp: "We audit your current insurance policies, identify coverage gaps, and connect you with trusted insurance partners. We also set reminders for policy renewals and ensure your coverage scales with your growth."
    },
    {
        title: "Financial",
        status: "AT RISK",
        statusColor: "red",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
        verifiedDaysAgo: 200,
        icon: XCircle,
        importance: "Financial compliance keeps your business in good standing with tax authorities and protects you from costly penalties, audits, and legal issues that can derail your growth.",
        howWeHelp: "We help you maintain proper financial records, ensure tax compliance, and establish systems for ongoing financial health monitoring. Our tools alert you before deadlines and compliance issues arise."
    },
    {
        title: "Intellectual Property",
        status: "VERIFIED",
        statusColor: "emerald",
        image: "/images/intellectual-property-luxury.png",
        verifiedDaysAgo: 5,
        icon: ShieldCheck,
        importance: "Your intellectual property—trademarks, patents, copyrights, and trade secrets—represents your unique value in the marketplace. Unprotected IP can be copied, stolen, or lost to competitors.",
        howWeHelp: "We help you identify, document, and protect your intellectual property assets. From trademark registrations to trade secret protocols, we ensure your innovations remain yours."
    },
    {
        title: "Systems and Processes",
        status: "NEEDS UPDATE",
        statusColor: "amber",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60",
        verifiedDaysAgo: 165,
        icon: FileText,
        importance: "Well-documented systems and processes make your business scalable, valuable, and resilient. They reduce dependency on individual team members and ensure consistent quality delivery.",
        howWeHelp: "We help you document critical workflows, create standard operating procedures, and implement project management systems that keep your team aligned and efficient."
    },
    {
        title: "Business Preparedness",
        status: "AT RISK",
        statusColor: "red",
        image: "https://images.unsplash.com/photo-1586880244406-5598386c62cc?w=800&auto=format&fit=crop&q=60",
        verifiedDaysAgo: 195,
        icon: Briefcase,
        importance: "Business preparedness means having plans for continuity, succession, and crisis management. Without it, unexpected events can cause permanent damage to your business.",
        howWeHelp: "We help you create comprehensive contingency plans, establish vendor backup strategies, and build resilience into your operations so your business can weather any storm."
    }
];

// Modal Component for Business Health explanations
function BusinessHealthModal({ card, isOpen, onClose }: { card: typeof businessHealthCards[0] | null; isOpen: boolean; onClose: () => void }) {
    if (!card) return null;

    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
        emerald: {
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            text: "text-emerald-700 dark:text-emerald-400",
            border: "border-emerald-500"
        },
        amber: {
            bg: "bg-amber-100 dark:bg-amber-900/30",
            text: "text-amber-700 dark:text-amber-400",
            border: "border-amber-500"
        },
        red: {
            bg: "bg-red-100 dark:bg-red-900/30",
            text: "text-red-700 dark:text-red-400",
            border: "border-red-500"
        }
    };

    const colors = statusColors[card.statusColor];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            {/* Header with Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                                <div className="absolute bottom-4 left-6">
                                    <span className={`inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider rounded ${colors.bg} ${colors.text} mb-2`}>
                                        {card.status}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Why It's Important */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-mono uppercase tracking-wider text-amber-600 dark:text-amber-500">
                                        Why It's Important
                                    </h4>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                        {card.importance}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-neutral-200 dark:bg-white/10" />

                                {/* How We Help */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-500">
                                        How We Help You Build Stronger
                                    </h4>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                        {card.howWeHelp}
                                    </p>
                                </div>

                                {/* CTA */}
                                <button className="w-full py-3 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:opacity-90 transition-opacity">
                                    Get Started with {card.title}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Racetrack Modal Component
function RacetrackModal({ card, isOpen, onClose }: { card: typeof businessHealthCards[0] | null; isOpen: boolean; onClose: () => void }) {
    if (!card) return null;

    const statusColors: Record<string, { border: string; text: string; glow: string }> = {
        emerald: {
            border: "border-signal-green",
            text: "text-signal-green",
            glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        },
        amber: {
            border: "border-signal-yellow",
            text: "text-signal-yellow",
            glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        },
        red: {
            border: "border-signal-red",
            text: "text-signal-red",
            glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        }
    };

    const colors = statusColors[card.statusColor];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className={`bg-card border-2 ${colors.border} ${colors.glow} rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto`}>
                            {/* Header */}
                            <div className={`border-b ${colors.border} p-4 flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <span className={`font-mono text-xs uppercase tracking-wider ${colors.text}`}>
                                        [{card.status}]
                                    </span>
                                    <h3 className="text-xl font-bold text-foreground font-mono">{card.title}</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-muted rounded transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6 font-mono">
                                {/* Why It's Important */}
                                <div className="space-y-2">
                                    <h4 className="text-signal-yellow text-sm uppercase tracking-wider">
                                        &gt; IMPORTANCE_LEVEL: CRITICAL
                                    </h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {card.importance}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-border" />

                                {/* How We Help */}
                                <div className="space-y-2">
                                    <h4 className="text-signal-green text-sm uppercase tracking-wider">
                                        &gt; SOLUTION_PROTOCOL: ACTIVE
                                    </h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {card.howWeHelp}
                                    </p>
                                </div>

                                {/* CTA */}
                                <button className={`w-full py-3 px-6 border ${colors.border} ${colors.text} font-mono text-sm uppercase tracking-wider hover:bg-muted transition-colors rounded`}>
                                    Initialize {card.title} Protocol
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function DecayVisualizer() {
    const [selectedCard, setSelectedCard] = useState<typeof businessHealthCards[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewClick = (card: typeof businessHealthCards[0]) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    return (
        <>
            {/* ========================================== */}
            {/* RACE TRACK MODE (Original Design Restored) */}
            {/* ========================================== */}
            <section className="w-full py-24 bg-muted border-t border-border hidden racetrack:block">
                <div className="container mx-auto px-4">

                    {/* Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                        <h2 className="text-amber-600 dark:text-signal-yellow font-mono text-sm uppercase tracking-widest">Business Health.</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            Build to Win. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-signal-red dark:to-orange-600">Build to Last.</span>
                        </h3>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
                            Your business health degrades without maintenance. We help you build a foundation that stands the test of time.
                        </p>
                    </div>

                    {/* The Cards (Restored Style + 3 New Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Card 1: Legal */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative bg-card border border-signal-green/20 p-6 rounded-lg overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-signal-green" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-2 bg-emerald-100 dark:bg-signal-green/10 rounded-full">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-signal-green" />
                                </div>
                                <span className="text-emerald-600 dark:text-signal-green font-mono text-xs border border-emerald-600/30 dark:border-signal-green/30 px-2 py-1 rounded">VERIFIED</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-foreground font-bold text-xl">Legal</h4>
                                <p className="text-muted-foreground text-sm font-mono">
                                    Corporate structure and governance documents
                                </p>
                            </div>
                            <button
                                onClick={() => handleViewClick(businessHealthCards[0])}
                                className="mt-4 text-signal-green font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                                View <ChevronRight className="w-3 h-3" />
                            </button>
                        </motion.div>

                        {/* Card 2: Insurances */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative bg-card border border-signal-yellow/20 p-6 rounded-lg overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-signal-yellow" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-2 bg-amber-100 dark:bg-signal-yellow/10 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-signal-yellow" />
                                </div>
                                <span className="text-amber-600 dark:text-signal-yellow font-mono text-xs border border-amber-600/30 dark:border-signal-yellow/30 px-2 py-1 rounded">NEEDS UPDATE</span>
                            </div>
                            <div className="space-y-2 opacity-80">
                                <h4 className="text-foreground font-bold text-xl">Insurances</h4>
                                <p className="text-muted-foreground text-sm font-mono">
                                    Coverage policies protecting your business
                                </p>
                            </div>
                            <button
                                onClick={() => handleViewClick(businessHealthCards[1])}
                                className="mt-4 text-signal-yellow font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                                View <ChevronRight className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-signal-yellow/5 blurred-xl rounded-full translate-y-10 translate-x-10 pointer-events-none" />
                        </motion.div>

                        {/* Card 3: Financial */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative bg-card border border-signal-red/20 p-6 rounded-lg overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-signal-red" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-2 bg-red-100 dark:bg-signal-red/10 rounded-full animate-pulse">
                                    <XCircle className="w-6 h-6 text-red-600 dark:text-signal-red" />
                                </div>
                                <span className="text-red-600 dark:text-signal-red font-mono text-xs border border-red-600/30 dark:border-signal-red/30 px-2 py-1 rounded">AT RISK</span>
                            </div>
                            <div className="space-y-2 opacity-60 grayscale-[50%]">
                                <h4 className="text-foreground font-bold text-xl">Financial</h4>
                                <p className="text-muted-foreground text-sm font-mono">
                                    Tax compliance and financial health records
                                </p>
                            </div>
                            <button
                                onClick={() => handleViewClick(businessHealthCards[2])}
                                className="mt-4 text-signal-red font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                                View <ChevronRight className="w-3 h-3" />
                            </button>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                            <div className="absolute -bottom-4 -right-4 text-9xl font-bold text-signal-red/5 select-none pointer-events-none">ERROR</div>
                        </motion.div>

                        {/* Card 4: Intellectual Property */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative bg-card border border-signal-green/20 p-6 rounded-lg overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-signal-green" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-2 bg-emerald-100 dark:bg-signal-green/10 rounded-full">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-signal-green" />
                                </div>
                                <span className="text-emerald-600 dark:text-signal-green font-mono text-xs border border-emerald-600/30 dark:border-signal-green/30 px-2 py-1 rounded">VERIFIED</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-foreground font-bold text-xl">Intellectual Property</h4>
                                <p className="text-muted-foreground text-sm font-mono">
                                    Trademarks, patents, and trade secrets
                                </p>
                            </div>
                            <button
                                onClick={() => handleViewClick(businessHealthCards[3])}
                                className="mt-4 text-signal-green font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                                View <ChevronRight className="w-3 h-3" />
                            </button>
                        </motion.div>

                        {/* Card 5: Systems and Processes */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative bg-card border border-signal-yellow/20 p-6 rounded-lg overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-signal-yellow" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-2 bg-amber-100 dark:bg-signal-yellow/10 rounded-full">
                                    <FileText className="w-6 h-6 text-amber-600 dark:text-signal-yellow" />
                                </div>
                                <span className="text-amber-600 dark:text-signal-yellow font-mono text-xs border border-amber-600/30 dark:border-signal-yellow/30 px-2 py-1 rounded">NEEDS UPDATE</span>
                            </div>
                            <div className="space-y-2 opacity-80">
                                <h4 className="text-foreground font-bold text-xl">Systems and Processes</h4>
                                <p className="text-muted-foreground text-sm font-mono">
                                    SOPs and workflow documentation
                                </p>
                            </div>
                            <button
                                onClick={() => handleViewClick(businessHealthCards[4])}
                                className="mt-4 text-signal-yellow font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                                View <ChevronRight className="w-3 h-3" />
                            </button>
                        </motion.div>

                        {/* Card 6: Business Preparedness */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative bg-card border border-signal-red/20 p-6 rounded-lg overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-signal-red" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-2 bg-red-100 dark:bg-signal-red/10 rounded-full animate-pulse">
                                    <Briefcase className="w-6 h-6 text-red-600 dark:text-signal-red" />
                                </div>
                                <span className="text-red-600 dark:text-signal-red font-mono text-xs border border-red-600/30 dark:border-signal-red/30 px-2 py-1 rounded">AT RISK</span>
                            </div>
                            <div className="space-y-2 opacity-60 grayscale-[50%]">
                                <h4 className="text-foreground font-bold text-xl">Business Preparedness</h4>
                                <p className="text-muted-foreground text-sm font-mono">
                                    Contingency and continuity planning
                                </p>
                            </div>
                            <button
                                onClick={() => handleViewClick(businessHealthCards[5])}
                                className="mt-4 text-signal-red font-mono text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                                View <ChevronRight className="w-3 h-3" />
                            </button>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                        </motion.div>

                    </div>
                </div>

                {/* Racetrack Modal */}
                <RacetrackModal card={selectedCard} isOpen={isModalOpen} onClose={handleCloseModal} />
            </section>

            {/* ========================================== */}
            {/* LUXURY MODE (White/Dark Theme Image Cards) */}
            {/* ========================================== */}
            <section className="w-full py-32 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-white/10 relative overflow-hidden transition-colors duration-500 block racetrack:hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="text-amber-600 dark:text-amber-500/80 font-mono text-xs uppercase tracking-[0.3em]"
                        >
                            Business Health
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                            className="text-4xl md:text-6xl font-medium text-neutral-900 dark:text-white tracking-tight leading-tight"
                        >
                            Build Your Business to Win. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-700 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-600">
                                Build Your Business to Last.
                            </span>
                        </motion.h3>
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            whileInView={{ opacity: 1, width: "100px" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto my-8"
                        />
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.6 }}
                            className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide"
                        >
                            Because winning once isn't the same as winning for life.
                        </motion.p>
                    </div>

                    {/* The Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <LuxuryImageCard
                            card={businessHealthCards[0]}
                            delay={0.1}
                            onViewClick={handleViewClick}
                        />
                        <LuxuryImageCard
                            card={businessHealthCards[1]}
                            delay={0.2}
                            onViewClick={handleViewClick}
                        />
                        <LuxuryImageCard
                            card={businessHealthCards[2]}
                            delay={0.3}
                            onViewClick={handleViewClick}
                        />
                        <LuxuryImageCard
                            card={businessHealthCards[3]}
                            delay={0.4}
                            onViewClick={handleViewClick}
                        />
                        <LuxuryImageCard
                            card={businessHealthCards[4]}
                            delay={0.5}
                            onViewClick={handleViewClick}
                        />
                        <LuxuryImageCard
                            card={businessHealthCards[5]}
                            delay={0.6}
                            onViewClick={handleViewClick}
                        />
                    </div>
                </div>

                {/* Luxury Modal */}
                <BusinessHealthModal card={selectedCard} isOpen={isModalOpen} onClose={handleCloseModal} />
            </section>
        </>
    );
}

// Subtext mapping for each card
const cardSubtexts: Record<string, string> = {
    "Legal": "Corporate structure and governance documents",
    "Insurances": "Coverage policies protecting your business",
    "Financial": "Tax compliance and financial health records",
    "Intellectual Property": "Trademarks, patents, and trade secrets",
    "Systems and Processes": "SOPs and workflow documentation",
    "Business Preparedness": "Contingency and continuity planning"
};

function LuxuryImageCard({ card, delay, onViewClick }: { card: typeof businessHealthCards[0]; delay: number; onViewClick: (card: typeof businessHealthCards[0]) => void }) {
    const statusColors: Record<string, string> = {
        emerald: "text-emerald-700 dark:text-emerald-400",
        amber: "text-amber-700 dark:text-amber-400",
        red: "text-red-700 dark:text-red-400"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: delay, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.4 } }}
            className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-none overflow-hidden h-[280px] flex flex-row shadow-sm hover:shadow-md transition-all"
        >
            {/* Left Content */}
            <div className="flex-1 p-8 flex flex-col justify-between relative z-10 w-3/5">
                <div className="space-y-4">
                    <h4 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 dark:text-white leading-tight">
                        {card.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        {cardSubtexts[card.title]}
                    </p>
                </div>

                <button
                    onClick={() => onViewClick(card)}
                    className="flex items-center gap-2 group/link cursor-pointer"
                >
                    <span className={`font-mono text-[10px] uppercase tracking-wider font-semibold underline underline-offset-4 ${statusColors[card.statusColor]}`}>
                        View
                    </span>
                    <ChevronRight className={`w-3 h-3 ${statusColors[card.statusColor]} group-hover/link:translate-x-1 transition-transform`} />
                </button>
            </div>

            {/* Right Image */}
            <div className="w-2/5 relative h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10 mix-blend-overlay z-10" />
                <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
            </div>
        </motion.div>
    );
}
