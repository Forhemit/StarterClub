"use client";

import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SocialProofProps {
    className?: string;
}

export function SocialProof({ className = "" }: SocialProofProps) {
    const testimonials = [
        {
            quote: "The War Room simulation exposed a critical flaw in our shareholder agreement we'd missed. Fixing it before our Series A gave investors immense confidence. This isn't admin—it's armor.",
            author: "Alex Chen",
            title: "CEO, TechBio Startup",
            // avatar: "/testimonials/alex-chen.jpg" // Placeholder for now
        },
        {
            quote: "As a solo founder, the Health Monitor is my co-pilot. It flagged an expiring business license I'd forgotten about. That alone saved me thousands in fines.",
            author: "Jamila Rodriguez",
            title: "Founder, Sustainable Packaging Co",
            // avatar: "/testimonials/jamila-rodriguez.jpg"
        }
    ];

    return (
        <section id="social_proof" className={`w-full py-24 bg-background border-b border-border px-6 md:px-12 ${className}`}>
            <div className="max-w-7xl mx-auto space-y-16">

                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                        Trusted by Founders Who Value Resilience.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, i) => (
                        <Card key={i} className="bg-muted/30 border-none shadow-none hover:bg-muted/50 transition-colors">
                            <CardContent className="p-8 md:p-12 space-y-8">
                                <Quote className="w-10 h-10 text-primary/20" />
                                <p className="text-xl md:text-2xl font-medium leading-relaxed font-display text-foreground">
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-400" />
                                    <div>
                                        <div className="font-bold text-foreground">{t.author}</div>
                                        <div className="text-sm text-muted-foreground">{t.title}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Logo Grid Placeholder */}
                <div className="border-t border-border pt-12">
                    <p className="text-center text-sm font-mono text-muted-foreground uppercase tracking-widest mb-8">
                        Supporting companies from
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logic for logos */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-8 w-32 bg-foreground/20 rounded animate-pulse" />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
