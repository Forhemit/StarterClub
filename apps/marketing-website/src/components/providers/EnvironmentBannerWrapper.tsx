"use client";

import dynamic from "next/dynamic";

const EnvironmentBanner = dynamic(
    () => import("@starter-club/ui").then((mod) => mod.EnvironmentBanner),
    { ssr: false }
);

export function EnvironmentBannerWrapper() {
    return <EnvironmentBanner />;
}
