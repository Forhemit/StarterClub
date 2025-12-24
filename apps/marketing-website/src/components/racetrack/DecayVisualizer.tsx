"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Clock, ShieldCheck, FileText, Briefcase, ChevronRight } from "lucide-react";

export function DecayVisualizer() {
    return (
        <>
            {/* ========================================== */}
            {/* RACE TRACK MODE (Original Design Restored) */}
            {/* ========================================== */}
            <section className="w-full py-24 bg-muted border-t border-border hidden racetrack:block">
                <div className="container mx-auto px-4">

                    {/* Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                        <h2 className="text-amber-600 dark:text-signal-yellow font-mono text-sm uppercase tracking-widest">Compliance Expires.</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                            Documents don't <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-signal-red dark:to-orange-600">Last Forever.</span>
                        </h3>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
                            A generic checklist is a lie. A document verified six months ago is a liability today.
                            Your business health degrades every 180 days.
                        </p>
                    </div>

                    {/* The Cards (Restored Style + 3 New Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Card 1: Fresh */}
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
                                <h4 className="text-foreground font-bold text-xl">Corporate By-Laws</h4>
                                <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Verified: 2 Days Ago
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2: Aging */}
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
                                <h4 className="text-foreground font-bold text-xl">Insurance Policy</h4>
                                <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Verified: 140 Days Ago
                                </p>
                            </div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-signal-yellow/5 blurred-xl rounded-full translate-y-10 translate-x-10 pointer-events-none" />
                        </motion.div>

                        {/* Card 3: Critical */}
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
                                <h4 className="text-foreground font-bold text-xl">Tax Compliance</h4>
                                <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Verified: 200 Days Ago
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                            <div className="absolute -bottom-4 -right-4 text-9xl font-bold text-signal-red/5 select-none pointer-events-none">ERROR</div>
                        </motion.div>

                        {/* Card 4: Fresh (New) */}
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
                                <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Verified: 5 Days Ago
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 5: Aging (New) */}
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
                                <h4 className="text-foreground font-bold text-xl">Employment Contracts</h4>
                                <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Verified: 165 Days Ago
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 6: Critical (New) */}
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
                                <h4 className="text-foreground font-bold text-xl">Vendor Agreements</h4>
                                <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Verified: 195 Days Ago
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                        </motion.div>

                    </div>
                </div>
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
                            Compliance Expires
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
                            Because winning once isn’t the same as winning for life.
                        </motion.p>
                    </div>

                    {/* The Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <LuxuryImageCard
                            title="Corporate By-Laws"
                            status="VERIFIED"
                            statusColor="emerald"
                            image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60"
                            delay={0.1}
                        />
                        <LuxuryImageCard
                            title="Insurance Policy"
                            status="NEEDS UPDATE"
                            statusColor="amber"
                            image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60"
                            delay={0.2}
                        />
                        <LuxuryImageCard
                            title="Tax Compliance"
                            status="AT RISK"
                            statusColor="red"
                            image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60"
                            delay={0.3}
                        />
                        <LuxuryImageCard
                            title="Intellectual Property"
                            status="VERIFIED"
                            statusColor="emerald"
                            image="/images/intellectual-property-luxury.png"
                            delay={0.4}
                        />
                        <LuxuryImageCard
                            title="Employment Contracts"
                            status="NEEDS UPDATE"
                            statusColor="amber"
                            image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60"
                            delay={0.5}
                        />
                        <LuxuryImageCard
                            title="Vendor Agreements"
                            status="AT RISK"
                            statusColor="red"
                            image="https://images.unsplash.com/photo-1586880244406-5598386c62cc?w=800&auto=format&fit=crop&q=60"
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

function LuxuryImageCard({ title, status, image, delay, statusColor }: any) {
    const statusColors: any = {
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
                        {title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        Access verified legal frameworks and compliance monitors securely.
                    </p>
                </div>

                <div className="flex items-center gap-2 group/link cursor-pointer">
                    <span className={`font-mono text-[10px] uppercase tracking-wider font-semibold underline underline-offset-4 ${statusColors[statusColor]}`}>
                        {status}
                    </span>
                    <ChevronRight className={`w-3 h-3 ${statusColors[statusColor]} group-hover/link:translate-x-1 transition-transform`} />
                </div>
            </div>

            {/* Right Image */}
            <div className="w-2/5 relative h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10 mix-blend-overlay z-10" />
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
            </div>
        </motion.div>
    );
}
