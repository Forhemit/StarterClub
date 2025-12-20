import { LucideIcon } from 'lucide-react';

export type UserRole = 'admin' | 'partner_admin' | 'marketing_admin' | 'flight_deck_admin';

export type Capability =
    | 'CAN_INVITE_ADMIN'
    | 'CAN_DELETE_ORG'
    | 'CAN_VIEW_SYSTEM_SETTINGS';

const ROLE_CAPABILITIES: Record<UserRole, Capability[]> = {
    admin: ['CAN_INVITE_ADMIN', 'CAN_DELETE_ORG', 'CAN_VIEW_SYSTEM_SETTINGS'],
    partner_admin: [],
    marketing_admin: [],
    flight_deck_admin: []
};

export function hasCapability(role: UserRole, capability: Capability): boolean {
    return ROLE_CAPABILITIES[role]?.includes(capability) ?? false;
}

export interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
    roles?: UserRole[]; // Roles allowed to see this item
    capability?: Capability; // Capability required to see this item (new)
    children?: NavItem[];
}

export interface Module {
    id: string;
    name: string;
    basePath: string; // e.g. /dashboard/marketing
    navigation: NavItem[];
    roles?: UserRole[]; // Roles that have access to this module generally
}

export const modules: Module[] = [];

export function registerModule(module: Module) {
    modules.push(module);
}

export function getAuthorizedNavigation(userRoles: UserRole[]): NavItem[] {
    // Logic to filter modules and nav items based on userRoles
    const nav: NavItem[] = [];

    modules.forEach(mod => {
        // Check if user has access to module
        if (mod.roles && !mod.roles.some(r => userRoles.includes(r))) return;

        // Filter module navigation
        const modNav = mod.navigation.filter(item => {
            // Check Capability
            if (item.capability) {
                // If any of the user's roles has the capability, allow.
                // Simplified: We assume user has 1 role for now, but logical check:
                const hasCap = userRoles.some(role => hasCapability(role, item.capability!));
                if (!hasCap) return false;
            }

            if (!item.roles) return true;
            return item.roles.some(r => userRoles.includes(r));
        });

        nav.push(...modNav);
    });

    return nav;
}
