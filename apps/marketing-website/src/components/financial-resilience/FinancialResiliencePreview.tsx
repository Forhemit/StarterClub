"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Shield, DollarSign, TrendingUp, TrendingDown, AlertTriangle, PiggyBank,
    Layers, Building2, Users, LifeBuoy, Lock, ClipboardCheck, Printer,
    CheckCircle2, Clock, Phone, Mail, Calendar, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData, getFinancialResilienceProfile } from "@/actions/resilience";

interface PreviewProps {
    data?: FinancialResilienceData;
    lastUpdated?: number;
    className?: string;
}

export function FinancialResiliencePreview({ data: propData, lastUpdated, className }: PreviewProps) {
    const [data, setData] = useState<FinancialResilienceData | null>(propData || null);
    const [isLoading, setIsLoading] = useState(!propData);

    useEffect(() => {
        if (propData) {
            setData(propData);
            return;
        }

        async function fetchData() {
            setIsLoading(true);
            try {
                const profile = await getFinancialResilienceProfile();
                setData(profile);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [propData, lastUpdated]);

    const handlePrint = () => {
        const printContent = document.getElementById('financial-printable-content');
        if (!printContent) return;

        const printWindow = window.open('', '_blank', 'width=800,height=800');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Financial Resilience Profile</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; line-height: 1.6; color: #1a1a1a; }
                    .document-title { text-align: center; font-size: 24px; font-weight: 700; color: #059669; margin-bottom: 8px; letter-spacing: 0.05em; }
                    .subtitle { text-align: center; font-size: 14px; color: #6b7280; margin-bottom: 32px; }
                    .section { margin-bottom: 24px; page-break-inside: avoid; }
                    .section-title { font-size: 16px; font-weight: 600; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 8px; margin-bottom: 12px; }
                    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
                    .metric { background: #f9fafb; padding: 12px; border-radius: 8px; }
                    .metric-label { font-size: 12px; color: #6b7280; }
                    .metric-value { font-size: 18px; font-weight: 600; color: #1a1a1a; }
                    .list-item { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
                    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }
                    .badge-green { background: #d1fae5; color: #059669; }
                    .badge-amber { background: #fef3c7; color: #d97706; }
                    .badge-red { background: #fee2e2; color: #dc2626; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="document-title">FINANCIAL RESILIENCE PROFILE</div>
                <div class="subtitle">Generated ${new Date().toLocaleDateString()}</div>
                ${printContent.innerHTML}
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

    // Calculate metrics
    const totalLiquidity = (data?.tier1Buffer || 0) + (data?.tier2Buffer || 0) + (data?.tier3Buffer || 0);
    const runwayMonths = data?.monthlyBurnRate ? Math.round(totalLiquidity / data.monthlyBurnRate) : 0;

    const totalMonthlyRevenue = (data?.revenueStreams || []).reduce((sum, s) => {
        if (s.frequency === "Monthly") return sum + (s.amount || 0);
        if (s.frequency === "Quarterly") return sum + ((s.amount || 0) / 3);
        if (s.frequency === "Annually") return sum + ((s.amount || 0) / 12);
        return sum;
    }, 0);

    const totalMonthlyExpenses = (data?.expenseCategories || []).reduce((sum, e) => sum + (e.amount || 0), 0);
    const netCashFlow = totalMonthlyRevenue - totalMonthlyExpenses;

    const fundProgress = data?.targetFundAmount ? Math.min(100, ((data.currentFundBalance || 0) / data.targetFundAmount) * 100) : 0;

    const totalSteps = 11;
    const filledSteps = [
        data?.businessType,
        data?.revenueStreams?.length || data?.expenseCategories?.length,
        data?.stressScenarios?.length,
        data?.targetFundAmount,
        data?.tier1Buffer || data?.tier2Buffer || data?.tier3Buffer,
        data?.insurancePolicies?.length,
        data?.bankingContacts?.length,
        data?.financialContacts?.length,
        data?.recoveryProtocols?.length,
        data?.requireDualSignature !== undefined,
        true
    ].filter(Boolean).length;
    const completionPercentage = Math.round((filledSteps / totalSteps) * 100);

    const formatCurrency = (value: number | undefined) => {
        if (!value) return "$0";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    if (isLoading) {
        return (
            <Card className={cn("animate-pulse", className)}>
                <CardContent className="p-6 space-y-4">
                    <div className="h-8 bg-muted rounded w-1/3" />
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className={className}>
                <CardContent className="p-6 text-center text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No financial resilience data yet.</p>
                    <p className="text-sm">Complete the wizard to see your profile.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("bg-gradient-to-br from-background to-muted/30", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Shield className="w-6 h-6 text-emerald-600" />
                        Financial Resilience Profile
                    </CardTitle>
                    <CardDescription>
                        {data.businessType ? `${data.businessType.charAt(0).toUpperCase() + data.businessType.slice(1)} Business` : "Business Profile"}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={completionPercentage >= 80 ? "bg-green-500" : "bg-amber-500"}>
                        {completionPercentage >= 80 ? (
                            <><CheckCircle2 className="w-3 h-3 mr-1" /> Ready</>
                        ) : (
                            <><Clock className="w-3 h-3 mr-1" /> {completionPercentage}% Complete</>
                        )}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-1" /> Print
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6" id="financial-printable-content">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
                        <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <Layers className="w-3 h-3" /> Total Liquidity
                        </div>
                        <div className="text-xl font-bold text-emerald-700">{formatCurrency(totalLiquidity)}</div>
                    </div>
                    <div className={cn(
                        "p-4 rounded-xl border",
                        runwayMonths >= 6 ? "bg-green-50 border-green-200" :
                            runwayMonths >= 3 ? "bg-amber-50 border-amber-200" :
                                "bg-red-50 border-red-200"
                    )}>
                        <div className="text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Runway
                        </div>
                        <div className={cn(
                            "text-xl font-bold",
                            runwayMonths >= 6 ? "text-green-700" :
                                runwayMonths >= 3 ? "text-amber-700" : "text-red-700"
                        )}>{runwayMonths} months</div>
                    </div>
                    <div className={cn(
                        "p-4 rounded-xl border",
                        netCashFlow >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    )}>
                        <div className="text-xs font-medium flex items-center gap-1">
                            {netCashFlow >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            Net Cash Flow
                        </div>
                        <div className={cn("text-xl font-bold", netCashFlow >= 0 ? "text-green-700" : "text-red-700")}>
                            {netCashFlow >= 0 ? "+" : ""}{formatCurrency(netCashFlow)}/mo
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-blue-50 border-blue-200">
                        <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> Credit Available
                        </div>
                        <div className="text-xl font-bold text-blue-700">
                            {formatCurrency((data.bankingContacts || []).reduce((sum, c) => sum + (c.creditLineAmount || 0), 0))}
                        </div>
                    </div>
                </div>

                {/* Emergency Fund Progress */}
                {data.targetFundAmount && data.targetFundAmount > 0 && (
                    <div className="p-4 rounded-xl border bg-card space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2">
                                <PiggyBank className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Emergency Fund</span>
                            </span>
                            <span className="text-muted-foreground">
                                {formatCurrency(data.currentFundBalance)} / {formatCurrency(data.targetFundAmount)}
                            </span>
                        </div>
                        <Progress value={fundProgress} className="h-2" />
                        <div className="text-xs text-muted-foreground text-right">{fundProgress.toFixed(0)}% funded</div>
                    </div>
                )}

                {/* Stress Scenarios */}
                {data.stressScenarios && data.stressScenarios.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            Stress Scenarios ({data.stressScenarios.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.stressScenarios.slice(0, 4).map((scenario) => (
                                <div key={scenario.id} className="p-3 rounded-lg border bg-card text-sm">
                                    <div className="font-medium">{scenario.name}</div>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700">
                                            Rev: {scenario.revenueImpactPct}%
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px]">
                                            {scenario.durationMonths}mo
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] capitalize">
                                            {scenario.probability}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Insurance Summary */}
                {data.insurancePolicies && data.insurancePolicies.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            Insurance Coverage ({data.insurancePolicies.length} policies)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.insurancePolicies.map((policy) => (
                                <Badge key={policy.id} variant="outline" className="bg-blue-50 text-blue-700">
                                    {policy.type}
                                </Badge>
                            ))}
                        </div>
                        {data.insuranceGaps && data.insuranceGaps.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                <AlertTriangle className="w-4 h-4" />
                                {data.insuranceGaps.length} coverage gap{data.insuranceGaps.length !== 1 ? 's' : ''} identified
                            </div>
                        )}
                    </div>
                )}

                {/* Banking Relationships */}
                {data.bankingContacts && data.bankingContacts.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-600" />
                            Banking Relationships
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {data.primaryBank && (
                                <div className="p-3 rounded-lg border bg-primary/5 border-primary/20">
                                    <div className="text-xs text-muted-foreground">Primary Bank</div>
                                    <div className="font-medium">{data.primaryBank}</div>
                                </div>
                            )}
                            {data.backupBank && (
                                <div className="p-3 rounded-lg border bg-card">
                                    <div className="text-xs text-muted-foreground">Backup Bank</div>
                                    <div className="font-medium">{data.backupBank}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Financial Contacts Summary */}
                {data.financialContacts && data.financialContacts.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-violet-600" />
                            Financial Backup Contacts
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.financialContacts.filter(c => c.isSuccessor).slice(0, 4).map((contact) => (
                                <div key={contact.id} className="p-3 rounded-lg border bg-card flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
                                        {contact.name?.[0] || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{contact.name || contact.role}</div>
                                        <div className="text-xs text-muted-foreground">{contact.role}</div>
                                        {contact.hasCredentials && (
                                            <Badge variant="outline" className="text-[10px] mt-1 bg-amber-50 text-amber-700">
                                                Has Credentials
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(data.cfoSuccessor || data.accountantSuccessor) && (
                            <div className="text-xs text-muted-foreground">
                                <strong>Key Successors:</strong>
                                {data.cfoSuccessor && ` CFO → ${data.cfoSuccessor}`}
                                {data.accountantSuccessor && ` | Accountant → ${data.accountantSuccessor}`}
                            </div>
                        )}
                    </div>
                )}

                {/* Controls Summary */}
                <div className="flex flex-wrap gap-4 p-4 rounded-xl border bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Lock className={cn("w-4 h-4", data.requireDualSignature ? "text-green-600" : "text-muted-foreground")} />
                        <span className="text-sm">
                            Dual Signature: {data.requireDualSignature ? (
                                <span className="text-green-600 font-medium">Required above {formatCurrency(data.dualSignatureThreshold)}</span>
                            ) : (
                                <span className="text-muted-foreground">Not required</span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className={cn("w-4 h-4", data.segregationOfDuties ? "text-green-600" : "text-muted-foreground")} />
                        <span className="text-sm">
                            Segregation of Duties: {data.segregationOfDuties ? (
                                <span className="text-green-600 font-medium">Enabled</span>
                            ) : (
                                <span className="text-muted-foreground">Not configured</span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Review Status */}
                {(data.lastReviewDate || data.nextReviewDate) && (
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {data.lastReviewDate && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Last Review: {new Date(data.lastReviewDate).toLocaleDateString()}
                            </div>
                        )}
                        {data.nextReviewDate && (
                            <div className={cn(
                                "flex items-center gap-1",
                                new Date(data.nextReviewDate) < new Date() ? "text-red-600" : ""
                            )}>
                                <Calendar className="w-4 h-4" />
                                Next Review: {new Date(data.nextReviewDate).toLocaleDateString()}
                                {new Date(data.nextReviewDate) < new Date() && " (Overdue)"}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
