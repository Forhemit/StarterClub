-- Migration: Leadership Structure Schema
-- Generated based on LeadershipDepartmentStructure.md
-- Includes foundational tables (partners, financial_entities) inferred from context

-- 0. Extensions & Helper Functions
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE OR REPLACE FUNCTION get_current_fiscal_period()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT to_char(CURRENT_DATE, 'YYYY-MM');
$$;

-- 1. Foundational Tables (Inferred)

-- Partners Table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE,
  partner_title text,
  partner_level text,
  economic_status text,
  system_role text DEFAULT 'member',
  primary_entity_id uuid, -- Will be FK to financial_entities
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Financial Entities Table
CREATE TABLE IF NOT EXISTS financial_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name text NOT NULL,
  entity_type text NOT NULL, -- 'room', 'program', 'membership', etc.
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Revenue Items
CREATE TABLE IF NOT EXISTS revenue_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_entity_id uuid REFERENCES financial_entities(id),
  amount numeric(12,2) NOT NULL DEFAULT 0,
  fiscal_period text NOT NULL,
  revenue_category text NOT NULL,
  payment_status text DEFAULT 'pending',
  exported_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Cost Items
CREATE TABLE IF NOT EXISTS cost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_entity_id uuid REFERENCES financial_entities(id),
  amount numeric(12,2) NOT NULL DEFAULT 0,
  fiscal_period text NOT NULL,
  cost_type text NOT NULL, -- 'direct', 'allocated', 'overhead'
  cost_category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Department definitions with required leadership levels
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core department info
  department_name text NOT NULL UNIQUE,
  department_code text NOT NULL UNIQUE,  -- e.g., 'people_culture', 'finance', 'operations'
  description text,
  
  -- Leadership requirements
  minimum_leadership_title text NOT NULL 
    CHECK (minimum_leadership_title IN (
      'Club Partner', 
      'Club Lead Partner', 
      'Senior Partner', 
      'Senior Lead Partner', 
      'Founder Partner'
    )),
    
  expected_leadership_title text,  -- What we expect at scale
  steward_department_code text REFERENCES departments(department_code),  -- Which department stewards this one
  
  -- Status
  is_active boolean DEFAULT true,
  can_have_multiple_leads boolean DEFAULT false,
  
  -- Metadata
  cultural_importance integer CHECK (cultural_importance BETWEEN 1 AND 10),  -- 10 = mission critical
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert the department definitions
INSERT INTO departments 
(department_name, department_code, minimum_leadership_title, expected_leadership_title, steward_department_code, cultural_importance) VALUES
-- Department Head Mapping
('People & Culture', 'people_culture', 'Senior Lead Partner', 'Senior Lead Partner', 'operations', 10),
('Finance & Accounting', 'finance', 'Senior Partner', 'Senior Partner', 'strategy_impact', 9),
('Operations & Administration', 'operations', 'Senior Lead Partner', 'Senior Lead Partner', 'people_culture', 10),
('Member Services', 'member_services', 'Club Lead Partner', 'Senior Partner', 'programs_curriculum', 8),
('Partner Services', 'partner_services', 'Senior Partner', 'Senior Partner', 'member_services', 9),
('Programs & Curriculum', 'programs_curriculum', 'Senior Lead Partner', 'Senior Lead Partner', 'growth', 10),
('Marketing & Growth', 'growth', 'Senior Partner', 'Senior Lead Partner', 'programs_curriculum', 8),
('Technology & Data', 'tech_data', 'Senior Partner', 'Senior Lead Partner', 'operations', 8),
('Legal & Compliance', 'legal', 'Senior Partner', 'Senior Partner', 'strategy_impact', 9),
('Strategy & Impact', 'strategy_impact', 'Founder Partner', 'Founder Partner', 'finance', 10)
ON CONFLICT (department_code) DO NOTHING;

-- 3. Enhanced partners table with department leadership
-- We already created the table above, now we add the columns
ALTER TABLE partners ADD COLUMN IF NOT EXISTS department_id uuid REFERENCES departments(id);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS steward_of_department_id uuid REFERENCES departments(id);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS is_department_lead boolean DEFAULT false;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS is_deputy_lead boolean DEFAULT false;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS leadership_scope text[];  -- ['team', 'department', 'function', 'program']

