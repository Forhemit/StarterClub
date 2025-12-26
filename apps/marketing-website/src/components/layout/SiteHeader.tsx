"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@starter-club/ui";
import { SuperMenu, SuperMenuTrigger, JourneyLauncher } from "@/components/navigation";

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
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
                        <span className="font-sans font-bold text-foreground uppercase tracking-tight text-lg">
                            Starter Club
                        </span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/sign-in"
                            className="hidden md:inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Log in
                        </Link>

                        <Link
                            href="/grid-access"
                            className="hidden sm:inline-block bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Get Started
                        </Link>

                        <div className="h-6 w-px bg-border hidden sm:block" />

                        <ModeToggle />

                        <JourneyLauncher />

                        <SuperMenuTrigger isOpen={isMenuOpen} onClick={toggleMenu} />
                    </div>

                </div>
            </header>

            <SuperMenu isOpen={isMenuOpen} onClose={closeMenu} />
        </>
    );
}
