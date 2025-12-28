import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkRLS() {
    console.log('\n=== RLS POLICIES & FUNCTIONS CHECK ===\n');

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Check if requesting_user_id function exists
    console.log('1. Checking if public.requesting_user_id() function exists...');
    const { data: functions, error: funcError } = await serviceClient
        .from('pg_proc')
        .select('proname, pronamespace')
        .eq('proname', 'requesting_user_id');

    if (funcError) {
        console.error('Error checking functions:', funcError);
    } else if (!functions || functions.length === 0) {
        console.error('✗ requesting_user_id() function NOT FOUND!');
        console.log('  This function is required for RLS policies to work with Clerk.');
        console.log('  It should be created by migration: 20251231020000_fix_clerk_policies.sql');
    } else {
        console.log('✓ requesting_user_id() function exists');
    }

    // 2. Check RLS policies on profiles table
    console.log('\n2. Checking RLS policies on profiles table...');
    let policies: any = null;
    try {
        const result = await serviceClient.rpc('exec_sql', {
            sql: `
                SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
                FROM pg_policies 
                WHERE tablename = 'profiles';
            `
        });
        policies = result.data;
    } catch {
        policies = null;
    }

    if (policies) {
        console.log(`Found ${policies.length} policies:`);
        policies.forEach((p: any) => {
            console.log(`  - ${p.policyname} (${p.cmd}):`);
            console.log(`    USING: ${p.qual}`);
        });
    } else {
        // Try alternative query
        const { data: directPolicies } = await serviceClient
            .from('information_schema.table_privileges')
            .select('*')
            .eq('table_name', 'profiles')
            .limit(5);

        console.log('Could not query pg_policies, checking table_privileges instead...');
        console.log('Privileges:', directPolicies);
    }

    // 3. Test the requesting_user_id function directly
    console.log('\n3. Testing requesting_user_id() function...');
    let testResult: any = null;
    let testError: any = null;
    try {
        const result = await serviceClient.rpc('exec_sql', {
            sql: `SELECT public.requesting_user_id();`
        });
        testResult = result.data;
        testError = result.error;
    } catch (err) {
        testError = 'Function does not exist or exec_sql not available';
    }

    if (testError) {
        console.error('✗ Cannot test function:', testError);
        console.log('  This might be normal if exec_sql RPC is restricted');
    } else {
        console.log('✓ Function test result:', testResult);
    }

    // 4. Check if RLS is enabled on profiles
    console.log('\n4. Checking if RLS is enabled on profiles table...');
    const { data: tableInfo } = await serviceClient
        .from('pg_tables')
        .select('tablename, rowsecurity')
        .eq('tablename', 'profiles')
        .eq('schemaname', 'public');

    if (tableInfo && tableInfo.length > 0) {
        console.log('✓ RLS enabled:', tableInfo[0].rowsecurity);
    } else {
        console.log('Could not determine RLS status');
    }

    console.log('\n=== CLERK JWT TEMPLATE CONFIGURATION ===');
    console.log('For Supabase + Clerk integration to work, you must:');
    console.log('1. Go to Clerk Dashboard → JWT Templates');
    console.log('2. Create a new template named "supabase"');
    console.log('3. Set the following claims:');
    console.log('   {');
    console.log('     "sub": "{{user.id}}",');
    console.log('     "email": "{{user.primary_email_address}}"');
    console.log('   }');
    console.log('4. Save and enable the template');
    console.log('\nWithout this template, getToken({ template: "supabase" }) returns null!');

    console.log('\n=== ALTERNATIVE FIX ===');
    console.log('If JWT template configuration is complex, consider:');
    console.log('1. Making SELECT policy on profiles more permissive');
    console.log('2. Using service role for critical operations');
    console.log('3. Checking auth.uid() fallback in policies');
}

checkRLS().catch(console.error);
