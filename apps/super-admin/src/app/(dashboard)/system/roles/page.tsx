import { RolesList } from '@/components/roles/RolesList';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function RolesPage() {
    const supabase = await createSupabaseServerClient();

    // Fetch roles
    const { data: roles, error } = await supabase
        .from('roles')
        .select('*')
        .order('permission_level', { ascending: false });

    if (error) {
        // In a real app, handle error gracefully
        console.error('Error loading roles', error);
        return <div>Error loading roles</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
                <p className="text-muted-foreground">
                    Manage system roles and their associated permissions.
                </p>
            </div>

            <RolesList initialRoles={roles || []} />
        </div>
    );
}
