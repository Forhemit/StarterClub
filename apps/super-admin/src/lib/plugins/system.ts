import { Module, registerModule } from '../modules';
import { Settings, Users } from 'lucide-react';

const systemModule: Module = {
    id: 'system',
    name: 'System',
    basePath: '/system',
    roles: ['admin'], // Super Admin only
    navigation: [
        {
            label: 'Users',
            href: '/system/users',
            icon: Users,
            capability: 'CAN_VIEW_SYSTEM_SETTINGS'
        },
        {
            label: 'Settings',
            href: '/system/settings',
            icon: Settings,
            capability: 'CAN_VIEW_SYSTEM_SETTINGS'
        }
    ]
};

registerModule(systemModule);
