
export interface LeadershipData {
    // ID managed by system, optional in draft
    id?: string;

    // Step 1: Role Identity
    role?: string;
    incumbent?: string;
    deputy?: string;
    backupDeputy?: string;
    alternateBackup?: string;
    interimDays?: string; // "30" | "60" | "90" | "180" | "indefinite"

    // Step 2: Response Protocols
    protocols?: Record<string, any>; // Define stricter structural types later if needed (Tier 1-4)

    // Step 3: Crisis Comms
    communications?: any[];

    // Step 4: Critical Knowledge
    knowledgeItems?: Array<{
        id: string;
        domain: string;
        vault: string;
        busFactor: "critical" | "high" | "medium" | "low";
    }>;

    // Step 5: Spending Limits
    opexLimit?: string;
    capexLimit?: string;
    spendingApprovers?: string[];

    // Step 6: Signing Matrix
    signingAuthority?: Record<string, boolean>;

    // Step 7: Voice Memos
    voiceMemos?: any[];

    // Step 8: Relationships
    relationships?: any[];

    // Step 9: Mentoring
    mentoringPlan?: string;

    // Step 10: 2PI
    requiresDualControl?: boolean;
    dualControlUsers?: string[];

    // Step 11: Compliance
    complianceEntries?: any[];

    // Configuration flags
    busFactor?: "critical" | "high" | "medium" | "low";

    // Metadata
    lastUpdated?: string;
    completedAt?: string;
}

export interface LeadershipStepProps {
    data: LeadershipData;
    onSave: (data: Partial<LeadershipData>) => void;
}
