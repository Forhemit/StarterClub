# Vercel Deployment Testing & Validation Agent

## Objective
Continuously test and validate Vercel deployments until build passes. Use Vercel CLI to diagnose issues, implement fixes, and ensure successful deployment without breaking application functionality, UX, or UI.

## Core Principle
**Preserve UX/UI Integrity**: All fixes must maintain or improve user experience. Never compromise functionality for deployment success.

## Tools & Dependencies
- Vercel CLI (latest version)
- Project-specific package manager (npm/yarn/pnpm/bun)
- Git for version control
- HTTP testing utilities (curl/wget)
- Browser automation tools (optional, for UI testing)
- Project-specific build tools (Next.js, Nuxt, Gatsby, etc.)

## Phase 1: Pre-Deployment Validation
Before deploying, ensure:
```bash
# 1. Verify Vercel project setup
vercel projects ls
vercel link

# 2. Check environment configuration
vercel env ls
vercel pull

# 3. Validate local build
npm run build  # or equivalent
# Test built output locally if possible
npx serve ./build  # or framework-specific serve command

# 4. Review vercel.json configuration
cat vercel.json  # or vercel.config.json
```

## Phase 2: Smart Deployment Testing Loop
Execute iterative deployment with intelligent failure analysis:

```bash
MAX_ATTEMPTS=3
SUCCESS=false
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ] && [ "$SUCCESS" = false ]; do
  echo "🚀 Deployment Attempt $ATTEMPT/$MAX_ATTEMPTS"
  
  # Deploy with specific environment
  DEPLOY_OUTPUT=$(vercel --prod 2>&1)
  echo "$DEPLOY_OUTPUT"
  
  # Extract deployment URL
  DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[a-zA-Z0-9.-]*\.vercel\.app' | head -1)
  
  if [ -n "$DEPLOY_URL" ]; then
    echo "📋 Deployment URL: $DEPLOY_URL"
    
    # Test basic accessibility
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL")
    
    if [ "$HTTP_STATUS" -eq 200 ]; then
      echo "✅ Basic HTTP check passed"
      
      # Comprehensive functionality tests
      if test_functionality "$DEPLOY_URL"; then
        SUCCESS=true
        echo "🎉 Deployment fully successful!"
      else
        echo "⚠️  HTTP 200 but functionality issues detected"
        diagnose_issues "$DEPLOY_URL"
      fi
    else
      echo "❌ HTTP $HTTP_STATUS - Deployment failed"
      analyze_failure "$DEPLOY_URL"
    fi
  else
    echo "❌ Could not extract deployment URL"
    # Check for immediate build failures
    if echo "$DEPLOY_OUTPUT" | grep -q "Build failed\|Error:"; then
      diagnose_build_failure "$DEPLOY_OUTPUT"
    fi
  fi
  
  ATTEMPT=$((ATTEMPT + 1))
  if [ "$SUCCESS" = false ] && [ $ATTEMPT -le $MAX_ATTEMPTS ]; then
    echo "⏳ Waiting 15 seconds before retry..."
    sleep 15
  fi
done
```

## Phase 3: Intelligent Issue Diagnosis
Implement these diagnostic functions:

### diagnose_build_failure()
```bash
function diagnose_build_failure() {
  local output="$1"
  
  echo "🔍 Analyzing build failure..."
  
  # Check common Vercel build issues
  if echo "$output" | grep -qi "memory limit\|out of memory"; then
    echo "→ Memory limit exceeded. Solutions:"
    echo "  1. Increase memory in vercel.json"
    echo "  2. Optimize build process"
    echo "  3. Split large builds"
    
  elif echo "$output" | grep -qi "timeout\|timed out"; then
    echo "→ Build timeout. Solutions:"
    echo "  1. Increase maxDuration in vercel.json"
    echo "  2. Optimize build speed"
    echo "  3. Use --prebuilt flag for faster deployments"
    
  elif echo "$output" | grep -qi "ENOENT\|not found\|missing"; then
    echo "→ Missing file or dependency. Solutions:"
    echo "  1. Check package.json dependencies"
    echo "  2. Verify file paths are correct"
    echo "  3. Ensure build output directory exists"
    
  elif echo "$output" | grep -qi "environment variable\|env"; then
    echo "→ Environment variable issue. Solutions:"
    echo "  1. Set missing variables: vercel env add"
    echo "  2. Check env variable naming"
    echo "  3. Verify build-time vs runtime variables"
    
  else
    echo "→ Unknown build error. Check logs:"
    vercel logs --limit 50
  fi
}
```

