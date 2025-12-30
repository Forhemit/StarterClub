'use server';

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContactType = 'Legal' | 'Primary' | 'Billing' | 'Shipping' | 'Emergency' | 'HR' | 'Financial' | 'Technical' | 'Other';

export interface ContactRecord {
    id?: string;
    entity_id?: string;
    contact_type: ContactType;
    is_primary: boolean;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
    email?: string;
}

export async function createOrUpdateContact(data: ContactRecord) {
    const supabase = await createSupabaseServerClient();

    // Clean payload
    const payload: any = {
        contact_type: data.contact_type,
        is_primary: data.is_primary,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country || 'US',
        phone: data.phone,
        email: data.email,
        updated_at: new Date().toISOString()
    };

    if (data.entity_id) payload.entity_id = data.entity_id;

    // If setting as primary, unset others of same type for this entity
    if (data.is_primary && data.entity_id) {
        await supabase
            .from('contacts')
            .update({ is_primary: false })
            .eq('entity_id', data.entity_id)
            .eq('contact_type', data.contact_type);
    }

    if (data.id) {
        // Update
        const { error } = await supabase
            .from('contacts')
            .update(payload)
            .eq('id', data.id);

        if (error) {
            console.error('Error updating contact:', error);
            throw new Error('Failed to update contact');
        }
        return { success: true, id: data.id };
    } else {
        // Create
        const { data: newContact, error } = await supabase
            .from('contacts')
            .insert(payload)
            .select('id')
            .single();

        if (error) {
            console.error('Error creating contact:', error);
            throw new Error('Failed to create contact');
        }
        return { success: true, id: newContact.id };
    }
}

export async function getContactsForEntity(entityId: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('entity_id', entityId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }

    return data;
}

export async function deleteContact(contactId: string) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

    if (error) {
        throw new Error('Failed to delete contact');
    }

    return { success: true };
}

export async function getDistinctContactTypes() {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from('contacts')
        .select('contact_type');

    const defaultTypes = ['Legal', 'Primary', 'Billing', 'Shipping', 'Emergency', 'HR', 'Financial', 'Technical', 'Other'];

    if (!data) return defaultTypes;

    const existingTypes = data.map(d => d.contact_type);
    // Combine and deduplicate
    return Array.from(new Set([...defaultTypes, ...existingTypes])).sort();
}
