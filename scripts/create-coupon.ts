import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY not found');
    process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
});

async function main() {
    console.log('Creating Coupon...');

    // Create Parent Coupon (100% off for 1 month)
    const coupon = await stripe.coupons.create({
        name: '30 Days Free Trial',
        percent_off: 100,
        duration: 'repeating',
        duration_in_months: 1,
        metadata: {
            description: 'First month free',
        }
    });

    console.log(`✓ Coupon Created: ${coupon.id}`);

    // Create Customer-Facing Promotion Code
    const promoCode = await stripe.promotionCodes.create({
        promotion: {
            type: 'coupon',
            coupon: coupon.id,
        },
        code: '30DAYSFREE', // The code user types
        restrictions: {
            first_time_transaction: true, // Only for new customers? Or new subs? usually first_time_transaction means on specific customer.
            // If we want it for any subscription start, maybe remove restriction if they return?
            // Let's keep first_time_transaction for true "Trial" feel.
        }
    } as any);

    console.log(`✓ Promotion Code Created: ${promoCode.code}`);
    console.log(`\nShare this code with your users: ${promoCode.code}`);
}

main().catch(console.error);
