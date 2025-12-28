export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'pay' | 'manage';

export interface PermissionDef {
    category: string;
    resource: string;
    action: PermissionAction;
}

export const PERMISSIONS = {
    // User Management
    USER_READ: { category: 'user_management', resource: 'users', action: 'read' },
    USER_CREATE: { category: 'user_management', resource: 'users', action: 'create' },
    USER_UPDATE: { category: 'user_management', resource: 'users', action: 'update' },
    USER_DELETE: { category: 'user_management', resource: 'users', action: 'delete' },

    // Role Management
    ROLE_READ: { category: 'system_management', resource: 'roles', action: 'read' },
    ROLE_MANAGE: { category: 'system_management', resource: 'roles', action: 'manage' },

    // Billing
    INVOICE_READ: { category: 'billing', resource: 'invoices', action: 'read' },
    INVOICE_PAY: { category: 'billing', resource: 'invoices', action: 'pay' },

    // Audit
    AUDIT_READ: { category: 'system_management', resource: 'audit_logs', action: 'read' },
} as const;

/**
 * Check if a list of permissions contains the required permission.
 * Supports wildcard action '*' if implemented in future.
 */
export function hasPermission(
    userPermissions: PermissionDef[],
    required: PermissionDef
): boolean {
    if (!userPermissions) return false;

    return userPermissions.some(p =>
        p.category === required.category &&
        p.resource === required.resource &&
        (p.action === required.action || p.action === 'manage')
    );
}

/**
 * Check if user has ALL required permissions
 */
export function hasAllPermissions(
    userPermissions: PermissionDef[],
    requiredList: PermissionDef[]
): boolean {
    return requiredList.every(req => hasPermission(userPermissions, req));
}

/**
 * Check if user has ANY of the required permissions
 */
export function hasAnyPermission(
    userPermissions: PermissionDef[],
    requiredList: PermissionDef[]
): boolean {
    return requiredList.some(req => hasPermission(userPermissions, req));
}
