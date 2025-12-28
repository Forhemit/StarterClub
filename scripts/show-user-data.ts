import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function showUserData() {
    console.log('\n=== WHERE TO FIND YOUR USER DATA IN SUPABASE ===\n');

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log('🔍 IMPORTANT: This app uses CLERK for authentication, not Supabase Auth!');
    console.log('   - Do NOT look in: auth.users (that\'s for Supabase Auth)');
    console.log('   - DO look in: public.profiles (that\'s where Clerk users are stored)\n');

    // 1. Show all profiles
    console.log('1️⃣  Checking public.profiles table...\n');
    const { data: profiles, error: profilesError } = await serviceClient
        .from('profiles')
        .select('id, email, first_name, last_name, role, primary_role, active_roles, onboarding_completed_at')
        .order('created_at', { ascending: false })
        .limit(10);

    if (profilesError) {
        console.error('   ✗ Error:', profilesError.message);
    } else if (!profiles || profiles.length === 0) {
        console.log('   ⚠️  No profiles found! You need to sync users from Clerk.');
    } else {
        console.log(`   ✓ Found ${profiles.length} profile(s):\n`);
        profiles.forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.first_name} ${p.last_name} (${p.email})`);
            console.log(`      ID: ${p.id}`);
            console.log(`      Primary Role: ${p.primary_role}`);
            console.log(`      Active Roles: ${p.active_roles?.join(', ') || 'none'}`);
            console.log(`      Onboarding Complete: ${p.onboarding_completed_at ? 'Yes' : 'No'}`);
            console.log('');
        });
    }

    // 2. Show user_roles
    console.log('2️⃣  Checking public.user_roles table...\n');
    const { data: allRoles } = await serviceClient
        .from('user_roles')
        .select('clerk_user_id, role_slug, is_active, is_primary')
        .eq('is_active', true);

    if (allRoles && allRoles.length > 0) {
        console.log(`   ✓ Found ${allRoles.length} active role assignment(s)\n`);

        // Group by user
        const rolesByUser = allRoles.reduce((acc: any, role) => {
            if (!acc[role.clerk_user_id]) acc[role.clerk_user_id] = [];
            acc[role.clerk_user_id].push(role);
            return acc;
        }, {});

        Object.entries(rolesByUser).forEach(([userId, roles]: [string, any]) => {
            console.log(`   User: ${userId}`);
            roles.forEach((r: any) => {
                console.log(`      - ${r.role_slug}${r.is_primary ? ' (PRIMARY)' : ''}`);
            });
            console.log('');
        });
    } else {
        console.log('   ⚠️  No active roles found!\n');
    }

    // 3. Check auth.users (to show it's empty)
    console.log('3️⃣  Checking auth.users table (Supabase Auth)...\n');
    const { data: authUsers } = await serviceClient.auth.admin.listUsers();

    if (authUsers && authUsers.users.length > 0) {
        console.log(`   Found ${authUsers.users.length} user(s) in Supabase Auth`);
        console.log('   ⚠️  This is unexpected! App should use Clerk, not Supabase Auth.\n');
    } else {
        console.log('   ✓ Empty (EXPECTED - app uses Clerk for auth)\n');
    }

    console.log('=== HOW TO VIEW IN SUPABASE STUDIO ===\n');
    console.log('1. Open Supabase Studio: http://localhost:54323');
    console.log('2. Go to: Table Editor → public schema');
    console.log('3. Click on: "profiles" table');
    console.log('4. You should see your user data there');
    console.log('5. Also check: "user_roles" table for role assignments\n');

    console.log('=== TO RE-SYNC YOUR USER FROM CLERK ===\n');
    console.log('Run: npx tsx scripts/sync-user.ts\n');
}

showUserData().catch(console.error);
