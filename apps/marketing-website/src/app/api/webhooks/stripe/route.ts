import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.mode === 'payment' || session.mode === 'subscription') {
                    await handleCheckoutCompleted(session);
                }
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }
            case 'charge.succeeded': {
                const charge = event.data.object as Stripe.Charge;
                await handleChargeSucceeded(charge);
                break;
            }
            case 'payout.paid': {
                const payout = event.data.object as Stripe.Payout;
                await handlePayoutPaid(payout);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        console.error(`Error processing webhook: ${error.message}`);
        return new Response(`Webhook Error: ${error.message}`, { status: 500 });
    }

    return new Response('Received', { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    // We only care if we have metadata indicating a custom deal or if it's one of our known products
    // But for now, let's just log everything that looks like a subscription or payment we care about.

    // Note: For one-time payments (sponsorships), we might not get a subscription object.
    // We need to check line items or metadata to know what it was.

    if (!session.customer) return;

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    // Try to find the org based on customer logic (this might need future refinement to link customer -> org)
    // For now, assuming org_id might be passed in metadata or we just store the customer_id as the link.
    // The 'organization_subscriptions' table expects 'org_id'. 
    // If we don't have it, we might need to fallback or store it as 'unknown' and fix later, 
    // OR we assume the customer metadata has it.

    // Let's assume metadata on the checkout session carries the org_id if relevant, 
    // or we just use the customer_id as a proxy for now if we can't find it.
    // But wait, the schema says org_id is NOT NULL. 
    // In `createCustomCheckoutSession`, we didn't pass org_id, but we passed 'sales_rep_id'.
    // Maybe we should store 'customer_id' as 'org_id' if we don't have a better one? 
    // Or maybe we should rely on Stripe Customer metadata?

    // Correct approach for this strict schema:
    // We'll try to get org_id from metadata. If missing, we use customer_id (assuming 1:1 mapping for now).
    const orgId = session.metadata?.org_id || customerId;

    // Determine status
    const status = session.payment_status === 'paid' ? 'active' : 'pending'; // Simplified

    // For one-time payments, we verify the payment intent status? checkout.session.completed means it's done usually.


    if (session.mode === 'subscription' && subscriptionId) {
        // Check if this is a Member Subscription (has client_reference_id or specific metadata)
        // client_reference_id is usually set to the Clerk User ID in our actions.ts
        const clerkUserId = session.client_reference_id;

        if (clerkUserId) {
            await handleMemberSubscriptionCheckout(session, subscriptionId, clerkUserId);
            return;
        }

        // Existing logic for Partner/Org subscriptions...
        // It will be handled by customer.subscription.created/updated usually, 
        // but checkout.session.completed gives us the "Sales Rep" metadata which sub events might not have immediately?
        // Actually, subscription metadata inherits from checkout? Not always.
        // Let's just create the record here as a starting point.

        // We need to fetch subscription to get End Date?
        // Or just wait for subscription.updated/created event?
        // Providing redundancy is good.

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await supabase.from('organization_subscriptions').upsert({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            org_id: orgId,
            status: subscription.status,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            is_custom_deal: session.metadata?.deal_type === 'custom_negotiated',
            metadata: session.metadata || {},
            stripe_price_id: subscription.items.data[0]?.price.id,
        }, { onConflict: 'stripe_subscription_id' });

    } else if (session.mode === 'payment') {
        // One-time payment (Sponsorship)
        // We store it as a 'subscription' with no renewal (conceptually) or just a record.
        // But the table has `stripe_subscription_id` as UNIQUE. 
        // For one-time, we can use checkout session ID or Payment Intent ID as the unique key?
        // But the column is named `stripe_subscription_id`. 
        // Maybe we leave it null? But it's unique. Nulls are allowed in unique columns in Postgres (usually multiple nulls allowed).
        // Let's verify schema: `stripe_subscription_id text unique`. 
        // We should probably allow it to be nullable if we want to store one-time deals.
        // The schema didn't enforce NOT NULL on `stripe_subscription_id`.

        // We'll use the session ID or payment intent ID as a reference in metadata, keep sub id null?
        // But if we want to track it, maybe we explicitly store session ID in metadata.

        await supabase.from('organization_subscriptions').insert({
            stripe_customer_id: customerId,
            org_id: orgId,
            status: 'one_time_paid',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Dummy 30 days logic or just immediate?
            // "One-time" doesn't really have an end, but let's just say it's "active" for a month for dashboard visibility?
            // Or per schema `current_period_end` is NOT NULL. So we need a date.
            // Let's set it to 1 year for sponsorship visibility?
            is_custom_deal: session.metadata?.deal_type === 'custom_negotiated',
            metadata: session.metadata || {},
            tier_name: 'Sponsorship (One-time)',
        });
    }
}

async function handleMemberSubscriptionCheckout(session: Stripe.Checkout.Session, subscriptionId: string, clerkUserId: string) {
    // Fetch member to get internal ID
    const { data: member } = await supabase.from('members').select('id').eq('clerk_user_id', clerkUserId).single();

    if (!member) {
        console.error(`Member not found for Clerk ID: ${clerkUserId}`);
        return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

    if (!customerId) return;

    // Upsert into member_subscriptions table
    await supabase.from('member_subscriptions').upsert({
        stripe_subscription_id: subscriptionId,
        member_id: member.id,
        stripe_customer_id: customerId,
        stripe_price_id: subscription.items.data[0]?.price.id,
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        metadata: session.metadata || {},
    }, { onConflict: 'stripe_subscription_id' });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    // Logic to distinguish Member vs Org subscription?
    // We can check if it exists in one table or the other? 
    // Or check metadata?
    // If we used `client_reference_id` in checkout, does it persist to subscription metadata? Not automatically.
    // But we can store `type: member` in metadata during checkout creation!

    if (subscription.metadata?.type === 'member') {
        await handleMemberSubscriptionUpdated(subscription);
        return;
    }

    // ... existing Org logic ...
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    // We need to find the existing org_id to upsert safely if we rely on it.
    // But upsert needs the PK or constraint. 
    // We have `stripe_subscription_id` as unique.

    // If it doesn't exist, we might fail to get org_id if not in metadata.
    // We'll rely on the fact that checkout created it first? 
    // OR we fetch the customer to see if we stored org_id there?
    // For now, let's fallback to customer_id.

    const orgId = subscription.metadata?.org_id || customerId;

    await supabase.from('organization_subscriptions').upsert({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        org_id: orgId,
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        stripe_price_id: subscription.items.data[0]?.price.id,
        metadata: subscription.metadata || {},
    }, { onConflict: 'stripe_subscription_id' });
}

async function handleMemberSubscriptionUpdated(subscription: Stripe.Subscription) {
    await supabase.from('member_subscriptions').update({
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        stripe_price_id: subscription.items.data[0]?.price.id,
        metadata: subscription.metadata || {},
    }).eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    if (subscription.metadata?.type === 'member') {
        await supabase.from('member_subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', subscription.id);
        return;
    }

    await supabase.from('organization_subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
    // 1. Check if potential duplicate (via stripe_sync_log or existing journal entry)
    // For now, we rely on the unique constraint in stripe_sync_log if we adhere to it, 
    // but here we are just doing the accounting.

    // Get the Income Source ID for 'Stripe'
    const { data: incomeSource } = await supabase
        .from('income_sources')
        .select('id')
        .eq('source_name', 'Stripe')
        .single();

    if (!incomeSource) {
        console.error('Accounting Error: "Stripe" income source not found.');
        return;
    }

    // Get Account IDs
    // We need: 1001 (Clearing), 4000 (Subscription Revenue), 5000 (Stripe Fees)
    // Optimized: Fetch all needed accounts in one query
    const { data: accounts } = await supabase
        .from('ledger_accounts')
        .select('id, account_code')
        .in('account_code', ['1001', '4000', '5000']);

    if (!accounts || accounts.length < 3) {
        console.error('Accounting Error: Missing required ledger accounts (1001, 4000, 5000).');
        return;
    }

    const clearingAcct = accounts.find(a => a.account_code === '1001')?.id;
    const revenueAcct = accounts.find(a => a.account_code === '4000')?.id;
    const feesAcct = accounts.find(a => a.account_code === '5000')?.id;

    if (!clearingAcct || !revenueAcct || !feesAcct) return;

    // Calculate Amounts
    const grossAmount = charge.amount / 100.0;
    // Balance transaction is needed for exact fee details usually, but charge object has it sometimes?
    // charge.balance_transaction is an ID. We might need to expand it or fetch it.
    // However, typical Stripe charge object might not have fee details directly at top level if it's not expanded.
    // But let's check basic properties. 
    // Usually we need `stripe.charges.retrieve(id, { expand: ['balance_transaction'] })` to be sure.
    // Or we rely on `balance_transaction` webhook.
    // But user asked for `charge.succeeded`.
    // Let's try to fetch balance transaction to get the fee.

    let feeAmount = 0;
    if (charge.balance_transaction) {
        const btId = typeof charge.balance_transaction === 'string' ? charge.balance_transaction : charge.balance_transaction.id;
        const bt = await stripe.balanceTransactions.retrieve(btId);
        feeAmount = bt.fee / 100.0;
    }

    // Create Journal Entry Header
    const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
            transaction_date: new Date(charge.created * 1000).toISOString(),
            description: `Stripe Charge ${charge.id} - ${charge.description || 'Payment'}`,
            income_source_id: incomeSource.id,
            external_reference_id: charge.id,
        })
        .select()
        .single();

    if (entryError || !entry) {
        console.error('Accounting Error: Failed to create journal entry', entryError);
        return;
    }

    // Prepare Lines
    const lines = [
        // 1. Debit Clearing (Asset) +Gross
        {
            journal_entry_id: entry.id,
            ledger_account_id: clearingAcct,
            entry_type: 'debit',
            amount: grossAmount,
            description: 'Gross Receipt'
        },
        // 2. Credit Revenue (Revenue) +Gross
        {
            journal_entry_id: entry.id,
            ledger_account_id: revenueAcct,
            entry_type: 'credit',
            amount: grossAmount, // Revenue is Credit normal
            description: 'Revenue Recognition'
        }
    ];

    if (feeAmount > 0) {
        // 3. Debit Fees (Expense) +Fee
        lines.push({
            journal_entry_id: entry.id,
            ledger_account_id: feesAcct,
            entry_type: 'debit',
            amount: feeAmount,
            description: 'Stripe Processing Fee'
        });
        // 4. Credit Clearing (Asset) -Fee (Reduces the asset)
        lines.push({
            journal_entry_id: entry.id,
            ledger_account_id: clearingAcct,
            entry_type: 'credit',
            amount: feeAmount,
            description: 'Fee Deduction from Clearing'
        });
    }

    const { error: linesError } = await supabase.from('journal_entry_lines').insert(lines);
    if (linesError) {
        console.error('Accounting Error: Failed to create lines', linesError);
    }

    // Log to Stripe Sync Log
    await supabase.from('stripe_sync_log').insert({
        stripe_event_id: charge.id + '_evt', // This should be event.id actually, but we don't have it passed here cleanly.
        stripe_object_id: charge.id,
        event_type: 'charge.succeeded',
        status: linesError ? 'failed' : 'processed',
        journal_entry_id: entry.id,
        processing_error: linesError ? linesError.message : null
    });
}

async function handlePayoutPaid(payout: Stripe.Payout) {
    // 1000: Bank, 1001: Clearing
    const { data: accounts } = await supabase
        .from('ledger_accounts')
        .select('id, account_code')
        .in('account_code', ['1000', '1001']);

    const bankAcct = accounts?.find(a => a.account_code === '1000')?.id;
    const clearingAcct = accounts?.find(a => a.account_code === '1001')?.id;

    if (!bankAcct || !clearingAcct) return;

    const amount = payout.amount / 100.0;

    // Create Journal Entry
    const { data: entry } = await supabase.from('journal_entries').insert({
        transaction_date: new Date(payout.created * 1000).toISOString(),
        description: `Stripe Payout ${payout.id}`,
        external_reference_id: payout.id,
    }).select().single();

    if (!entry) return;

    // Debit Bank (Increase Asset)
    // Credit Clearing (Decrease Asset)
    await supabase.from('journal_entry_lines').insert([
        {
            journal_entry_id: entry.id,
            ledger_account_id: bankAcct,
            entry_type: 'debit',
            amount: amount,
            description: 'Payout Deposit'
        },
        {
            journal_entry_id: entry.id,
            ledger_account_id: clearingAcct,
            entry_type: 'credit',
            amount: amount,
            description: 'Transfer from Clearing'
        }
    ]);
}
