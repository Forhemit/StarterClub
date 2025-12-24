"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@starter-club/ui";

export function RaceTrackNav() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-12">
                        <Image
                            src="/starter-club-logo.png"
                            alt="Starter Club Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-sans font-bold text-foreground uppercase tracking-tighter text-lg">Starter Club</span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">

                    {/* The Scout Link (Business Constraint Fix) */}
                    <Link href="/scouts" className="hidden md:flex flex-col text-right group">
                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest group-hover:text-foreground">Partners</span>
                        <span className="text-muted-foreground/60 text-[10px] font-mono group-hover:text-amber-500 dark:group-hover:text-signal-yellow transition-colors">Broker / VC Login</span>
                    </Link>

                    <div className="h-8 w-px bg-border hidden md:block" />

                    <ModeToggle />

                    <Link href="/auth/login" className="text-muted-foreground text-sm font-mono uppercase tracking-wider hover:text-foreground transition-colors">
                        Login
                    </Link>

                    <Link href="/grid-access" className="bg-primary/10 text-primary-foreground dark:text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all border border-border">
                        Get Started
                    </Link>
                </div>

            </div>
        </nav>
    );
}
