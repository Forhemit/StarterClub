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
        due_date: new Date(dbEvent.due_date), // Keep as Date for frontend consistency if needed, or better, return string to avoid confusion? The schema allows both now. Let's return the string from DB if possible, but DB returns string for date/timestamp? supabase-js returns string. new Date() matches old behavior for reading.
        // Actually, if we want to fix the issue, we should probably return string if it's a date type column.
        // But for now, let's stick to what the schema allows. Ideally we pass strings to frontend.
        // Let's modify transformEvent to return string if we want "YYYY-MM-DD".
        // BUT existing components expect Date object often (e.g. Calendar).
        // Let's look at `transformEvent` line 14: `due_date: new Date(dbEvent.due_date)`.
        // If we change this to string, we might break components expecting Date methods.
        // We updated Schema to allow string OR date.
        // Let's keep reading as Date for now to minimize breakage, but WRITING is the critical part.
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

    if (!userId) return { tax_events: [], registrations: [], licenses: [], documents: [] };

    // Get Profile
    const { data: profile, error } = await supabase
        .from('items_compliance_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (error || !profile) {
        return { tax_events: [], registrations: [], licenses: [], documents: [] };
    }

    // Get Events
    const { data: events } = await supabase
        .from('items_compliance_events')
        .select('*')
        .eq('profile_id', profile.id);

    const allEvents = (events || []).map(transformEvent);

    return {
        id: profile.id,
        tax_events: allEvents.filter(e => e.category === 'tax'),
        registrations: allEvents.filter(e => e.category === 'registration'),
        licenses: allEvents.filter(e => e.category === 'license'),
        other_documents: allEvents.filter(e => e.category === 'other'),
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
