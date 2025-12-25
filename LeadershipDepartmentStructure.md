
We are integrating the department leadership structure with the existing financial system and partner ladder. The goal is to align access, accountability, and financial data with the partner's role and department.

Steps:

Extend the partners table to include department and stewardship information.

Adjust access controls based on department and stewardship.

Create views and functions for department-level financial reporting.

Ensure that the financial system respects the department head's authority and stewardship.

Let's break it down.

Step 1: Extend the partners table.

We already have a partners table. We'll add:

department: the department they are in (or head).

steward_of: the department they are a steward of (if any). Stewards are responsible for overseeing another department's alignment with the mission and culture.

Step 2: Adjust access controls.

We already have a system_role and partner_title in the partners table. We will now also consider the department and stewardship.

Step 3: Department-level financial reporting.

We'll create a view that aggregates financial data by department, and then by entity within the department.

Step 4: Access control by department.

We want to ensure that:

A department head can see all financial data for their department.

A steward can see high-level financial data for the department they steward, but not necessarily the same level of detail as the department head.

However, note that our financial data is tied to financial_entities (rooms, workstations, etc.) and not directly to departments. So we need to map entities to departments.

We have a few options:

Option A: Add a department field to financial_entities to assign each entity to a department.
Option B: Create a mapping table between entities and departments.

Since an entity might be shared by multiple departments? Probably not. Let's assume each entity belongs to one department. We'll add a department field to financial_entities.

But wait, the departments are about functions (People & Culture, Finance, etc.) and the entities are revenue/cost centers (rooms, memberships, etc.). They are different.

We need to think: How do we want to report by department?

Actually, we have two axes:

Operational departments (like Member Services, Programs) that are responsible for certain entities.

Support departments (like Finance, Operations) that have costs but not necessarily direct revenue.

We want to track the performance of operational departments by the entities they manage, and track the costs of support departments.

So, let's do:

