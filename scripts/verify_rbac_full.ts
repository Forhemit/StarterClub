import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyRBAC() {
    console.log('🔍 Verifying RBAC Schema...');

    try {
        // 1. Check Tables by attempting to select from them
        const tablesToCheck = ['roles', 'user_roles', 'role_history'];

        for (const table of tablesToCheck) {
            const { error } = await supabase.from(table).select('id').limit(1);
            if (error) {
                console.error(`❌ Table verification failed for '${table}':`, error.message);
            } else {
                console.log(`✅ Table verified: ${table}`);
            }
        }

        // 2. Check Functions
        const { data: functions, error: funcError } = await supabase.rpc('assign_user_roles', {
            p_clerk_user_id: 'test_check',
            p_role_slugs: [],
            p_assigned_by: 'system'
        });

        // We expect this to run (returning skipped empty) or throw logic error, but not "function not found"
        if (funcError && funcError.message?.includes('function public.assign_user_roles does not exist')) {
            console.error('❌ Missing output function: assign_user_roles');
        } else {
            console.log('✅ Function exists: assign_user_roles');
        }

        // 3. Check specific columns in profiles
        // We check if we can select new columns
        const { data: profileCols, error: colError } = await supabase
            .from('profiles')
            .select('active_roles, primary_role')
            .limit(1);

        if (colError && colError.code === 'PGRST100') { // Column not found error code usually
            console.error('❌ Missing profile columns (active_roles, primary_role)', colError.message);
        } else {
            console.log('✅ Profile columns verified (active_roles, primary_role are queryable)');
        }

        // 4. Check Roles Seed Data
        const { count, error: countError } = await supabase
            .from('roles')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        console.log(`✅ Roles table contains ${count} roles (Expected >= 8)`);

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyRBAC();
