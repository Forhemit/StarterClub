"use client";

import React, { useEffect, useState } from "react";

export function EnvironmentBanner() {
    // Only show in development
    const [envName, setEnvName] = useState<string | null>(null);

    useEffect(() => {
        // Check for development environment
        if (process.env.NODE_ENV === "development") {
            setEnvName("Development");
        } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
            setEnvName("Preview / Staging");
        }
    }, []);

    if (!envName) return null;

    return (
        <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-950 px-4 py-1 text-xs font-bold text-center tracking-wider uppercase border-b border-yellow-500 z-[9999] shadow-md">
            🚧 {envName} Mode 🚧
        </div>
    );
}
