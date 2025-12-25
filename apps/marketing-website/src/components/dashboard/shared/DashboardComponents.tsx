"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";

// --- Layout Components ---

interface DashboardProps {
    title: string;
    children: React.ReactNode;
}

export const Dashboard = ({ title, children }: DashboardProps) => (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h1>
            <Link href="/employee-portal/selection" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-2">
                Switch Role <ExternalLink className="w-4 h-4" />
            </Link>
        </div>
        <div className="space-y-8 animate-in fade-in duration-500">
            {children}
        </div>
    </div>
);

interface SectionProps {
    title: string;
    width?: 'full' | 'half' | 'third' | 'twoThirds';
    children: React.ReactNode;
}

export const Section = ({ title, width = 'full', children }: SectionProps) => {
    const widthClasses = {
        full: "col-span-12",
        half: "col-span-6",
        third: "col-span-4",
        twoThirds: "col-span-8",
    };

    return (
        <section className={cn("space-y-4", widthClasses[width])}>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                {title}
            </h2>
            <div className="space-y-6">
                {children}
            </div>
        </section>
    );
};

export const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {children}
    </div>
);

// --- Card Components ---

interface CardProps {
    title: string;
    width?: 'full' | 'half' | 'third' | 'twoThirds';
    children: React.ReactNode;
    className?: string;
}

const BaseCard = ({ title, width = 'full', children, className }: CardProps) => {
    const widthClasses = {
        full: "col-span-full",
        half: "col-span-1 md:col-span-2", // In a 4 col grid, half is 2
        third: "col-span-1 md:col-span-1", // Rounding simplifications for the flexible Row grid
        twoThirds: "col-span-1 md:col-span-3",
    };

    // Note: The Row component uses a simple grid. For more complex layouts (half/third), 
    // we might need to adjust the Row to be a col-span-12 grid if we strictly follow width props in cards.
    // For now, we'll treat cards as flexible items within the Grid.

    // Actually, to support the complex layouts requested (1/3 + 2/3), Row needs to be a 12-col grid
    // and children need col-span props. Let's adjust Row above if we want strict grid control, 
    // or just let them stack.
    // The USER's request implies specific widths. Let's make Row a flexible flex-wrap or 12-col grid.
    // Let's go with a styling that allows resizing.

    return (
        <div className={cn(
            "rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
            // Allow external override of grid classes if needed, otherwise default to full
            "w-full",
            className
        )}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
            </div>
            {children}
        </div>
    );
};

// Improved Row for mixed widths
export const GridRow = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-12 gap-6 w-full">
        {children}
    </div>
);

// Helper to wrap children in col-spans
export const ColWrapper = ({ width = 'full', children }: { width?: 'full' | 'half' | 'third' | 'twoThirds', children: React.ReactNode }) => {
    const colClasses = {
        full: "col-span-12",
        half: "col-span-12 md:col-span-6",
        third: "col-span-12 md:col-span-4",
        twoThirds: "col-span-12 md:col-span-8",
    };
    return <div className={cn(colClasses[width])}>{children}</div>
}


// --- Metric Card ---

interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: string;
    icon?: string;
    color?: 'green' | 'yellow' | 'red' | 'blue';
    detail?: string;
}

