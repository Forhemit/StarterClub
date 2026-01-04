"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Globe } from "lucide-react";
import { toast } from "sonner";
import { getBusinessSettings, updateBusinessSettings } from "@/actions/settings";

export function GeneralTab() {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timezone, setTimezone] = useState("America/Los_Angeles");

    useEffect(() => {
        async function loadSettings() {
            try {
                const { timezone, error } = await getBusinessSettings();
                if (error) {
                    console.error("Failed to load settings:", error);
                    return;
                }
                if (timezone) setTimezone(timezone);
            } catch (e) {
                console.error("Error loading settings:", e);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateBusinessSettings({ timezone });
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success("Settings updated successfully");
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    const timezones = [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Phoenix",
        "America/Anchorage",
        "Pacific/Honolulu",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Australia/Sydney"
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Localization</CardTitle>
                    <CardDescription>Configure how dates and times are displayed across the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="timezone" className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5" />
                            Timezone
                        </Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                            <SelectTrigger id="timezone" className="w-full md:w-[300px]">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                {timezones.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tz.replace(/_/g, " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground">
                            Default: America/Los Angeles. This affects all date displays.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
