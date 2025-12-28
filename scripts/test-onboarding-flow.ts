import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const USER_ID = 'user_36nbmB05wun3x8Ws85gmBWVFMxf';

async function testOnboardingFlow() {
    console.log('\n=== TESTING COMPLETE ONBOARDING FLOW ===\n');

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Check if RoleService works
    console.log('1. Testing RoleService.assignRole()...');
    try {
        // Import the RoleService
        const { RoleService } = await import('../apps/marketing-website/src/lib/services/role.service');

        await RoleService.assignRole(USER_ID, 'member', 'system', 'Test assignment');
        console.log('✓ RoleService.assignRole() works');
    } catch (error: any) {
        console.error('✗ RoleService.assignRole() FAILED:', error.message);
        console.error('  Full error:', error);
    }

    // 2. Check if profile can be updated
    console.log('\n2. Testing profile update...');
    try {
        const { error } = await serviceClient
            .from('profiles')
            .update({
                onboarding_completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', USER_ID);

        if (error) throw error;
        console.log('✓ Profile update works');
    } catch (error: any) {
        console.error('✗ Profile update FAILED:', error.message);
    }

    // 3. Check if departments can be inserted
    console.log('\n3. Testing department assignment...');
    try {
        // First, get a department ID
        const { data: depts } = await serviceClient
            .from('departments')
            .select('id')
            .limit(1);

        if (depts && depts.length > 0) {
            const { error } = await serviceClient
                .from('user_departments')
                .insert({
                    user_id: USER_ID,
                    department_id: depts[0].id,
                    is_primary: false
                });

            if (error && error.code !== '23505') { // Ignore duplicate key
                throw error;
            }
            console.log('✓ Department assignment works');
        } else {
            console.log('⚠️  No departments found to test with');
        }
    } catch (error: any) {
        console.error('✗ Department assignment FAILED:', error.message);
    }

    // 4. Check current profile state
    console.log('\n4. Checking current profile state...');
    const { data: profile } = await serviceClient
        .from('profiles')
        .select('*')
        .eq('id', USER_ID)
        .single();

    console.log('Profile:');
    console.log('  - ID:', profile?.id);
    console.log('  - Active Roles:', profile?.active_roles);
    console.log('  - Primary Role:', profile?.primary_role);
    console.log('  - Onboarding Completed:', profile?.onboarding_completed);
    console.log('  - Onboarding Completed At:', profile?.onboarding_completed_at);

    // 5. Check user_roles
    console.log('\n5. Checking user_roles...');
    const { data: roles } = await serviceClient
        .from('user_roles')
        .select('role_slug, is_active, is_primary')
        .eq('clerk_user_id', USER_ID);

    console.log(`Found ${roles?.length || 0} role(s):`);
    roles?.forEach(r => {
        console.log(`  - ${r.role_slug} (active: ${r.is_active}, primary: ${r.is_primary})`);
    });

    // 6. Check what middleware would see
    console.log('\n6. Middleware perspective check...');
    const hasRoles = profile?.active_roles && profile.active_roles.length > 0;
    const onboardingCompleted = profile?.onboarding_completed || !!profile?.onboarding_completed_at;

    console.log('  - hasRoles:', hasRoles);
    console.log('  - onboardingCompleted:', onboardingCompleted);
    console.log('  - Would redirect to onboarding?', !onboardingCompleted && !hasRoles);

    // 7. Check for RPC functions
    console.log('\n7. Checking RPC function availability...');
    try {
        const { data, error } = await serviceClient.rpc('assign_user_roles', {
            p_clerk_user_id: USER_ID,
            p_role_slugs: ['member'],
            p_assigned_by: 'test',
            p_assigned_reason: 'test'
        });

        if (error) throw error;
        console.log('✓ assign_user_roles RPC works');
    } catch (error: any) {
        console.error('   ✗ assign_user_roles RPC FAILED:', error.message);
        console.error('  This is likely why onboarding save fails!');
    }

    console.log('\n=== DIAGNOSIS COMPLETE ===\n');
}

testOnboardingFlow().catch(console.error);
