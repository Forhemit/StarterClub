"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ModeToggle } from "@starter-club/ui";
import { SuperMenu, SuperMenuTrigger, JourneyLauncher } from "@/components/navigation";

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isRacetrack = mounted && theme === 'racetrack';

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 bg-background border-b border-border transition-all duration-300 ${
                isRacetrack ? 'racetrack-header' : ''
            }`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Left Side - Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="relative w-8 h-10">
                            <Image
                                src="/starter-club-logo.png"
                                alt="Starter Club Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className={`font-bold uppercase tracking-tight text-lg transition-all ${
                            isRacetrack 
                                ? 'font-mono tracking-tighter' 
                                : 'font-sans tracking-tight'
                        }`}>
                            Starter Club
                        </span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Partners Link - Racetrack only, hidden on smaller screens */}
                        {isRacetrack && (
                            <Link 
                                href="/scouts" 
                                className="hidden xl:flex flex-col text-right group"
                            >
                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest group-hover:text-foreground">
                                    Partners
                                </span>
                                <span className="text-muted-foreground/60 text-[10px] font-mono group-hover:text-amber-500 dark:group-hover:text-signal-yellow transition-colors">
                                    Broker / VC Login
                                </span>
                            </Link>
                        )}
                        
                        {isRacetrack && <div className="h-8 w-px bg-border hidden xl:block" />}

                        <Link
                            href="/sign-in"
                            className={`hidden md:inline-block transition-colors ${
                                isRacetrack 
                                    ? 'text-muted-foreground text-sm font-mono uppercase tracking-wider hover:text-foreground' 
                                    : 'text-sm font-medium text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {isRacetrack ? 'Login' : 'Log in'}
                        </Link>

                        <Link
                            href="/grid-access"
                            className={`hidden sm:inline-block bg-primary text-primary-foreground px-4 py-2 transition-all ${
                                isRacetrack 
                                    ? 'text-xs font-bold uppercase tracking-widest hover:bg-primary/90' 
                                    : 'text-sm font-semibold rounded-md hover:bg-primary/90'
                            }`}
                        >
                            Get Started
                        </Link>

                        <div className="h-6 w-px bg-border hidden sm:block" />

                        <ModeToggle />

                        {!isRacetrack && <JourneyLauncher />}

                        <SuperMenuTrigger isOpen={isMenuOpen} onClick={toggleMenu} />
                    </div>

                </div>
            </header>

            <SuperMenu isOpen={isMenuOpen} onClose={closeMenu} />
        </>
    );
}
