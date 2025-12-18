import { LucideIcon } from 'lucide-react';

export type UserRole = 'admin' | 'partner_admin' | 'marketing_admin' | 'flight_deck_admin';

export interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
    roles?: UserRole[]; // Roles allowed to see this item
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
            if (!item.roles) return true;
            return item.roles.some(r => userRoles.includes(r));
        });

        nav.push(...modNav);
    });

    return nav;
}
