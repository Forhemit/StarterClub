"use client";

import React from "react";
import { motion } from "framer-motion";

interface SuperMenuTriggerProps {
    isOpen: boolean;
    onClick: () => void;
}

/**
 * Animated hamburger menu trigger that transforms to X when open.
 * Enhanced with more interactivity and smooth animations.
 * WCAG 2.1 AA compliant with proper ARIA labels.
 */
export function SuperMenuTrigger({ isOpen, onClick }: SuperMenuTriggerProps) {
    return (
        <motion.button
            onClick={onClick}
            className="relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 
                 rounded-md bg-transparent hover:bg-muted/50 transition-colors
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                 border border-transparent hover:border-border/50"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="super-menu-panel"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
        >
            {/* Animated hamburger lines */}
            <motion.span
                className="block w-5 h-0.5 bg-foreground origin-center rounded-full"
                animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 8 : 0,
                    width: isOpen ? 20 : 20,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    duration: 0.2
                }}
            />

            <motion.span
                className="block w-5 h-0.5 bg-foreground origin-center rounded-full"
                animate={{
                    opacity: isOpen ? 0 : 1,
                    scaleX: isOpen ? 0 : 1,
                    x: isOpen ? 10 : 0,
                }}
                transition={{
                    duration: 0.15,
                    ease: "easeInOut"
                }}
            />

            <motion.span
                className="block w-5 h-0.5 bg-foreground origin-center rounded-full"
                animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -8 : 0,
                    width: isOpen ? 20 : 20,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    duration: 0.2
                }}
            />

            {/* Subtle glow effect when open */}
            {isOpen && (
                <motion.div
                    className="absolute inset-0 rounded-md bg-primary/5 border border-primary/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </motion.button>
    );
}
