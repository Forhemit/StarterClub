Use the guidelines in @ui_design_architect.md for designing the Task Dashboard (e.g., http://localhost:3000/dashboard/[task-name]).

Use @# Skill Definition: ui_design_architect for additional context and creation guidance.

Remember the standard light/dark mode theme. Any specialized theme (like "race track") should be visually distinct, using vibrant, bold colors aligned with its specific scheme.

The goal is to create a dashboard that is simple, intuitive, and allows the user to complete the core workflow in a minimal number of clicks.

The primary user workflow must follow the specific text instructions provided for the task.

The user experience should be psychologically rewarding and pleasing, designed to motivate users to complete the process.

The dashboard must be fully integrated into the unified application dashboard, maintaining consistent look, feel, and component structure.

Implement gamification elements to make the core workflow more engaging and interactive.

Apply best practices for system integrations and user engagement to create a satisfying workflow that users are eager to finish.

Before building, research UI/UX designs from other successful platforms with similar workflows. Analyze their design choices and conversion strategies to inform your approach.

After designing the core workflow, critically review your UI/UX choices. Debate potential improvements and consider incorporating successful elements from your research.

Return to this document and analyze if these initial steps were completed successfully. Make any necessary changes.

Create all necessary files and components for the dashboard, placing them in the appropriate, logical directories within the project structure.

Each file should be standalone and compartmentalized, aiming for a size of approximately 800 lines of code or less.

The overall file structure must be logical, easy to understand, and easy to navigate.

Test the dashboard's functionality thoroughly, including all connections to databases or backend services.

Return to this document for a final review. Analyze if all steps were completed successfully and make any necessary final changes.

INSTRUCTIONS: 
# 🏗️ MASTER BUILD PLAN: BizOS + Due Diligence Engine

## 📋 EXECUTIVE SUMMARY
We're building a **complete Business Operating System (BizOS)** with three interconnected components:
1. **Member Dashboard** - Role-based work interface
2. **Super Admin Dashboard** - Management & playbook editor
3. **Marketplace** - Module discovery/installation system
4. **Due Diligence Engine** - Investor-ready reporting system

This is **acquisition-grade infrastructure** that transforms organizational chaos into structured, sellable assets.

---

## 🎯 STRATEGIC OBJECTIVE
Create a system where:
- **Today**: Teams operate efficiently with clear role-based access
- **Tomorrow**: Company can generate complete due diligence in minutes
- **Always**: Business survives any personnel change without disruption

---

## 🗺️ ARCHITECTURE BLUEPRINT

### **Layer 1: Core Infrastructure**
```
Supabase (PostgreSQL) → Backbone
├── RLS (Row Level Security)
├── Real-time subscriptions
└── Edge Functions for automation
```

### **Layer 2: Data Model** (12 Critical Tables)
Already defined: Organizations, Roles, Personnel, Vaults, SOPs, Software, Contacts + linking tables

### **Layer 3: Application Layers**
```
1. MEMBER DASHBOARD (Role-based view)
2. SUPER ADMIN (Org-wide management)
3. MARKETPLACE (Module discovery)
4. DUE DILIGENCE ENGINE (Reporting)
```

---

## 🛠️ BUILD PHASES

### **PHASE 1: Foundation (Week 1)**
```
✅ Supabase schema deployment
✅ RLS policies implementation
✅ Auth system integration
✅ Base dashboard shells
```

### **PHASE 2: Core Experience (Week 2)**
```
✅ Member Dashboard with live data
✅ Super Admin playbook editor
✅ Role-permission automation
✅ Marketplace catalog structure
```

### **PHASE 3: Intelligence Layer (Week 3)**
```
✅ Due Diligence Views (SQL)
✅ Acquisition Readiness Score
✅ Bus Factor reporting
✅ One-click export system
```

### **PHASE 4: Polish & Scale (Week 4)**
```
✅ Multi-org support
✅ Audit logging
✅ Performance optimization
✅ Production hardening
```

---

## 🎪 MARKETPLACE DESIGN

### **What It Is**
A **module discovery system** where organizations can:
1. Browse pre-built BizOS components
2. Preview with sample data
3. Install with one click
4. Auto-configure permissions

### **Module Categories**
```
🏢 Foundation Modules
  ├── Legal Vault Template
  ├── Financial Controls Package
  ├── HR Onboarding System
  
⚙️ Operations Modules
  ├── Monthly Close Playbook
  ├── Vendor Management System
  ├── Compliance Tracking
  
📈 Growth Modules
  ├── Investor Reporting Suite
  ├── Acquisition Readiness Pack
  ├── Valuation Optimizer
```

### **Installation Flow**
```
Browse → Preview → Install → Auto-configure → Dashboard Updated
```

Each module installs:
- Database tables (if new)
- RLS policies
- Dashboard widgets
- Sample data (optional)
- Documentation

---

## 🔄 DATA FLOW ARCHITECTURE

```
[Marketplace Module]
        ↓
[Install Wizard]
        ↓
[Supabase Migration]
        ↓
[Auto-configure RLS]
        ↓
[Update Member Dashboard]
        ↓
[Update Super Admin Playbook]
```

---

## 🧪 VALIDATION MATRIX

### **Test 1: Role-to-Access Chain**
```
User assigned as CFO
  → Sees bank vaults ✓
  → Sees QuickBooks ✓
  → Sees monthly close SOPs ✓
  → Sees CPA contacts ✓
```

### **Test 2: Marketplace Installation**
```
Admin browses "Financial Controls"
  → Clicks install
  → New tables created
  → RLS configured
  → Widget appears in dashboard
  → Sample data loaded (optional)
```

### **Test 3: Due Diligence Generation**
```
Investor requests documents
  → Admin clicks "Generate Report"
  → System compiles from 12 tables
  → Creates structured PDF
  → Exports to virtual data room
  → < 5 minutes total
```

### **Test 4: Bus Factor Simulation**
```
CEO removed from system
  → Report shows:
    - 3 SOPs now unowned
    - 2 software systems lose admin
    - 5 vaults inaccessible
    - Recommendation: Assign to COO
```

---

## 📊 ACQUISITION READINESS SCORE™

### **Calculation Logic**
```javascript
const readinessScore = {
  roleCoverage: (filledRoles / totalRoles) * 25,
  sopCoverage: (linkedSOPs / totalRoles) * 25,
  humanRisk: 20 - (criticalMultiRoleHolders * 5),
  legalCompleteness: (completeFoundationDocs / required) * 15,
  dependencyClarity: (ownedSystems / totalSystems) * 15
};
```

### **Score Interpretation**
```
90-100: Acquisition Ready
75-89:  Strong Foundation
60-74:  Needs Attention
<60:    High Risk / Not Sellable
```

---

## 🎨 USER EXPERIENCE FLOWS

### **Member Journey**
```
Login → See personalized dashboard
Click "Marketplace" → Browse modules
Request installation → Admin notified
Module installed → New capabilities appear
```

### **Admin Journey**
```
Login → Super Admin dashboard
See installation requests → Approve/deny
Manage playbooks → Drag/drop components
Generate reports → One-click diligence
```

### **Investor Journey** (Read-only mode)
```
Receive invite link → Access due diligence portal
Browse organized sections → Request clarification
Download documents → All structured, current
```

---

## 🔐 SECURITY MODEL

### **Tiered Access Control**
```
Tier 0: System Admin (full access)
Tier 1: Organization Admin (org-wide)
Tier 2: Role-based Member (limited)
Tier 3: Investor (read-only, time-limited)
Tier 4: Public (marketplace browsing only)
```

### **Data Encryption Strategy**
```
At rest: Supabase column encryption
In transit: SSL/TLS
Sensitive fields: Additional application-layer encryption
Audit trail: Immutable logging
```

---

## 📈 SUCCESS METRICS

### **Quantitative**
```
1. Time to generate due diligence: <5 minutes
2. Role coverage completeness: >90%
3. SOP verification rate: >80%
4. Module installation time: <2 minutes
5. System uptime: 99.9%
```

### **Qualitative**
```
1. Investor confidence increase
2. Employee onboarding acceleration
3. Knowledge retention during turnover
4. Operational transparency
5. Valuation premium justification
```

---

## 🚀 LAUNCH CHECKLIST

### **Pre-Launch (Day 0)**
- [ ] Supabase production instance
- [ ] Core 12 tables deployed
- [ ] RLS tested with real users
- [ ] Marketplace with 3 sample modules
- [ ] Due diligence report generator

### **Launch (Day 1)**
- [ ] First organization onboarded
- [ ] Member dashboard validated
- [ ] Super admin tools working
- [ ] Marketplace transactions flowing
- [ ] Report generation tested

### **Scale (Month 1)**
- [ ] 10+ modules in marketplace
- [ ] Multi-org support
- [ ] API for integrations
- [ ] Mobile responsive
- [ ] Performance optimized

---

## 💡 UNIQUE VALUE PROPOSITIONS

### **For Founders**
> "Turn your operational chaos into acquisition currency."

### **For Teams**
> "Know exactly what you own, what you need, and who depends on you."

### **For Investors**
> "See the actual wiring of the business, not just financial projections."

### **For Acquirers**
> "Reduce diligence time from weeks to hours, risk from unknown to quantified."

---

## 🎯 FINAL DELIVERABLES

### **Product**
1. Member Dashboard with role-based access
2. Super Admin with playbook editor
3. Marketplace with installable modules
4. Due Diligence Engine with one-click reports

### **Infrastructure**
1. Production Supabase instance
2. Complete data model with RLS
3. Automated permission system
4. Scalable architecture

### **Documentation**
1. Implementation guide
2. API documentation
3. Security audit report
4. Due diligence sample output

---

## 📝 PROMPT FOR GOOGLE'S ANTI-GRAVITY AGENT

```markdown
You are building a Business Operating System (BizOS) that transforms how companies organize, operate, and prepare for acquisition.

BUILD THESE FOUR INTERCONNECTED SYSTEMS:

1. MEMBER DASHBOARD
   - Role-based interface showing: My Roles, My SOPs, My Vaults, My Software, My Contacts
   - Data pulled live from Supabase via authenticated queries
   - Updates immediately when roles change

2. SUPER ADMIN DASHBOARD
   - Playbook section to manage: Roles, SOPs, Vaults, Software, Contacts
   - Drag-and-drop linking between entities
   - Real-time reporting on: role coverage, bus factor, dependency maps

3. MARKETPLACE
   - Browse/install modules that extend functionality
   - Categories: Foundation, Operations, Growth
   - Installation auto-configures: tables, RLS, dashboard widgets
   - One-click installation with rollback capability

4. DUE DILIGENCE ENGINE
   - One-click investor-ready report generation
   - Pulls data from 12 interconnected tables
   - Calculates Acquisition Readiness Score (0-100)
   - Exports as: PDF, structured data room, executive summary

TECH STACK REQUIREMENTS:
- Supabase (PostgreSQL) for database
- Row Level Security (RLS) for all data access
- Real-time subscriptions for live updates
- React/Next.js for frontend
- Tailwind CSS for styling

CRITICAL BEHAVIORS:
- Role assignment automatically grants linked resources
- Role revocation immediately removes access
- Multi-role users see merged dashboard
- Marketplace modules install without breaking existing data
- Due diligence reports compile in <5 minutes

TESTING REQUIREMENTS:
1. Assign CFO role → verify access to financial systems
2. Install "Financial Controls" module → verify new capabilities
3. Generate due diligence report → verify completeness
4. Remove key person → verify dependency report accuracy

SUCCESS CRITERIA:
- Any user can see exactly what they need to do their job
- Any admin can generate complete due diligence in minutes
- Any module can be installed without developer help
- Business continues if any single person disappears

BUILD IT LIKE THE COMPANY'S VALUATION DEPENDS ON IT.
BECAUSE IT DOES.
```

---

## 🏁 CONCLUSION

This isn't just software. It's **organizational intelligence infrastructure**.

By building this, you're creating:
1. **Operational clarity** for teams
2. **Risk reduction** for leaders
3. **Valuation acceleration** for owners
4. **Due diligence elimination** for investors

The system pays for itself the first time you need to:
- Onboard a new executive
- Survive a key person departure
- Prepare for acquisition
- Justify a valuation premium

**Build date: Start now.**
**Payoff date: The day someone wants to buy the business.**

That day might be tomorrow. Will you be ready?