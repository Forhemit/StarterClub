import { Member } from './types';

export const APP_NAME = "Starter Club Reception";

export const MOCK_MEMBERS: (Member & { phone: string })[] = [
  {
    id: 'M001',
    firstName: 'Alice',
    lastName: 'Chen',
    tier: 'Pro',
    joinDate: '2023-01-15',
    photoUrl: 'https://picsum.photos/200/200?random=1',
    isInBuilding: true,
    phone: '555-0101'
  },
  {
    id: 'M002',
    firstName: 'Marcus',
    lastName: 'Johnson',
    tier: 'Enterprise',
    joinDate: '2023-03-22',
    photoUrl: 'https://picsum.photos/200/200?random=2',
    isInBuilding: false,
    phone: '555-0102'
  },
  {
    id: 'M003',
    firstName: 'Sarah',
    lastName: 'Connor',
    tier: 'Starter',
    joinDate: '2023-06-10',
    photoUrl: 'https://picsum.photos/200/200?random=3',
    isInBuilding: true,
    phone: '555-0103'
  }
];

export const RESOURCE_PRICES: Record<string, number> = {
  'Workstation': 0, 
  'Creator Room': 50,
  'Meeting Room': 75,
  'Podcast Studio': 60,
  'None': 0
};

export interface RoomOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export const ROOM_CATEGORIES: Record<string, RoomOption[]> = {
  "Core Builders Rooms": [
    { id: 'build', name: 'Build Room (Deep Work)', price: 25, description: 'Silent, dual monitors' },
    { id: 'strategy', name: 'Strategy Room', price: 0, description: 'Whiteboards, team table' },
    { id: 'prototype', name: 'Prototype Lab', price: 0, description: 'Workshop setup' }
  ],
  "Creator & Communication": [
    { id: 'podcast', name: 'Podcast / Audio Room', price: 60, description: 'Soundproof, mics' },
    { id: 'photo', name: 'Photo + Product Shoot', price: 50, description: 'Backdrops, lighting' },
    { id: 'shortform', name: 'Short-Form Studio', price: 40, description: 'Vertical video setup' }
  ],
  "Business-Critical": [
    { id: 'finance', name: 'Finance & Admin Room', price: 0, description: 'Private, secure' },
    { id: 'client', name: 'Client Meeting Room', price: 75, description: 'Presentation screen' },
    { id: 'advisor', name: 'Advisor / Office Hours', price: 0, description: '1-on-1 mentoring' }
  ],
  "Super Stations": [
    { id: 'creator-lab', name: 'The Creator Lab (Mid-Mac)', price: 15, description: 'Design & Editing' },
    { id: 'code-pod', name: 'Code & Create Pod (Mid-PC)', price: 15, description: 'Dev setup' },
    { id: 'vision', name: 'Studio-A: Vision Engine', price: 35, description: 'Premium Mac Pro' },
    { id: 'power', name: 'Power Forge (Premium-PC)', price: 35, description: 'RTX 4090, 3D/AI' }
  ]
};