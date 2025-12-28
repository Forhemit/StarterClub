import { createClient } from '@supabase/supabase-js';

// Use service role key if available for system operations, otherwise anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export class RoleService {
    /**
     * Get a Supabase client.
     * Uses service role key if provided (server-side admin), otherwise anon key.
     */
    private static getClient(useServiceRole = false) {
        if (useServiceRole && supabaseServiceKey) {
            return createClient(supabaseUrl, supabaseServiceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });
        }
        return createClient(supabaseUrl, supabaseAnonKey);
    }

    // Get user's current active roles
    static async getUserActiveRoles(clerkUserId: string): Promise<string[]> {
        const supabase = this.getClient();
        const { data, error } = await supabase
            .from('user_roles')
            .select('role_slug')
            .eq('clerk_user_id', clerkUserId)
            .eq('is_active', true)
            .lte('effective_from', new Date().toISOString())
            .or(`effective_until.is.null,effective_until.gt.${new Date().toISOString()}`);

        if (error) throw error;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (data || []).map((r: any) => r.role_slug);
    }

    // Assign a role to a user (Requires Service Role or appropriate RLS)
    static async assignRole(
        clerkUserId: string,
        roleSlug: string,
        assignedBy: string = 'system',
        reason: string = '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: Record<string, any> = {}
    ) {
        // Only allow assignment if we have service role or if we are calling via RPC which handles security
        // For client-side self-selection, RLS prevents arbitrary assignment, but RPC might be exposed.
        // Ideally, this should be server-side only for security.
        const supabase = this.getClient(true);

        const { data, error } = await supabase.rpc('assign_user_roles', {
            p_clerk_user_id: clerkUserId,
            p_role_slugs: [roleSlug],
            p_assigned_by: assignedBy,
            p_assigned_reason: reason
        });

        if (error) throw error;

        // Update metadata if provided
        if (Object.keys(metadata).length > 0) {
            await supabase
                .from('user_roles')
                .update({ metadata })
                .eq('clerk_user_id', clerkUserId)
                .eq('role_slug', roleSlug)
                .is('revoked_at', null);
        }

        return data;
    }

    // Deactivate a role (soft delete - keeps history)
    static async deactivateRole(
        clerkUserId: string,
        roleSlug: string,
        revokedBy: string = 'system',
        reason: string = '',
        effectiveUntil?: Date
    ) {
        const supabase = this.getClient(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
            is_active: false,
            revoked_at: new Date().toISOString(),
            revoked_by: revokedBy,
            revoked_reason: reason,
            updated_at: new Date().toISOString()
        };

        if (effectiveUntil) {
            updateData.effective_until = effectiveUntil.toISOString();
        }

        const { error } = await supabase
            .from('user_roles')
            .update(updateData)
            .eq('clerk_user_id', clerkUserId)
            .eq('role_slug', roleSlug)
            .eq('is_active', true);

        if (error) throw error;

        // If this was the primary role, assign a new primary
        const { data: primaryRole } = await supabase
            .from('user_roles')
            .select('*')
            .eq('clerk_user_id', clerkUserId)
            .eq('is_primary', true)
            .eq('is_active', true)
            .single();

        if (!primaryRole) {
            // Assign first active role as primary
            await supabase
                .from('user_roles')
                .update({ is_primary: true })
                .eq('clerk_user_id', clerkUserId)
                .eq('is_active', true)
                .limit(1);
        }
    }

    // Set primary role
    static async setPrimaryRole(clerkUserId: string, roleSlug: string) {
        const supabase = this.getClient(true); // Requires privilege to update roles

        // 1. Unset current primary
        const { error: clearError } = await supabase
            .from('user_roles')
            .update({ is_primary: false })
            .eq('clerk_user_id', clerkUserId)
            .eq('is_active', true);

        if (clearError) throw clearError;

        // 2. Set new primary
        const { error: setError } = await supabase
            .from('user_roles')
            .update({ is_primary: true })
            .eq('clerk_user_id', clerkUserId)
            .eq('role_slug', roleSlug)
            .eq('is_active', true);

        if (setError) throw setError;
    }

    // Get role history for a user
    static async getRoleHistory(clerkUserId: string, daysBack: number = 365) {
        const supabase = this.getClient();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);

        const { data, error } = await supabase.rpc('get_user_role_timeline', {
            p_clerk_user_id: clerkUserId,
            p_start_date: startDate.toISOString(),
            p_end_date: new Date().toISOString()
        });

        if (error) throw error;
        return data;
    }

    // Check if user has a specific role
    static async hasRole(clerkUserId: string, roleSlug: string): Promise<boolean> {
        const supabase = this.getClient();
        const { data } = await supabase
            .from('user_roles')
            .select('id')
            .eq('clerk_user_id', clerkUserId)
            .eq('role_slug', roleSlug)
            .eq('is_active', true)
            .lte('effective_from', new Date().toISOString())
            .or(`effective_until.is.null,effective_until.gt.${new Date().toISOString()}`)
            .single();

        return !!data;
    }

    // Get user's role timeline for display
    static async getUserRolesTimeline(clerkUserId: string) {
        const supabase = this.getClient();
        const { data, error } = await supabase
            .from('user_roles')
            .select(`
        *,
        roles (*)
      `)
            .eq('clerk_user_id', clerkUserId)
            .order('assigned_at', { ascending: false });

        if (error) throw error;

        // Group by role for timeline view
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const timeline = (data || []).reduce((acc: Record<string, any[]>, roleAssignment: any) => {
            if (!acc[roleAssignment.role_slug]) {
                acc[roleAssignment.role_slug] = [];
            }
            acc[roleAssignment.role_slug].push({
                assigned_at: roleAssignment.assigned_at,
                effective_until: roleAssignment.effective_until,
                revoked_at: roleAssignment.revoked_at,
                is_active: roleAssignment.is_active,
                assigned_by: roleAssignment.assigned_by,
                assigned_reason: roleAssignment.assigned_reason
            });
            return acc;
        }, {});

        return timeline;
    }
}
