'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { complianceProfileSchema, ComplianceProfileInput } from "@/lib/validators/compliance-schema";
import { auth } from "@clerk/nextjs/server";
import { ComplianceData, ComplianceEvent } from "@/components/dashboard/compliance/types";

// Helper to transform DB event to Frontend event
function transformEvent(dbEvent: any): ComplianceEvent {
    return {
        id: dbEvent.id,
        title: dbEvent.title,
        description: dbEvent.description,
        // Return as Date for frontend consistency - components expect Date object for Calendar etc.
        due_date: new Date(dbEvent.due_date),
        status: dbEvent.status,
        category: dbEvent.category,
        jurisdiction: dbEvent.jurisdiction,
        notes: dbEvent.notes,
        completed_at: dbEvent.completed_at ? new Date(dbEvent.completed_at) : undefined
    };
}


export async function getComplianceProfile(): Promise<ComplianceData> {
    const supabase = (await createSupabaseServerClient()) as any;
    const { userId } = await auth();

    if (!userId) return { tax_events: [], registrations: [], licenses: [], other_documents: [], documents: [] };

    // Get Profile
    const { data: profile, error } = await supabase
        .from('items_compliance_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (error || !profile) {
        return { tax_events: [], registrations: [], licenses: [], other_documents: [], documents: [] };
    }

    // Get Events
    const { data: events } = await supabase
        .from('items_compliance_events')
        .select('*')
        .eq('profile_id', profile.id);

    const allEvents: ComplianceEvent[] = (events || []).map(transformEvent);

    return {
        id: profile.id,
        tax_events: allEvents.filter((e: ComplianceEvent) => e.category === 'tax'),
        registrations: allEvents.filter((e: ComplianceEvent) => e.category === 'registration'),
        licenses: allEvents.filter((e: ComplianceEvent) => e.category === 'license'),
        other_documents: allEvents.filter((e: ComplianceEvent) => e.category === 'other'),
        documents: []
    };
}

export async function saveComplianceProfile(data: ComplianceProfileInput) {
    const supabase = (await createSupabaseServerClient()) as any;
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    // 1. Ensure Profile Exists
    let profileId = data.id;

    if (!profileId) {
        // Check if one exists anyway
        const { data: existing } = await supabase.from('items_compliance_profiles').select('id').eq('user_id', userId).single();
        if (existing) {
            profileId = existing.id;
        } else {
            const { data: newProfile, error: createError } = await supabase
                .from('items_compliance_profiles')
                .insert({ user_id: userId })
                .select('id')
                .single();

            if (createError) throw new Error("Failed to create profile");
            profileId = newProfile.id;
        }
    }

    // 2. Save Events (Upsert logic simplified: Delete all and re-insert? Or smart upsert. 
    // For simplicity/robustness in this "mock" phase, let's smart upsert or just insert new ones if no ID.
    // Real implementation should probably be more careful not to lose 'completed_at' history if we overwrite.)

    // Combining all lists
    const allEvents = [
        ...data.tax_events.map(e => ({ ...e, category: 'tax' })),
        ...data.registrations.map(e => ({ ...e, category: 'registration' })),
        ...data.licenses.map(e => ({ ...e, category: 'license' })),
        ...data.other_documents.map(e => ({ ...e, category: 'other' }))
    ];

    for (const event of allEvents) {
        const payload = {
            profile_id: profileId,
            title: event.title,
            description: event.description,
            due_date: typeof event.due_date === 'string' ? event.due_date : event.due_date.toISOString(),
            status: event.status,
            category: event.category,
            jurisdiction: event.jurisdiction,
            notes: event.notes
        };

        if (event.id && !event.id.startsWith('temp-')) {
            await supabase.from('items_compliance_events').update(payload).eq('id', event.id);
        } else {
            await supabase.from('items_compliance_events').insert(payload);
        }
    }

    return { success: true, profileId };
}

export async function resetComplianceProfile(profileId: string) {
    const supabase = (await createSupabaseServerClient()) as any;
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    // Profile ownership check implicit in RLS but good to be explicit/safe
    const { error } = await supabase
        .from('items_compliance_profiles')
        .delete()
        .eq('id', profileId)
        .eq('user_id', userId);

    if (error) {
        throw new Error("Failed to reset profile");
    }

    return { success: true };
}
