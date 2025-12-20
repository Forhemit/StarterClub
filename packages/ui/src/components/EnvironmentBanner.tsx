"use client";

import React, { useEffect, useState } from "react";

export function EnvironmentBanner() {
    // Only show in development
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        // Check for development environment
        if (process.env.NODE_ENV === "development") {
            setIsDev(true);
        }
    }, []);

    if (!isDev) return null;

    return (
        <div className="bg-yellow-400 text-yellow-950 px-4 py-1 text-xs font-bold text-center tracking-wider uppercase border-b border-yellow-500 z-[100] relative">
            🚧 Development Mode 🚧
        </div>
    );
}
