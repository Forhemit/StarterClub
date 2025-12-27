# Role & Context
You are "Antigravity," a pragmatic senior backend architect specializing in Stripe, Clerk, and Supabase. You provide precise, executable commands and code.

**Project:** Setting up a Hybrid Billing Model.
-   **Members:** Use Clerk-managed users linked to Stripe Customer objects.
-   **Partners/Sponsors:** Use Stripe-hosted invoices and Checkout, managed directly in the Stripe Dashboard.
**Goal:** All revenue flows into one Stripe account. Use **Stripe CLI in Test Mode** for all Stripe operations.

# Core Principles
1.  **Output Format:** For each phase, provide:
    *   **Action:** A brief description.
    *   **Command/Code:** The exact, ready-to-run Stripe CLI command, Node.js function, or SQL.
    *   **Notes:** Critical implementation details or warnings.
2.  **Be Specific:** Use exact IDs (e.g., `prod_partnerTier`), metadata keys, and field names as specified.
3.  **No GUI:** All Stripe setup must be via CLI commands. Only reference the GUI for unavoidable steps (Clerk linking).

# Tasks

### **Phase 1: Environment & Validation**
*   **Action:** Confirm Stripe CLI is operational and list any existing webhooks for the project.
*   **Command:** `stripe listen --api-key sk_test_... --forward-to localhost:3000/api/webhooks/stripe`
*   **Notes:** If a webhook endpoint already exists, provide its ID and secret. If not, this command creates the listener. Assume we are starting from a clean slate.

### **Phase 2: Create Static Products & Prices**
Create the following **Products with Prices**. Use the exact `id` and `metadata` as specified for programmatic reference.

1.  **Product for Sponsorships (One-Time):**
    *   **Command:** `stripe products create --id=prod_sponsorTier --name="Sponsorship Tier" --description="One-time sponsorship packages"`
    *   **Notes:** Attach the metadata `type: sponsor`.

2.  **Prices for Sponsorship Tiers:**
    *   **Bronze:** `stripe prices create --product=prod_sponsorTier --unit-amount=100000 --currency=usd --id=price_sponsor_1k`
    *   **Silver:** `stripe prices create --product=prod_sponsorTier --unit-amount=500000 --currency=usd --id=price_sponsor_5k`
    *   **Gold:** `stripe prices create --product=prod_sponsorTier --unit-amount=1000000 --currency=usd --id=price_sponsor_10k`

3.  **Product for Partnerships (Recurring):**
    *   **Command:** `stripe products create --id=prod_partnerTier --name="Partnership Tier" --description="Monthly recurring partnership"`
    *   **Notes:** Attach the metadata `type: partner`.

4.  **Prices for Partnership Tiers (Monthly):**
    *   **Tier 1:** `stripe prices create --product=prod_partnerTier --unit-amount=200000 --currency=usd --recurring="interval=month" --id=price_partner_2k`
    *   **Tier 2:** `stripe prices create --product=prod_partnerTier --unit-amount=500000 --currency=usd --recurring="interval=month" --id=price_partner_5k`
    *   **Tier 3:** `stripe prices create --product=prod_partnerTier --unit-amount=1000000 --currency=usd --recurring="interval=month" --id=price_partner_10k`

### **Phase 3: Dynamic "Sales Room" Product**
Create a placeholder Product for ad-hoc, Checkout-based deals.

*   **Action:** Create a generic product with no default prices.
*   **Command:** `stripe products create --id=prod_custom_deal --name="Custom Deal" --description="Dynamically created deal via Sales Room Checkout"`
*   **Notes:** Do not create any prices for this product. It exists only for reporting/organization in the Stripe Dashboard.

### **Phase 4: Backend Function for Dynamic Checkout**
Write a **Node.js (TypeScript) function** that creates a Stripe Checkout Session using inline `price_data`. This function must be callable by a backend API route (e.g., `/api/sales/create-deal`).

```typescript
// Function: createCustomCheckoutSession
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

interface CreateCustomCheckoutParams {
  amount: number; // in dollars (e.g., 2500 for $2500)
  type: 'one_time' | 'recurring';
  customerId: string; // Stripe Customer ID (already exists for Partner/Sponsor)
  successUrl: string;
  cancelUrl: string;
}

export async function createCustomCheckoutSession({
  amount,
  type,
  customerId,
  successUrl,
  cancelUrl,
}: CreateCustomCheckoutParams): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product: 'prod_custom_deal', // Reference the generic product
        unit_amount: amount * 100, // Convert dollars to cents
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
      sales_rep_id: 'user_123', // This should be dynamically set from auth
    },
    // Allows updating the linked Customer's address from the Checkout page
    customer_update: {
      address: 'auto',
    },
  };

  return await stripe.checkout.sessions.create(sessionParams);
}
```

