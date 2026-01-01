"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

interface MobileStepLayoutProps {
    title: string;
    description?: string;
    currentStep: number;
    totalSteps: number;
    onBack?: () => void;
    onNext: () => void;
    nextLabel?: string;
    isNextDisabled?: boolean;
    children: ReactNode;
}

export function MobileStepLayout({
    title,
    description,
    currentStep,
    totalSteps,
    onBack,
    onNext,
    nextLabel = "Continue",
    isNextDisabled = false,
    children
}: MobileStepLayoutProps) {
    const progress = ((currentStep) / totalSteps) * 100;

    return (
        <div className="flex flex-col h-[600px] md:h-auto md:min-h-[600px] relative bg-background">
            {/* Condensed Header */}
            <div className="flex-none p-4 pb-2 border-b bg-muted/10">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {onBack && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={onBack}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <h2 className="font-semibold text-lg leading-none">{title}</h2>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        Step {currentStep} of {totalSteps}
                    </span>
                </div>
                <Progress value={progress} className="h-1" />
                {description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{description}</p>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {children}
            </div>

            {/* Fixed Action Footer */}
            <div className="flex-none p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
                <Button
                    className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20"
                    onClick={onNext}
                    disabled={isNextDisabled}
                >
                    {nextLabel}
                    {nextLabel === "Complete" ? (
                        <CheckCircle2 className="w-5 h-5 ml-2" />
                    ) : (
                        <ArrowRight className="w-5 h-5 ml-2" />
                    )}
                </Button>
            </div>
        </div>
    );
}
