"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createOrUpdateLegalEntity, getLegalEntity } from "@/actions/legal-vault";
import { AttorneyManager } from "./AttorneyManager";

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
function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface Step3Props {
    entityId: string | null;
    onSave: (id: string) => void;
}

export function Step3FormationDetails({ entityId, onSave }: Step3Props) {
    // Org Type State
    const [orgType, setOrgType] = useState<string>("");
    const [formationInProgress, setFormationInProgress] = useState(false);
    const [nonprofitType, setNonprofitType] = useState<string>("");

    // Formation Details State
    const [formationDate, setFormationDate] = useState<Date>();
    const [formationState, setFormationState] = useState<string>("");

    // Business Purpose State
    const [purpose, setPurpose] = useState<string>("");
    const [naicsCode, setNaicsCode] = useState<string>("");
    const [skipBusinessPurpose, setSkipBusinessPurpose] = useState<boolean>(false);

    // Registered Agent State (Moved from old Step 3)
    const [agentName, setAgentName] = useState("");
    const [agentPhone, setAgentPhone] = useState("");
    const [agentEmail, setAgentEmail] = useState("");
    const [agentWebsite, setAgentWebsite] = useState("");

    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        let mounted = true;
        async function loadData() {
            const data = await getLegalEntity();
            if (!mounted) return;

            if (data) {
                if (data.organization_type) setOrgType(data.organization_type);
                if (data.formation_in_progress) setFormationInProgress(data.formation_in_progress);
                if (data.nonprofit_type) setNonprofitType(data.nonprofit_type);
                if (data.formation_date) setFormationDate(new Date(data.formation_date));
                if (data.primary_state) setFormationState(data.primary_state);
                if (data.business_purpose) setPurpose(data.business_purpose);
                if (data.naics_code) setNaicsCode(data.naics_code);
                if (data.skip_business_purpose) setSkipBusinessPurpose(!!data.skip_business_purpose);
                if (data.registered_agent_name) setAgentName(data.registered_agent_name);
                if (data.registered_agent_phone) setAgentPhone(data.registered_agent_phone);
                if (data.registered_agent_email) setAgentEmail(data.registered_agent_email);
                if (data.registered_agent_website) setAgentWebsite(data.registered_agent_website);

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

    // Auto-Save Effect
    useEffect(() => {
        if (!isLoaded || !entityId) return;

        const timeoutId = setTimeout(async () => {
            try {
                await createOrUpdateLegalEntity({
                    id: entityId,
                    organization_type: orgType,
                    formation_in_progress: formationInProgress,
                    nonprofit_type: orgType === 'Nonprofit' ? nonprofitType : undefined,
                    formation_date: formationDate,
                    primary_state: formationState,
                    business_purpose: purpose,
                    naics_code: naicsCode,
                    skip_business_purpose: skipBusinessPurpose,
                    registered_agent_name: agentName,
                    registered_agent_phone: agentPhone,
                    registered_agent_email: agentEmail,
                    registered_agent_website: agentWebsite,
                });
                if (entityId) onSave(entityId);
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [orgType, formationInProgress, nonprofitType, formationDate, formationState, purpose, naicsCode, skipBusinessPurpose, agentName, agentPhone, agentEmail, agentWebsite, entityId, isLoaded]); // onSave excluded from deps to avoid loop

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
                                    checked={formationInProgress}
                                    onCheckedChange={setFormationInProgress}
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
                            {formationInProgress && (
                                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 h-5 px-2 text-[10px]">
                                    IN PROGRESS
                                </Badge>
                            )}
                        </div>
                    </div>

                    <Select value={orgType} onValueChange={setOrgType}>
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

                    {orgType === "Nonprofit" && (
                        <div className="pl-4 border-l-2 border-muted animate-in fade-in slide-in-from-left-2">
                            <Label htmlFor="nonprofit-type" className="text-sm">Nonprofit Classification</Label>
                            <Select value={nonprofitType} onValueChange={setNonprofitType}>
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
                {orgType && (
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
                                                !formationDate && "text-muted-foreground"
                                            )}
                                        >
                                            {formationDate ? (
                                                format(formationDate, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formationDate}
                                            onSelect={setFormationDate}
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
                                <Select value={formationState} onValueChange={setFormationState}>
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
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
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
                                                skipBusinessPurpose && "pointer-events-none opacity-50"
                                            )}
                                        >
                                            Find your code <ArrowRight className="w-3 h-3" />
                                        </a>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="skip-purpose"
                                                checked={skipBusinessPurpose}
                                                onCheckedChange={setSkipBusinessPurpose}
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
                                    value={naicsCode}
                                    onChange={(e) => setNaicsCode(e.target.value)}
                                    disabled={skipBusinessPurpose}
                                />
                            </div>
                        </div>

                        {/* Registered Agent - Only show for types that require it */}
                        {["LLC", "C-Corp", "S-Corp", "Nonprofit", "Public Benefit Corporation"].includes(orgType) && (
                            <div className="pt-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-medium mb-4">Registered Agent</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="agent-name">Agent Name / Service</Label>
                                        <Input
                                            id="agent-name"
                                            placeholder="e.g. Northwest Registered Agent"
                                            value={agentName}
                                            onChange={(e) => setAgentName(e.target.value)}
                                        />
                                    </div>

                                    {/* Show contact fields when agent name is filled */}
                                    {agentName && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 border-l-2 border-muted animate-in fade-in slide-in-from-left-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-phone">Phone</Label>
                                                <Input
                                                    id="agent-phone"
                                                    type="tel"
                                                    placeholder="(555) 123-4567"
                                                    value={agentPhone}
                                                    onChange={(e) => setAgentPhone(formatPhone(e.target.value))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-email">Email</Label>
                                                <Input
                                                    id="agent-email"
                                                    type="email"
                                                    placeholder="agent@example.com"
                                                    value={agentEmail}
                                                    onChange={(e) => setAgentEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-website">Website</Label>
                                                <Input
                                                    id="agent-website"
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    value={agentWebsite}
                                                    onChange={(e) => setAgentWebsite(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Attorney Section */}
                        {entityId && (
                            <div className="pt-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">Attorneys</h3>
                                    <p className="text-xs text-muted-foreground">Add your legal counsel</p>
                                </div>
                                <AttorneyManager
                                    entityId={entityId}
                                    onUpdate={() => onSave(entityId)}
                                />
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
