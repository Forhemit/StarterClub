"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Clock, AlertTriangle } from "lucide-react";
import type { FinancialKPI } from "../types/accounting.types";
import { formatCurrencyCompact } from "../utils/formatting";

interface AccountingKPIProps {
    kpis: FinancialKPI[];
    loading?: boolean;
}

/**
 * AccountingKPI - Financial health metrics panel
 * Displays key financial indicators with theme-aware styling
 */
export function AccountingKPI({ kpis, loading = false }: AccountingKPIProps) {
    const { theme } = useTheme();
    const isRacetrack = theme === "racetrack";

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-32 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
                <KPICard
                    key={index}
                    kpi={kpi}
                    isRacetrack={isRacetrack}
                    animationDelay={index * 100}
                />
            ))}
        </div>
    );
}

interface KPICardProps {
    kpi: FinancialKPI;
    isRacetrack: boolean;
    animationDelay: number;
}

function KPICard({ kpi, isRacetrack, animationDelay }: KPICardProps) {
    const isPositive = kpi.trend?.startsWith("+");
    const isNegative = kpi.trend?.startsWith("-");

    // Theme-aware color mapping
    const colorStyles = {
        green: isRacetrack
            ? "text-[#22c55e] bg-[#22c55e]/10 ring-[#22c55e]/20"
            : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-600/20",
        red: isRacetrack
            ? "text-[#ff003c] bg-[#ff003c]/10 ring-[#ff003c]/20"
            : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 ring-rose-600/20",
        blue: isRacetrack
            ? "text-[#00f0ff] bg-[#00f0ff]/10 ring-[#00f0ff]/20"
            : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 ring-blue-600/20",
        yellow: isRacetrack
            ? "text-[#ff4d00] bg-[#ff4d00]/10 ring-[#ff4d00]/20"
            : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 ring-amber-600/20",
    };

    const cardBg = isRacetrack
        ? "bg-zinc-900/80 border-zinc-700/50 hover:border-[#00ff9d]/50"
        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-500";

    const IconComponent = getKPIIcon(kpi.icon);

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col justify-between",
                cardBg
            )}
            style={{
                animationDelay: `${animationDelay}ms`,
            }}
        >
            {/* Gradient Accent (Racetrack theme) */}
            {isRacetrack && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ff9d] via-[#00f0ff] to-[#8b5cf6]" />
            )}

            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-xs font-medium truncate uppercase tracking-wider",
                        isRacetrack ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                    )}>
                        {kpi.label}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                        <span className={cn(
                            "text-2xl font-bold",
                            isRacetrack ? "text-white font-mono" : "text-zinc-900 dark:text-white"
                        )}>
                            {kpi.value}
                        </span>
                        {kpi.trend && (
                            <span
                                className={cn(
                                    "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                                    isPositive
                                        ? isRacetrack
                                            ? "bg-[#22c55e]/20 text-[#22c55e]"
                                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                                        : isNegative
                                            ? isRacetrack
                                                ? "bg-[#ff003c]/20 text-[#ff003c]"
                                                : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400"
                                            : isRacetrack
                                                ? "bg-zinc-700 text-zinc-300"
                                                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                                )}
                            >
                                {isPositive && <ArrowUp className="mr-0.5 h-2.5 w-2.5" />}
                                {isNegative && <ArrowDown className="mr-0.5 h-2.5 w-2.5" />}
                                {kpi.trend}
                            </span>
                        )}
                    </div>
                </div>
                <div className={cn("rounded-lg p-2 ring-1 ring-inset shrink-0", colorStyles[kpi.color])}>
                    <IconComponent className="h-5 w-5" />
                </div>
            </div>

            {kpi.detail && (
                <p className={cn(
                    "mt-3 text-[10px] truncate",
                    isRacetrack ? "text-zinc-500" : "text-zinc-500 dark:text-zinc-400"
                )}>
                    {kpi.detail}
                </p>
            )}
        </div>
    );
}

function getKPIIcon(iconName: string) {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
        "💰": DollarSign,
        "📈": TrendingUp,
        "⏳": Clock,
        "⚠️": AlertTriangle,
    };
    return icons[iconName] || TrendingUp;
}

export default AccountingKPI;
