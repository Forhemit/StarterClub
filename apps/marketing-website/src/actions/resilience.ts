"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function installResilienceModule(moduleSlug: string) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return { error: "No business found" };

    const { data: moduleData } = await supabase
        .from("modules")
        .select("id")
        .eq("slug", moduleSlug)
        .single();

    if (!moduleData) return { error: "Module not found" };

    const { error } = await supabase.from("user_installed_modules").insert({
        user_business_id: business.id,
        module_id: moduleData.id,
        status: "active",
    });

    if (error) {
        if (error.code === "23505") return { error: "Module already installed" };
        return { error: "Failed to install module" };
    }

    revalidatePath("/dashboard/resilience");
    return { success: true };
}

export async function getResilienceModules() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { modules: [], installed: [] };

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return { modules: [], installed: [] };

    const { data: modulesData } = await supabase
        .from("modules")
        .select("*")
        .eq("category", "Business Resilience")
        .eq("is_public", true)
        .order("created_at");

    // Map 'name' to 'title'
    const modules = modulesData?.map((m: any) => ({
        ...m,
        title: m.name,
    })) || [];

    const { data: installed } = await supabase
        .from("user_installed_modules")
        .select("module_id, status")
        .eq("user_business_id", business.id);

    return {
        modules: modules,
        installed: installed ? installed.map((i) => i.module_id) : [],
    };
}

export async function getModuleDetails(moduleSlug: string) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return { error: "Business not found" };

    // Fetch module and its items (from module_items -> checklist_items)
    // We need to construct the "Section" hierarchy manually from the flat list + section_title column
    const { data: rawModuleData } = await supabase
        .from("modules")
        .select(`
      *,
      items:module_items(
        id,
        section_title,
        weight,
        display_order,
        item:checklist_items(
            id,
            title,
            description
        )
      )
    `)
        .eq("slug", moduleSlug)
        .single();

    if (!rawModuleData) return { error: "Module not found" };

    const moduleData = {
        ...rawModuleData,
        title: rawModuleData.name
    };

    // Group items by section
    const sectionsMap = new Map();

    if (rawModuleData.items) {
        rawModuleData.items.forEach((link: any) => {
            const sectionTitle = link.section_title || "General";

            if (!sectionsMap.has(sectionTitle)) {
                sectionsMap.set(sectionTitle, {
                    id: sectionTitle, // just using title as ID for grouping
                    title: sectionTitle,
                    cards: []
                });
            }

            // Map checklist_item to "Card" shape
            sectionsMap.get(sectionTitle).cards.push({
                id: link.item.id, // Using checklist_item ID as the card ID for completions
                title: link.item.title,
                description: link.item.description,
                weight: link.weight,
                order_index: link.display_order
                // definition_of_done: ... if we added that to checklist_items schema, else omit
            });
        });
    }

    // Convert map to array and sort
    // We don't have explicit section order unless we infer from the first item's order in that section
    const sections = Array.from(sectionsMap.values()).sort((a, b) => {
        // rough sort by order of first card
        return (a.cards[0]?.order_index || 0) - (b.cards[0]?.order_index || 0);
    });

    // Attach sections to moduleData for frontend
    moduleData.sections = sections;


    // Fetch user completions (user_checklist_status)
    // Filter by business_id and module items
    // Since user_checklist_status links to item_id, we can just fetch all for this business
    // or filtered by items in this module.
    const itemIds = rawModuleData.items?.map((l: any) => l.item.id) || [];

    const { data: completions } = await supabase
        .from("user_checklist_status")
        .select("*")
        .eq("user_business_id", business.id)
        .in("item_id", itemIds);

    // Map completions to expected shape
    const mappedCompletions = completions?.map((c: any) => ({
        card_id: c.item_id, // map item_id to card_id
        status: c.status_id ? 'completed' : 'pending' // need to check status table actually
    })) || [];

    // Wait, user_checklist_status has `status_id`, we need to map that string name
    // Actually, let's just fetch the status name.
    // Or simplifying: if record exists and status_id corresponds to 'complete', it's done.
    // For now let's assume existence implies something, but let's be precise.

    // Better fetch with status join
    const { data: detailedCompletions } = await supabase
        .from("user_checklist_status")
        .select(`
          item_id,
          status:statuses(name)
      `)
        .eq("user_business_id", business.id)
        .in("item_id", itemIds);

    const finalCompletions = detailedCompletions?.map((c: any) => ({
        card_id: c.item_id,
        status: c.status?.name === 'complete' ? 'completed' :
            c.status?.name === 'in_progress' ? 'in_progress' : 'pending'
    })) || [];


    return {
        module: moduleData,
        completions: finalCompletions,
    };
}

