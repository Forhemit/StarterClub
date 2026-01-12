"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Printer, FileText, Building2, DollarSign, Calendar, RefreshCw, Mail, Phone, Globe } from "lucide-react";
import { VendorManagementData } from "./types";

interface VendorManagementPreviewProps {
    data: VendorManagementData;
    mode?: "preview" | "live";
    className?: string;
}

export function VendorManagementPreview({ data, mode = "preview", className }: VendorManagementPreviewProps) {
    const { vendors = [], contracts = [], spend_records = [] } = data;

    const totalSpend = useMemo(() => {
        return spend_records.reduce((sum, record) => sum + (record.amount || 0), 0);
    }, [spend_records]);

    const spendByCategory = useMemo(() => {
        const summary: Record<string, number> = {};
        spend_records.forEach(record => {
            const category = record.category || 'Other';
            summary[category] = (summary[category] || 0) + (record.amount || 0);
        });
        return Object.entries(summary).sort((a, b) => b[1] - a[1]);
    }, [spend_records]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getDaysUntilExpiry = (endDate: string | Date | undefined): number | null => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handlePrint = () => {
        const printContent = document.getElementById('vendor-printable-content');
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
                <title>Vendor Management Report</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                        color: #1a1a1a;
                        font-size: 14px;
                        line-height: 1.6;
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
                    }
                    h2 { font-size: 16px; margin-top: 24px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                    .card { border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
                    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #f3f4f6; }
                    .text-muted { color: #6b7280; }
                    .font-bold { font-weight: 600; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
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

    const isBlank = vendors.length === 0 && contracts.length === 0 && spend_records.length === 0;

    return (
        <div className={`bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${className || ''}`}>
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <span className="font-semibold text-sm">Vendor Management Report</span>
                <Button size="sm" variant="outline" onClick={handlePrint} className="h-8" disabled={isBlank}>
                    <Printer className="w-3.5 h-3.5 mr-2" />
                    Print
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {isBlank ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-full">
                        <Building2 className="w-16 h-16 stroke-1 mb-4 opacity-50" />
                        <p className="font-medium text-foreground">No Data Yet</p>
                        <p className="text-sm mt-1">Add vendors and contracts to generate a report.</p>
                    </div>
                ) : (
                    <CardContent className="p-0 space-y-8" id="vendor-printable-content">
                        {/* Report Title */}
                        <div className="text-center pb-4 border-b">
                            <h1 className="text-xl font-normal tracking-[0.2em] text-foreground uppercase">
                                VENDOR MANAGEMENT REPORT
                            </h1>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-2xl font-bold">{vendors.length}</p>
                                <p className="text-sm text-muted-foreground">Vendors</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-2xl font-bold">{contracts.length}</p>
                                <p className="text-sm text-muted-foreground">Contracts</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-2xl font-bold">{formatCurrency(totalSpend)}</p>
                                <p className="text-sm text-muted-foreground">Total Spend</p>
                            </div>
                        </div>

                        {/* Vendors */}
                        {vendors.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Vendor Directory
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vendors.map((vendor) => (
                                        <div key={vendor.id} className="card border rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{vendor.name}</h3>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                                        {vendor.category}
                                                    </span>
                                                </div>
                                            </div>
                                            {vendor.contact_name && (
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    {vendor.contact_name}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                                                {vendor.contact_email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />{vendor.contact_email}
                                                    </span>
                                                )}
                                                {vendor.contact_phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />{vendor.contact_phone}
                                                    </span>
                                                )}
                                                {vendor.website && (
                                                    <span className="flex items-center gap-1">
                                                        <Globe className="w-3 h-3" />{vendor.website}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contracts */}
                        {contracts.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Active Contracts
                                </h2>
                                <div className="space-y-3">
                                    {contracts.map((contract) => {
                                        const daysLeft = getDaysUntilExpiry(contract.end_date);
                                        return (
                                            <div key={contract.id} className="card border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">{contract.contract_name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {contract.vendor_name}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        {contract.value && (
                                                            <p className="font-semibold">{formatCurrency(contract.value)}</p>
                                                        )}
                                                        {contract.auto_renew && (
                                                            <span className="text-xs flex items-center gap-1 text-blue-600">
                                                                <RefreshCw className="w-3 h-3" />Auto-renew
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                                                    </span>
                                                    {daysLeft !== null && (
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${daysLeft < 0 ? 'bg-red-100 text-red-800' :
                                                                daysLeft <= 30 ? 'bg-amber-100 text-amber-800' :
                                                                    'bg-green-100 text-green-800'
                                                            }`}>
                                                            {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Spend by Category */}
                        {spendByCategory.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Spend by Category
                                </h2>
                                <div className="space-y-2">
                                    {spendByCategory.map(([category, amount]) => (
                                        <div key={category} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                            <span className="font-medium">{category}</span>
                                            <span className="font-semibold">{formatCurrency(amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                )}
            </div>
        </div>
    );
}
