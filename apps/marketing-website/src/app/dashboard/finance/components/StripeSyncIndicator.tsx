"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { RefreshCw, CheckCircle2, AlertCircle, Clock, Webhook } from "lucide-react";

type SyncStatus = "synced" | "syncing" | "error" | "pending";

interface StripeSyncIndicatorProps {
    status: SyncStatus;
    lastSync?: Date | null;
    pendingCount?: number;
    onSync?: () => void;
}

/**
 * StripeSyncIndicator - Stripe webhook sync status badge
 * Shows real-time sync status with the ability to trigger manual sync
 */
export function StripeSyncIndicator({
    status,
    lastSync,
    pendingCount = 0,
    onSync,
}: StripeSyncIndicatorProps) {
    const { theme } = useTheme();
    const isRacetrack = theme === "racetrack";

    const statusConfig = {
        synced: {
            icon: CheckCircle2,
            label: "Synced",
            color: isRacetrack
                ? "text-[#00ff9d] bg-[#00ff9d]/10 border-[#00ff9d]/30"
                : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800",
            pulse: false,
        },
        syncing: {
            icon: RefreshCw,
            label: "Syncing",
            color: isRacetrack
                ? "text-[#00f0ff] bg-[#00f0ff]/10 border-[#00f0ff]/30"
                : "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/30 dark:border-blue-800",
            pulse: true,
        },
        error: {
            icon: AlertCircle,
            label: "Sync Error",
            color: isRacetrack
                ? "text-[#ff003c] bg-[#ff003c]/10 border-[#ff003c]/30"
                : "text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-800",
            pulse: false,
        },
        pending: {
            icon: Clock,
            label: `${pendingCount} Pending`,
            color: isRacetrack
                ? "text-[#ff4d00] bg-[#ff4d00]/10 border-[#ff4d00]/30"
                : "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800",
            pulse: pendingCount > 0,
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    const formatLastSync = (date: Date | null | undefined) => {
        if (!date) return "Never";
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
            config.color
        )}>
            {/* Stripe Logo */}
            <Webhook className="h-3.5 w-3.5 opacity-60" />

            {/* Status Icon */}
            <Icon className={cn(
                "h-4 w-4",
                config.pulse && status === "syncing" && "animate-spin"
            )} />

            {/* Status Text */}
            <span className="text-xs font-medium">{config.label}</span>

            {/* Last Sync Time */}
            {lastSync && status !== "syncing" && (
                <span className={cn(
                    "text-[10px] opacity-60 border-l pl-2 ml-1",
                    isRacetrack ? "border-zinc-600" : "border-current/20"
                )}>
                    {formatLastSync(lastSync)}
                </span>
            )}

            {/* Manual Sync Button */}
            {onSync && status !== "syncing" && (
                <button
                    onClick={onSync}
                    className={cn(
                        "ml-1 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                        "opacity-60 hover:opacity-100"
                    )}
                    title="Sync now"
                >
                    <RefreshCw className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}

export default StripeSyncIndicator;
