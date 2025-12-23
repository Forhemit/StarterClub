import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/flight-deck/.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON!);

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000'; // Placeholder for verification

async function seed() {
    console.log('🌱 Seeding Test Data...');

    // 1. Ensure a Category exists
    const { data: category } = await supabase
        .from('categories')
        .insert({ name: 'Verification' })
        .select()
        .single();

    // 2. Create some Checklist Items
    const { data: items } = await supabase
        .from('checklist_items')
        .insert([
            { title: 'Register Business Name', description: 'Apply for your FBN at the County Clerk.', category_id: category?.id },
            { title: 'Open Business Bank Account', description: 'Compare local banks for the best rates.', category_id: category?.id },
            { title: 'Apply for EIN', description: 'Get your Employer Identification Number from the IRS.', category_id: category?.id }
        ])
        .select();

    if (!items) return;

    // 3. Create a Business (Note: This might fail if the user_id doesn't exist in auth.users, 
    // but we are testing the query logic primarily)
    const { data: business, error: bError } = await supabase
        .from('user_businesses')
        .insert({
            user_id: MOCK_USER_ID,
            business_name: 'Test Rocketry Inc.',
        })
        .select()
        .single();

    if (bError) {
        console.warn('⚠️ Could not seed business (expected if auth user 0000... missing):', bError.message);
        return;
    }

    // 4. Link items to business with statuses
    const statuses = await supabase.from('statuses').select('*');
    const statusMap = Object.fromEntries(statuses.data!.map(s => [s.name, s.id]));

    await supabase.from('user_checklist_status').insert([
        { user_business_id: business.id, item_id: items[0].id, status_id: statusMap['complete'], completed_at: new Date().toISOString() },
        { user_business_id: business.id, item_id: items[1].id, status_id: statusMap['in_progress'] },
        { user_business_id: business.id, item_id: items[2].id, status_id: statusMap['not_started'] },
    ]);

    console.log('✅ Seeding Complete. Data is now ready for verification.');
}

seed();
