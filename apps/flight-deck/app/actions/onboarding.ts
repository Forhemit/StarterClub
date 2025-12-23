'use server'

import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createBusiness(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login'); // Fixed redirect to /login to match auth flow
    }

    const businessName = formData.get('businessName') as string;
    const moduleId = formData.get('moduleId') as string;

    if (!businessName || !moduleId) {
        throw new Error('Business Name and Industry are required');
    }

    // 1. Create Business
    const { data: businessData, error: businessError } = await supabase
        .from('user_businesses')
        .insert({
            user_id: user.id,
            business_name: businessName,
            primary_module_id: moduleId
        })
        .select()
        .single();

    const business = businessData as any;

    if (businessError) {
        console.error('Error creating business:', businessError);
        // In a real app, we'd return { error: ... } to display in the form
        throw new Error('Failed to create business: ' + businessError.message);
    }

    // 2. Seed Checklist
    // Get module items to find which checklist items to add
    const { data: moduleItems, error: moduleItemsError } = await supabase
        .from('module_items')
        .select('item_id')
        .eq('module_id', moduleId);

    if (moduleItemsError) {
        console.error('Error fetching module items:', moduleItemsError);
    }

    if (moduleItems && moduleItems.length > 0) {
        // Get 'not_started' status ID
        const { data: statusData } = await supabase
            .from('statuses')
            .select('id')
            .eq('name', 'not_started')
            .single();
        
        const notStartedStatusId = statusData?.id;

        if (notStartedStatusId) {
             const checklistEntries = moduleItems.map(item => ({
                user_business_id: business.id,
                item_id: item.item_id,
                status_id: notStartedStatusId
            }));

            const { error: seedError } = await supabase
                .from('user_checklist_status')
                .insert(checklistEntries);
            
            if (seedError) {
                console.error('Error seeding checklist:', seedError);
            }
        }
    }

    // 3. Revalidate and Redirect
    revalidatePath('/dashboard');
    redirect('/dashboard');
}