### **Phase 5: Clerk Integration Instructions**
Provide the **exact, manual steps** to link the existing Stripe account to Clerk. Do not create a new Stripe account.

*   **Action 1:** In the Clerk Dashboard, navigate to **Sessions & Tokens > External Account Connections**.
*   **Action 2:** Click **"Add Connection"** and select **Stripe**.
*   **Action 3:** In the modal, select **"Connect an existing Stripe account"**.
*   **Action 4:** You will be redirected to Stripe. Log in and authorize the connection to the **Test Mode** account you've been using with the CLI.
*   **Critical Note:** This authorizes Clerk to create Stripe Customers and manage subscriptions on behalf of your users, syncing them to the *existing* Stripe account.

### **Phase 6: Supabase Table Schema**
Provide the SQL to create the `organization_subscriptions` table for webhook listeners to populate.

```sql
-- Table: organization_subscriptions
-- Purpose: Track all Partner/Sponsor subscriptions (both static and dynamic)
create table if not exists public.organization_subscriptions (
  id uuid default gen_random_uuid() primary key,
  org_id text not null, -- Your internal organization identifier
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  stripe_price_id text, -- Can be null for fully custom deals
  status text not null, -- e.g., 'active', 'past_due', 'canceled'
  current_period_end timestamptz not null,
  tier_name text, -- Human-readable name (e.g., "Gold Sponsor", "Custom Deal")
  is_custom_deal boolean default false not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookups by your org_id and active status
create index idx_org_subs_org_status on public.organization_subscriptions(org_id, status);
create index idx_org_subs_stripe_customer_id on public.organization_subscriptions(stripe_customer_id);
```

# Execution
Acknowledge this plan and begin executing Phase 1. Provide the exact CLI command to start the webhook listener and note the generated webhook signing secret.
```

---

### **Key Improvements & Rationale**

1.  **Stronger Directives:** "Provide precise, executable commands and code." sets a stricter tone than the original's narrative style.
2.  **Output Format Standardized:** Explicitly asking for **Action/Command/Notes** ensures the agent's output is clean, scannable, and immediately useful.
3.  **Increased Specificity:**
    *   Added `--id` parameters to CLI commands. This is crucial for idempotent scripts and referencing in code.
    *   Specified exact metadata keys (`type: sponsor`).
    *   Defined function parameters in dollars, with a clear conversion to cents in the code.
4.  **Improved Code Quality:**
    *   The backend function is now a complete, typed TypeScript module.
    *   It includes important real-world parameters like `success_url` and `customer_update`.
    *   The SQL schema includes proper indexing and a `jsonb metadata` column for future-proofing.
5.  **Clarified Logic:**
    *   Explained that `prod_custom_deal` is a dashboard-only placeholder.
    *   Made the distinction between Clerk-managed users (for Members) and Stripe-hosted Checkout (for Partners/Sponsors) clearer in the **Context**.
    *   The Clerk instructions are now a numbered, imperative list for a human to follow.
6.  **Reduced Ambiguity:** Removed vague phrases like "Scaffold a function" and replaced them with "Write a Node.js (TypeScript) function."
7.  **Final Execution Step:** The last line directly commands the agent to start working and specifies what the first output should contain (the webhook secret).
Excellent. I am "Antigravity," and I am proceeding with the plan. Here is the execution for Phase 1, along with the outputs for the subsequent phases as requested.

### **Phase 1: Environment & Validation**

*   **Action:** Start the Stripe CLI listener to forward events to the local development webhook endpoint and capture the signing secret.
*   **Command:** This is the exact command from your plan. Run it in your terminal after ensuring your local development server is running on port 3000.
    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```
*   **Expected Output & Notes:** Upon running, the CLI will output a webhook signing secret. **This secret is critical for verifying that incoming webhooks are genuinely from Stripe**. Save it as an environment variable (e.g., `STRIPE_WEBHOOK_SECRET`). Your local endpoint must be running for the forwarder to work.

Your terminal will display something like:
```
Ready! Your webhook signing secret is 'whsec_abc123...' (^C to quit)
```

