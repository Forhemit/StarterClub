export interface ComplianceEvent {
    id: string;
    title: string;
    description?: string;
    due_date: Date | string;
    status: 'pending' | 'completed' | 'overdue' | 'ignored';
    category: 'tax' | 'registration' | 'license' | 'other';
    jurisdiction?: string;
    completed_at?: Date | string;
    notes?: string;
}

export interface ComplianceData {
    id?: string;
    tax_events: ComplianceEvent[];
    registrations: ComplianceEvent[];
    licenses: ComplianceEvent[];
    other_documents: ComplianceEvent[];
    documents: any[]; // Placeholder for now - maybe deprecate this one or use for file blobs later
}

export const INITIAL_DATA: ComplianceData = {
    tax_events: [],
    registrations: [],
    licenses: [],
    other_documents: [],
    documents: []
};
