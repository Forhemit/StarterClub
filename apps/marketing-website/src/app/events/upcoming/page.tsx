import EventsList from '@/components/events/EventsList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UpcomingEventsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
                    <p className="text-muted-foreground mt-2">View and manage upcoming company events.</p>
                </div>
                <Button asChild>
                    <Link href="/events/create">Create New Event</Link>
                </Button>
            </div>
            <EventsList type="upcoming" />
        </div>
    );
}
