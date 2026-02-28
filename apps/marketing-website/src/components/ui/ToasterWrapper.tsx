"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(
    () => import("./Toaster").then((mod) => mod.Toaster),
    { ssr: false }
);

export function ToasterWrapper() {
    return <Toaster />;
}
