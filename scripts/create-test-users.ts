// Script to create test users in Supabase
// Run with: npx tsx scripts/create-test-users.ts

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables:');
    if (!SUPABASE_URL) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    if (!SERVICE_ROLE_KEY) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const TEST_USERS = [
    {
        email: 'company_admin@test.com',
        password: 'TestPass123!',
        role: 'company_admin',
    },
    {
        email: 'company_member1@test.com',
        password: 'TestPass123!',
        role: 'company_member',
    },
    {
        email: 'company_member2@test.com',
        password: 'TestPass123!',
        role: 'company_member',
    },
    {
        email: 'partner_admin@test.com',
        password: 'TestPass123!',
        role: 'partner_admin',
    },
    {
        email: 'partner_member@test.com',
        password: 'TestPass123!',
        role: 'partner_member',
    },
    {
        email: 'sponsor_admin@test.com',
        password: 'TestPass123!',
        role: 'sponsor_admin',
    },
];

async function createTestUsers() {
    console.log('🚀 Creating test users in Supabase...\n');
    console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

    for (const user of TEST_USERS) {
        try {
            // Check if user already exists
            const { data: existingUsers } = await supabase.auth.admin.listUsers();
            const exists = existingUsers?.users?.some(u => u.email === user.email);

            if (exists) {
                console.log(`⏭️  Skipped ${user.email} (already exists)`);
                continue;
            }

            // Create user
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    role: user.role,
                },
            });

            if (error) {
                console.error(`❌ Failed to create ${user.email}: ${error.message}`);
            } else {
                console.log(`✅ Created ${user.email} (${user.role})`);
            }
        } catch (err) {
            console.error(`❌ Error creating ${user.email}:`, err);
        }
    }

    console.log('\n✨ Done!');
}

createTestUsers();
