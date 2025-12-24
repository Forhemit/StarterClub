import { Module, registerModule } from '../modules';
import { ShoppingBag } from 'lucide-react';

const marketplaceModule: Module = {
    id: 'marketplace',
    name: 'Marketplace',
    basePath: '/marketplace',
    roles: ['admin'],
    navigation: [
        {
            label: 'Marketplace',
            href: '/marketplace',
            icon: ShoppingBag
        }
    ]
};

registerModule(marketplaceModule);
