
"use client";

import { EnterpriseRepositoryData, DEFAULT_DOCUMENTS } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Shield, ShieldCheck, ShieldAlert, ExternalLink, Download, Copy, Calendar } from "lucide-react";
import { toast } from "sonner";

interface PreviewProps {
    data: EnterpriseRepositoryData;
}

export function EnterpriseRepositoryPreview({ data }: PreviewProps) {
    const parties = data.interestedParties;

    const copyLink = (partyId: string) => {
        // Mock link generation
        navigator.clipboard.writeText(`https://starter.club/access/${partyId}`);
        toast.success("Access link copied to clipboard");
    };

    const getAccessSummary = (partyId: string) => {
        const rules = data.accessRules[partyId] || [];
        const accessCount = rules.filter(r => r.hasAccess && !r.resourceId.includes('_')).length; // Count categories roughly or items?
        // Let's count total items enabled
        const totalItems = Object.values(DEFAULT_DOCUMENTS).reduce((acc, cat) => acc + cat.length, 0);
        const enabledItems = rules.filter(r =>
            // It's an item (matches an item ID in defaults)
            Object.values(DEFAULT_DOCUMENTS).some(cat => cat.some(i => i.id === r.resourceId)) && r.hasAccess
        ).length;

        if (enabledItems === 0) return { label: "No Access", color: "bg-destructive/10 text-destructive" };
        if (enabledItems === totalItems) return { label: "Full Access", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
        return { label: "Limited Access", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" };
    };

    return (
        <div className="space-y-8">
            {/* Header Summary */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold font-display">Repository Access Overview</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            You have granted access to <span className="font-medium text-foreground">{parties.length}</span> external parties.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => toast.info("Report downloading...")}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Audit Log
                        </Button>
                    </div>
                </div>
            </div>

            {/* Access Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parties.map(party => {
                    const status = getAccessSummary(party.id);
                    const partyRules = data.accessRules[party.id] || [];

                    return (
                        <Card key={party.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/10 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle>{party.companyName}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {party.role.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">• {party.contactName}</span>
                                        </CardDescription>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                                        {status.label}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {/* Permission Highlights */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Visible Categories</h4>

                                    {Object.entries(DEFAULT_DOCUMENTS).map(([catKey, items]) => {
                                        // Check if category is enabled or has some items enabled
                                        const catRule = partyRules.find(r => r.resourceId === catKey);
                                        const enabledItemsCount = items.filter(i => partyRules.find(r => r.resourceId === i.id)?.hasAccess).length;

                                        if (enabledItemsCount === 0) return null;

                                        const timeWindow = catRule?.timeWindow || partyRules.find(r => r.resourceId === items[0].id)?.timeWindow || "all_time";

                                        return (
                                            <div key={catKey} className="flex justify-between items-center text-sm p-2 bg-muted/20 rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <span className="capitalize font-medium">{catKey.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    {enabledItemsCount < items.length && (
                                                        <span className="text-muted-foreground">({enabledItemsCount}/{items.length})</span>
                                                    )}
                                                    {timeWindow !== 'all_time' && (
                                                        <Badge variant="secondary" className="h-5 text-[10px] gap-1 px-1.5">
                                                            <Calendar className="h-3 w-3" />
                                                            {timeWindow.replace(/_/g, ' ')}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {status.label === "No Access" && (
                                        <div className="text-sm text-muted-foreground italic pl-2">
                                            No documents are currently visible to this party.
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Action Footer */}
                                <div className="flex gap-2">
                                    <Button className="w-full" variant="secondary" size="sm" onClick={() => copyLink(party.id)}>
                                        <Copy className="h-3 w-3 mr-2" />
                                        Copy Access Link
                                    </Button>
                                    <Button className="w-full" variant="outline" size="sm" onClick={() => toast.info(`Email invite sent to ${party.email}`)}>
                                        <Mail className="h-3 w-3 mr-2" />
                                        Resend Invite
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {parties.length === 0 && (
                    <div className="col-span-full p-8 text-center border-2 border-dashed rounded-xl">
                        <p className="text-muted-foreground">No interested parties have been added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
