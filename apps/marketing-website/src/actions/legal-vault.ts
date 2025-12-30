'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { legalEntitySchema, LegalEntityInput } from "@/lib/validators/legal-vault-schema";
import { auth } from "@clerk/nextjs/server";

export async function createOrUpdateLegalEntity(data: LegalEntityInput) {
    const supabase = await createSupabaseServerClient();

    // Get current user from Clerk
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Validate Input
    const parseResult = legalEntitySchema.safeParse(data);
    if (!parseResult.success) {
        // Return structured error instead of throwing (client should handle looking for .error)
        // Or at least throw a plain string that doesn't look like a crash
        return { error: `Validation failed: ${parseResult.error.issues.map(e => e.message).join(", ")}` };
    }
    const validatedData = parseResult.data;

    // Convert Date object to string if present
    const payload: Record<string, unknown> = {
        company_name: validatedData.company_name,
        dba_name: validatedData.dba_name,
        organization_type: validatedData.organization_type,
        formation_in_progress: validatedData.formation_in_progress ?? false,
        primary_state: validatedData.primary_state,
        business_purpose: validatedData.business_purpose,
        naics_code: validatedData.naics_code,
        skip_business_purpose: validatedData.skip_business_purpose ?? false,
        business_address_line1: validatedData.business_address_line1,
        business_address_line2: validatedData.business_address_line2,
        business_city: validatedData.business_city,
        business_state: validatedData.business_state,
        business_zip: validatedData.business_zip,
        company_phone: validatedData.company_phone,
        company_email: validatedData.company_email,
        registered_agent_name: validatedData.registered_agent_name,
        registered_agent_phone: validatedData.registered_agent_phone,
        registered_agent_email: validatedData.registered_agent_email,
        registered_agent_website: validatedData.registered_agent_website,
        // Identifiers
        ein: validatedData.ein,
        state_tax_id: validatedData.state_tax_id,
        state_tax_id_status: validatedData.state_tax_id_status,
        duns_number: validatedData.duns_number,
        // Comments
        comments: validatedData.comments,
        // Enforce Owner
        user_id: userId
    };

    if (validatedData.nonprofit_type) {
        payload.nonprofit_type = validatedData.nonprofit_type;
    }

    if (validatedData.formation_date) {
        payload.formation_date = validatedData.formation_date.toISOString().split('T')[0];
    }

    if (validatedData.id) {
        // Update existing - Enforce ownership check via RLS, but explicit check here is good too

        const { error } = await supabase
            .from('legal_entities')
            .update(payload)
            .eq('id', validatedData.id)
            .eq('user_id', userId); // Explicit defense in depth

        if (error) {
            console.error('Error updating legal entity:', error);
            throw new Error('Failed to update entity');
        }
        return { id: validatedData.id };
    } else {
        // Create new
        const { data: newEntity, error } = await supabase
            .from('legal_entities')
            .insert(payload)
            .select('id')
            .single();

        if (error) {
            console.error('Error creating legal entity:', error);
            throw new Error(`Failed to create entity: ${error.message} (code: ${error.code})`);
        }
        return { id: newEntity.id };
    }
}

export async function getLegalEntity() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return null;

    // Explicitly filter by user_id
    const { data, error } = await supabase
        .from('legal_entities')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // no rows found
            return null;
        }
        console.error('Error fetching legal entity:', error);
        return null;
    }

    return data;
}

export async function resetLegalEntity(entityId: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('legal_entities')
        .delete()
        .eq('id', entityId)
        .eq('user_id', userId); // Validating ownership

    if (error) {
        console.error('Error resetting legal entity:', error);
        throw new Error('Failed to reset entity');
    }

    return { success: true };
}
