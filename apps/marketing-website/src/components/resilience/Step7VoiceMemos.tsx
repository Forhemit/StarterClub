"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Mic, Video, FileText } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Recording {
    id: string;
    topic: string;
    type: "video" | "audio" | "text";
    speaker: string;
    url?: string;
}

interface Step7Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step7VoiceMemos({ data, onSave }: Step7Props) {
    const [legacyRecordings, setLegacyRecordings] = useState<Recording[]>(data.legacyRecordings || []);

    useEffect(() => {
        onSave({ ...data, legacyRecordings });
    }, [legacyRecordings]);

    const addRecording = () => {
        setLegacyRecordings([...legacyRecordings, {
            id: crypto.randomUUID(),
            topic: "",
            type: "audio",
            speaker: "",
        }]);
    };

    const updateRecording = (id: string, updates: Partial<Recording>) => {
        setLegacyRecordings(legacyRecordings.map(rec => rec.id === id ? { ...rec, ...updates } : rec));
    };

    const removeRecording = (id: string) => {
        setLegacyRecordings(legacyRecordings.filter(rec => rec.id !== id));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="w-4 h-4" />;
            case 'text': return <FileText className="w-4 h-4" />;
            default: return <Mic className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    Voice Memos & Recordings
                </h3>
                <p className="text-sm text-muted-foreground">
                    Capture critical institutional knowledge through recorded messages from key personnel.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Knowledge Recordings</Label>
                    <Button variant="outline" size="sm" onClick={addRecording}>
                        <Plus className="w-4 h-4 mr-2" /> Add Memo
                    </Button>
                </div>

                <div className="space-y-3">
                    {legacyRecordings.map((rec: Recording) => (
                        <Card key={rec.id} className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Topic</Label>
                                                <Input
                                                    placeholder="e.g. Q3 Strategy Overview"
                                                    value={rec.topic}
                                                    onChange={(e) => updateRecording(rec.id, { topic: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Speaker</Label>
                                                <Input
                                                    placeholder="e.g. Jane Doe, CEO"
                                                    value={rec.speaker}
                                                    onChange={(e) => updateRecording(rec.id, { speaker: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Type</Label>
                                                <Select
                                                    value={rec.type}
                                                    onValueChange={(v) => updateRecording(rec.id, { type: v as Recording['type'] })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="audio">
                                                            <span className="flex items-center gap-2"><Mic className="w-3 h-3" /> Audio</span>
                                                        </SelectItem>
                                                        <SelectItem value="video">
                                                            <span className="flex items-center gap-2"><Video className="w-3 h-3" /> Video</span>
                                                        </SelectItem>
                                                        <SelectItem value="text">
                                                            <span className="flex items-center gap-2"><FileText className="w-3 h-3" /> Written</span>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Link (optional)</Label>
                                                <Input
                                                    placeholder="https://..."
                                                    value={rec.url || ""}
                                                    onChange={(e) => updateRecording(rec.id, { url: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeRecording(rec.id)}>
                                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {legacyRecordings.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <Mic className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No voice memos added yet</p>
                            <p className="text-sm mt-1">Record key decisions, strategies, or institutional knowledge that successors need to know.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Why record voice memos?</h4>
                <p className="text-xs text-blue-800 dark:text-blue-400">
                    Voice memos capture nuance and context that written documents miss. They're invaluable for successors understanding the "why" behind key decisions.
                </p>
            </div>
        </div>
    );
}
