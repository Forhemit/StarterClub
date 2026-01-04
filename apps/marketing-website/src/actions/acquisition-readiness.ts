"use server";

import { createSupabaseServerClient as createClient } from "@/lib/supabase/server";
import { AcquisitionReadinessData, INITIAL_DATA } from "@/components/dashboard/acquisition/types";

export async function getAcquisitionReadinessData(): Promise<AcquisitionReadinessData> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) return INITIAL_DATA;

    const { data } = await supabase
        .from('acquisition_readiness_profiles')
        .select('*')
        .eq('user_id', user.data.user.id)
        .single();

    if (!data) return INITIAL_DATA;

    // Transform DB snake_case to TS camelCase/structure if needed
    // Our types mostly match existing structure except documents jsonb
    return {
        ...INITIAL_DATA, // fallback for missing fields
        company_name: data.company_name || "",
        data_room_url: data.data_room_url || "",
        documents_uploaded: data.documents_uploaded || 0,
        financial_audit_status: data.financial_audit_status as any || "not_started",
        legal_audit_status: data.legal_audit_status as any || "not_started",
        tech_audit_status: data.tech_audit_status as any || "not_started",
        red_flags: data.red_flags || [],
        deal_stage: data.deal_stage as any || "preparation",
        last_updated: data.updated_at,
        documents: data.documents || INITIAL_DATA.documents,
    };
}

export async function saveAcquisitionReadinessData(data: AcquisitionReadinessData): Promise<void> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) throw new Error("Unauthorized");

    const payload = {
        user_id: user.data.user.id,
        company_name: data.company_name,
        data_room_url: data.data_room_url,
        documents_uploaded: data.documents_uploaded,
        financial_audit_status: data.financial_audit_status,
        legal_audit_status: data.legal_audit_status,
        tech_audit_status: data.tech_audit_status,
        red_flags: data.red_flags,
        deal_stage: data.deal_stage,
        documents: data.documents,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('acquisition_readiness_profiles')
        .upsert(payload, { onConflict: 'user_id' });

    if (error) {
        console.error("Error saving acquisition data:", error);
        throw new Error("Failed to save data");
    }
}

export async function resetAcquisitionReadinessData(): Promise<void> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('acquisition_readiness_profiles')
        .delete()
        .eq('user_id', user.data.user.id);

    if (error) {
        console.error("Error resetting acquisition data:", error);
        throw new Error("Failed to reset data");
    }
}
