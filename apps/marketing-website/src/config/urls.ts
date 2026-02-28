// App URLs configuration
// These are read at build time from environment variables

export const APP_URLS = {
    marketing: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    superAdmin: process.env.NEXT_PUBLIC_SUPER_ADMIN_URL || 'http://localhost:3001',
    onboard: process.env.NEXT_PUBLIC_ONBOARD_URL || 'http://localhost:3002',
    flightDeck: process.env.NEXT_PUBLIC_FLIGHT_DECK_URL || 'http://localhost:3003',
    thirdSpace: process.env.NEXT_PUBLIC_THIRD_SPACE_URL || 'http://localhost:3004',
} as const;

// Helper to get URL with fallback
export function getAppUrl(key: keyof typeof APP_URLS): string {
    return APP_URLS[key];
}
