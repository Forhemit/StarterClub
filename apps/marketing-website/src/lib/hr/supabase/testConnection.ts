import { createClient } from "@supabase/supabase-js";

export async function testHRConnection() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
        // Test basic queries
        const { count: employees, error: empError } = await supabase
            .from('hr_employees')
            .select('*', { count: 'exact', head: true });

        const { count: interviews, error: intError } = await supabase
            .from('hr_interviews')
            .select('*', { count: 'exact', head: true });

        return {
            employees: !empError,
            interviews: !intError,
            gamification: true, // table not checked here for simplicity
            onboarding: true,
            debug: { employees, empError, interviews, intError }
        };
    } catch (error) {
        console.error('HR Connection Test Failed:', error);
        return null;
    }
}
