import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for webhook as it needs admin privileges to assign roles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Business logic to determine roles
async function determineUserRoles(email: string, clerkUserId: string, supabase: any): Promise<string[]> {
    const roles: string[] = ['guest']; // Default role

    // Example: Stephen gets all these roles (Hardcoded for demo/specific user)
    // In production this might be in a config or admin table
    if (email.toLowerCase() === 'stephenobamastokes@gmail.com') {
        roles.push('member', 'partner', 'sponsor', 'employee', 'super_admin');
    }

    // Check members table
    // Note: Adjust table names if they are different in your schema (e.g. 'members' vs 'users')
    const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .or(`email.eq.${email},secondary_emails.cs.{${email}}`)
        .maybeSingle();

    if (memberData) {
        if (!roles.includes('member')) roles.push('member');
        // If member has a specific sub-role in the members table
        if (memberData.role && !roles.includes(memberData.role)) {
            roles.push(memberData.role);
        }
    }

    // Check partners table
    const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (partnerData && !roles.includes('partner')) {
        roles.push('partner');
    }

    // Check employees table
    const { data: employeeData } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (employeeData && !roles.includes('employee')) {
        roles.push('employee');
    }

    // Check sponsors table
    const { data: sponsorData } = await supabase
        .from('sponsors')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (sponsorData && !roles.includes('sponsor')) {
        roles.push('sponsor');
    }

    // Domain-based assignment
    if (email.endsWith('@yourcompany.com') && !roles.includes('employee')) {
        roles.push('employee');
    }

    return Array.from(new Set(roles)); // Remove duplicates
}

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400,
        });
    }

    const eventType = evt.type;
    const eventData = evt.data;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name } = eventData;
        const email = email_addresses?.[0]?.email_address;

        if (!email) return new Response('No email found', { status: 400 });

        try {
            // Create basic profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    clerk_user_id: id,
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    // onboarding_completed: false, // Default is false in DB
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'clerk_user_id' });

            if (profileError) throw profileError;

            // Determine roles based on business logic
            const rolesToAssign = await determineUserRoles(email, id, supabase);

            // Assign roles using our PostgreSQL function
            const { data: roleAssignment, error: roleError } = await supabase.rpc(
                'assign_user_roles',
                {
                    p_clerk_user_id: id,
                    p_role_slugs: rolesToAssign,
                    p_assigned_by: 'system',
                    p_assigned_reason: 'Initial user creation'
                }
            );

            if (roleError) {
                console.error('Error assigning roles:', roleError);
                throw roleError;
            }

            console.log('Roles assigned successfully:', roleAssignment);

        } catch (error) {
            console.error('Webhook processing error:', error);
            return new Response('Error processing webhook', { status: 500 });
        }
    }

    return new Response('', { status: 200 });
}
