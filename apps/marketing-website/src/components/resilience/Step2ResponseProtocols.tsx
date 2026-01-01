import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShieldAlert, Users, PauseCircle, PhoneOff, Shield, AlertTriangle, Info, Zap, CalendarClock, Lock, MessageSquare, Activity, UserCog, Siren, Volume2, Network, UserCheck, Briefcase, Building, FileText, Megaphone, Radio, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Step2Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step2ResponseProtocols({ data, onSave }: Step2Props) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Response Protocols
                </h3>
                <p className="text-sm text-muted-foreground">Define actions for different escalation tiers.</p>
            </div>

            <Tabs defaultValue="tier2" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="tier1">Tier 1: Planned</TabsTrigger>
                    <TabsTrigger value="tier2" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 border-b-2 border-transparent data-[state=active]:border-orange-500 rounded-none">Tier 2: Urgent</TabsTrigger>
                    <TabsTrigger value="tier3" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900 border-b-2 border-transparent data-[state=active]:border-red-500 rounded-none">Tier 3: Severe</TabsTrigger>
                    <TabsTrigger value="tier4" className="data-[state=active]:bg-slate-900 data-[state=active]:text-slate-50 border-b-2 border-transparent data-[state=active]:border-slate-500 rounded-none">Tier 4: Crisis</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {/* TIER 1: PLANNED */}
                    <TabsContent value="tier1" className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-xl border flex gap-3">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-sm">Routine Absence</h4>
                                <p className="text-xs text-muted-foreground">Planned vacations, conferences, or leave.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Immediate Protocol</Label>
                            <RadioGroup value={data.tier1Action} onValueChange={(v) => onSave({ ...data, tier1Action: v })} className="grid gap-3">
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier1Action === "delegate_authority" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="delegate_authority" id="t1-a1" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><UserCheck className="w-4 h-4 text-blue-500" /> Delegate to Deputy</div>
                                        <p className="text-xs text-muted-foreground">Formal handover to designated deputy.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier1Action === "remote_management" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="remote_management" id="t1-a2" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><Network className="w-4 h-4 text-green-500" /> Remote Management</div>
                                        <p className="text-xs text-muted-foreground">Maintain control remotely.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier1Action === "suspend_non_critical" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="suspend_non_critical" id="t1-a3" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><PauseCircle className="w-4 h-4 text-orange-500" /> Suspend Non-Critical</div>
                                        <p className="text-xs text-muted-foreground">Pause comprehensive reviews.</p>
                                    </div>
                                </Label>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Authority Scope</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["full_authority", "maintenance_only", "emergency_only"].map((scope) => (
                                    <div key={scope} onClick={() => onSave({ ...data, tier1Scope: scope })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier1Scope === scope ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {scope === 'full_authority' && "Full Authority"}
                                            {scope === 'maintenance_only' && "Maintenance Only"}
                                            {scope === 'emergency_only' && "Emergency Only"}
                                        </span>
                                        {data.tier1Scope === scope && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Communication Plan</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["auto_responder", "internal_memo", "client_notice"].map((comms) => (
                                    <div key={comms} onClick={() => onSave({ ...data, tier1Comms: comms })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier1Comms === comms ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {comms === 'auto_responder' && "Auto-Responder"}
                                            {comms === 'internal_memo' && "Internal Memo"}
                                            {comms === 'client_notice' && "Client Notice"}
                                        </span>
                                        {data.tier1Comms === comms && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* TIER 2: URGENT */}
                    <TabsContent value="tier2" className="space-y-6">
                        <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50 flex gap-3">
                            <PhoneOff className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-200">Unreachable for 48 Hours</h4>
                                <p className="text-xs text-orange-800/80 dark:text-orange-300/80">
                                    Urgent. Personal emergency. You cannot be contacted.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Immediate Protocol</Label>
                            <RadioGroup value={data.tier2Action} onValueChange={(v) => onSave({ ...data, tier2Action: v })} className="grid gap-3">
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier2Action === "activate_interim" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="activate_interim" id="t2-a1" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-primary" /> Activate Deputy</div>
                                        <p className="text-xs text-muted-foreground">Full authority transferred to {data.deputy || "Deputy"}.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier2Action === "hold_non_critical" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="hold_non_critical" id="t2-a2" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><PauseCircle className="w-4 h-4 text-orange-500" /> Hold Decisions</div>
                                        <p className="text-xs text-muted-foreground">Freeze operations. Wait for contact.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier2Action === "distribute_load" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="distribute_load" id="t2-a3" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Distribute Tasks</div>
                                        <p className="text-xs text-muted-foreground">Split responsibilities across team.</p>
                                    </div>
                                </Label>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Spending Authority</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["emergency", "full_ktlo", "frozen"].map((scope) => (
                                    <div key={scope} onClick={() => onSave({ ...data, tier2Scope: scope })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier2Scope === scope ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {scope === 'emergency' && "Emergency Only"}
                                            {scope === 'full_ktlo' && "Full Budget"}
                                            {scope === 'frozen' && "Frozen"}
                                        </span>
                                        {data.tier2Scope === scope && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Communication Plan</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["notify_leadership", "notify_team", "total_silence"].map((comms) => (
                                    <div key={comms} onClick={() => onSave({ ...data, tier2Comms: comms })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier2Comms === comms ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {comms === 'notify_leadership' && "Notify Leadership"}
                                            {comms === 'notify_team' && "Notify Team"}
                                            {comms === 'total_silence' && "Total Silence"}
                                        </span>
                                        {data.tier2Comms === comms && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* TIER 3: SEVERE */}
                    <TabsContent value="tier3" className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-xl border border-red-100 dark:border-red-900/50 flex gap-3">
                            <Zap className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-sm text-red-900 dark:text-red-200">Incapacitation (30+ Days)</h4>
                                <p className="text-xs text-red-800/80 dark:text-red-300/80">Severe. Hospitalization or long-term inability to perform duties.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Immediate Protocol</Label>
                            <RadioGroup value={data.tier3Action} onValueChange={(v) => onSave({ ...data, tier3Action: v })} className="grid gap-3">
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier3Action === "appoint_interim" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="appoint_interim" id="t3-a1" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><UserCog className="w-4 h-4 text-purple-500" /> Appoint Interim</div>
                                        <p className="text-xs text-muted-foreground">Board appoints temporary replacement.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier3Action === "board_intervention" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="board_intervention" id="t3-a2" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><Building className="w-4 h-4 text-blue-500" /> Board Intervention</div>
                                        <p className="text-xs text-muted-foreground">Board takes direct control.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier3Action === "activate_committee" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="activate_committee" id="t3-a3" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-orange-500" /> Activate Committee</div>
                                        <p className="text-xs text-muted-foreground">Form executive committee.</p>
                                    </div>
                                </Label>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Authority Scope</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["full_transfer", "restricted_authority", "dual_control"].map((scope) => (
                                    <div key={scope} onClick={() => onSave({ ...data, tier3Scope: scope })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier3Scope === scope ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {scope === 'full_transfer' && "Full Transfer"}
                                            {scope === 'restricted_authority' && "Restricted"}
                                            {scope === 'dual_control' && "Dual Control"}
                                        </span>
                                        {data.tier3Scope === scope && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Communication Plan</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["stakeholder_briefing", "town_hall", "public_release"].map((comms) => (
                                    <div key={comms} onClick={() => onSave({ ...data, tier3Comms: comms })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier3Comms === comms ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {comms === 'stakeholder_briefing' && "Stakeholders"}
                                            {comms === 'town_hall' && "Town Hall"}
                                            {comms === 'public_release' && "Public Release"}
                                        </span>
                                        {data.tier3Comms === comms && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* TIER 4: CRISIS */}
                    <TabsContent value="tier4" className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex gap-3 text-slate-100">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-sm">Permanent Loss</h4>
                                <p className="text-xs text-slate-400">Death or Permanent Disability. Requires full succession execution.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Immediate Protocol</Label>
                            <RadioGroup value={data.tier4Action} onValueChange={(v) => onSave({ ...data, tier4Action: v })} className="grid gap-3">
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier4Action === "execute_succession" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="execute_succession" id="t4-a1" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4 text-red-600" /> Execute Succession</div>
                                        <p className="text-xs text-muted-foreground">Formally install successor.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier4Action === "search_committee" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="search_committee" id="t4-a2" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-blue-500" /> Search Committee</div>
                                        <p className="text-xs text-muted-foreground">Initiate external search.</p>
                                    </div>
                                </Label>
                                <Label className={cn("flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50", data.tier4Action === "interim_leadership" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted")}>
                                    <RadioGroupItem value="interim_leadership" id="t4-a3" />
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2"><Siren className="w-4 h-4 text-orange-500" /> Interim Leadership</div>
                                        <p className="text-xs text-muted-foreground">Temporary stabilization.</p>
                                    </div>
                                </Label>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Authority Scope</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["board_control", "probate_process", "full_transition"].map((scope) => (
                                    <div key={scope} onClick={() => onSave({ ...data, tier4Scope: scope })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier4Scope === scope ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {scope === 'board_control' && "Board Control"}
                                            {scope === 'probate_process' && "Probate"}
                                            {scope === 'full_transition' && "Transition"}
                                        </span>
                                        {data.tier4Scope === scope && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Communication Plan</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {["global_announcement", "investor_call", "public_statement"].map((comms) => (
                                    <div key={comms} onClick={() => onSave({ ...data, tier4Comms: comms })} className={cn("p-3 rounded-lg border text-sm font-medium cursor-pointer text-center flex flex-col items-center justify-center gap-2 h-20 transition-all", data.tier4Comms === comms ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted hover:bg-muted/50")}>
                                        <span>
                                            {comms === 'global_announcement' && "Global Announce"}
                                            {comms === 'investor_call' && "Investor Call"}
                                            {comms === 'public_statement' && "Public Statement"}
                                        </span>
                                        {data.tier4Comms === comms && <Badge variant="secondary" className="h-4 text-[9px] px-1">Active</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
