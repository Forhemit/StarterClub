import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from './useSupabase';
import { Database } from '@/lib/database.types';
import { PermissionDef, hasPermission as checkPermission } from '@starter-club/utils';

type Role = Database['public']['Tables']['roles']['Row'];

export function useUserRoles() {
    const { user, isLoaded: isUserLoaded } = useUser();
    const supabase = useSupabase();
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<PermissionDef[]>([]);
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
                // Query uses clerk_user_id and joins through roles -> role_permissions -> permissions
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
                                    category,
                                    resource,
                                    action
                                )
                            )
                        )
                    `)
                    .eq('clerk_user_id', user.id)
                    .eq('is_active', true);

                if (error) {
                    console.error('Error fetching roles:', error);
                    return;
                }

                const fetchedRoles: Role[] = [];
                const fetchedPermissions: PermissionDef[] = [];
                const permissionSet = new Set<string>(); // To deduplicate

                if (data) {
                    for (const item of data) {
                        const roleData = item.role as any;
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
                                    if (rp.permission) {
                                        const p = rp.permission;
                                        const key = `${p.category}:${p.resource}:${p.action}`;
                                        if (!permissionSet.has(key)) {
                                            permissionSet.add(key);
                                            fetchedPermissions.push({
                                                category: p.category,
                                                resource: p.resource,
                                                action: p.action
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                }

                setRoles(fetchedRoles);
                setPermissions(fetchedPermissions);
            } catch (err) {
                console.error('Unexpected error in useUserRoles:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRoles();
    }, [user?.id, isUserLoaded, supabase]);

    const hasRole = (slug: string) => roles.some(r => r.slug === slug);

    const hasPermission = (required: PermissionDef) => {
        return checkPermission(permissions, required);
    };

    return {
        roles,
        permissions,
        isLoading,
        hasRole,
        hasPermission
    };
}
