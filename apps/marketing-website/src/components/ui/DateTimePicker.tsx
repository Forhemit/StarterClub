import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export function DateTimePicker({ label, value, onChange, required }: DateTimePickerProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Input
                type="datetime-local"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="w-full"
            />
        </div>
    );
}
