import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

// Use Service Role key to bypass RLS for verification
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyChecklist() {
    console.log('🔍 Verifying Data Vault Schema...');

    // 1. Check Categories
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) {
        console.error('❌ Categories error:', catError);
    } else {
        console.log(`✅ Found ${categories.length} categories`);
    }

    // 2. Check Items
    const { data: items, error: itemError } = await supabase.from('checklist_items').select('*');
    if (itemError) {
        console.error('❌ Items error:', itemError);
    } else {
        console.log(`✅ Found ${items.length} checklist items`);
        const withSchema = items.filter(i => i.metadata_schema && Object.keys(i.metadata_schema).length > 0);
        console.log(`✅ Items with structured schemas: ${withSchema.length}`);
    }

    // 3. Check Modules
    const { data: modules, error: modError } = await supabase.from('modules').select('*, module_items(*)');
    if (modError) {
        console.error('❌ Modules error:', modError);
    } else {
        console.log(`✅ Found ${modules.length} modules with ${modules.reduce((acc, m) => acc + (m.module_items?.length || 0), 0)} total links`);
    }

    console.log('🚀 Schema Verification Complete');
}

verifyChecklist();