export async function completeCard(cardId: string, status: "completed" | "in_progress" | "pending") {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return { error: "Business not found" };

    // Map status string to status_id
    const { data: statusRecord } = await supabase
        .from("statuses")
        .select("id")
        .eq("name", status === 'completed' ? 'complete' : status) // map 'completed' -> 'complete'
        .single();

    if (!statusRecord) return { error: "Invalid status" };

    const { error } = await supabase.from("user_checklist_status").upsert(
        {
            item_id: cardId, // cardId is item_id
            user_business_id: business.id,
            status_id: statusRecord.id,
            completed_at: status === "completed" ? new Date().toISOString() : null,
            verified_by: status === "completed" ? user.id : null // self-verification for now
        },
        { onConflict: "user_business_id, item_id" }
    );

    if (error) {
        console.error("Completion error:", error);
        return { error: "Failed to update status" };
    }

    revalidatePath("/dashboard/resilience");
    return { success: true };
}

export async function getResilienceScore() {
    // Need to rewrite the score logic to use user_checklist_status and weights from module_items
    // This is expensive to calculate on the fly without a DB function.
    // For now, return 0 or implement JS calculation here.

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return 0;

    // Calculate score manually for now (v1 refactor)
    // 1. Get all Resilience Modules
    const { data: modules } = await supabase.from('modules').select('id').eq('category', 'Business Resilience');
    if (!modules || modules.length === 0) return 0;

    const moduleIds = modules.map(m => m.id);

    // 2. Get all Weighted Items for these modules
    const { data: items } = await supabase
        .from('module_items')
        .select('item_id, weight')
        .in('module_id', moduleIds);

    if (!items || items.length === 0) return 0;

    const totalWeight = items.reduce((sum, i) => sum + (i.weight || 1), 0);

    // 3. Get completed items for this business
    const { data: completions } = await supabase
        .from('user_checklist_status')
        .select('item_id, status:statuses(name)')
        .eq('user_business_id', business.id)
        .in('item_id', items.map(i => i.item_id));

    const completedIds = new Set(
        completions
            ?.filter((c: any) => c.status?.name === 'complete')
            .map((c: any) => c.item_id)
    );

    const earnedWeight = items.reduce((sum, i) => {
        return sum + (completedIds.has(i.item_id) ? (i.weight || 1) : 0);
    }, 0);

    return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

// ==================== LEADERSHIP ROLE PROFILE ACTIONS ====================

interface LeadershipRoleData {
    role?: string;
    incumbent?: string;
    deputy?: string;
    backupDeputy?: string;
    alternateBackup?: string;
    interimDays?: string;
    tier1Action?: string;
    tier1Scope?: string;
    tier2Action?: string;
    tier2Scope?: string;
    tier3Action?: string;
    tier3Scope?: string;
    tier4Action?: string;
    tier4Scope?: string;
    tier4DualControl1?: string;
    tier4DualControl2?: string;
    tier1Comms?: string;
    tier2Comms?: string;
    tier3Comms?: string;
    tier4Comms?: string;
    knowledgeItems?: Array<{ id: string; domain: string; vault?: string; busFactor: string; mitigation?: string }>;
    knowledgeContext?: string;
    opexLimit?: number | string;
    capexLimit?: number | string;
    opexExcessApprover?: string;
    capexExcessApprover?: string;
    canSignNDAs?: boolean;
    canSignVendor?: boolean;
    canSignEmployment?: boolean;
    canSignChecks?: boolean;
    requiresDualControl?: boolean;
    signingRules?: Array<{
        id: string;
        documentType: string;
        thresholdMin: number;
        thresholdMax: number | null;
        requires2pi: boolean;
        primaryApprover: string;
        secondaryApprover: string;
    }>;
    twoPersonIntegrityRules?: Record<string, 'single' | '2pi'>;
    escalationPathway?: string;
    approverRole?: string;
    legacyRecordings?: Array<{ id: string; topic: string; speaker: string; type?: string; url?: string }>;
    legacyRelationships?: Array<{ id: string; stakeholder: string; contactName: string; context: string; handoffStatus?: string }>;
    mentoringCadence?: string;
    mentoringFocus?: string;
    upstreamCadence?: string;
    upstreamFocus?: string;
    mentoringUpstream?: Array<{ id: string; name: string; title: string; context: string }>;
    mentoringDownstream?: Array<{ id: string; name: string; title: string; focus: string }>;
    complianceLog?: Array<{ id: string; userName: string; title?: string; userEmail: string; completionStatus: string; completedAt: string | null; expiryDate: string | null }>;
    completedAt?: string;
    expiryDate?: string;
}

export async function saveLeadershipProfile(data: LeadershipRoleData) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return { error: "Business not found" };

    // Convert camelCase to snake_case for database
    const dbData = {
        user_business_id: business.id,
        role: data.role,
        incumbent: data.incumbent,
        deputy: data.deputy,
        backup_deputy: data.backupDeputy,
        alternate_backup: data.alternateBackup,
        interim_days: data.interimDays,
        tier1_action: data.tier1Action,
        tier1_scope: data.tier1Scope,
        tier2_action: data.tier2Action,
        tier2_scope: data.tier2Scope,
        tier3_action: data.tier3Action,
        tier3_scope: data.tier3Scope,
        tier4_action: data.tier4Action,
        tier4_scope: data.tier4Scope,
        tier4_dual_control_1: data.tier4DualControl1,
        tier4_dual_control_2: data.tier4DualControl2,
        tier1_comms: data.tier1Comms,
        tier2_comms: data.tier2Comms,
        tier3_comms: data.tier3Comms,
        tier4_comms: data.tier4Comms,
        knowledge_items: data.knowledgeItems || [],
        knowledge_context: data.knowledgeContext,
        opex_limit: typeof data.opexLimit === 'string'
            ? parseFloat(data.opexLimit.replace(/[^0-9.]/g, '')) || 0
            : data.opexLimit || 0,
        capex_limit: typeof data.capexLimit === 'string'
            ? parseFloat(data.capexLimit.replace(/[^0-9.]/g, '')) || 0
            : data.capexLimit || 0,
        opex_excess_approver: data.opexExcessApprover,
        capex_excess_approver: data.capexExcessApprover,
        can_sign_ndas: data.canSignNDAs || false,
        can_sign_vendor: data.canSignVendor || false,
        can_sign_employment: data.canSignEmployment || false,
        can_sign_checks: data.canSignChecks || false,
        requires_dual_control: data.requiresDualControl || false,
        signing_rules: data.signingRules || [],
        two_person_integrity_rules: data.twoPersonIntegrityRules || {},
        escalation_pathway: data.escalationPathway,
        approver_role: data.approverRole,
        legacy_recordings: data.legacyRecordings || [],
        legacy_relationships: data.legacyRelationships || [],
        mentoring_cadence: data.mentoringCadence,
        mentoring_focus: data.mentoringFocus,
        upstream_cadence: data.upstreamCadence,
        upstream_focus: data.upstreamFocus,
        mentoring_upstream: data.mentoringUpstream || [],
        mentoring_downstream: data.mentoringDownstream || [],
        compliance_log: data.complianceLog || [],
        completed_at: data.completedAt,
        expiry_date: data.expiryDate,
    };

    const { error } = await supabase
        .from("leadership_role_profiles")
        .upsert(dbData, {
            onConflict: "user_business_id, role",
            ignoreDuplicates: false
        });

    if (error) {
        console.error("Save leadership profile error:", error);
        return { error: "Failed to save profile" };
    }

    revalidatePath("/dashboard/resilience/leadership-human-capital");
    return { success: true };
}

