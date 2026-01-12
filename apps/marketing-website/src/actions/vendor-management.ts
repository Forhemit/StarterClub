'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { VendorManagementData } from "@/components/dashboard/vendor-management/types";

/**
 * Get the current user's vendor management profile with all related data
 */
export async function getVendorProfile(): Promise<VendorManagementData | null> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) return null;

    // Get the profile
    const { data: profile, error: profileError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single();

    if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching vendor profile:', profileError);
        return null;
    }

    if (!profile) {
        return null;
    }

    // Fetch related data in parallel
    const [vendorsResult, contractsResult, spendResult] = await Promise.all([
        supabase.from('vendors').select('*').eq('profile_id', profile.id),
        supabase.from('vendor_contracts').select('*').eq('profile_id', profile.id),
        supabase.from('vendor_spend').select('*').eq('profile_id', profile.id),
    ]);

    // Map vendors to include names for contracts and spend
    const vendorMap = new Map(
        (vendorsResult.data || []).map(v => [v.id, v.name])
    );

    return {
        id: profile.id,
        vendors: (vendorsResult.data || []).map(v => ({
            id: v.id,
            name: v.name,
            category: v.category,
            contact_name: v.contact_name,
            contact_email: v.contact_email,
            contact_phone: v.contact_phone,
            website: v.website,
            notes: v.notes,
        })),
        contracts: (contractsResult.data || []).map(c => ({
            id: c.id,
            vendor_id: c.vendor_id,
            vendor_name: vendorMap.get(c.vendor_id) || '',
            contract_name: c.contract_name,
            start_date: c.start_date,
            end_date: c.end_date,
            value: c.value ? parseFloat(c.value) : undefined,
            renewal_alert_days: c.renewal_alert_days,
            auto_renew: c.auto_renew,
            notes: c.notes,
        })),
        spend_records: (spendResult.data || []).map(s => ({
            id: s.id,
            vendor_id: s.vendor_id,
            vendor_name: vendorMap.get(s.vendor_id) || '',
            amount: s.amount ? parseFloat(s.amount) : 0,
            period: s.period,
            period_date: s.period_date,
            category: s.category,
            notes: s.notes,
        })),
    };
}

/**
 * Save or update the vendor management profile
 */
export async function saveVendorProfile(data: VendorManagementData): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    let profileId = data.id;

    // Create or get profile
    if (!profileId) {
        // Check if profile exists
        const { data: existing } = await supabase
            .from('vendor_profiles')
            .select('id')
            .eq('user_id', userId)
            .limit(1)
            .single();

        if (existing) {
            profileId = existing.id;
        } else {
            // Create new profile
            const { data: newProfile, error } = await supabase
                .from('vendor_profiles')
                .insert({ user_id: userId })
                .select('id')
                .single();

            if (error) throw new Error(`Failed to create profile: ${error.message}`);
            profileId = newProfile.id;
        }
    }

    // Update profile timestamp
    await supabase
        .from('vendor_profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', profileId);

    // Sync vendors
    if (data.vendors) {
        // Delete vendors not in the new list
        const vendorIds = data.vendors.filter(v => v.id && !v.id.includes('-')).map(v => v.id);
        if (vendorIds.length > 0) {
            await supabase
                .from('vendors')
                .delete()
                .eq('profile_id', profileId)
                .not('id', 'in', `(${vendorIds.join(',')})`);
        } else {
            await supabase.from('vendors').delete().eq('profile_id', profileId);
        }

        // Upsert vendors
        for (const vendor of data.vendors) {
            const vendorPayload = {
                profile_id: profileId,
                name: vendor.name,
                category: vendor.category,
                contact_name: vendor.contact_name,
                contact_email: vendor.contact_email,
                contact_phone: vendor.contact_phone,
                website: vendor.website,
                notes: vendor.notes,
            };

            if (vendor.id && !vendor.id.includes('-')) {
                // Update existing
                await supabase.from('vendors').update(vendorPayload).eq('id', vendor.id);
            } else {
                // Insert new
                const { data: newVendor } = await supabase
                    .from('vendors')
                    .insert(vendorPayload)
                    .select('id')
                    .single();

                // Update any contracts/spend referencing this temp ID
                if (newVendor && vendor.id) {
                    data.contracts?.forEach(c => {
                        if (c.vendor_id === vendor.id) c.vendor_id = newVendor.id;
                    });
                    data.spend_records?.forEach(s => {
                        if (s.vendor_id === vendor.id) s.vendor_id = newVendor.id;
                    });
                }
            }
        }
    }

    // Sync contracts
    if (data.contracts) {
        const contractIds = data.contracts.filter(c => c.id && !c.id.includes('-')).map(c => c.id);
        if (contractIds.length > 0) {
            await supabase
                .from('vendor_contracts')
                .delete()
                .eq('profile_id', profileId)
                .not('id', 'in', `(${contractIds.join(',')})`);
        } else {
            await supabase.from('vendor_contracts').delete().eq('profile_id', profileId);
        }

        for (const contract of data.contracts) {
            const contractPayload = {
                profile_id: profileId,
                vendor_id: contract.vendor_id && !contract.vendor_id.includes('-') ? contract.vendor_id : null,
                contract_name: contract.contract_name,
                start_date: contract.start_date || null,
                end_date: contract.end_date || null,
                value: contract.value || null,
                renewal_alert_days: contract.renewal_alert_days || 30,
                auto_renew: contract.auto_renew || false,
                notes: contract.notes,
            };

            if (contract.id && !contract.id.includes('-')) {
                await supabase.from('vendor_contracts').update(contractPayload).eq('id', contract.id);
            } else {
                await supabase.from('vendor_contracts').insert(contractPayload);
            }
        }
    }

    // Sync spend records
    if (data.spend_records) {
        const spendIds = data.spend_records.filter(s => s.id && !s.id.includes('-')).map(s => s.id);
        if (spendIds.length > 0) {
            await supabase
                .from('vendor_spend')
                .delete()
                .eq('profile_id', profileId)
                .not('id', 'in', `(${spendIds.join(',')})`);
        } else {
            await supabase.from('vendor_spend').delete().eq('profile_id', profileId);
        }

        for (const spend of data.spend_records) {
            const spendPayload = {
                profile_id: profileId,
                vendor_id: spend.vendor_id && !spend.vendor_id.includes('-') ? spend.vendor_id : null,
                amount: spend.amount,
                period: spend.period,
                period_date: spend.period_date || null,
                category: spend.category,
                notes: spend.notes,
            };

            if (spend.id && !spend.id.includes('-')) {
                await supabase.from('vendor_spend').update(spendPayload).eq('id', spend.id);
            } else {
                await supabase.from('vendor_spend').insert(spendPayload);
            }
        }
    }
}

/**
 * Delete all vendor management data for the current user
 */
export async function resetVendorProfile(profileId: string): Promise<{ success: boolean }> {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    // Delete the profile (cascades to vendors, contracts, spend)
    const { error } = await supabase
        .from('vendor_profiles')
        .delete()
        .eq('id', profileId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error resetting vendor profile:', error);
        throw new Error('Failed to reset vendor data');
    }

    return { success: true };
}
