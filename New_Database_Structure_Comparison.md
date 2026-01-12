# **DATABASE RESTRUCTURE & MIGRATION PROMPT**

## **GOAL OVERVIEW**

We are transforming from **11 isolated, siloed module databases** into a **single, unified database architecture** that maintains modular flexibility while enabling enterprise-grade data consistency, cross-module features, and simplified operations.

## **THE PROBLEM WE'RE SOLVING**

### **Current Pain Points:**
1. **Data Duplication**: Same company exists in 11 different databases with different spellings/IDs
2. **No Cross-Module Insights**: Can't analyze how HR data affects financial resilience
3. **User Experience Friction**: Users re-enter the same company information 11 times
4. **Operational Overhead**: 11 databases to backup, monitor, secure, and scale
5. **Inconsistent Security**: Different access control models across modules
6. **Development Complexity**: 11 separate schemas to understand and maintain

## **TARGET STATE GOALS**

### **Primary Objectives:**
1. **Single Source of Truth**: One canonical record for each company, user, and organization
2. **Modular Monolith**: Maintain module independence while sharing core data
3. **Cross-Module Analytics**: Unified reporting and insights across all modules
4. **Simplified User Experience**: Enter once, use everywhere
5. **Enterprise Security**: Consistent access control and audit trails

### **Technical Goals:**
1. **Data Integrity**: Eliminate conflicting company records across modules
2. **Performance**: Maintain or improve query performance
3. **Scalability**: Support growth without multiplying database complexity
4. **Maintainability**: One schema to understand, not 11
5. **Security**: Centralized access control with module-level permissions

## **ARCHITECTURAL PRINCIPLES**

### **The "Core Truth" Contract:**
- **One Entity → One Owner → One Write Path**
- Modules reference core entities, never copy them
- Core defines identity, modules extend functionality

### **Consistency Tiers:**
- **Tier 0 (Strong)**: Authentication, organizations, core companies (must be instant)
- **Tier 1 (Causal)**: Contacts, documents (should be consistent across modules)
- **Tier 2 (Eventual)**: Scores, analytics, aggregates (can lag minutes/hours)

## **KEY DELIVERABLES**

### **For Users:**
- Unified company dashboard showing data from all installed modules
- Single sign-on across all modules
- No duplicate data entry
- Module marketplace (install/uninstall modules on-demand)

### **For Developers:**
- Shared TypeScript types for core entities
- Consistent API patterns
- Simplified testing and debugging
- Clear data ownership boundaries

### **For Business:**
- Cross-module analytics and reporting
- Reduced operational costs
- Faster feature development
- Better data quality for compliance and insights

## **MIGRATION SUCCESS CRITERIA**

### **Technical Metrics:**
- Zero data loss during migration
- Query performance within 10% of original
- 99.9% uptime during migration window
- All security policies properly enforced

### **Business Metrics:**
- 95% reduction in duplicate company records
- 40% increase in cross-module feature usage
- 30% faster development of new module features
- User satisfaction score ≥ 4.5/5 post-migration

## **WHY THIS APPROACH (vs. alternatives)**

### **Not a "Big Table" Approach:**
- We maintain module isolation via PostgreSQL schemas
- Each module evolves independently
- We avoid the performance nightmare of 100+ columns per table

### **Not 11 Separate Databases:**
- We gain cross-module insights
- We eliminate data duplication
- We simplify operations dramatically

### **The "Modular Monolith" Balance:**
- **Core Schema**: Shared truth (companies, users, orgs)
- **Module Schemas**: Independent functionality
- **Foreign Keys**: Maintain referential integrity
- **RLS**: Enforce access control at database level

## **IMMEDIATE BUSINESS VALUE**

### **Short-term (Post-migration):**
- Users stop complaining about duplicate data entry
- Admins get unified reporting dashboard
- Support team handles one database instead of 11

### **Medium-term (3-6 months):**
- New cross-module features (e.g., "Financial Health + HR Analytics")
- Reduced development time for new modules
- Better data quality for compliance requirements

### **Long-term (12+ months):**
- AI/ML insights using combined dataset
- Predictive analytics across business functions
- Foundation for platform expansion

## **THE PROMPT FOR THE TEAM**

"We need to migrate from 11 isolated databases to a single, unified architecture where:

1. **Core entities** (companies, users, organizations) exist exactly once
2. **Modules** remain independent but can reference and extend core data
3. **Users** can install/uninstall modules without losing data
4. **Cross-module features** become possible (analytics, search, reports)
5. **Security and performance** are maintained or improved

The migration must be:
- **Safe**: No data loss, comprehensive rollback plan
- **Gradual**: Module-by-module migration with dual-write during transition
- **Transparent**: Minimal user disruption, clear communication
- **Future-proof**: Architecture supports next 3-5 years of growth"

## **NON-GOALS (What We're NOT Doing)**

