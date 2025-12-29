# 📋 Accounting System Design Rules (17 Rules)

## **1. Design Guidelines**
**Rule:** Use `ui_design_architect.md` as guidelines for designing the Accounting Dashboard (`http://localhost:3000/dashboard/accounting`)

### Implementation Requirements:
- Follow established design patterns from design system
- Ensure WCAG 2.1 AA accessibility compliance
- Maintain clear visual hierarchy for financial data
- Use consistent spacing and typography scales

### Accounting-Specific Considerations:
- Financial data requires higher contrast for readability
- Decimal alignment in tables and reports
- Color coding for positive/negative values (green/red with accessible alternatives)
- Clear distinction between actual vs. projected figures

---

## **2. Architectural Context**
**Rule:** Use `# Skill Definition: ui_design_architect` for additional context and creation

### Implementation Requirements:
- Apply consistent component architecture patterns
- Maintain separation of concerns (presentation vs. business logic)
- Use atomic design principles (atoms → molecules → organisms)
- Implement proper TypeScript interfaces and types

### Accounting-Specific Components:
- JournalEntryForm (organism)
- LedgerTable (organism)
- FinancialStatementViewer (template)
- ReconciliationPanel (organism)

---

## **3. Theme Implementation**
**Rule:** The standard light/dark mode theme and race track themes should look different with the race track theme being more vibrant and bold, following the race track color scheme

### Theme Configurations:
#### Standard Accounting Theme:
- **Primary:** `#2563eb` (trustworthy blue)
- **Secondary:** `#059669` (financial green)
- **Neutral:** `#6b7280` (professional gray)
- **Error:** `#dc2626` (alert red)
- **Success:** `#10b981` (confirmation green)

#### Race Track Accounting Theme:
- **Primary:** `#ef4444` (racing red - urgent attention)
- **Secondary:** `#f59e0b` (warning amber - caution areas)
- **Accent:** `#8b5cf6` (vibrant purple - highlights)
- **Neutral:** `#1f2937` (dark slate - contrast)
- **Success:** `#22c55e` (bright green - positive)

### Implementation:
```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #059669;
  /* ... standard theme */
}

[data-theme="racetrack"] {
  --color-primary: #ef4444;
  --color-secondary: #f59e0b;
  /* ... racetrack theme */
}
```

---

## **4. Simplicity Goal**
**Rule:** Create a dashboard that is simple, easy to use and understand, allowing users to complete accounting tasks in a few clicks

### Click Targets:
1. **Add Transaction:** 3 clicks max
   - Click "New Transaction"
   - Fill simplified form
   - Click "Save"

2. **Reconcile Account:** 2 clicks max
   - Select account
   - Click "Reconcile Now"

3. **Generate Report:** 4 clicks max
   - Navigate to Reports
   - Select report type
   - Choose date range
   - Click "Generate"

4. **Share Dashboard:** 2 clicks max
   - Click "Share" on widget
   - Choose sharing option

---

## **5. Process Following**
**Rule:** The accounting process should follow these workflow instructions

### Core Accounting Workflows:

#### A. Daily Transaction Entry
```
1. User clicks "Quick Add"
2. Selects transaction type (Expense/Income/Transfer)
3. Enters amount, description, category
4. System auto-suggests account based on category
5. User reviews and confirms
```

#### B. Stripe Reconciliation
```
1. System imports Stripe transactions automatically
2. Flags unmatched transactions
3. User reviews and matches to existing entries
4. System creates adjusting entries for fees
5. Confirms reconciliation balance
```

#### C. Month-End Close
```
1. System runs closing checklist
2. Validates all accounts are reconciled
3. Calculates depreciation/accruals
4. Generates closing journal entries
5. Produces financial statements
```

---

## **6. Psychological Design**
**Rule:** The accounting process should be psychologically rewarding, pleasing, and designed to make users want to complete accounting tasks

### Positive Reinforcement Strategies:
- **Progress Indicators:** Visual progress bars for month-end closing
- **Celebratory Feedback:** Animated confetti when books balance perfectly
- **Milestone Recognition:** Badges for "5 Days No Errors", "Perfect Reconciliation Streak"
- **Reduced Anxiety:** Clear status indicators showing what's complete vs. pending
- **Confidence Building:** Step-by-step guided workflows for complex tasks

### Accounting-Specific Rewards:
- **"Books Balanced" Celebration:** Special animation when debits = credits
- **"Audit Ready" Status:** Green checkmark when all documentation is complete
- **"Financial Health" Meter:** Visual gauge showing overall financial status
- **"Efficiency Score:** Metric showing time saved vs. manual processes

