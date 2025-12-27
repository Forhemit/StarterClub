
import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
    console.error('CRITICAL: CLERK_SECRET_KEY is missing from .env.local');
    process.exit(1);
}

const clerkClient = createClerkClient({ secretKey });

async function verifyBillingAccess() {
    console.log('Testing Clerk Billing SDK Access...');
    try {
        // Attempt to access billing-related properties or methods
        // Note: The structure might vary based on SDK version and beta status
        // We'll try to log what's available under 'billing' if it exists, roughly following user request
        if ((clerkClient as any).billing) {
            console.log('Billing namespace found on clerkClient.');
            try {
                // Check specific method existence (it might be on the prototype)
                const getSubFn = (clerkClient as any).billing.getUserBillingSubscription;
                console.log('Type of getUserBillingSubscription:', typeof getSubFn);

                if (typeof getSubFn === 'function') {
                    console.log('SUCCESS: getUserBillingSubscription is available.');
                } else {
                    console.log('WARNING: getUserBillingSubscription is NOT a function.');
                    console.log('Available keys:', Object.keys((clerkClient as any).billing));
                }

            } catch (e) {
                console.log('Could not inspect billing methods directly.', e);
            }
        } else {
            console.log('Billing namespace NOT found on clerkClient.');
        }

        // Also try a generic user fetch to prove auth works
        const clientList = await clerkClient.users.getUserList({ limit: 1 });
        console.log(`Successfully connected to Clerk. Found ${clientList.totalCount} users.`);

    } catch (error) {
        console.error('Error accessing Clerk API:', error);
    }
}

verifyBillingAccess();

