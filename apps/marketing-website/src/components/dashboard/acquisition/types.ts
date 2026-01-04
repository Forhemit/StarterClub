
export interface UploadedFile {
    id: string;
    fileName?: string;
    fileUrl?: string; // or url if it's a link
    fileType?: string;
    fileSize?: number;
    uploadType: 'file' | 'link';
    uploadedAt: string;
    // Enhanced Metadata
    docName: string; // Display name
    docDate?: string; // Effective/Document Date
    hasExpiry?: boolean;
    expiryDate?: string;
    notes?: string;
}

export interface DocumentItem {
    id: string;
    label: string;
    files: UploadedFile[];
}

export interface AcquisitionReadinessData {
    company_name: string;
    data_room_url: string;
    documents_uploaded: number;
    financial_audit_status: "in_progress" | "complete" | "not_started";
    legal_audit_status: "in_progress" | "complete" | "not_started";
    tech_audit_status: "in_progress" | "complete" | "not_started";
    red_flags: string[];
    deal_stage: "preparation" | "outreach" | "loi" | "diligence" | "closing";
    last_updated: string;
    documents: Record<string, DocumentItem[]>;
}

export const DEFAULT_DOCUMENTS: Record<string, DocumentItem[]> = {
    corporate: [
        { id: "inc", label: "Articles of Incorporation", files: [] },
        { id: "bylaws", label: "Bylaws", files: [] },
        { id: "org_chart", label: "Organizational Chart", files: [] },
        { id: "board_mins", label: "Board Meeting Minutes (Last 2 years)", files: [] },
    ],
    financials: [
        { id: "pl_curr", label: "P&L (Current YTD)", files: [] },
        { id: "bs_curr", label: "Balance Sheet (Current YTD)", files: [] },
        { id: "tax_returns", label: "Tax Returns (Last 3 years)", files: [] },
        { id: "cap_table", label: "Cap Table", files: [] },
    ],
    legal_ip: [
        { id: "ip_assignments", label: "IP Assignment Agreements", files: [] },
        { id: "material_contracts", label: "Material Contracts (> $25k)", files: [] },
        { id: "patents", label: "Patent Filings", files: [] },
        { id: "trademarks", label: "Trademark Registrations", files: [] },
    ]
};

export const INITIAL_DATA: AcquisitionReadinessData = {
    company_name: "",
    data_room_url: "",
    documents_uploaded: 0,
    financial_audit_status: "not_started",
    legal_audit_status: "not_started",
    tech_audit_status: "not_started",
    red_flags: [],
    deal_stage: "preparation",
    last_updated: new Date().toISOString(),
    documents: DEFAULT_DOCUMENTS
};
