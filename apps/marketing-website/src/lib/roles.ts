// lib/roles.ts
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    GUEST: 'guest'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const rolePermissions: Record<Role, Record<string, string[]>> = {
    [ROLES.SUPER_ADMIN]: {
        events: ['create', 'read', 'update', 'delete', 'manage_all'],
        users: ['create', 'read', 'update', 'delete', 'manage_all'],
        settings: ['read', 'update']
    },
    [ROLES.ADMIN]: {
        events: ['create', 'read', 'update', 'delete', 'manage_company'],
        users: ['create', 'read', 'update'],
        settings: ['read']
    },
    [ROLES.MANAGER]: {
        events: ['create', 'read', 'update', 'delete_own'],
        users: ['read_team'],
        settings: ['read']
    },
    [ROLES.EMPLOYEE]: {
        events: ['create', 'read', 'update_own', 'delete_own'],
        users: ['read'],
        settings: []
    },
    [ROLES.GUEST]: {
        events: ['read'],
        users: [],
        settings: []
    }
};

export function can(userRole: Role | undefined, resource: string, action: string): boolean {
    if (!userRole) return false;
    const permissions = rolePermissions[userRole];
    if (!permissions) return false;

    return permissions[resource]?.includes(action) || false;
}

export function getUserRoleConfig(role: Role | undefined) {
    // Placeholder for sidebar config based on role
    // This could also be dynamic or moved to a separate config
    const defaultItems = [
        { label: 'Dashboard', href: '/dashboard' }
    ];

    switch (role) {
        case ROLES.SUPER_ADMIN:
            return {
                displayName: 'Super Admin',
                sidebarItems: [
                    ...defaultItems,
                    { label: 'System Settings', href: '/admin/settings' },
                    { label: 'Manage Users', href: '/admin/users' }
                ]
            };
        case ROLES.ADMIN:
            return {
                displayName: 'Admin',
                sidebarItems: [
                    ...defaultItems,
                    { label: 'Company Settings', href: '/company/settings' }
                ]
            };
        default:
            return {
                displayName: 'Employee',
                sidebarItems: defaultItems
            };
    }
}
