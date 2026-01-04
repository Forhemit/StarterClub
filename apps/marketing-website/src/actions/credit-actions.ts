"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type {
    PersonalCreditData,
    BusinessCreditData,
    Tradeline,
    Inquiry
} from "@/components/credit/types";

// ==================== PERSONAL CREDIT ====================

export async function getPersonalCreditProfile(): Promise<PersonalCreditData | null> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return null;

    const { data, error } = await supabase
        .from("personal_credit_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching personal credit profile:", error);
        return null;
    }

    if (!data) return null;

    // Convert snake_case to camelCase
    return {
        id: data.id,
        userId: data.user_id,
        firstName: data.first_name,
        lastName: data.last_name,
        ssnLastFour: data.ssn_last_four,
        dateOfBirth: data.date_of_birth,
        currentAddress: data.current_address,
        isIdentityVerified: data.is_identity_verified,
        gardeningModeEnabled: data.gardening_mode_enabled,
        gardeningModeStartDate: data.gardening_mode_start_date,
        fico8Experian: data.fico_8_experian,
        fico8Transunion: data.fico_8_transunion,
        fico8Equifax: data.fico_8_equifax,
        vantage3Score: data.vantage_3_score,
        scoresUpdatedAt: data.scores_updated_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        completedAt: data.completed_at,
    };
}

