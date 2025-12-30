"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CelebrationEffectsProps {
    type?: 'badge' | 'confetti';
}

export function CelebrationEffects({ type = 'confetti' }: CelebrationEffectsProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-6xl"
            >
                {type === 'badge' ? '🏅' : '🎉'}
            </motion.div>
        </div>
    );
}
