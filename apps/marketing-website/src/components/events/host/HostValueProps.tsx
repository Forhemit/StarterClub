"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Lightbulb, Users } from "lucide-react";

const valueProps = [
    {
        icon: Trophy,
        title: "Build Trusted Authority",
        description: "Position yourself as a guide, not a vendor. Our collaborative format lets you demonstrate deep expertise and build credibility without the hard sell."
    },
    {
        icon: Target,
        title: "Access a Curated Audience",
        description: "Connect with early-stage founders, operators, and builders who are actively making decisions about tools, platforms, and partnerships."
    },
    {
        icon: Lightbulb,
        title: "Get High-Signal Feedback",
        description: "Receive unfiltered questions, objections, and insights directly from your ideal customers. This is live product and messaging intelligence."
    },
    {
        icon: Users,
        title: "Create Lasting Content",
        description: "With permission, transform your session into clips, case studies, and content that fuels your marketing long after the event."
    }
];

export function HostValueProps() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="max-w-3xl mx-auto mb-16 space-y-6">
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-foreground racetrack:font-mono">
                            Starter Club events are <span className="text-primary font-bold racetrack:text-signal-green">shared wins.</span>
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed racetrack:font-mono">
                            We partner with experts to deliver genuine value to our members, creating a unique space where education leads to action and meaningful connections. This page is for potential partners who believe in building <span className="text-primary/80 racetrack:text-signal-green">long-term relationships</span>, not just capturing short-term leads.
                        </p>
                    </div>

                    <div className="w-full h-px bg-border/50 max-w-sm mx-auto mb-16 racetrack:bg-signal-green/20" />

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading racetrack:font-sans racetrack:uppercase racetrack:tracking-tighter">
                        The Value for You: <span className="text-primary racetrack:text-signal-green">Why Host?</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg racetrack:font-mono">
                        When you host a live workshop or session at Starter Club, you gain more than just an audience. You gain direct access and actionable insight.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {valueProps.map((prop, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            {/* LUXURY CARD */}
                            <div className="block racetrack:hidden h-full p-8 rounded-2xl bg-secondary/5 border border-border/50 hover:bg-secondary/10 transition-colors backdrop-blur-sm">
                                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                                    <prop.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 font-heading">{prop.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
                            </div>

                            {/* RACETRACK CARD */}
                            <div className="hidden racetrack:block h-full p-8 border border-border bg-black/20 relative overflow-hidden group-hover:border-signal-green/50 transition-colors">
                                <div className="absolute top-0 right-0 p-2 opacity-50">
                                    <div className="text-[10px] font-mono text-muted-foreground">MODULE_{index + 1.0}</div>
                                </div>
                                <div className="mb-6 text-signal-green">
                                    <prop.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 font-sans uppercase tracking-wider text-foreground">{prop.title}</h3>
                                <p className="text-muted-foreground font-mono text-sm leading-relaxed border-l-2 border-signal-green/20 pl-4">{prop.description}</p>

                                {/* Corner Decorations */}
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-signal-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-signal-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
