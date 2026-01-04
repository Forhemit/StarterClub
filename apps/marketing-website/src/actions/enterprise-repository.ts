'use server';

import { createSupabaseServerClient as createClient } from "@/lib/supabase/server";
import { EnterpriseRepositoryData, INITIAL_ENTERPRISE_DATA, InterestedParty, AccessRule } from "@/components/dashboard/enterprise/types";

export async function getEnterpriseRepository(): Promise<EnterpriseRepositoryData> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) return INITIAL_ENTERPRISE_DATA;

    // Fetch Parties
    const { data: partiesData, error: partiesError } = await supabase
        .from('enterprise_interested_parties')
        .select('*')
        .eq('user_id', user.data.user.id);

    if (partiesError || !partiesData) return INITIAL_ENTERPRISE_DATA;

    const interestedParties: InterestedParty[] = partiesData.map(p => ({
        id: p.id,
        companyName: p.company_name,
        contactName: p.contact_name,
        email: p.email,
        role: p.role as any,
        notes: p.notes,
        addedAt: p.created_at
    }));

    if (interestedParties.length === 0) {
        return INITIAL_ENTERPRISE_DATA;
    }

    // Fetch Rules for these parties
    // We can fetch all rules where party_id is in our list
    const partyIds = interestedParties.map(p => p.id);
    const { data: rulesData } = await supabase
        .from('enterprise_access_rules')
        .select('*')
        .in('party_id', partyIds);

    const accessRules: Record<string, AccessRule[]> = {};

    // Initialize empty arrays
    partyIds.forEach(id => { accessRules[id] = []; });

    if (rulesData) {
        rulesData.forEach(r => {
            if (!accessRules[r.party_id]) accessRules[r.party_id] = [];
            accessRules[r.party_id].push({
                partyId: r.party_id,
                resourceId: r.resource_id,
                hasAccess: r.has_access,
                timeWindow: r.time_window as any
            });
        });
    }

    return {
        interestedParties,
        accessRules,
        lastUpdated: new Date().toISOString()
    };
}

export async function updateEnterpriseRepository(data: EnterpriseRepositoryData): Promise<void> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) throw new Error("Unauthorized");

    // 1. Upsert Parties
    for (const party of data.interestedParties) {
        // Prepare payload
        const partyPayload = {
            id: party.id,
            user_id: userId,
            company_name: party.companyName,
            contact_name: party.contactName,
            email: party.email,
            role: party.role,
            notes: party.notes,
            updated_at: new Date().toISOString()
        };

        const { error: partyError } = await supabase
            .from('enterprise_interested_parties')
            .upsert(partyPayload, { onConflict: 'id' });

        if (partyError) {
            console.error(`Error saving party ${party.companyName}:`, partyError);
            continue;
        }

        // 2. Upsert Rules for this party
        const rules = data.accessRules[party.id] || [];
        if (rules.length > 0) {
            const rulesPayload = rules.map(r => ({
                party_id: party.id,
                resource_id: r.resourceId,
                has_access: r.hasAccess,
                time_window: r.timeWindow,
                updated_at: new Date().toISOString()
            }));

            // We need to upsert rules based on (party_id, resource_id) unique constraint
            const { error: rulesError } = await supabase
                .from('enterprise_access_rules')
                .upsert(rulesPayload, { onConflict: 'party_id, resource_id' });

            if (rulesError) {
                console.error(`Error saving rules for ${party.companyName}:`, rulesError);
            }
        }
    }

    // Optional: Handle deletions of parties that are no longer in the list?
    // For now, we rely on user explicitly deleting via a delete action if we have one. 
    // But since this is a "save whole state" wizard, we should ideally prune.
    // Pruning Strategy: Get all parties for user, if not in data.interestedParties, delete.

    const { data: existingParties } = await supabase
        .from('enterprise_interested_parties')
        .select('id')
        .eq('user_id', userId);

    if (existingParties) {
        const incomingIds = new Set(data.interestedParties.map(p => p.id));
        const toDelete = existingParties.filter(p => !incomingIds.has(p.id)).map(p => p.id);

        if (toDelete.length > 0) {
            await supabase
                .from('enterprise_interested_parties')
                .delete()
                .in('id', toDelete);
        }
    }
}

export async function resetEnterpriseRepository(): Promise<void> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) throw new Error("Unauthorized");

    // Deleting parties cascades to rules
    const { error } = await supabase
        .from('enterprise_interested_parties')
        .delete()
        .eq('user_id', user.data.user.id);

    if (error) {
        console.error("Error resetting enterprise data:", error);
        throw new Error("Failed to reset data");
    }
}
