#!/bin/bash

# Environment Setup Validation Script
# This script checks if all required environment variables are configured

echo "========================================"
echo "Starter Club - Environment Setup Check"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_CONFIGURED=true

# Function to check if a variable is set in a file
check_var() {
    local file=$1
    local var=$2
    local required=$3
    
    if [ -f "$file" ]; then
        if grep -q "^$var=" "$file" 2>/dev/null; then
            value=$(grep "^$var=" "$file" | cut -d'=' -f2)
            if [ -n "$value" ] && [ "$value" != "YOUR_"* ] && [ "$value" != "pk_test_YOUR_"* ] && [ "$value" != "sk_test_YOUR_"* ] && [ "$value" != "whsec_YOUR_"* ]; then
                if [ "$required" = "true" ]; then
                    echo -e "${GREEN}✓${NC} $var is set"
                fi
                return 0
            else
                if [ "$required" = "true" ]; then
                    echo -e "${RED}✗${NC} $var is not configured (placeholder value)"
                    ALL_CONFIGURED=false
                fi
                return 1
            fi
        else
            if [ "$required" = "true" ]; then
                echo -e "${RED}✗${NC} $var is missing"
                ALL_CONFIGURED=false
            fi
            return 1
        fi
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}✗${NC} File $file not found"
            ALL_CONFIGURED=false
        fi
        return 1
    fi
}

echo "Checking Root .env.local..."
echo "---------------------------"
if [ -f ".env.local" ]; then
    check_var ".env.local" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "true"
    check_var ".env.local" "CLERK_SECRET_KEY" "true"
    check_var ".env.local" "CLERK_WEBHOOK_SECRET" "true"
    check_var ".env.local" "NEXT_PUBLIC_SUPABASE_URL" "true"
    check_var ".env.local" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "true"
    check_var ".env.local" "SUPABASE_SERVICE_ROLE_KEY" "true"
    check_var ".env.local" "STRIPE_SECRET_KEY" "false"
    check_var ".env.local" "STRIPE_WEBHOOK_SECRET" "false"
else
    echo -e "${RED}✗${NC} Root .env.local not found"
    ALL_CONFIGURED=false
fi

echo ""
echo "Checking Marketing Website..."
echo "-----------------------------"
check_var "apps/marketing-website/.env.local" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "true"
check_var "apps/marketing-website/.env.local" "CLERK_SECRET_KEY" "true"
check_var "apps/marketing-website/.env.local" "NEXT_PUBLIC_SUPABASE_URL" "true"

echo ""
echo "Checking Super Admin..."
echo "-----------------------"
check_var "apps/super-admin/.env.local" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "true"
check_var "apps/super-admin/.env.local" "NEXT_PUBLIC_SUPABASE_URL" "true"

echo ""
echo "Checking Flight Deck..."
echo "-----------------------"
check_var "apps/flight-deck/.env.local" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "true"
check_var "apps/flight-deck/.env.local" "NEXT_PUBLIC_SUPABASE_URL" "true"

echo ""
echo "Checking Onboard App..."
echo "-----------------------"
check_var "apps/onboard-app/.env" "VITE_SUPABASE_URL" "true"
check_var "apps/onboard-app/.env" "VITE_SUPABASE_ANON_KEY" "true"

echo ""
echo "========================================"
if [ "$ALL_CONFIGURED" = true ]; then
    echo -e "${GREEN}✓ All required environment variables are configured!${NC}"
    echo ""
    echo "You can now run:"
    echo "  npm run dev"
else
    echo -e "${RED}✗ Some environment variables are missing or not configured.${NC}"
    echo ""
    echo "Please:"
    echo "1. Update the .env.local files with your actual values"
    echo "2. See ENVIRONMENT_SETUP.md for detailed instructions"
    echo ""
    echo "Required services:"
    echo "  - Clerk: https://dashboard.clerk.com"
    echo "  - Supabase: https://app.supabase.com"
fi
echo "========================================"