export async function savePersonalCreditProfile(
    profileData: Partial<PersonalCreditData>
): Promise<{ success: boolean; error?: string; data?: PersonalCreditData }> {
    try {
        const supabase = await createSupabaseServerClient();
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Not authenticated" };

        // Convert camelCase to snake_case
        const dbData = {
            user_id: userId,
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            ssn_last_four: profileData.ssnLastFour,
            date_of_birth: profileData.dateOfBirth,
            current_address: profileData.currentAddress,
            is_identity_verified: profileData.isIdentityVerified,
            gardening_mode_enabled: profileData.gardeningModeEnabled,
            gardening_mode_start_date: profileData.gardeningModeStartDate,
            fico_8_experian: profileData.fico8Experian,
            fico_8_transunion: profileData.fico8Transunion,
            fico_8_equifax: profileData.fico8Equifax,
            vantage_3_score: profileData.vantage3Score,
            scores_updated_at: profileData.scoresUpdatedAt || new Date().toISOString(),
            completed_at: profileData.completedAt,
        };

        // Remove undefined values
        const cleanData = Object.fromEntries(
            Object.entries(dbData).filter(([, v]) => v !== undefined)
        );

        const { data, error } = await supabase
            .from("personal_credit_profiles")
            .upsert(cleanData, { onConflict: "user_id" })
            .select()
            .single();

        if (error) {
            console.error("Error saving personal credit profile:", error);
            return { success: false, error: error.message };
        }

        try {
            revalidatePath("/dashboard/marketplace/personal-credit");
        } catch (e) {
            console.error("Revalidate failed:", e);
        }

        // Return the converted data
        return {
            success: true,
            data: {
                id: data.id,
                userId: data.user_id,
                firstName: data.first_name,
                lastName: data.last_name,
                ssnLastFour: data.ssn_last_four,
                dateOfBirth: data.date_of_birth,
                currentAddress: data.current_address,
                isIdentityVerified: data.is_identity_verified,
                gardeningModeEnabled: data.gardening_mode_enabled,
                gardeningModeStartDate: data.gardening_mode_start_date,
                fico8Experian: data.fico_8_experian,
                fico8Transunion: data.fico_8_transunion,
                fico8Equifax: data.fico_8_equifax,
                vantage3Score: data.vantage_3_score,
                scoresUpdatedAt: data.scores_updated_at,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                completedAt: data.completed_at,
            }
        };
    } catch (error) {
        console.error("Unexpected error in savePersonalCreditProfile:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function deletePersonalCreditProfile(): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createSupabaseServerClient();
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Not authenticated" };

        // Delete associated tradelines
        await supabase
            .from("credit_tradelines")
            .delete()
            .eq("user_id", userId)
            .eq("is_business_credit", false);

        // Delete associated inquiries
        await supabase
            .from("credit_inquiries")
            .delete()
            .eq("user_id", userId)
            .not("personal_profile_id", "is", null);

        // Delete the profile
        const { error } = await supabase
            .from("personal_credit_profiles")
            .delete()
            .eq("user_id", userId);

        if (error) {
            console.error("Error deleting personal credit profile:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard/marketplace/personal-credit");
        return { success: true };
    } catch (error) {
        console.error("Unexpected error in deletePersonalCreditProfile:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

// ==================== BUSINESS CREDIT ====================

export async function getBusinessCreditProfile(): Promise<BusinessCreditData | null> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return null;

    const { data, error } = await supabase
        .from("business_credit_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching business credit profile:", error);
        return null;
    }

    if (!data) return null;

    return {
        id: data.id,
        userId: data.user_id,
        legalBusinessName: data.legal_business_name,
        dbaName: data.dba_name,
        einLastFour: data.ein_last_four,
        entityType: data.entity_type,
        formationState: data.formation_state,
        formationDate: data.formation_date,
        dunsNumber: data.duns_number,
        experianBin: data.experian_bin,
        isSosActive: data.is_sos_active,
        isEinVerified: data.is_ein_verified,
        is411Listed: data.is_411_listed,
        isAddressCommercial: data.is_address_commercial,
        naicsCode: data.naics_code,
        naicsRiskLevel: data.naics_risk_level,
        complianceScore: data.compliance_score,
        paydexScore: data.paydex_score,
        intelliscorePlus: data.intelliscore_plus,
        ficoSbss: data.fico_sbss,
        scoresUpdatedAt: data.scores_updated_at,
        currentTier: data.current_tier,
        tier1Complete: data.tier_1_complete,
        tier2Complete: data.tier_2_complete,
        tier3Complete: data.tier_3_complete,
        tier4Complete: data.tier_4_complete,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        completedAt: data.completed_at,
    };
}

export async function saveBusinessCreditProfile(
    profileData: Partial<BusinessCreditData>
): Promise<{ success: boolean; error?: string; data?: BusinessCreditData }> {
    try {
        const supabase = await createSupabaseServerClient();
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Not authenticated" };

        // Calculate compliance score based on flags
        let complianceScore = 0;
        if (profileData.isSosActive) complianceScore += 25;
        if (profileData.isEinVerified) complianceScore += 25;
        if (profileData.is411Listed) complianceScore += 25;
        if (profileData.isAddressCommercial) complianceScore += 25;

        const dbData = {
            user_id: userId,
            legal_business_name: profileData.legalBusinessName,
            dba_name: profileData.dbaName,
            ein_last_four: profileData.einLastFour,
            entity_type: profileData.entityType,
            formation_state: profileData.formationState,
            formation_date: profileData.formationDate,
            duns_number: profileData.dunsNumber,
            experian_bin: profileData.experianBin,
            is_sos_active: profileData.isSosActive,
            is_ein_verified: profileData.isEinVerified,
            is_411_listed: profileData.is411Listed,
            is_address_commercial: profileData.isAddressCommercial,
            naics_code: profileData.naicsCode,
            naics_risk_level: profileData.naicsRiskLevel,
            compliance_score: complianceScore,
            paydex_score: profileData.paydexScore,
            intelliscore_plus: profileData.intelliscorePlus,
            fico_sbss: profileData.ficoSbss,
            scores_updated_at: profileData.scoresUpdatedAt || new Date().toISOString(),
            current_tier: profileData.currentTier,
            tier_1_complete: profileData.tier1Complete,
            tier_2_complete: profileData.tier2Complete,
            tier_3_complete: profileData.tier3Complete,
            tier_4_complete: profileData.tier4Complete,
            completed_at: profileData.completedAt,
        };

        const cleanData = Object.fromEntries(
            Object.entries(dbData).filter(([, v]) => v !== undefined)
        );

        const { data, error } = await supabase
            .from("business_credit_profiles")
            .upsert(cleanData, { onConflict: "user_id" })
            .select()
            .single();

        if (error) {
            console.error("Error saving business credit profile:", error);
            return { success: false, error: error.message };
        }

        try {
            revalidatePath("/dashboard/marketplace/business-credit");
        } catch (e) {
            console.error("Revalidate failed:", e);
        }

        return {
            success: true,
            data: {
                id: data.id,
                userId: data.user_id,
                legalBusinessName: data.legal_business_name,
                dbaName: data.dba_name,
                einLastFour: data.ein_last_four,
                entityType: data.entity_type,
                formationState: data.formation_state,
                formationDate: data.formation_date,
                dunsNumber: data.duns_number,
                experianBin: data.experian_bin,
                isSosActive: data.is_sos_active,
                isEinVerified: data.is_ein_verified,
                is411Listed: data.is_411_listed,
                isAddressCommercial: data.is_address_commercial,
                naicsCode: data.naics_code,
                naicsRiskLevel: data.naics_risk_level,
                complianceScore: data.compliance_score,
                paydexScore: data.paydex_score,
                intelliscorePlus: data.intelliscore_plus,
                ficoSbss: data.fico_sbss,
                scoresUpdatedAt: data.scores_updated_at,
                currentTier: data.current_tier,
                tier1Complete: data.tier_1_complete,
                tier2Complete: data.tier_2_complete,
                tier3Complete: data.tier_3_complete,
                tier4Complete: data.tier_4_complete,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                completedAt: data.completed_at,
            }
        };
    } catch (error) {
        console.error("Unexpected error in saveBusinessCreditProfile:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function deleteBusinessCreditProfile(): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createSupabaseServerClient();
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Not authenticated" };

        // Delete associated tradelines
        await supabase
            .from("credit_tradelines")
            .delete()
            .eq("user_id", userId)
            .eq("is_business_credit", true);

        // Delete the profile
        const { error } = await supabase
            .from("business_credit_profiles")
            .delete()
            .eq("user_id", userId);

        if (error) {
            console.error("Error deleting business credit profile:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard/marketplace/business-credit");
        return { success: true };
    } catch (error) {
        console.error("Unexpected error in deleteBusinessCreditProfile:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

// ==================== TRADELINES ====================

export async function getTradelines(
    isBusinessCredit: boolean = false
): Promise<Tradeline[]> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return [];

    const { data, error } = await supabase
        .from("credit_tradelines")
        .select("*")
        .eq("user_id", userId)
        .eq("is_business_credit", isBusinessCredit)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tradelines:", error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        personalProfileId: row.personal_profile_id,
        businessProfileId: row.business_profile_id,
        creditorName: row.creditor_name,
        accountType: row.account_type,
        accountStatus: row.account_status,
        creditLimit: row.credit_limit,
        currentBalance: row.current_balance,
        minimumPayment: row.minimum_payment,
        dateOpened: row.date_opened,
        lastPaymentDate: row.last_payment_date,
        statementCloseDate: row.statement_close_date,
        isBusinessCredit: row.is_business_credit,
        tierLevel: row.tier_level,
        hasPersonalGuarantee: row.has_personal_guarantee,
        reportsToPersonal: row.reports_to_personal,
        reportsToExperian: row.reports_to_experian,
        reportsToTransunion: row.reports_to_transunion,
        reportsToEquifax: row.reports_to_equifax,
        reportsToDnb: row.reports_to_dnb,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }));
}

export async function saveTradeline(
    tradeline: Partial<Tradeline>
): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
        const supabase = await createSupabaseServerClient();
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Not authenticated" };

        const dbData = {
            id: tradeline.id || undefined,
            user_id: userId,
            personal_profile_id: tradeline.personalProfileId,
            business_profile_id: tradeline.businessProfileId,
            creditor_name: tradeline.creditorName,
            account_type: tradeline.accountType,
            account_status: tradeline.accountStatus,
            credit_limit: tradeline.creditLimit,
            current_balance: tradeline.currentBalance,
            minimum_payment: tradeline.minimumPayment,
            date_opened: tradeline.dateOpened,
            last_payment_date: tradeline.lastPaymentDate,
            statement_close_date: tradeline.statementCloseDate,
            is_business_credit: tradeline.isBusinessCredit,
            tier_level: tradeline.tierLevel,
            has_personal_guarantee: tradeline.hasPersonalGuarantee,
            reports_to_personal: tradeline.reportsToPersonal,
            reports_to_experian: tradeline.reportsToExperian,
            reports_to_transunion: tradeline.reportsToTransunion,
            reports_to_equifax: tradeline.reportsToEquifax,
            reports_to_dnb: tradeline.reportsToDnb,
        };

        const cleanData = Object.fromEntries(
            Object.entries(dbData).filter(([, v]) => v !== undefined)
        );

        if (tradeline.id) {
            // Update existing
            const { error } = await supabase
                .from("credit_tradelines")
                .update(cleanData)
                .eq("id", tradeline.id);

            if (error) {
                return { success: false, error: error.message };
            }
            return { success: true, id: tradeline.id };
        } else {
            // Insert new
            const { data, error } = await supabase
                .from("credit_tradelines")
                .insert(cleanData)
                .select("id")
                .single();

            if (error) {
                return { success: false, error: error.message };
            }
            return { success: true, id: data.id };
        }
    } catch (error) {
        console.error("Error in saveTradeline:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function deleteTradeline(
    id: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return { success: false, error: "Not authenticated" };

    const { error } = await supabase
        .from("credit_tradelines")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

// ==================== INQUIRIES ====================

export async function getInquiries(
    isBusinessCredit: boolean = false
): Promise<Inquiry[]> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return [];

    const profileField = isBusinessCredit
        ? "business_profile_id"
        : "personal_profile_id";

    const { data, error } = await supabase
        .from("credit_inquiries")
        .select("*")
        .eq("user_id", userId)
        .not(profileField, "is", null)
        .order("inquiry_date", { ascending: false });

    if (error) {
        console.error("Error fetching inquiries:", error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        personalProfileId: row.personal_profile_id,
        businessProfileId: row.business_profile_id,
        creditorName: row.creditor_name,
        inquiryDate: row.inquiry_date,
        isHardPull: row.is_hard_pull,
        bureau: row.bureau,
        impactEndsDate: row.impact_ends_date,
        visibilityEndsDate: row.visibility_ends_date,
        createdAt: row.created_at,
    }));
}

export async function saveInquiry(
    inquiry: Partial<Inquiry>
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createSupabaseServerClient();
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Not authenticated" };

        // Calculate impact and visibility end dates
        const inquiryDate = inquiry.inquiryDate
            ? new Date(inquiry.inquiryDate)
            : new Date();

        const impactEnds = new Date(inquiryDate);
        impactEnds.setFullYear(impactEnds.getFullYear() + 1); // 12 months

        const visibilityEnds = new Date(inquiryDate);
        visibilityEnds.setFullYear(visibilityEnds.getFullYear() + 2); // 24 months

        const dbData = {
            user_id: userId,
            personal_profile_id: inquiry.personalProfileId,
            business_profile_id: inquiry.businessProfileId,
            creditor_name: inquiry.creditorName,
            inquiry_date: inquiry.inquiryDate,
            is_hard_pull: inquiry.isHardPull,
            bureau: inquiry.bureau,
            impact_ends_date: impactEnds.toISOString().split('T')[0],
            visibility_ends_date: visibilityEnds.toISOString().split('T')[0],
        };

        const { error } = await supabase
            .from("credit_inquiries")
            .insert(dbData);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Error in saveInquiry:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function deleteInquiry(
    id: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return { success: false, error: "Not authenticated" };

    const { error } = await supabase
        .from("credit_inquiries")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
