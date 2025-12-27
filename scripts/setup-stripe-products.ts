import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local in root or apps/marketing-website
// Assuming script is run from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY not found in .env.local');
    process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
});

const products = [
    {
        name: 'Starter Pro',
        description: 'Always free membership',
        features: ['Community Access', 'Weekly Newsletter'],
        prices: [
            {
                unit_amount: 0,
                currency: 'usd',
                recurring: { interval: 'month' }, // Free sub is still a sub? Or just creating product?
                // Free plans in Stripe Subscriptions are weird. Usually $0 price.
                metadata: { key: 'starter_pro_free' }
            }
        ],
        metadata: { key: 'starter_pro', type: 'member' }
    },
    {
        name: 'Starter Builder Pro',
        description: 'For active builders',
        prices: [
            {
                unit_amount: 9900,
                currency: 'usd',
                recurring: { interval: 'month' },
                metadata: { key: 'builder_monthly' }
            },
            {
                unit_amount: 95040, // $950.40
                currency: 'usd',
                recurring: { interval: 'year' },
                metadata: { key: 'builder_yearly' }
            }
        ],
        metadata: { key: 'starter_builder', type: 'member' }
    },
    {
        name: 'Starter Founder Pro',
        description: 'For serious founders',
        prices: [
            {
                unit_amount: 19900,
                currency: 'usd',
                recurring: { interval: 'month' },
                metadata: { key: 'founder_monthly' }
            },
            {
                unit_amount: 191040, // $1,910.40
                currency: 'usd',
                recurring: { interval: 'year' },
                metadata: { key: 'founder_yearly' }
            }
        ],
        metadata: { key: 'starter_founder', type: 'member' }
    }
];

async function main() {
    console.log('Setting up Stripe Products...');

    const results: Record<string, any> = {};

    for (const p of products) {
        console.log(`\nProcessing ${p.name}...`);

        // Create Product
        const product = await stripe.products.create({
            name: p.name,
            description: p.description,
            metadata: p.metadata,
        });

        console.log(`  ✓ Created Product: ${product.id}`);
        results[p.name] = { product_id: product.id, prices: {} };

        // Create Prices
        for (const pr of p.prices) {
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: pr.unit_amount,
                currency: pr.currency,
                recurring: pr.recurring as Stripe.PriceCreateParams.Recurring,
                metadata: pr.metadata,
            });
            console.log(`  ✓ Created Price: $${pr.unit_amount / 100}/${pr.recurring?.interval} (${price.id})`);

            const key = `${pr.recurring?.interval}`;
            results[p.name].prices[key] = price.id;
        }
    }

    console.log('\n\n=== SETUP COMPLETE ===');
    console.log('Add these to your .env.local:');
    console.log('--------------------------------');

    // formatted output for .env
    console.log(`# Member Plans`);
    if (results['Starter Pro']) {
        // Free plan might not have a price ID we use for checkout if it's 0? 
        // Or we just sign them up without Stripe? 
        // Let's assume we use the price ID for consistency if we want a sub object.
        console.log(`STRIPE_PRICE_STARTER_PRO_MONTHLY=${results['Starter Pro'].prices['month']}`);
    }

    if (results['Starter Builder Pro']) {
        console.log(`STRIPE_PRICE_BUILDER_MONTHLY=${results['Starter Builder Pro'].prices['month']}`);
        console.log(`STRIPE_PRICE_BUILDER_YEARLY=${results['Starter Builder Pro'].prices['year']}`);
    }

    if (results['Starter Founder Pro']) {
        console.log(`STRIPE_PRICE_FOUNDER_MONTHLY=${results['Starter Founder Pro'].prices['month']}`);
        console.log(`STRIPE_PRICE_FOUNDER_YEARLY=${results['Starter Founder Pro'].prices['year']}`);
    }
    console.log('--------------------------------');
}

main().catch(console.error);