- Creating a single monolithic application
- Forcing all modules to use identical data models
- Removing module-specific functionality
- Creating a performance bottleneck with over-normalization
- Building a "one size fits all" solution that hinders innovation

## **DECISION CRITERIA FOR FUTURE MODULES**

When adding new modules to this architecture:

1. **Does it need to reference existing companies/users?** → Yes = Use core schema
2. **Does it have unique data not shared elsewhere?** → Yes = Use module schema
3. **Should it be installable/uninstallable independently?** → Yes = Follow module pattern
4. **Will it need to share data with other modules?** → Yes = Use core or define clear APIs

## **SUMMARY FOR STAKEHOLDERS**

"We're moving from 11 separate 'silos' to a 'hub and spoke' model. The hub contains our shared truth (companies, users), and the spokes are our specialized modules (HR, Finance, Legal). This gives us the best of both worlds: data consistency without sacrificing module independence."

---

**Bottom Line**: This restructure is about **transforming data from a liability** (duplicate, inconsistent, siloed) into **a strategic asset** (unified, consistent, interconnected) that drives better user experiences, operational efficiency, and business insights.
Excellent analysis! You've captured the critical nuances that separate a theoretical plan from a practical, successful implementation. Let me refine and complete the RLS enforcement layer with the exact implementations that will make this work in production.

# **COMPLETE RLS ENFORCEMENT LAYER**

## **The Enforcement Pyramid**

```
┌─────────────────────────────────────┐
│  TIER 3: Core RPC Functions         │ ← Security definer, business logic
│  (Controlled mutation pathways)     │
├─────────────────────────────────────┤
│  TIER 2: RLS Policies               │ ← Database-level access control
│  (Row-level security)               │
├─────────────────────────────────────┤
│  TIER 1: JWT Claims                 │ ← Session-level metadata
│  (Organization, roles, permissions) │
└─────────────────────────────────────┘
```

## **1. JWT Claims Configuration (Foundation)**

First, establish the JWT claim infrastructure that everything else depends on:

```sql
-- Function to set up JWT claims when user logs in
CREATE OR REPLACE FUNCTION auth.setup_jwt_claims()
RETURNS trigger AS $$
DECLARE
  user_org_id uuid;
  user_permissions text[];
BEGIN
  -- Get user's organization and permissions
  SELECT 
    p.organization_id,
    ARRAY_AGG(mp.permission) FILTER (WHERE mp.permission IS NOT NULL)
  INTO user_org_id, user_permissions
  FROM profiles p
  LEFT JOIN module_permissions mp ON mp.user_id = p.id
  WHERE p.id = NEW.id
  GROUP BY p.organization_id;
  
  -- Update auth.users with custom claims
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'organization_id', user_org_id,
      'user_role', (SELECT role FROM profiles WHERE id = NEW.id),
      'permissions', user_permissions,
      'setup_version', '2.0'
    )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update JWT claims when profile changes
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.setup_jwt_claims();

-- Function to refresh JWT claims (call when permissions change)
CREATE OR REPLACE FUNCTION auth.refresh_jwt_claims(user_id uuid)
RETURNS void AS $$
BEGIN
  -- Invalidate old session
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || '{"force_refresh": true}'
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## **2. Core Tables RLS Policies (The "Truth Guard")**

### **Organizations Table: The Root Container**
```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Only organization members can see their org
CREATE POLICY "org_select_policy" ON organizations
  FOR SELECT USING (
    id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
  );

-- Only system admins can create organizations
CREATE POLICY "org_insert_policy" ON organizations
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'user_role') = 'system_admin'
  );

-- Only organization admins can update
CREATE POLICY "org_update_policy" ON organizations
  FOR UPDATE USING (
    id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
    AND (auth.jwt() -> 'app_metadata' ->> 'user_role') IN ('org_admin', 'system_admin')
  );
```

### **Core Companies: The Sacred Table**
```sql
ALTER TABLE core_companies ENABLE ROW LEVEL SECURITY;

-- Fast read policy using JWT claims
CREATE POLICY "company_select_policy" ON core_companies
  FOR SELECT USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
    AND deleted_at IS NULL
  );

-- NO direct insert policy (must use RPC)
-- NO direct update policy (must use RPC)
-- NO delete policy (soft delete only via RPC)

-- Special policy for analytics (allows read of deleted for admins)
CREATE POLICY "company_select_deleted_admin" ON core_companies
  FOR SELECT USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
    AND deleted_at IS NOT NULL
    AND (auth.jwt() -> 'app_metadata' ->> 'user_role') = 'org_admin'
  );
```

## **3. Module Isolation RLS Policies**

### **Module Access Pattern Generator**
```sql
-- Function to create consistent module RLS policies
CREATE OR REPLACE FUNCTION security.create_module_rls_policies(
  module_schema text,
  module_name text,
  module_tables text[]
) RETURNS void AS $$
DECLARE
  tbl text;
  base_policy_sql text;
