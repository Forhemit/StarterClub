
import { DocumentItem, DEFAULT_DOCUMENTS } from "../acquisition/types";

export type PartyRole = "investor" | "attorney" | "ma_firm" | "vendor" | "employee" | "other";

export interface InterestedParty {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    role: PartyRole;
    notes?: string;
    addedAt: string;
}

export type TimeWindow = "all_time" | "current_year" | "last_1_year" | "last_2_years" | "last_3_years";

// Defines access to a specific document or a whole category
export interface AccessRule {
    partyId: string;
    // If resourceId is a category key (e.g., 'financials'), it applies to the whole category
    // If resourceId is a specific doc id (e.g., 'tax_returns'), it applies to that doc
    resourceId: string;
    hasAccess: boolean;
    timeWindow?: TimeWindow; // Optional restriction on time
}

export interface EnterpriseRepositoryData {
    interestedParties: InterestedParty[];
    accessRules: Record<string, AccessRule[]>; // Key is partyId for faster lookup, value is list of rules
    lastUpdated: string;
}

export const INITIAL_ENTERPRISE_DATA: EnterpriseRepositoryData = {
    interestedParties: [],
    accessRules: {}, // Empty means default deny (hidden by default as per requirements)
    lastUpdated: new Date().toISOString(),
};

// Re-export constants for use in the UI
export { DEFAULT_DOCUMENTS };
