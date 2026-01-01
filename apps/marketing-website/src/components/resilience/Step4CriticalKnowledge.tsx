"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Key, BookOpen, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Step4Props {
    data: any;
    onSave: (data: any) => void;
}

const COMMON_DOMAINS = [
    "Payroll Processing", "Bank Access", "AWS Root", "Tax Filings", "Social Media", "Insurance Portal", "Legal Vault", "Investor Relations", "Key Client Relationships"
];

export function Step4CriticalKnowledge({ data, onSave }: Step4Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customDomainName, setCustomDomainName] = useState("");

    const handleAddDomain = (domain: string, isCustom = false) => {
        const current = data.knowledgeItems || [];
        if (current.find((i: any) => i.domain === domain)) return;

        const newItem = {
            id: crypto.randomUUID(),
            domain,
            busFactor: "medium",
            mitigation: "",
            isCustom
        };
        onSave({ ...data, knowledgeItems: [...current, newItem] });
        setCustomDomainName("");
        setIsDialogOpen(false);
    };

    const handleRemoveDomain = (id: string) => {
        const current = data.knowledgeItems || [];
        onSave({ ...data, knowledgeItems: current.filter((i: any) => i.id !== id) });
    };

    const updateItem = (id: string, updates: any) => {
        const current = data.knowledgeItems || [];
        onSave({
            ...data,
            knowledgeItems: current.map((i: any) => i.id === id ? { ...i, ...updates } : i)
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Critical Knowledge
                </h3>
                <p className="text-sm text-muted-foreground">Identify key knowledge silos and mitigation strategies.</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    <Label className="text-base">Knowledge Domains</Label>
                </div>
                <p className="text-xs text-muted-foreground">Select common domains to track.</p>

                <div className="flex flex-wrap gap-2">
                    {COMMON_DOMAINS.map(s => {
                        const isAdded = (data.knowledgeItems || []).find((i: any) => i.domain === s);
                        return (
                            <Badge
                                key={s}
                                variant={isAdded ? "default" : "outline"}
                                className={cn("cursor-pointer py-1.5 px-3 transition-all", isAdded ? "hover:bg-primary/90" : "hover:bg-muted text-muted-foreground bg-background")}
                                onClick={() => !isAdded && handleAddDomain(s)}
                            >
                                {s}
                                {isAdded && <X className="w-3 h-3 ml-1" onClick={(e) => { e.stopPropagation(); handleRemoveDomain((data.knowledgeItems.find((i: any) => i.domain === s) as any).id) }} />}
                                {!isAdded && <Plus className="w-3 h-3 ml-1" />}
                            </Badge>
                        );
                    })}
                </div>

                {/* Custom Add Dialog */}
                <div className="flex gap-2 mt-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full border-dashed text-muted-foreground">
                                <Plus className="w-4 h-4 mr-2" /> Add Custom Domain
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Custom Knowledge Domain</DialogTitle>
                                <DialogDescription>Enter the name of the system, process, or relationship.</DialogDescription>
                            </DialogHeader>
                            <Input
                                placeholder="e.g. Proprietary Algorithm Key"
                                value={customDomainName}
                                onChange={(e) => setCustomDomainName(e.target.value)}
                            />
                            <DialogFooter>
                                <Button onClick={() => handleAddDomain(customDomainName, true)} disabled={!customDomainName.trim()}>Add Domain</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* List Review & Mitigation */}
            <div className="space-y-3 mt-4">
                <Label className="text-base">Mitigation Strategies</Label>
                {(data.knowledgeItems || []).length === 0 ? (
                    <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-lg text-center bg-muted/10">
                        No critical knowledge domains selected. Adds items above to define mitigations.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {(data.knowledgeItems || []).map((item: any) => (
                            <div key={item.id} className="p-4 rounded-xl border bg-card space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {item.isCustom ? <Lock className="w-4 h-4 text-amber-500" /> : <ShieldAlert className="w-4 h-4 text-blue-500" />}
                                        <span className="font-semibold text-sm">{item.domain}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDomain(item.id)} className="h-6 w-6 -mr-2 text-muted-foreground hover:text-destructive">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Bus Factor</Label>
                                        <Select value={item.busFactor} onValueChange={(v) => updateItem(item.id, { busFactor: v })}>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low Risk</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High Risk</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Mitigation / Access</Label>
                                        <Input
                                            placeholder="e.g. Passwords in 1Password Vault, Process documented in Wiki..."
                                            value={item.mitigation || ""}
                                            onChange={(e) => updateItem(item.id, { mitigation: e.target.value })}
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2 pt-4 border-t border-dashed">
                <Label className="text-base">Additional Context</Label>
                <p className="text-xs text-muted-foreground">Add any context, general instructions, or emergency contacts.</p>
                <Textarea
                    placeholder="e.g. The physical safe is located in the server room..."
                    value={data.knowledgeContext || ""}
                    onChange={(e) => onSave({ ...data, knowledgeContext: e.target.value })}
                    className="min-h-[100px]"
                />
            </div>
        </div>
    );
}