BEGIN
  FOREACH tbl IN ARRAY module_tables LOOP
    -- 1. Enable RLS on module table
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', module_schema, tbl);
    
    -- 2. Create read policy (requires module permission)
    base_policy_sql := $sql$
      CREATE POLICY "%s_read_policy" ON %I.%I
      FOR SELECT USING (
        -- Organization match via JWT
        organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
        AND
        -- Module permission check
        (auth.jwt() -> 'app_metadata' -> 'permissions')::jsonb ? '%s_viewer'
      )
    $sql$;
    
    EXECUTE format(base_policy_sql, 
      tbl, module_schema, tbl, module_name);
    
    -- 3. Create write policy (requires admin permission)
    base_policy_sql := $sql$
      CREATE POLICY "%s_write_policy" ON %I.%I
      FOR ALL USING (
        organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
        AND
        (auth.jwt() -> 'app_metadata' -> 'permissions')::jsonb ? '%s_admin'
      )
      WITH CHECK (
        organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
        AND
        (auth.jwt() -> 'app_metadata' -> 'permissions')::jsonb ? '%s_admin'
      )
    $sql$;
    
    EXECUTE format(base_policy_sql, 
      tbl, module_schema, tbl, module_name, module_name);
    
    RAISE NOTICE 'Created RLS policies for %.%', module_schema, tbl;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **Apply to Acquisition Module**
```sql
SELECT security.create_module_rls_policies(
  'mod_acquisition',
  'acquisition',
  ARRAY['company_extensions', 'data_room_documents', 'due_diligence_tasks']
);
```

## **4. Core RPC Functions (The Only Mutation Path)**

### **Company Creation with Deduplication**
```sql
CREATE OR REPLACE FUNCTION core.create_company(
  p_canonical_name text,
  p_legal_name text DEFAULT NULL,
  p_tax_id text DEFAULT NULL,
  p_source_module text DEFAULT 'direct'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_variable
DECLARE
  v_org_id uuid;
  v_company_id uuid;
  v_existing_id uuid;
  v_similarity_score float;
BEGIN
  -- 1. Get organization from JWT
  v_org_id := (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'No organization found in JWT claims';
  END IF;
  
  -- 2. Check for exact duplicates (case-insensitive)
  SELECT id INTO v_existing_id
  FROM core_companies 
  WHERE organization_id = v_org_id 
    AND lower(canonical_name) = lower(p_canonical_name)
    AND deleted_at IS NULL
  LIMIT 1;
  
  IF v_existing_id IS NOT NULL THEN
    RETURN v_existing_id; -- Return existing ID instead of failing
  END IF;
  
  -- 3. Check for fuzzy duplicates (optional, can be disabled)
  IF EXISTS (
    SELECT 1 FROM core_companies
    WHERE organization_id = v_org_id
      AND deleted_at IS NULL
      AND canonical_name % p_canonical_name  -- pg_trgm similarity
      AND similarity(canonical_name, p_canonical_name) > 0.8
  ) THEN
    RAISE EXCEPTION 'Similar company name already exists (fuzzy match). Use merge_company_rpc to merge.';
  END IF;
  
  -- 4. Create the company
  INSERT INTO core_companies (
    organization_id,
    canonical_name,
    legal_name,
    tax_id,
    source_module
  ) VALUES (
    v_org_id,
    p_canonical_name,
    COALESCE(p_legal_name, p_canonical_name),
    p_tax_id,
    p_source_module
  )
  RETURNING id INTO v_company_id;
  
  -- 5. Log the creation
  INSERT INTO core_audit_log (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    performed_by
  ) VALUES (
    'core_companies',
    v_company_id,
    'create',
    '{}'::jsonb,
    jsonb_build_object(
      'canonical_name', p_canonical_name,
      'legal_name', p_legal_name
    ),
    auth.uid()
  );
  
  RETURN v_company_id;
END;
$$;
```

### **Company Update (Controlled)**
```sql
CREATE OR REPLACE FUNCTION core.update_company(
  p_company_id uuid,
  p_updates jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_old_data jsonb;
  v_allowed_fields text[] := ARRAY[
    'legal_name', 'tax_id', 'address', 
    'phone', 'website', 'notes'
  ];
  v_field text;
  v_value jsonb;
BEGIN
  -- 1. Verify organization access
  SELECT organization_id INTO v_org_id
  FROM core_companies 
  WHERE id = p_company_id 
    AND deleted_at IS NULL;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Company not found or deleted';
  END IF;
  
  IF v_org_id != (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid THEN
    RAISE EXCEPTION 'Not authorized to update this company';
  END IF;
  
  -- 2. Get old data for audit
  SELECT to_jsonb(c) INTO v_old_data
  FROM core_companies c
  WHERE id = p_company_id;
  
  -- 3. Validate and apply updates
  FOR v_field, v_value IN 
    SELECT key, value FROM jsonb_each(p_updates)
  LOOP
    -- Check if field is allowed
    IF NOT (v_field = ANY(v_allowed_fields)) THEN
      RAISE EXCEPTION 'Field "%" is not allowed for update via this function', v_field;
    END IF;
    
    -- Special validation for canonical_name
    IF v_field = 'canonical_name' THEN
      PERFORM core.validate_company_name_change(p_company_id, v_value::text);
    END IF;
    
    -- Update the field
    EXECUTE format('UPDATE core_companies SET %I = $1 WHERE id = $2', v_field)
    USING v_value, p_company_id;
  END LOOP;
  
  -- 4. Log the update
  INSERT INTO core_audit_log (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    performed_by
  ) VALUES (
    'core_companies',
    p_company_id,
    'update',
    v_old_data,
    (SELECT to_jsonb(c) FROM core_companies c WHERE id = p_company_id),
    auth.uid()
  );
END;
$$;
```

