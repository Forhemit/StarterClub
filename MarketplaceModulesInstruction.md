# Marketplace Modules Instruction

We're building a modular vault platform where each vault type is a separate module with its own specific data structure but shared wizard functionality. 
Architecture: Modular Vault Platform
1. Module Structure
2. Module Registration System
3. Database Architecture
 A: Separate Schemas (Recommended)
4. Dynamic Wizard System (use the Legal Vault Wizard as Template)
5. Module Registry & Loader
6. Legal Vault as First Module
7. Admin Panel for Module Management
8. Dynamic Routing
9. Admin Tool for New Vault Creation
10. Data Isolation & Security
Base RLS Policies (applied to all vault tables):
Plug-and-Play: Users can install/uninstall modules

Version Control: Each module can be versioned independently

Data Isolation: Each module's data is separate

Easy Testing: Modules can be tested in isolation

Team Scalability: Different teams can own different modules

Marketplace Potential: Could enable third-party modules later

We are creating wizards for these below using the Legal Vault as the template and guidance. 
Legal Vault Template (Completed use this one as template and guidance for building the others)
Secure storage structure for all your corporate legal documents.

Pre-structured folders for Incorporation, IP, Contracts
Role-based access control templates
+1 more
v1.0.0 • by Starter Club
Financial Controls Package
Standardized financial tracking and reporting structure.

Chart of Accounts template
Monthly close checklist
+1 more
v1.0.0 • by Starter Club
HR Onboarding System
Streamlined employee onboarding workflows.

New hire checklist
Equipment provisioning tracking
+1 more
v1.0.0 • by Starter Club
Monthly Close Playbook
Step-by-step guide to closing your books on time.

Reconciliation templates
Variance analysis report
+1 more
v1.2.0 • by Starter Club
Vendor Management System
Track contracts, renewals, and spend per vendor.

Renewal alert system
Spend analysis dashboard
+1 more
v1.0.0 • by Starter Club
Premium
Compliance Tracking
Monitor regulatory requirements and filing deadlines.

Tax filing calendar
State registration tracker
+1 more
v1.0.0 • by Starter Club
Premium
Investor Reporting Suite
Generate professional updates for your stakeholders.

KPI dashboard templates
Monthly update email builder
+1 more
v2.0.0 • by Starter Club
Enterprise
Acquisition Readiness Pack
Tools to prepare your company for a successful exit.

Due diligence data room builder
Red flag scanner
+1 more
v1.0.0 • by Starter Club
Enterprise
Valuation Optimizer
Analyze and improve key valuation drivers.

SaaS metrics calculator
Comparable analysis tool
+1 more
v1.0.0 • by Starter Club

---

## Lessons Learned from HR Onboarding Module Implementation

### 1. Database Setup

**Module Slug Column Required**
- Add a `slug` column to the `modules` table for URL-friendly identifiers
- Migration example:
```sql
ALTER TABLE modules ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
UPDATE modules SET slug = 'hr-onboarding' WHERE name = 'HR Onboarding System';
```

**Server Actions Must Handle Slugs**
- `installModule()` and `uninstallModule()` should accept either UUID or slug
- Use regex to detect UUIDs: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`
- If not a UUID, query by slug first, then fall back to name lookup

### 2. Wizard Component Structure

**File Organization**
```
src/components/{module}/marketplace/
├── {Module}Wizard.tsx          # Main wizard with step navigation
├── Step1{Name}.tsx             # First configuration step
├── Step2{Name}.tsx             # Second configuration step
├── Step3{Name}.tsx             # Third configuration step
└── Step4Review.tsx             # Review & Install step
```

**Wizard State Management**
- Use `useState` for each configuration category (checklist, equipment, access, etc.)
- Pass state down to steps via props with `onXChange` callbacks
- Keep all state in the parent wizard component for live preview synchronization

### 3. Checklist Pattern (Accordion Style)

**Data Structure for Nested Items**
```typescript
interface SubItem {
    id: string;
    label: string;
    completed: boolean;
}

interface ChecklistItem {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
    icon: string;
    subItems: SubItem[];
}
```

**UI Requirements**
- Use `Collapsible` component from `@radix-ui/react-collapsible`
- Install if missing: `npm install @radix-ui/react-collapsible`
- Create `/components/ui/collapsible.tsx` wrapper
- Show expand/collapse chevron icons
- Display progress count (e.g., "2/5 tasks")

### 4. Live Preview Best Practices

**DO:**
- Calculate completion status dynamically from actual state
- Show progress counts (e.g., "0/4" for each section)
- Only mark items as complete when ALL sub-items are checked
- Update in real-time as user makes changes

**DON'T:**
- Use hardcoded demo data (e.g., first 2 items always crossed out)
- Use index-based styling (e.g., `i < 2 ? 'complete' : ''`)
- Assume static preview content

### 5. Required UI Components

Ensure these components exist before building wizards:
- `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`
- `Checkbox`
- `Switch`
- `Progress`
- `Badge`
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`

### 6. Marketplace Page Routing

**Custom Module Pages**
- Create dedicated page at: `app/dashboard/marketplace/{module-slug}/page.tsx`
- Import and render the wizard component directly
- Dynamic `[moduleId]` route is fallback for modules without custom pages

**Page Structure**
```tsx
"use client";
import { ModuleWizard } from "@/components/{module}/marketplace/ModuleWizard";

export default function ModulePage() {
    return (
        <div className="p-6">
            <ModuleWizard />
        </div>
    );
}
```

### 7. Installation Flow

**Server Action Call**
```typescript
const result = await installModule("module-slug"); // Use slug, not name
if (result.error) {
    toast.error("Installation Failed", { description: result.error });
} else {
    setIsInstalled(true);
    toast.success("Module Installed!");
}
```

**Post-Install Navigation**
- Show "Go to Dashboard" button only after successful installation
- Route to the module's actual dashboard (e.g., `/dashboard/hr/onboarding`)

### 8. Common Mistakes to Avoid

1. **Missing Dependencies**: Always check if Radix UI components are installed
2. **Demo Data in Preview**: Never use hardcoded "complete" states
3. **UUID vs Slug Confusion**: Server actions must handle both formats
4. **Missing Module Page**: Create custom page if more than simple install is needed
5. **State Not Syncing**: Keep all config state in parent wizard for preview updates
6. **No Reset Option**: Always include a reset button to restore defaults

### 9. Reset Wizard Functionality (Required)

**Every wizard MUST have a reset button** in the header to restore all settings to defaults.

**Implementation:**
```tsx
import { RotateCcw } from "lucide-react";

// Add reset handler
const handleReset = () => {
    setStep(1);
    setChecklist(DEFAULT_CHECKLIST);
    setEquipment(DEFAULT_EQUIPMENT);
    setAccess(DEFAULT_ACCESS);
    setIsInstalled(false);
    toast.info("Wizard Reset", { description: "All settings have been restored to defaults." });
};

// Add button in header (top-right corner)
<Button variant="ghost" size="icon" onClick={handleReset} title="Reset Wizard">
    <RotateCcw className="w-5 h-5" />
</Button>
```

**Placement:**
- Position in the header area, aligned to the right
- Use `variant="ghost"` and `size="icon"` for minimal visual weight
- Include `title` attribute for accessibility
