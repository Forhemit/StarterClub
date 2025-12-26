import EventsList from '@/components/events/EventsList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PastEventsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Past Events</h1>
                    <p className="text-muted-foreground mt-2">Archive of completed company events.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/events/upcoming">View Upcoming</Link>
                </Button>
            </div>
            <EventsList type="past" />
        </div>
    );
}
