#!/bin/bash

# Vercel Setup Script
# This script automates the creation of Vercel projects and environment variables.

# Define project names
MARKETING="starter-club"
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

# Function to add env var safely
add_env() {
    local project=$1
    local key=$2
    local value=$3
    local target=$4

    echo "   -> Linking to $project..."
    vercel link --project "$project" --yes 1> /dev/null
    
    echo "   -> Setting $key..."
    # Check if exists first to avoid error, or just let it fail/ignore if exists?
    # 'vercel env add' creates a new one. If it exists, it might error.
    # We can try to remove it first or just try add. 
    # Simplest for now: Try add, if it fails, try 'rm' then 'add' or just ignore if it's meant to be idempotent.
    # Actually, let's just try adding.
    echo "$value" | vercel env add "$key" "$target" || echo "      (Might already exist or failed)"
}

# 1. Create Projects
create_project "$MARKETING"
create_project "$ONBOARD"
create_project "$PARTNER"
create_project "$ADMIN"

# 2. Configure Environment Variables
echo "🔗 Configuring Environment Variables..."

# Construct URLs
ONBOARD_URL="https://$ONBOARD.vercel.app"
PARTNER_URL="https://$PARTNER.vercel.app"
ADMIN_URL="https://$ADMIN.vercel.app"
MARKETING_URL="https://$MARKETING.vercel.app"

# Configure Marketing Website Vars
echo "Configuring $MARKETING..."
add_env "$MARKETING" "NEXT_PUBLIC_ONBOARD_URL" "$ONBOARD_URL" "production"
add_env "$MARKETING" "NEXT_PUBLIC_ONBOARD_URL" "$ONBOARD_URL" "preview"
add_env "$MARKETING" "NEXT_PUBLIC_ONBOARD_URL" "$ONBOARD_URL" "development"

add_env "$MARKETING" "NEXT_PUBLIC_PARTNER_URL" "$PARTNER_URL" "production"
add_env "$MARKETING" "NEXT_PUBLIC_PARTNER_URL" "$PARTNER_URL" "preview"
add_env "$MARKETING" "NEXT_PUBLIC_PARTNER_URL" "$PARTNER_URL" "development"

add_env "$MARKETING" "NEXT_PUBLIC_ADMIN_URL" "$ADMIN_URL" "production"
add_env "$MARKETING" "NEXT_PUBLIC_ADMIN_URL" "$ADMIN_URL" "preview"
add_env "$MARKETING" "NEXT_PUBLIC_ADMIN_URL" "$ADMIN_URL" "development"

# Configure Onboard App Vars
echo "Configuring $ONBOARD..."
add_env "$ONBOARD" "VITE_MARKETING_URL" "$MARKETING_URL" "production"
add_env "$ONBOARD" "VITE_MARKETING_URL" "$MARKETING_URL" "preview"
add_env "$ONBOARD" "VITE_MARKETING_URL" "$MARKETING_URL" "development"

# 4. Configure Clerk (Interactive)
echo "🔑 Configuring Clerk Keys..."
echo "Please enter your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (Production):"
read -r CLERK_PUB_KEY
echo "Please enter your CLERK_SECRET_KEY (Production):"
read -r CLERK_SECRET_KEY

if [ -n "$CLERK_PUB_KEY" ] && [ -n "$CLERK_SECRET_KEY" ]; then
    echo "Setting Clerk Keys for $MARKETING..."
    add_env "$MARKETING" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "$CLERK_PUB_KEY" "production"
    add_env "$MARKETING" "CLERK_SECRET_KEY" "$CLERK_SECRET_KEY" "production"
    echo "Done!"
else
    echo "Skipping Clerk setup (missing keys)."
fi

echo "✅ Setup Complete!"
echo ""
echo "IMPORTANT NEXT STEPS:"
echo "1. The current directory is linked to the last modified project."
echo "2. Go to the Vercel Dashboard for each project to confirm settings."
echo "3. Remember to set Root Directories in Vercel Settings -> General."
