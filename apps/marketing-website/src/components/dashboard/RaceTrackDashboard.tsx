"use client";

import React from "react";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Zap, TrendingUp, AlertTriangle, ArrowRight, Flag, Crosshair } from "lucide-react";
import Link from "next/link";

export function RaceTrackDashboard() {
    const { roles } = useUserRoles();

    return (
        <div className="min-h-screen bg-black text-white p-6 font-mono space-y-6">
            {/* Header: Telemetry Bar style */}
            <div className="flex items-center justify-between border-b border-[#333] pb-6">
                <div>
                    <h1 className="text-4xl font-bebas text-[var(--signal-green)] tracking-widest">
                        RACE CONTROL
                    </h1>
                    <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground mt-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--signal-green)] animate-pulse" />
                        System Optimal
                        <span className="mx-2">|</span>
                        Track Condition: Dry
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 border border-[#333] rounded bg-[#111]">
                        <div className="text-[10px] text-muted-foreground uppercase">Session Timer</div>
                        <div className="text-xl font-bold text-[var(--hud-cyan)]">00:42:15.882</div>
                    </div>
                </div>
            </div>

            {/* Main Grid: Modules */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Column: Vital Signs (Health) */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="bg-[#050505] border-[#333] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--signal-green)]/10 blur-[40px]" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Resilience Index</CardTitle>
                            <Activity className="h-4 w-4 text-[var(--signal-green)]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold font-bebas text-[var(--signal-green)]">92<span className="text-lg text-muted-foreground">/100</span></div>
                            <p className="text-xs text-muted-foreground mt-2">
                                +4% since last lap
                            </p>

                            {/* Visual Graph Placeholder */}
                            <div className="h-16 mt-4 flex items-end gap-1">
                                {[30, 45, 60, 50, 70, 85, 92].map((h, i) => (
                                    <div key={i} className="flex-1 bg-[var(--signal-green)] opacity-50 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#050505] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-[var(--signal-yellow)]" />
                                Active Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-[var(--signal-yellow)]/10 border border-[var(--signal-yellow)]/20 rounded">
                                <span className="text-xs text-[var(--signal-yellow)] font-bold">INSURANCE RENEWAL</span>
                                <span className="text-[10px] text-muted-foreground">IN 14 DAYS</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-900/10 border border-red-500/20 rounded opacity-50">
                                <span className="text-xs text-red-500 font-bold">COMPLIANCE</span>
                                <span className="text-[10px] text-muted-foreground">CLEARED</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Center Column: Active Modules (Vault/Sims) */}
                <div className="md:col-span-5 space-y-6">
                    <Card className="bg-[#050505] border-[#333] h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[var(--hud-cyan)]" />
                                Secure Vault Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#111] rounded border border-[#222] hover:border-[var(--hud-cyan)] transition-colors cursor-pointer group">
                                    <div className="text-[10px] text-muted-foreground mb-1">DOCUMENTS</div>
                                    <div className="text-2xl font-bold group-hover:text-[var(--hud-cyan)] transition-colors">12</div>
                                </div>
                                <div className="p-4 bg-[#111] rounded border border-[#222] hover:border-[var(--hud-cyan)] transition-colors cursor-pointer group">
                                    <div className="text-[10px] text-muted-foreground mb-1">REQUESTS</div>
                                    <div className="text-2xl font-bold group-hover:text-[var(--hud-cyan)] transition-colors">0</div>
                                </div>
                                <div className="col-span-2 p-4 bg-[var(--hud-cyan)]/5 rounded border border-[var(--hud-cyan)]/20 flex items-center justify-between group cursor-pointer hover:bg-[var(--hud-cyan)]/10 transition-colors">
                                    <div>
                                        <div className="text-sm font-bold text-[var(--hud-cyan)]">ACCESS DATA ROOM</div>
                                        <div className="text-[10px] text-muted-foreground">LAST SYNC: 2m AGO</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[var(--hud-cyan)] group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Feed / Actions */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="bg-[#050505] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-500" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-between items-center bg-[#111] border-[#333] hover:bg-[#222] hover:text-white h-auto py-3">
                                <span className="text-xs font-bold">RUN SIMULATION</span>
                                <Crosshair className="w-3 h-3 text-muted-foreground" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between items-center bg-[#111] border-[#333] hover:bg-[#222] hover:text-white h-auto py-3">
                                <span className="text-xs font-bold">ADD PARTNER</span>
                                <Flag className="w-3 h-3 text-muted-foreground" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer / Track Map decoration */}
            <div className="pt-12 opacity-30 pointer-events-none">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--signal-green)] to-transparent" />
                <div className="text-center text-[10px] font-mono text-[var(--signal-green)] mt-2">TELEMETRY ONLINE // SYSTEM VERSION 2.0.4</div>
            </div>
        </div>
    );
}