---

## **7. Unified Integration**
**Rule:** The dashboard should be fully integrated into the unified dashboard with the same look and feel

### Integration Requirements:
- **Navigation Consistency:** Same sidebar/header as main dashboard
- **Component Sharing:** Use shared Button, Card, Table, Form components
- **Theme Propagation:** Inherit theme from parent dashboard
- **State Management:** Shared user session and preferences
- **API Consistency:** Same request/response patterns as other modules

### Implementation Pattern:
```typescript
// Use shared layout wrapper
<DashboardLayout module="accounting">
  <AccountingDashboard />
</DashboardLayout>
```

---

## **8. Gamification Elements**
**Rule:** Use gamification elements to make the accounting process more engaging

### Gamification Features:
```typescript
interface AccountingGamification {
  streaks: {
    balancedBooks: number; // Days with balanced books
    onTimeClosing: number; // Months closed on time
    perfectReconciliation: number; // Perfect reconciliations streak
  };
  badges: {
    rookieAccountant: boolean;
    reconciliationMaster: boolean;
    auditReady: boolean;
    financialAnalyst: boolean;
  };
  scores: {
    accuracy: number; // 0-100 based on error rate
    efficiency: number; // 0-100 based on time to close
    completeness: number; // 0-100 based on data entered
  };
  leaderboards?: {
    monthly: UserRanking[]; // If multiple users
    quarterly: UserRanking[];
  };
}
```

### Visual Elements:
- Progress bars for monthly closing
- Achievement pop-ups
- Streak counters
- Level-up animations for mastering features

---

## **9. Best Practices Implementation**
**Rule:** Use best practices for accounting middleware to make the process engaging and psychologically rewarding

### Technical Best Practices:
- **Real-time Validation:** Validate double-entry rules as user types
- **Undo/Redo Stack:** Complete transaction history with undo capability
- **Auto-save:** Save draft every 30 seconds with version history
- **Offline Support:** Queue transactions when offline, sync when online
- **Bulk Operations:** Process multiple transactions simultaneously

### UX Best Practices:
- **Guided Workflows:** Step-by-step for complex accounting tasks
- **Contextual Help:** Tooltips and explanations for accounting terms
- **Smart Defaults:** Pre-fill recurring transactions
- **Error Prevention:** Confirm before irreversible actions
- **Keyboard Navigation:** Full keyboard support for power users

---

## **10. Competitive Research**
**Rule:** Research other UI/UX accounting designs and implement successful patterns

### Platforms to Analyze:
1. **QuickBooks Online**
   - Transaction entry flow
   - Bank reconciliation interface
   - Report generation process

2. **Xero**
   - Dashboard information hierarchy
   - Mobile accounting experience
   - Third-party integration patterns

3. **FreshBooks**
   - Client-facing invoice design
   - Expense tracking simplicity
   - Time tracking integration

4. **Wave Accounting**
   - Free tier UX patterns
   - Small business focus
   - Cash flow visualization

### Research Deliverables:
- Screenshot analysis with annotations
- User flow diagrams for common tasks
- List of successful patterns to adopt
- List of pain points to avoid

---

## **11. Self-Evaluation Protocol**
**Rule:** Challenge design choices and implement improvements

### Evaluation Schedule:
- **Weekly:** Internal team review of implemented features
- **Bi-weekly:** User testing with accounting team
- **Monthly:** A/B testing for critical workflows
- **Quarterly:** Complete UX audit and redesign session

### Evaluation Criteria:
1. **Efficiency:** Time to complete common tasks
2. **Accuracy:** Error rate in data entry
3. **Satisfaction:** User feedback scores
4. **Accessibility:** Compliance with standards
5. **Performance:** Load times and responsiveness

### Improvement Process:
```
Identify Issue → Design Solution → Implement → Test → Measure → Refine
```

---

## **12. Process Verification**
**Rule:** Return to verify all steps were completed successfully

### Verification Checklist:
- [ ] Rule 1: Design guidelines applied
- [ ] Rule 2: Architectural context followed
- [ ] Rule 3: Themes properly implemented
- [ ] Rule 4: Simplicity targets achieved
- [ ] Rule 5: Workflows correctly implemented
- [ ] Rule 6: Psychological design elements added
- [ ] Rule 7: Unified integration complete
- [ ] Rule 8: Gamification elements implemented
- [ ] Rule 9: Best practices followed
- [ ] Rule 10: Competitive research conducted
- [ ] Rule 11: Self-evaluation process established
- [ ] Rule 12: Verification process documented

