"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { NavigationBadge, BadgeVariant } from "./NavigationBadge";
import { ChevronRight } from "lucide-react";
import type { NavigationSectionData, NavigationItem } from "./navigation-data";

interface NavigationSectionProps {
    section: NavigationSectionData;
    index: number;
    onNavigate: () => void;
}

// Visual cue patterns for each section type
const visualCueStyles: Record<string, string> = {
    foundation: "before:absolute before:inset-0 before:opacity-[0.02] before:bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] before:bg-[length:16px_16px]",
    connection: "before:absolute before:inset-0 before:opacity-[0.03] before:bg-gradient-to-br before:from-amber-500/10 before:to-transparent",
    structure: "",
    discovery: "before:absolute before:inset-0 before:opacity-[0.02] before:bg-[radial-gradient(circle_at_2px_2px,currentColor_0.5px,transparent_0)] before:bg-[length:8px_8px]",
    elevated: "border-l-2 border-primary/30 pl-4",
};

const sectionDescriptions: Record<string, string> = {
    "about-us": "Trust & Legitimacy — The story behind Starter Club",
    "join-community": "Action Hub — Connect, grow, and build together",
    "programs": "Solutions — Tailored pathways for every stage",
    "resources": "Discovery & Learning — Explore our ecosystem",
    "partners": "High-Intent Path — Strategic collaboration opportunities",
};

/**
 * NavigationSection - Renders a single section of the super menu
 * with proper visual hierarchy and interaction states.
 */
export function NavigationSection({ section, index, onNavigate }: NavigationSectionProps) {
    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 25,
            },
        },
    };

    return (
        <motion.div
            className={`relative grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-6 md:gap-8 py-6 
                  ${index > 0 ? "border-t border-border/50" : ""}
                  ${visualCueStyles[section.visualCue] || ""}`}
            variants={itemVariants}
        >
            {/* Left Column - Navigation Items */}
            <div className="space-y-1">
                {/* Section Header */}
                <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/50" />
                    {section.label}
                </h3>

                {/* Navigation Items */}
                <ul className="space-y-0.5" role="menu">
                    {section.items.map((item: NavigationItem) => (
                        <li key={item.href} role="none">
                            {/* Main Item */}
                            <Link
                                href={item.href}
                                onClick={onNavigate}
                                role="menuitem"
                                className="group flex items-center justify-between py-2.5 px-3 -mx-3 rounded-sm
                           text-foreground hover:bg-muted/50 hover:text-foreground
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset
                           transition-all duration-150"
                            >
                                <motion.span
                                    className="flex items-center gap-3"
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <span className="font-sans text-[15px] font-medium">
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <NavigationBadge variant={item.badge} />
                                    )}
                                </motion.span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            {/* Sub Items */}
                            {item.subItems && item.subItems.length > 0 && (
                                <ul className="ml-6 mt-1 space-y-0.5 border-l border-border/30 pl-3" role="menu">
                                    {item.subItems.map((subItem: { label: string; href: string }) => (
                                        <li key={subItem.href} role="none">
                                            <Link
                                                href={subItem.href}
                                                onClick={onNavigate}
                                                role="menuitem"
                                                className="group flex items-center py-1.5 px-2 -mx-2 rounded-sm
                                   text-muted-foreground hover:text-foreground hover:bg-muted/30
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset
                                   transition-all duration-150 text-sm font-mono"
                                            >
                                                <motion.span
                                                    whileHover={{ x: 2 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                >
                                                    {subItem.label}
                                                </motion.span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Column - Description & Visual Cue */}
            <div className="hidden md:flex flex-col justify-start pt-8">
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                    {sectionDescriptions[section.id] || section.description}
                </p>

                {/* Section-specific visual element */}
                {section.visualCue === "elevated" && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-sm">
                        <p className="text-xs font-mono text-primary/80">
                            Strategic partnerships welcome
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
