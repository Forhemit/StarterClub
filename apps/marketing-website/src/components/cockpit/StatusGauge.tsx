import React from 'react';
import { cn } from "@/lib/utils";

export type GaugeStatus = 'brick' | 'wood' | 'straw';

interface StatusGaugeProps {
    status: GaugeStatus;
    label?: string;
    className?: string;
}

export const StatusGauge: React.FC<StatusGaugeProps> = ({ status, label, className }) => {
    const getStatusColor = (s: GaugeStatus) => {
        switch (s) {
            case 'brick': return 'bg-status-ready shadow-[0_0_10px_theme(colors.status.ready)]';
            case 'wood': return 'bg-status-wood shadow-[0_0_10px_theme(colors.status.wood)]';
            case 'straw': return 'bg-status-straw shadow-[0_0_10px_theme(colors.status.straw)]';
            default: return 'bg-gray-500';
        }
    };

    const statusMap = {
        brick: "Race Ready",
        wood: "Caution",
        straw: "Critical"
    };

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative h-4 w-4 rounded-full bg-secondary border border-border flex items-center justify-center">
                <div className={cn("h-2.5 w-2.5 rounded-full transition-all duration-500", getStatusColor(status))} />
            </div>
            <span className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                {label || statusMap[status]}
            </span>
        </div>
    );
};
