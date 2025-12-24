"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { colors, typography, physics } from "../tokens";
import { animations } from "../animations";
import { cn } from "../../lib/utils";

interface CyberButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
    style?: React.CSSProperties;
}

export const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
    ({ children, className, variant = "primary", size = "md", style, ...props }, ref) => {

        const variants = {
            primary: {
                background: colors.signal.green,
                color: colors.void.deep,
                border: `1px solid ${colors.signal.green}`,
            },
            secondary: {
                background: "transparent",
                color: colors.signal.green,
                border: `1px solid ${colors.signal.green}`,
            },
            danger: {
                background: colors.signal.red,
                color: "#fff",
                border: `1px solid ${colors.signal.red}`,
            },
            ghost: {
                background: "transparent",
                color: colors.carbon.light,
                border: "1px solid transparent",
            }
        };

        const sizes = {
            sm: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
            md: { padding: "0.75rem 2rem", fontSize: "1rem" },
            lg: { padding: "1rem 3rem", fontSize: "1.25rem" },
        };

        return (
            <motion.button
                ref={ref}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={animations.glitch}
                style={{
                    ...style,
                    fontFamily: typography.display,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)",
                    ...sizes[size],
                    ...variants[variant],
                }}
                className={cn(
                    "relative cursor-pointer overflow-hidden font-bold transition-colors focus:outline-none",
                    className
                )}
                {...props}
            >
                <span className="relative z-10">{children}</span>
                {/* Hover glitch overlay effect could go here */}
            </motion.button>
        );
    }
);

CyberButton.displayName = "CyberButton";
