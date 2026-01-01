"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, DollarSign, FileSignature, ShieldAlert } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SpendingLimit {
    id: string;
    role: string;
    limit: string;
    approver?: string;
}

interface SigningAuthority {
    id: string;
    documentType: string;
    authorizedSigners: string;
}

interface Step3Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step3DecisionAuthority({ data, onSave }: Step3Props) {
    const [emergencyProtocol, setEmergencyProtocol] = useState(data.emergencyProtocol || "");
    const [emergencyContacts, setEmergencyContacts] = useState(data.emergencyContacts || "");

    useEffect(() => {
        onSave({
            ...data,
            emergencyProtocol,
            emergencyContacts
        });
    }, [emergencyProtocol, emergencyContacts]);

    return (
        <Tabs defaultValue="spending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="spending" className="gap-2">
                    <DollarSign className="w-4 h-4" /> Tiered Spending
                </TabsTrigger>
                <TabsTrigger value="signing" className="gap-2">
                    <FileSignature className="w-4 h-4" /> Signing Matrix
                </TabsTrigger>
                <TabsTrigger value="emergency" className="gap-2">
                    <ShieldAlert className="w-4 h-4" /> Elevation/Escalation
                </TabsTrigger>
            </TabsList>

            <TabsContent value="spending" className="space-y-4 pt-4">
                <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{data.role || "This Role's"} Spending Authority</h3>
                            <p className="text-xs text-muted-foreground">Define the limits for the incumbent.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Operational Expenditure (OpEx) Limit</Label>
                            <Input
                                placeholder="e.g. $10,000"
                                value={data.opexLimit || ""}
                                onChange={(e) => onSave({ ...data, opexLimit: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground">Per transaction limit without higher approval.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Capital Expenditure (CapEx) Limit</Label>
                            <Input
                                placeholder="e.g. $2,500"
                                value={data.capexLimit || ""}
                                onChange={(e) => onSave({ ...data, capexLimit: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground">Equipment, assets, long-term investments.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Approver for Exceeding Limits</Label>
                        <Input
                            placeholder="e.g. CFO or CEO"
                            value={data.approverRole || ""}
                            onChange={(e) => onSave({ ...data, approverRole: e.target.value })}
                        />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="signing" className="space-y-4 pt-4">
                <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                    <div className="mb-4">
                        <h3 className="font-semibold">{data.role || "This Role's"} Signature Authority</h3>
                        <p className="text-xs text-muted-foreground">Select which documents this role is authorized to execute.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
                            <Switch
                                checked={data.canSignNDAs || false}
                                onCheckedChange={(c) => onSave({ ...data, canSignNDAs: c })}
                            />
                            <Label>NDAs & Confidentiality</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
                            <Switch
                                checked={data.canSignVendor || false}
                                onCheckedChange={(c) => onSave({ ...data, canSignVendor: c })}
                            />
                            <Label>Vendor Agreements {'<'} $50k</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
                            <Switch
                                checked={data.canSignEmployment || false}
                                onCheckedChange={(c) => onSave({ ...data, canSignEmployment: c })}
                            />
                            <Label>Employment Offers (Junior)</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
                            <Switch
                                checked={data.canSignChecks || false}
                                onCheckedChange={(c) => onSave({ ...data, canSignChecks: c })}
                            />
                            <Label>Bank Wire / Checks</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                            <Switch
                                checked={data.requiresDualControl || false}
                                onCheckedChange={(c) => onSave({ ...data, requiresDualControl: c })}
                            />
                            <div className="flex flex-col">
                                <Label className="text-amber-900 dark:text-amber-400">Two-Person Integrity Required</Label>
                                <span className="text-[10px] text-muted-foreground">For transactions &gt; $50k or sensitive ops.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4 pt-4">
                <div className="space-y-4">
                    <Card className="p-4 bg-muted/20">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                "When in Doubt" Escalation Pathway
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Clear rules for which decisions MUST go up the chain.
                            </p>
                            <Textarea
                                placeholder="E.g. Any expense over $50k unbudgeted, Hiring of VP level+, Litigious threats..."
                                className="min-h-[80px]"
                                value={data.escalationPathway || ""}
                                onChange={(e) => onSave({ ...data, escalationPathway: e.target.value })}
                            />
                        </div>
                    </Card>

                    <div className="space-y-2">
                        <Label>Emergency Override Protocol</Label>
                        <Textarea
                            placeholder="Defined triggers (e.g. Security Breach, PR Crisis) and who assumes command..."
                            className="min-h-[100px]"
                            value={emergencyProtocol}
                            onChange={(e) => setEmergencyProtocol(e.target.value)}
                        />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