-- Performance Indexes (Recommended by Schema Designer Skill)
CREATE INDEX IF NOT EXISTS idx_partners_department_id ON partners(department_id);
CREATE INDEX IF NOT EXISTS idx_partners_steward_department_id ON partners(steward_of_department_id);

-- 4. Department leadership assignments with tenure tracking
CREATE TABLE IF NOT EXISTS department_leadership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  
  -- Leadership role
  leadership_role text NOT NULL 
    CHECK (leadership_role IN ('head', 'deputy', 'acting_head', 'steward')),
  
  -- Tenure
  effective_from date NOT NULL,
  effective_until date,
  
  -- Authorization levels (what they can approve/spend)
  budget_approval_limit numeric(12,2) DEFAULT 0,
  can_approve_hiring boolean DEFAULT false,
  can_approve_contracts boolean DEFAULT false,
  can_access_confidential_data boolean DEFAULT false,
  
  -- Delegation chain
  reports_to_leadership_id uuid REFERENCES department_leadership(id),  -- For deputies
  backup_leadership_id uuid REFERENCES department_leadership(id),
  
  -- Audit
  appointed_by uuid REFERENCES partners(id),
  appointment_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure no overlapping leadership for the same department
  EXCLUDE USING gist (
    department_id WITH =,
    partner_id WITH =,
    daterange(effective_from, effective_until, '[)') WITH &&
  ) WHERE (effective_until IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_dept_leadership_dept_partner ON department_leadership(department_id, partner_id);

-- 5. Financial accountability mapping
CREATE TABLE IF NOT EXISTS department_financial_accountability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  financial_entity_id uuid REFERENCES financial_entities(id) ON DELETE CASCADE,
  
  -- Type of accountability
  accountability_type text NOT NULL 
    CHECK (accountability_type IN (
      'revenue_owner', 
      'cost_owner', 
      'profit_center_owner',
      'shared_accountability',
      'stewardship'
    )),
  
  -- Responsibility level
  responsibility_pct numeric(5,2) DEFAULT 100.00,  -- For shared accountability
  is_primary_owner boolean DEFAULT true,
  
  -- Performance metrics tied to this accountability
  target_margin_pct numeric(5,2),
  target_revenue numeric(12,2),
  target_utilization_pct numeric(5,2),
  
  effective_from date NOT NULL,
  effective_until date,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(financial_entity_id, department_id, accountability_type)
);

CREATE INDEX IF NOT EXISTS idx_dept_fin_acc_dept_entity ON department_financial_accountability(department_id, financial_entity_id);

-- 6. Views

