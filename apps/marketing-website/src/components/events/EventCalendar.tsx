'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSupabase } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';

const localizer = momentLocalizer(moment);

export default function EventCalendar() {
    const [events, setEvents] = useState<any[]>([]);
    const { toast } = useToast();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const supabase = useSupabase();

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .gte('event_date', moment().subtract(2, 'months').toISOString())
            .lte('event_date', moment().add(6, 'months').toISOString());

        if (!error && data) {
            const formattedEvents = data.map(event => ({
                id: event.id,
                title: event.title,
                start: new Date(event.event_date),
                end: event.end_date ? new Date(event.end_date) : new Date(moment(event.event_date).add(1, 'hour').toDate()),
                resource: event,
            }));
            setEvents(formattedEvents);
        } else if (error) {
            console.error('Error fetching events:', error);
            toast({ title: 'Error fetching events', description: error.message, variant: 'destructive' });
        }
    };

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
    };

    return (
        <div className="h-[700px] bg-card p-4 rounded-xl border shadow-sm">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                defaultView={Views.MONTH}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                style={{ height: '100%' }}
                eventPropGetter={(event) => ({
                    className: `event-type-${event.resource.event_type}`,
                    style: {
                        backgroundColor: getEventColor(event.resource.event_type),
                        color: '#fff',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '0.85rem'
                    },
                })}
            />

            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedEvent && (
                                <div className="space-y-4 mt-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-sm text-muted-foreground">When</span>
                                        <span>{format(selectedEvent.start, 'PPP p')} - {format(selectedEvent.end, 'p')}</span>
                                    </div>
                                    {selectedEvent.resource.location && (
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-sm text-muted-foreground">Location</span>
                                            <span>{selectedEvent.resource.location}</span>
                                        </div>
                                    )}
                                    {selectedEvent.resource.description && (
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-sm text-muted-foreground">Description</span>
                                            <p className="text-sm whitespace-pre-wrap">{selectedEvent.resource.description}</p>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-sm text-muted-foreground">Type</span>
                                        <span className="capitalize">{selectedEvent.resource.event_type}</span>
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function getEventColor(eventType: string) {
    const colors: Record<string, string> = {
        meeting: '#3b82f6', // blue-500
        workshop: '#10b981', // green-500
        social: '#f97316', // orange-500
        training: '#8b5cf6', // violet-500
        conference: '#ef4444', // red-500
    };
    return colors[eventType] || '#6b7280'; // gray-500
}