## **5. Cross-Module Access Views**

### **Unified Company View (Read-Only)**
```sql
CREATE VIEW core.company_unified_view AS
SELECT 
  c.id,
  c.canonical_name,
  c.legal_name,
  c.tax_id,
  c.created_at,
  
  -- Module extensions (only if module is installed)
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM installed_modules im
      WHERE im.organization_id = c.organization_id
        AND im.module_id = 'acquisition-readiness'
        AND im.is_active = true
    )
    THEN ac.data_room_status 
    ELSE NULL 
  END as acquisition_status,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM installed_modules im
      WHERE im.organization_id = c.organization_id
        AND im.module_id = 'business-credit'
        AND im.is_active = true
    )
    THEN bc.credit_score 
    ELSE NULL 
  END as credit_score,
  
  -- ... other module fields
  
  -- Access control baked into view
  c.organization_id
FROM core_companies c
LEFT JOIN mod_acquisition.company_extensions ac ON c.id = ac.company_id
LEFT JOIN mod_business_credit.company_extensions bc ON c.id = bc.company_id
WHERE c.deleted_at IS NULL;

-- RLS on the view (inherits from underlying tables)
ALTER VIEW core.company_unified_view SET (security_invoker = true);
```

## **6. Emergency Override System**

### **Break-Glass Access Function**
```sql
CREATE OR REPLACE FUNCTION security.emergency_override(
  p_table_name text,
  p_operation text,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_check boolean;
BEGIN
  -- Only allow for break-glass scenarios
  v_admin_check := (
    SELECT (auth.jwt() -> 'app_metadata' ->> 'user_role') = 'system_admin'
    AND (auth.jwt() -> 'app_metadata' ->> 'emergency_override') = 'true'
  );
  
  IF NOT v_admin_check THEN
    RAISE EXCEPTION 'Emergency override not authorized';
  END IF;
  
  -- Log the override
  INSERT INTO security.emergency_audit (
    user_id,
    table_name,
    operation,
    reason,
    ip_address
  ) VALUES (
    auth.uid(),
    p_table_name,
    p_operation,
    p_reason,
    inet_client_addr()
  );
  
  -- Temporarily disable RLS for this transaction
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', p_table_name);
  
  -- Note: Caller must re-enable RLS after operation
  RAISE NOTICE 'RLS disabled for %. Re-enable with: ALTER TABLE % ENABLE ROW LEVEL SECURITY', 
    p_table_name, p_table_name;
END;
$$;
```

## **7. Real-Time Monitoring & Alerting**

### **RLS Policy Violation Detector**
```sql
CREATE OR REPLACE FUNCTION security.detect_rls_violations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log potential violations (when RLS blocks an operation)
  INSERT INTO security.rls_violation_log (
    table_name,
    user_id,
    attempted_operation,
    attempted_data,
    blocked_at
  ) VALUES (
    TG_TABLE_NAME,
    auth.uid(),
    TG_OP,
    to_jsonb(NEW),
    NOW()
  );
  
  -- Alert on suspicious patterns
  IF EXISTS (
    SELECT 1 FROM security.rls_violation_log
    WHERE user_id = auth.uid()
      AND blocked_at > NOW() - INTERVAL '5 minutes'
    HAVING COUNT(*) > 10
  ) THEN
    -- Trigger external alert (via webhook or similar)
    PERFORM net.http_post(
      url := current_setting('app.slack_webhook_url'),
      body := jsonb_build_object(
        'text', format('User %s triggering excessive RLS violations', auth.uid()),
        'table', TG_TABLE_NAME
      )
    );
  END IF;
  
  RAISE EXCEPTION 'RLS policy violation: Operation not permitted';
END;
$$;

-- Apply to critical tables
CREATE TRIGGER prevent_core_company_violations
  BEFORE INSERT OR UPDATE OR DELETE ON core_companies
  FOR EACH ROW
  EXECUTE FUNCTION security.detect_rls_violations();
```

## **8. Automated Policy Testing**

