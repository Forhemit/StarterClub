"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Printer, FileText, CheckCircle, AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AcquisitionReadinessData } from "./types";

interface AcquisitionReadinessPreviewProps {
    data: AcquisitionReadinessData;
    className?: string;
}

export function AcquisitionReadinessPreview({ data, className }: AcquisitionReadinessPreviewProps) {
    const isBlank = !data || !data.company_name;

    const handlePrint = () => {
        const printContent = document.getElementById('printable-content');
        if (!printContent) return;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert('Please allow popups for this site to print.');
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Acquisition Readiness Profile - ${data?.company_name || 'Document'}</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                        color: #1a1a1a;
                        font-size: 14px;
                        line-height: 1.6;
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
                        font-size: 24px; 
                        margin-bottom: 8px; 
                        font-weight: 700;
                    }
                    h2 { 
                        font-size: 16px; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 4px; 
                        margin-top: 24px;
                        margin-bottom: 16px;
                        page-break-after: avoid;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        color: #4b5563;
                    }
                    .section {
                        page-break-inside: avoid;
                        margin-bottom: 24px;
                    }
                    .badge { 
                        display: inline-block; 
                        padding: 2px 8px; 
                        border-radius: 99px; 
                        font-size: 11px; 
                        font-weight: 600;
                        border: 1px solid transparent;
                    }
                    .badge-outline {
                        background: white;
                        border: 1px solid #e5e7eb;
                        color: #374151;
                    }
                    .badge-green {
                        background: #dcfce7;
                        color: #166534;
                        border-color: #bbf7d0;
                    }
                    .badge-amber {
                        background: #fef3c7;
                        color: #92400e;
                        border-color: #fcd34d;
                    }
                    .badge-red {
                        background: #fee2e2;
                        color: #991b1b;
                        border-color: #fecaca;
                    }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                    .card { 
                        border: 1px solid #e5e5e5; 
                        border-radius: 8px; 
                        padding: 16px;
                        background: #f9fafb;
                        page-break-inside: avoid;
                    }
                    .label { color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; display: block; }
                    .value { font-weight: 500; font-size: 14px; }
                    .doc-list { display: flex; flex-direction: column; gap: 8px; }
                    .doc-item { 
                        padding: 12px; 
                        border: 1px solid #e5e7eb; 
                        border-radius: 6px;
                        background: white;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .red-flag-item {
                        padding: 12px;
                        border-radius: 6px;
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        color: #991b1b;
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="document-title">Acquisition Readiness Profile</div>
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

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            complete: "bg-green-100 text-green-800 border-green-200 print:bg-green-50 print:border-green-300",
            in_progress: "bg-amber-100 text-amber-800 border-amber-200 print:bg-amber-50 print:border-amber-300",
            not_started: "bg-slate-100 text-slate-800 border-slate-200 print:bg-slate-50 print:border-slate-300"
        };
        const labels = {
            complete: "Complete",
            in_progress: "In Progress",
            not_started: "Not Started"
        };

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    return (
        <div className={`bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${className || ''}`}>
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <span className="font-semibold text-sm">Readiness Profile Preview</span>
                <Button size="sm" variant="outline" onClick={handlePrint} className="h-8" disabled={isBlank}>
                    <Printer className="w-3.5 h-3.5 mr-2" />
                    Print
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 relative">
                {isBlank ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-white/50 h-full">
                        <div className="bg-muted w-16 h-20 mb-4 rounded border flex items-center justify-center">
                            <div className="space-y-2 w-10">
                                <div className="h-1 bg-muted-foreground/20 rounded w-full"></div>
                                <div className="h-1 bg-muted-foreground/20 rounded w-2/3"></div>
                                <div className="h-1 bg-muted-foreground/20 rounded w-3/4"></div>
                            </div>
                        </div>
                        <p className="font-medium text-foreground">Blank Profile</p>
                        <p className="text-sm mt-1">Start entering your deal information to generate a preview.</p>
                    </div>
                ) : (
                    <CardContent className="p-8 space-y-8 min-h-[500px]" id="printable-content">
                        {/* Header Section */}
                        <div className="section text-center pb-6 border-b">
                            <h1 className="text-2xl font-bold text-foreground mb-2">{data.company_name}</h1>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                                <Badge variant="outline" className="capitalize">
                                    Stage: {data.deal_stage.replace('_', ' ')}
                                </Badge>
                                <span>•</span>
                                <span className="text-sm">Last Updated: {format(new Date(data.last_updated), 'PP')}</span>
                            </div>
                            {data.data_room_url && (
                                <a
                                    href={data.data_room_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Visit Data Room
                                </a>
                            )}
                        </div>

                        {/* Audit Status Grid */}
                        <div className="section grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="card p-4 rounded-lg border bg-card">
                                <div className="label text-muted-foreground text-xs uppercase tracking-wider mb-2">Financial Audit</div>
                                <StatusBadge status={data.financial_audit_status} />
                            </div>
                            <div className="card p-4 rounded-lg border bg-card">
                                <div className="label text-muted-foreground text-xs uppercase tracking-wider mb-2">Legal Audit</div>
                                <StatusBadge status={data.legal_audit_status} />
                            </div>
                            <div className="card p-4 rounded-lg border bg-card">
                                <div className="label text-muted-foreground text-xs uppercase tracking-wider mb-2">Tech Audit</div>
                                <StatusBadge status={data.tech_audit_status} />
                            </div>
                        </div>

                        {/* Red Flags Section */}
                        {data.red_flags.length > 0 && (
                            <div className="section">
                                <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                                    <ShieldAlert className="w-5 h-5 mr-2 text-destructive" />
                                    Risk Assessment
                                </h2>
                                <div className="space-y-3">
                                    {data.red_flags.map((flag, index) => (
                                        <div key={index} className="red-flag-item bg-destructive/5 text-destructive border-destructive/20 p-3 rounded-md border flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium">{flag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents Section */}
                        <div className="section">
                            <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-primary" />
                                Documentation Package
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(data.documents).map(([category, items]) => (
                                    <div key={category} className="space-y-3">
                                        <h3 className="text-sm font-medium uppercase text-muted-foreground tracking-wider border-b pb-2">
                                            {category.replace('_', ' ')}
                                        </h3>
                                        <div className="space-y-2">
                                            {items.map((item) => {
                                                const hasFiles = item.files && item.files.length > 0;
                                                return (
                                                    <div key={item.id} className="doc-item flex items-center justify-between p-2.5 rounded-md border bg-card">
                                                        <span className={`text-sm ${hasFiles ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                                            {item.label}
                                                        </span>
                                                        {hasFiles && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground hidden print:inline">Included</span>
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                )}
            </div>
        </div>
    );
}
