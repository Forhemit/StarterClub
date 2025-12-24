import { Module, registerModule } from '../modules';
import { Flag, Activity } from 'lucide-react';

const flightDeckModule: Module = {
    id: 'flight-deck',
    name: 'The Race Track',
    basePath: '/flight-deck',
    roles: ['admin', 'flight_deck_admin'],
    navigation: [
        {
            label: 'Race Control',
            href: '/flight-deck/mission-control',
            icon: Activity,
        },
        {
            label: 'Starting Grid',
            href: '/flight-deck/flights',
            icon: Flag
        }
    ]
};

registerModule(flightDeckModule);
