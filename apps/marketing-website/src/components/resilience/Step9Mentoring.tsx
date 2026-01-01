"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Calendar, Target, Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step9Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step9Mentoring({ data, onSave }: Step9Props) {
    const [mentoringCadence, setMentoringCadence] = useState(data.mentoringCadence || "");
    const [mentoringFocus, setMentoringFocus] = useState(data.mentoringFocus || "");
    const [upstreamCadence, setUpstreamCadence] = useState(data.upstreamCadence || "");
    const [upstreamFocus, setUpstreamFocus] = useState(data.upstreamFocus || "");
    const [upstream, setUpstream] = useState<any[]>(data.mentoringUpstream || []);
    const [downstream, setDownstream] = useState<any[]>(data.mentoringDownstream || []);

    const [activeTab, setActiveTab] = useState<'downstream' | 'upstream'>('downstream');

    useEffect(() => {
        onSave({
            ...data,
            mentoringCadence,
            mentoringFocus,
            upstreamCadence,
            upstreamFocus,
            mentoringUpstream: upstream,
            mentoringDownstream: downstream
        });
    }, [mentoringCadence, mentoringFocus, upstreamCadence, upstreamFocus, upstream, downstream]);

    const addUpstream = () => {
        setUpstream([...upstream, { id: crypto.randomUUID(), name: "", title: "", context: "" }]);
    };

    const addDownstream = () => {
        setDownstream([...downstream, { id: crypto.randomUUID(), name: "", title: "", focus: "" }]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Mentoring Program
                </h3>
                <p className="text-sm text-muted-foreground">
                    Define the relationships for successor development (Downstream) and your own growth (Upstream).
                </p>
            </div>

            <div className="flex space-x-2 border-b border-border">
                <button
                    onClick={() => setActiveTab('downstream')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'downstream'
                            ? 'border-sky-500 text-sky-700 bg-sky-50/50'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <ArrowDownCircle className="w-4 h-4" /> Downstream (Successors)
                </button>
                <button
                    onClick={() => setActiveTab('upstream')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upstream'
                            ? 'border-purple-500 text-purple-700 bg-purple-50/50'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <ArrowUpCircle className="w-4 h-4" /> Upstream (Advisors)
                </button>
            </div>

            {activeTab === 'downstream' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                    {/* Strategy Card */}
                    <Card className="p-6 space-y-5 bg-sky-50/20 border-sky-100 dark:border-sky-900/20">
                        <h4 className="font-semibold text-sm text-sky-800 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Successor Development Strategy
                        </h4>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Cadence</Label>
                                <Select value={mentoringCadence} onValueChange={setMentoringCadence}>
                                    <SelectTrigger className="w-full bg-background">
                                        <SelectValue placeholder="Frequency..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Key Focus</Label>
                                <Input
                                    placeholder="e.g. Political Navigation"
                                    value={mentoringFocus}
                                    onChange={(e) => setMentoringFocus(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Mentees List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Mentee Roster</Label>
                            <Button variant="outline" size="sm" onClick={addDownstream} className="h-8">
                                <Plus className="w-3 h-3 mr-1" /> Add Mentee
                            </Button>
                        </div>

                        <div className="grid gap-3">
                            {downstream.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-lg border bg-card">
                                    <div className="sm:col-span-3">
                                        <Input
                                            value={item.name}
                                            onChange={(e) => setDownstream(downstream.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                                            placeholder="Name"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <Input
                                            value={item.title}
                                            onChange={(e) => setDownstream(downstream.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))}
                                            placeholder="Title"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-5">
                                        <Input
                                            value={item.focus}
                                            onChange={(e) => setDownstream(downstream.map(i => i.id === item.id ? { ...i, focus: e.target.value } : i))}
                                            placeholder="Development Goal"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => setDownstream(downstream.filter(i => i.id !== item.id))} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {downstream.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-xs italic border border-dashed rounded-lg bg-muted/10">
                                    No mentees added active.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'upstream' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                    {/* Strategy Card */}
                    <Card className="p-6 space-y-5 bg-purple-50/20 border-purple-100 dark:border-purple-900/20">
                        <h4 className="font-semibold text-sm text-purple-800 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Advisor Engagement Strategy
                        </h4>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Cadence</Label>
                                <Select value={upstreamCadence} onValueChange={setUpstreamCadence}>
                                    <SelectTrigger className="w-full bg-background">
                                        <SelectValue placeholder="Frequency..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                        <SelectItem value="ad_hoc">Ad-hoc</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Key Focus</Label>
                                <Input
                                    placeholder="e.g. Industry Trends"
                                    value={upstreamFocus}
                                    onChange={(e) => setUpstreamFocus(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Mentors List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Advisor Roster</Label>
                            <Button variant="outline" size="sm" onClick={addUpstream} className="h-8">
                                <Plus className="w-3 h-3 mr-1" /> Add Advisor
                            </Button>
                        </div>

                        <div className="grid gap-3">
                            {upstream.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-lg border bg-card">
                                    <div className="sm:col-span-3">
                                        <Input
                                            value={item.name}
                                            onChange={(e) => setUpstream(upstream.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                                            placeholder="Name"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <Input
                                            value={item.title}
                                            onChange={(e) => setUpstream(upstream.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))}
                                            placeholder="Role/Title"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-5">
                                        <Input
                                            value={item.context}
                                            onChange={(e) => setUpstream(upstream.map(i => i.id === item.id ? { ...i, context: e.target.value } : i))}
                                            placeholder="Context / Expertise"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => setUpstream(upstream.filter(i => i.id !== item.id))} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {upstream.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-xs italic border border-dashed rounded-lg bg-muted/10">
                                    No advisors added.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
