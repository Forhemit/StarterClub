import { createClerkClient } from '@clerk/backend';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables BEFORE other imports that might use them
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifySetup() {
    console.log('🔍 Starting End-to-End Verification...\n');

    // 1. Verify Environment Variables
    const requiredVars = [
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'NEXT_PUBLIC_SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
        console.error('❌ Missing Environment Variables:', missing.join(', '));
        process.exit(1);
    } else {
        console.log('✅ Environment Variables Present');
    }

    // Dynamic import to ensure env vars are loaded
    const { handleUserCreated } = await import('../src/lib/webhooks/actions');

    // 2. Verify Clerk Connection
    console.log('\nTesting Clerk Connection...');
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    try {
        const list = await clerk.users.getUserList({ limit: 1 });
        console.log(`✅ Clerk Connection Successful. Found ${list.totalCount} users.`);
    } catch (err: any) {
        console.error('❌ Clerk Connection Failed:', err.message);
    }

    // 3. Verify Supabase Connection
    console.log('\nTesting Supabase Connection...');
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { error } = await supabase.from('members').select('count').single();
        if (error) throw error;
        console.log('✅ Supabase Connection Successful (members table accessible).');
    } catch (err: any) {
        console.error('❌ Supabase Connection Failed:', err.message);
        if (err.message.includes('relation "members" does not exist')) {
            console.error('   Hint: Did you run the migration? "npx supabase db push"');
        }
    }

    // 4. Simulate User Creation Webhook Logic
    console.log('\nRunning Webhook Logic Simulation...');
    const mockUserId = `test_user_sim_${Date.now()}`;
    const mockEmail = `test_${Date.now()}@simulation.com`;

    try {
        console.log(`   Simulating creation of user: ${mockUserId}`);
        await handleUserCreated({
            id: mockUserId,
            email_addresses: [{ email_address: mockEmail }],
            first_name: 'Simulated',
            last_name: 'User'
        });

        // Verify it exists in DB
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('clerk_user_id', mockUserId)
            .single();

        if (error || !data) {
            throw new Error('Member not found in DB after simulation.');
        }

        console.log('✅ Simulation Successful: User created and verified in Supabase.');
        console.log(`   Member Role: ${data.role} (Expected: starter_member)`);

        // Cleanup
        await supabase.from('members').delete().eq('clerk_user_id', mockUserId);
        console.log('   Cleaned up test user.');

    } catch (err: any) {
        console.error('❌ Simulation Failed:', err.message);
    }

    console.log('\n🎉 Verification Complete.');
}

verifySetup();
