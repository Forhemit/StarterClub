"use client";

import { Button } from "@/components/ui/button";
import { Printer, FileText, Check, User, Briefcase, DollarSign, ClipboardList, Package, Globe, MapPin, Clock } from "lucide-react";
import {
    type EmployeeInfo,
    type PositionInfo,
    type CompensationInfo,
    type ChecklistItem,
    type EquipmentOption,
    type AccessItem
} from "./types";

interface OnboardingLetterPreviewProps {
    employeeInfo: EmployeeInfo;
    positionInfo: PositionInfo;
    compensation: CompensationInfo;
    checklist: ChecklistItem[];
    equipment: EquipmentOption[];
    access: AccessItem[];
    className?: string;
}

// Calculate compensation breakdown
function calculateCompensation(amount: string, type: string) {
    if (!amount) return null;
    const num = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(num)) return null;

    let hourly: number, monthly: number, annual: number;

    if (type === "hourly") {
        hourly = num;
        annual = num * 2080; // 40 hrs/week * 52 weeks
        monthly = annual / 12;
    } else {
        annual = num;
        monthly = num / 12;
        hourly = num / 2080; // 40 hrs/week * 52 weeks
    }

    const formatCurrency = (value: number, decimals: number = 2) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    };

    return {
        hourly: formatCurrency(hourly),
        monthly: formatCurrency(monthly, 2),
        annual: formatCurrency(annual, 0),
    };
}

