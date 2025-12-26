'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useUser } from '@/hooks/useUser';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, MapPin, Users } from 'lucide-react';

interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    end_date: string | null;
    location: string | null;
    event_type: string;
    status: string;
}

export default function EventsList({ type = 'upcoming' }: { type?: 'upcoming' | 'past' }) {
    const supabase = useSupabase();
    const { user } = useUser();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);

            let query = supabase.from('events').select('*');

            // "Only show events list for the month"
            query = query.gte('event_date', startOfMonth.toISOString())
                .lt('event_date', endOfMonth.toISOString());

            if (type === 'upcoming') {
                query = query.order('event_date', { ascending: true });
            } else {
                query = query.order('event_date', { ascending: false });
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching events:', JSON.stringify(error, null, 2));
            } else {
                setEvents(data || []);
            }
            setLoading(false);
        };

        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    if (loading) return <div>Loading events...</div>;

    if (events.length === 0) {
        return (
            <div className="text-center p-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">No events found for this month.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <Card key={event.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="capitalize mb-2">{event.event_type}</Badge>
                            <Badge variant={event.status === 'scheduled' ? 'default' : 'secondary'}>{event.status}</Badge>
                        </div>
                        <CardTitle className="line-clamp-2 min-h-[3rem]">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                            <CalendarDays className="h-3 w-3" />
                            {format(new Date(event.event_date), 'PPP p')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{event.description}</p>
                        {event.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="#">View Details</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