export async function getLeadershipProfile(roleName?: string): Promise<LeadershipRoleData | null> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return null;

    let query = supabase
        .from("leadership_role_profiles")
        .select("*")
        .eq("user_business_id", business.id);

    if (roleName) {
        query = query.eq("role", roleName);
    }

    const { data, error } = await query.order("updated_at", { ascending: false }).limit(1).single();

    if (error || !data) return null;

    // Convert snake_case back to camelCase for frontend
    return {
        role: data.role,
        incumbent: data.incumbent,
        deputy: data.deputy,
        backupDeputy: data.backup_deputy,
        alternateBackup: data.alternate_backup,
        interimDays: data.interim_days,
        tier1Action: data.tier1_action,
        tier1Scope: data.tier1_scope,
        tier2Action: data.tier2_action,
        tier2Scope: data.tier2_scope,
        tier3Action: data.tier3_action,
        tier3Scope: data.tier3_scope,
        tier4Action: data.tier4_action,
        tier4Scope: data.tier4_scope,
        tier4DualControl1: data.tier4_dual_control_1,
        tier4DualControl2: data.tier4_dual_control_2,
        tier1Comms: data.tier1_comms,
        tier2Comms: data.tier2_comms,
        tier3Comms: data.tier3_comms,
        tier4Comms: data.tier4_comms,
        knowledgeItems: data.knowledge_items || [],
        knowledgeContext: data.knowledge_context,
        opexLimit: data.opex_limit,
        capexLimit: data.capex_limit,
        opexExcessApprover: data.opex_excess_approver,
        capexExcessApprover: data.capex_excess_approver,
        canSignNDAs: data.can_sign_ndas,
        canSignVendor: data.can_sign_vendor,
        canSignEmployment: data.can_sign_employment,
        canSignChecks: data.can_sign_checks,
        requiresDualControl: data.requires_dual_control,
        escalationPathway: data.escalation_pathway,
        approverRole: data.approver_role,
        legacyRecordings: data.legacy_recordings || [],
        legacyRelationships: data.legacy_relationships || [],
        mentoringCadence: data.mentoring_cadence,
        mentoringFocus: data.mentoring_focus,
        upstreamCadence: data.upstream_cadence,
        upstreamFocus: data.upstream_focus,
        mentoringUpstream: data.mentoring_upstream || [],
        mentoringDownstream: data.mentoring_downstream || [],
        complianceLog: data.compliance_log || [],
        completedAt: data.completed_at,
        expiryDate: data.expiry_date,
    };
}

