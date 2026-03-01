"use client";

import { motion } from "framer-motion";

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1747409020043-41d140928662?w=1920&q=85";

export function OperationalFragility() {
    return (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
            {/* Background Image with Theme-Aware Filter */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
                style={{
                    backgroundImage: `url('${BACKGROUND_IMAGE}')`,
                }}
            />
            
            {/* Light Mode Overlay - Bright image needs darkening for readability */}
            <div className="absolute inset-0 bg-white/75 dark:bg-black/80 transition-colors duration-500" />
            
            {/* Additional filter for better text contrast */}
            <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-br from-background/60 via-background/40 to-background/60" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Stat Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--highlight)]/10 border border-[var(--highlight)]/20 text-[var(--highlight)] text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-[var(--highlight)] animate-pulse" />
                            83% of startups face a major operational shock within 3 years
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground uppercase tracking-tight mb-6"
                    >
                        San Francisco&apos;s Hidden Tax:
                        <br />
                        <span className="text-[var(--highlight)]">Operational Fragility.</span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Founders here are masters of innovation but often lack the &apos;boring&apos; 
                        systems that prevent disaster. This fragility tax costs time, equity, 
                        and entire companies. From cap table disputes to compliance fines, 
                        the difference between those that recover and those that fail isn&apos;t luck. 
                        It&apos;s <span className="text-foreground font-semibold">preparedness.</span>
                    </motion.p>

                    {/* Highlight Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative inline-block"
                    >
                        <div className="absolute inset-0 bg-[var(--highlight)]/20 blur-2xl rounded-full" />
                        <div className="relative px-8 py-6 rounded-2xl bg-[var(--card)]/80 backdrop-blur-sm border border-[var(--border)] shadow-2xl">
                            <p className="text-foreground text-lg">
                                Starter Club members identify and resolve critical risks
                            </p>
                            <p className="text-3xl md:text-4xl font-bold text-[var(--highlight)] mt-2">
                                5x faster
                            </p>
                            <p className="text-muted-foreground text-sm mt-1">
                                than average
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