-- View: Partner Access by Department
CREATE OR REPLACE VIEW partner_access_by_department AS
SELECT 
  p.id as partner_id,
  p.full_name,
  p.partner_title,
  p.partner_level,
  p.economic_status,
  p.system_role,
  
  -- Department info
  d.department_name,
  d.department_code,
  dl.leadership_role,
  dl.budget_approval_limit,
  
  -- Access levels by role + department
  CASE 
    -- Founder Partner in Strategy & Impact
    WHEN p.partner_title = 'Founder Partner' AND d.department_code = 'strategy_impact' THEN 'executive_full_access'
    
    -- Department Heads
    WHEN dl.leadership_role = 'head' THEN 'department_full_access'
    WHEN dl.leadership_role = 'deputy' THEN 'department_limited_access'
    
    -- Stewards
    WHEN p.steward_of_department_id IS NOT NULL THEN 'stewardship_access'
    
    -- Senior Lead Partners in critical departments
    WHEN p.partner_title = 'Senior Lead Partner' AND d.cultural_importance >= 9 THEN 'strategic_department_access'
    
    -- Senior Partners with department assignments
    WHEN p.partner_title = 'Senior Partner' AND d.department_code IS NOT NULL THEN 'senior_department_access'
    
    -- Club Lead Partners
    WHEN p.partner_title = 'Club Lead Partner' THEN 'team_lead_access'
    
    -- Default for Club Partners
    ELSE 'member_access'
  END as department_access_level,
  
  -- Financial data access within department
  CASE 
    WHEN dl.leadership_role IN ('head', 'deputy') THEN 'full_department_financials'
    WHEN p.partner_title IN ('Senior Lead Partner', 'Senior Partner') THEN 'department_summary_financials'
    WHEN p.partner_title = 'Club Lead Partner' THEN 'team_financials'
    ELSE 'own_contributions_only'
  END as financial_data_access,
  
  -- Approval authorities
  COALESCE(dl.budget_approval_limit, 0) as can_approve_expenses_up_to,
  COALESCE(dl.can_approve_hiring, false) as can_approve_hiring,
  COALESCE(dl.can_approve_contracts, false) as can_approve_contracts,
  
  -- Data visibility
  CASE 
    WHEN p.partner_title IN ('Founder Partner', 'Senior Lead Partner') 
      OR dl.leadership_role = 'head'
      OR d.department_code = 'people_culture' AND p.partner_title = 'Senior Lead Partner'
    THEN 'full_team_performance'
    WHEN p.partner_title = 'Senior Partner' THEN 'direct_reports_only'
    ELSE 'own_performance_only'
  END as team_performance_visibility,
  
  -- Department stewardship visibility
  CASE 
    WHEN p.steward_of_department_id IS NOT NULL THEN (
      SELECT jsonb_build_object(
        'department', steward_department.department_name,
        'access_level', 'stewardship_review',
        'can_override', p.partner_title IN ('Founder Partner', 'Senior Lead Partner')
      )
      FROM departments steward_department
      WHERE steward_department.id = p.steward_of_department_id
    )
    ELSE NULL
  END as stewardship_access_info

FROM partners p
LEFT JOIN departments d ON p.department_id = d.id
LEFT JOIN department_leadership dl ON p.id = dl.partner_id 
  AND dl.department_id = d.id 
  AND dl.leadership_role = 'head' 
  AND dl.effective_until IS NULL
WHERE p.is_active = true;

-- View: Department Entities (Promoted to View for reusability)
CREATE OR REPLACE VIEW department_entities AS
SELECT 
  dfa.department_id,
  d.department_name,
  d.department_code,
  fe.id as entity_id,
  fe.entity_name,
  fe.entity_type,
  dfa.accountability_type,
  dfa.responsibility_pct
FROM department_financial_accountability dfa
JOIN departments d ON dfa.department_id = d.id
JOIN financial_entities fe ON dfa.financial_entity_id = fe.id
WHERE dfa.effective_until IS NULL 
  OR dfa.effective_until > CURRENT_DATE;

-- View: Department P&L Statements
CREATE OR REPLACE VIEW department_pl_statement AS
WITH department_revenue AS (
  SELECT 
    de.department_id,
    de.department_name,
    ri.fiscal_period,
    SUM(ri.amount * de.responsibility_pct / 100) as revenue_amount,
    COUNT(DISTINCT ri.id) as revenue_transaction_count
  FROM department_entities de
  JOIN revenue_items ri ON de.entity_id = ri.financial_entity_id
  WHERE ri.payment_status = 'paid'
  GROUP BY de.department_id, de.department_name, ri.fiscal_period
),
department_costs AS (
  SELECT 
    de.department_id,
    de.department_name,
    ci.fiscal_period,
    SUM(ci.amount * de.responsibility_pct / 100) as cost_amount,
    COUNT(DISTINCT ci.id) as cost_transaction_count,
    ci.cost_type,
    ci.cost_category
  FROM department_entities de
  JOIN cost_items ci ON de.entity_id = ci.financial_entity_id
  GROUP BY de.department_id, de.department_name, ci.fiscal_period, ci.cost_type, ci.cost_category
)
SELECT 
  dr.department_id,
  dr.department_name,
  dr.fiscal_period,
  
  -- Revenue
  dr.revenue_amount,
  dr.revenue_transaction_count,
  
  -- Costs by type
  SUM(CASE WHEN dc.cost_type = 'direct' THEN dc.cost_amount ELSE 0 END) as direct_costs,
  SUM(CASE WHEN dc.cost_type = 'allocated' THEN dc.cost_amount ELSE 0 END) as allocated_costs,
  SUM(CASE WHEN dc.cost_type = 'overhead' THEN dc.cost_amount ELSE 0 END) as overhead_costs,
  
  -- Total costs
  COALESCE(SUM(dc.cost_amount), 0) as total_costs,
  
  -- Net
  dr.revenue_amount - COALESCE(SUM(dc.cost_amount), 0) as net_profit,
  
  -- Margins
  CASE 
    WHEN dr.revenue_amount > 0 
    THEN ((dr.revenue_amount - COALESCE(SUM(dc.cost_amount), 0)) / dr.revenue_amount * 100)
    ELSE 0 
  END as profit_margin_pct,
  
  -- Cost breakdown by category
  jsonb_object_agg(
    COALESCE(dc.cost_category, 'none'),
    jsonb_build_object(
      'amount', COALESCE(dc.cost_amount, 0),
      'type', dc.cost_type
    )
  ) FILTER (WHERE dc.cost_category IS NOT NULL) as costs_by_category

