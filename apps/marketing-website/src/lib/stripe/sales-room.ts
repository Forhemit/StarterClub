import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' });


interface CreateCustomCheckoutParams {
    amount: number; // in dollars (e.g., 2500)
    type: 'one_time' | 'recurring';
    customerId: string; // Existing Stripe Customer ID
    successUrl: string;
    cancelUrl: string;
    salesRepId: string;
}

export async function createCustomCheckoutSession({
    amount,
    type,
    customerId,
    successUrl,
    cancelUrl,
    salesRepId,
}: CreateCustomCheckoutParams): Promise<Stripe.Checkout.Session> {

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product: 'prod_custom_deal', // References the generic product
                unit_amount: amount * 100, // Converts dollars to cents
                ...(type === 'recurring' ? {
                    recurring: { interval: 'month' },
                } : {}),
            },
            quantity: 1,
        }],
        mode: type === 'recurring' ? 'subscription' : 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            deal_type: 'custom_negotiated',
            sales_rep_id: salesRepId,
            internal_notes: `Custom ${type} deal for $${amount}`,
        },
        customer_update: {
            address: 'auto',
        },
    };

    return await stripe.checkout.sessions.create(sessionParams);
}
