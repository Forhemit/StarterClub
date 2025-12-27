import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Product slug to role mapping
export const PRODUCT_ROLE_MAP: Record<string, string> = {
    'starter-member': 'starter_member',
    'starter-builder': 'starter_builder',
    'starter-founder': 'starter_founder',
    'sponsor-plan': 'sponsor',
    'partner-plan': 'partner',
};

// Add-on product slugs
export const ADDON_PRODUCTS = ['room-sponsorship', 'workstation-sponsorship'];

export async function handleUserCreated(userData: any) {
    const { id, email_addresses, first_name, last_name } = userData;
    const email = email_addresses[0]?.email_address;

    // Default to starter_member for new users
    await supabase.from('members').insert({
        clerk_user_id: id,
        email,
        full_name: `${first_name} ${last_name}`.trim(),
        role: 'starter_member',
        status: 'active',
    });

    console.log(`Created member for user: ${email}`);
}

export async function handleUserUpdated(userData: any) {
    const { id, email_addresses, first_name, last_name } = userData;
    const email = email_addresses[0]?.email_address;

    await supabase
        .from('members')
        .update({
            email,
            full_name: `${first_name} ${last_name}`.trim(),
            updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', id);
}

export async function handleSubscriptionCreated(subscriptionData: any) {
    const {
        id: subscriptionId,
        customer_id: clerkUserId,
        items,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        trial_start,
        trial_end,
        metadata
    } = subscriptionData;

    // Get the main subscription item
    const subscriptionItem = items.data[0];
    if (!subscriptionItem) return;

    const {
        price,
    } = subscriptionItem;

    // Check if this is an add-on
    // Safely check metadata on both subscription and product level
    const productSlug = metadata?.product_slug || price.product?.metadata?.slug;
    const isAddon = ADDON_PRODUCTS.includes(productSlug);

    if (isAddon) {
        await handleAddonCreated(
            clerkUserId,
            subscriptionId,
            price,
            status,
            metadata
        );
    } else {
        await handleMainSubscriptionCreated(
            clerkUserId,
            subscriptionId,
            price,
            status,
            current_period_start,
            current_period_end,
            cancel_at_period_end,
            trial_start,
            trial_end,
            metadata
        );
    }

    // Log the event
    await supabase.from('subscription_audit_log').insert({
        subscription_id: subscriptionId,
        clerk_event_id: subscriptionData.id,
        event_type: 'subscription.created',
        new_status: status,
        changes: subscriptionData,
        created_at: new Date().toISOString(),
    });
}

export async function handleMainSubscriptionCreated(
    clerkUserId: string,
    subscriptionId: string,
    price: any,
    status: string,
    currentPeriodStart: number,
    currentPeriodEnd: number,
    cancelAtPeriodEnd: boolean,
    trialStart: number | null,
    trialEnd: number | null,
    metadata: any
) {
    // Get member
    const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('clerk_user_id', clerkUserId)
        .single();

    if (!member) {
        console.error(`Member not found for clerk user: ${clerkUserId}`);
        return;
    }

    const productSlug = metadata?.product_slug || price.product?.metadata?.slug;
    const role = PRODUCT_ROLE_MAP[productSlug] || 'starter_member';

    // Update member's role
    await supabase
        .from('members')
        .update({ role })
        .eq('id', member.id);

    // Insert subscription
    await supabase.from('subscriptions').insert({
        member_id: member.id,
        clerk_subscription_id: subscriptionId,
        clerk_price_id: price.id,
        product_slug: productSlug,
        product_name: price.product?.name || 'Unknown Product',
        price_cents: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval || 'month',
        status,
        current_period_start: new Date(currentPeriodStart * 1000).toISOString(),
        current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
        cancel_at_period_end: cancelAtPeriodEnd,
        canceled_at: cancelAtPeriodEnd ? new Date().toISOString() : null,
        trial_start: trialStart ? new Date(trialStart * 1000).toISOString() : null,
        trial_end: trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
        metadata,
    });

    console.log(`Created subscription ${subscriptionId} for member ${member.id}`);
}

export async function handleAddonCreated(
    clerkUserId: string,
    subscriptionId: string,
    price: any,
    status: string,
    metadata: any
) {
    // Get member and their active subscription
    const { data: memberData } = await supabase
        .from('members')
        .select(`
      id,
      subscriptions!inner(
        id,
        status
      )
    `)
        .eq('clerk_user_id', clerkUserId)
        .eq('subscriptions.status', 'active')
        .single();

    if (!memberData) {
        console.error(`Member or active subscription not found for: ${clerkUserId}`);
        return;
    }

    const activeSubscription = memberData.subscriptions[0];
    const addonSlug = metadata?.product_slug || price.product?.metadata?.slug;

    await supabase.from('subscription_addons').insert({
        subscription_id: activeSubscription.id,
        member_id: memberData.id,
        addon_slug: addonSlug,
        addon_name: price.product?.name || 'Unknown Addon',
        clerk_price_id: price.id,
        price_cents: price.unit_amount,
        currency: price.currency,
        interval: 'year',
        status,
        metadata,
    });

    console.log(`Created addon ${addonSlug} for subscription ${activeSubscription.id}`);
}

export async function handleSubscriptionUpdated(subscriptionData: any) {
    const {
        id: subscriptionId,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        canceled_at,
        items,
        metadata
    } = subscriptionData;

    const subscriptionItem = items.data[0];
    if (!subscriptionItem) return;

    const { price } = subscriptionItem;
    const productSlug = metadata?.product_slug || price.product?.metadata?.slug;
    const isAddon = ADDON_PRODUCTS.includes(productSlug);

    if (isAddon) {
        await handleAddonUpdated(subscriptionId, status, metadata);
    } else {
        await handleMainSubscriptionUpdated(
            subscriptionId,
            status,
            current_period_start,
            current_period_end,
            cancel_at_period_end,
            canceled_at,
            metadata
        );
    }

    // Log the event
    await supabase.from('subscription_audit_log').insert({
        subscription_id: subscriptionId,
        clerk_event_id: subscriptionData.id,
        event_type: 'subscription.updated',
        new_status: status,
        changes: subscriptionData,
        created_at: new Date().toISOString(),
    });
}

export async function handleMainSubscriptionUpdated(
    subscriptionId: string,
    status: string,
    currentPeriodStart: number,
    currentPeriodEnd: number,
    cancelAtPeriodEnd: boolean,
    canceledAt: number | null,
    metadata: any
) {
    const updateData: any = {
        status,
        current_period_start: new Date(currentPeriodStart * 1000).toISOString(),
        current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
        cancel_at_period_end: cancelAtPeriodEnd,
        updated_at: new Date().toISOString(),
    };

    if (canceledAt) {
        updateData.canceled_at = new Date(canceledAt * 1000).toISOString();
    }

    await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('clerk_subscription_id', subscriptionId);

    // If subscription is canceled and no longer active, update member role
    if (status === 'canceled') {
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('member_id')
            .eq('clerk_subscription_id', subscriptionId)
            .single();

        if (subscription) {
            // Default to starter_member if no active subscription
            await supabase
                .from('members')
                .update({ role: 'starter_member' })
                .eq('id', subscription.member_id);
        }
    }
}

export async function handleAddonUpdated(
    subscriptionId: string,
    status: string,
    metadata: any
) {
    await supabase
        .from('subscription_addons')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq('clerk_subscription_id', subscriptionId);
}

export async function handleSubscriptionDeleted(subscriptionData: any) {
    const { id: subscriptionId, metadata } = subscriptionData;
    const productSlug = metadata?.product_slug;
    const isAddon = ADDON_PRODUCTS.includes(productSlug);

    if (isAddon) {
        await supabase
            .from('subscription_addons')
            .update({
                status: 'canceled',
                updated_at: new Date().toISOString(),
            })
            .eq('clerk_subscription_id', subscriptionId);
    } else {
        await supabase
            .from('subscriptions')
            .update({
                status: 'canceled',
                canceled_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('clerk_subscription_id', subscriptionId);
    }

    // Log the event
    await supabase.from('subscription_audit_log').insert({
        subscription_id: subscriptionId,
        clerk_event_id: subscriptionData.id,
        event_type: 'subscription.deleted',
        new_status: 'canceled',
        changes: subscriptionData,
        created_at: new Date().toISOString(),
    });
}
