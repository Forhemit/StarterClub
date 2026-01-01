"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Check, X, Shield, BookOpen, Mic, Printer, DollarSign, FileSignature, AlertTriangle, Activity, Loader2, FileText, Target, ArrowDownCircle, ArrowUpCircle, Users, Lock } from "lucide-react";
import { getLeadershipProfile } from "@/actions/resilience";

interface LeadershipPreviewProps {
    profileId?: string | null;
    lastUpdated?: number;
    className?: string;
    // Keep legacy prop for backward compatibility during transition
    data?: any;
}

export function LeadershipPreview({ profileId, lastUpdated, className, data: legacyData }: LeadershipPreviewProps) {
    const [data, setData] = useState<any>(legacyData || null);
    const [loading, setLoading] = useState(false);

    // Fetch data from database when profileId/lastUpdated changes
    useEffect(() => {
        // If legacy data prop is provided, use it (backward compat)
        if (legacyData) {
            setData(legacyData);
            return;
        }

        async function load() {
            setLoading(true);
            try {
                const profileData = await getLeadershipProfile();
                if (profileData) {
                    setData(profileData);
                }
            } catch (error) {
                console.error("Failed to load leadership profile", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [profileId, lastUpdated, legacyData]);

    const isReady = data?.role && data?.incumbent && data?.deputy;

    // Calculate Bus Factor based on lowest rating in items or default
    const getOverallBusFactor = () => {
        if (!data?.knowledgeItems || data.knowledgeItems.length === 0) return "unknown";
        if (data.knowledgeItems.some((i: any) => i.busFactor === "critical")) return "critical";
        if (data.knowledgeItems.some((i: any) => i.busFactor === "high")) return "high";
        return "medium";
    };

    const busFactor = getOverallBusFactor();
    const overallBusFactor = busFactor === 'critical' ? 'CRIT' : busFactor === 'high' ? 'HIGH' : busFactor === 'medium' ? 'MED' : 'OK';

    const BoolIcon = ({ val }: { val: boolean }) => (
        val ? <Check className="w-3.5 h-3.5 text-green-600 print:text-black" /> : <X className="w-3.5 h-3.5 text-muted-foreground/30 print:text-gray-300" />
    );

    const formatCurrency = (val: string | number) => {
        if (!val) return "$0";
        const clean = String(val).replace(/[^0-9.]/g, "");
        const num = parseFloat(clean);
        if (isNaN(num)) return String(val);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);
    };

    const formatDuration = (val: string) => {
        if (!val) return "---";
        if (val === "indefinite") return "Indefinite";
        return `${val} Days`;
    };

    const formatProtocol = (val: string) => {
        if (!val) return "---";
        return val.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatThreshold = (min: number, max: number | null) => {
        if (min === 0 && max === null) return "Any amount";
        if (min === 0) return `Up to $${max?.toLocaleString()}`;
        if (max === null) return `$${min.toLocaleString()}+`;
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    const handlePrint = () => {
        const printContent = document.getElementById('leadership-printable-content');
        if (!printContent) return;

        const printWindow = window.open('', '_blank', 'width=800,height=800');
        if (!printWindow) {
            alert('Please allow popups for this site to print.');
            return;
        }

        const roleTitle = data?.role || 'Leadership Role';

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Succession Profile - ${roleTitle}</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                        color: #1a1a1a;
                        font-size: 14px;
                        line-height: 1.6;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .document-title {
                        text-align: center;
                        font-size: 20px;
                        font-weight: 400;
                        letter-spacing: 0.2em;
                        text-transform: uppercase;
                        color: #09090b;
                        margin-bottom: 24px;
                        padding-bottom: 16px;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    h1 { 
                        font-size: 20px;
                        font-weight: 400;
                        letter-spacing: 0.2em;
                        text-transform: uppercase;
                        text-align: center;
                        margin-bottom: 24px;
                        padding-bottom: 16px;
                        border-bottom: 1px solid #e5e7eb;
                        color: #09090b;
                    }
                    h2 { font-size: 24px; margin-bottom: 8px; }
                    h3 { 
                        font-size: 16px; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 4px; 
                        margin-top: 24px;
                        page-break-after: avoid;
                    }
                    .section {
                        page-break-inside: avoid;
                        margin-bottom: 20px;
                    }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                    .badge { 
                        display: inline-block; 
                        padding: 2px 8px; 
                        border-radius: 12px; 
                        font-size: 11px; 
                        font-weight: 600;
                    }
                    .card { 
                        border: 1px solid #e5e5e5; 
                        border-radius: 8px; 
                        padding: 16px;
                        page-break-inside: avoid;
                    }
                    .label { color: #666; font-size: 12px; }
                    .value { font-weight: 500; }
                    .mono { font-family: monospace; }
                    .text-xs { font-size: 11px; }
                    .text-sm { font-size: 13px; }
                    .text-muted-foreground { color: #666; }
                    .font-bold { font-weight: 700; }
                    .font-semibold { font-weight: 600; }
                    .font-medium { font-weight: 500; }
                    .uppercase { text-transform: uppercase; }
                    .border { border: 1px solid #e5e7eb; }
                    .rounded { border-radius: 6px; }
                    .p-2 { padding: 8px; }
                    .p-3 { padding: 12px; }
                    .p-4 { padding: 16px; }
                    @media print {
                        body { padding: 20px; }
                        .section { page-break-inside: avoid; }
                        h3 { page-break-after: avoid; }
                    }
                </style>
            </head>
            <body>
                 <div class="document-title">LEADERSHIP SUCCESSION PROFILE</div>
                 <div class="content">${printContent.innerHTML}</div>
                 <script>
                    const icons = document.querySelectorAll('.lucide');
                    icons.forEach(i => i.style.display = 'none');
                 </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const isBlank = !data || !data.role;

    return (
        <div className={`bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${className || ''}`}>
            {/* Header Bar - Matching Legal Vault pattern */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <span className="font-semibold text-sm">Role Profile Preview</span>
                <div className="flex gap-2 items-center">
                    {isReady ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Ready</Badge>
                    ) : (
                        <Badge variant="outline">Draft</Badge>
                    )}
                    <Button size="sm" variant="outline" onClick={handlePrint} className="h-8" disabled={isBlank}>
                        <Printer className="w-3.5 h-3.5 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : isBlank ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-white/50 h-full">
                        <div className="bg-muted w-16 h-20 mb-4 rounded border flex items-center justify-center">
                            <div className="space-y-2 w-10">
                                <div className="h-1 bg-muted-foreground/20 rounded w-full"></div>
                                <div className="h-1 bg-muted-foreground/20 rounded w-2/3"></div>
                                <div className="h-1 bg-muted-foreground/20 rounded w-3/4"></div>
                            </div>
                        </div>
                        <p className="font-medium text-foreground">Blank Form</p>
                        <p className="text-sm mt-1">Start by defining the role to generate a preview.</p>
                    </div>
                ) : (
                    <CardContent className="p-0 space-y-8" id="leadership-printable-content">
                        {/* Document Title - Matching Legal Vault */}
                        <div className="text-center pb-4 border-b mb-6">
                            <h1 className="text-xl font-normal tracking-[0.2em] text-foreground uppercase">LEADERSHIP SUCCESSION PROFILE</h1>
                        </div>

                        {/* Header Section */}
                        <div className="section flex flex-row justify-between items-start border-b pb-6">
                            <div className="text-left">
                                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-1">{data.role || "Untitled Role"}</h2>
                                <p className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">
                                    Incumbent: {data.incumbent || "---"}
                                </p>
                            </div>
                            <div className="text-right space-y-1">
                                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${overallBusFactor === 'CRIT' ? 'bg-red-100 text-red-800 border-red-300' :
                                    overallBusFactor === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                                        'bg-green-100 text-green-800 border-green-300'
                                    }`}>
                                    Bus Factor: {overallBusFactor}
                                </div>
                            </div>
                        </div>

                        {/* Core Role Data Grid */}
                        <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg border">
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Primary Successor (Title)</div>
                                <div className="font-medium">
                                    {data.deputy || "Not Assigned"}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Backup Successor</div>
                                <div className="font-medium">
                                    {data.backupDeputy || "Not Assigned"}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Alternate Backup</div>
                                <div className="font-medium text-muted-foreground">
                                    {data.alternateBackup || "---"}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Auth Duration</div>
                                <div className="font-medium">{formatDuration(data.interimDays)}</div>
                            </div>
                        </div>

                        {/* 2. Response Protocols */}
                        <div className="section space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Response Protocols
                            </h3>

                            <div className="space-y-3">
                                <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 text-[10px] uppercase text-muted-foreground font-semibold border-b pb-2">
                                    <div>Tier Level</div>
                                    <div>Immediate Action</div>
                                    <div>Authority Scope</div>
                                </div>

                                {/* Tier 1 */}
                                <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 text-xs py-2 border-b border-dashed">
                                    <div>
                                        <div className="font-medium text-blue-700/80">Tier 1 (Planned)</div>
                                        <div className="text-[10px] text-muted-foreground">Routine Absense</div>
                                    </div>
                                    <div>{formatProtocol(data.tier1Action)}</div>
                                    <div>{formatProtocol(data.tier1Scope)}</div>
                                </div>
                                {/* Tier 2 */}
                                <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 text-xs py-2 border-b border-dashed">
                                    <div>
                                        <div className="font-medium text-amber-700/80">Tier 2 (Urgent)</div>
                                        <div className="text-[10px] text-muted-foreground">Unreachable 48h</div>
                                    </div>
                                    <div>{formatProtocol(data.tier2Action)}</div>
                                    <div>{formatProtocol(data.tier2Scope)}</div>
                                </div>
                                {/* Tier 3 */}
                                <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 text-xs py-2 border-b border-dashed">
                                    <div>
                                        <div className="font-medium text-orange-700/80">Tier 3 (Severe)</div>
                                        <div className="text-[10px] text-muted-foreground">Incapacitation</div>
                                    </div>
                                    <div>{formatProtocol(data.tier3Action)}</div>
                                    <div>{formatProtocol(data.tier3Scope)}</div>
                                </div>
                                {/* Tier 4 */}
                                <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 text-xs py-2">
                                    <div>
                                        <div className="font-medium text-red-700">Tier 4 (Crisis)</div>
                                        <div className="text-[10px] text-muted-foreground">Permanent Loss</div>
                                    </div>
                                    <div className="font-medium text-red-800">{formatProtocol(data.tier4Action)}</div>
                                    <div className="space-y-1">
                                        <div className="font-medium text-red-800">{formatProtocol(data.tier4Scope)}</div>
                                        {data.tier4Scope === "dual_control" && (
                                            <div className="text-[10px] text-red-600 bg-red-50 p-1 rounded border border-red-100 mt-1">
                                                <div className="font-semibold mb-0.5">Joint Authority:</div>
                                                <div className="grid grid-cols-2 gap-1">
                                                    <span>1. {data.tier4DualControl1 ? formatProtocol(data.tier4DualControl1) : "---"}</span>
                                                    <span>2. {data.tier4DualControl2 ? formatProtocol(data.tier4DualControl2) : "---"}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Communication Strategy */}
                        <div className="section space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                <Mic className="w-4 h-4" /> Communication Plan
                            </h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-xs">
                                <div className="flex justify-between border-b border-dashed pb-1">
                                    <span className="text-muted-foreground">Tier 1 (Routine)</span>
                                    <span className="font-medium">{formatProtocol(data.tier1Comms)}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed pb-1">
                                    <span className="text-muted-foreground">Tier 2 (Urgent)</span>
                                    <span className="font-medium">{formatProtocol(data.tier2Comms)}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed pb-1">
                                    <span className="text-muted-foreground">Tier 3 (Severe)</span>
                                    <span className="font-medium">{formatProtocol(data.tier3Comms)}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed pb-1">
                                    <span className="text-red-700/80 font-medium">Tier 4 (Crisis)</span>
                                    <span className="font-medium text-red-800">{formatProtocol(data.tier4Comms)}</span>
                                </div>
                            </div>
                        </div>


                        {/* 4. Authority Matrix */}
                        <div className="section space-y-4 break-inside-avoid">
                            <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                <FileSignature className="w-4 h-4" /> Authority Matrix
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Spending Limits */}
                                <div className="p-4 rounded-lg border bg-card">
                                    <div className="flex items-center gap-2 mb-3">
                                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">Financial Limits</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-xs text-muted-foreground">OpEx Limit</span>
                                            <span className="font-mono font-medium">{formatCurrency(data.opexLimit)}</span>
                                        </div>
                                        {data.opexLimit && (
                                            <div className="flex justify-between items-baseline border-t border-dashed pt-1 mt-1">
                                                <span className="text-[10px] text-muted-foreground">Requires Approval</span>
                                                <span className="text-[10px] font-medium text-amber-700">
                                                    {data.opexExcessApprover ? formatProtocol(data.opexExcessApprover) : "---"}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-baseline mt-4">
                                            <span className="text-xs text-muted-foreground">CapEx Limit</span>
                                            <span className="font-mono font-medium">{formatCurrency(data.capexLimit)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Signing Permissions */}
                                <div className="p-4 rounded-lg border bg-card">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileSignature className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">Evaluated Privileges</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-2"><BoolIcon val={data.canSignNDAs} /> NDAs</div>
                                        <div className="flex items-center gap-2"><BoolIcon val={data.canSignVendor} /> Vendor</div>
                                        <div className="flex items-center gap-2"><BoolIcon val={data.canSignEmployment} /> Hiring</div>
                                        <div className="flex items-center gap-2"><BoolIcon val={data.canSignChecks} /> Checks</div>
                                    </div>
                                    {data.requiresDualControl && (
                                        <div className="mt-3 text-[10px] bg-amber-50 text-amber-800 p-1.5 rounded border border-amber-200 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Requires Dual Control
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 5. Two-Person Integrity Configuration */}
                        <div className="section space-y-4 break-inside-avoid">
                            <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Two-Person Integrity (2PI) Configuration
                            </h3>

                            {data.twoPersonIntegrityRules ? (
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
                                    {/* Document Signing */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">Document Signing</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">NDAs & Confidentiality</span>
                                                <Badge variant={data.twoPersonIntegrityRules.ndasConfidential === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.ndasConfidential === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">Vendor Agreements &lt; $50k</span>
                                                <Badge variant={data.twoPersonIntegrityRules.vendorUnder50k === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.vendorUnder50k === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">Vendor Agreements ≥ $50k</span>
                                                <Badge variant={data.twoPersonIntegrityRules.vendorOver50k === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.vendorOver50k === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">Employment (Junior)</span>
                                                <Badge variant={data.twoPersonIntegrityRules.employmentJunior === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.employmentJunior === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">Employment (Senior)</span>
                                                <Badge variant={data.twoPersonIntegrityRules.employmentSenior === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.employmentSenior === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial & Knowledge */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">Financial Transactions</h4>
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">Bank Wire / Checks</span>
                                                <Badge variant={data.twoPersonIntegrityRules.bankWireChecks === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.bankWireChecks === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">Knowledge Assets</h4>
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">High-Value Voice Memos</span>
                                                <Badge variant={data.twoPersonIntegrityRules.voiceMemosHighValue === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.voiceMemosHighValue === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                                <span className="text-muted-foreground">Mentoring Agreements</span>
                                                <Badge variant={data.twoPersonIntegrityRules.mentoringAgreements === '2pi' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                                                    {data.twoPersonIntegrityRules.mentoringAgreements === '2pi' ? '2PI Required' : 'Single'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground italic">No 2PI rules configured.</div>
                            )}
                        </div>

                        {/* 6. Mentoring Program */}
                        <div className="section space-y-4 break-inside-avoid">
                            <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                <Users className="w-4 h-4" /> Mentoring Program
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Downstream (Successors) */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-700">
                                        <ArrowDownCircle className="w-4 h-4" /> Downstream (Successors)
                                    </h4>
                                    <div className="bg-muted/30 p-3 rounded-lg border space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Cadence:</span>
                                            <span className="font-medium">{formatProtocol(data.mentoringCadence)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Key Focus:</span>
                                            <span className="font-medium">{data.mentoringFocus || "---"}</span>
                                        </div>
                                    </div>

                                    {/* Detailed Roster */}
                                    <div className="space-y-2">
                                        <div className="text-[10px] uppercase text-muted-foreground font-semibold">Mentee Roster</div>
                                        {data.mentoringDownstream && data.mentoringDownstream.length > 0 ? (
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-xs text-left">
                                                    <thead className="bg-muted/50 text-muted-foreground">
                                                        <tr>
                                                            <th className="p-2 font-medium">Name</th>
                                                            <th className="p-2 font-medium">Focus</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {data.mentoringDownstream.map((m: any, i: number) => (
                                                            <tr key={i}>
                                                                <td className="p-2">
                                                                    <div className="font-medium">{m.name}</div>
                                                                    <div className="text-[10px] text-muted-foreground">{m.title}</div>
                                                                </td>
                                                                <td className="p-2 text-muted-foreground">{m.focus || "---"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground italic pl-2">No mentees listed.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Upstream (Advisors) */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-purple-700">
                                        <ArrowUpCircle className="w-4 h-4" /> Upstream (Advisors)
                                    </h4>
                                    <div className="bg-muted/30 p-3 rounded-lg border space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Cadence:</span>
                                            <span className="font-medium">{formatProtocol(data.upstreamCadence)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Key Focus:</span>
                                            <span className="font-medium">{data.upstreamFocus || "---"}</span>
                                        </div>
                                    </div>

                                    {/* Detailed Roster */}
                                    <div className="space-y-2">
                                        <div className="text-[10px] uppercase text-muted-foreground font-semibold">Advisor Roster</div>
                                        {data.mentoringUpstream && data.mentoringUpstream.length > 0 ? (
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-xs text-left">
                                                    <thead className="bg-muted/50 text-muted-foreground">
                                                        <tr>
                                                            <th className="p-2 font-medium">Name</th>
                                                            <th className="p-2 font-medium">Context</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {data.mentoringUpstream.map((m: any, i: number) => (
                                                            <tr key={i}>
                                                                <td className="p-2">
                                                                    <div className="font-medium">{m.name}</div>
                                                                    <div className="text-[10px] text-muted-foreground">{m.title}</div>
                                                                </td>
                                                                <td className="p-2 text-muted-foreground">{m.context || "---"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground italic pl-2">No advisors listed.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Critical Knowledge & Legacy */}
                        <div className="section grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> Critical Knowledge
                                </h3>
                                {(!data.knowledgeItems || data.knowledgeItems.length === 0) ? (
                                    <div className="text-sm text-muted-foreground italic">No knowledge domains recorded.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.knowledgeItems.map((item: any) => (
                                            <div key={item.id} className="text-sm border-b border-dashed pb-3 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <span className="font-medium pr-2">{item.domain}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-semibold whitespace-nowrap ${item.busFactor === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        item.busFactor === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                            'bg-slate-50 text-slate-700 border-slate-200'
                                                        }`}>{item.busFactor}</span>
                                                </div>
                                                {item.mitigation && (
                                                    <div className="text-xs text-muted-foreground flex items-start gap-1.5 bg-muted/20 p-2 rounded">
                                                        <Shield className="w-3 h-3 mt-0.5 shrink-0 opacity-50" />
                                                        <span className="leading-snug">{item.mitigation}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {data.knowledgeContext && (
                                    <div className="p-3 bg-muted/20 rounded border text-xs italic text-muted-foreground mt-2">
                                        {data.knowledgeContext}
                                    </div>
                                )}
                            </div>

                            {/* Legacy & Mentoring Summary */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Development
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-sky-50/50 rounded border border-sky-100 text-center">
                                        <div className="text-xs text-sky-800 uppercase font-bold mb-1 flex items-center justify-center gap-1"><ArrowDownCircle className="w-3 h-3" /> Downstream</div>
                                        <div className="text-xs font-semibold">{data.mentoringCadence ? `${data.mentoringCadence.charAt(0).toUpperCase() + data.mentoringCadence.slice(1)}` : '---'}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1">{data.mentoringDownstream?.length || 0} Mentees</div>
                                    </div>
                                    <div className="p-3 bg-purple-50/50 rounded border border-purple-100 text-center">
                                        <div className="text-xs text-purple-800 uppercase font-bold mb-1 flex items-center justify-center gap-1"><ArrowUpCircle className="w-3 h-3" /> Upstream</div>
                                        <div className="text-xs font-semibold">{data.upstreamCadence ? `${data.upstreamCadence.charAt(0).toUpperCase() + data.upstreamCadence.slice(1)}` : '---'}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1">{data.mentoringUpstream?.length || 0} Advisors</div>
                                    </div>
                                </div>
                                <div className="p-2 border rounded bg-slate-50 text-xs">
                                    <div className="font-semibold text-muted-foreground uppercase mb-1">Escalation Rule</div>
                                    <p className="italic">"{data.escalationPathway || "Consult Board Chairman"}"</p>
                                </div>
                            </div>
                        </div>

                        {/* 7. Key Relationship Handoffs */}
                        <div className="section space-y-4 break-inside-avoid pt-4 border-t">
                            <h3 className="text-lg font-semibold border-b pb-1 text-foreground flex items-center gap-2">
                                <Users className="w-4 h-4" /> Key Relationships
                            </h3>
                            {!data.legacyRelationships || data.legacyRelationships.length === 0 ? (
                                <div className="text-sm text-muted-foreground italic">No key relationships documented.</div>
                            ) : (
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                    {data.legacyRelationships.map((rel: any) => (
                                        <div key={rel.id} className="p-3 border rounded-lg bg-muted/20 text-xs">
                                            <div className="flex justify-between mb-2">
                                                <div className="font-semibold">{rel.stakeholder}</div>
                                                <Badge variant="outline" className={`text-[10px] h-5 ${rel.handoffStatus === 'introduced' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {rel.handoffStatus}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex gap-2">
                                                    <span className="text-muted-foreground w-12 shrink-0">Contact:</span>
                                                    <span className="font-medium">{rel.contactName}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-muted-foreground w-12 shrink-0">Context:</span>
                                                    <span className="italic text-muted-foreground line-clamp-2">{rel.context}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </CardContent>
                )}
            </div>
        </div>
    );
}