In financial_entities, we can have a department field that indicates which operational department is responsible for this entity (if it's a revenue-generating entity). For support departments, we might not have revenue-generating entities, but we can still track their costs.

Alternatively, we can have a department_responsibility table that maps entities to departments. This allows an entity to be the responsibility of multiple departments? Maybe not, let's keep it simple: one entity, one responsible department.

We'll add:

text
  department text  -- e.g., 'Member Services', 'Programs & Curriculum', etc.
to the financial_entities table.

Then, when we want to see the financials for a department, we can aggregate the entities that belong to that department.

Also, we want to track the costs of support departments. We can do that by having cost items that are allocated to a department (without a specific entity). We can add a department field to cost_items as well, and then when we do department P&L, we sum the revenue from the entities in the department and the costs allocated to the department.

However, note that in the current system, costs are allocated to entities (via financial_entity_id). So we might not need a department field in cost_items because we can aggregate by the entity's department.

Let's adjust:

Step 1: Add department to financial_entities.

Step 2: When we want to see department P&L, we:

text
    - Get all entities in that department.
    - Sum the revenue and costs for those entities.
But what about costs that are not allocated to a specific entity (like overhead)? They are allocated to entities via the allocation system. So then they become part of the entity's costs and thus the department's.

So, we don't need to change the cost_items table. We just need to know which entity belongs to which department.

However, note that in the partners table, we have a primary_entity_id. That might be the entity they are primarily responsible for. But a department head is responsible for multiple entities.

We'll create a department_entities table to map entities to departments, or just use the department field in financial_entities.

Let's go with adding a department field to financial_entities:

text
  ALTER TABLE financial_entities ADD COLUMN department text;
We can then create a view for department P&L.

Step 3: Create a view for department P&L.

We'll create a view that aggregates the entity_pl_statement by department.

Step 4: Adjust access controls.

We want to allow department heads to see the P&L for their department. We can do this by:

text
  - In the `partners` table, we have a `department` field (the department they head). We can also have a `steward_of` field (the department they steward).

  We'll add:

      department text,  -- the department they are in (or head)
      steward_of text   -- the department they steward (if any)

  Then, when a partner logs in, we can check:

      If they are a department head, they can see all entities in their department and the department P&L.

      If they are a steward, they can see the department P&L for the department they steward, but not necessarily the entity-level details.
Let's create the views and functions accordingly.

Implementation:

Update the partners table:

ALTER TABLE partners ADD COLUMN department text;
ALTER TABLE partners ADD COLUMN steward_of text;

Update the financial_entities table:

ALTER TABLE financial_entities ADD COLUMN department text;

Create a view for department P&L:

We'll aggregate the entity_pl_statement by department and fiscal_period.

Create a function to get the department P&L for a given department and period.

Adjust the access control function get_accessible_entities to take into account the partner's department and steward_of.

Let's write the SQL for the department P&L view and the updated access control.

However, note: The department head might not have a primary_entity_id because they are responsible for the entire department. So we need to adjust the access control to allow them to see all entities in their department.

We'll update the get_accessible_entities function to also return entities that are in the same department as the partner, if the partner is a department head (based on their department field) or if they are a steward (based on steward_of).

Let's create the department P&L view:

text
CREATE VIEW department_pl_statement AS
SELECT 
    fe.department,
    pl.fiscal_period,
    
    -- Aggregated metrics
    COUNT(DISTINCT pl.entity_id) as entity_count,
    SUM(pl.total_revenue) as total_revenue,
    SUM(pl.total_costs) as total_costs,
    SUM(pl.net_profit) as net_profit,
    
    -- Average margin
    AVG(pl.profit_margin_pct) as avg_profit_margin_pct,
    
    -- Revenue by category (aggregated)
    jsonb_object_agg(
        pl.revenue_category, 
        pl.revenue_by_category
    ) as revenue_by_category,
    
    -- Costs by category (aggregated)
    jsonb_object_agg(
        pl.cost_category, 
        pl.costs_by_category
    ) as costs_by_category
    
FROM entity_pl_statement pl
JOIN financial_entities fe ON pl.entity_id = fe.id
WHERE fe.department IS NOT NULL
GROUP BY fe.department, pl.fiscal_period;
But note: The entity_pl_statement view already has revenue_by_category and costs_by_category as JSONB. We are aggregating them again? We might want to sum by category across entities.

Alternatively, we can break down the revenue and costs by category in a more structured way. Let's change the view to have separate columns for each revenue and cost category? Or we can keep it as JSONB and aggregate by summing the values for each category.

We'll do:

text
    revenue_by_category: for each category, sum the revenue across entities.
We can use the following to aggregate:

text
    WITH revenue_categories AS (
        SELECT 
            fe.department,
            pl.fiscal_period,
            key as category,
            SUM(value::numeric) as revenue
        FROM entity_pl_statement pl
        JOIN financial_entities fe ON pl.entity_id = fe.id
        CROSS JOIN jsonb_each_text(pl.revenue_by_category)
        GROUP BY fe.department, pl.fiscal_period, key
    )
    ... but this might be complex.
Alternatively, we can create a view that breaks down the revenue and costs by category and department.

Let's create a more detailed view for department P&L:

text
CREATE VIEW department_pl_detailed AS
SELECT 
    fe.department,
    pl.fiscal_period,
    
    -- Revenue by category
    SUM(CASE WHEN ri.revenue_category = 'room_rental' THEN ri.amount ELSE 0 END) as room_rental_revenue,
    SUM(CASE WHEN ri.revenue_category = 'membership_dues' THEN ri.amount ELSE 0 END) as membership_dues_revenue,
    -- ... add other categories as needed
    SUM(ri.amount) as total_revenue,
    
    -- Costs by category
    SUM(CASE WHEN ci.cost_category = 'utilities' THEN ci.amount ELSE 0 END) as utilities_cost,
    -- ... add other cost categories
    SUM(ci.amount) as total_costs

FROM financial_entities fe
LEFT JOIN revenue_items ri ON fe.id = ri.financial_entity_id
LEFT JOIN cost_items ci ON fe.id = ci.financial_entity_id
WHERE fe.department IS NOT NULL
GROUP BY fe.department, pl.fiscal_period;
But note: The entity_pl_statement view already does the revenue and cost aggregation per entity. We can use that and then aggregate by department.

We'll do:

text
CREATE VIEW department_pl_statement AS
SELECT 
    fe.department,
    pl.fiscal_period,
    COUNT(DISTINCT pl.entity_id) as entity_count,
    SUM(pl.total_revenue) as total_revenue,
    SUM(pl.total_costs) as total_costs,
    SUM(pl.net_profit) as net_profit,
    CASE 
        WHEN SUM(pl.total_revenue) > 0 
        THEN (SUM(pl.net_profit) / SUM(pl.total_revenue)) * 100 
        ELSE 0 
    END as profit_margin_pct,
    
    -- For revenue by category, we need to break the JSONB and aggregate
    -- We'll do that in a separate view if needed, or we can use the entity_pl_statement's JSONB and aggregate by key.

FROM entity_pl_statement pl
JOIN financial_entities fe ON pl.entity_id = fe.id
WHERE fe.department IS NOT NULL
GROUP BY fe.department, pl.fiscal_period;
For the revenue and cost breakdown by category, we can create a separate view or use the JSONB aggregation.

However, note that the entity_pl_statement view already has the breakdown per entity. We want to aggregate these breakdowns by department.

We can use:

text
    jsonb_object_agg(
        category, 
        SUM(amount)
    ) 
But we don't have the breakdown in a structured way in the entity_pl_statement. We have JSONB.

Alternatively, we can break the JSONB in the entity_pl_statement and then aggregate.

Let's create a function to get the department P&L with breakdowns, or we can create a view that breaks down the revenue and costs by category for each department.

We'll create a view for department revenue by category:

text
CREATE VIEW department_revenue_by_category AS
SELECT 
    fe.department,
    ri.revenue_category,
    ri.fiscal_period,
    SUM(ri.amount) as amount
FROM revenue_items ri
JOIN financial_entities fe ON ri.financial_entity_id = fe.id
WHERE fe.department IS NOT NULL
GROUP BY fe.department, ri.revenue_category, ri.fiscal_period;
Similarly for costs:

text
CREATE VIEW department_costs_by_category AS
SELECT 
    fe.department,
    ci.cost_category,
    ci.fiscal_period,
    SUM(ci.amount) as amount
FROM cost_items ci
JOIN financial_entities fe ON ci.financial_entity_id = fe.id
WHERE fe.department IS NOT NULL
GROUP BY fe.department, ci.cost_category, ci.fiscal_period;
Then, we can use these views to build the department P&L with breakdowns.

But for now, let's focus on the access control.

We'll update the get_accessible_entities function to include department-based access.

The new logic:

text
- If the partner is a department head (their `department` field matches the entity's `department`), then they get 'full' access to that entity.
- If the partner is a steward of a department (their `steward_of` matches the entity's `department`), then they get 'view_only' access to that entity.
We'll adjust the function accordingly.

Let's update the get_accessible_entities function:

text
We'll add two conditions in the CASE statement for `access_level`:

    WHEN p.department = fe.department THEN 'full'
    WHEN p.steward_of = fe.department THEN 'view_only'
We also need to adjust the can_view and can_edit logic.

We'll do:

text
    can_view: 
        ... OR p.department = fe.department OR p.steward_of = fe.department

    can_edit:
        ... OR (p.department = fe.department AND p.partner_title IN ('Senior Lead Partner', 'Senior Partner', 'Founder Partner'))
But note: The department head might be a Club Lead Partner for Member Services? Then they should be able to edit. So we don't want to restrict by title in the department head condition.

Actually, the can_edit should be based on the system_role and the department head condition.

We'll set:

text
    can_edit: 
        pa.system_access_level IN ('full_system', 'founder_access') 
        OR pa.system_role = 'manager'
        OR (p.department = fe.department AND p.partner_title IN ('Club Lead Partner', 'Senior Partner', 'Senior Lead Partner', 'Founder Partner'))
But wait, the department head might be a Club Lead Partner (for Member Services). So we include 'Club Lead Partner'.

Now, let's write the updated function.

We'll also create a function to get the department P&L for a partner based on their department or stewardship.

We'll create:

text
    get_department_pl(p_partner_id, p_fiscal_period)
This function will return the department P&L for the department the partner heads or stewards.

Let's implement step by step.

Due to the complexity, I'll write the SQL for the updated get_accessible_entities and the new get_department_pl function.

However, note that the get_accessible_entities function is already complex. We might want to refactor it.

Alternatively, we can create a new function for department heads and stewards.

Let's create a new function get_department_accessible_entities that returns the entities for a department head or steward.

But to avoid breaking existing functionality, we'll update the existing function.

Due to time, I'll provide the updated get_accessible_entities function and the get_department_pl function.

Note: This is a simplified version. We might need to adjust.

Let's write the updated get_accessible_entities function:

sql
CREATE OR REPLACE FUNCTION get_accessible_entities(p_partner_id uuid)
RETURNS TABLE (
  entity_id uuid,
  entity_name text,
  entity_type text,
  access_level text,
  can_view boolean,
  can_edit boolean
) SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH partner_info AS (
    SELECT * FROM partner_access_matrix WHERE partner_id = p_partner_id
  ),
  partner_details AS (
    SELECT * FROM partners WHERE id = p_partner_id
  )
  SELECT 
    fe.id,
    fe.entity_name,
    fe.entity_type,
    
    CASE 
      WHEN pa.system_access_level = 'full_system' THEN 'full'
      WHEN pa.entity_access_scope = 'all_entities' THEN 'full'
      WHEN pa.entity_access_scope = 'assigned_plus_same_type' 
        AND (fe.id = pd.primary_entity_id OR fe.entity_type = (
          SELECT entity_type FROM financial_entities 
          WHERE id = pd.primary_entity_id
        )) THEN 'full'
      WHEN pa.entity_access_scope = 'assigned_plus_team' 
        AND (fe.id = pd.primary_entity_id OR EXISTS (
          SELECT 1 FROM partners p2 
          WHERE p2.primary_entity_id = fe.id 
          AND p2.id = p_partner_id  -- Simplified: same entity
        )) THEN 'full'
      WHEN fe.id = pd.primary_entity_id THEN 'full'
      -- New conditions for department head and steward
      WHEN pd.department = fe.department THEN 'full'
      WHEN pd.steward_of = fe.department THEN 'view_only'
      ELSE 'view_only'
    END as access_level,
    
    -- Can view?
    CASE 
      WHEN pa.system_access_level IN ('full_system', 'founder_access') THEN true
      WHEN pa.financial_access_level IN ('full_financial', 'strategic_financial') THEN true
      WHEN fe.id = pd.primary_entity_id THEN true
      WHEN pa.entity_access_scope IN ('assigned_plus_same_type', 'assigned_plus_team') 
        AND EXISTS (SELECT 1 FROM get_entity_relationships(fe.id, pd.primary_entity_id)) THEN true
      -- New conditions for department head and steward
      WHEN pd.department = fe.department THEN true
      WHEN pd.steward_of = fe.department THEN true
      ELSE false
    END as can_view,
    
    -- Can edit?
    pa.system_access_level IN ('full_system', 'founder_access') 
    OR pa.system_role = 'manager'
    OR (pa.partner_title = 'Club Lead Partner' AND fe.id = pd.primary_entity_id)
    OR (pd.department = fe.department AND pd.partner_title IN ('Club Lead Partner', 'Senior Partner', 'Senior Lead Partner', 'Founder Partner'))
    as can_edit
    
  FROM financial_entities fe
  CROSS JOIN partner_info pa
  CROSS JOIN partner_details pd
  WHERE fe.status = 'active'
  ORDER BY fe.entity_type, fe.entity_name;
END;
$$ LANGUAGE plpgsql;
Now, let's create the get_department_pl function:

sql
CREATE OR REPLACE FUNCTION get_department_pl(p_partner_id uuid, p_fiscal_period text)
RETURNS TABLE (
  department text,
  fiscal_period text,
  entity_count bigint,
  total_revenue numeric,
  total_costs numeric,
  net_profit numeric,
  profit_margin_pct numeric
) SECURITY DEFINER AS $$
DECLARE
  v_department text;
BEGIN
  -- Get the department the partner heads or stewards
  SELECT 
    COALESCE(p.department, p.steward_of) 
  INTO v_department
  FROM partners p
  WHERE p.id = p_partner_id;

  IF v_department IS NULL THEN
    RETURN; -- No department assigned
  END IF;

  RETURN QUERY
  SELECT 
    d.department,
    d.fiscal_period,
    d.entity_count,
    d.total_revenue,
    d.total_costs,
    d.net_profit,
    d.profit_margin_pct
  FROM department_pl_statement d
  WHERE d.department = v_department
    AND d.fiscal_period = p_fiscal_period;
END;
$$ LANGUAGE plpgsql;
We'll also create the department_pl_statement view as described above.

However, note that the department_pl_statement view we defined earlier uses the entity_pl_statement view, which we have. We just need to add the department field to financial_entities and then update the view.

Let's create the view:

sql
CREATE VIEW department_pl_statement AS
SELECT 
  fe.department,
  pl.fiscal_period,
  COUNT(DISTINCT pl.entity_id) as entity_count,
  SUM(pl.total_revenue) as total_revenue,
  SUM(pl.total_costs) as total_costs,
  SUM(pl.net_profit) as net_profit,
  CASE 
    WHEN SUM(pl.total_revenue) > 0 
    THEN (SUM(pl.net_profit) / SUM(pl.total_revenue)) * 100 
    ELSE 0 
  END as profit_margin_pct
FROM entity_pl_statement pl
JOIN financial_entities fe ON pl.entity_id = fe.id
WHERE fe.department IS NOT NULL
GROUP BY fe.department, pl.fiscal_period;
We'll also create the department_revenue_by_category and department_costs_by_category views for more detailed breakdowns.

This is a starting point. We can adjust as needed.

Finally, we need to update the partner_access_matrix view to include department and steward_of information.

We'll update the partner_access_matrix view to include:

text
    department,
    steward_of
And adjust the logic for system_access_level and financial_access_level based on department head or steward status.

However, note that the partner_access_matrix view is used in the get_accessible_entities function. We are now using the partners table directly in that function, so we don't need to change the view for that.

But we might want to update the partner_access_matrix view to reflect the department-based access for other uses.

We'll leave the partner_access_matrix view as is for now, and rely on the partners table for department information.

We'll now update the partners table with the new columns and then update the existing partners with their department and steward_of information.

This is a major change, so we should do it in a controlled manner, perhaps in a migration script.

Let's write the migration:

sql
-- Step 1: Add columns to partners
ALTER TABLE partners ADD COLUMN department text;
ALTER TABLE partners ADD COLUMN steward_of text;

-- Step 2: Add column to financial_entities
ALTER TABLE financial_entities ADD COLUMN department text;

-- Step 3: Create the new views
CREATE VIEW department_pl_statement AS ...;

-- Step 4: Create the detailed category views (optional)
CREATE VIEW department_revenue_by_category AS ...;
CREATE VIEW department_costs_by_category AS ...;

-- Step 5: Update the get_accessible_entities function
CREATE OR REPLACE FUNCTION get_accessible_entities ...;

-- Step 6: Create the get_department_pl function
CREATE OR REPLACE FUNCTION get_department_pl ...;
We'll also need to update the PartnerDashboard class in Python to use the new department-based functions.

This is a significant integration. We have laid the groundwork. The actual implementation will require careful testing and adjustment.

Let me know if you need further details on any specific part.

This is excellent! The department-to-ladder mapping is thoughtful and realistic. Let me integrate this with our system to ensure proper alignment between roles, departments, access, and accountability.

1. Enhanced Partner Schema with Department Leadership
sql
-- Department definitions with required leadership levels
CREATE TABLE departments (
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

-- Insert the department definitions from your framework
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
('Strategy & Impact', 'strategy_impact', 'Founder Partner', 'Founder Partner', 'finance', 10);

-- Enhanced partners table with department leadership
ALTER TABLE partners ADD COLUMN department_id uuid REFERENCES departments(id);
ALTER TABLE partners ADD COLUMN steward_of_department_id uuid REFERENCES departments(id);
ALTER TABLE partners ADD COLUMN is_department_lead boolean DEFAULT false;
ALTER TABLE partners ADD COLUMN is_deputy_lead boolean DEFAULT false;
ALTER TABLE partners ADD COLUMN leadership_scope text[];  -- ['team', 'department', 'function', 'program']

-- Department leadership assignments with tenure tracking
CREATE TABLE department_leadership (
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

-- Financial accountability mapping: Which departments are accountable for which financial entities
CREATE TABLE department_financial_accountability (
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
2. Department-Based Access Control Matrix
sql
-- View: What each partner can access based on title + department leadership
CREATE VIEW partner_access_by_department AS
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
  AND dl.effective_until IS NULL
WHERE p.is_active = true;
3. Enhanced Financial Views with Department Accountability
sql
-- View: Department P&L Statements
CREATE VIEW department_pl_statement AS
WITH department_entities AS (
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
    OR dfa.effective_until > CURRENT_DATE
),
department_revenue AS (
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

-- View: Department Head Dashboard Metrics
CREATE VIEW department_head_dashboard AS
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
4. Department-Specific Financial Controls
python
from decimal import Decimal
from typing import Dict, Optional
from enum import Enum

class DepartmentCode(Enum):
    PEOPLE_CULTURE = "people_culture"
    FINANCE = "finance"
    OPERATIONS = "operations"
    MEMBER_SERVICES = "member_services"
    PARTNER_SERVICES = "partner_services"
    PROGRAMS_CURRICULUM = "programs_curriculum"
    GROWTH = "growth"
    TECH_DATA = "tech_data"
    LEGAL = "legal"
    STRATEGY_IMPACT = "strategy_impact"

class DepartmentFinancialController:
    """Department-specific financial controls based on leadership ladder"""
    
    def __init__(self, partner_id: uuid):
        self.partner_id = partner_id
        self.access_info = self._get_partner_access_info()
        self.department = self._get_department_info()
        
    def can_approve_expense(self, expense_amount: Decimal, expense_type: str) -> Dict:
        """Check if partner can approve an expense based on department role"""
        
        approval_matrix = {
            DepartmentCode.PEOPLE_CULTURE: {
                "Club Partner": {"limit": Decimal("100"), "types": ["training_materials"]},
                "Club Lead Partner": {"limit": Decimal("500"), "types": ["team_events", "software"]},
                "Senior Partner": {"limit": Decimal("2000"), "types": ["hiring_events", "consultants"]},
                "Senior Lead Partner": {"limit": Decimal("10000"), "types": ["all"]}
            },
            DepartmentCode.FINANCE: {
                "Club Partner": {"limit": Decimal("50"), "types": ["office_supplies"]},
                "Club Lead Partner": {"limit": Decimal("1000"), "types": ["software_subscriptions"]},
                "Senior Partner": {"limit": Decimal("5000"), "types": ["audit_fees", "tax_prep"]}
            },
            DepartmentCode.OPERATIONS: {
                "Club Partner": {"limit": Decimal("200"), "types": ["maintenance_supplies"]},
                "Club Lead Partner": {"limit": Decimal("2000"), "types": ["vendor_payments", "equipment"]},
                "Senior Lead Partner": {"limit": Decimal("25000"), "types": ["capital_expenditures", "renovations"]}
            },
            DepartmentCode.PROGRAMS_CURRICULUM: {
                "Club Partner": {"limit": Decimal("300"), "types": ["materials"]},
                "Club Lead Partner": {"limit": Decimal("1500"), "types": ["instructor_fees", "venue_rentals"]},
                "Senior Lead Partner": {"limit": Decimal("10000"), "types": ["curriculum_development", "certification_programs"]}
            }
        }
        
        # Get approval rules for department and title
        dept_rules = approval_matrix.get(self.department["code"], {})
        title_rules = dept_rules.get(self.access_info["partner_title"], {})
        
        can_approve = (
            self.access_info["can_approve_expenses_up_to"] >= expense_amount
            and (expense_type in title_rules.get("types", []) or "all" in title_rules.get("types", []))
        )
        
        # Special override for Founder Partners
        if self.access_info["partner_title"] == "Founder Partner":
            can_approve = True
        
        return {
            "can_approve": can_approve,
            "approved_limit": self.access_info["can_approve_expenses_up_to"],
            "required_escalation": expense_amount > self.access_info["can_approve_expenses_up_to"],
            "escalate_to": self._get_escalation_path()
        }
    
    def get_department_financial_dashboard(self) -> Dict:
        """Get department financial dashboard based on access level"""
        
        dashboard = {
            "department": self.department,
            "access_level": self.access_info["department_access_level"],
            "period": get_current_fiscal_period()
        }
        
        # Add data based on access level
        if self.access_info["department_access_level"] in ["executive_full_access", "department_full_access"]:
            dashboard.update(self._get_full_department_financials())
        
        elif self.access_info["department_access_level"] == "strategic_department_access":
            dashboard.update(self._get_strategic_department_financials())
            
        elif self.access_info["department_access_level"] == "senior_department_access":
            dashboard.update(self._get_senior_department_financials())
            
        elif self.access_info["department_access_level"] == "team_lead_access":
            dashboard.update(self._get_team_lead_financials())
            
        else:  # member_access
            dashboard.update(self._get_member_financials())
        
        # Add stewardship view if applicable
        if self.access_info["stewardship_access_info"]:
            dashboard["stewardship_view"] = self._get_stewardship_financials()
        
        return dashboard
    
    def _get_full_department_financials(self) -> Dict:
        """Full financials for department heads"""
        return {
            "pl_statement": supabase.rpc('get_department_pl', {
                'p_department_id': self.department["id"],
                'p_periods': 12
            }).execute().data,
            "budget_vs_actual": self._get_budget_comparison(),
            "team_performance": self._get_team_performance_metrics(),
            "capital_expenditures": self._get_capital_expenditures(),
            "vendor_spend": self._get_vendor_analysis(),
            "forecast": self._get_department_forecast()
        }
    
    def _get_strategic_department_financials(self) -> Dict:
        """Strategic view for Senior Lead Partners"""
        return {
            "summary_pl": supabase.rpc('get_department_pl_summary', {
                'p_department_id': self.department["id"],
                'p_period': get_current_fiscal_period()
            }).execute().data,
            "key_metrics": self._get_strategic_metrics(),
            "team_utilization": self._get_team_utilization(),
            "initiative_roi": self._get_initiative_roi()
        }
    
    def _get_senior_department_financials(self) -> Dict:
        """Senior Partner view - focused on their domain"""
        return {
            "assigned_entities_pl": self._get_assigned_entities_performance(),
            "direct_reports_performance": self._get_direct_reports_metrics(),
            "budget_usage": self._get_personal_budget_tracking(),
            "profit_share_impact": self._get_profit_share_impact()
        }
    
    def _get_team_lead_financials(self) -> Dict:
        """Club Lead Partner view - team operations"""
        return {
            "team_performance": self._get_team_operational_metrics(),
            "daily_revenue": self._get_daily_revenue_tracking(),
            "cost_efficiency": self._get_cost_efficiency_metrics(),
            "member_satisfaction": self._get_member_feedback()
        }
    
    def _get_stewardship_financials(self) -> Dict:
        """Stewardship view for overseeing departments"""
        stewarded_dept = supabase.table('departments')\
            .select('*')\
            .eq('id', self.access_info['steward_of_department_id'])\
            .single()\
            .execute()
        
        return {
            "stewarded_department": stewarded_dept.data,
            "oversight_metrics": self._get_stewardship_metrics(stewarded_dept.data['id']),
            "alignment_score": self._calculate_alignment_score(stewarded_dept.data['id']),
            "recommendations": self._generate_stewardship_recommendations(stewarded_dept.data['id'])
        }
5. Department Performance & Accountability Tracking
sql
-- Department OKRs (Objectives and Key Results)
CREATE TABLE department_okrs (
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

-- Department Scorecard
CREATE VIEW department_scorecard AS
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
  
  (
    SELECT COUNT(DISTINCT pc.id)
    FROM partner_contributions pc
    JOIN partners p2 ON pc.partner_id = p2.id
    WHERE p2.department_id = d.id
      AND pc.created_at >= date_trunc('month', CURRENT_DATE)
  ) as monthly_contributions,
  
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
    WHERE ds.id = d.steward_department_code
  ), 'None') as stewarded_by,
  
  -- Overall Score (weighted composite)
  (
    (dpl.profit_margin_pct / 25 * 0.4) +  -- Financial performance 40%
    (
      SELECT COALESCE(AVG(dokr.progress_pct / 100), 0)
      FROM department_okrs dokr
      WHERE dokr.department_id = d.id
        AND dokr.fiscal_period = dpl.fiscal_period
    ) * 0.3 +  -- OKR achievement 30%
    (
      CASE 
        WHEN risk_indicator = 'stable' THEN 1.0
        WHEN risk_indicator = 'leadership_transition' THEN 0.7
        WHEN risk_indicator = 'operational_risk' THEN 0.5
        ELSE 0.3
      END
    ) * 0.2 +  -- Risk management 20%
    (cultural_importance / 10 * 0.1)  -- Cultural importance 10%
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
6. Department-Specific React Components
typescript
// Department Head Dashboard Component
interface DepartmentHeadDashboardProps {
  departmentCode: DepartmentCode;
  partnerId: string;
}

export const DepartmentHeadDashboard: React.FC<DepartmentHeadDashboardProps> = ({ 
  departmentCode, 
  partnerId 
}) => {
  const [dashboardData, setDashboardData] = useState<DepartmentDashboard>();
  const [accessInfo, setAccessInfo] = useState<PartnerAccessInfo>();
  
  // Department-specific configurations
  const departmentConfigs = {
    [DepartmentCode.PEOPLE_CULTURE]: {
      primaryMetrics: ['team_satisfaction', 'retention_rate', 'promotion_rate'],
      financialWeight: 0.3,
      culturalWeight: 0.7
    },
    [DepartmentCode.FINANCE]: {
      primaryMetrics: ['revenue_accuracy', 'cost_control', 'reporting_timeliness'],
      financialWeight: 0.8,
      culturalWeight: 0.2
    },
    [DepartmentCode.OPERATIONS]: {
      primaryMetrics: ['facility_uptime', 'vendor_performance', 'cost_per_member'],
      financialWeight: 0.6,
      culturalWeight: 0.4
    },
    [DepartmentCode.PROGRAMS_CURRICULUM]: {
      primaryMetrics: ['member_satisfaction', 'program_utilization', 'outcome_achievement'],
      financialWeight: 0.4,
      culturalWeight: 0.6
    }
  };
  
  const config = departmentConfigs[departmentCode];
  
  return (
    <div className="department-dashboard">
      {/* Department Header with Leadership Info */}
      <DepartmentHeader 
        department={dashboardData?.department}
        head={dashboardData?.department_head}
        tenure={dashboardData?.months_as_lead}
        titleRequirement={dashboardData?.minimum_leadership_title}
      />
      
      {/* Access-Based Content Rendering */}
      {accessInfo?.department_access_level === 'executive_full_access' && (
        <>
          <ExecutiveFinancialView 
            plStatement={dashboardData?.pl_statement}
            budget={dashboardData?.budget_vs_actual}
            forecasts={dashboardData?.forecast}
          />
          <TeamPerformanceOverview 
            team={dashboardData?.team_performance}
            canViewConfidential={accessInfo?.can_access_confidential_data}
          />
          <CapitalExpenditureApprovals 
            approvalLimit={accessInfo?.can_approve_expenses_up_to}
          />
        </>
      )}
      
      {accessInfo?.department_access_level === 'department_full_access' && (
        <>
          <DepartmentFinancialSummary 
            revenue={dashboardData?.revenue_amount}
            costs={dashboardData?.total_costs}
            margin={dashboardData?.profit_margin_pct}
          />
          <TeamManagementView 
            teamSize={dashboardData?.team_size}
            okrs={dashboardData?.okrs}
            hiringAuthority={accessInfo?.can_approve_hiring}
          />
          <ExpenseApprovalQueue 
            approvalLimit={accessInfo?.can_approve_expenses_up_to}
          />
        </>
      )}
      
      {accessInfo?.department_access_level === 'strategic_department_access' && (
        <>
          <StrategicMetricsView 
            metrics={dashboardData?.key_metrics}
            utilization={dashboardData?.team_utilization}
          />
          <InitiativeROIDashboard 
            initiatives={dashboardData?.initiative_roi}
          />
          <DepartmentAlignmentScore 
            alignment={dashboardData?.alignment_score}
          />
        </>
      )}
      
      {accessInfo?.department_access_level === 'senior_department_access' && (
        <>
          <AssignedEntitiesPerformance 
            entities={dashboardData?.assigned_entities_pl}
          />
          <DirectReportsView 
            reports={dashboardData?.direct_reports_performance}
          />
          <PersonalBudgetTracker 
            budget={dashboardData?.budget_usage}
          />
        </>
      )}
      
      {accessInfo?.department_access_level === 'team_lead_access' && (
        <>
          <TeamOperationalMetrics 
            metrics={dashboardData?.team_performance}
          />
          <DailyRevenueTracker 
            revenue={dashboardData?.daily_revenue}
          />
          <MemberSatisfactionDashboard 
            feedback={dashboardData?.member_satisfaction}
          />
        </>
      )}
      
      {/* Stewardship View (if applicable) */}
      {accessInfo?.stewardship_access_info && (
        <StewardshipOversightPanel 
          department={accessInfo.stewardship_access_info.department}
          metrics={dashboardData?.stewardship_view?.oversight_metrics}
          canOverride={accessInfo.stewardship_access_info.can_override}
        />
      )}
      
      {/* Department-Specific Actions */}
      <DepartmentActions 
        departmentCode={departmentCode}
        partnerTitle={accessInfo?.partner_title}
        canApproveContracts={accessInfo?.can_approve_contracts}
      />
    </div>
  );
};

// Department-Specific Action Panel
const DepartmentActions: React.FC<{
  departmentCode: DepartmentCode;
  partnerTitle: string;
  canApproveContracts: boolean;
}> = ({ departmentCode, partnerTitle, canApproveContracts }) => {
  
  const getDepartmentActions = () => {
    const baseActions = [];
    
    // Common actions for all department heads
    if (partnerTitle !== 'Club Partner') {
      baseActions.push({
        label: 'Review Team Performance',
        icon: '👥',
        path: `/department/${departmentCode}/team`
      });
    }
    
    // Department-specific actions
    switch(departmentCode) {
      case DepartmentCode.PEOPLE_CULTURE:
        return [
          ...baseActions,
          { label: 'Review Compensation', icon: '💰', path: '/people/compensation' },
          { label: 'Partner Progression', icon: '📈', path: '/people/progression' },
          { label: 'Cultural Metrics', icon: '🎭', path: '/people/culture' }
        ];
      
      case DepartmentCode.FINANCE:
        return [
          ...baseActions,
          { label: 'Approve Invoices', icon: '🧾', path: '/finance/approvals' },
          { label: 'Run Financial Reports', icon: '📊', path: '/finance/reports' },
          { label: 'Review Profit Sharing', icon: '🎁', path: '/finance/profit-share' }
        ];
      
      case DepartmentCode.OPERATIONS:
        return [
          ...baseActions,
          { label: 'Facility Management', icon: '🏢', path: '/operations/facilities' },
          { label: 'Vendor Management', icon: '🤝', path: '/operations/vendors' },
          { label: 'SOP Compliance', icon: '📋', path: '/operations/compliance' }
        ];
      
      case DepartmentCode.PROGRAMS_CURRICULUM:
        return [
          ...baseActions,
          { label: 'Program Quality Review', icon: '⭐', path: '/programs/quality' },
          { label: 'Curriculum Development', icon: '📚', path: '/programs/curriculum' },
          { label: 'Instructor Performance', icon: '👨‍🏫', path: '/programs/instructors' }
        ];
      
      default:
        return baseActions;
    }
  };
  
  // Add contract approval if authorized
  if (canApproveContracts) {
    baseActions.push({
      label: 'Approve Contracts',
      icon: '📝',
      path: '/legal/contracts'
    });
  }
  
  return (
    <div className="department-actions">
      <h4>Department Actions</h4>
      <div className="action-grid">
        {getDepartmentActions().map((action, index) => (
          <button 
            key={index}
            className="action-button"
            onClick={() => navigate(action.path)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
Key Integration Points:
1. Title ↔ Department ↔ Access Alignment
Club Partner: Department member, limited access

Club Lead Partner: Team lead in Member Services, moderate access

Senior Partner: Department head in Finance/Marketing/Tech, significant access

Senior Lead Partner: Department head in People/Operations/Programs, extensive access

Founder Partner: Strategy & Impact, full access + stewardship oversight

2. Progressive Accountability
Financial accountability increases with title/department

Budget approval limits scale appropriately

Performance visibility expands with responsibility

Decision authority matches department criticality

3. Department-Specific Financial Views
People & Culture: Cultural metrics + budget compliance

Finance: Full P&L + profit sharing + compliance

Operations: Facility efficiency + vendor performance

Programs: Quality metrics + outcome achievement

4. Stewardship Oversight
Each department has a steward department that can review alignment:

People & Culture → Operations

Finance → Strategy & Impact

Operations → People & Culture

Member Services → Programs & Curriculum

Partner Services → Member Services

Programs & Curriculum → Growth

Marketing & Growth → Programs

Technology & Data → Operations

Legal & Compliance → Strategy & Impact

Strategy & Impact → Finance

This creates a beautiful system where:

Roles match responsibility - no title inflation

Access matches accountability - see what you're responsible for

Progression is clear - know what's needed to advance

Department health is measurable - clear OKRs and metrics

Stewardship ensures alignment - departments keep each other honest

