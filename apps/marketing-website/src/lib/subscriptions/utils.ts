import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

export async function getMemberSubscription(memberId: string) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select(`
      *,
      addons:subscription_addons(*)
    `)
        .eq('member_id', memberId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) throw error;
    return data;
}

export async function getMemberActiveAddons(memberId: string) {
    const { data, error } = await supabase
        .from('subscription_addons')
        .select('*')
        .eq('member_id', memberId)
        .eq('status', 'active');

    if (error) throw error;
    return data;
}

export async function calculateMemberTotal(memberId: string) {
    const subscription = await getMemberSubscription(memberId);
    const addons = await getMemberActiveAddons(memberId);

    let totalCents = subscription?.price_cents || 0;

    // If subscription is annual, convert to monthly equivalent for display
    if (subscription?.interval === 'year') {
        totalCents = Math.round(totalCents / 12);
    }

    // Add add-ons (all add-ons are annual)
    const monthlyAddonTotal = addons.reduce((sum: number, addon: any) => {
        return sum + Math.round(addon.price_cents / 12);
    }, 0);

    return {
        subscription: subscription ? {
            ...subscription,
            monthly_cents: subscription.interval === 'year'
                ? Math.round(subscription.price_cents / 12)
                : subscription.price_cents
        } : null,
        addons,
        total_monthly_cents: totalCents + monthlyAddonTotal,
        total_annual_cents: (subscription?.interval === 'year' ? subscription.price_cents : subscription?.price_cents * 12 || 0) +
            addons.reduce((sum: number, addon: any) => sum + addon.price_cents, 0)
    };
}

export function formatCurrency(cents: number, currency: string = 'usd'): string {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    });
    return formatter.format(cents / 100);
}

// Check if member can purchase add-on
export async function canPurchaseAddon(memberId: string, addonSlug: string): Promise<boolean> {
    const subscription = await getMemberSubscription(memberId);

    if (!subscription) return false;

    const validPlans = ['sponsor-plan', 'partner-plan'];
    const allowedAddons: Record<string, string[]> = {
        'sponsor-plan': ['room-sponsorship', 'workstation-sponsorship'],
        'partner-plan': ['room-sponsorship', 'workstation-sponsorship'],
    };

    return validPlans.includes(subscription.product_slug) &&
        (allowedAddons[subscription.product_slug]?.includes(addonSlug) || false);
}