export async function getAllLeadershipProfiles(): Promise<LeadershipRoleData[]> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return [];

    const { data, error } = await supabase
        .from("leadership_role_profiles")
        .select("*")
        .eq("user_business_id", business.id)
        .order("updated_at", { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
        role: d.role,
        incumbent: d.incumbent,
        deputy: d.deputy,
        backupDeputy: d.backup_deputy,
        alternateBackup: d.alternate_backup,
        interimDays: d.interim_days,
        tier1Action: d.tier1_action,
        tier1Scope: d.tier1_scope,
        tier2Action: d.tier2_action,
        tier2Scope: d.tier2_scope,
        tier3Action: d.tier3_action,
        tier3Scope: d.tier3_scope,
        tier4Action: d.tier4_action,
        tier4Scope: d.tier4_scope,
        tier4DualControl1: d.tier4_dual_control_1,
        tier4DualControl2: d.tier4_dual_control_2,
        tier1Comms: d.tier1_comms,
        tier2Comms: d.tier2_comms,
        tier3Comms: d.tier3_comms,
        tier4Comms: d.tier4_comms,
        knowledgeItems: d.knowledge_items || [],
        knowledgeContext: d.knowledge_context,
        opexLimit: d.opex_limit,
        capexLimit: d.capex_limit,
        opexExcessApprover: d.opex_excess_approver,
        capexExcessApprover: d.capex_excess_approver,
        canSignNDAs: d.can_sign_ndas,
        canSignVendor: d.can_sign_vendor,
        canSignEmployment: d.can_sign_employment,
        canSignChecks: d.can_sign_checks,
        requiresDualControl: d.requires_dual_control,
        escalationPathway: d.escalation_pathway,
        approverRole: d.approver_role,
        legacyRecordings: d.legacy_recordings || [],
        legacyRelationships: d.legacy_relationships || [],
        mentoringCadence: d.mentoring_cadence,
        mentoringFocus: d.mentoring_focus,
        upstreamCadence: d.upstream_cadence,
        upstreamFocus: d.upstream_focus,
    }));
}

// ==================== FINANCIAL RESILIENCE PROFILE ACTIONS ====================

interface RevenueStream {
    id: string;
    name: string;
    amount: number;
    frequency: string;
    reliability: string;
}

interface ExpenseCategory {
    id: string;
    name: string;
    amount: number;
    type: string;
    fixedOrVariable: string;
}

interface StressScenario {
    id: string;
    name: string;
    revenueImpactPct: number;
    expenseImpactPct: number;
    durationMonths: number;
    probability: string;
}

interface FundingSource {
    id: string;
    source: string;
    amount: number;
    accessTime: string;
    terms: string;
}

interface BufferLocation {
    id: string;
    institution: string;
    accountType: string;
    balance: number;
    tier: number;
}

