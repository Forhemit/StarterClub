import { ReactNode } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';

interface PermissionGuardProps {
    requiredPermission?: string;
    requiredRole?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export function PermissionGuard({ requiredPermission, requiredRole, children, fallback = null }: PermissionGuardProps) {
    const { hasPermission, hasRole, isLoading } = useUserRoles();

    if (isLoading) {
        // You might want to return a skeleton or null here
        // For now, null to prevent flash of content
        return null;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <>{fallback}</>;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
