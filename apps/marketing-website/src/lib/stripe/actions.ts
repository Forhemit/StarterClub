'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// URLs
const SUCCESS_URL = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`;
const CANCEL_URL = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`;

export async function createMemberCheckoutSession(priceId: string) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error('Unauthorized');
    }

    // Find or Create Stripe Customer for this user
    // We can look up by email or metadata.
    // Ideally, we store stripe_customer_id in our members table.
    // But for now, let's search by email for robustness or create new.

    const email = user.emailAddresses[0].emailAddress;

    let customerId: string | undefined;

    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
        customerId = customers.data[0].id;
    } else {
        const newCustomer = await stripe.customers.create({
            email,
            name: `${user.firstName} ${user.lastName}`,
            metadata: {
                clerk_user_id: userId,
            }
        });
        customerId = newCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: SUCCESS_URL,
        cancel_url: CANCEL_URL,
        client_reference_id: userId, // Pass Clerk ID here for Webhook matching
        metadata: {
            type: 'member', // Critical for webhook handler to know this is a member sub
            clerk_user_id: userId,
        },
        allow_promotion_codes: true,
        subscription_data: {
            metadata: {
                type: 'member', // Propagate to subscription object
                clerk_user_id: userId,
            }
        }
    });

    if (session.url) {
        redirect(session.url);
    }
}

export async function createCustomerPortalSession() {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) throw new Error('Unauthorized');

    const email = user.emailAddresses[0].emailAddress;
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
        throw new Error('No billing account found');
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: customers.data[0].id,
        return_url: SUCCESS_URL,
    });

    redirect(session.url);
}
