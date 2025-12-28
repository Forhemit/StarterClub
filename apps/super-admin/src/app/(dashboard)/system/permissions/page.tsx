import { PermissionsList } from '@/components/roles/PermissionsList';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function PermissionsPage() {
    const supabase = await createSupabaseServerClient();

    const { data: permissions, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category')
        .order('resource');

    if (error) {
        console.error(error);
        return <div>Error loading permissions</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Permissions Reference</h1>
                <p className="text-muted-foreground">
                    View all available system permissions categorized by domain.
                </p>
            </div>
            <PermissionsList permissions={permissions || []} />
        </div>
    );
}
