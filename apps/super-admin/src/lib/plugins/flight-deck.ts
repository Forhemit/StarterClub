import { Module, registerModule } from '../modules';
import { Plane, Activity } from 'lucide-react';

const flightDeckModule: Module = {
    id: 'flight-deck',
    name: 'Flight Deck',
    basePath: '/flight-deck',
    roles: ['admin', 'flight_deck_admin'],
    navigation: [
        {
            label: 'Mission Control',
            href: '/flight-deck/mission-control',
            icon: Activity,
        },
        {
            label: 'Flights',
            href: '/flight-deck/flights',
            icon: Plane
        }
    ]
};

registerModule(flightDeckModule);
