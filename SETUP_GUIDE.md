# Membership System Setup Guide

This guide details the manual steps required to configure the Membership System, as the Clerk CLI does not support programmatic billing setup.

## Prerequisites

1.  Clerk Dashboard Access
2.  Supabase Project Access
3.  Repo access

## Phase 1: Clerk Dashboard Configuration

### 1. Create Products and Plans
Navigate to **Billing** -> **Products** in your Clerk Dashboard and create the following:

#### A. Starter Member (Free)
- **Product Name**: Starter Member
- **ID/Slug**: `starter-member`
- **Price**: $0.00 / month

#### B. Starter Builder
- **Product Name**: Starter Builder
- **ID/Slug**: `starter-builder`
- **Price**: $99.00 / month

#### C. Starter Founder
- **Product Name**: Starter Founder
- **ID/Slug**: `starter-founder`
- **Prices**:
    - $199.00 / month
    - $950.00 / year (Save ~60%)
    - $2,985.00 / year (Lifetime access equivalent)

#### D. Sponsor Plan
- **Product Name**: Sponsor Plan
- **ID/Slug**: `sponsor-plan`
- **Price**: $1,500.00 / year

#### E. Partner Plan
- **Product Name**: Partner Plan
- **ID/Slug**: `partner-plan`
- **Price**: $3,000.00 / year

#### Add-ons (Optional/Advanced)
- **Room Sponsorship**: `room-sponsorship` ($500.00 / year)
- **Workstation Sponsorship**: `workstation-sponsorship` ($1,000.00 / year)

### 2. Configure Webhooks
1.  Go to **Webhooks** in the Clerk Dashboard.
2.  Click **Add Endpoint**.
3.  **Endpoint URL**: `https://<YOUR_DOMAIN>/api/webhooks/clerk` (Use a tunnel like Ngrok for local dev: `https://<ngrok-id>.ngrok-free.app/api/webhooks/clerk`)
4.  **Subscribe to Events**:
    - `user.created`
    - `user.updated`
    - `subscription.created`
    - `subscription.updated`
    - `subscription.deleted`
5.  Click **Create**.
6.  Copy the **Signing Secret** (starts with `whsec_...`).

## Phase 2: Environment Configuration

Update your `.env.local` file in `apps/marketing-website`:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Webhook
CLERK_WEBHOOK_SECRET=whsec_...  # Paste the secret from Phase 1 Step 6

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...    # Required for webhook handler
```

## Phase 3: Database Setup

Run the migration file `supabase/migrations/20251227000000_membership_schema.sql` against your Supabase project.

```bash
npx supabase db push
```

## Phase 4: Verification

1.  **Sign Up**: Create a new user in your app or via Clerk Dashboard.
2.  **Check Database**: Verify a row is created in the `members` table in Supabase.
3.  **Create Subscription**: Assign a plan to the user in Clerk Dashboard.
4.  **Check Database**: Verify a row is created in the `subscriptions` table.
