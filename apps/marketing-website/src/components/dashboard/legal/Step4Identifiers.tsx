"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Info, ExternalLink, Loader2 } from "lucide-react";
import { createOrUpdateLegalEntity, getLegalEntity } from "@/actions/legal-vault";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Step4Props {
    entityId: string | null;
    onSave: (id: string) => void;
}

export function Step4Identifiers({ entityId, onSave }: Step4Props) {
    const [ein, setEin] = useState("");
    const [stateTaxId, setStateTaxId] = useState("");
    const [stateTaxIdStatus, setStateTaxIdStatus] = useState("to_do"); // 'to_do', 'in_progress', 'completed', 'not_needed'
    const [dunsNumber, setDunsNumber] = useState("");

    const [isLoaded, setIsLoaded] = useState(false);

    // Load Data
    useEffect(() => {
        let mounted = true;
        async function loadData() {
            const data = await getLegalEntity();
            if (!mounted) return;

            if (data) {
                if (data.ein) setEin(data.ein);
                if (data.state_tax_id) setStateTaxId(data.state_tax_id);
                if (data.state_tax_id_status) setStateTaxIdStatus(data.state_tax_id_status);
                if (data.duns_number) setDunsNumber(data.duns_number);

                // Only call onSave if we don't already have an entityId (first load)
                if (data.id && !entityId) {
                    onSave(data.id);
                }
            }
            setIsLoaded(true);
        }
        loadData();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-Save
    useEffect(() => {
        if (!isLoaded || !entityId) return;

        const timeoutId = setTimeout(async () => {
            try {
                await createOrUpdateLegalEntity({
                    id: entityId,
                    ein,
                    state_tax_id: stateTaxId,
                    state_tax_id_status: stateTaxIdStatus,
                    duns_number: dunsNumber
                });
                if (entityId) onSave(entityId);
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [ein, stateTaxId, stateTaxIdStatus, dunsNumber, entityId, isLoaded]); // onSave excluded from deps


    return (
        <div className="space-y-6 max-w-2xl">
            <div className="grid gap-8">

                {/* EIN */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="ein">Employer Identification Number (EIN)</Label>
                        <a href="https://sa.www4.irs.gov/modiein/individual/index.jsp" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                            Get EIN from IRS <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                    <Input
                        id="ein"
                        placeholder="XX-XXXXXXX"
                        value={ein}
                        onChange={(e) => setEin(e.target.value)}
                    />
                </div>

                {/* State Tax ID */}
                <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="state-tax" className="text-base font-semibold">State Tax ID / Withholding</Label>
                            {/* Status Switch Pill */}
                            <ToggleGroup type="single" value={stateTaxIdStatus} onValueChange={(val) => val && setStateTaxIdStatus(val)}>
                                <ToggleGroupItem value="to_do" size="sm" className="text-xs data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-800 border-transparent">To Do</ToggleGroupItem>
                                <ToggleGroupItem value="in_progress" size="sm" className="text-xs data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 border-transparent">In Progress</ToggleGroupItem>
                                <ToggleGroupItem value="completed" size="sm" className="text-xs data-[state=on]:bg-green-100 data-[state=on]:text-green-800 border-transparent">Completed</ToggleGroupItem>
                                <ToggleGroupItem value="not_needed" size="sm" className="text-xs data-[state=on]:bg-gray-100 data-[state=on]:text-gray-800 border-transparent">Not Needed</ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {stateTaxIdStatus !== 'not_needed' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="state-tax" className="text-sm text-muted-foreground mb-1.5 block">Tax ID Number</Label>
                                <Input
                                    id="state-tax"
                                    placeholder="Enter your State Tax ID"
                                    value={stateTaxId}
                                    onChange={(e) => setStateTaxId(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* DUNS */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="duns">DUNS Number (Optional)</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-xs">
                                            The Data Universal Numbering System (DUNS) is a unique 9-digit identifier for businesses, often required for government contracts and grants.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <a href="https://www.dnb.com/duns-number/get-a-duns.html" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                            Get DUNS Number <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                    <Input
                        id="duns"
                        placeholder="Data Universal Numbering System"
                        value={dunsNumber}
                        onChange={(e) => setDunsNumber(e.target.value)}
                    />
                </div>

                <div className="pt-4 border-t">
                    <Label className="block mb-4">Business Licenses</Label>
                    <div className="border border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center gap-2 bg-muted/10">
                        <p className="text-sm text-muted-foreground">Add and track your business licenses here.</p>
                        <Button variant="outline" size="sm" className="mt-2">
                            <Plus className="w-4 h-4 mr-2" />
                            Add License
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