export function OnboardingLetterPreview({
    employeeInfo,
    positionInfo,
    compensation,
    checklist,
    equipment,
    access,
    className
}: OnboardingLetterPreviewProps) {
    const hasEmployeeData = employeeInfo.firstName || employeeInfo.lastName;
    const hasPositionData = positionInfo.jobTitle;
    const hasSalaryData = compensation.salaryAmount;
    const hasAddress = employeeInfo.addressLine1 || employeeInfo.city;

    const compBreakdown = calculateCompensation(compensation.salaryAmount, compensation.salaryType);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        // Parse "YYYY-MM-DD" as local date to avoid timezone shifts
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    };

    // Format address for display
    const formatAddress = () => {
        const parts = [];
        if (employeeInfo.addressLine1) parts.push(employeeInfo.addressLine1);
        if (employeeInfo.addressLine2) parts.push(employeeInfo.addressLine2);
        const cityStateZip = [
            employeeInfo.city,
            employeeInfo.state,
            employeeInfo.zipCode
        ].filter(Boolean).join(employeeInfo.state && employeeInfo.zipCode ? ", " : " ");
        if (cityStateZip) parts.push(cityStateZip);
        return parts;
    };

    const enabledChecklist = checklist.filter(c => c.enabled);
    const enabledEquipment = equipment.filter(e => e.enabled);
    const enabledAccess = access.filter(a => a.enabled);

    const benefits = [];
    if (compensation.healthInsurance) benefits.push("Health Insurance");
    if (compensation.dentalInsurance) benefits.push("Dental Insurance");
    if (compensation.visionInsurance) benefits.push("Vision Insurance");
    if (compensation.retirement401k) benefits.push("401(k) Retirement Plan");
    if (compensation.stockOptions) benefits.push("Stock Options/Equity");
    if (compensation.ptodays) benefits.push(`${compensation.ptodays} PTO Days/Year`);

    const handlePrint = () => {
        const printContent = document.getElementById('onboarding-letter-content');
        if (!printContent) return;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert('Please allow popups for this site to print.');
            return;
        }

        // Print CSS that exactly matches the preview styling
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Welcome Letter - ${employeeInfo.firstName} ${employeeInfo.lastName}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding: 32px 40px;
                        max-width: 800px;
                        margin: 0 auto;
                        color: #1a1a1a;
                        font-size: 14px;
                        line-height: 1.5;
                        background: white;
                    }

                    /* Letter Header */
                    .text-center { text-align: center; }
                    .pb-4 { padding-bottom: 16px; }
                    .border-b { border-bottom: 1px solid #e5e7eb; }
                    .text-lg { font-size: 18px; }
                    .font-semibold { font-weight: 600; }
                    .tracking-widest { letter-spacing: 0.1em; }
                    .uppercase { text-transform: uppercase; }
                    .text-foreground { color: #09090b; }
                    .text-xs { font-size: 12px; }
                    .text-muted-foreground { color: #71717a; }
                    .mt-2 { margin-top: 8px; }
                    .mt-3 { margin-top: 12px; }
                    .mt-8 { margin-top: 32px; }
                    .pt-6 { padding-top: 24px; }
                    .py-4 { padding-top: 16px; padding-bottom: 16px; }
                    .p-3 { padding: 12px; }
                    .p-4 { padding: 16px; }
                    .mb-2 { margin-bottom: 8px; }
                    .gap-2 { gap: 8px; }
                    .gap-4 { gap: 16px; }
                    .flex { display: flex; }
                    .flex-wrap { flex-wrap: wrap; }
                    .items-center { align-items: center; }
                    .ml-auto { margin-left: auto; }
                    .space-y-1 > * + * { margin-top: 4px; }
                    .space-y-2 > * + * { margin-top: 8px; }
                    .space-y-6 > * + * { margin-top: 24px; }
                    .block { display: block; }
                    .pl-4 { padding-left: 16px; }
                    .border-l-2 { border-left-width: 2px; }
                    .border-l { border-left-width: 1px; }

                    /* Employee Name & Title */
                    .employee-name {
                        font-size: 24px;
                        font-weight: 700;
                        color: #09090b;
                        margin: 0;
                    }
                    .job-title {
                        font-size: 18px;
                        color: #71717a;
                        margin-top: 4px;
                    }

                    /* Start Date Box */
                    .start-date-box {
                        padding: 16px;
                        background: rgba(59, 130, 246, 0.05);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 8px;
                        text-align: center;
                        page-break-inside: avoid;
                    }
                    .start-date-box .label {
                        font-size: 11px;
                        color: #71717a;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .start-date-box .value {
                        font-size: 18px;
                        font-weight: 600;
                        color: #3b82f6;
                        margin-top: 4px;
                    }

                    /* Info Cards Grid */
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                        page-break-inside: avoid;
                    }
                    .info-card {
                        padding: 12px;
                        background: rgba(0, 0, 0, 0.02);
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        page-break-inside: avoid;
                    }
                    .info-card .header {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 8px;
                    }
                    .info-card .header svg {
                        width: 16px;
                        height: 16px;
                        color: #3b82f6;
                    }
                    .info-card .header span {
                        font-size: 11px;
                        font-weight: 500;
                        text-transform: uppercase;
                        color: #71717a;
                    }
                    .info-card p {
                        font-size: 14px;
                        margin: 2px 0;
                    }

                    /* Compensation Grid */
                    .comp-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                        margin-top: 12px;
                        page-break-inside: avoid;
                    }
                    .comp-item {
                        padding: 12px;
                        background: #f0fdf4;
                        border: 1px solid #bbf7d0;
                        border-radius: 8px;
                        text-align: center;
                    }
                    .comp-item.highlight {
                        background: #dcfce7;
                        border-color: #86efac;
                    }
                    .comp-label {
                        font-size: 10px;
                        font-weight: 500;
                        text-transform: uppercase;
                        color: #166534;
                    }
                    .comp-value {
                        font-size: 14px;
                        font-weight: 700;
                        color: #15803d;
                        margin-top: 2px;
                    }
                    .comp-item.highlight .comp-value {
                        font-size: 18px;
                        color: #166534;
                    }

                    /* Section Headers */
                    .section {
                        margin-bottom: 20px;
                        page-break-inside: avoid;
                    }
                    .section-header {
                        font-size: 14px;
                        font-weight: 600;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 8px;
                        margin-bottom: 12px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .section-header svg {
                        width: 16px;
                        height: 16px;
                    }

                    /* Badges */
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        background: #f4f4f5;
                        padding: 4px 10px;
                        border-radius: 9999px;
                        font-size: 12px;
                        margin: 4px;
                    }
                    .badge svg {
                        width: 12px;
                        height: 12px;
                        margin-right: 4px;
                        color: #22c55e;
                    }
                    .badge-green {
                        color: #22c55e;
                        margin-left: 4px;
                    }

                    /* Checklist Items */
                    .checklist-group {
                        margin-bottom: 16px;
                        page-break-inside: avoid;
                    }
                    .checklist-group-title {
                        font-size: 13px;
                        font-weight: 600;
                        color: #374151;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: center;
                    }
                    .checklist-item {
                        display: flex;
                        align-items: start;
                        gap: 8px;
                        padding: 4px 0;
                        font-size: 13px;
                        color: #4b5563;
                    }
                    .checklist-checkbox {
                        width: 14px;
                        height: 14px;
                        border: 1px solid #d1d5db;
                        border-radius: 3px;
                        margin-top: 2px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }
                    .checklist-checkbox.checked {
                        background-color: #22c55e;
                        border-color: #22c55e;
                        color: white;
                    }
                    .checklist-checkbox.request {
                        background-color: white;
                        border-color: #d1d5db;
                    }
                    .checklist-checkbox span {
                        font-size: 10px;
                    }

                    /* Bonus Cards */
                    .bonus-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                        margin-top: 12px;
                    }
                    .bonus-card {
                        padding: 12px;
                        background: rgba(0, 0, 0, 0.02);
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 14px;
                    }
                    .bonus-card .label { color: #71717a; }
                    .bonus-card .value { font-weight: 500; }

                    /* Footer */
                    .footer {
                        margin-top: 32px;
                        padding-top: 24px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        font-size: 12px;
                        color: #71717a;
                    }

                    /* Hide icon SVGs in print (we'll use text symbols) */
                    svg { display: none; }

                    /* Page Break Controls */
                    .page-break-before { page-break-before: always; }
                    .page-break-after { page-break-after: always; }
                    .avoid-break { page-break-inside: avoid; }

                    @media print {
                        body { 
                            padding: 20px 30px; 
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .section { page-break-inside: avoid; }
                        .info-grid { page-break-inside: avoid; }
                        .comp-grid { page-break-inside: avoid; }
                        .start-date-box { page-break-inside: avoid; }
                        
                        /* Force page break before compensation section for cleaner layout */
                        .compensation-section { page-break-before: auto; }
                        
                        /* Keep checklist items together */
                        .checklist-group { page-break-inside: avoid; }
                    }

                    @page {
                        margin: 0.5in;
                        size: letter;
                    }
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

    const isBlank = !hasEmployeeData && !hasPositionData && !hasSalaryData;

    return (
        <div className={`bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${className || ''}`}>
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <span className="font-semibold text-sm">Onboarding Letter Preview</span>
                <Button size="sm" variant="outline" onClick={handlePrint} className="h-8" disabled={isBlank}>
                    <Printer className="w-3.5 h-3.5 mr-2" />
                    Print
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {isBlank ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-full">
                        <div className="bg-muted w-16 h-20 mb-4 rounded border flex items-center justify-center">
                            <FileText className="w-8 h-8 opacity-30" />
                        </div>
                        <p className="font-medium text-foreground">Welcome Letter</p>
                        <p className="text-sm mt-1">Start entering employee details to generate a preview.</p>
                    </div>
                ) : (
                    <div id="onboarding-letter-content" className="space-y-6 min-h-[500px]">
                        {/* Letter Header */}
                        <div className="text-center pb-4 border-b">
                            <h1 className="text-lg font-semibold tracking-widest text-foreground uppercase">
                                EMPLOYEE ONBOARDING CHECKLIST
                            </h1>
                            <p className="text-xs text-muted-foreground mt-2">
                                Generated on {new Date().toLocaleDateString()}
                            </p>
                        </div>

                        {/* Employee Name & Title */}
                        {(hasEmployeeData || hasPositionData) && (
                            <div className="section text-center py-4">
                                {hasEmployeeData && (
                                    <p className="employee-name text-2xl font-bold">
                                        {employeeInfo.firstName} {employeeInfo.lastName}
                                    </p>
                                )}
                                {hasPositionData && (
                                    <p className="job-title text-lg text-muted-foreground">
                                        {positionInfo.jobTitle}
                                        {positionInfo.department && ` • ${positionInfo.department}`}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Start Date */}
                        {employeeInfo.startDate && (
                            <div className="start-date-box p-4 bg-primary/5 border border-primary/20 rounded-lg text-center avoid-break">
                                <p className="label text-xs text-muted-foreground uppercase tracking-wide">Start Date</p>
                                <p className="value text-lg font-semibold text-primary">{formatDate(employeeInfo.startDate)}</p>
                            </div>
                        )}

                        {/* Contact, Address & Position Details */}
                        <div className="info-grid grid grid-cols-1 md:grid-cols-2 gap-4 avoid-break">
                            {/* Contact Info */}
                            {(employeeInfo.email || employeeInfo.phone) && (
                                <div className="info-card p-3 bg-muted/30 rounded-lg border">
                                    <div className="header flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-medium uppercase text-muted-foreground">Contact</span>
                                    </div>
                                    {employeeInfo.email && <p className="text-sm truncate">{employeeInfo.email}</p>}
                                    {employeeInfo.phone && <p className="text-sm">{employeeInfo.phone}</p>}
                                </div>
                            )}

                            {/* Address */}
                            {hasAddress && (
                                <div className="info-card p-3 bg-muted/30 rounded-lg border">
                                    <div className="header flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-medium uppercase text-muted-foreground">Address</span>
                                    </div>
                                    {formatAddress().map((line, i) => (
                                        <p key={i} className="text-sm">{line}</p>
                                    ))}
                                </div>
                            )}

                            {/* Work Location */}
                            {(positionInfo.workLocation || positionInfo.remoteStatus) && (
                                <div className="info-card p-3 bg-muted/30 rounded-lg border">
                                    <div className="header flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-medium uppercase text-muted-foreground">Work Location</span>
                                    </div>
                                    {positionInfo.workLocation && <p className="text-sm">{positionInfo.workLocation}</p>}
                                    {positionInfo.remoteStatus && (
                                        <p className="text-sm capitalize">{positionInfo.remoteStatus.replace("-", " ")}</p>
                                    )}
                                </div>
                            )}

                            {/* Team Leader */}
                            {(positionInfo.reportsTo || positionInfo.managerEmail || positionInfo.managerPhone) && (
                                <div className="info-card p-3 bg-muted/30 rounded-lg border">
                                    <div className="header flex items-center gap-2 mb-2">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-medium uppercase text-muted-foreground">Team Leader</span>
                                    </div>
                                    {positionInfo.reportsTo && (
                                        <p className="text-sm font-medium mb-1">{positionInfo.reportsTo}</p>
                                    )}
                                    {positionInfo.managerEmail && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                            <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-muted border">@</span>
                                            {positionInfo.managerEmail}
                                        </div>
                                    )}
                                    {positionInfo.managerPhone && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                            <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-muted border">#</span>
                                            {positionInfo.managerPhone}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Compensation */}
                        {hasSalaryData && compBreakdown && (
                            <div className="compensation-section section avoid-break">
                                <h2 className="section-header text-sm font-semibold border-b pb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Compensation
                                </h2>
                                {/* Compensation Breakdown Grid */}
                                <div className="comp-grid grid grid-cols-3 gap-2 mt-3">
                                    <div className="comp-item p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                        <p className="comp-label text-[10px] text-green-700 uppercase font-medium">Hourly</p>
                                        <p className="comp-value text-base font-bold text-green-700">{compBreakdown.hourly}</p>
                                    </div>
                                    <div className="comp-item p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                        <p className="comp-label text-[10px] text-green-700 uppercase font-medium">Monthly</p>
                                        <p className="comp-value text-base font-bold text-green-700">{compBreakdown.monthly}</p>
                                    </div>
                                    <div className="comp-item highlight p-3 bg-green-100 border border-green-300 rounded-lg text-center">
                                        <p className="comp-label text-[10px] text-green-800 uppercase font-medium">Annual</p>
                                        <p className="comp-value text-lg font-bold text-green-800">{compBreakdown.annual}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    Paid {compensation.payFrequency}
                                </p>
                                {(compensation.bonusEligible || compensation.signingBonus) && (
                                    <div className="bonus-grid grid grid-cols-2 gap-4 mt-3">
                                        {compensation.bonusEligible && (
                                            <div className="bonus-card p-3 bg-muted/30 rounded-lg border text-sm">
                                                <span className="label text-muted-foreground">Bonus: </span>
                                                <span className="value font-medium">{compensation.bonusDetails || "Eligible"}</span>
                                            </div>
                                        )}
                                        {compensation.signingBonus && (
                                            <div className="bonus-card p-3 bg-muted/30 rounded-lg border text-sm">
                                                <span className="label text-muted-foreground">Signing: </span>
                                                <span className="value font-medium">${compensation.signingBonus}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Benefits */}
                        {benefits.length > 0 && (
                            <div className="section avoid-break">
                                <h2 className="section-header text-sm font-semibold border-b pb-2">Benefits Package</h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {benefits.map((benefit, i) => (
                                        <span key={i} className="badge px-2 py-1 bg-muted rounded-full text-xs">
                                            <Check className="w-3 h-3 inline mr-1 text-green-600" />
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Onboarding Checklist */}
                        {enabledChecklist.length > 0 && (
                            <div className="checklist-section section avoid-break">
                                <h2 className="section-header text-sm font-semibold border-b pb-2 flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4" />
                                    Onboarding Checklist
                                </h2>
                                <div className="space-y-4 mt-3">
                                    {enabledChecklist.map((item) => {
                                        const activeSubItems = item.subItems.filter(s => s.status !== 'skip');
                                        if (activeSubItems.length === 0) return null;

                                        return (
                                            <div key={item.id} className="checklist-group border-l-2 border-muted pl-4">
                                                <h3 className="checklist-group-title text-sm font-semibold flex items-center gap-2 mb-2">
                                                    {item.label}
                                                </h3>
                                                <div className="space-y-1">
                                                    {activeSubItems.map((subItem) => (
                                                        <div key={subItem.id} className="checklist-item flex items-start gap-2 text-sm">
                                                            <div className={`checklist-checkbox mt-0.5 w-4 h-4 border rounded flex items-center justify-center shrink-0 ${subItem.status === 'completed'
                                                                ? 'bg-green-500 border-green-500 text-white checked'
                                                                : 'border-muted-foreground/40 request'
                                                                }`}>
                                                                {subItem.status === 'completed' && <Check className="w-3 h-3" />}
                                                            </div>
                                                            <span className={subItem.status === 'completed' ? 'text-muted-foreground line-through' : ''}>
                                                                {subItem.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Equipment */}
                        {enabledEquipment.length > 0 && (
                            <div className="section avoid-break">
                                <h2 className="section-header text-sm font-semibold border-b pb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Equipment Provided
                                </h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {enabledEquipment.map((item) => (
                                        <span key={item.id} className="badge px-2 py-1 bg-muted rounded text-xs">
                                            {item.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* System Access */}
                        {enabledAccess.length > 0 && (
                            <div className="section avoid-break">
                                <h2 className="section-header text-sm font-semibold border-b pb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    System Access
                                </h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {enabledAccess.map((item) => (
                                        <span key={item.id} className="badge px-2 py-1 bg-muted rounded text-xs">
                                            {item.label}
                                            {item.autoProvision && <span className="badge-green ml-1 text-green-600">✓</span>}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="footer pt-6 mt-8 border-t text-center text-xs text-muted-foreground">
                            <p>This document summarizes the onboarding details for the employee listed above.</p>
                            <p className="mt-1">Welcome to the team!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
