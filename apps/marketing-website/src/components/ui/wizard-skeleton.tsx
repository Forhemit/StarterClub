"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function WizardSkeleton() {
    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-12 w-full px-6 sm:px-8 relative z-0">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-9 w-40" />
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Step Indicator Skeleton */}
                <div className="flex gap-2 items-center overflow-x-auto pb-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-full flex-shrink-0" />
                    ))}
                    <div className="flex-1 ml-2">
                        <Skeleton className="h-px w-full" />
                    </div>
                </div>

                {/* Main Card Skeleton */}
                <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-muted/20">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                    <div className="p-6 space-y-8">
                        {/* Form Field Skeletons */}
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-10 w-full max-w-md" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-48" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-dashed">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Navigation Skeleton */}
                <div className="flex justify-between items-center mt-4 p-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}
