'use client';

import EventCalendar from '@/components/events/EventCalendar';

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
                <p className="text-muted-foreground mt-2">Overview of all scheduled events.</p>
            </div>
            <EventCalendar />
        </div>
    );
}
