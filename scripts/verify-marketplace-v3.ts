
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMarketplaceV3() {
    console.log('🔍 Verifying Business OS (Marketplace V3) Migration...');
    let allPassed = true;

    // 1. Verify New Tables Exist
    console.log('\n--- Checking Schema ---');
    const tables = ['user_installed_modules', 'module_versions', 'module_dependencies', 'module_reviews'];
    for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
            console.error(`❌ Table '${table}' check failed:`, error.message);
            allPassed = false;
        } else {
            console.log(`✅ Table '${table}' exists.`);
        }
    }

    // 2. Verify Module Types & Hierarchy
    console.log('\n--- Checking Module Registry ---');
    const { data: submodules, error: subError } = await supabase
        .from('modules')
        .select('name, parent:parent_id(name)')
        .eq('module_type', 'submodule')
        .limit(5);

    if (subError) {
        console.error('❌ Failed to query submodules:', subError.message);
        allPassed = false;
    } else if (!submodules || submodules.length === 0) {
        console.warn('⚠️ No submodules found. Did the seed script run?');
        allPassed = false;
    } else {
        console.log(`✅ Found ${submodules.length} sample sub-modules:`);
        submodules.forEach(m => console.log(`   - ${m.name} (Parent: ${m.parent?.name || 'None'})`));
    }

    // 3. Verify Versioning
    console.log('\n--- Checking Module Versions ---');
    const { count: versionCount, error: verError } = await supabase
        .from('module_versions')
        .select('*', { count: 'exact', head: true });

    if (verError) {
        console.error('❌ Failed to count versions:', verError.message);
        allPassed = false;
    } else {
        console.log(`✅ Found ${versionCount} module version records.`);
    }

    // 4. Verify Checklist Item Links (to Submodules)
    console.log('\n--- Checking Checklist Links ---');
    // Check for an item linked to a submodule
    const { data: linkedItem, error: linkError } = await supabase
        .from('checklist_items')
        .select('title, module_items!inner(module:modules(name, module_type))')
        .eq('module_items.module.module_type', 'submodule')
        .limit(1)
        .maybeSingle();

    if (linkError) {
        console.error('❌ Failed to check checklist links:', linkError.message);
        allPassed = false;
    } else if (linkedItem) {
        const mod = (linkedItem.module_items as any)[0]?.module || (linkedItem.module_items as any).module;
        console.log(`✅ Confirmed item "${linkedItem.title}" is linked to submodule "${mod?.name}".`);
    } else {
        console.warn('⚠️ No checklist items found linked to submodules.');
        allPassed = false;
    }

    // 5. Verify View
    console.log('\n--- Checking Marketplace View ---');
    const { error: viewError } = await supabase.from('marketplace_modules').select('count').limit(1);
    if (viewError) {
        console.error('❌ View marketplace_modules check failed:', viewError.message);
        allPassed = false;
    } else {
        console.log('✅ View marketplace_modules exists and is accessible.');
    }

    console.log('\n---------------------------------');
    if (allPassed) {
        console.log('🎉 VERIFICATION SUCCESSFUL: Business OS is live!');
        process.exit(0);
    } else {
        console.error('💥 VERIFICATION FAILED: Issues detected.');
        process.exit(1);
    }
}

verifyMarketplaceV3();
