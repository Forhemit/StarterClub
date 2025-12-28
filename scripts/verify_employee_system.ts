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

async function verifyEmployeeSystem() {
    console.log('🔍 Verifying Employee Tracking System Schema...');

    const expectedTables = [
        'employees', 'employment_status_history', 'title_history', 'department_history',
        'compensation_history', 'personal_info_history', 'education_history',
        'certification_history', 'performance_reviews', 'leave_history', 'equipment_history',
        'benefits_enrollment_history', 'incident_history', 'work_schedule_history',
        'skill_inventory', 'project_assignments', 'mentorship_history', 'recognition_history',
        'expense_history', 'visa_history', 'health_safety_records', 'exit_interviews',
        'departments', 'benefits_packages', 'benefits_plans', 'company_assets', 'projects', 'review_cycles'
    ];

    try {
        // 1. Check Tables Existence
        console.log('Checking table existence...');
        let allExist = true;
        for (const table of expectedTables) {
            const { error } = await supabase.from(table).select('id').limit(1);
            if (error) {
                console.error(`❌ Table '${table}' check failed:`, error.message);
                allExist = false;
            } else {
                console.log(`✅ Table verified: ${table}`);
            }
        }

        if (allExist) {
            console.log('✅ All employee system tables exist.');
        } else {
            console.error('❌ Some tables are missing or inaccessible.');
            return;
        }

        // 2. Check Functions
        const { error: funcError } = await supabase.rpc('get_employee_full_history', {
            p_employee_id: '00000000-0000-0000-0000-000000000000' // dummy UUID
        });

        // We expect "invalid input syntax for type uuid" or similar if UUID is invalid format,
        // or just empty array if valid but not found.
        // If function missing, error code is typically related to "function does not exist"
        if (funcError && funcError.message.includes('does not exist')) {
            console.error('❌ Missing function: get_employee_full_history', funcError);
        } else {
            console.log('✅ Function verified: get_employee_full_history');
        }

        // 3. Test RLS Helper
        const { error: rlsError } = await supabase.rpc('is_hr_admin');
        if (rlsError) {
            console.error('❌ Missing or error in function: is_hr_admin', rlsError);
        } else {
            console.log('✅ Function verified: is_hr_admin');
        }

        console.log('✅ Verification Script Completed.');

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyEmployeeSystem();
