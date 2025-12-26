"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Radar, Cpu, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SolutionStackProps {
    className?: string;
}

export function SolutionStack({ className = "" }: SolutionStackProps) {
    const modules = [
        {
            id: "module_1",
            icon: ShieldCheck,
            title: "The Foundation: Secure Vault & Legal Hub",
            subtitle: "A Single Source of Truth.",
            description: "Organize your corporate docs, IP, and compliance certificates in an investor-ready data room. Never scramble for a document again.",
            cta: { text: "See Vault Demo", action: "/demo/vault" },
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-200 dark:border-blue-900"
        },
        {
            id: "module_2",
            icon: Radar,
            title: "The Early Warning System: Health Monitor",
            subtitle: "See Risks Before They Breach.",
            description: "Your dashboard gives you a real-time Resilience Score, tracking vital signs from insurance renewals to state filings. Proactive alerts, not panic.",
            cta: { text: "View Sample Dashboard", action: "/demo/dashboard" },
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-200 dark:border-emerald-900"
        },
        {
            id: "module_3",
            icon: Cpu,
            title: "The Simulation Lab: War Room Drills",
            subtitle: "Stress-Test Your Plans.",
            description: "Run tabletop exercises for founder departures, funding audits, or IP challenges. Build muscle memory for real-world crises.",
            cta: { text: "Try a Simulation", action: "/demo/simulation" },
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-200 dark:border-purple-900"
        }
    ];

    return (
        <section id="solution_stack" className={`w-full py-24 bg-background px-6 md:px-12 ${className}`}>
            <div className="max-w-7xl mx-auto space-y-16">

                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground">
                        Your Company's <span className="text-primary">Resilience Stack.</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        A comprehensive operating system designed to protect against entropy and ensure longevity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modules.map((module) => (
                        <Card key={module.id} className={`group hover:shadow-xl transition-all duration-300 border ${module.border} bg-card relative overflow-hidden`}>
                            {/* Top Accent Line */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${module.color.replace('text-', 'bg-')}`} />

                            <CardHeader className="space-y-4">
                                <div className={`w-12 h-12 rounded-lg ${module.bg} flex items-center justify-center ${module.color} mb-2`}>
                                    <module.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-bold font-display leading-tight">{module.title}</CardTitle>
                                    <p className={`font-mono text-xs uppercase tracking-wider ${module.color}`}>{module.subtitle}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                                    {module.description}
                                </CardDescription>

                                <Button variant="ghost" className="p-0 h-auto font-medium hover:bg-transparent hover:underline flex items-center gap-2 group-hover:gap-3 transition-all" asChild>
                                    <Link href={module.cta.action}>
                                        {module.cta.text} <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
}
