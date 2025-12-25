"use client";

import React from "react";
import { motion } from "framer-motion";

export type BadgeVariant = "popular" | "required" | "flagship";

interface NavigationBadgeProps {
    variant: BadgeVariant;
}

const badgeConfig: Record<BadgeVariant, { label: string; className: string }> = {
    popular: {
        label: "Most Popular",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    required: {
        label: "Application Required",
        className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    flagship: {
        label: "Flagship Event",
        className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
};

/**
 * NavigationBadge - Small, subtle, color-coded indicator badges
 * for navigation items that need special attention.
 */
export function NavigationBadge({ variant }: NavigationBadgeProps) {
    const config = badgeConfig[variant];

    return (
        <motion.span
            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider
                  border rounded-sm ${config.className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {config.label}
        </motion.span>
    );
}