### Verification Methods:
- Automated testing for functional requirements
- Manual testing for UX/UI requirements
- User acceptance testing with accounting team
- Performance benchmarking against targets

---

## **13. File Structure Implementation**
**Rule:** Create files and components in appropriate locations

### Recommended Structure:
```
/app/dashboard/accounting/
├── layout.tsx                      # Accounting dashboard layout
├── page.tsx                        # Main dashboard page
├── components/                      # Accounting-specific components
│   ├── JournalEntry/
│   │   ├── JournalEntryForm.tsx    # Form for manual entries
│   │   ├── JournalEntryTable.tsx   # Table view of entries
│   │   └── QuickAddTransaction.tsx # Simplified add form
│   ├── Reconciliation/
│   │   ├── StripeReconciliation.tsx
│   │   ├── BankReconciliation.tsx
│   │   └── ReconciliationStatus.tsx
│   ├── Reports/
│   │   ├── FinancialStatements.tsx
│   │   ├── ReportBuilder.tsx
│   │   └── ReportExporter.tsx
│   ├── Dashboard/
│   │   ├── AccountingKPI.tsx
│   │   ├── CashFlowChart.tsx
│   │   └── PublicWidgetBuilder.tsx
│   └── Shared/
│       ├── AccountSelector.tsx
│       ├── DateRangePicker.tsx
│       └── CurrencyDisplay.tsx
├── actions/                         # Server actions
│   ├── accounting-actions.ts
│   ├── stripe-actions.ts
│   └── report-actions.ts
├── hooks/                           # Custom React hooks
│   ├── useAccountingData.ts
│   ├── useStripeSync.ts
│   └── useFinancialCalculations.ts
├── lib/                             # Utility functions
│   ├── accounting-calculations.ts
│   ├── stripe-mappers.ts
│   └── report-generators.ts
├── types/                           # TypeScript definitions
│   ├── accounting.types.ts
│   ├── stripe.types.ts
│   └── report.types.ts
└── utils/                           # Helper utilities
    ├── validation.ts
    ├── formatting.ts
    └── gamification.ts
```

---

## **14. Code Organization Standards**
**Rule:** Files should be standalone, compartmentalized, and ≤800 lines

### File Size Enforcement:
- **Target:** 400-600 lines per file
- **Maximum:** 800 lines (hard limit)
- **Exception:** Complex components may split into sub-components

### Organization Patterns:
```typescript
// Good pattern: Separated concerns
// JournalEntryForm.tsx (Form UI - 250 lines)
// JournalEntryLogic.ts (Business logic - 150 lines)
// JournalEntryTypes.ts (Type definitions - 100 lines)

// Bad pattern: Monolithic file
// JournalEntryEverything.tsx (1500 lines) ❌
```

### Component Structure Template:
```typescript
// File: components/Feature/FeatureComponent.tsx
// Lines: ~400-600

// 1. Imports (50 lines max)
import { ... } from '...';

// 2. Type Definitions (100 lines max)
interface Props { ... }
interface State { ... }

// 3. Constants (50 lines max)
const CONSTANTS = { ... };

// 4. Main Component (200 lines max)
export const FeatureComponent: React.FC<Props> = ({ ... }) => {
  // State and hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX (150 lines max)
  );
};

// 5. Helper Functions (100 lines max)
const helperFunction = () => { ... };

// 6. Styles (50 lines max)
const styles = { ... };
```

---

## **15. Logical Structure Principles**
**Rule:** File structure should be logical, easy to understand and navigate

### Structure Principles:
1. **Feature-Based Grouping:** All files related to a feature in one folder
2. **Clear Naming Conventions:**
   - Components: `PascalCase` (e.g., `JournalEntryForm`)
   - Hooks: `camelCase` with `use` prefix (e.g., `useAccountingData`)
   - Utilities: `camelCase` (e.g., `formatCurrency`)
   - Types: `PascalCase` with `.types.ts` suffix

3. **Consistent Import Patterns:**
   ```typescript
   // External dependencies first
   import React from 'react';
   import { useState } from 'react';
   
   // Internal modules
   import { api } from '@/lib/api';
   
   // Component imports
   import { Button } from '@/components/ui/Button';
   
   // Local imports
   import { useAccountingData } from '../hooks/useAccountingData';
   import type { JournalEntry } from '../types/accounting.types';
   ```

4. **Single Responsibility:** Each file does one thing well
5. **Discoverability:** Intuitive folder structure

