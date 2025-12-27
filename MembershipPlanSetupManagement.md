1. Use @ui_design_architect.md as guidelines for designing the onboarding middleware
2. Use @# Skill Definition: ui_design_architect for additional context and creation
3. Rememeber the standard light dark mode theme and rack track themes should look different with the race track theme being more vibrant and bold and following the race track color scheme
4. The goal of this project is to complete the onboarding middleware that finishes with the signup and billing process when the user is selecting their membership plan and we're building out the billing for the sponsor and partner plans but we do not have the full onboarding middleware for the Sponsors or Partner plans yet. 
5. The onboarding process should be follow the text instructions below
6. After completing the onboarding process the user should be able to access the dashboard and start using the platform
7. Create and Use images instead of icons where possible to make the onboarding process more engaging and interactive if can not create the images then use placeholder images
8. Use gamification elements to make the onboarding process more engaging and interactive
9. Use best practices for onboarding middleware to make the onboarding process more engaging and interactive and the onboarding should be psychologically rewarding pleasing and designed to make the user want to complete the onboarding process
10. Before we start building go out and reseach other high converting UI and UX designs especially the onboarding process of other successful platforms and analyze the design and try to understand why they are converting and try to implement similar elements into our onboarding process
11. After completing the onboarding part of the app challenge your design UI and UX chooses and debate if we could have made better choices and try to implement similar elements into our onboarding process
12. Once completed return to this document and analyze if these 12 steps were completed successfully and if not make the necessary changes to complete the process.
Instructions:
1. Yes, we can definitely improve this to make it more plug-and-play and production-ready. Here's an enhanced version with automation scripts, better error handling, and complete setup:

## 1. Complete Shell Script for Clerk Products/Prices