### **RLS Policy Test Suite**
```sql
CREATE OR REPLACE FUNCTION security.test_rls_policies()
RETURNS TABLE(test_name text, passed boolean, details jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_test_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_test_user_id uuid := '00000000-0000-0000-0000-000000000002';
  v_test_company_id uuid;
BEGIN
  -- Setup test data
  INSERT INTO organizations (id, name) 
  VALUES (v_test_org_id, 'Test Organization')
  ON CONFLICT DO NOTHING;
  
  -- Test 1: User cannot see other org's companies
  PERFORM set_config('request.jwt.claims', 
    jsonb_build_object(
      'app_metadata', jsonb_build_object(
        'organization_id', '00000000-0000-0000-0000-000000000999', -- Wrong org
        'user_role', 'user'
      )
    )::text, true);
  
  BEGIN
    SELECT id INTO v_test_company_id FROM core_companies LIMIT 1;
    RETURN QUERY SELECT 'Cross-org access blocked'::text, 
      (v_test_company_id IS NULL)::boolean,
      jsonb_build_object('found_id', v_test_company_id);
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Cross-org access blocked'::text, true, 
      jsonb_build_object('error', SQLERRM);
  END;
  
  -- Test 2: User with module permission can access module data
  -- ... more tests
  
  -- Cleanup
  PERFORM set_config('request.jwt.claims', '', true);
END;
$$;
```

## **9. Deployment Migration Script**

```sql
-- Complete RLS deployment script
DO $$
BEGIN
  -- 1. Create security schema
  CREATE SCHEMA IF NOT EXISTS security;
  
  -- 2. Enable required extensions
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  
  -- 3. Create audit tables
  CREATE TABLE IF NOT EXISTS security.rls_violation_log (...);
  CREATE TABLE IF NOT EXISTS security.emergency_audit (...);
  CREATE TABLE IF NOT EXISTS core_audit_log (...);
  
  -- 4. Apply RLS to all core tables
  PERFORM security.enable_rls_on_schema('public');
  
  -- 5. Apply RLS to all module schemas
  FOR module_schema IN 
    SELECT schema_name 
    FROM information_schema.schemata 
    WHERE schema_name LIKE 'mod_%'
  LOOP
    PERFORM security.enable_rls_on_schema(module_schema);
  END LOOP;
  
  -- 6. Create RPC functions
  PERFORM security.create_core_rpc_functions();
  
  -- 7. Run initial policy tests
  PERFORM security.test_rls_policies();
  
  RAISE NOTICE 'RLS deployment completed successfully';
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'RLS deployment failed: %', SQLERRM;
END $$;
```

## **10. Performance Optimization**

### **RLS Performance Indexes**
```sql
-- Indexes to speed up JWT claim lookups
CREATE INDEX idx_core_companies_org_active 
ON core_companies(organization_id) 
WHERE deleted_at IS NULL;

-- Partial index for module access checks
CREATE INDEX idx_installed_modules_active 
ON installed_modules(organization_id, module_id) 
WHERE is_active = true;

-- Covering index for common RLS patterns
CREATE INDEX idx_profiles_org_role 
ON profiles(organization_id, role) 
INCLUDE (id);
```

## **Summary of Security Guarantees**

| Security Goal | Implementation | Enforcement Level |
|--------------|----------------|------------------|
| **Core Truth Integrity** | RLS + RPC-only writes | Database + Application |
| **Module Isolation** | Schema-specific RLS policies | Database |
| **Audit Trail** | Automatic logging on all mutations | Database |
| **Emergency Access** | Break-glass functions with logging | Database + Monitoring |
| **Performance** | JWT claims + optimized indexes | Database |

This RLS implementation ensures that:
1. **Core data cannot be corrupted** by module code
2. **Modules are isolated** from each other
3. **All access is logged** for compliance
4. **Performance is maintained** through optimized patterns
5. **Emergency procedures exist** but are heavily audited

# **MIGRATION PATH & ACCESS PATTERN STRATEGY**

## **Challenge 1: Company Record Consolidation Mapping**

### **Current State Analysis**

You have **two distinct company-like entities** in different modules:
1. **Financial Resilience**: `financial_resilience_profiles` → `user_businesses`
2. **Acquisition Readiness**: `acquisition_readiness_profiles` → `auth.users`

### **Mapping Strategy: Three-Phase Approach**

#### **Phase 1: Entity Discovery & Normalization**

