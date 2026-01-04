'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { positionSOPSchema, PositionSOPInput } from "@/lib/validators/sop-generator-schema";
import { auth } from "@clerk/nextjs/server";
import { PositionSOPData, Responsibility, Authority, Metric, Requirement, Tool } from "@/components/dashboard/sop-generator/types";

// Get current user's Position SOP with all related data
export async function getPositionSOP(): Promise<PositionSOPData | null> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return null;

    // Fetch main SOP
    const { data: sop, error } = await supabase
        .from('position_sops')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        console.error('Error fetching position SOP:', error);
        return null;
    }

    if (!sop) return null;

    // Fetch related data in parallel
    const [responsibilities, authorities, metrics, requirements, tools] = await Promise.all([
        supabase.from('position_responsibilities').select('*').eq('position_sop_id', sop.id).order('sort_order'),
        supabase.from('position_authorities').select('*').eq('position_sop_id', sop.id).order('sort_order'),
        supabase.from('position_metrics').select('*').eq('position_sop_id', sop.id).order('sort_order'),
        supabase.from('position_requirements').select('*').eq('position_sop_id', sop.id).order('sort_order'),
        supabase.from('position_tools').select('*').eq('position_sop_id', sop.id).order('sort_order'),
    ]);

    return {
        ...sop,
        responsibilities: (responsibilities.data || []) as Responsibility[],
        authorities: (authorities.data || []) as Authority[],
        metrics: (metrics.data || []) as Metric[],
        requirements: (requirements.data || []) as Requirement[],
        tools: (tools.data || []) as Tool[],
    };
}

// Create or update core SOP record
async function createOrUpdateSOPCore(data: PositionSOPInput, userId: string) {
    const supabase = await createSupabaseServerClient();

    const payload: Record<string, unknown> = {
        title: data.title,
        department: data.department,
        position_type: data.position_type,
        flsa_status: data.flsa_status,
        work_arrangement: data.work_arrangement,
        location: data.location,
        reports_to: data.reports_to,
        mission_statement: data.mission_statement,
        impact_statement: data.impact_statement,
        version: data.version,
        review_frequency: data.review_frequency,
        status: data.status,
        user_id: userId,
    };

    // Handle dates
    if (data.effective_date) {
        payload.effective_date = typeof data.effective_date === 'string'
            ? data.effective_date
            : data.effective_date.toISOString().split('T')[0];
    }
    if (data.next_review_date) {
        payload.next_review_date = typeof data.next_review_date === 'string'
            ? data.next_review_date
            : data.next_review_date.toISOString().split('T')[0];
    }

    if (data.id) {
        // Update existing
        const { error } = await supabase
            .from('position_sops')
            .update(payload)
            .eq('id', data.id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating position SOP:', error);
            throw new Error('Failed to update SOP');
        }
        return { id: data.id };
    } else {
        // Create new
        const { data: newSOP, error } = await supabase
            .from('position_sops')
            .insert(payload)
            .select('id')
            .single();

        if (error) {
            console.error('Error creating position SOP:', error);
            throw new Error(`Failed to create SOP: ${error.message}`);
        }
        return { id: newSOP.id };
    }
}

// Save responsibilities
async function saveResponsibilities(sopId: string, responsibilities: Responsibility[]) {
    const supabase = await createSupabaseServerClient();

    // Delete existing and re-insert (simpler than upsert for array ordering)
    await supabase.from('position_responsibilities').delete().eq('position_sop_id', sopId);

    if (responsibilities.length === 0) return;

    const payload = responsibilities.map((r, index) => ({
        position_sop_id: sopId,
        responsibility_area: r.responsibility_area,
        key_activities: r.key_activities,
        time_allocation: r.time_allocation,
        priority: r.priority,
        sort_order: index,
    }));

    const { error } = await supabase.from('position_responsibilities').insert(payload);
    if (error) console.error('Error saving responsibilities:', error);
}

// Save authorities
async function saveAuthorities(sopId: string, authorities: Authority[]) {
    const supabase = await createSupabaseServerClient();

    await supabase.from('position_authorities').delete().eq('position_sop_id', sopId);

    if (authorities.length === 0) return;

    const payload = authorities.map((a, index) => ({
        position_sop_id: sopId,
        decision_area: a.decision_area,
        authority_level: a.authority_level,
        approval_required: a.approval_required,
        escalation_path: a.escalation_path,
        sort_order: index,
    }));

    const { error } = await supabase.from('position_authorities').insert(payload);
    if (error) console.error('Error saving authorities:', error);
}

