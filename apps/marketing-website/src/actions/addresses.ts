"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export type AddressRecord = {
    id: string;
    entity_id: string;
    address_type: string;
    is_primary: boolean;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
    user_id?: string;
};

export async function createOrUpdateAddress(data: Partial<AddressRecord> & { entity_id: string }) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    if (data.id) {
        const { error } = await supabase
            .from('entity_addresses')
            .update({
                address_type: data.address_type,
                line1: data.line1,
                line2: data.line2,
                city: data.city,
                state: data.state,
                zip: data.zip,
                updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('user_id', userId); // Enforce owner

        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('entity_addresses')
            .insert({
                entity_id: data.entity_id,
                address_type: data.address_type || 'Legal',
                line1: data.line1,
                line2: data.line2,
                city: data.city,
                state: data.state,
                zip: data.zip,
                country: 'US',
                user_id: userId // Set owner
            });

        if (error) throw new Error(error.message);
    }
}

export async function getEntityAddresses(entityId: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return [];

    const { data, error } = await supabase
        .from('entity_addresses')
        .select('*')
        .eq('entity_id', entityId)
        .eq('user_id', userId) // Enforce owner
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data as AddressRecord[];
}

export async function deleteAddress(id: string) {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('entity_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Enforce owner

    if (error) throw new Error(error.message);
}

export async function getDistinctAddressTypes() {
    const supabase = await createSupabaseServerClient();
    // Types are generic, maybe don't need user filter? 
    // Actually this queries 'entity_addresses', so we SHOULD only show types used by this user if we are strict.
    // OR we can just return static types.
    // The previous code queried DB. Let's keep it safe.

    const { userId } = await auth();
    if (!userId) return ["Legal", "Mailing", "Shipping", "HQ", "Branch", "Other"];

    const { data, error } = await supabase
        .from('entity_addresses')
        .select('address_type')
        .eq('user_id', userId);

    if (error) {
        console.error("Error fetching address types:", error);
        return [];
    }

    const defaultTypes = ["Legal", "Mailing", "Shipping", "HQ", "Branch", "Other"];
    const existingTypes = data?.map(d => d.address_type) || [];

    // Merge and dedupe
    return Array.from(new Set([...defaultTypes, ...existingTypes])).sort();
}
