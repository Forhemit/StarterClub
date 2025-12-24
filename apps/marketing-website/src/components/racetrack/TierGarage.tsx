"use client";

import React, { useState } from "react";
import { Check, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function TierGarage() {
    const [showFactory, setShowFactory] = useState(false);

    return (
        <section className="w-full py-24 bg-background relative">
            <div className="container mx-auto px-4">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Membership Plans</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                        Choose Your <span className="text-signal-green">Level.</span>
                    </h3>
                </div>

                {/* The Grid (Standard Tiers) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">

                    {/* Bay 1: The Paddock (Free) */}
                    <div className="border border-border bg-card p-8 rounded-lg relative hover:border-border/80 transition-all group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
                        <h4 className="font-mono text-muted-foreground uppercase tracking-widest mb-2">Starter Access</h4>
                        <div className="text-3xl font-bold text-foreground mb-6">Free</div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3 text-muted-foreground text-sm"><Check className="w-4 h-4 text-muted-foreground" /> Community Access</li>
                            <li className="flex gap-3 text-muted-foreground text-sm"><Check className="w-4 h-4 text-muted-foreground" /> Basic Checklists</li>
                            <li className="flex gap-3 text-muted-foreground text-sm"><Check className="w-4 h-4 text-muted-foreground" /> Initial Business Report</li>
                        </ul>
                        <button className="w-full py-3 border border-border text-foreground font-mono uppercase text-xs tracking-widest hover:bg-secondary">
                            Get Started
                        </button>
                    </div>

                    {/* Bay 2: Grid Access (Member) */}
                    <div className="border border-signal-green bg-card p-8 rounded-lg relative shadow-[0_0_30px_rgba(0,255,157,0.1)]">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal-green text-carbon text-xs font-bold px-3 py-1 uppercase tracking-widest">
                            Recommended
                        </div>
                        <h4 className="font-mono text-signal-green uppercase tracking-widest mb-2">Member Access</h4>
                        <div className="text-3xl font-bold text-foreground mb-1">$129<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                        <p className="text-muted-foreground text-xs mb-6">Billed Monthly. Cancel Anytime.</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3 text-foreground text-sm"><Check className="w-4 h-4 text-signal-green" /> <strong>Cockpit</strong> Dashboard</li>
                            <li className="flex gap-3 text-foreground text-sm"><Check className="w-4 h-4 text-signal-green" /> <strong>Secure Vault</strong> Storage</li>
                            <li className="flex gap-3 text-foreground text-sm"><Check className="w-4 h-4 text-signal-green" /> <strong>War Room</strong> Simulator</li>
                            <li className="flex gap-3 text-foreground text-sm"><Check className="w-4 h-4 text-signal-green" /> <strong>Expert</strong> Verification</li>
                        </ul>
                        <button className="w-full py-3 bg-signal-green text-carbon font-bold uppercase text-xs tracking-widest hover:bg-signal-green/90 clip-corner-button">
                            Join Membership
                        </button>
                    </div>
                </div>

                {/* Factory Team Toggle / Banner */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <motion.div
                        initial={false}
                        animate={{ height: showFactory ? 'auto' : '60px' }}
                        className="bg-white rounded-lg overflow-hidden relative cursor-pointer group shadow-2xl"
                        onClick={() => setShowFactory(!showFactory)}
                    >
                        {/* Closed State Banner */}
                        <div className="h-[60px] flex items-center justify-between px-6 md:px-8 bg-gradient-to-r from-gray-100 to-white hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <Crown className="w-5 h-5 text-carbon" />
                                <span className="font-bold text-carbon uppercase tracking-wide text-sm md:text-base">
                                    Concierge Service
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-carbon/60 text-xs uppercase hidden md:inline-block">Need us to do it all?</span>
                                <span className="text-carbon font-bold text-sm underline decoration-carbon/30 group-hover:decoration-carbon">
                                    {showFactory ? "Close Access" : "View Details"}
                                </span>
                            </div>
                        </div>

                        {/* Open Content */}
                        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-bold text-carbon uppercase leading-none">
                                    We Build Your Business.<br />You Run it.
                                </h3>
                                <p className="text-carbon/70 leading-relaxed">
                                    For funded founders and scaling COOs. Our internal team measures your business health.
                                    We manually build your vault, verify your compliance, and hand you the keys to a Fully Verified entity.
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="text-2xl font-bold text-carbon">$8,000+</div>
                                    <span className="text-carbon/50 text-sm uppercase">One-time Build Fee</span>
                                </div>
                            </div>
                            <div className="space-y-4 border-l border-gray-100 pl-0 md:pl-12">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-carbon/80"><Star className="w-4 h-4 fill-carbon text-carbon" /> Done-For-You Data Room Build</li>
                                    <li className="flex items-center gap-3 text-carbon/80"><Star className="w-4 h-4 fill-carbon text-carbon" /> Priority Legal & Tax Verification</li>
                                    <li className="flex items-center gap-3 text-carbon/80"><Star className="w-4 h-4 fill-carbon text-carbon" /> 4-Month Payment Plan Available</li>
                                </ul>
                                <button className="mt-4 px-8 py-3 bg-carbon text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-carbon/90 w-full md:w-auto">
                                    Request Concierge
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>

            </div>
        </section>
    );
}
