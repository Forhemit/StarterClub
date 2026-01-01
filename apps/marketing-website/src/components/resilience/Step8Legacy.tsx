"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Mic, Users, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Recording {
    id: string;
    topic: string;
    type: "video" | "audio" | "text";
    speaker: string;
    url?: string;
}

interface Relationship {
    id: string;
    stakeholder: string;
    contactName: string;
    context: string;
    handoffStatus: "pending" | "documented" | "introduced";
}

interface Step8Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step8Legacy({ data, onSave }: Step8Props) {
    const [legacyRecordings, setLegacyRecordings] = useState<Recording[]>(data.legacyRecordings || []);
    const [legacyRelationships, setLegacyRelationships] = useState<Relationship[]>(data.legacyRelationships || []);
    const [mentoringCadence, setMentoringCadence] = useState(data.mentoringCadence || "");
    const [mentoringFocus, setMentoringFocus] = useState(data.mentoringFocus || "");

    useEffect(() => {
        onSave({ legacyRecordings, legacyRelationships, mentoringCadence, mentoringFocus });
    }, [legacyRecordings, legacyRelationships, mentoringCadence, mentoringFocus]);

    const addRecording = () => {
        setLegacyRecordings([...legacyRecordings, {
            id: crypto.randomUUID(),
            topic: "",
            type: "audio", // Default to audio for voice memos
            speaker: "",
        }]);
    };

    const updateRecording = (id: string, updates: Partial<Recording>) => {
        setLegacyRecordings(legacyRecordings.map(rec => rec.id === id ? { ...rec, ...updates } : rec));
    };

    const removeRecording = (id: string) => {
        setLegacyRecordings(legacyRecordings.filter(rec => rec.id !== id));
    };

    const addRelationship = () => {
        setLegacyRelationships([...legacyRelationships, {
            id: crypto.randomUUID(),
            stakeholder: "",
            contactName: "",
            context: "",
            handoffStatus: "pending"
        }]);
    };

    const updateRelationship = (id: string, updates: Partial<Relationship>) => {
        setLegacyRelationships(legacyRelationships.map(rel => rel.id === id ? { ...rel, ...updates } : rel));
    };

    const removeRelationship = (id: string) => {
        setLegacyRelationships(legacyRelationships.filter(rel => rel.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    Legacy Handover
                </h3>
                <p className="text-sm text-muted-foreground">
                    Capture critical context through voice recordings and stakeholder introductions.
                </p>
            </div>
            <Tabs defaultValue="recordings" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="recordings" className="gap-2">
                        <Mic className="w-4 h-4" /> Voice Memos
                    </TabsTrigger>
                    <TabsTrigger value="relationships" className="gap-2">
                        <Users className="w-4 h-4" /> Relationships
                    </TabsTrigger>
                    <TabsTrigger value="mentoring" className="gap-2">
                        <BookOpen className="w-4 h-4" /> Mentoring
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recordings" className="space-y-4 pt-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Key Voice Memos</Label>
                            <Button variant="outline" size="sm" onClick={addRecording}>
                                <Plus className="w-4 h-4 mr-2" /> Add Memo
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {legacyRecordings.map((rec: Recording) => (
                                <Card key={rec.id} className="p-4">
                                    <div className="flex justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Topic (e.g. Q3 Strategy)"
                                                value={rec.topic}
                                                onChange={(e) => updateRecording(rec.id, { topic: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Speaker (e.g. Jane Doe)"
                                                value={rec.speaker}
                                                onChange={(e) => updateRecording(rec.id, { speaker: e.target.value })}
                                            />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeRecording(rec.id)}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        {legacyRecordings.length === 0 && (
                            <Card className="border-dashed">
                                <CardContent className="p-6 text-center text-muted-foreground">
                                    <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No voice memos added yet.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="relationships" className="space-y-4 pt-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Key Relationship Handoffs</Label>
                            <Button variant="outline" size="sm" onClick={addRelationship}>
                                <Plus className="w-4 h-4 mr-2" /> Add Contact
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {legacyRelationships.map((rel: Relationship) => (
                                <Card key={rel.id} className="p-4">
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                placeholder="Stakeholder Name"
                                                value={rel.stakeholder}
                                                onChange={(e) => updateRelationship(rel.id, { stakeholder: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Key Contact Person"
                                                value={rel.contactName}
                                                onChange={(e) => updateRelationship(rel.id, { contactName: e.target.value })}
                                            />
                                        </div>
                                        <Textarea
                                            placeholder="Context & Handover Strategy..."
                                            className="h-20 resize-none"
                                            value={rel.context}
                                            onChange={(e) => updateRelationship(rel.id, { context: e.target.value })}
                                        />
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="sm" className="text-destructive h-8" onClick={() => removeRelationship(rel.id)}>
                                                Remove Entry
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        {legacyRelationships.length === 0 && (
                            <Card className="border-dashed">
                                <CardContent className="p-6 text-center text-muted-foreground">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No relationships added yet.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="mentoring" className="space-y-4 pt-4">
                    <Card className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Mentoring Cadence with Successor</Label>
                            <Select
                                value={mentoringCadence}
                                onValueChange={setMentoringCadence}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly 1:1</SelectItem>
                                    <SelectItem value="biweekly">Bi-Weekly Deep Dive</SelectItem>
                                    <SelectItem value="monthly">Monthly Review</SelectItem>
                                    <SelectItem value="ad_hoc">Ad-hoc / As Needed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Key Mentoring Focus Areas</Label>
                            <Textarea
                                placeholder="e.g. Political navigation, Strategic partnerships, Board dynamics..."
                                className="min-h-[100px]"
                                value={mentoringFocus}
                                onChange={(e) => setMentoringFocus(e.target.value)}
                            />
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