FROM department_revenue dr
LEFT JOIN department_costs dc ON dr.department_id = dc.department_id 
  AND dr.fiscal_period = dc.fiscal_period
GROUP BY dr.department_id, dr.department_name, dr.fiscal_period, 
         dr.revenue_amount, dr.revenue_transaction_count;

-- View: Department Head Dashboard
CREATE OR REPLACE VIEW department_head_dashboard AS
SELECT 
  p.id as partner_id,
  p.full_name as department_head,
  p.partner_title,
  d.department_name,
  d.department_code,
  
  -- Current period performance
  dpl.fiscal_period,
  dpl.revenue_amount,
  dpl.total_costs,
  dpl.net_profit,
  dpl.profit_margin_pct,
  
  -- Department health metrics
  (
    SELECT COUNT(DISTINCT de.entity_id)
    FROM department_entities de
    WHERE de.department_id = d.id
  ) as entities_under_management,
  
  -- Team metrics
  (
    SELECT COUNT(DISTINCT p2.id)
    FROM partners p2
    WHERE p2.department_id = d.id 
      AND p2.is_active = true
  ) as team_size,
  
  -- Budget utilization
  (
    SELECT COALESCE(SUM(ci.amount), 0)
    FROM cost_items ci
    JOIN department_entities de ON ci.financial_entity_id = de.entity_id
    WHERE de.department_id = d.id
      AND ci.fiscal_period = dpl.fiscal_period
      AND ci.cost_type = 'direct'
  ) as direct_spend,
  
  -- Compliance metrics
  (
    SELECT COUNT(*)
    FROM revenue_items ri
    JOIN department_entities de ON ri.financial_entity_id = de.entity_id
    WHERE de.department_id = d.id
      AND ri.fiscal_period = dpl.fiscal_period
      AND ri.exported_at IS NULL
  ) as pending_financial_exports,
  
  -- Leadership tenure
  EXTRACT(MONTH FROM age(CURRENT_DATE, dl.effective_from)) as months_as_lead

FROM partners p
JOIN departments d ON p.department_id = d.id
JOIN department_leadership dl ON p.id = dl.partner_id 
  AND dl.department_id = d.id 
  AND dl.leadership_role = 'head'
  AND dl.effective_until IS NULL
LEFT JOIN department_pl_statement dpl ON d.id = dpl.department_id 
  AND dpl.fiscal_period = get_current_fiscal_period()
WHERE p.is_active = true;