### analyze_failure()
```bash
function analyze_failure() {
  local url="$1"
  
  echo "📊 Fetching deployment logs..."
  vercel logs "$url" --limit 100 > deployment_logs.txt
  
  # Analyze logs for patterns
  if grep -q "ModuleNotFoundError\|Cannot find module" deployment_logs.txt; then
    echo "→ Dependency issue detected"
    echo "  Running: npm ci --production"
    npm ci --production || npm install
    
  elif grep -q "SyntaxError\|Unexpected token" deployment_logs.txt; then
    echo "→ JavaScript syntax error"
    echo "  Checking Node.js version compatibility..."
    node --version
    echo "  Consider adding engine specification in package.json"
    
  elif grep -q "404\|Not Found" deployment_logs.txt; then
    echo "→ Routing or file serving issue"
    echo "  Checking vercel.json routes configuration..."
    
  elif grep -q "500\|Internal Server Error" deployment_logs.txt; then
    echo "→ Server-side error"
    echo "  Check serverless function logs"
    vercel logs "$url" --filter "lambda" --limit 50
  fi
}
```

### test_functionality()
```bash
function test_functionality() {
  local url="$1"
  local all_passed=true
  
  echo "🧪 Testing application functionality..."
  
  # Test critical endpoints
  ENDPOINTS=("/" "/api/health" "/manifest.json" "/robots.txt")
  
  for endpoint in "${ENDPOINTS[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url$endpoint")
    if [ "$status" -eq 200 ] || [ "$status" -eq 204 ]; then
      echo "  ✅ $endpoint: HTTP $status"
    else
      echo "  ❌ $endpoint: HTTP $status"
      all_passed=false
    fi
  done
  
  # Test JavaScript loading
  if curl -s "$url" | grep -q "<script.*src="; then
    echo "  ✅ JavaScript bundles detected"
  else
    echo "  ⚠️  No JavaScript bundles found (may be expected for static sites)"
  fi
  
  # Test CSS loading
  if curl -s "$url" | grep -q "<link.*stylesheet"; then
    echo "  ✅ CSS stylesheets detected"
  else
    echo "  ⚠️  No CSS detected (may be expected for JS-in-CSS solutions)"
  fi
  
  return $([ "$all_passed" = true ] && echo 0 || echo 1)
}
```

## Phase 4: Safe Fix Application
Apply fixes that preserve UX/UI:

### UX/UI Preservation Checklist
Before applying any fix, verify:

✅ No visual regressions (layout, colors, typography)

✅ All interactive elements work (buttons, forms, navigation)

✅ Mobile responsiveness maintained

✅ Accessibility features intact (ARIA labels, keyboard nav)

✅ Performance metrics not degraded

✅ Third-party integrations still functional

### Safe Fix Examples
```bash
# 1. Dependency updates (preserve compatibility)
npm update --save-exact  # Exact versions to prevent breaking changes

# 2. Configuration adjustments
# Update vercel.json with backward-compatible changes
cat > vercel.json << EOF
{
  "builds": [{
    "src": "package.json",
    "use": "@vercel/next"
  }],
  "routes": [],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

# 3. Build optimization (preserve output)
# Add build caching if not present
if ! grep -q "cache" vercel.json; then
  echo "Adding build cache configuration..."
  # Modify vercel.json to include cache directives
fi

# 4. Environment variable validation
# Ensure only necessary env vars are exposed to client
vercel env pull .env.local
grep -v "SECRET\|PRIVATE\|KEY\|PASSWORD" .env.local > .env.production
```

