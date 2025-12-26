import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from './useSupabase';
import { Database } from '@/lib/database.types';

type Role = Database['public']['Tables']['roles']['Row'];

export function useUserRoles() {
    const { user, isLoaded: isUserLoaded } = useUser();
    const supabase = useSupabase();
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRoles() {
            if (!isUserLoaded) return;

            if (!user?.id) {
                setRoles([]);
                setPermissions([]);
                setIsLoading(false);
                return;
            }

            try {
                // Fetch user roles and their associated permissions
                // Note: The type assertion (any) is used because the deep nesting of related tables 
                // can sometimes be tricky with Supabase's auto-generated types in joined queries.
                const { data, error } = await supabase
                    .from('user_roles')
                    .select(`
                        role:roles (
                            id,
                            name,
                            slug,
                            description,
                            created_at,
                            role_permissions (
                                permission:permissions (
                                    slug
                                )
                            )
                        )
                    `)
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error fetching roles:', error);
                    return;
                }

                const fetchedRoles: Role[] = [];
                const fetchedPermissions = new Set<string>();

                if (data) {
                    for (const item of data) {
                        const roleData = item.role as any; // Cast to bypass strict type check on Join
                        if (roleData) {
                            fetchedRoles.push({
                                id: roleData.id,
                                name: roleData.name,
                                slug: roleData.slug,
                                description: roleData.description,
                                created_at: roleData.created_at
                            });

                            if (Array.isArray(roleData.role_permissions)) {
                                roleData.role_permissions.forEach((rp: any) => {
                                    if (rp.permission?.slug) {
                                        fetchedPermissions.add(rp.permission.slug);
                                    }
                                });
                            }
                        }
                    }
                }

                setRoles(fetchedRoles);
                setPermissions(Array.from(fetchedPermissions));
            } catch (err) {
                console.error('Unexpected error in useUserRoles:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRoles();
    }, [user?.id, isUserLoaded, supabase]);

    const hasRole = (slug: string) => roles.some(r => r.slug === slug);
    const hasPermission = (slug: string) => permissions.includes(slug);

    return {
        roles,
        permissions,
        isLoading,
        hasRole,
        hasPermission
    };
}
