'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { legalEntitySchema, LegalEntityInput } from "@/lib/validators/legal-vault-schema";
import { auth } from "@clerk/nextjs/server";
import { createOrUpdateAddress } from "./addresses";
import { createOrUpdateContact } from "./contacts";
import { createOrUpdateLegalContact, AttorneyType } from "./legal-contacts";
import { LegalVaultData } from "@/components/dashboard/legal/types";

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
        if (typeof validatedData.formation_date === 'string') {
            payload.formation_date = validatedData.formation_date;
        } else {
            payload.formation_date = validatedData.formation_date.toISOString().split('T')[0];
        }
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

export async function saveLegalVaultProfile(data: LegalVaultData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Save Entity Core
    // We map LegalVaultData to LegalEntityInput
    const entityResult = await createOrUpdateLegalEntity({
        id: data.id,
        company_name: data.company_name,
        dba_name: data.dba_name,
        organization_type: data.organization_type,
        formation_in_progress: data.formation_in_progress,
        nonprofit_type: data.nonprofit_type,
        formation_date: data.formation_date,
        primary_state: data.primary_state,
        business_purpose: data.business_purpose,
        naics_code: data.naics_code,
        skip_business_purpose: data.skip_business_purpose,
        registered_agent_name: data.registered_agent_name,
        registered_agent_phone: data.registered_agent_phone,
        registered_agent_email: data.registered_agent_email,
        registered_agent_website: data.registered_agent_website,
        ein: data.ein,
        state_tax_id: data.state_tax_id,
        state_tax_id_status: data.state_tax_id_status,
        duns_number: data.duns_number,
        comments: typeof data.comments === 'string' ? data.comments : undefined,
    });

    if (!entityResult || !entityResult.id) {
        throw new Error("Failed to save core entity");
    }

    const entityId = entityResult.id;

    // 2. Save Addresses
    if (data.addresses && data.addresses.length > 0) {
        await Promise.all(data.addresses.map(addr =>
            createOrUpdateAddress({
                id: (addr.id && !addr.id.includes('-')) ? addr.id : undefined,
                entity_id: entityId,
                address_type: addr.label || "Business",
                line1: addr.street1,
                line2: addr.street2,
                city: addr.city,
                state: addr.state,
                zip: addr.zip_code,
                country: addr.country,
                is_primary: addr.is_primary ?? false
            }).catch(e => console.error("Address save failed", e))
        ));
    }

    // 3. Save Contacts
    if (data.contacts && data.contacts.length > 0) {
        await Promise.all(data.contacts.map(contact =>
            createOrUpdateContact({
                id: (contact.id && !contact.id.includes('-')) ? contact.id : undefined,
                entity_id: entityId,
                contact_type: contact.contact_type as any,
                phone: contact.phone,
                email: contact.email,
                is_primary: contact.is_primary
            }).catch(e => console.error("Contact save failed", e))
        ));
    }

    // 4. Save Attorneys (Legal Contacts)
    if (data.attorneys && data.attorneys.length > 0) {
        await Promise.all(data.attorneys.map(attorney =>
            createOrUpdateLegalContact({
                id: (attorney.id && !attorney.id.includes('-')) ? attorney.id : undefined,
                entity_id: entityId,
                role: 'attorney',
                name: attorney.name,
                // firm_name removed as it is not in EntityLegalContact
                email: attorney.email,
                phone: attorney.phone,
                website: attorney.website,
                address_line1: attorney.address_line1,
                city: attorney.city,
                state: attorney.state,
                zip: attorney.zip,
                attorney_type: attorney.attorney_type as AttorneyType | undefined
            }).catch(e => console.error("Attorney save failed", e))
        ));
    }
}