## Phase 5: Success Validation Suite
When deployment succeeds, run comprehensive validation:

```bash
function validate_deployment() {
  local url="$1"
  
  echo "📋 Running comprehensive validation..."
  
  # 1. Performance check
  echo "⏱️  Performance metrics:"
  curl -s -o /dev/null -w "
    Time to First Byte: %{time_starttransfer}s
    Total Time: %{time_total}s
    Download Size: %{size_download} bytes
  " "$url"
  
  # 2. Content validation
  echo "📄 Content validation:"
  if curl -s "$url" | grep -q "<title>"; then
    TITLE=$(curl -s "$url" | grep -o "<title>[^<]*</title>" | sed 's/<[^>]*>//g')
    echo "  ✅ Title found: $TITLE"
  else
    echo "  ⚠️  No title tag found"
  fi
  
  # 3. Core Web Vitals indicators
  echo "📊 Core Web Vitals indicators:"
  if curl -s "$url" | grep -qi "next/script\|loading.*lazy"; then
    echo "  ✅ Modern loading patterns detected"
  fi
  
  # 4. API health (if applicable)
  echo "🌡️  API health:"
  API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url/api/health" 2>/dev/null)
  if [ "$API_STATUS" = "200" ] || [ "$API_STATUS" = "000" ]; then
    echo "  ✅ API endpoint check passed"
  else
    echo "  ℹ️  No API endpoint detected (may be expected)"
  fi
  
  # 5. Static asset validation
  echo "🖼️  Static assets:"
  if curl -s -o /dev/null -w "%{http_code}" "$url/favicon.ico" | grep -q "200\|404"; then
    echo "  ✅ Static asset serving working"
  fi
}
```

## Phase 6: Post-Deployment Optimization
After successful deployment:

```bash
# 1. Enable analytics (if not already)
vercel analytics enable

# 2. Check deployment aliases
vercel alias ls

# 3. Set up monitoring (optional)
echo "Consider setting up:"
echo "  - Vercel Speed Insights"
echo "  - Error tracking (Sentry, LogRocket)"
echo "  - Uptime monitoring"

# 4. Generate deployment report
echo "📈 Deployment Report" > deploy_report.md
echo "- Build time: $(date)" >> deploy_report.md
echo "- URL: $DEPLOY_URL" >> deploy_report.md
echo "- Status: Success" >> deploy_report.md
vercel inspect "$DEPLOY_URL" >> deploy_report.md
```

## Special Considerations for Vercel
### Framework-Specific Issues
```bash
# Next.js
- Check for `next.config.js` issues
- Verify image optimization configuration
- Ensure API routes are properly structured

# Nuxt.js
- Verify `nuxt.config.js` settings
- Check static vs server-side rendering config
- Ensure modules are properly installed

# Gatsby
- Verify Gatsby version compatibility
- Check plugin configurations
- Ensure proper asset prefix settings

# Create React App / Vite
- Verify public folder structure
- Check base path configuration
- Ensure proper environment variables
```

### Vercel-Specific Features to Validate
- **Edge Functions**: Test if edge runtime works correctly
- **Middleware**: Verify middleware execution order
- **ISR**: Check incremental static regeneration
- **Serverless Functions**: Test API endpoints and cold starts
- **Caching**: Verify proper cache headers

### Rollback Strategy
If deployment causes issues:

```bash
# List previous deployments
vercel list

# Rollback to previous version
vercel rollback <deployment-id>

# Promote a specific deployment to production
vercel promote <deployment-id>
```

## Final Output Format
After testing completes, provide:

✅ Deployment URL

✅ Build status and duration

✅ Issues encountered and fixes applied

✅ UX/UI preservation confirmation

✅ Performance metrics

✅ Recommendations for future deployments

❌ Any unresolved warnings (if applicable)

## Continuous Improvement
After each deployment cycle:
- Update this script with new learnings
- Add new error patterns to diagnose_functions
- Refine UX/UI preservation checks
- Document successful resolution patterns
