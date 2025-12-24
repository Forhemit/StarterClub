"use client";

import React from "react";
import { Search } from "lucide-react";

import Link from "next/link";

export function RaceTrackFooter() {
    return (
        <footer className="w-full bg-background border-t border-border py-12">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Col 1: Identity */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h4 className="font-sans font-bold text-foreground uppercase tracking-tighter text-lg">Starter Club</h4>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            San Francisco Public Benefit Corporation (PBC). <br />
                            Building the economic immune system for the city's next generation of businesses.
                        </p>
                    </div>

                    {/* Col 2: Verification Search */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">Public Registry Verification</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ENTER COMPANY NAME OR EIN..."
                                className="w-full bg-carbon-light border border-white/10 rounded px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-signal-green focus:ring-1 focus:ring-signal-green placeholder:text-white/20"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded">
                                <Search className="w-4 h-4 text-white/40" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Legal Block */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-muted-foreground text-[10px] font-mono space-y-1">
                        <p>© 2025 Starter Club PBC. Status: Operational.</p>
                        <p className="max-w-xl">
                            DISCLAIMER: STARTER CLUB PROVIDES OPERATIONAL AUDITS AND RESILIENCE TOOLS ONLY.
                            WE ARE NOT A LAW FIRM OR CPA FIRM. USE OF THE PLATFORM OR CHECKUP TOOLS
                            DOES NOT CONSTITUTE LEGAL OR TAX ADVICE.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/member-login" className="text-muted-foreground text-[10px] font-mono uppercase hover:text-foreground">Member Login</Link>
                        <Link href="/partner-login" className="text-muted-foreground text-[10px] font-mono uppercase hover:text-foreground">Partner Login</Link>
                        <Link href="/employee-login" className="text-muted-foreground text-[10px] font-mono uppercase hover:text-foreground">Employee Login</Link>
                        <Link href="/test-users" className="text-amber-500 text-[10px] font-mono uppercase hover:text-amber-400">Test Users</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