interface InsurancePolicy {
    id: string;
    type: string;
    provider: string;
    coverageAmount: number;
    deductible: number;
    premium: number;
    expiryDate: string;
    policyNumber: string;
}

interface InsuranceGap {
    id: string;
    gapType: string;
    description: string;
    priority: string;
}

interface BankingContact {
    id: string;
    bankName: string;
    accountType: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    isPrimary: boolean;
    creditLineAmount: number;
}

interface FinancialContact {
    id: string;
    role: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    accessLevel: string;
    hasCredentials: boolean;
    isSuccessor: boolean;
}

interface RecoveryProtocol {
    id: string;
    scenarioId: string;
    triggerCondition: string;
    immediateActions: string;
    responsibleParty: string;
    timelineDays: number;
}

interface AccessControl {
    id: string;
    system: string;
    users: string[];
    accessLevel: string;
    requires2fa: boolean;
}

interface ComplianceLogEntry {
    id: string;
    date: string;
    reviewer: string;
    status: string;
    notes: string;
}

export interface FinancialResilienceData {
    // Step 1: Financial Overview
    businessType?: string;
    annualRevenue?: number;
    monthlyBurnRate?: number;
    runwayMonths?: number;
    fiscalYearEnd?: string;

    // Step 2: Cash Flow Analysis
    revenueStreams?: RevenueStream[];
    expenseCategories?: ExpenseCategory[];
    cashFlowCycle?: string;
    averageCollectionDays?: number;
    averagePaymentDays?: number;

    // Step 3: Stress Test Scenarios
    stressScenarios?: StressScenario[];
    baselineMonthlyCashFlow?: number;

    // Step 4: Emergency Fund
    targetFundAmount?: number;
    currentFundBalance?: number;
    targetMonthsCoverage?: number;
    fundingSources?: FundingSource[];

    // Step 5: Liquidity Buffers
    tier1Buffer?: number;
    tier2Buffer?: number;
    tier3Buffer?: number;
    bufferLocations?: BufferLocation[];

    // Step 6: Insurance Coverage
    insurancePolicies?: InsurancePolicy[];
    insuranceGaps?: InsuranceGap[];

    // Step 7: Banking Relationships
    bankingContacts?: BankingContact[];
    primaryBank?: string;
    backupBank?: string;
    totalCreditAvailable?: number;

    // Step 8: Financial Backup Contacts
    financialContacts?: FinancialContact[];
    cfoSuccessor?: string;
    accountantSuccessor?: string;

    // Step 9: Recovery Protocols
    recoveryProtocols?: RecoveryProtocol[];
    escalationThreshold?: number;
    boardNotificationThreshold?: number;

    // Step 10: Financial Controls
    requireDualSignature?: boolean;
    dualSignatureThreshold?: number;
    approvalThresholds?: Record<string, Record<string, number>>;
    accessControls?: AccessControl[];
    segregationOfDuties?: boolean;

    // Step 11: Compliance & Review
    lastReviewDate?: string;
    nextReviewDate?: string;
    complianceLog?: ComplianceLogEntry[];
    completedAt?: string;
    expiryDate?: string;
}

