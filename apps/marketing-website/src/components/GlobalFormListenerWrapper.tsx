"use client";

import dynamic from "next/dynamic";

const GlobalFormListener = dynamic(
    () => import("./GlobalFormListener").then((mod) => mod.GlobalFormListener),
    { ssr: false }
);

export function GlobalFormListenerWrapper() {
    return <GlobalFormListener />;
}