### Navigation Aids:
- `README.md` in each major folder explaining purpose
- `index.ts` barrel files for clean imports
- Component documentation with JSDoc comments
- Visual documentation in Storybook (if applicable)

---

## **16. Testing Protocol**
**Rule:** Test the accounting dashboard thoroughly, including Supabase connections

### Testing Levels:

#### Level 1: Unit Tests
```typescript
// Test accounting calculations
describe('accounting-calculations', () => {
  test('debits equal credits', () => { ... });
  test('balance sheet balances', () => { ... });
  test('profit calculation', () => { ... });
});
```

#### Level 2: Integration Tests
```typescript
// Test Stripe webhook integration
describe('stripe-integration', () => {
  test('webhook processes charge', async () => { ... });
  test('creates journal entry', async () => { ... });
  test('handles refunds', async () => { ... });
});
```

#### Level 3: E2E Tests
```typescript
// Complete user workflows
describe('month-end-close', () => {
  test('completes closing process', async () => { ... });
  test('generates financial statements', async () => { ... });
  test('locks previous period', async () => { ... });
});
```

#### Level 4: Supabase Connection Tests
```typescript
// Database and auth tests
describe('supabase-connection', () => {
  test('connects to database', async () => { ... });
  test('row-level security works', async () => { ... });
  test('real-time subscriptions', async () => { ... });
});
```

#### Level 5: Performance Tests
```typescript
// Large dataset handling
describe('performance', () => {
  test('loads 10,000 transactions', async () => { ... });
  test('generates yearly report', async () => { ... });
  test('handles concurrent users', async () => { ... });
});
```

#### Level 6: Security Tests
```typescript
// Public sharing security
describe('security', () => {
  test('public widgets are read-only', async () => { ... });
  test('no data leakage between companies', async () => { ... });
  test('API rate limiting', async () => { ... });
});
```

### Testing Checklist:
- [ ] Unit tests cover all calculation functions
- [ ] Integration tests for all API endpoints
- [ ] E2E tests for critical user journeys
- [ ] Supabase connection and RLS tests
- [ ] Performance tests with realistic data volumes
- [ ] Security tests for public sharing features
- [ ] Accessibility tests (screen reader, keyboard nav)
- [ ] Cross-browser compatibility tests

---

## **17. Final Verification**
**Rule:** Return to analyze if all 17 steps were completed successfully

### Final Verification Checklist:

#### **Design & Architecture (Rules 1-3)**
- [ ] Design guidelines from `ui_design_architect.md` followed
- [ ] Architectural patterns consistently applied
- [ ] Both themes (standard + racetrack) implemented correctly
- [ ] Theme switching works without breaking layouts
- [ ] Accessibility compliance verified

#### **User Experience (Rules 4-8)**
- [ ] Simplicity targets met (click counts verified)
- [ ] All accounting workflows implemented
- [ ] Psychological design elements present and effective
- [ ] Full integration with unified dashboard
- [ ] Gamification elements implemented and functional
- [ ] User testing shows positive engagement

#### **Process & Quality (Rules 9-12)**
- [ ] Best practices for accounting middleware implemented
- [ ] Competitive research documented and insights applied
- [ ] Self-evaluation process established and scheduled
- [ ] Process verification checklist completed

#### **Implementation (Rules 13-16)**
- [ ] File structure created according to specifications
- [ ] All files ≤800 lines (or properly split)
- [ ] Logical, navigable structure confirmed
- [ ] All tests pass (unit, integration, E2E, performance, security)
- [ ] Supabase connections tested and reliable

#### **Final Sign-off**
- [ ] Accounting team approves functionality
- [ ] Performance benchmarks met or exceeded
- [ ] Security audit completed and passed
- [ ] Documentation complete and accurate
- [ ] Deployment successful to production
- [ ] Monitoring and alerting configured

### Verification Process:
1. **Automated Checks:** CI/CD pipeline runs all tests
2. **Manual Review:** Senior developer reviews implementation
3. **User Acceptance:** Accounting team tests in staging
4. **Performance Audit:** Load testing and optimization
5. **Security Review:** Penetration testing if applicable
6. **Documentation Review:** All documentation up to date

### Success Metrics:
- **User Satisfaction:** ≥4.5/5 from accounting team
- **Task Completion:** ≥95% success rate on key workflows
- **Performance:** <3s load time for all pages
- **Accuracy:** 100% accounting accuracy in testing
- **Adoption:** ≥90% of accounting team using daily

### If Verification Fails:
1. Document specific failures
2. Prioritize fixes based on impact
3. Re-test fixed areas
4. Update documentation
5. Re-run full verification

