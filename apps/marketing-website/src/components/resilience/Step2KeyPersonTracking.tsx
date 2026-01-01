"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface KnowledgeItem {
    id: string;
    domain: string;
    vault: string;
    busFactor: "critical" | "high" | "medium" | "low";
}

interface Step2Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step2KeyPersonTracking({ data, onSave }: Step2Props) {
    const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(data.knowledgeItems || []);

    const getBusFactorColor = (factor: string) => {
        switch (factor) {
            case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            default: return "";
        }
    };

    const addItem = () => {
        const newItem: KnowledgeItem = {
            id: crypto.randomUUID(),
            domain: "",
            vault: "",
            busFactor: "critical"
        };
        const updatedItems = [...knowledgeItems, newItem];
        setKnowledgeItems(updatedItems);
        onSave({ ...data, knowledgeItems: updatedItems });
    };

    const updateItem = (id: string, updates: Partial<KnowledgeItem>) => {
        const updatedItems = knowledgeItems.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        setKnowledgeItems(updatedItems);
        onSave({ ...data, knowledgeItems: updatedItems });
    };

    const removeItem = (id: string) => {
        const updatedItems = knowledgeItems.filter(item => item.id !== id);
        setKnowledgeItems(updatedItems);
        onSave({ ...data, knowledgeItems: updatedItems });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-base font-medium">Critical Knowledge Redundancy Audit</Label>
                    <p className="text-sm text-muted-foreground">Identify distinct knowledge domains where Bus Factor ≤ 2.</p>
                </div>
                <Button variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" /> Add Domain
                </Button>
            </div>

            <div className="space-y-4">
                {knowledgeItems.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No critical knowledge domains identified yet. Click "Add Domain" to start.</p>
                        </CardContent>
                    </Card>
                ) : (
                    knowledgeItems.map((item, index) => (
                        <Card key={item.id} className="p-6 relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>

                            <div className="flex items-start justify-between mb-6 pr-8">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Domain #{index + 1}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Bus Factor:</Label>
                                    <Select
                                        value={item.busFactor}
                                        onValueChange={(v: any) => updateItem(item.id, { busFactor: v })}
                                    >
                                        <SelectTrigger className="w-32 h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="critical">Critical (1)</SelectItem>
                                            <SelectItem value="high">High (2)</SelectItem>
                                            <SelectItem value="medium">Medium (3)</SelectItem>
                                            <SelectItem value="low">Low (4+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Badge className={getBusFactorColor(item.busFactor) + " text-[10px]"}>
                                        {item.busFactor.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Unique Knowledge Domain</Label>
                                    <Textarea
                                        placeholder="e.g. Only person who knows the legacy billing code..."
                                        className="resize-none h-24"
                                        value={item.domain}
                                        onChange={(e) => updateItem(item.id, { domain: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex justify-between">
                                        <span>Vault Location (Docs/Keys)</span>
                                    </Label>
                                    <Textarea
                                        placeholder="e.g. 1Password Vault 'Eng Ops'..."
                                        className="resize-none h-20"
                                        value={item.vault}
                                        onChange={(e) => updateItem(item.id, { vault: e.target.value })}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
