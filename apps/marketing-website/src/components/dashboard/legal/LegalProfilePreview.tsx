"use client";

import { useEffect, useState } from "react";
import { getLegalEntity } from "@/actions/legal-vault";
import { getEntityAddresses, AddressRecord } from "@/actions/addresses";
import { getContactsForEntity, ContactRecord } from "@/actions/contacts";
import { getEntityDocuments, LegalDocument } from "@/actions/documents";
import { getLegalContactsForEntity, EntityLegalContact } from "@/actions/legal-contacts";
import { Loader2, Printer, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

// Color coding for organization types
const ORG_TYPE_COLORS: Record<string, { bg: string; text: string; border: string; printBg: string; printColor: string }> = {
    'LLC': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', printBg: '#dbeafe', printColor: '#1e40af' },
    'Corporation': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', printBg: '#f3e8ff', printColor: '#6b21a8' },
    'S-Corporation': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', printBg: '#e0e7ff', printColor: '#3730a3' },
    'C-Corporation': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300', printBg: '#ede9fe', printColor: '#5b21b6' },
    'Nonprofit': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', printBg: '#dcfce7', printColor: '#166534' },
    'Partnership': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', printBg: '#ffedd5', printColor: '#9a3412' },
    'Sole Proprietorship': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300', printBg: '#ccfbf1', printColor: '#115e59' },
    'Public Benefit Corporation': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', printBg: '#d1fae5', printColor: '#065f46' },
};

function getOrgTypeColors(orgType: string) {
    return ORG_TYPE_COLORS[orgType] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', printBg: '#f3f4f6', printColor: '#1f2937' };
}

import { LegalVaultData } from "./types";

interface LegalProfilePreviewProps {
    entityId?: string | null;
    data?: LegalVaultData;
    mode?: "preview" | "live";
    lastUpdated?: number;
    className?: string;
}

export function LegalProfilePreview({ entityId, data: propData, mode = "live", lastUpdated, className }: LegalProfilePreviewProps) {
    const [data, setData] = useState<any>(propData || null);
    const [addresses, setAddresses] = useState<any[]>(propData?.addresses || []);
    const [contacts, setContacts] = useState<any[]>(propData?.contacts || []);
    const [documents, setDocuments] = useState<any[]>(propData?.documents || []);
    const [legalContacts, setLegalContacts] = useState<any[]>(propData?.attorneys || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (propData) {
            setData(propData);
            setAddresses(propData.addresses || []);
            setContacts(propData.contacts || []);
            setDocuments(propData.documents || []);
            setLegalContacts(propData.attorneys || []);
            // Convert registered agent to a legal contact format for uniform display if needed
            return;
        }

        if (!entityId) return;

        async function load() {
            setLoading(true);
            try {
                const [entityData, addressData, contactData, docData, legalContactData] = await Promise.all([
                    getLegalEntity(),
                    getEntityAddresses(entityId!),
                    getContactsForEntity(entityId!),
                    getEntityDocuments(entityId!),
                    getLegalContactsForEntity(entityId!)
                ]);
                setData(entityData);
                setAddresses(addressData);
                setContacts(contactData ? contactData.map(c => ({ ...c, contact_type: c.contact_type as any })) : []);
                setDocuments(docData);
                setLegalContacts(legalContactData);
            } catch (error) {
                console.error("Failed to load preview data", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [entityId, lastUpdated]);

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
                <title>Legal Profile - ${data?.company_name || 'Document'}</title>
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
                    .badge { 
                        display: inline-block; 
                        padding: 2px 8px; 
                        border-radius: 12px; 
                        font-size: 11px; 
                        font-weight: 600;
                        background: #1a1a1a;
                        color: white;
                    }
                    .org-type-badge {
                        display: inline-block;
                        padding: 2px 10px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                        background: var(--print-bg, #f3f4f6);
                        color: var(--print-color, #1f2937);
                        border: 1px solid currentColor;
                    }
                    .pending-badge {
                        display: inline-block;
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                        background: #fef3c7;
                        color: #92400e;
                        border: 1px solid #fcd34d;
                    }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                    .legal-contacts-grid { grid-template-columns: 1fr !important; }
                    .doc-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
                    .card { 
                        border: 1px solid #e5e5e5; 
                        border-radius: 8px; 
                        padding: 16px;
                        page-break-inside: avoid;
                    }
                    .label { color: #666; font-size: 12px; }
                    .value { font-weight: 500; }
                    .mono { font-family: monospace; }
                    .doc-item { 
                        padding: 12px; 
                        border: 1px solid #d4edda; 
                        border-radius: 6px;
                        background: #f8fff8;
                        margin-bottom: 8px;
                        page-break-inside: avoid;
                    }
                    .doc-row { display: flex; justify-content: space-between; align-items: flex-start; }
                    .doc-meta { margin-top: 4px; display: flex; gap: 16px; align-items: center; }
                    .doc-checkmark { display: none; }
                    .doc-name { display: flex; align-items: center; }
                    .expiry { 
                        font-size: 11px; 
                        background: #fff3cd; 
                        padding: 2px 8px; 
                        border-radius: 4px;
                        color: #856404;
                        border: 1px solid #ffc107;
                    }
                    .doc-type { font-size: 11px; color: #666; }
                    .footer { display: none; }
                    @media print {
                        body { padding: 20px; }
                        .section { page-break-inside: avoid; }
                        h3 { page-break-after: avoid; }
                        .legal-contacts-grid { grid-template-columns: 1fr !important; }
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

        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const isBlank = !data || !data.company_name;



    if (!entityId && !propData) {
        return (
            <div className={`bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${className || ''}`}>
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <span className="font-semibold text-sm">Legal Profile Preview</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-white/50">
                    <div className="bg-muted w-16 h-20 mb-4 rounded border flex items-center justify-center">
                        <div className="space-y-2 w-10">
                            <div className="h-1 bg-muted-foreground/20 rounded w-full"></div>
                            <div className="h-1 bg-muted-foreground/20 rounded w-2/3"></div>
                            <div className="h-1 bg-muted-foreground/20 rounded w-3/4"></div>
                        </div>
                    </div>
                    <p className="font-medium text-foreground">Blank Form</p>
                    <p className="text-sm mt-1">Start entering your company details to generate a preview.</p>
                </div>
            </div>
        );
    }


    return (
        <div className={`bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${className || ''}`}>
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <span className="font-semibold text-sm">Legal Profile Preview</span>
                <Button size="sm" variant="outline" onClick={handlePrint} className="h-8" disabled={isBlank}>
                    <Printer className="w-3.5 h-3.5 mr-2" />
                    Print
                </Button>
            </div>

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
                        <p className="text-sm mt-1">Start entering your company details to generate a preview.</p>
                    </div>
                ) : (
                    <CardContent className="p-8 space-y-8 min-h-[500px]" id="printable-content">
                        {!data?.company_name ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20 opacity-50">
                                <FileText className="w-16 h-16 stroke-1" />
                                <p className="text-lg font-medium">Blank Form</p>
                                <p className="text-sm">Start filling out the wizard to see your preview.</p>
                            </div>
                        ) : (
                            <>
                                {/* Document Title */}
                                <div className="text-center pb-4 border-b mb-6 print:mb-8">
                                    <h1 className="text-xl font-normal tracking-[0.2em] text-foreground uppercase">ENTITY LEGAL PROFILE</h1>
                                </div>

                                {/* Header */}
                                <div className="section flex flex-row justify-between items-start border-b pb-6">
                                    {/* Left Column: Company Name */}
                                    <div className="text-left">
                                        <h2 className="text-3xl font-bold tracking-tight text-foreground">{data.company_name}</h2>
                                    </div>

                                    {/* Right Column: DBA & Org Type */}
                                    <div className="text-right space-y-1">
                                        {data.dba_name && (
                                            <p className="text-lg font-normal text-muted-foreground">dba {data.dba_name}</p>
                                        )}
                                        {data.organization_type && (
                                            <div
                                                className={`org-type-badge inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getOrgTypeColors(data.organization_type).bg} ${getOrgTypeColors(data.organization_type).text} ${getOrgTypeColors(data.organization_type).border}`}
                                                data-org-type={data.organization_type}
                                                style={{ '--print-bg': getOrgTypeColors(data.organization_type).printBg, '--print-color': getOrgTypeColors(data.organization_type).printColor } as React.CSSProperties}
                                            >
                                                {data.organization_type}
                                            </div>
                                        )}
                                        {/* Show Nonprofit Classification */}
                                        {data.organization_type === 'Nonprofit' && data.nonprofit_type && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Classification: {data.nonprofit_type}
                                            </p>
                                        )}
                                        {/* Show Pending Badge if formation in progress */}
                                        {data.formation_in_progress && (
                                            <div className="pending-badge inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-amber-300 bg-amber-100 text-amber-800 mt-1">
                                                Pending
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 1. Addresses */}
                                {addresses.length > 0 && (
                                    <div className="section space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-1 text-foreground">Addresses</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {addresses.map((addr) => (
                                                <div key={addr.id} className="card p-4 border rounded-lg bg-card break-inside-avoid shadow-sm print:border-gray-300">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded print:text-black print:bg-gray-100">{addr.address_type}</span>
                                                        {addr.is_primary && <span className="text-xs text-muted-foreground">(Primary)</span>}
                                                    </div>
                                                    <p className="text-sm">{addr.line1}</p>
                                                    {addr.line2 && <p className="text-sm">{addr.line2}</p>}
                                                    <p className="text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Contact Information */}
                                {contacts.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-1 text-foreground">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {contacts.map((contact) => (
                                                <div key={contact.id} className="p-3 border rounded-lg bg-card text-sm space-y-1 break-inside-avoid print:border-gray-300">
                                                    <div className="font-semibold text-foreground mb-2">{contact.contact_type}</div>
                                                    {contact.email && (
                                                        <div className="flex items-center gap-2 text-muted-foreground overflow-hidden">
                                                            <span className="truncate" title={contact.email}>{contact.email}</span>
                                                        </div>
                                                    )}
                                                    {contact.phone && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <span>{contact.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3. Identifiers & Key Personnel */}
                                <div className="grid grid-cols-2 gap-8">
                                    {(data?.ein || data?.primary_state || data?.formation_date || data?.duns_number || data?.state_tax_id) && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold border-b pb-1 text-foreground">Identifiers</h3>
                                            <dl className="space-y-2 text-sm">
                                                {data?.ein && (
                                                    <div className="grid grid-cols-3">
                                                        <dt className="text-muted-foreground">EIN</dt>
                                                        <dd className="col-span-2 font-mono">{data.ein}</dd>
                                                    </div>
                                                )}
                                                {data?.state_tax_id && (
                                                    <div className="grid grid-cols-3">
                                                        <dt className="text-muted-foreground">State Tax ID</dt>
                                                        <dd className="col-span-2 font-mono">{data.state_tax_id}</dd>
                                                    </div>
                                                )}
                                                {data?.primary_state && (
                                                    <div className="grid grid-cols-3">
                                                        <dt className="text-muted-foreground">Jurisdiction</dt>
                                                        <dd className="col-span-2">{data.primary_state}</dd>
                                                    </div>
                                                )}
                                                {data?.formation_date && (
                                                    <div className="grid grid-cols-3">
                                                        <dt className="text-muted-foreground">Formed</dt>
                                                        <dd className="col-span-2">{new Date(data.formation_date).toLocaleDateString()}</dd>
                                                    </div>
                                                )}
                                                {data?.duns_number && (
                                                    <div className="grid grid-cols-3">
                                                        <dt className="text-muted-foreground">DUNS</dt>
                                                        <dd className="col-span-2 font-mono">{data.duns_number}</dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Legal Contacts Section - Own Row */}
                                {(data?.registered_agent_name || legalContacts.length > 0) && (
                                    <div className="section space-y-4">
                                        <h3 className="text-lg font-semibold border-b pb-1 text-foreground">Legal Contacts</h3>
                                        <div className="grid legal-contacts-grid grid-cols-1 md:grid-cols-2 gap-4">

                                            {/* Registered Agent */}
                                            {data?.registered_agent_name && (
                                                <div className="card p-3 border rounded-lg bg-card">
                                                    <div className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded inline-block mb-2">Registered Agent</div>
                                                    <dl className="space-y-1 text-sm">
                                                        <div className="grid grid-cols-4">
                                                            <dt className="text-muted-foreground">Name</dt>
                                                            <dd className="col-span-3">{data.registered_agent_name}</dd>
                                                        </div>
                                                        {data?.registered_agent_phone && (
                                                            <div className="grid grid-cols-4">
                                                                <dt className="text-muted-foreground">Phone</dt>
                                                                <dd className="col-span-3">{data.registered_agent_phone}</dd>
                                                            </div>
                                                        )}
                                                        {data?.registered_agent_email && (
                                                            <div className="grid grid-cols-4">
                                                                <dt className="text-muted-foreground">Email</dt>
                                                                <dd className="col-span-3">{data.registered_agent_email}</dd>
                                                            </div>
                                                        )}
                                                        {data?.registered_agent_website && (
                                                            <div className="grid grid-cols-4">
                                                                <dt className="text-muted-foreground">Website</dt>
                                                                <dd className="col-span-3">{data.registered_agent_website}</dd>
                                                            </div>
                                                        )}
                                                    </dl>
                                                </div>
                                            )}

                                            {/* Attorneys */}
                                            {legalContacts.filter(c => c.role === 'attorney').map((attorney) => (
                                                <div key={attorney.id} className="card p-3 border rounded-lg bg-card">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Attorney</span>
                                                        {attorney.attorney_type && (
                                                            <span className="text-xs text-muted-foreground">({attorney.attorney_type})</span>
                                                        )}
                                                    </div>
                                                    <dl className="space-y-1 text-sm">
                                                        <div className="grid grid-cols-4">
                                                            <dt className="text-muted-foreground">Name</dt>
                                                            <dd className="col-span-3 font-medium">{attorney.name}</dd>
                                                        </div>
                                                        {attorney.phone && (
                                                            <div className="grid grid-cols-4">
                                                                <dt className="text-muted-foreground">Phone</dt>
                                                                <dd className="col-span-3">{attorney.phone}</dd>
                                                            </div>
                                                        )}
                                                        {attorney.email && (
                                                            <div className="grid grid-cols-4">
                                                                <dt className="text-muted-foreground">Email</dt>
                                                                <dd className="col-span-3">{attorney.email}</dd>
                                                            </div>
                                                        )}
                                                        {attorney.website && (
                                                            <div className="grid grid-cols-4">
                                                                <dt className="text-muted-foreground">Website</dt>
                                                                <dd className="col-span-3">{attorney.website}</dd>
                                                            </div>
                                                        )}
                                                        {attorney.address_line1 && (
                                                            <div className="grid grid-cols-4">
                                                                <dt className="text-muted-foreground">Address</dt>
                                                                <dd className="col-span-3">
                                                                    {attorney.address_line1}
                                                                    {attorney.city && `, ${attorney.city}`}
                                                                    {attorney.state && `, ${attorney.state}`}
                                                                    {attorney.zip && ` ${attorney.zip}`}
                                                                </dd>
                                                            </div>
                                                        )}
                                                    </dl>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4. Additional Information (and Documents) */}
                                {(data?.business_purpose || data?.naics_code || data?.comments || documents.length > 0) && (
                                    <div className="space-y-8">
                                        {(data?.business_purpose || data?.naics_code || data?.comments) && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold border-b pb-1 text-foreground">Additional Information</h3>
                                                <div className="grid grid-cols-1 gap-4 text-sm">
                                                    {data?.naics_code && (
                                                        <div>
                                                            <span className="font-medium block text-muted-foreground mb-1">NAICS Code</span>
                                                            <span className="font-mono bg-muted px-2 py-0.5 rounded">{data.naics_code}</span>
                                                        </div>
                                                    )}
                                                    {data?.business_purpose && (
                                                        <div>
                                                            <span className="font-medium block text-muted-foreground mb-1">Business Purpose</span>
                                                            <p className="text-muted-foreground whitespace-pre-wrap">{data.business_purpose}</p>
                                                        </div>
                                                    )}
                                                    {data?.comments && (
                                                        <div>
                                                            <span className="font-medium block text-muted-foreground mb-1">Notes / Comments</span>
                                                            <p className="text-muted-foreground italic whitespace-pre-wrap bg-yellow-50/50 p-2 rounded border border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/30">{data.comments}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {documents.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold border-b pb-1 text-foreground">Documents on File</h3>
                                                <ul className="doc-list grid grid-cols-1 gap-2">
                                                    {documents.map((doc) => (
                                                        <li key={doc.id} className="text-sm p-3 bg-green-50/50 border border-green-100 rounded-lg dark:bg-green-900/10 dark:border-green-900/30 break-inside-avoid print:border-gray-200 print:bg-white">
                                                            {/* Row 1: Document Name + Date */}
                                                            <div className="flex items-start justify-between">
                                                                <span className="doc-name flex items-center gap-2 font-medium text-foreground">
                                                                    <CheckCircle className="doc-checkmark w-4 h-4 text-green-600 fill-green-100 print:text-green-700" />
                                                                    {doc.display_name || doc.document_type}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    {new Date(doc.upload_date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            {/* Row 2: Type + Expires */}
                                                            {((doc.display_name && doc.display_name !== doc.document_type) || doc.expiration_date) && (
                                                                <div className="doc-meta flex items-center gap-4 mt-2 ml-6">
                                                                    {(doc.display_name && doc.display_name !== doc.document_type) && (
                                                                        <span className="doc-type text-xs text-muted-foreground">Type: {doc.document_type}</span>
                                                                    )}
                                                                    {doc.expiration_date && (
                                                                        <span className="expiry text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 print:border-amber-300">
                                                                            Expires: {new Date(doc.expiration_date).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                )}
            </div>
        </div>
    );
}

