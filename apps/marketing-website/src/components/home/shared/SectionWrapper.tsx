import React, { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Assuming cn exists, if not I'll just use template literals

export interface SectionWrapperProps {
    children: ReactNode;
    containerType?: "contained" | "none";
    className?: string; // Additional classes for the wrapper
}

export function SectionWrapper({
    children,
    containerType = "contained",
    className,
}: SectionWrapperProps) {
    if (containerType === "none") {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            className={cn(
                "w-full max-w-7xl mx-auto px-6",
                className
            )}
        >
            {children}
        </div>
    );
}
