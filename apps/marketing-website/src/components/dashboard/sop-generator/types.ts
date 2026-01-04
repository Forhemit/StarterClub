// SOP Generator Module Types

// Responsibility type
export interface Responsibility {
    id?: string;
    position_sop_id?: string;
    responsibility_area: string;
    key_activities: string[];
    time_allocation: number;
    priority: number;
    sort_order: number;
}

// Authority type
export interface Authority {
    id?: string;
    position_sop_id?: string;
    decision_area: string;
    authority_level: string;
    approval_required?: string;
    escalation_path?: string;
    sort_order: number;
}

// Metric type
export interface Metric {
    id?: string;
    position_sop_id?: string;
    metric_name: string;
    target: string;
    measurement_frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
    metric_weight: number;
    data_source?: string;
    sort_order: number;
}

// Requirement type
export interface Requirement {
    id?: string;
    position_sop_id?: string;
    requirement_type: "education" | "experience" | "certification" | "technical" | "soft_skill" | "physical";
    description: string;
    is_minimum: boolean;
    is_preferred: boolean;
    sort_order: number;
}

// Tool type (online tools/software)
export interface Tool {
    id?: string;
    position_sop_id?: string;
    tool_name: string;
    tool_category: "communication" | "productivity" | "development" | "design" | "analytics" | "crm" | "hr" | "finance" | "other";
    access_level: "view" | "edit" | "admin";
    is_required: boolean;
    description?: string;
    sort_order: number;
}

// Main SOP Data type (used by wizard)
export interface PositionSOPData {
    id?: string;
    user_id?: string;
    sop_id?: string;

    // Basic Info
    title: string;
    department?: string;
    position_type: "full-time" | "part-time" | "contract";
    flsa_status: "exempt" | "non-exempt";
    work_arrangement: "onsite" | "hybrid" | "remote";
    location?: string;
    reports_to?: string;

    // Position Overview
    mission_statement?: string;
    impact_statement?: string;

    // Review & Version Control
    version: string;
    effective_date?: string | Date;
    review_frequency: "quarterly" | "biannual" | "annual" | "biennial";
    next_review_date?: string | Date;
    status: "draft" | "active" | "pending_review" | "expired" | "archived";

    // Related data
    responsibilities: Responsibility[];
    authorities: Authority[];
    metrics: Metric[];
    requirements: Requirement[];
    tools: Tool[];

    // Timestamps
    created_at?: string;
    updated_at?: string;
}

// Default empty SOP data
export const DEFAULT_SOP_DATA: PositionSOPData = {
    title: "",
    department: "",
    position_type: "full-time",
    flsa_status: "non-exempt",
    work_arrangement: "onsite",
    location: "",
    reports_to: "",
    mission_statement: "",
    impact_statement: "",
    version: "v1.0",
    review_frequency: "annual",
    status: "draft",
    responsibilities: [],
    authorities: [],
    metrics: [],
    requirements: [],
    tools: [],
};

// Wizard step definition
export interface WizardStep {
    id: string;
    title: string;
    description: string;
    component: React.ComponentType<StepProps>;
}

// Props passed to each wizard step
export interface StepProps {
    data: PositionSOPData;
    updateData: (updates: Partial<PositionSOPData>) => void;
}

// Wizard component props
export interface SOPGeneratorWizardProps {
    initialData?: PositionSOPData;
    onSave?: (data: PositionSOPData) => Promise<{ id: string } | void>;
    onReset?: (sopId: string) => Promise<{ success: boolean } | void>;
    onComplete?: (data: PositionSOPData) => void;
    onCancel?: () => void;
}
