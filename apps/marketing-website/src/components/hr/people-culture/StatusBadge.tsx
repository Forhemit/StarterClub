import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Rocket, Moon, UserMinus, AlertCircle } from 'lucide-react';

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated' | string;

interface StatusBadgeProps {
    status: EmployeeStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = status?.toLowerCase() || 'inactive';

    const config = {
        active: {
            label: 'Active & Thriving',
            icon: Rocket,
            className: "bg-gradient-to-br from-[#FF6B35] to-[#FF9A76] text-white border-none hover:from-[#FF6B35] hover:to-[#FF8A65]"
        },
        inactive: {
            label: 'Inactive',
            icon: Moon,
            className: "bg-gradient-to-br from-gray-400 to-gray-500 text-white border-none"
        },
        on_leave: {
            label: 'On Leave',
            icon: UserMinus,
            className: "bg-gradient-to-br from-[#4ECDC4] to-[#1A535C] text-white border-none"
        },
        terminated: {
            label: 'Terminated',
            icon: AlertCircle,
            className: "bg-red-100 text-red-700 border-red-200"
        }
    };

    const statusConfig = config[normalizedStatus as keyof typeof config] || config.inactive;
    const Icon = statusConfig.icon;

    return (
        <Badge className={cn("px-3 py-1 gap-1.5 transition-all shadow-sm", statusConfig.className, className)}>
            <Icon className="w-3.5 h-3.5" />
            <span className="font-medium">{statusConfig.label}</span>
        </Badge>
    );
}
