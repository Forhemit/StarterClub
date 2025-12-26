"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Lock, ArrowRight, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useUserRoles } from "@/hooks/useUserRoles";
import { appsData, AppSection, AppDefinition } from "./apps-data";
import { Button } from "@starter-club/ui"; // Assuming generic UI component exists, or use HTML button

export function JourneyLauncher() {
    const [isOpen, setIsOpen] = useState(false);
    const { hasRole, isLoading } = useUserRoles();
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading) return null; // Or a skeleton

    // Filter logic:
    // Sections are shown if user has the role OR "Peek Mode" is active?
    // Request says "Inside, users will see grayed or discoverable journeys they don't yet have access to."
    // So we show ALL sections, but lock items the user doesn't have access to.

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleOpen}
                className="p-2 rounded-md hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Journey Launcher"
            >
                <Grid className="w-5 h-5 text-foreground" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-[380px] sm:w-[500px] md:w-[600px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 p-4 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Journey Launcher
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {appsData.map((section) => {
                                const userHasSectionRole = section.role ? hasRole(section.role) : true;

                                // Specific logic for Internal: Hide completely if not employee?
                                // Request says "Member sees Brand Experiences -> Explore sponsoring".
                                // But regular members probably shouldn't see "Internal Ops".
                                if (section.id === 'internal' && !hasRole('employee') && !hasRole('admin')) {
                                    return null;
                                }

                                return (
                                    <div key={section.id} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`text-sm font-bold ${userHasSectionRole ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {section.label}
                                            </h4>
                                            {!userHasSectionRole && (
                                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-muted-foreground/30 text-muted-foreground">
                                                    Discover
                                                </span>
                                            )}
                                        </div>

                                        <ul className="space-y-2">
                                            {section.apps.map((app) => {
                                                const isLocked = app.requiredRole ? !hasRole(app.requiredRole) : false; // Naive check, assumes role matches section role usually
                                                // Actually, use app.requiredRole if defined
                                                const appLocked = app.requiredRole ? !hasRole(app.requiredRole) : false;

                                                if (appLocked) {
                                                    return (
                                                        <li key={app.id} className="group relative">
                                                            <div className="flex items-start gap-3 p-2 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all cursor-pointer opacity-70 hover:opacity-100">
                                                                <div className="mt-1 text-muted-foreground group-hover:text-primary transition-colors">
                                                                    <app.icon className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                                                                            {app.label}
                                                                        </span>
                                                                        <Lock className="w-3 h-3 text-muted-foreground/50" />
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground/80 line-clamp-1">
                                                                        {app.description}
                                                                    </p>
                                                                </div>

                                                                {/* Hover Peek CTA */}
                                                                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                                                                        Request Access <ArrowRight className="w-3 h-3" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                }

                                                return (
                                                    <li key={app.id}>
                                                        <Link
                                                            href={app.href}
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors group"
                                                        >
                                                            <div className="mt-1 text-primary">
                                                                <app.icon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                                                    {app.label}
                                                                </span>
                                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                                    {app.description}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-3 border-t border-border flex justify-end">
                            <span className="text-xs text-muted-foreground italic">
                                "Roles are invitations, not walls."
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
