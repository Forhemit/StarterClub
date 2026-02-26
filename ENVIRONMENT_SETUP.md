# Environment Setup Guide

This guide walks you through setting up environment variables for the Starter Club monorepo.

## Quick Start

1. Environment files have been created:
   - `/.env.local` (root)
   - `/apps/marketing-website/.env.local`
   - `/apps/super-admin/.env.local`
   - `/apps/flight-deck/.env.local`
   - `/apps/onboard-app/.env` (Vite uses `.env`)

2. Replace all placeholder values (`YOUR_*`) with your actual keys.

3. Never commit `.env.local` files to version control (they're already in `.gitignore`).

---

## Required Services

### 1. Clerk Authentication
**Sign up:** https://dashboard.clerk.com

**Required Keys:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
- `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)

**Setup Steps:**
1. Create a new Clerk application
2. Copy the Publishable Key and Secret Key
3. Configure redirect URLs in Clerk Dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/onboarding`

---

### 2. Supabase Database
**Sign up:** https://app.supabase.com

**Required Keys:**
- `NEXT_PUBLIC_SUPABASE_URL` (e.g., `https://abcdef123456.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

**Setup Steps:**
1. Create a new Supabase project
2. Go to Project Settings > API
3. Copy the URL and keys
4. Run database migrations:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_ID
   npx supabase db push
   ```

---

### 3. Stripe Payments (Optional - for billing)
**Sign up:** https://dashboard.stripe.com

**Required Keys:**
- `STRIPE_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)
- `STRIPE_WEBHOOK_SECRET` (starts with `whsec_`)

**Setup Steps:**
1. Get your Secret Key from Stripe Dashboard
2. Set up webhook endpoint:
   - Production: `https://your-domain.com/api/webhooks/stripe`
   - Local development: Use Stripe CLI
3. Subscribe to these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.succeeded`
   - `payout.paid`

---

### 4. UploadThing (Optional - for file uploads)
**Sign up:** https://uploadthing.com

**Required Key:**
- `UPLOADTHING_TOKEN`

---

## Webhook Configuration

### Clerk Webhooks

Clerk webhooks are essential for syncing user data to your Supabase database.

**Endpoint URL:**
```
Production: https://your-domain.com/api/webhooks/clerk
Local Dev:  https://your-ngrok-id.ngrok-free.app/api/webhooks/clerk
```

**Steps:**
1. Go to Clerk Dashboard > Webhooks
2. Click "Add Endpoint"
3. Enter the webhook URL
4. Subscribe to these events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `subscription.created`
   - ✅ `subscription.updated`
   - ✅ `subscription.deleted`
5. Create the endpoint
6. Copy the Signing Secret (starts with `whsec_`)
7. Add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

**Local Development with Ngrok:**
```bash
# Install ngrok if you haven't
brew install ngrok

# Start ngrok tunnel to your local server
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok-free.app)
# Use this in Clerk webhook configuration
```

---

### Stripe Webhooks

Stripe webhooks handle payment events.

**Endpoint URL:**
```
Production: https://your-domain.com/api/webhooks/stripe
Local Dev:  https://your-ngrok-id.ngrok-free.app/api/webhooks/stripe
```

**Using Stripe CLI (Recommended for local dev):**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will output a webhook signing secret - copy it to your .env.local
```

**Events to Subscribe To:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `charge.succeeded`
- `payout.paid`

---

## Membership Plans Setup (Clerk Billing)

If using Clerk's billing features, create these products in Clerk Dashboard:

| Plan | Slug | Price |
|------|------|-------|
| Starter Member | `starter-member` | $0/month |
| Starter Builder | `starter-builder` | $99/month |
| Starter Founder | `starter-founder` | $199/month, $950/year, $2985/lifetime |
| Sponsor Plan | `sponsor-plan` | $1500/year |
| Partner Plan | `partner-plan` | $3000/year |

---

## Development vs Production

### Development (.env.local)
```bash
# Use test keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_ENABLE_TEST_USERS=true
```

### Production (.env.local on server)
```bash
# Use live keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_ENABLE_TEST_USERS=false
```

---

## Testing Your Setup

After filling in all environment variables:

```bash
# 1. Build the project
npm run build

# 2. Start development servers
npm run dev

# 3. Verify environment is loaded
# Visit http://localhost:3000 and check for errors
```

---

## Troubleshooting

### "Missing publishableKey"
- Clerk keys are not set in `.env.local`
- Make sure you're using the correct file (`.env.local`, not `.env`)

### "Invalid Supabase credentials"
- Check that all three Supabase variables are set
- Verify the URL format: `https://project-id.supabase.co`

### Webhooks not working
- Verify webhook URL is accessible (use ngrok for local dev)
- Check that the signing secret is correct
- Look at server logs for webhook errors

### Database connection errors
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (not just the anon key)
- Check that database migrations have been applied

---

## Security Checklist

- [ ] Never commit `.env.local` files
- [ ] Use different keys for development and production
- [ ] Rotate webhook secrets periodically
- [ ] Restrict Supabase service role key usage
- [ ] Enable Clerk's webhook signature verification
- [ ] Use HTTPS for all webhook endpoints in production
