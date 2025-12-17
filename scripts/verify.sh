#!/usr/bin/env bash

set -euo pipefail
RED="\033[0;31m"
GREEN="\033[0;32m"
NC="\033[0m"

echo -e "${GREEN}🧪 Starting verification suite...${NC}"

##########################################
# 1) Check essential directories
##########################################

echo -e "${GREEN}📁 Validating project structure...${NC}"
for d in apps/marketing-website apps/onboard-app supabase; do
  if [ ! -d "$d" ]; then
    echo -e "${RED}❌ Missing directory: $d${NC}"
    exit 1
  else
    echo -e "${GREEN}✔ $d exists${NC}"
  fi
done

##########################################
# 2) Required ENV vars
##########################################

echo -e "${GREEN}🔐 Checking environment variables...${NC}"
REQUIRED_ENV_VARS=(
  SUPABASE_URL
  SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
)
# Source envs if possible or rely on system envs. 
# We'll try to read from apps/marketing-website/.env and .env.local
ENV_FILE="apps/marketing-website/.env"
if [ -f "$ENV_FILE" ]; then
  echo -e "ℹ️  Reading envs from $ENV_FILE..."
  
  # Helper to read var from file
  get_var() {
    grep "^$1=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'"
  }

  if [ -z "${SUPABASE_URL+x}" ]; then
     VAL=$(get_var "NEXT_PUBLIC_SUPABASE_URL")
     if [ ! -z "$VAL" ]; then export SUPABASE_URL="$VAL"; fi
  fi
  
  if [ -z "${SUPABASE_ANON_KEY+x}" ]; then
     VAL=$(get_var "NEXT_PUBLIC_SUPABASE_ANON")
     if [ ! -z "$VAL" ]; then export SUPABASE_ANON_KEY="$VAL"; fi
  fi
  
  if [ -z "${SUPABASE_SERVICE_ROLE_KEY+x}" ]; then
     VAL=$(get_var "SUPABASE_SERVICE_ROLE_KEY")
     if [ ! -z "$VAL" ]; then export SUPABASE_SERVICE_ROLE_KEY="$VAL"; fi
  fi
fi

for var in "${REQUIRED_ENV_VARS[@]}"; do
  if [ -z "${!var+x}" ]; then
    echo -e "${RED}❌ Missing env var: $var${NC}"
    exit 1
  else
    echo -e "${GREEN}✔ $var is set${NC}"
  fi
done

##########################################
# 3) Install, Lint & Build each app
##########################################

function test_app() {
  APP_PATH=$1
  APP_NAME=$2

  echo -e "${GREEN}📦 Installing & linting $APP_NAME...${NC}"
  pushd "$APP_PATH" > /dev/null

  if [ -f "package.json" ]; then
  if [[ "$@" == *"--skip-build"* ]]; then
    echo -e "⏭️  Skipping build & lint for $APP_NAME (--skip-build set)..."
    npm install --silent
  else 
    npm install --silent

    if npm run lint --silent; then
      echo -e "${GREEN}✔ Lint passed for $APP_NAME${NC}"
    else
      echo -e "${RED}❌ Lint errors in $APP_NAME${NC}"
      exit 1
    fi

    if npm run build --silent; then
      echo -e "${GREEN}✔ Build success for $APP_NAME${NC}"
    else
      echo -e "${RED}❌ Build failure for $APP_NAME${NC}"
      exit 1
    fi
  fi
  else
    echo -e "${RED}❌ No package.json found in $APP_PATH${NC}"
    exit 1
  fi

  popd > /dev/null
}

test_app "apps/marketing-website" "Marketing Website" "$@"
test_app "apps/onboard-app" "Onboard App" "$@"

##########################################
# 4) Real Supabase query test
##########################################

echo -e "${GREEN}🔗 Testing Supabase connection and query...${NC}"
# USING --input-type=module to support import syntax
node --input-type=module << 'EOF' || exit 1
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error("❌ Supabase env not fully set");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

(async () => {
  try {
    // Schema: visit_type, intent, etc.
    // I'll use 'description': 'VERIFY_AGENT_TEST' if description exists, or visit_type.
    
    const testData = { 
        visit_type: 'QUICK_LOG', 
        description: "VERIFY_AGENT_TEST " + new Date().toISOString() 
    };

    let { data: insertData, error: insertError } = await supabase
      .from("activity_log")
      .insert(testData)
      .select();

    if (insertError) {
      console.error("❌ Supabase insert failed:", insertError);
      process.exit(1);
    }
    console.log("✔ Supabase insert OK:", insertData);

    // Select the same row back
    const insertedId = insertData[0]?.id;
    let { data: selectData, error: selectError } = await supabase
      .from("activity_log")
      .select("*")
      .eq("id", insertedId);

    if (selectError) {
      console.error("❌ Supabase select failed:", selectError);
      process.exit(1);
    }
    console.log("✔ Supabase select OK:", selectData);

    // Clean up
    await supabase.from("activity_log").delete().eq("id", insertedId);

    console.log("✔ Supabase verification complete (row cleaned up).");
    process.exit(0);

  } catch (err) {
    console.error("❌ Unexpected Supabase error:", err);
    process.exit(1);
  }
})();
EOF

##########################################
# 5) Optional deployed URL checks
##########################################

if [ ! -z "${VERCEL_MARKETING_URL+x}" ]; then
  echo -e "${GREEN}🌐 Pinging deployed marketing site...${NC}"
  curl -Is "$VERCEL_MARKETING_URL" | head -n 1 | grep "200" || {
    echo -e "${RED}❌ Marketing site did not return 200${NC}"
    exit 1
  }
  echo -e "${GREEN}✔ Marketing site OK${NC}"
fi

if [ ! -z "${VERCEL_ONBOARD_URL+x}" ]; then
  echo -e "${GREEN}🌐 Pinging deployed onboard site...${NC}"
  curl -Is "$VERCEL_ONBOARD_URL" | head -n 1 | grep "200" || {
    echo -e "${RED}❌ Onboard site did not return 200${NC}"
    exit 1
  }
  echo -e "${GREEN}✔ Onboard site OK${NC}"
fi

echo -e "${GREEN}🎉 All checks passed!${NC}"
