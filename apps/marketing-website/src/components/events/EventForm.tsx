'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useUser } from '@/hooks/useUser';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { RecurrenceSelector } from '@/components/ui/RecurrenceSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function EventForm() {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const supabase = useSupabase();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        end_date: '',
        location: '',
        event_type: 'meeting',
        max_attendees: '',
        is_recurring: false,
        recurrence_pattern: null as any
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: 'Error', description: 'You must be logged in to create an event', variant: 'destructive' });
            return;
        }
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('events')
                .insert([
                    {
                        ...formData,
                        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                        created_by: user.id,
                        company_id: user.company_id
                    }
                ]);

            if (error) throw error;

            toast({ title: 'Success', description: 'Event created successfully' });
            router.push('/events/upcoming');
        } catch (error: any) {
            console.error('Error creating event:', error);
            toast({ title: 'Error', description: error.message || 'Failed to create event', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-xl border shadow-sm">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Team Meeting or Company Workshop"
                    />
                </div>

                <div>
                    <Label htmlFor="type">Event Type</Label>
                    <Select
                        value={formData.event_type}
                        onValueChange={(val) => setFormData({ ...formData, event_type: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="social">Social Event</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateTimePicker
                    label="Start Date & Time *"
                    value={formData.event_date}
                    onChange={(date) => setFormData({ ...formData, event_date: date })}
                    required
                />

                <DateTimePicker
                    label="End Date & Time"
                    value={formData.end_date}
                    onChange={(date) => setFormData({ ...formData, end_date: date })}
                />
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-md">
                <Checkbox
                    id="recurring"
                    checked={formData.is_recurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked as boolean })}
                />
                <Label htmlFor="recurring" className="cursor-pointer">Recurring Event</Label>
            </div>

            {formData.is_recurring && (
                <RecurrenceSelector
                    onChange={(pattern) => setFormData({ ...formData, recurrence_pattern: pattern })}
                />
            )}

            <div>
                <Label htmlFor="location">Location / Platform</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Conference Room A or Zoom Meeting"
                />
            </div>

            <div>
                <Label htmlFor="max_attendees">Max Attendees (Optional)</Label>
                <Input
                    id="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                    placeholder="e.g 50"
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-32"
                    placeholder="Agenda, materials needed, or other important information..."
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto"
            >
                {loading ? 'Creating...' : 'Create Event'}
            </Button>
        </form>
    );
}
