#!/bin/bash

# Vercel Setup Script
# This script automates the creation of Vercel projects and environment variables.

# Define project names
MARKETING="starter-club-marketing"
ONBOARD="starter-club-onboard"
PARTNER="starter-club-flight-deck"
ADMIN="starter-club-super-admin"

echo "🚀 Starting Vercel Setup..."

# Function to create project
create_project() {
  local name=$1
  echo "Creating project: $name..."
  vercel project add "$name" || echo "Project $name might already exist or failed to create."
}

# 1. Create Projects
create_project "$MARKETING"
create_project "$ONBOARD"
create_project "$PARTNER"
create_project "$ADMIN"

# 2. Configure Environment Variables for Marketing Website
echo "🔗 Configuring Environment Variables for $MARKETING..."

# Construct URLs (assuming standard Vercel naming convention or user can update later)
ONBOARD_URL="https://$ONBOARD.vercel.app"
PARTNER_URL="https://$PARTNER.vercel.app"
ADMIN_URL="https://$ADMIN.vercel.app"

echo "Setting NEXT_PUBLIC_ONBOARD_URL to $ONBOARD_URL"
echo $ONBOARD_URL | vercel env add NEXT_PUBLIC_ONBOARD_URL production --project "$MARKETING"
echo $ONBOARD_URL | vercel env add NEXT_PUBLIC_ONBOARD_URL preview --project "$MARKETING"
echo $ONBOARD_URL | vercel env add NEXT_PUBLIC_ONBOARD_URL development --project "$MARKETING"

echo "Setting NEXT_PUBLIC_PARTNER_URL to $PARTNER_URL"
echo $PARTNER_URL | vercel env add NEXT_PUBLIC_PARTNER_URL production --project "$MARKETING"
echo $PARTNER_URL | vercel env add NEXT_PUBLIC_PARTNER_URL preview --project "$MARKETING"
echo $PARTNER_URL | vercel env add NEXT_PUBLIC_PARTNER_URL development --project "$MARKETING"

echo "Setting NEXT_PUBLIC_ADMIN_URL to $ADMIN_URL"
echo $ADMIN_URL | vercel env add NEXT_PUBLIC_ADMIN_URL production --project "$MARKETING"
echo $ADMIN_URL | vercel env add NEXT_PUBLIC_ADMIN_URL preview --project "$MARKETING"
echo $ADMIN_URL | vercel env add NEXT_PUBLIC_ADMIN_URL development --project "$MARKETING"

# 3. Configure Environment Variables for Onboard App
echo "🔗 Configuring Environment Variables for $ONBOARD..."
MARKETING_URL="https://$MARKETING.vercel.app"

echo "Setting VITE_MARKETING_URL to $MARKETING_URL"
echo $MARKETING_URL | vercel env add VITE_MARKETING_URL production --project "$ONBOARD"
echo $MARKETING_URL | vercel env add VITE_MARKETING_URL preview --project "$ONBOARD"
echo $MARKETING_URL | vercel env add VITE_MARKETING_URL development --project "$ONBOARD"

# 4. Configure Clerk (Interactive)
echo "🔑 Configuring Clerk Keys..."
echo "Please enter your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (Production):"
read -r CLERK_PUB_KEY
echo "Please enter your CLERK_SECRET_KEY (Production):"
read -r CLERK_SECRET_KEY

if [ -n "$CLERK_PUB_KEY" ] && [ -n "$CLERK_SECRET_KEY" ]; then
    echo "Setting Clerk Keys for $MARKETING..."
    echo "$CLERK_PUB_KEY" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production --project "$MARKETING"
    echo "$CLERK_SECRET_KEY" | vercel env add CLERK_SECRET_KEY production --project "$MARKETING"
    echo "Done!"
else
    echo "Skipping Clerk setup (missing keys)."
fi

echo "✅ Setup Complete!"
echo ""
echo "IMPORTANT NEXT STEPS:"
echo "1. Go to the Vercel Dashboard for each project."
echo "2. Connect your Git Repository."
echo "3. Go to Settings > General > Root Directory and set the following:"
echo "   - $MARKETING: apps/marketing-website"
echo "   - $ONBOARD: apps/onboard-app"
echo "   - $PARTNER: apps/flight-deck"
echo "   - $ADMIN: apps/super-admin"
echo "4. Deploy!"
