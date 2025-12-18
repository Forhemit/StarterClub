import { Module, registerModule } from '../modules';
import { Settings, Users } from 'lucide-react';

const systemModule: Module = {
    id: 'system',
    name: 'System',
    basePath: '/system',
    roles: ['admin'], // Super Admin only
    navigation: [
        {
            label: 'User Management',
            href: '/system/users',
            icon: Users,
        },
        {
            label: 'Settings',
            href: '/system/settings',
            icon: Settings
        }
    ]
};

registerModule(systemModule);
