"use client";

import dynamic from "next/dynamic";

export const PlaceholderPage = dynamic(
    () => import("./PlaceholderPage").then((mod) => mod.PlaceholderPage),
    { ssr: false }
);
