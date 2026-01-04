"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle2,
    XCircle,
    Building2,
    FileCheck,
    Phone,
    MapPin,
    AlertTriangle,
    Info
} from "lucide-react";
import type { BusinessCreditData, Tradeline, RiskLevel } from "../types";
import { COMPLIANCE_ITEMS } from "../types";

interface Step1Props {
    data: BusinessCreditData;
    onSave: (data: Partial<BusinessCreditData>) => void;
    tradelines?: Tradeline[];
}

const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

const ENTITY_TYPES = [
    { value: "llc", label: "LLC" },
    { value: "corp", label: "Corporation (C-Corp)" },
    { value: "scorp", label: "S-Corporation" },
    { value: "partnership", label: "Partnership" },
    { value: "sole_prop", label: "Sole Proprietorship" },
];

const NAICS_RISK_LEVELS: { value: RiskLevel; label: string; description: string }[] = [
    { value: "low", label: "Low Risk", description: "Professional services, tech, consulting" },
    { value: "medium", label: "Medium Risk", description: "Retail, manufacturing, food service" },
    { value: "high", label: "High Risk", description: "Cannabis, firearms, gambling, adult" },
];

export function Step1ComplianceChecklist({ data, onSave }: Step1Props) {
    // Calculate compliance score
    const completedItems = COMPLIANCE_ITEMS.filter(item =>
        data[item.field as keyof BusinessCreditData] === true
    ).length;
    const complianceScore = completedItems * 25;

    const toggleCompliance = (field: string, value: boolean) => {
        onSave({ [field]: value });
    };

    return (
        <div className="space-y-8">
            {/* Business Identity Section */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Business Information</Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="legalName">Legal Business Name</Label>
                        <Input
                            id="legalName"
                            placeholder="Acme Corporation"
                            value={data.legalBusinessName || ""}
                            onChange={(e) => onSave({ legalBusinessName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dba">DBA (if different)</Label>
                        <Input
                            id="dba"
                            placeholder="Doing Business As"
                            value={data.dbaName || ""}
                            onChange={(e) => onSave({ dbaName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Entity Type</Label>
                        <Select
                            value={data.entityType || ""}
                            onValueChange={(v) => onSave({ entityType: v as BusinessCreditData["entityType"] })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {ENTITY_TYPES.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Formation State</Label>
                        <Select
                            value={data.formationState || ""}
                            onValueChange={(v) => onSave({ formationState: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                                {US_STATES.map(state => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="einLast4">EIN (last 4)</Label>
                        <Input
                            id="einLast4"
                            placeholder="1234"
                            maxLength={4}
                            value={data.einLastFour || ""}
                            onChange={(e) => onSave({ einLastFour: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        />
                    </div>
                </div>
            </div>

            {/* Compliance Score */}
            <div className="p-4 rounded-xl bg-muted/50 border">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">Compliance Score</span>
                    <Badge variant={complianceScore === 100 ? "default" : "secondary"} className={complianceScore === 100 ? "bg-green-600" : ""}>
                        {complianceScore}%
                    </Badge>
                </div>
                <Progress value={complianceScore} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                    {complianceScore === 100
                        ? "✅ All compliance items verified. You can now build credit tiers."
                        : `Complete ${4 - completedItems} more item${4 - completedItems !== 1 ? 's' : ''} to unlock tier building.`
                    }
                </p>
            </div>

            {/* Compliance Checklist */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Credibility Checklist</Label>
                <p className="text-sm text-muted-foreground -mt-2">
                    These items are checked by lenders before approving business credit.
                </p>

                <div className="grid gap-3">
                    {/* Secretary of State */}
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${data.isSosActive
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-card hover:bg-muted/50"
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${data.isSosActive ? "bg-green-100 dark:bg-green-900/50" : "bg-muted"
                                }`}>
                                <FileCheck className={`w-5 h-5 ${data.isSosActive ? "text-green-600" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                                <h4 className="font-medium">Secretary of State - Active</h4>
                                <p className="text-xs text-muted-foreground">Business is in good standing with the state</p>
                            </div>
                        </div>
                        <Switch
                            checked={data.isSosActive || false}
                            onCheckedChange={(checked) => toggleCompliance("isSosActive", checked)}
                        />
                    </div>

                    {/* EIN Verified */}
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${data.isEinVerified
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-card hover:bg-muted/50"
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${data.isEinVerified ? "bg-green-100 dark:bg-green-900/50" : "bg-muted"
                                }`}>
                                <Building2 className={`w-5 h-5 ${data.isEinVerified ? "text-green-600" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                                <h4 className="font-medium">EIN Verified</h4>
                                <p className="text-xs text-muted-foreground">IRS EIN matches business name</p>
                            </div>
                        </div>
                        <Switch
                            checked={data.isEinVerified || false}
                            onCheckedChange={(checked) => toggleCompliance("isEinVerified", checked)}
                        />
                    </div>

                    {/* 411 Listed */}
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${data.is411Listed
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-card hover:bg-muted/50"
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${data.is411Listed ? "bg-green-100 dark:bg-green-900/50" : "bg-muted"
                                }`}>
                                <Phone className={`w-5 h-5 ${data.is411Listed ? "text-green-600" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                                <h4 className="font-medium">411 Directory Listing</h4>
                                <p className="text-xs text-muted-foreground">Business phone is listed in 411 directory</p>
                            </div>
                        </div>
                        <Switch
                            checked={data.is411Listed || false}
                            onCheckedChange={(checked) => toggleCompliance("is411Listed", checked)}
                        />
                    </div>

                    {/* Commercial Address */}
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${data.isAddressCommercial
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-card hover:bg-muted/50"
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${data.isAddressCommercial ? "bg-green-100 dark:bg-green-900/50" : "bg-muted"
                                }`}>
                                <MapPin className={`w-5 h-5 ${data.isAddressCommercial ? "text-green-600" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                                <h4 className="font-medium">Commercial Address</h4>
                                <p className="text-xs text-muted-foreground">Business address is not a PO Box or residential</p>
                            </div>
                        </div>
                        <Switch
                            checked={data.isAddressCommercial || false}
                            onCheckedChange={(checked) => toggleCompliance("isAddressCommercial", checked)}
                        />
                    </div>
                </div>
            </div>

            {/* NAICS Risk Level */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Industry Risk Assessment</Label>

                <div className="grid gap-3">
                    {NAICS_RISK_LEVELS.map((risk) => (
                        <button
                            key={risk.value}
                            onClick={() => onSave({ naicsRiskLevel: risk.value })}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${data.naicsRiskLevel === risk.value
                                    ? risk.value === "low" ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                                        : risk.value === "medium" ? "bg-yellow-50 border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-700"
                                            : "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700"
                                    : "bg-card hover:bg-muted/50"
                                }`}
                        >
                            <div>
                                <h4 className="font-medium">{risk.label}</h4>
                                <p className="text-xs text-muted-foreground">{risk.description}</p>
                            </div>
                            {data.naicsRiskLevel === risk.value && (
                                <CheckCircle2 className={`w-5 h-5 ${risk.value === "low" ? "text-green-600" :
                                        risk.value === "medium" ? "text-yellow-600" :
                                            "text-red-600"
                                    }`} />
                            )}
                        </button>
                    ))}
                </div>

                {data.naicsRiskLevel === "high" && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-red-900 dark:text-red-100">High-Risk Industry</h4>
                            <p className="text-sm text-red-800 dark:text-red-200">
                                Many lenders have restrictions on high-risk industries. You may need specialized lenders or longer credit history.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Why This Matters</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        The #1 reason business credit applications are denied is inconsistent information.
                        Your business name, address, and EIN must match across all registrations, bank accounts, and applications.
                    </p>
                </div>
            </div>
        </div>
    );
}