export async function saveFinancialResilienceProfile(data: FinancialResilienceData) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return { error: "Business not found" };

    // Convert camelCase to snake_case for database
    const dbData = {
        user_business_id: business.id,

        // Step 1
        business_type: data.businessType,
        annual_revenue: data.annualRevenue || 0,
        monthly_burn_rate: data.monthlyBurnRate || 0,
        runway_months: data.runwayMonths || 0,
        fiscal_year_end: data.fiscalYearEnd,

        // Step 2
        revenue_streams: data.revenueStreams || [],
        expense_categories: data.expenseCategories || [],
        cash_flow_cycle: data.cashFlowCycle,
        average_collection_days: data.averageCollectionDays || 30,
        average_payment_days: data.averagePaymentDays || 30,

        // Step 3
        stress_scenarios: data.stressScenarios || [],
        baseline_monthly_cash_flow: data.baselineMonthlyCashFlow || 0,

        // Step 4
        target_fund_amount: data.targetFundAmount || 0,
        current_fund_balance: data.currentFundBalance || 0,
        target_months_coverage: data.targetMonthsCoverage || 6,
        funding_sources: data.fundingSources || [],

        // Step 5
        tier1_buffer: data.tier1Buffer || 0,
        tier2_buffer: data.tier2Buffer || 0,
        tier3_buffer: data.tier3Buffer || 0,
        buffer_locations: data.bufferLocations || [],

        // Step 6
        insurance_policies: data.insurancePolicies || [],
        insurance_gaps: data.insuranceGaps || [],

        // Step 7
        banking_contacts: data.bankingContacts || [],
        primary_bank: data.primaryBank,
        backup_bank: data.backupBank,
        total_credit_available: data.totalCreditAvailable || 0,

        // Step 8
        financial_contacts: data.financialContacts || [],
        cfo_successor: data.cfoSuccessor,
        accountant_successor: data.accountantSuccessor,

        // Step 9
        recovery_protocols: data.recoveryProtocols || [],
        escalation_threshold: data.escalationThreshold || 0,
        board_notification_threshold: data.boardNotificationThreshold || 0,

        // Step 10
        require_dual_signature: data.requireDualSignature || false,
        dual_signature_threshold: data.dualSignatureThreshold || 10000,
        approval_thresholds: data.approvalThresholds || {},
        access_controls: data.accessControls || [],
        segregation_of_duties: data.segregationOfDuties || false,

        // Step 11
        last_review_date: data.lastReviewDate,
        next_review_date: data.nextReviewDate,
        compliance_log: data.complianceLog || [],
        completed_at: data.completedAt,
        expiry_date: data.expiryDate,
    };

    const { error } = await supabase
        .from("financial_resilience_profiles")
        .upsert(dbData, {
            onConflict: "user_business_id",
            ignoreDuplicates: false
        });

    if (error) {
        console.error("Save financial resilience profile error:", error);
        return { error: "Failed to save profile" };
    }

    revalidatePath("/dashboard/marketplace/financial-resilience");
    return { success: true };
}

export async function getFinancialResilienceProfile(): Promise<FinancialResilienceData | null> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) return null;

    const { data, error } = await supabase
        .from("financial_resilience_profiles")
        .select("*")
        .eq("user_business_id", business.id)
        .single();

    if (error || !data) return null;

    // Convert snake_case back to camelCase for frontend
    return {
        // Step 1
        businessType: data.business_type,
        annualRevenue: data.annual_revenue,
        monthlyBurnRate: data.monthly_burn_rate,
        runwayMonths: data.runway_months,
        fiscalYearEnd: data.fiscal_year_end,

        // Step 2
        revenueStreams: data.revenue_streams || [],
        expenseCategories: data.expense_categories || [],
        cashFlowCycle: data.cash_flow_cycle,
        averageCollectionDays: data.average_collection_days,
        averagePaymentDays: data.average_payment_days,

        // Step 3
        stressScenarios: data.stress_scenarios || [],
        baselineMonthlyCashFlow: data.baseline_monthly_cash_flow,

        // Step 4
        targetFundAmount: data.target_fund_amount,
        currentFundBalance: data.current_fund_balance,
        targetMonthsCoverage: data.target_months_coverage,
        fundingSources: data.funding_sources || [],

        // Step 5
        tier1Buffer: data.tier1_buffer,
        tier2Buffer: data.tier2_buffer,
        tier3Buffer: data.tier3_buffer,
        bufferLocations: data.buffer_locations || [],

        // Step 6
        insurancePolicies: data.insurance_policies || [],
        insuranceGaps: data.insurance_gaps || [],

        // Step 7
        bankingContacts: data.banking_contacts || [],
        primaryBank: data.primary_bank,
        backupBank: data.backup_bank,
        totalCreditAvailable: data.total_credit_available,

        // Step 8
        financialContacts: data.financial_contacts || [],
        cfoSuccessor: data.cfo_successor,
        accountantSuccessor: data.accountant_successor,

        // Step 9
        recoveryProtocols: data.recovery_protocols || [],
        escalationThreshold: data.escalation_threshold,
        boardNotificationThreshold: data.board_notification_threshold,

        // Step 10
        requireDualSignature: data.require_dual_signature,
        dualSignatureThreshold: data.dual_signature_threshold,
        approvalThresholds: data.approval_thresholds || {},
        accessControls: data.access_controls || [],
        segregationOfDuties: data.segregation_of_duties,

        // Step 11
        lastReviewDate: data.last_review_date,
        nextReviewDate: data.next_review_date,
        complianceLog: data.compliance_log || [],
        completedAt: data.completed_at,
        expiryDate: data.expiry_date,
    };
}
