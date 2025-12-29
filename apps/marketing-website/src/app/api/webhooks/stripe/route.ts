import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialized clients to avoid build-time errors
let stripeInstance: Stripe | null = null;
let supabaseInstance: SupabaseClient | null = null;

function getStripe(): Stripe {
    if (!stripeInstance) {
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-12-15.clover',
        });
    }
    return stripeInstance;
}

function getSupabase(): SupabaseClient {
    if (!supabaseInstance) {
        supabaseInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }
    return supabaseInstance;
}

export async function POST(req: Request) {
    const stripe = getStripe();
    const supabase = getSupabase();

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
                    await handleCheckoutCompleted(session, stripe, supabase);
                }
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription, supabase);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription, supabase);
                break;
            }
            case 'charge.succeeded': {
                const charge = event.data.object as Stripe.Charge;
                await handleChargeSucceeded(charge, stripe, supabase);
                break;
            }
            case 'payout.paid': {
                const payout = event.data.object as Stripe.Payout;
                await handlePayoutPaid(payout, supabase);
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, supabase: SupabaseClient) {
    if (!session.customer) return;

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    const orgId = session.metadata?.org_id || customerId;
    const status = session.payment_status === 'paid' ? 'active' : 'pending';

    if (session.mode === 'subscription' && subscriptionId) {
        const clerkUserId = session.client_reference_id;

        if (clerkUserId) {
            await handleMemberSubscriptionCheckout(session, subscriptionId, clerkUserId, stripe, supabase);
            return;
        }

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
        await supabase.from('organization_subscriptions').insert({
            stripe_customer_id: customerId,
            org_id: orgId,
            status: 'one_time_paid',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_custom_deal: session.metadata?.deal_type === 'custom_negotiated',
            metadata: session.metadata || {},
            tier_name: 'Sponsorship (One-time)',
        });
    }
}

async function handleMemberSubscriptionCheckout(
    session: Stripe.Checkout.Session,
    subscriptionId: string,
    clerkUserId: string,
    stripe: Stripe,
    supabase: SupabaseClient
) {
    const { data: member } = await supabase.from('members').select('id').eq('clerk_user_id', clerkUserId).single();

    if (!member) {
        console.error(`Member not found for Clerk ID: ${clerkUserId}`);
        return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

    if (!customerId) return;

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

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: SupabaseClient) {
    if (subscription.metadata?.type === 'member') {
        await handleMemberSubscriptionUpdated(subscription, supabase);
        return;
    }

    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
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

async function handleMemberSubscriptionUpdated(subscription: Stripe.Subscription, supabase: SupabaseClient) {
    await supabase.from('member_subscriptions').update({
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        stripe_price_id: subscription.items.data[0]?.price.id,
        metadata: subscription.metadata || {},
    }).eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: SupabaseClient) {
    if (subscription.metadata?.type === 'member') {
        await supabase.from('member_subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', subscription.id);
        return;
    }

    await supabase.from('organization_subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);
}

async function handleChargeSucceeded(charge: Stripe.Charge, stripe: Stripe, supabase: SupabaseClient) {
    const { data: incomeSource } = await supabase
        .from('income_sources')
        .select('id')
        .eq('source_name', 'Stripe')
        .single();

    if (!incomeSource) {
        console.error('Accounting Error: "Stripe" income source not found.');
        return;
    }

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

    const grossAmount = charge.amount / 100.0;

    let feeAmount = 0;
    if (charge.balance_transaction) {
        const btId = typeof charge.balance_transaction === 'string' ? charge.balance_transaction : charge.balance_transaction.id;
        const bt = await stripe.balanceTransactions.retrieve(btId);
        feeAmount = bt.fee / 100.0;
    }

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

    const lines = [
        {
            journal_entry_id: entry.id,
            ledger_account_id: clearingAcct,
            entry_type: 'debit',
            amount: grossAmount,
            description: 'Gross Receipt'
        },
        {
            journal_entry_id: entry.id,
            ledger_account_id: revenueAcct,
            entry_type: 'credit',
            amount: grossAmount,
            description: 'Revenue Recognition'
        }
    ];

    if (feeAmount > 0) {
        lines.push({
            journal_entry_id: entry.id,
            ledger_account_id: feesAcct,
            entry_type: 'debit',
            amount: feeAmount,
            description: 'Stripe Processing Fee'
        });
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

    await supabase.from('stripe_sync_log').insert({
        stripe_event_id: charge.id + '_evt',
        stripe_object_id: charge.id,
        event_type: 'charge.succeeded',
        status: linesError ? 'failed' : 'processed',
        journal_entry_id: entry.id,
        processing_error: linesError ? linesError.message : null
    });
}

async function handlePayoutPaid(payout: Stripe.Payout, supabase: SupabaseClient) {
    const { data: accounts } = await supabase
        .from('ledger_accounts')
        .select('id, account_code')
        .in('account_code', ['1000', '1001']);

    const bankAcct = accounts?.find(a => a.account_code === '1000')?.id;
    const clearingAcct = accounts?.find(a => a.account_code === '1001')?.id;

    if (!bankAcct || !clearingAcct) return;

    const amount = payout.amount / 100.0;

    const { data: entry } = await supabase.from('journal_entries').insert({
        transaction_date: new Date(payout.created * 1000).toISOString(),
        description: `Stripe Payout ${payout.id}`,
        external_reference_id: payout.id,
    }).select().single();

    if (!entry) return;

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
