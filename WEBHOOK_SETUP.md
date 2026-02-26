# Webhook Setup Guide

This guide will help you set up the required webhooks for Clerk and Stripe.

---

## Clerk Webhooks (Required)

Clerk webhooks sync user data to your Supabase database when users sign up or update their profile.

### Step 1: Start your local development server

```bash
cd /Users/stephenstokes/Downloads/StarterClub
npm run dev
```

Your marketing website will be running at `http://localhost:3000`

### Step 2: Expose your local server with Ngrok

```bash
# Install ngrok if you haven't
brew install ngrok

# Start ngrok tunnel
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123-def456.ngrok-free.app -> http://localhost:3000
```

Copy the HTTPS URL (e.g., `https://abc123-def456.ngrok-free.app`)

### Step 3: Configure Webhook in Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Enter the URL: `https://abc123-def456.ngrok-free.app/api/webhooks/clerk`
   (Replace with your actual ngrok URL)
6. Subscribe to these events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `subscription.created`
   - ✅ `subscription.updated`
   - ✅ `subscription.deleted`
7. Click **Create**
8. Copy the **Signing Secret** (starts with `whsec_`)

### Step 4: Update Environment Variables

Edit `/Users/stephenstokes/Downloads/StarterClub/.env.local`:

```bash
CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
```

Also update `/Users/stephenstokes/Downloads/StarterClub/apps/marketing-website/.env.local` with the same value.

### Step 5: Restart your development server

```bash
# Stop the current server (Ctrl+C) and restart
npm run dev
```

### Step 6: Test the Webhook

1. Open your app at `http://localhost:3000`
2. Sign up as a new user
3. Check your Supabase database - a new row should appear in the `profiles` table
4. Check the Clerk webhook logs in the dashboard for delivery status

---

## Stripe Webhooks (Required for Payments)

Stripe webhooks handle payment events like successful charges and subscription updates.

### Option A: Using Stripe CLI (Recommended for Local Dev)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

After running this command, you'll see:
```
> Ready! You are using Stripe API version 2026-02-25.
> Your webhook signing secret is whsec_xxxxxxxxxxxxxxxx (~whsec_xxxxxxxxxxxxxxxx)
```

Copy the webhook signing secret and update your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

### Option B: Using Ngrok (Alternative)

1. Start ngrok (if not already running):
   ```bash
   ngrok http 3000
   ```

2. Go to https://dashboard.stripe.com/webhooks
3. Click **Add endpoint**
4. Enter: `https://your-ngrok-url.ngrok-free.app/api/webhooks/stripe`
5. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.succeeded`
   - `payout.paid`
6. Copy the signing secret to your `.env.local`

---

## Webhook Endpoints Reference

| Service | Endpoint | Events |
|---------|----------|--------|
| Clerk | `/api/webhooks/clerk` | user.created, user.updated, subscription.* |
| Stripe | `/api/webhooks/stripe` | checkout.session.completed, subscription.*, charge.succeeded |

---

## Troubleshooting

### Webhooks not being received

1. **Check ngrok is running**: Make sure the tunnel is active
2. **Check URL is correct**: Verify the webhook URL matches your ngrok URL
3. **Check server is running**: Ensure `npm run dev` is active
4. **Check logs**: Look at your terminal output for webhook handler errors

### "Invalid signature" errors

- The webhook signing secret is incorrect
- Make sure you've updated both root and app-specific `.env.local` files
- Restart the server after changing environment variables

### Database not being updated

1. Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. Check Supabase RLS policies (service role should bypass RLS)
3. Check server logs for database errors

---

## Production Webhook Setup

For production deployment:

1. Use your production domain (e.g., `https://starterclub.com`)
2. Set webhook URLs to:
   - Clerk: `https://starterclub.com/api/webhooks/clerk`
   - Stripe: `https://starterclub.com/api/webhooks/stripe`
3. Use production API keys (not test keys)
4. Keep webhook secrets secure and rotate them periodically
