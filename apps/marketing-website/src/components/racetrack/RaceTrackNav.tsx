"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@starter-club/ui";
import { SuperMenu, SuperMenuTrigger } from "@/components/navigation";

export function RaceTrackNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle menu - now properly opens AND closes
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Left Side - Logo Only */}
                    <div className="flex items-center gap-2">
                        {/* Logo Area */}
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="relative w-10 h-12">
                                <Image
                                    src="/starter-club-logo.png"
                                    alt="Starter Club Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-sans font-bold text-foreground uppercase tracking-tighter text-lg hidden sm:inline">
                                Starter Club
                            </span>
                        </Link>
                    </div>

                    {/* Right Actions - Utility Strip + Menu Trigger */}
                    <div className="flex items-center gap-3 md:gap-4">

                        {/* The Scout Link (Business Constraint Fix) - Hidden on smaller screens */}
                        <Link href="/scouts" className="hidden xl:flex flex-col text-right group">
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest group-hover:text-foreground">
                                Partners
                            </span>
                            <span className="text-muted-foreground/60 text-[10px] font-mono group-hover:text-amber-500 dark:group-hover:text-signal-yellow transition-colors">
                                Broker / VC Login
                            </span>
                        </Link>

                        <div className="h-8 w-px bg-border hidden xl:block" />

                        {/* Login - Hidden on mobile */}
                        <Link
                            href="/sign-in"
                            className="hidden lg:inline text-muted-foreground text-sm font-mono uppercase tracking-wider hover:text-foreground transition-colors"
                        >
                            Login
                        </Link>

                        {/* Get Started CTA - Always visible */}
                        <Link
                            href="/grid-access"
                            className="hidden sm:inline-block bg-primary text-primary-foreground px-3 md:px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                        >
                            Get Started
                        </Link>

                        <div className="h-8 w-px bg-border hidden sm:block" />

                        {/* Mode Toggle */}
                        <ModeToggle />

                        {/* Super Menu Trigger - Right Side */}
                        <SuperMenuTrigger isOpen={isMenuOpen} onClick={toggleMenu} />
                    </div>

                </div>
            </nav>

            {/* Super Menu Panel */}
            <SuperMenu isOpen={isMenuOpen} onClose={closeMenu} />
        </>
    );
}
