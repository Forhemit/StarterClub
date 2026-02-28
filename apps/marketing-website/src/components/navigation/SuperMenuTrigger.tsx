"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent SSR issues by rendering a simple button initially
    if (!mounted) {
        return (
            <button
                className="relative w-11 h-11 flex items-center justify-center
                     rounded-md bg-muted hover:bg-accent transition-colors
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                     border border-border shadow-sm"
                aria-label="Open navigation menu"
                aria-expanded={false}
                aria-controls="super-menu-panel"
            >
                <Menu className="w-6 h-6 text-foreground" strokeWidth={2.5} />
            </button>
        );
    }

    return (
        <motion.button
            onClick={onClick}
            className="relative w-11 h-11 flex items-center justify-center
                 rounded-md bg-muted hover:bg-accent transition-colors
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                 border border-border shadow-sm"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="super-menu-panel"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-foreground" strokeWidth={2.5} />
                ) : (
                    <Menu className="w-6 h-6 text-foreground" strokeWidth={2.5} />
                )}
            </motion.div>

            {/* Subtle glow effect when open */}
            {isOpen && (
                <motion.div
                    className="absolute inset-0 rounded-md bg-primary/10 border border-primary/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </motion.button>
    );
}
