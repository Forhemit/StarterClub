'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * CLIENTS
 */
export async function getClients(businessId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_business_id', businessId)
        .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
}

export async function createClient(businessId: string, clientData: { first_name: string; last_name: string; email?: string; phone?: string }) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('clients')
        .insert({ ...clientData, user_business_id: businessId })
        .select()
        .single();

    if (error) throw error;
    revalidatePath('/dashboard/partner/clients');
    return data;
}

/**
 * ENGAGEMENTS
 */
export async function getEngagements(clientId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('engagements')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function createEngagement(clientId: string, programName: string, startDate?: string, endDate?: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('engagements')
        .insert({ client_id: clientId, program_name: programName, start_date: startDate, end_date: endDate })
        .select()
        .single();

    if (error) throw error;
    revalidatePath('/dashboard/partner/clients');
    return data;
}

/**
 * SESSIONS
 */
export async function getSessions(engagementId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('engagement_id', engagementId)
        .order('session_date', { ascending: false });

    if (error) throw error;
    return data;
}

export async function logSession(engagementId: string, sessionData: {
    session_date: string;
    session_type: string;
    coach_notes?: string;
    goals_set?: any;
    outcomes?: any;
}) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('sessions')
        .insert({ engagement_id: engagementId, ...sessionData })
        .select()
        .single();

    if (error) throw error;
    revalidatePath('/dashboard/partner/clients');
    return data;
}
