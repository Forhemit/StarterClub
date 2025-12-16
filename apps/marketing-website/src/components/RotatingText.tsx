"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const items = [
    "Business",
    "Side Hustle",
    "Retail Brand",
    "Tech Startup",
    "Freelance Career",
    "Non-Profit",
    "Consultancy",
    "YouTube Channel",
    "Podcast",
    "Blog",
    "Portfolio",
    "Newsletter",
    "Run Club",
    "Book Club",
    "Networking Group",
    "Mastermind",
    "Community",
    "New Career",
    "Class",
    "Movement",
];

export function RotatingText() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 2000); // Change every 2 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <span className="inline-block relative h-[1.1em] w-full md:w-auto overflow-hidden align-top">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={items[index]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="block text-[var(--accent)] whitespace-nowrap"
                >
                    {items[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