Create `setup-plans.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up all membership plans and pricing...${NC}\n"

# Function to handle errors
handle_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Function to create product and capture ID
create_product() {
    local name="$1"
    local slug="$2"
    local description="$3"
    
    echo -e "${YELLOW}Creating product: $name...${NC}"
    
    # Create product and capture output
    product_output=$(clerk products create \
        --name "$name" \
        --slug "$slug" \
        --description "$description" \
        --active true \
        --json 2>&1)
    
    if [ $? -ne 0 ]; then
        handle_error "Failed to create product: $name\n$product_output"
    fi
    
    # Extract product ID
    product_id=$(echo "$product_output" | jq -r '.id')
    
    if [ -z "$product_id" ] || [ "$product_id" = "null" ]; then
        handle_error "Failed to extract product ID for: $name"
    fi
    
    echo -e "${GREEN}✓ Created product: $name (ID: $product_id)${NC}"
    echo "$product_id"
}

# Function to create price
create_price() {
    local product_id="$1"
    local unit_amount="$2"
    local currency="$3"
    local interval="$4"
    
    echo -e "${YELLOW}Creating price: $unit_amount $currency/$interval...${NC}"
    
    price_output=$(clerk prices create \
        --product-id "$product_id" \
        --unit-amount "$unit_amount" \
        --currency "$currency" \
        --interval "$interval" \
        --json 2>&1)
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Warning: Failed to create price for product $product_id${NC}"
        echo "$price_output"
        return 1
    fi
    
    echo -e "${GREEN}✓ Created price: $unit_amount $currency/$interval${NC}"
}

# Store product IDs
declare -A PRODUCT_IDS

echo "=== Creating Member Plans ==="

# 1. Starter Member (Free)
STARTER_MEMBER_ID=$(create_product \
    "Starter Member" \
    "starter-member" \
    "Free access to the community")
PRODUCT_IDS["starter-member"]=$STARTER_MEMBER_ID
create_price "$STARTER_MEMBER_ID" 0 "usd" "month"

# 2. Starter Builder
STARTER_BUILDER_ID=$(create_product \
    "Starter Builder" \
    "starter-builder" \
    "Active builders membership with additional resources")
PRODUCT_IDS["starter-builder"]=$STARTER_BUILDER_ID
create_price "$STARTER_BUILDER_ID" 9900 "usd" "month"

# 3. Starter Founder
STARTER_FOUNDER_ID=$(create_product \
    "Starter Founder" \
    "starter-founder" \
    "High-tier membership for serious creators with premium features")
PRODUCT_IDS["starter-founder"]=$STARTER_FOUNDER_ID

# Founder prices
create_price "$STARTER_FOUNDER_ID" 19900 "usd" "month"
create_price "$STARTER_FOUNDER_ID" 95000 "usd" "year"
create_price "$STARTER_FOUNDER_ID" 298500 "usd" "year"

echo -e "\n=== Creating Sponsor/Partner Plans ==="

# 4. Sponsor Plan
SPONSOR_ID=$(create_product \
    "Sponsor Plan" \
    "sponsor-plan" \
    "Annual sponsor membership with event perks and recognition")
PRODUCT_IDS["sponsor-plan"]=$SPONSOR_ID
create_price "$SPONSOR_ID" 150000 "usd" "year"

# 5. Partner Plan
PARTNER_ID=$(create_product \
    "Partner Plan" \
    "partner-plan" \
    "Strategic partner membership with influence, perks, and premium benefits")
PRODUCT_IDS["partner-plan"]=$PARTNER_ID
create_price "$PARTNER_ID" 300000 "usd" "year"

echo -e "\n=== Creating Add-ons ==="

# 6. Room Sponsorship Add-on
ROOM_SPONSORSHIP_ID=$(create_product \
    "Room Sponsorship" \
    "room-sponsorship" \
    "Add-on to sponsor rooms in the club (requires Sponsor or Partner plan)")
PRODUCT_IDS["room-sponsorship"]=$ROOM_SPONSORSHIP_ID
create_price "$ROOM_SPONSORSHIP_ID" 50000 "usd" "year"

# 7. Workstation Sponsorship Add-on
WORKSTATION_SPONSORSHIP_ID=$(create_product \
    "Workstation Sponsorship" \
    "workstation-sponsorship" \
    "Add-on to sponsor workstations in the club (requires Sponsor or Partner plan)")
PRODUCT_IDS["workstation-sponsorship"]=$WORKSTATION_SPONSORSHIP_ID
create_price "$WORKSTATION_SPONSORSHIP_ID" 100000 "usd" "year"

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "\nProduct IDs created:"
for slug in "${!PRODUCT_IDS[@]}"; do
    echo "  $slug: ${PRODUCT_IDS[$slug]}"
done

# Create environment file template
echo -e "\n${YELLOW}Creating .env.local template...${NC}"
cat > .env.local.template << EOF
# Clerk Product IDs
CLERK_PRODUCT_STARTER_MEMBER=${PRODUCT_IDS[starter-member]}
CLERK_PRODUCT_STARTER_BUILDER=${PRODUCT_IDS[starter-builder]}
CLERK_PRODUCT_STARTER_FOUNDER=${PRODUCT_IDS[starter-founder]}
CLERK_PRODUCT_SPONSOR=${PRODUCT_IDS[sponsor-plan]}
CLERK_PRODUCT_PARTNER=${PRODUCT_IDS[partner-plan]}
CLERK_PRODUCT_ROOM_SPONSORSHIP=${PRODUCT_IDS[room-sponsorship]}
CLERK_PRODUCT_WORKSTATION_SPONSORSHIP=${PRODUCT_IDS[workstation-sponsorship]}

# Supabase
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
EOF

echo -e "${GREEN}✓ Created .env.local.template with all product IDs${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Install jq: brew install jq (macOS) or apt-get install jq (Linux)"
echo "2. Make script executable: chmod +x setup-plans.sh"
echo "3. Run: ./setup-plans.sh"
echo "4. Copy .env.local.template to .env.local and fill in missing values"
```

## 2. Enhanced Database Schema with Better Constraints

Create `database/schema.sql`:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET app.jwt_secret TO 'your_jwt_secret_here';

-- Members table with better constraints
CREATE TABLE IF NOT EXISTS members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text UNIQUE NOT NULL,
    email text NOT NULL,
    full_name text,
    role text CHECK (role IN ('starter_member', 'starter_builder', 'starter_founder', 'sponsor', 'partner')),
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Subscriptions table with better tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    clerk_subscription_id text UNIQUE NOT NULL,
    clerk_price_id text NOT NULL,
    product_slug text NOT NULL,
    product_name text NOT NULL,
    price_cents integer NOT NULL CHECK (price_cents >= 0),
    currency text NOT NULL DEFAULT 'usd',
    interval text NOT NULL CHECK (interval IN ('month', 'year')),
    status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
    current_period_start timestamptz NOT NULL,
    current_period_end timestamptz NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    canceled_at timestamptz,
    trial_start timestamptz,
    trial_end timestamptz,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add-ons table with foreign key constraint
