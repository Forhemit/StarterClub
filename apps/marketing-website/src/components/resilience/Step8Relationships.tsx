"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

export function Step8Relationships({ data, onSave }: Step8Props) {
    const [legacyRelationships, setLegacyRelationships] = useState<Relationship[]>(data.legacyRelationships || []);

    useEffect(() => {
        onSave({ ...data, legacyRelationships });
    }, [legacyRelationships]);

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

    const getStatusBadge = (status: Relationship['handoffStatus']) => {
        switch (status) {
            case 'introduced':
                return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Introduced</Badge>;
            case 'documented':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Documented</Badge>;
            default:
                return <Badge variant="outline" className="text-amber-700 border-amber-300"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Key Relationships
                </h3>
                <p className="text-sm text-muted-foreground">
                    Document critical stakeholder relationships and plan for proper handoff introductions.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Stakeholder Registry</Label>
                    <Button variant="outline" size="sm" onClick={addRelationship}>
                        <Plus className="w-4 h-4 mr-2" /> Add Contact
                    </Button>
                </div>

                <div className="space-y-3">
                    {legacyRelationships.map((rel: Relationship) => (
                        <Card key={rel.id} className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Stakeholder / Organization</Label>
                                                <Input
                                                    placeholder="e.g. Acme Corp, Board Member"
                                                    value={rel.stakeholder}
                                                    onChange={(e) => updateRelationship(rel.id, { stakeholder: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Key Contact Person</Label>
                                                <Input
                                                    placeholder="e.g. John Smith, VP Sales"
                                                    value={rel.contactName}
                                                    onChange={(e) => updateRelationship(rel.id, { contactName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Context & Handover Strategy</Label>
                                            <Textarea
                                                placeholder="Describe the relationship history, importance, and how to introduce the successor..."
                                                className="min-h-[80px] resize-none"
                                                value={rel.context}
                                                onChange={(e) => updateRelationship(rel.id, { context: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Handoff Status</Label>
                                                <Select
                                                    value={rel.handoffStatus}
                                                    onValueChange={(v) => updateRelationship(rel.id, { handoffStatus: v as Relationship['handoffStatus'] })}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="documented">Documented</SelectItem>
                                                        <SelectItem value="introduced">Introduced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="mt-4">
                                                {getStatusBadge(rel.handoffStatus)}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="ml-2" onClick={() => removeRelationship(rel.id)}>
                                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {legacyRelationships.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No relationships documented yet</p>
                            <p className="text-sm mt-1">Add key stakeholders and contacts that need to be introduced to successors.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Why document relationships?</h4>
                <p className="text-xs text-purple-800 dark:text-purple-400">
                    Business relationships built over years can't be transferred through documents alone. Proper introductions and context ensure continuity of trust.
                </p>
            </div>
        </div>
    );
}
