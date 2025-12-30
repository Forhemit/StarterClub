'use server';

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LegalContactRole = 'registered_agent' | 'attorney' | 'accountant' | 'other';
export type AttorneyType = 'Corporate' | 'Tax' | 'IP' | 'Employment' | 'Litigation' | 'Real Estate' | 'General' | 'Other';

export interface EntityLegalContact {
    id?: string;
    entity_id: string;
    role: LegalContactRole;
    name: string;
    attorney_type?: AttorneyType;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    email?: string;
    website?: string;
    is_primary?: boolean;
}

export async function createOrUpdateLegalContact(data: EntityLegalContact) {
    const supabase = await createSupabaseServerClient();

    const payload: Record<string, unknown> = {
        entity_id: data.entity_id,
        role: data.role,
        name: data.name,
        attorney_type: data.attorney_type,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        phone: data.phone,
        email: data.email,
        website: data.website,
        is_primary: data.is_primary ?? false,
        updated_at: new Date().toISOString()
    };

    if (data.id) {
        const { error } = await supabase
            .from('entity_legal_contacts')
            .update(payload)
            .eq('id', data.id);

        if (error) throw new Error(error.message);
        return { id: data.id };
    } else {
        const { data: newContact, error } = await supabase
            .from('entity_legal_contacts')
            .insert(payload)
            .select('id')
            .single();

        if (error) throw new Error(error.message);
        return { id: newContact.id };
    }
}

export async function getLegalContactsForEntity(entityId: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('entity_legal_contacts')
        .select('*')
        .eq('entity_id', entityId)
        .order('role', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching legal contacts:', error);
        return [];
    }

    return data as EntityLegalContact[];
}

export async function deleteLegalContact(contactId: string) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from('entity_legal_contacts')
        .delete()
        .eq('id', contactId);

    if (error) throw new Error(error.message);
    return { success: true };
}