CREATE TABLE IF NOT EXISTS subscription_addons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
    member_id uuid REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    addon_slug text NOT NULL,
    addon_name text NOT NULL,
    clerk_price_id text NOT NULL,
    price_cents integer NOT NULL CHECK (price_cents >= 0),
    currency text NOT NULL DEFAULT 'usd',
    interval text NOT NULL CHECK (interval = 'year'),
    status text DEFAULT 'active' CHECK (status IN ('active', 'canceled')),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Audit log table for subscription changes
CREATE TABLE IF NOT EXISTS subscription_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
    member_id uuid REFERENCES members(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    old_status text,
    new_status text,
    changes jsonb,
    clerk_event_id text,
    created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_members_clerk_user_id ON members(clerk_user_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_role ON members(role);
CREATE INDEX idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_product_slug ON subscriptions(product_slug);
CREATE INDEX idx_subscription_addons_member_id ON subscription_addons(member_id);
CREATE INDEX idx_subscription_addons_subscription_id ON subscription_addons(subscription_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_addons_updated_at BEFORE UPDATE ON subscription_addons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get member's active subscription
CREATE OR REPLACE FUNCTION get_member_active_subscription(member_uuid uuid)
RETURNS TABLE (
    subscription_id uuid,
    product_slug text,
    product_name text,
    price_cents integer,
    currency text,
    interval text,
    status text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.product_slug,
        s.product_name,
        s.price_cents,
        s.currency,
        s.interval,
        s.status
    FROM subscriptions s
    WHERE s.member_id = member_uuid
        AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- View for member summary
CREATE OR REPLACE VIEW member_summary AS
SELECT 
    m.id,
    m.clerk_user_id,
    m.email,
    m.full_name,
    m.role,
    m.status as member_status,
    s.product_slug as active_plan,
    s.status as subscription_status,
    s.current_period_end,
    COUNT(DISTINCT sa.id) as active_addons_count,
    COALESCE(SUM(s.price_cents + COALESCE(sa_total.addon_total, 0)), 0) as total_monthly_cents
FROM members m
LEFT JOIN subscriptions s ON m.id = s.member_id AND s.status = 'active'
LEFT JOIN (
    SELECT member_id, SUM(price_cents) as addon_total
    FROM subscription_addons
    WHERE status = 'active'
    GROUP BY member_id
) sa_total ON m.id = sa_total.member_id
LEFT JOIN subscription_addons sa ON m.id = sa.member_id AND sa.status = 'active'
GROUP BY m.id, m.clerk_user_id, m.email, m.full_name, m.role, m.status, 
         s.product_slug, s.status, s.current_period_end;
```

## 3. Complete Webhook Handler (TypeScript)

Create `lib/webhooks/handler.ts`:

```typescript
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Clerk event types
type ClerkEvent = {
  type: string;
  data: any;
  object: string;
};

// Product slug to role mapping
const PRODUCT_ROLE_MAP: Record<string, string> = {
  'starter-member': 'starter_member',
  'starter-builder': 'starter_builder',
  'starter-founder': 'starter_founder',
  'sponsor-plan': 'sponsor',
  'partner-plan': 'partner',
};

// Add-on product slugs
const ADDON_PRODUCTS = ['room-sponsorship', 'workstation-sponsorship'];

export async function POST(request: Request) {
  const payload = await request.json();
  const headersList = await headers();
  
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: ClerkEvent;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      {
        'svix-id': headersList.get('svix-id')!,
        'svix-timestamp': headersList.get('svix-timestamp')!,
        'svix-signature': headersList.get('svix-signature')!,
      }
    ) as ClerkEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(evt.data);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(evt.data);
        break;
      
      case 'subscription.deleted':
        await handleSubscriptionDeleted(evt.data);
        break;
      
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}

async function handleUserCreated(userData: any) {
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

async function handleUserUpdated(userData: any) {
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

async function handleSubscriptionCreated(subscriptionData: any) {
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
    quantity
  } = subscriptionItem;

  // Check if this is an add-on
  const isAddon = ADDON_PRODUCTS.includes(metadata?.product_slug || price.product.metadata?.slug);

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

async function handleMainSubscriptionCreated(
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

  const productSlug = metadata?.product_slug || price.product.metadata?.slug;
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
    product_name: price.product.name,
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

async function handleAddonCreated(
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
  const addonSlug = metadata?.product_slug || price.product.metadata?.slug;

  await supabase.from('subscription_addons').insert({
    subscription_id: activeSubscription.id,
    member_id: memberData.id,
    addon_slug: addonSlug,
    addon_name: price.product.name,
    clerk_price_id: price.id,
    price_cents: price.unit_amount,
    currency: price.currency,
    interval: 'year',
    status,
    metadata,
  });

  console.log(`Created addon ${addonSlug} for subscription ${activeSubscription.id}`);
}

async function handleSubscriptionUpdated(subscriptionData: any) {
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
  const productSlug = metadata?.product_slug || price.product.metadata?.slug;
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

async function handleMainSubscriptionUpdated(
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

async function handleAddonUpdated(
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

async function handleSubscriptionDeleted(subscriptionData: any) {
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
```

## 4. Utility Functions for Common Operations

Create `lib/subscriptions/utils.ts`:

```typescript
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
  const monthlyAddonTotal = addons.reduce((sum, addon) => {
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
                       addons.reduce((sum, addon) => sum + addon.price_cents, 0)
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
         allowedAddons[subscription.product_slug]?.includes(addonSlug);
}
```

## 5. README with Setup Instructions

Create `SETUP.md`:

```markdown
# Membership System Setup Guide

## Prerequisites

1. Clerk account with CLI installed
2. Supabase project created
3. Node.js environment

## Installation

```bash
# Install dependencies
npm install @supabase/supabase-js svix

# Make setup script executable
chmod +x setup-plans.sh

# Install jq (for JSON parsing)
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

## Setup Steps

### 1. Configure Clerk CLI

```bash
clerk login
```

### 2. Run Setup Script

```bash
./setup-plans.sh
```

This will:
- Create all products and prices
- Capture product IDs
- Generate `.env.local.template`

### 3. Configure Environment Variables

```bash
cp .env.local.template .env.local
# Edit .env.local with your actual values
```

### 4. Initialize Database

Run the SQL schema in your Supabase SQL editor:
```sql
-- Copy contents from database/schema.sql
```

### 5. Configure Clerk Webhooks

1. Go to Clerk Dashboard → Webhooks
2. Add webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events to listen for:
   - `user.created`
   - `user.updated`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`
4. Copy the webhook signing secret to `.env.local` as `CLERK_WEBHOOK_SECRET`

### 6. Deploy Webhook Handler

Create API route at `/app/api/webhooks/clerk/route.ts`:

```typescript
export { POST } from '@/lib/webhooks/handler';
```

## Testing

### Test Member Creation
```bash
# Create a test user
clerk users create --email test@example.com --password password123

# Create a test subscription
clerk subscriptions create \
  --customer-id "<CUSTOMER_ID>" \
  --price-id "<PRICE_ID>" \
  --metadata '{"product_slug": "starter-builder"}'
```

### Database Queries

```sql
-- View all members with their subscriptions
SELECT * FROM member_summary;

-- Check active subscriptions
SELECT * FROM subscriptions WHERE status = 'active';

-- View subscription audit log
SELECT * FROM subscription_audit_log ORDER BY created_at DESC LIMIT 10;
```

## Maintenance

### Adding New Plans

1. Edit `setup-plans.sh` to add new product creation
2. Update `PRODUCT_ROLE_MAP` in webhook handler
3. Add to database schema if new fields needed

### Monitoring

Check webhook deliveries in Clerk Dashboard and monitor:
- Failed webhook attempts
- Database sync issues
- Subscription status changes

## Troubleshooting

### Webhook Failures
1. Verify webhook secret matches
2. Check server logs for errors
3. Test webhook with Clerk's test events

### Database Sync Issues
1. Check foreign key constraints
2. Verify member exists before subscription creation
3. Check subscription status mapping

### Price Display Issues
1. Verify currency formatting
2. Check cents to dollars conversion
3. Validate annual/monthly calculations
```

## Key Improvements Made:

1. **Automation**: Single script handles all product/price creation
2. **Error Handling**: Robust error checking and logging
3. **Data Integrity**: Enhanced database constraints and relations
4. **Audit Trail**: Complete audit logging for all changes
5. **Type Safety**: Full TypeScript implementation
6. **Utilities**: Helper functions for common operations
7. **Documentation**: Complete setup and troubleshooting guide
8. **Scalability**: Prepared for future plan additions
9. **Security**: Proper webhook verification and error handling
10. **Monitoring**: Built-in audit trail and status tracking

This setup is production-ready, maintainable, and provides a complete plug-and-play solution for your membership system.