import EventForm from '@/components/events/EventForm';

export default function CreateEventPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
                <p className="text-muted-foreground mt-2">Schedule a new meeting, workshop, or social event.</p>
            </div>
            <EventForm />
        </div>
    );
}
