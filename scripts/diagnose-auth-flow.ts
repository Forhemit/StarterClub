import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const clerkSecretKey = process.env.CLERK_SECRET_KEY!;

const USER_ID = 'user_36nbmB05wun3x8Ws85gmBWVFMxf';

async function diagnose() {
    console.log('\n=== COMPREHENSIVE AUTH FLOW DIAGNOSIS ===\n');

    // 1. Profile Existence Check
    console.log('1. Checking if profile exists in database...');

    // 2. Check Profile with Service Role (bypasses RLS)
    console.log('\n2. Checking profile with SERVICE ROLE...');
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: profileService, error: profileServiceError } = await serviceClient
        .from('profiles')
        .select('*')
        .eq('id', USER_ID)
        .single();

    if (profileServiceError) {
        console.error('✗ Profile not found with SERVICE ROLE:', profileServiceError);
        console.log('  This means the profile does NOT EXIST in the database!');
        console.log('  Run: npx tsx scripts/sync-user.ts');
        return;
    }

    console.log('✓ Profile found with SERVICE ROLE:');
    console.log(`  Name: ${profileService.first_name} ${profileService.last_name}`);
    console.log(`  Active Roles: ${JSON.stringify(profileService.active_roles)}`);
    console.log(`  Primary Role: ${profileService.primary_role}`);
    console.log(`  Onboarding Completed: ${profileService.onboarding_completed}`);
    console.log(`  Onboarding Completed At: ${profileService.onboarding_completed_at}`);

    // 3. Check Profile with ANON KEY (simulates middleware/client)
    console.log('\n3. Checking profile with ANON KEY (no auth)...');
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data: profileAnon, error: profileAnonError } = await anonClient
        .from('profiles')
        .select('*')
        .eq('id', USER_ID)
        .single();

    if (profileAnonError) {
        console.error('✗ Profile query FAILED with ANON KEY:', profileAnonError);
        console.log('  This is EXPECTED if RLS requires authentication.');
    } else {
        console.log('✓ Profile found with ANON KEY (no RLS blocking):');
        console.log(`  Active Roles: ${JSON.stringify(profileAnon.active_roles)}`);
    }

    // 4. Key Issue: Middleware Auth
    console.log('\n4. MIDDLEWARE AUTHENTICATION ISSUE:');
    console.log('  The middleware creates an UNAUTHENTICATED Supabase client:');
    console.log('    const supabase = createClient(URL, ANON_KEY);');
    console.log('  This means ALL middleware queries run as ANONYMOUS user!');
    console.log('  Result: RLS policies may block the query, returning NULL.');
    console.log('\n  ⚠️  FIX REQUIRED: Middleware must pass Clerk session token to Supabase');


    // 5. Check RLS Policies
    console.log('\n5. Checking RLS policies on profiles table...');
    const { data: policies } = await serviceClient
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'profiles');

    if (policies && policies.length > 0) {
        console.log(`✓ Found ${policies.length} RLS policies on profiles table:`);
        policies.forEach((policy: any) => {
            console.log(`  - ${policy.policyname}: ${policy.cmd}`);
        });
    }

    // 6. Check user_roles
    console.log('\n6. Checking user_roles table...');
    const { data: userRoles, error: rolesError } = await serviceClient
        .from('user_roles')
        .select('*')
        .eq('clerk_user_id', USER_ID);

    if (rolesError) {
        console.error('✗ Error querying user_roles:', rolesError);
    } else {
        console.log(`✓ Found ${userRoles?.length || 0} role assignments`);
        userRoles?.forEach((role: any) => {
            console.log(`  - ${role.role_slug} (active: ${role.is_active}, primary: ${role.is_primary})`);
        });
    }

    // 7. Summary & Recommendations
    console.log('\n=== DIAGNOSIS SUMMARY ===');
    console.log('Profile exists:', !!profileService);
    console.log('Has active roles:', profileService?.active_roles?.length > 0);
    console.log('Onboarding complete:', profileService?.onboarding_completed || !!profileService?.onboarding_completed_at);

    console.log('\n=== RECOMMENDATIONS ===');
    if (!profileService) {
        console.log('⚠️  CRITICAL: Profile does not exist! Run: npx tsx scripts/sync-user.ts');
    } else if (!profileService.active_roles || profileService.active_roles.length === 0) {
        console.log('⚠️  No active roles. User needs to complete onboarding.');
    } else if (!profileService.onboarding_completed && !profileService.onboarding_completed_at) {
        console.log('⚠️  Onboarding not marked complete. This will cause middleware redirect loop.');
        console.log('   Fix: Update profiles SET onboarding_completed_at = NOW() WHERE id = \'' + USER_ID + '\';');
    } else {
        console.log('✓ Profile appears healthy. Issue may be with middleware auth token passing.');
        console.log('  Check: Middleware needs to pass Clerk session token to Supabase client');
    }
}

diagnose().catch(console.error);
