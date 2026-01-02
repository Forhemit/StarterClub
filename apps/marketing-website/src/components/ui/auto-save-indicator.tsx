import React from "react";
import { Loader2, CheckCircle2, RotateCcw, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "unsaved";

interface AutoSaveIndicatorProps {
    status: SaveStatus;
    lastSaved?: Date;
    className?: string;
    onRetry?: () => void;
}

export function AutoSaveIndicator({ status, lastSaved, className, onRetry }: AutoSaveIndicatorProps) {
    if (status === "idle") return null;

    return (
        <div className={cn("flex items-center gap-2 animate-in fade-in transition-all duration-300", className)}>
            {status === "saving" && (
                <Badge variant="secondary" className="gap-1.5 h-7 bg-muted/50 text-muted-foreground border-transparent px-3">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                </Badge>
            )}

            {status === "saved" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="hidden sm:inline">Saved</span>
                    {lastSaved && (
                        <span className="hidden lg:inline opacity-60">
                            {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
            )}

            {status === "unsaved" && (
                <Badge variant="outline" className="gap-1.5 h-7 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                    <Cloud className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unsaved Changes</span>
                </Badge>
            )}

            {status === "error" && (
                <Badge variant="destructive" className="gap-1.5 h-7 cursor-pointer hover:bg-destructive/90" onClick={onRetry}>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Failed - Retry</span>
                </Badge>
            )}
        </div>
    );
}