// Save metrics
async function saveMetrics(sopId: string, metrics: Metric[]) {
    const supabase = await createSupabaseServerClient();

    await supabase.from('position_metrics').delete().eq('position_sop_id', sopId);

    if (metrics.length === 0) return;

    const payload = metrics.map((m, index) => ({
        position_sop_id: sopId,
        metric_name: m.metric_name,
        target: m.target,
        measurement_frequency: m.measurement_frequency,
        metric_weight: m.metric_weight,
        data_source: m.data_source,
        sort_order: index,
    }));

    const { error } = await supabase.from('position_metrics').insert(payload);
    if (error) console.error('Error saving metrics:', error);
}

// Save requirements
async function saveRequirements(sopId: string, requirements: Requirement[]) {
    const supabase = await createSupabaseServerClient();

    await supabase.from('position_requirements').delete().eq('position_sop_id', sopId);

    if (requirements.length === 0) return;

    const payload = requirements.map((r, index) => ({
        position_sop_id: sopId,
        requirement_type: r.requirement_type,
        description: r.description,
        is_minimum: r.is_minimum,
        is_preferred: r.is_preferred,
        sort_order: index,
    }));

    const { error } = await supabase.from('position_requirements').insert(payload);
    if (error) console.error('Error saving requirements:', error);
}

// Save tools
async function saveTools(sopId: string, tools: Tool[]) {
    const supabase = await createSupabaseServerClient();

    await supabase.from('position_tools').delete().eq('position_sop_id', sopId);

    if (tools.length === 0) return;

    const payload = tools.map((t, index) => ({
        position_sop_id: sopId,
        tool_name: t.tool_name,
        tool_category: t.tool_category,
        access_level: t.access_level,
        is_required: t.is_required,
        description: t.description,
        sort_order: index,
    }));

    const { error } = await supabase.from('position_tools').insert(payload);
    if (error) console.error('Error saving tools:', error);
}

// Main save function - saves SOP and all related data
export async function savePositionSOP(data: PositionSOPData): Promise<{ id: string }> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Validate core data
    const parseResult = positionSOPSchema.safeParse(data);
    if (!parseResult.success) {
        throw new Error(`Validation failed: ${parseResult.error.issues.map(e => e.message).join(", ")}`);
    }

    // Save core SOP
    const result = await createOrUpdateSOPCore(parseResult.data, userId);
    const sopId = result.id;

    // Save related data in parallel
    await Promise.all([
        saveResponsibilities(sopId, data.responsibilities || []),
        saveAuthorities(sopId, data.authorities || []),
        saveMetrics(sopId, data.metrics || []),
        saveRequirements(sopId, data.requirements || []),
        saveTools(sopId, data.tools || []),
    ]);

    return { id: sopId };
}

// Reset (delete) SOP and all related data
export async function resetPositionSOP(sopId: string): Promise<{ success: boolean }> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('position_sops')
        .delete()
        .eq('id', sopId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error resetting position SOP:', error);
        throw new Error('Failed to reset SOP');
    }

    return { success: true };
}

// Clone an existing SOP
export async function clonePositionSOP(sopId: string): Promise<{ id: string }> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = await createSupabaseServerClient();

    // Get existing SOP
    const { data: existingSOP, error: fetchError } = await supabase
        .from('position_sops')
        .select('*')
        .eq('id', sopId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !existingSOP) {
        throw new Error("SOP not found or unauthorized");
    }

    // Get related data
    const [responsibilities, authorities, metrics, requirements, tools] = await Promise.all([
        supabase.from('position_responsibilities').select('*').eq('position_sop_id', sopId),
        supabase.from('position_authorities').select('*').eq('position_sop_id', sopId),
        supabase.from('position_metrics').select('*').eq('position_sop_id', sopId),
        supabase.from('position_requirements').select('*').eq('position_sop_id', sopId),
        supabase.from('position_tools').select('*').eq('position_sop_id', sopId),
    ]);

    // Create new SOP as copy
    const newData: PositionSOPData = {
        ...existingSOP,
        id: undefined,
        title: `${existingSOP.title} (Copy)`,
        status: 'draft' as const,
        responsibilities: (responsibilities.data || []).map(r => ({ ...r, id: undefined })) as Responsibility[],
        authorities: (authorities.data || []).map(a => ({ ...a, id: undefined })) as Authority[],
        metrics: (metrics.data || []).map(m => ({ ...m, id: undefined })) as Metric[],
        requirements: (requirements.data || []).map(r => ({ ...r, id: undefined })) as Requirement[],
        tools: (tools.data || []).map(t => ({ ...t, id: undefined })) as Tool[],
    };

    return await savePositionSOP(newData);
}
