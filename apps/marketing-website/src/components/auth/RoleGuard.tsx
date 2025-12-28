'use client';

import React from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { PermissionDef, hasPermission } from '@starter-club/utils';

interface RoleGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requiredRole?: string;
    requiredPermission?: PermissionDef;
    requireAllPermissions?: PermissionDef[];
    requireAnyPermission?: PermissionDef[];
}

export function RoleGuard({
    children,
    fallback = null,
    requiredRole,
    requiredPermission,
    requireAllPermissions,
    requireAnyPermission
}: RoleGuardProps) {
    const { roles, permissions, isLoading, hasRole } = useUserRoles();

    if (isLoading) {
        return <>{fallback}</>; // Or some loading spinner if fallback not provided?
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <>{fallback}</>;
    }

    if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
        return <>{fallback}</>;
    }

    if (requireAllPermissions) {
        const allMet = requireAllPermissions.every(p => hasPermission(permissions, p));
        if (!allMet) return <>{fallback}</>;
    }

    if (requireAnyPermission) {
        const anyMet = requireAnyPermission.some(p => hasPermission(permissions, p));
        if (!anyMet) return <>{fallback}</>;
    }

    return <>{children}</>;
}