-- 7. Department OKRs
CREATE TABLE IF NOT EXISTS department_okrs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  fiscal_period text NOT NULL,
  
  -- Objective
  objective text NOT NULL,
  objective_type text NOT NULL 
    CHECK (objective_type IN ('financial', 'operational', 'cultural', 'growth', 'quality')),
  
  -- Key Results
  key_results jsonb NOT NULL,  -- [{"description": "Achieve 25% margin", "target": 25, "current": 18, "weight": 0.5}, ...]
  
  -- Accountability
  accountable_partner_id uuid REFERENCES partners(id),
  contributing_partner_ids uuid[],  -- Partners contributing to this OKR
  
  -- Status
  progress_pct numeric(5,2) DEFAULT 0,
  status text DEFAULT 'on_track' 
    CHECK (status IN ('on_track', 'at_risk', 'off_track', 'achieved', 'abandoned')),
  
  -- Review cycle
  last_reviewed_at timestamptz,
  next_review_due timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- View: Department Scorecard
CREATE OR REPLACE VIEW department_scorecard AS
SELECT 
  d.id as department_id,
  d.department_name,
  d.department_code,
  d.minimum_leadership_title,
  d.cultural_importance,
  
  -- Leadership
  p.full_name as department_head,
  p.partner_title as head_title,
  dl.months_as_lead,
  
  -- Financial Performance
  dpl.fiscal_period,
  dpl.revenue_amount,
  dpl.net_profit,
  dpl.profit_margin_pct,
  
  -- Performance vs Target
  CASE 
    WHEN dpl.profit_margin_pct >= 20 THEN 'exceeding'
    WHEN dpl.profit_margin_pct >= 10 THEN 'meeting'
    ELSE 'below'
  END as margin_performance,
  
  -- Operational Metrics
  (
    SELECT COUNT(*) 
    FROM department_okrs dokr 
    WHERE dokr.department_id = d.id 
      AND dokr.fiscal_period = dpl.fiscal_period
      AND dokr.status = 'achieved'
  ) as okrs_achieved,
  
  (
    SELECT COUNT(*) 
    FROM department_okrs dokr 
    WHERE dokr.department_id = d.id 
      AND dokr.fiscal_period = dpl.fiscal_period
  ) as total_okrs,
  
  -- Team Health
  (
    SELECT COUNT(DISTINCT p2.id)
    FROM partners p2
    WHERE p2.department_id = d.id 
      AND p2.is_active = true
  ) as active_team_size,
  
  -- Contributions assumed 0
  0 as monthly_contributions,
  
  -- Risk Indicators
  CASE 
    WHEN dpl.profit_margin_pct < 5 THEN 'financial_risk'
    WHEN (
      SELECT COUNT(*) 
      FROM department_okrs dokr 
      WHERE dokr.department_id = d.id 
        AND dokr.fiscal_period = dpl.fiscal_period
        AND dokr.status = 'off_track'
    ) > 2 THEN 'operational_risk'
    WHEN dl.months_as_lead < 3 THEN 'leadership_transition'
    ELSE 'stable'
  END as risk_indicator,
  
  -- Stewardship Status
  COALESCE((
    SELECT ds.department_name
    FROM departments ds
    WHERE ds.department_code = d.steward_department_code
  ), 'None') as stewarded_by,
  
  -- Overall Score
  (
    (COALESCE(dpl.profit_margin_pct,0) / 25 * 0.4) +
    (
      SELECT COALESCE(AVG(dokr.progress_pct / 100), 0)
      FROM department_okrs dokr
      WHERE dokr.department_id = d.id
        AND dokr.fiscal_period = dpl.fiscal_period
    ) * 0.3 +
    (
      CASE 
        WHEN dl.months_as_lead < 3 THEN 0.7
        ELSE 1.0
      END -- Simplified risk logic for score
    ) * 0.2 +
    (d.cultural_importance::numeric / 10 * 0.1)
  ) as overall_score

FROM departments d
LEFT JOIN department_pl_statement dpl ON d.id = dpl.department_id 
  AND dpl.fiscal_period = get_current_fiscal_period()
LEFT JOIN (
  SELECT DISTINCT ON (department_id) 
    department_id,
    partner_id,
    EXTRACT(MONTH FROM age(CURRENT_DATE, effective_from)) as months_as_lead
  FROM department_leadership
  WHERE leadership_role = 'head' 
    AND effective_until IS NULL
  ORDER BY department_id, effective_from DESC
) dl ON d.id = dl.department_id
LEFT JOIN partners p ON dl.partner_id = p.id
WHERE d.is_active = true;
