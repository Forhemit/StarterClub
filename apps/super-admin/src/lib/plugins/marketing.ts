import { Module, registerModule } from '../modules';
import { LayoutDashboard, Users, FileText } from 'lucide-react';

const marketingModule: Module = {
    id: 'marketing',
    name: 'Marketing Content',
    basePath: '/marketing',
    roles: ['admin', 'marketing_admin', 'partner_admin'],
    navigation: [
        {
            label: 'Overview',
            href: '/marketing',
            icon: LayoutDashboard,
        },
        {
            label: 'Partner Reports',
            href: '/marketing/reports',
            icon: FileText
        }
    ]
};

registerModule(marketingModule);
