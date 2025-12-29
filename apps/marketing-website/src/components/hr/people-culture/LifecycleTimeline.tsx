"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, TrendingUp, UserMinus, UserPlus, ArrowRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LifecycleEvent {
    id: string;
    event_type: 'hire' | 'promotion' | 'transfer' | 'leave_start' | 'leave_end' | 'exit';
    event_date: string;
    details: any;
    created_at?: string;
}

interface LifecycleTimelineProps {
    events: LifecycleEvent[];
    hireDate: string;
}

const EVENT_CONFIG = {
    hire: { icon: UserPlus, color: 'text-green-600', bg: 'bg-green-100', label: 'Joined the Team' },
    promotion: { icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Promoted' },
    transfer: { icon: ArrowRight, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Transferred' },
    leave_start: { icon: UserMinus, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Started Leave' },
    leave_end: { icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Returned from Leave' },
    exit: { icon: UserMinus, color: 'text-red-600', bg: 'bg-red-100', label: 'Departed' },
    default: { icon: Briefcase, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Event' }
};

export function LifecycleTimeline({ events, hireDate }: LifecycleTimelineProps) {
    // Sort events by date ascending
    // Always include hire date as first event if not present in events list
    const sortedEvents = [...events].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    // If no explicit hire event, we could assume start.
    // But let's rely on events prop.

    // Combine hire date as event if empty?
    // User asked for "Hire Date (start of line)".

    const allEvents = [
        {
            id: 'hire-origin',
            event_type: 'hire',
            event_date: hireDate,
            details: { note: 'Original Hire Date' }
        } as LifecycleEvent,
        ...sortedEvents.filter(e => e.event_type !== 'hire') // Avoid dupe if in DB
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Employee Journey</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
                    {allEvents.map((event, index) => {
                        const config = EVENT_CONFIG[event.event_type] || EVENT_CONFIG.default;
                        const Icon = config.icon;
                        return (
                            <div key={event.id || index} className="relative pl-8">
                                <span className={cn(
                                    "absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white",
                                    config.bg
                                )}>
                                    <span className={cn("h-2 w-2 rounded-full", config.color.replace('text-', 'bg-'))} />
                                </span>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{config.label}</h4>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {new Date(event.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    {event.details && (
                                        <div className="mt-2 sm:mt-0 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                                            {event.details.title || event.details.note || event.details.reason || JSON.stringify(event.details)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {allEvents.length === 1 && (
                        <div className="relative pl-8 pt-4">
                            <span className="absolute -left-[5px] top-6 h-2 w-2 rounded-full bg-gray-200" />
                            <p className="text-sm text-gray-400 italic">No further history yet. The journey is just beginning!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
