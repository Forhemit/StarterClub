import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn, formatPhone } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AttorneyManager } from "./AttorneyManager";
import { LegalVaultData } from "./types";

// US States for formation state
const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
];

const NONPROFIT_TYPES = [
    { value: "501c3", label: "501(c)(3) - Charitable" },
    { value: "501c4", label: "501(c)(4) - Social Welfare" },
    { value: "501c6", label: "501(c)(6) - Business Leagues" },
    { value: "501c19", label: "501(c)(19) - Veterans' Organizations" },
    { value: "other-nonprofit", label: "Other Non-Profit Type" },
];

// Phone formatting function: (###) ###-####


interface Step3Props {
    data: LegalVaultData;
    onUpdate: (data: Partial<LegalVaultData>) => void;
}

export function Step3FormationDetails({ data, onUpdate }: Step3Props) {
    const {
        organization_type,
        formation_in_progress,
        nonprofit_type,
        formation_date,
        primary_state,
        business_purpose,
        naics_code,
        skip_business_purpose,
        registered_agent_name,
        registered_agent_phone,
        registered_agent_email,
        registered_agent_website,
        attorneys = []
    } = data;

    const handleAttorneySave = (updatedAttorney: any) => {
        // If ID exists and is in the list, update it
        // If ID exists but not in list (shouldn't happen for update), append? 
        // If new attorney (from "Add"), it might have a temp ID or we assign one.
        // AttorneyManager assigns temp ID 'crypto.randomUUID()' for new ones.

        const existingIndex = attorneys.findIndex(a => a.id === updatedAttorney.id);

        if (existingIndex >= 0) {
            // Update existing
            const updatedAttorneys = [...attorneys];
            updatedAttorneys[existingIndex] = updatedAttorney;
            onUpdate({ attorneys: updatedAttorneys as any });
        } else {
            // Add new
            const newAttorney = { ...updatedAttorney, id: updatedAttorney.id || crypto.randomUUID() };
            onUpdate({ attorneys: [...attorneys, newAttorney] as any });
        }
    };

    const handleAttorneyDelete = (id: string) => {
        const updatedAttorneys = attorneys.filter(a => a.id !== id);
        onUpdate({ attorneys: updatedAttorneys as any });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="grid gap-6">

                {/* Organization Type */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="org-type">Organization Type</Label>
                        {/* Formation In Progress Toggle */}
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="formation-in-progress"
                                    checked={formation_in_progress}
                                    onCheckedChange={(val) => onUpdate({ formation_in_progress: val })}
                                    className="scale-75 origin-right"
                                />
                                <Label htmlFor="formation-in-progress" className="text-xs font-normal text-muted-foreground cursor-pointer">
                                    Formation In Progress
                                </Label>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-xs">Enable this if you haven&apos;t completed the official registration process yet.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {formation_in_progress && (
                                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 h-5 px-2 text-[10px]">
                                    IN PROGRESS
                                </Badge>
                            )}
                        </div>
                    </div>

                    <Select value={organization_type} onValueChange={(val) => onUpdate({ organization_type: val })}>
                        <SelectTrigger id="org-type">
                            <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                            <SelectItem value="C-Corp">C-Corporation</SelectItem>
                            <SelectItem value="S-Corp">S-Corporation</SelectItem>
                            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="Nonprofit">Nonprofit</SelectItem>
                            <SelectItem value="Public Benefit Corporation">Public Benefit Corporation (PBC)</SelectItem>
                        </SelectContent>
                    </Select>

                    {organization_type === "Nonprofit" && (
                        <div className="pl-4 border-l-2 border-muted animate-in fade-in slide-in-from-left-2">
                            <Label htmlFor="nonprofit-type" className="text-sm">Nonprofit Classification</Label>
                            <Select value={nonprofit_type} onValueChange={(val) => onUpdate({ nonprofit_type: val })}>
                                <SelectTrigger id="nonprofit-type" className="mt-2">
                                    <SelectValue placeholder="Select classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    {NONPROFIT_TYPES.map(t => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Formation Details */}
                {organization_type && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label>Date of Formation</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !formation_date && "text-muted-foreground"
                                            )}
                                        >
                                            {formation_date ? (
                                                format(new Date(formation_date), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formation_date ? new Date(formation_date) : undefined}
                                            onSelect={(date) => onUpdate({ formation_date: date ? format(date, "yyyy-MM-dd") : undefined })}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State of Formation</Label>
                                <Select value={primary_state} onValueChange={(val) => onUpdate({ primary_state: val })}>
                                    <SelectTrigger id="state">
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {US_STATES.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Business Purpose & NAICS */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="purpose">Business Purpose</Label>
                                </div>

                                <textarea
                                    id="purpose"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Describe your primary business activities..."
                                    value={business_purpose || ""}
                                    onChange={(e) => onUpdate({ business_purpose: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="naics-code">NAICS Code</Label>
                                    <div className="flex items-center gap-4">
                                        <a
                                            href="https://www.naics.com/search/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn(
                                                "text-xs text-primary hover:underline flex items-center gap-1",
                                                skip_business_purpose && "pointer-events-none opacity-50"
                                            )}
                                        >
                                            Find your code <ArrowRight className="w-3 h-3" />
                                        </a>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="skip-purpose"
                                                checked={skip_business_purpose}
                                                onCheckedChange={(val) => onUpdate({ skip_business_purpose: val })}
                                                className="scale-75 origin-right"
                                            />
                                            <Label htmlFor="skip-purpose" className="text-xs font-normal text-muted-foreground cursor-pointer">
                                                Skip for now
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                                <Input
                                    id="naics-code"
                                    placeholder="e.g. 541511"
                                    value={naics_code || ""}
                                    onChange={(e) => onUpdate({ naics_code: e.target.value })}
                                    disabled={skip_business_purpose}
                                />
                            </div>
                        </div>

                        {/* Registered Agent */}
                        {["LLC", "C-Corp", "S-Corp", "Nonprofit", "Public Benefit Corporation"].includes(organization_type) && (
                            <div className="pt-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-medium mb-4">Registered Agent</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="agent-name">Agent Name / Service</Label>
                                        <Input
                                            id="agent-name"
                                            placeholder="e.g. Northwest Registered Agent"
                                            value={registered_agent_name || ""}
                                            onChange={(e) => onUpdate({ registered_agent_name: e.target.value })}
                                        />
                                    </div>

                                    {registered_agent_name && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 border-l-2 border-muted animate-in fade-in slide-in-from-left-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-phone">Phone</Label>
                                                <Input
                                                    id="agent-phone"
                                                    type="tel"
                                                    placeholder="(555) 123-4567"
                                                    value={registered_agent_phone || ""}
                                                    onChange={(e) => onUpdate({ registered_agent_phone: formatPhone(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-email">Email</Label>
                                                <Input
                                                    id="agent-email"
                                                    type="email"
                                                    placeholder="agent@example.com"
                                                    value={registered_agent_email || ""}
                                                    onChange={(e) => onUpdate({ registered_agent_email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-website">Website</Label>
                                                <Input
                                                    id="agent-website"
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    value={registered_agent_website || ""}
                                                    onChange={(e) => onUpdate({ registered_agent_website: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Attorney Section */}
                        <div className="pt-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Attorneys</h3>
                                <p className="text-xs text-muted-foreground">Add your legal counsel</p>
                            </div>
                            <AttorneyManager
                                // We need to refactor AttorneyManager to accept local save too.
                                // For now we assume we will fix it.
                                attorneys={attorneys}
                                onLocalSave={handleAttorneySave}
                                onLocalDelete={handleAttorneyDelete}
                                entityId={data.id || "temp"}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