export const MetricCard = ({ title, value, trend, icon, color = 'blue', detail }: MetricCardProps) => {
    // Dynamic Icon
    // In a real app we'd map string names to icons. For now, we'll just render the emoji or text passed in,
    // or try to find a Lucide icon if it matches a name.

    const colorStyles = {
        green: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-600/20",
        red: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 ring-rose-600/20",
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 ring-blue-600/20",
        yellow: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 ring-amber-600/20",
    };

    const isPositive = trend?.startsWith('+');
    const isNegative = trend?.startsWith('-');

    return (
        <ColWrapper width="third"> {/* Defaulting to roughly 1/4 or 1/3 depending on context */}
            <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</span>
                            {trend && (
                                <span className={cn(
                                    "inline-flex items-baseline rounded-md px-2 py-0.5 text-xs font-semibold md:mt-2 lg:mt-0",
                                    isPositive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                        isNegative ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400" :
                                            "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                                )}>
                                    {isPositive && <ArrowUp className="mr-1 h-3 w-3 self-center shrink-0" />}
                                    {isNegative && <ArrowDown className="mr-1 h-3 w-3 self-center shrink-0" />}
                                    {trend}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={cn("rounded-lg p-3 ring-1 ring-inset", colorStyles[color])}>
                        <span className="text-xl">{icon || "📊"}</span>
                    </div>
                </div>
                {detail && (
                    <div className="mt-4 flex items-center gap-2">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {detail}
                        </p>
                    </div>
                )}
            </div>
        </ColWrapper>
    );
};

// --- Specialized Cards ---

interface ChartCardProps {
    title: string;
    width?: 'full' | 'half' | 'third' | 'twoThirds';
    children: React.ReactNode;
}

export const ChartCard = ({ title, width, children }: ChartCardProps) => (
    <ColWrapper width={width}>
        <BaseCard title={title}>
            <div className="min-h-[300px] w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                {children}
            </div>
        </BaseCard>
    </ColWrapper>
);

interface TableCardProps {
    title: string;
    width?: 'full' | 'half' | 'third' | 'twoThirds';
    children: React.ReactNode;
}

export const TableCard = ({ title, width, children }: TableCardProps) => (
    <ColWrapper width={width}>
        <BaseCard title={title}>
            <div className="overflow-x-auto">
                {children}
            </div>
        </BaseCard>
    </ColWrapper>
);

// --- Action Components ---

interface ActionItem {
    action: string;
    priority: 'high' | 'medium' | 'low';
    assignee: string;
}

export const ActionList = ({ items }: { items: ActionItem[] }) => (
    <div className="space-y-3">
        {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        item.priority === 'high' ? "bg-red-500" :
                            item.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                    )} />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.action}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{item.assignee}</span>
                    <button className="px-3 py-1 text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700">
                        View
                    </button>
                </div>
            </div>
        ))}
    </div>
);

interface QuickAction {
    label: string;
    icon: string;
    path: string;
    count?: number;
    amount?: string;
    departments?: number;
    pending?: string | number;
    scheduled?: number;
    period?: string;
    opportunities?: number;
    calendar?: string;
    alerts?: number;
    scans?: number;
    policies?: number;
    outdated?: number;
    areas?: number;
    new?: number;
    metrics?: number;
    initiatives?: number;
    // Generic fallback
    [key: string]: any;
}

export const QuickActionPanel = ({ actions }: { actions: QuickAction[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {actions.map((action, i) => (
            <Link
                key={i}
                href={action.path}
                className="group flex flex-col p-4 rounded-xl border border-zinc-200 bg-white hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500 transition-all cursor-pointer"
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{action.icon}</span>
                    <ArrowUp className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 rotate-45 transition-colors" />
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                    {action.label}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {Object.entries(action).find(([key]) => !['label', 'icon', 'path'].includes(key))?.[1] || 'Action'} {Object.entries(action).find(([key]) => !['label', 'icon', 'path'].includes(key))?.[0]}
                </span>
            </Link>
        ))}
    </div>
);

// --- Alert Components ---

interface AlertCardProps {
    title: string;
    level: 'high' | 'medium' | 'low';
    affected: string[];
    trigger: string;
    action: string;
}

export const AlertCard = ({ title, level, affected, trigger, action }: AlertCardProps) => {
    const levelColors = {
        high: "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
        medium: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20",
        low: "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20",
    };

    return (
        <ColWrapper width="third">
            <div className={cn("rounded-xl border p-5 h-full flex flex-col gap-3", levelColors[level])}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
                    <span className={cn("text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-black/20")}>
                        {level} Risk
                    </span>
                </div>
                <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-300 flex-grow">
                    <p><strong>Affected:</strong> {affected.join(", ")}</p>
                    <p><strong>Trigger:</strong> {trigger}</p>
                </div>
                <button className="mt-2 w-full py-2 bg-white dark:bg-black/20 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors border border-black/5">
                    {action}
                </button>
            </div>
        </ColWrapper>
    );
};

// --- Generic Mock Data Visualization Components ---
// These are simple placeholders to render the data structures provided in the prompt

export const SimpleChart = ({ data, type }: { data: any, type: string }) => (
    <div className="w-full h-full min-h-[250px] flex items-center justify-center flex-col p-4 text-center">
        <span className="text-4xl mb-4 text-zinc-300 dark:text-zinc-700">{type === 'line' ? '📈' : type === 'bar' ? '📊' : '🥧'}</span>
        <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {JSON.stringify(data).substring(0, 100)}...
        </p>
        <p className="mt-2 text-xs text-zinc-400">(Visualization Placeholder)</p>
    </div>
);