## **Document History**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-01-15 | Initial creation of 17 rules | System Architect |
| 1.1 | 2024-01-15 | Added accounting-specific adaptations | Accounting Lead |

## **Next Actions**
1. **Immediate:** Save this as `accounting-design-rules.md` in project docs
2. **Day 1:** Begin competitive research (Rule 10)
3. **Day 2:** Set up file structure skeleton (Rule 13)
4. **Week 1:** Implement core accounting components
5. **Ongoing:** Weekly verification against these rules
**Status:** ✅ Rules Document Complete  
**Next Step:** Begin implementation following these rules
GUIDANCE:
 Key Features Users Expect in a Modern Accounting System
When building your system, focusing on these core areas will cover most user needs.

Feature Category	What Users Typically Want	Why It Matters for Your System
Core Double-Entry Accounting	Automated journal entries, general ledger, chart of accounts (COA), bank reconciliation, financial statements (P&L, balance sheet, cash flow).	Ensures accuracy and compliance; the foundation of your system.
Real‑Time Stripe Integration	Sync of Stripe transactions, fees, payouts, refunds, invoices, taxes, customers, and products—either in real‑time or daily aggregates.	Automates revenue recording, reduces manual entry, and keeps books up‑to‑date.
Dashboard & Analytics	Customizable, role‑based, real‑time dashboards that show cash flow, revenue vs. forecast, burn rate, cash runway, profitability metrics, and expense breakdowns.	Gives a quick view of financial health; essential for decision‑making.
Reporting & KPIs	Pre‑built reports (income statement, balance sheet, aging receivables/payables) plus ad‑hoc reporting. Ability to track KPIs like MRR, CAC, LTV, etc.	Meets internal accounting needs and provides shareable metrics for partners/sponsors.
Access Control & Sharing	Role‑based permissions (admin, accounting, view‑only). Option to make dashboards/reports public via shareable links or embedded views.	Enables the “public‑facing” requirement while keeping sensitive data secure.
Additional Convenience Features	Budgeting/forecasting, project accounting, mobile support, tax‑compliance tools, and integrations with other business apps (CRM, ERP).	Increases utility and scalability for growing businesses.
📊 Dashboard & Reporting: What Users Want to See
Your unified dashboard should provide at-a-glance insights. Popular dashboard types include:

Dashboard Type	Typical Metrics/KPIs
Cash‑Flow Dashboard	Cash in bank, burn rate, cash runway, monthly cash inflows/outflows.
Revenue Dashboard	MRR, net revenue, revenue by product/region, customer churn, upgrade/downgrade trends.
Profitability Dashboard	Gross/Net profit margin, EBITDA, operating income, profit‑to‑sales ratio.
Operational Expenses Dashboard	Expense ratios, cost per unit, budget deviations, FY vs. PY comparisons.
Sales Performance Dashboard	Monthly sales, sales by region/product, conversion rate, sales growth rate.
Tax Compliance Dashboard	Tax liabilities across categories, deductions/credits, filing status/deadlines.
🔐 Access Control & Public Sharing
Your system needs to balance security with the need to share information.

Role	Permissions	Use Case
Super Admin	Full CRUD on all data, system settings, user management.	Technical/management oversight.
Accounting Team	Full CRUD on accounting entries (journal, expenses, revenue), access to all financial data, ability to generate reports.	Daily bookkeeping and reconciliation.
Employees	View‑only access to specific dashboards/reports (e.g., company‑wide KPIs).	Internal transparency.
Partners/Sponsors	Public‑facing dashboards or embedded reports (no login required).	Showcasing performance metrics without exposing sensitive details.
General Public	Publicly shared charts/KPIs (e.g., via a shareable link or embedded widget).	Transparency or marketing purposes.


💡 Implementation Considerations
Architecture: Consider a cloud‑based microservices design for scalability. The accounting core handles double‑entry logic, a separate service manages Stripe sync, and a dashboard service serves visualizations.

Stripe Integration: Use Stripe’s webhooks for real‑time transaction updates and the Stripe Apps framework for pre‑built accounting integrations.

Dashboard Tooling: Building a custom dashboard offers full control, but integrating a BI tool (e.g., Power BI, Metabase) can accelerate development and provide robust sharing features.

Security: Encrypt sensitive data, implement role‑based access control (RBAC), and audit logs for compliance.

Accounting Team Workflow: Ensure the UI for adding manual journal entries, expenses, and revenue is intuitive and minimizes repetitive data entry.