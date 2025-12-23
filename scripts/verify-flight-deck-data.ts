import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from flight-deck
dotenv.config({ path: path.resolve(process.cwd(), 'apps/flight-deck/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyData() {
    console.log('🔍 Starting Flight Deck Data Verification...');

    // 1. Check for any business
    const { data: businesses, error: bError } = await supabase
        .from('user_businesses')
        .select('id, business_name, user_id')
        .limit(1);

    if (bError) {
        console.error('❌ Error fetching businesses:', bError.message);
        return;
    }

    if (!businesses || businesses.length === 0) {
        console.warn('⚠️ No businesses found in user_businesses table. This is normal for a clean dev environment.');
        return;
    }

    const business = businesses[0];
    console.log(`✅ Found test business: "${business.business_name}" (${business.id})`);

    // 2. Check for checklist items for this business
    const { data: checklist, error: cError } = await supabase
        .from('user_checklist_status')
        .select(`
            id,
            checklist_items ( title ),
            statuses ( name )
        `)
        .eq('user_business_id', business.id);

    if (cError) {
        console.error('❌ Error fetching checklist status:', cError.message);
    } else {
        console.log(`✅ Successfully queried checklist status. Found ${checklist?.length || 0} items.`);
        
        if (checklist && checklist.length > 0) {
            console.log('📊 Sample Item:', JSON.stringify(checklist[0], null, 2));
        }
    }

    console.log('🚀 Verification Complete.');
}

verifyData();
