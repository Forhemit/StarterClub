import { Variants } from "framer-motion";

export const animations = {
    // Items slide in with heavy inertia
    slideIn: {
        hidden: { x: -20, opacity: 0, scale: 0.95 },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1.2
            }
        },
    } as Variants,

    // Text or elements that jitter and skew on hover/interact
    glitch: {
        initial: { skewX: 0, x: 0 },
        hover: {
            skewX: -10,
            x: 2,
            transition: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 0.2
            }
        },
        tap: { skewX: 10, x: -2 }
    } as Variants,

    // A slow, pulsing fade for holographic elements
    hologramPulse: {
        initial: { opacity: 0.8, filter: "brightness(1)" },
        animate: {
            opacity: [0.8, 1, 0.8],
            filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }
        }
    } as Variants,

    // Stagger children elements (like list items)
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    } as Variants,
};
