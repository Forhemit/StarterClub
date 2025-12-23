'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getPartnerResources(track?: string) {
    const supabase = await createSupabaseServerClient();
    
    let query = supabase
        .from('resource_assets')
        .select('*')
        .eq('visibility', 'partner')
        .order('title', { ascending: true });

    if (track && track !== 'all') {
        query = query.eq('track', track);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }
    
    return data;
}
