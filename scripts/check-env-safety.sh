#!/bin/bash

# check-env-safety.sh
# Purpose: Fail the build if dangerous dev-only flags or secrets are found in a production build context.

echo "🔒 Starting Environment Safety Scan..."

# 1. Define Forbidden Patterns
FORBIDDEN_PATTERNS=(
    "NEXT_PUBLIC_USE_SIMPLE_AUTH"
    "StarterClub!2025"
    "isSimpleAuth"
)

# 2. Check for CI/Production Context
# Adjust this check based on your actual CI environment variables (e.g., VERCEL_ENV, CI, NODE_ENV)
if [[ "$VERCEL_ENV" != "production" && "$NODE_ENV" != "production" ]]; then
    echo "⚠️  Not in production mode (VERCEL_ENV=$VERCEL_ENV, NODE_ENV=$NODE_ENV). Skipping strict safety checks."
    exit 0
fi

echo "🔍 Production build detected. Scanning for forbidden patterns..."

FOUND_ERROR=0

for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    if grep -r --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude="check-env-safety.sh" "$pattern" .; then
        echo "❌ CRITICAL SECURITY ERROR: Forbidden pattern '$pattern' found in codebase during production build!"
        FOUND_ERROR=1
    fi
done

if [ $FOUND_ERROR -eq 1 ]; then
    echo "🚫 Build failed due to security violations."
    exit 1
else
    echo "✅ Environment Scan Passed: No forbidden patterns found."
    exit 0
fi
