"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Globe } from "lucide-react";

export interface BoardSettings {
    title: string;
    slug: string;
}

interface Step1BoardSettingsProps {
    data: BoardSettings;
    onChange: (data: BoardSettings) => void;
}

export const DEFAULT_BOARD_SETTINGS: BoardSettings = {
    title: "",
    slug: "",
};

export function Step1BoardSettings({ data, onChange }: Step1BoardSettingsProps) {
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        onChange({ ...data, title, slug });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Board Settings
                </CardTitle>
                <CardDescription>
                    Configure how your careers page will appear to the public.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Careers Page Title *</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Acme Corp Careers"
                        value={data.title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Public URL Slug *
                    </Label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md border">
                            jobs.starterclub.com/
                        </span>
                        <Input
                            id="slug"
                            placeholder="acme-corp"
                            value={data.slug}
                            onChange={(e) => onChange({ ...data, slug: e.target.value })}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        This will be the URL where candidates can view your open positions.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