```sql
-- Step 1: Extract all business entities into staging with metadata
CREATE TEMPORARY TABLE company_candidates AS
SELECT 
  -- Financial Resilience Module
  'financial_resilience' AS source_module,
  fb.id AS legacy_id,
  ub.business_name AS raw_name,
  ub.tax_id,
  ub.business_type,
  u.email AS owner_email,
  ub.created_at,
  NULL AS acquisition_score,
  frp.risk_score AS resilience_score,
  jsonb_build_object(
    'user_id', u.id,
    'user_business_id', ub.id,
    'financial_data', frp.data
  ) AS legacy_metadata
FROM old_financial_db.user_businesses ub
JOIN old_financial_db.auth.users u ON ub.user_id = u.id
LEFT JOIN old_financial_db.financial_resilience_profiles frp ON ub.id = frp.user_business_id

UNION ALL

SELECT 
  -- Acquisition Readiness Module
  'acquisition_readiness' AS source_module,
  arp.id AS legacy_id,
  arp.company_name AS raw_name,
  arp.tax_identifier AS tax_id,
  arp.company_type AS business_type,
  u.email AS owner_email,
  arp.created_at,
  arp.acquisition_score,
  NULL AS resilience_score,
  jsonb_build_object(
    'user_id', u.id,
    'acquisition_data', arp.data
  ) AS legacy_metadata
FROM old_acquisition_db.acquisition_readiness_profiles arp
JOIN old_acquisition_db.auth.users u ON arp.user_id = u.id;
```

#### **Phase 2: Organization Creation Strategy**

**Option A: User-Centric Organizations** (Recommended for B2B SaaS)
```sql
-- Create one organization per user (common in B2B SaaS)
WITH user_orgs AS (
  SELECT DISTINCT 
    u.id AS user_id,
    u.email,
    MIN(u.created_at) AS user_created_at
  FROM (
    SELECT id, email, created_at FROM old_financial_db.auth.users
    UNION ALL
    SELECT id, email, created_at FROM old_acquisition_db.auth.users
  ) u
  GROUP BY u.id, u.email
)
INSERT INTO organizations (name, owner_email, created_at)
SELECT 
  COALESCE(
    -- Try to use user's first company name
    (SELECT raw_name FROM company_candidates 
     WHERE owner_email = u.email 
     ORDER BY created_at LIMIT 1),
    -- Fallback to email-based name
    split_part(u.email, '@', 1) || ' Organization'
  ),
  u.email,
  u.user_created_at
FROM user_orgs u;
```

**Option B: Business-Centric Organizations** (If users share businesses)
```sql
-- Create one organization per unique business
WITH business_clusters AS (
  SELECT 
    normalized_name,
    ARRAY_AGG(DISTINCT owner_email) AS owners,
    MIN(created_at) AS first_seen
  FROM company_candidates
  WHERE confidence_score > 0.9  -- High confidence duplicates
  GROUP BY normalized_name
  HAVING COUNT(DISTINCT owner_email) > 1
)
INSERT INTO organizations (name, created_at)
SELECT 
  normalized_name,
  first_seen
FROM business_clusters;
```

#### **Phase 3: Company-to-Organization Mapping Table**

```sql
-- Many-to-many relationship for shared companies
CREATE TABLE organization_companies (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  company_id UUID REFERENCES core_companies(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('owner', 'employee', 'viewer')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (organization_id, company_id)
);

-- Initial mapping: link companies to user's primary organization
INSERT INTO organization_companies (organization_id, company_id, relationship_type, is_primary)
SELECT 
  o.id AS organization_id,
  c.id AS company_id,
  'owner' AS relationship_type,
  true AS is_primary
FROM core_companies c
JOIN profiles p ON p.owner_email = c.owner_email
JOIN organizations o ON o.id = p.organization_id
WHERE c.deleted_at IS NULL;
```

### **Deduplication Rules Engine**

```sql
CREATE OR REPLACE FUNCTION deduplicate_companies()
RETURNS TABLE(
  action TEXT,
  canonical_id UUID,
  duplicate_ids UUID[],
  confidence DECIMAL
) AS $$
DECLARE
  threshold DECIMAL := 0.85;
BEGIN
  -- Rule 1: Exact tax_id match
  WITH exact_tax_matches AS (
    SELECT 
      tax_id,
      MIN(id) AS canonical_id,
      ARRAY_AGG(id) AS all_ids
    FROM staging_companies
    WHERE tax_id IS NOT NULL
      AND tax_id != ''
    GROUP BY tax_id
    HAVING COUNT(*) > 1
  )
  UPDATE staging_companies sc
  SET 
    duplicate_of = em.canonical_id,
    status = 'auto_merged'
  FROM exact_tax_matches em
  WHERE sc.tax_id = em.tax_id
    AND sc.id != em.canonical_id;
  
  -- Rule 2: Same email + similar name
  WITH email_name_matches AS (
    SELECT 
      owner_email,
      normalized_name,
      MIN(id) AS canonical_id,
      ARRAY_AGG(id) AS all_ids
    FROM staging_companies
    WHERE owner_email IS NOT NULL
      AND normalized_name IS NOT NULL
      AND id NOT IN (SELECT duplicate_of FROM staging_companies WHERE duplicate_of IS NOT NULL)
    GROUP BY owner_email, normalized_name
    HAVING COUNT(*) > 1
  )
  UPDATE staging_companies sc
  SET 
    duplicate_of = enm.canonical_id,
    status = 'auto_merged'
  FROM email_name_matches enm
  WHERE sc.owner_email = enm.owner_email
    AND sc.normalized_name = enm.normalized_name
    AND sc.id != enm.canonical_id;
    
  -- Return results for review
  RETURN QUERY
  SELECT 
    'auto_merged' AS action,
    canonical_id,
    all_ids AS duplicate_ids,
    1.0 AS confidence
  FROM exact_tax_matches
  UNION ALL
  SELECT 
    'auto_merged' AS action,
    canonical_id,
    all_ids AS duplicate_ids,
    0.95 AS confidence
  FROM email_name_matches;
END;
$$ LANGUAGE plpgsql;
```

