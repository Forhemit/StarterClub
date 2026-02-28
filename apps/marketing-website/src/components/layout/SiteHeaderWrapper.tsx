"use client";

import dynamic from "next/dynamic";

// Dynamically import SiteHeader with SSR disabled to prevent hydration issues
const SiteHeader = dynamic(
    () => import("./SiteHeader").then((mod) => mod.SiteHeader),
    { ssr: false }
);

export function SiteHeaderWrapper() {
    return <SiteHeader />;
}
