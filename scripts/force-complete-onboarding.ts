import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const USER_ID = 'user_36nbmB05wun3x8Ws85gmBWVFMxf';

async function forceCompleteOnboarding() {
    console.log('Forcing onboarding completion for user:', USER_ID);

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // Update profile to mark onboarding as complete
    const { error } = await serviceClient
        .from('profiles')
        .update({
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', USER_ID);

    if (error) {
        console.error('Error updating profile:', error);
        return;
    }

    // Verify update
    const { data: profile } = await serviceClient
        .from('profiles')
        .select('id, onboarding_completed, onboarding_completed_at, active_roles')
        .eq('id', USER_ID)
        .single();

    console.log('\n✓ Profile updated successfully:');
    console.log('  - onboarding_completed:', profile?.onboarding_completed);
    console.log('  - onboarding_completed_at:', profile?.onboarding_completed_at);
    console.log('  - active_roles:', profile?.active_roles);
    console.log('\nYou should now be able to access the dashboard.');
}

forceCompleteOnboarding().catch(console.error);
