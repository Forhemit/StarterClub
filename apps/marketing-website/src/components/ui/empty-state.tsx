import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className
}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-gray-50/50", className)}>
            {Icon && (
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500">
                    <Icon className="h-6 w-6" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="outline">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
