import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RecurrenceSelectorProps {
    onChange: (pattern: any) => void;
}

export function RecurrenceSelector({ onChange }: RecurrenceSelectorProps) {
    const [frequency, setFrequency] = React.useState('weekly');
    const [interval, setInterval] = React.useState(1);

    React.useEffect(() => {
        onChange({ frequency, interval });
    }, [frequency, interval, onChange]);

    return (
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900/10 mt-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Interval (every X)</Label>
                    <Input
                        type="number"
                        min="1"
                        value={interval}
                        onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                    />
                </div>
            </div>
        </div>
    );
}