## **Challenge 2: Frontend Access Pattern Refactoring**

### **Current vs. New Access Patterns**

```
BEFORE: Module-specific user IDs
  GET /api/financial/profile?user_business_id=:id
  GET /api/acquisition/profile?user_id=:id

AFTER: Organization-based with JWT claims
  GET /api/core/companies (auto-scoped by JWT organization)
  GET /api/module/:moduleId/data (auto-scoped by JWT)
```

### **Migration Layer: Backward Compatibility API**

```typescript
// Phase 1: Dual API Support (4-6 weeks)
class LegacyCompatibilityLayer {
  async getFinancialProfile(req: Request) {
    const { user_business_id } = req.query;
    
    // Convert old ID to new organization context
    const orgId = await this.mapLegacyIdToOrganization(user_business_id);
    
    // Verify user has access to this organization
    if (!this.hasAccess(req.user.jwt, orgId)) {
      throw new Error('Unauthorized');
    }
    
    // Query new database with organization context
    return await newDB.financial.getProfile({
      organization_id: orgId,
      company_id: await this.mapToCompanyId(user_business_id)
    });
  }
}

// Phase 2: Gradual Frontend Migration
const API_ADAPTER = {
  // Temporary adapter during migration
  getProfile: async (module: string, params: any) => {
    if (USE_NEW_API) {
      return await fetchNewAPI(`/api/${module}/profile`, {
        // Organization ID automatically from JWT
      });
    } else {
      return await fetchLegacyAPI(`/api/legacy/${module}/profile`, {
        user_id: getCurrentUserId(),
        user_business_id: getCurrentBusinessId()
      });
    }
  }
};
```

### **JWT Claim Transition Strategy**

```typescript
// Old JWT structure (module-specific)
const oldJWT = {
  sub: 'user_123',
  email: 'user@example.com',
  user_business_ids: ['bus_456', 'bus_789']
};

// New JWT structure (organization-centric)
const newJWT = {
  sub: 'user_123',
  email: 'user@example.com',
  app_metadata: {
    organization_id: 'org_abc',
    organization_ids: ['org_abc', 'org_def'], // Multiple orgs
    permissions: {
      'financial': ['viewer', 'editor'],
      'acquisition': ['viewer']
    }
  }
};

// Transition middleware
const jwtTransitionMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (isOldTokenFormat(token)) {
    // Convert old token claims to new format
    const oldClaims = decodeOldToken(token);
    const newClaims = await convertToNewClaims(oldClaims);
    
    // Issue new token with organization context
    const newToken = await issueNewToken(newClaims);
    
    // Set in response for client to update
    res.set('X-New-Token', newToken);
    
    // Continue with new claims
    req.user = newClaims;
  } else {
    // Already new format
    req.user = decodeNewToken(token);
  }
  
  next();
};
```

### **Frontend Refactoring Roadmap**

#### **Week 1-2: Foundation Components**
```typescript
// New context provider for organization
const OrganizationContext = createContext({
  currentOrg: null,
  organizations: [],
  switchOrganization: async (orgId) => {},
  hasPermission: (module, action) => false
});

// Hook to replace user_business_id usage
const useOrganization = () => {
  const { currentOrg } = useContext(OrganizationContext);
  
  return {
    organizationId: currentOrg?.id,
    companyIds: currentOrg?.companies || [],
    // Backward compatibility
    userBusinessId: currentOrg?.primaryCompany?.legacy_id,
    hasAccess: (module) => currentOrg?.permissions?.includes(module)
  };
};
```

#### **Week 3-4: API Service Migration**
```typescript
// BEFORE: Module-specific services
class FinancialService {
  async getProfile(userBusinessId: string) {
    return axios.get(`/financial/profile/${userBusinessId}`);
  }
}

// AFTER: Organization-scoped services
class NewFinancialService {
  constructor(private organizationId: string) {}
  
  async getProfile(companyId?: string) {
    return axios.get(`/api/financial/profile`, {
      params: { 
        organization_id: this.organizationId,
        company_id: companyId 
      }
    });
  }
}

// Transitional factory
const createService = (module: string) => {
  if (isNewAPIEnabled()) {
    return new NewModuleService(getCurrentOrganizationId());
  } else {
    return new LegacyModuleService(getLegacyUserBusinessId());
  }
};
```