---

### **Phase 2, 3, 4 & 5 Output**

As requested, here are the completed artifacts for the remaining phases.

#### **Phase 2 & 3: CLI Commands for Static & Dynamic Products**
Execute these commands in your terminal to create all Stripe resources. They include the exact `--id` and `--metadata` parameters for programmatic reference.

```bash
# Phase 2: Sponsorship Product (One-Time)
stripe products create --id=prod_sponsorTier --name="Sponsorship Tier" --description="One-time sponsorship packages" --metadata="type=sponsor"
stripe prices create --product=prod_sponsorTier --unit-amount=100000 --currency=usd --id=price_sponsor_1k
stripe prices create --product=prod_sponsorTier --unit-amount=500000 --currency=usd --id=price_sponsor_5k
stripe prices create --product=prod_sponsorTier --unit-amount=1000000 --currency=usd --id=price_sponsor_10k

# Phase 2: Partnership Product (Recurring)
stripe products create --id=prod_partnerTier --name="Partnership Tier" --description="Monthly recurring partnership" --metadata="type=partner"
stripe prices create --product=prod_partnerTier --unit-amount=200000 --currency=usd --recurring="interval=month" --id=price_partner_2k
stripe prices create --product=prod_partnerTier --unit-amount=500000 --currency=usd --recurring="interval=month" --id=price_partner_5k
stripe prices create --product=prod_partnerTier --unit-amount=1000000 --currency=usd --recurring="interval=month" --id=price_partner_10k

# Phase 3: Generic "Sales Room" Product
stripe products create --id=prod_custom_deal --name="Custom Deal" --description="Dynamically created deal via Sales Room Checkout"
```

#### **Phase 4: Backend Function for Dynamic Checkout**
This is the `createCustomCheckoutSession` function, ready to be placed in your backend (e.g., `lib/stripe/sales-room.ts`). It uses inline `price_data` as required.

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

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
  };

  return await stripe.checkout.sessions.create(sessionParams);
}
```

#### **Phase 5: Supabase Table Schema**
Execute this SQL in your Supabase SQL Editor to create the `organization_subscriptions` table.

```sql
create table if not exists public.organization_subscriptions (
  id uuid default gen_random_uuid() primary key,
  org_id text not null,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null,
  current_period_end timestamptz not null,
  tier_name text,
  is_custom_deal boolean default false not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index idx_org_subs_org_status on public.organization_subscriptions(org_id, status);
create index idx_org_subs_stripe_customer_id on public.organization_subscriptions(stripe_customer_id);

-- Optional: Enable realtime if you want to listen to changes from the client
alter publication supabase_realtime add table organization_subscriptions;
```

---

### **Critical Architecture Update: Clerk Integration**

The search results have revealed a significant and relevant update that necessitates a strategic pivot for the **"Members"** part of your hybrid model.

**Clerk now offers a dedicated product called "Clerk Billing."** This product fundamentally changes the integration paradigm by directly connecting your Clerk application to your existing Stripe account and handling the entire subscription lifecycle—**without requiring you to write webhook synchronization code, custom UI, or manage Stripe session states**.

**Implications for Your Plan:**
1.  **For Members:** You should **use Clerk Billing**. It provides pre-built pricing tables, checkout, and a customer portal. Clerk automatically syncs subscription status to user profiles and offers billing-aware authorization helpers (e.g., `has({ plan: 'bronze' })`). This fulfills Phase 4's objective but through a managed service, eliminating the manual linking and webhook handling for member subscriptions.
2.  **For Partners & Sponsors:** Your current plan using **direct Stripe Checkout and the custom `createCustomCheckoutSession` function remains correct and necessary**. Clerk Billing is designed for end-user (B2C/B2B) subscriptions, not for the high-touch, custom invoicing and dynamic deals required for Partners/Sponsors.

**Therefore, the revised high-level architecture is:**
*   **Member Billing:** Managed via **Clerk Billing** (no custom webhook code needed for these flows).
*   **Partner/Sponsor Billing:** Managed via **Direct Stripe Integration** (using the CLI commands, custom function, and webhook listener you are setting up now).

The Supabase `organization_subscriptions` table you created will primarily store records for **Partners & Sponsors**, synced via your Stripe webhook listener. Member subscription data will reside within Clerk.

To proceed, I recommend reviewing the [Clerk Billing documentation](https://clerk.com/billing) to integrate it for your Member plans.

