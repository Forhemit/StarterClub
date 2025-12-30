"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

export interface NotificationSettings {
    email: string;
}

interface Step2NotificationsProps {
    data: NotificationSettings;
    onChange: (data: NotificationSettings) => void;
}

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
    email: "",
};

export function Step2Notifications({ data, onChange }: Step2NotificationsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                </CardTitle>
                <CardDescription>
                    Receive updates when candidates apply to your job postings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Notification Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="careers@acme.com"
                        value={data.email}
                        onChange={(e) => onChange({ ...data, email: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                        We'll send new application alerts to this address.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
