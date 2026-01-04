
"use client";

import { useState, useMemo } from "react";
import { EnterpriseRepositoryData, InterestedParty, AccessRule, TimeWindow, DEFAULT_DOCUMENTS } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock, Unlock, Eye, EyeOff, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface Step2Props {
    data: EnterpriseRepositoryData;
    onUpdate: (data: Partial<EnterpriseRepositoryData>) => void;
}

export function Step2AccessControl({ data, onUpdate }: Step2Props) {
    const parties = data.interestedParties;

    // Local state for active tab if needed, but Tabs handles component mounting
    // We'll default to the first party if available
    const [activePartyId, setActivePartyId] = useState<string>(parties[0]?.id || "");

    if (parties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Parties Added</h3>
                <p className="text-muted-foreground max-w-md">
                    You need to add interested parties in the previous step before configuring their access permissions.
                </p>
            </div>
        );
    }

    const updateAccessRule = (partyId: string, resourceId: string, hasAccess: boolean, timeWindow?: TimeWindow) => {
        const currentRules = data.accessRules[partyId] || [];
        const existingRuleIndex = currentRules.findIndex(r => r.resourceId === resourceId);

        let newRules = [...currentRules];

        if (existingRuleIndex >= 0) {
            // Update existing
            if (!hasAccess && resourceId.includes('_')) {
                // Logic check: if turning off a specific item, maybe just remove the rule or set false
                // For simplicity, we keep the rule object but set state
            }

            newRules[existingRuleIndex] = {
                ...newRules[existingRuleIndex],
                hasAccess,
                // Only update timeWindow if provided, otherwise keep existing or default (handled in UI)
                timeWindow: timeWindow !== undefined ? timeWindow : newRules[existingRuleIndex].timeWindow
            };
        } else {
            // Create new
            newRules.push({
                partyId,
                resourceId,
                hasAccess,
                // Default to all_time if not specified
                timeWindow: timeWindow || "all_time"
            });
        }

        const updatedAccessRules = {
            ...data.accessRules,
            [partyId]: newRules
        };

        onUpdate({ accessRules: updatedAccessRules });
    };

    const getRule = (partyId: string, resourceId: string): AccessRule | undefined => {
        return data.accessRules[partyId]?.find(r => r.resourceId === resourceId);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Configure Access Permissions</h3>
                <p className="text-sm text-muted-foreground">
                    Define what each party can see. Permissions are hidden by default.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar / Tabs for Parties */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-muted/30 p-2 rounded-lg border">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Select Party</h4>
                        <div className="flex flex-col space-y-1">
                            {parties.map(party => (
                                <button
                                    key={party.id}
                                    onClick={() => setActivePartyId(party.id)}
                                    className={cn(
                                        "flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        activePartyId === party.id
                                            ? "bg-background shadow-sm text-primary"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <span className="truncate">{party.companyName}</span>
                                    {/* Status dot could be calculated based on having >0 rules */}
                                    <div className={cn(
                                        "h-2 w-2 rounded-full",
                                        (data.accessRules[party.id]?.filter(r => r.hasAccess).length || 0) > 0
                                            ? "bg-green-500"
                                            : "bg-slate-300"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Configuration Area */}
                <div className="flex-1">
                    {activePartyId && parties.find(p => p.id === activePartyId) && (
                        <PermissionConfigurator
                            party={parties.find(p => p.id === activePartyId)!}
                            rules={data.accessRules[activePartyId] || []}
                            onUpdateRule={(rId, access, time) => updateAccessRule(activePartyId, rId, access, time)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-component for the configuration logic to keep main clean
function PermissionConfigurator({
    party,
    rules,
    onUpdateRule
}: {
    party: InterestedParty;
    rules: AccessRule[];
    onUpdateRule: (resourceId: string, hasAccess: boolean, timeWindow?: TimeWindow) => void;
}) {

    // Check if 'ALL' global rule exists (we can simulate this by key 'ALL' or checking if all cats have rules)
    // For this module, let's keep it granular per category to be clearer

    return (
        <Card>
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{party.companyName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <span className="capitalize">{party.role.replace('_', ' ')}</span> • {party.contactName}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {/* Categories Loop */}
                    {Object.entries(DEFAULT_DOCUMENTS).map(([catKey, items]) => {
                        const catRule = rules.find(r => r.resourceId === catKey);
                        const isCatEnabled = catRule?.hasAccess || false;
                        const catTimeWindow = catRule?.timeWindow || "all_time";

                        // Check if any children are enabled for mixed state
                        const enabledChildrenCount = items.filter(item =>
                            rules.find(r => r.resourceId === item.id)?.hasAccess
                        ).length;

                        const isIndeterminate = enabledChildrenCount > 0 && enabledChildrenCount < items.length && !isCatEnabled;

                        return (
                            <div key={catKey} className="border rounded-lg overflow-hidden">
                                <div className="bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={isCatEnabled}
                                            onCheckedChange={(checked) => {
                                                // Toggle category
                                                onUpdateRule(catKey, checked);
                                                // Also toggle all children to match for UX convenience?
                                                // Let's decide: Yes, bulk toggle is expected.
                                                items.forEach(item => {
                                                    onUpdateRule(item.id, checked, catTimeWindow);
                                                });
                                                if (checked) {
                                                    toast.success(`Access enabled for all ${catKey} documents`);
                                                }
                                            }}
                                        />
                                        <div>
                                            <h4 className="font-semibold capitalize text-base">{catKey.replace('_', ' ')}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {items.length} document types available
                                            </p>
                                        </div>
                                    </div>

                                    {/* Global Time Window for Category */}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <Select
                                            value={catTimeWindow}
                                            onValueChange={(val: TimeWindow) => {
                                                onUpdateRule(catKey, isCatEnabled, val);
                                                // Cascade time setting to children if they have access
                                                items.forEach(item => {
                                                    const childRule = rules.find(r => r.resourceId === item.id);
                                                    if (childRule?.hasAccess) {
                                                        onUpdateRule(item.id, true, val);
                                                    }
                                                });
                                            }}
                                            disabled={!isCatEnabled}
                                        >
                                            <SelectTrigger className="w-[140px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all_time">All Time</SelectItem>
                                                <SelectItem value="current_year">Current Year</SelectItem>
                                                <SelectItem value="last_1_year">Last 1 Year</SelectItem>
                                                <SelectItem value="last_2_years">Last 2 Years</SelectItem>
                                                <SelectItem value="last_3_years">Last 3 Years</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className={cn("divide-y bg-card/50", !isCatEnabled ? "opacity-50 pointer-events-none grayscale-[0.5]" : "")}>
                                    {items.map(item => {
                                        const itemRule = rules.find(r => r.resourceId === item.id);
                                        const hasItemAccess = itemRule?.hasAccess ?? false; // individual override or inherited? 
                                        // Actually for this model, we'll store strict explicit rules.

                                        return (
                                            <div key={item.id} className="p-3 pl-12 flex items-center justify-between text-sm hover:bg-muted/20 transition-colors">
                                                <span className="font-medium">{item.label}</span>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs text-muted-foreground hidden sm:block">Visibility</Label>
                                                        <Switch
                                                            checked={hasItemAccess}
                                                            onCheckedChange={(checked) => onUpdateRule(item.id, checked, itemRule?.timeWindow || catTimeWindow)}
                                                            className="scale-90"
                                                        />
                                                    </div>
                                                    {/* Individual Time Override */}
                                                    {hasItemAccess && (
                                                        <Select
                                                            value={itemRule?.timeWindow || catTimeWindow}
                                                            onValueChange={(val: TimeWindow) => onUpdateRule(item.id, true, val)}
                                                        >
                                                            <SelectTrigger className="w-[130px] h-7 text-xs border-dashed">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all_time">All Time</SelectItem>
                                                                <SelectItem value="current_year">Current Year</SelectItem>
                                                                <SelectItem value="last_1_year">Last 1 Year</SelectItem>
                                                                <SelectItem value="last_2_years">Last 2 Years</SelectItem>
                                                                <SelectItem value="last_3_years">Last 3 Years</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