#### **Week 5-6: Component Migration**
```typescript
// BEFORE: Component using legacy props
const FinancialDashboard = ({ userBusinessId }) => {
  const [data, setData] = useState();
  
  useEffect(() => {
    fetchFinancialData(userBusinessId).then(setData);
  }, [userBusinessId]);
  
  return <div>{/* render */}</div>;
};

// AFTER: Organization-aware component
const NewFinancialDashboard = () => {
  const { organizationId, companyIds } = useOrganization();
  const [data, setData] = useState();
  
  useEffect(() => {
    if (organizationId) {
      fetchFinancialData({ organizationId, companyIds }).then(setData);
    }
  }, [organizationId, companyIds]);
  
  return <div>{/* render */}</div>;
};
```

### **Access Control Transformation Matrix**

| Old Access Pattern | New Pattern | Migration Strategy |
|-------------------|-------------|-------------------|
| `user_id` → Module data | `organization_id` → Module data | JWT claim injection |
| `user_business_id` → Financial data | `company_id` + `organization_id` | ID mapping service |
| Direct table joins by user | RLS-scoped queries | Automatic via policies |
| Module-specific permissions | Centralized permission service | Permission consolidation |

### **Testing Strategy for Access Patterns**

```typescript
describe('Access Pattern Migration', () => {
  it('should return same data via old and new APIs', async () => {
    // Setup test user with legacy data
    const legacyData = await createLegacyUserWithBusiness();
    
    // Test old API
    const oldResult = await callOldAPI({
      user_business_id: legacyData.businessId
    });
    
    // Migrate to new structure
    const migrated = await migrateUser(legacyData.userId);
    
    // Test new API
    const newResult = await callNewAPI({
      organization_id: migrated.orgId
    });
    
    // Data should be equivalent
    expect(normalizeData(newResult)).toEqual(normalizeData(oldResult));
  });
  
  it('should enforce organization boundaries', async () => {
    const org1 = await createOrganization();
    const org2 = await createOrganization();
    
    // User in org1 tries to access org2 data
    const response = await callNewAPIAsUser(org1.user, {
      organization_id: org2.id // Attempt to override
    });
    
    expect(response.status).toBe(403); // Should be blocked by RLS
  });
});
```

### **Rollback Safeguards for Access Changes**

```sql
-- Audit table to track access pattern changes
CREATE TABLE access_pattern_migration (
  id UUID PRIMARY KEY,
  user_id UUID,
  old_pattern JSONB,
  new_pattern JSONB,
  migrated_at TIMESTAMPTZ,
  rollback_data JSONB,
  is_active BOOLEAN DEFAULT true
);

-- Quick rollback function
CREATE OR REPLACE FUNCTION rollback_access_pattern(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE access_pattern_migration
  SET is_active = false
  WHERE user_id = $1;
  
  -- Restore old JWT claims
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data - 'organization_id'
  WHERE id = $1;
  
  RAISE NOTICE 'Rolled back user % to legacy access patterns', user_id;
END;
$$ LANGUAGE plpgsql;
```

## **Critical Success Factors**

### **For Company Consolidation:**
1. **Preserve all legacy IDs** in `legacy_metadata` JSONB field
2. **Maintain audit trail** of all merges and decisions
3. **Allow manual override** for edge cases
4. **Validate data integrity** after each migration batch

### **For Access Pattern Migration:**
1. **Maintain backward compatibility** during transition
2. **Gradual rollout** by user segment
3. **Comprehensive testing** of permission boundaries
4. **Clear user communication** about organization concept

## **Risk Mitigation**

### **High-Risk Scenarios:**
1. **Lost data relationships** during company merge
   - *Mitigation*: Preserve all foreign keys in `legacy_metadata`
   
2. **Broken user access** during JWT transition
   - *Mitigation*: Dual-token system during migration
   
3. **Performance degradation** from RLS policies
   - *Mitigation*: Extensive load testing with production-like data

### **Monitoring During Migration:**
```sql
-- Real-time migration dashboard
CREATE VIEW migration_monitoring AS
SELECT 
  source_module,
  COUNT(*) as total_records,
  COUNT(CASE WHEN duplicate_of IS NOT NULL THEN 1 END) as merged,
  COUNT(CASE WHEN status = 'needs_review' THEN 1 END) as pending_review,
  COUNT(CASE WHEN organization_id IS NULL THEN 1 END) as unmapped
FROM staging_companies
GROUP BY source_module;
```

## **Communication to Development Team**

**Key Message:** "We're shifting from *user-centric* to *organization-centric* access patterns. Your code should ask 'what can this organization see?' not 'what can this user see?'"

**Training Points:**
1. Use `useOrganization()` hook instead of direct user ID
2. All API calls are now automatically scoped by JWT
3. Test with multiple organizations to ensure isolation
4. Permission checks are now module + action based

This strategy ensures a controlled, measurable migration with clear rollback options at every step. The phased approach minimizes disruption while achieving the architectural goals.

