import { ReactNode } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import type { PermissionDef, PermissionAction } from '@starter-club/utils';

interface PermissionGuardProps {
    requiredPermission?: string;
    requiredRole?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

const VALID_ACTIONS: PermissionAction[] = ['create', 'read', 'update', 'delete', 'approve', 'pay', 'manage'];

/**
 * Parse a permission string (format: "category:resource:action") into a PermissionDef object
 */
function parsePermissionString(permission: string): PermissionDef | null {
    const parts = permission.split(':');
    if (parts.length !== 3) {
        console.warn(`Invalid permission format: ${permission}. Expected "category:resource:action"`);
        return null;
    }

    const action = parts[2] as PermissionAction;
    if (!VALID_ACTIONS.includes(action)) {
        console.warn(`Invalid permission action: ${action}. Expected one of: ${VALID_ACTIONS.join(', ')}`);
        return null;
    }

    return {
        category: parts[0],
        resource: parts[1],
        action,
    };
}

export function PermissionGuard({ requiredPermission, requiredRole, children, fallback = null }: PermissionGuardProps) {
    const { hasPermission, hasRole, isLoading } = useUserRoles();

    if (isLoading) {
        // You might want to return a skeleton or null here
        // For now, null to prevent flash of content
        return null;
    }

    if (requiredPermission) {
        const permissionDef = parsePermissionString(requiredPermission);
        if (permissionDef && !hasPermission(permissionDef)) {
            return <>{fallback}</>;
        }
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
