"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Video, FileText, Mic, Users, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Recording {
    id: string;
    topic: string; // e.g., "Founding Philosophy", "Strategic Bet: AI"
    type: "video" | "audio" | "text";
    speaker: string;
    url?: string;
}

interface Relationship {
    id: string;
    stakeholder: string; // e.g., "Sequoia Capital", "Acme Corp"
    contactName: string;
    context: string;
    handoffStatus: "pending" | "documented" | "introduced";
}

interface Step4Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step4KnowledgeCapture({ data, onSave }: Step4Props) {
    const [recordings, setRecordings] = useState<Recording[]>(data.recordings || []);
    const [relationships, setRelationships] = useState<Relationship[]>(data.relationships || []);
    const [upstream, setUpstream] = useState<any[]>(data.mentoringUpstream || []);
    const [downstream, setDownstream] = useState<any[]>(data.mentoringDownstream || []);

    useEffect(() => {
        onSave({ recordings, relationships, mentoringUpstream: upstream, mentoringDownstream: downstream });
    }, [recordings, relationships, upstream, downstream]);

    const addRecording = () => {
        setRecordings([...recordings, {
            id: crypto.randomUUID(),
            topic: "",
            type: "video",
            speaker: "",
        }]);
    };

    const addRelationship = () => {
        setRelationships([...relationships, {
            id: crypto.randomUUID(),
            stakeholder: "",
            contactName: "",
            context: "",
            handoffStatus: "pending"
        }]);
    };

    const addUpstream = () => {
        setUpstream([...upstream, { id: crypto.randomUUID(), name: "", title: "", context: "" }]);
    };

    const addDownstream = () => {
        setDownstream([...downstream, { id: crypto.randomUUID(), name: "", title: "", focus: "" }]);
    };

    return (
        <Tabs defaultValue="culture" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="culture" className="gap-2">
                    <Video className="w-4 h-4" /> "Why We Exist"
                </TabsTrigger>
                <TabsTrigger value="relationships" className="gap-2">
                    <Users className="w-4 h-4" /> Key Relationships
                </TabsTrigger>
                <TabsTrigger value="mentoring" className="gap-2">
                    <Mic className="w-4 h-4" /> Mentoring Program
                </TabsTrigger>
            </TabsList>

            <TabsContent value="culture" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-base font-medium">Founder/Leader Recordings</Label>
                        <p className="text-sm text-muted-foreground">Capture the "why" behind the "what" to prevent strategy drift.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addRecording}>
                        <Plus className="w-4 h-4 mr-2" /> Add Topic
                    </Button>
                </div>

                {recordings.map((recording) => (
                    <Card key={recording.id} className="p-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-full">
                                {recording.type === 'video' ? <Video className="w-4 h-4" /> :
                                    recording.type === 'audio' ? <Mic className="w-4 h-4" /> :
                                        <FileText className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Topic</Label>
                                        <Input
                                            placeholder="e.g. Origin Story, The 'No-Ads' Decision"
                                            value={recording.topic}
                                            onChange={(e) => setRecordings(recordings.map(r => r.id === recording.id ? { ...r, topic: e.target.value } : r))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Speaker</Label>
                                        <Input
                                            placeholder="e.g. Jane Doe (CEO)"
                                            value={recording.speaker}
                                            onChange={(e) => setRecordings(recordings.map(r => r.id === recording.id ? { ...r, speaker: e.target.value } : r))}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="w-full sm:w-auto">
                                        <PlayCircle className="w-4 h-4 mr-2" /> Record / Upload
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive ml-auto"
                                        onClick={() => setRecordings(recordings.filter(r => r.id !== recording.id))}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {recordings.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No cultural context recorded yet.</p>
                        </CardContent>
                    </Card>
                )}
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-base font-medium">Critical Relationship Introductions</Label>
                        <p className="text-sm text-muted-foreground">Ensure key external relationships survive leadership transitions.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addRelationship}>
                        <Plus className="w-4 h-4 mr-2" /> Add Relationship
                    </Button>
                </div>

                {relationships.map((rel) => (
                    <Card key={rel.id} className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Stakeholder / Partner</Label>
                                <Input
                                    placeholder="e.g. Sequoia Capital"
                                    value={rel.stakeholder}
                                    onChange={(e) => setRelationships(relationships.map(r => r.id === rel.id ? { ...r, stakeholder: e.target.value } : r))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Key Contact</Label>
                                <Input
                                    placeholder="e.g. Roelof Botha"
                                    value={rel.contactName}
                                    onChange={(e) => setRelationships(relationships.map(r => r.id === rel.id ? { ...r, contactName: e.target.value } : r))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <Label className="text-xs text-muted-foreground">Context & Handoff Notes</Label>
                            <Textarea
                                placeholder="History of the relationship, personal preferences, negotiation style..."
                                value={rel.context}
                                onChange={(e) => setRelationships(relationships.map(r => r.id === rel.id ? { ...r, context: e.target.value } : r))}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => setRelationships(relationships.filter(r => r.id !== rel.id))}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                            </Button>
                        </div>
                    </Card>
                ))}
            </TabsContent>

            <TabsContent value="mentoring" className="space-y-8 pt-4">
                {/* Downstream */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <div>
                            <Label className="text-base font-semibold flex items-center gap-2">
                                Downstream Mentoring
                                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-medium">Who you mentor</span>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Identify successors and high-potential talent you are grooming.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={addDownstream}>
                            <Plus className="w-4 h-4 mr-2" /> Add Mentee
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {downstream.map((item) => (
                            <Card key={item.id} className="p-3 bg-sky-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                    <div className="sm:col-span-3 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Mentee Name</Label>
                                        <Input
                                            value={item.name}
                                            onChange={(e) => setDownstream(downstream.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                                            placeholder="Name"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="sm:col-span-3 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Title</Label>
                                        <Input
                                            value={item.title}
                                            onChange={(e) => setDownstream(downstream.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))}
                                            placeholder="Current Role"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="sm:col-span-5 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Development Focus</Label>
                                        <Input
                                            value={item.focus}
                                            onChange={(e) => setDownstream(downstream.map(i => i.id === item.id ? { ...i, focus: e.target.value } : i))}
                                            placeholder="e.g. Strategic thinking, Ops leadership"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => setDownstream(downstream.filter(i => i.id !== item.id))}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Upstream */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <div>
                            <Label className="text-base font-semibold flex items-center gap-2">
                                Upstream / Reverse Mentoring
                                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">Who mentors you</span>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Advisors, coaches, or junior staff providing ground-truth feedback.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={addUpstream}>
                            <Plus className="w-4 h-4 mr-2" /> Add Mentor
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {upstream.map((item) => (
                            <Card key={item.id} className="p-3 bg-purple-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                    <div className="sm:col-span-3 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Mentor Name</Label>
                                        <Input
                                            value={item.name}
                                            onChange={(e) => setUpstream(upstream.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                                            placeholder="Name"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="sm:col-span-3 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Title / Role</Label>
                                        <Input
                                            value={item.title}
                                            onChange={(e) => setUpstream(upstream.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))}
                                            placeholder="Role"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="sm:col-span-5 space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Context</Label>
                                        <Input
                                            value={item.context}
                                            onChange={(e) => setUpstream(upstream.map(i => i.id === item.id ? { ...i, context: e.target.value } : i))}
                                            placeholder="e.g. 'Gen Z Consumer Trends', 'Crisis Management'"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => setUpstream(upstream.filter(i => i.id !== item.id))}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
