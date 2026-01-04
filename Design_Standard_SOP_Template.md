# 🏗️ SOP Generator Module Specification
## Position Master SOP Creation & Management System

### 📁 Module Information
- **Module ID:** `sop-generator`
- **Module Path:** `/dashboard/marketplace/sop-generator`
- **Integration Points:** Jobs-Careers Module, HR-Onboarding Module
- **Status:** `Active Development`
- **Target Release:** Q1 2025

---

## 🎨 UX/UI Design System

### Core Design Principles (Aligned with Existing Modules)
1. **Card-Based Layout**: Use `bg-card` with `rounded-xl` borders
2. **Wizard Flow**: Multi-step creation process with sticky footer navigation
3. **Edit/Preview Toggle**: Seamless switching between form and document view
4. **Manual Save Pattern**: Standardized "Save" button with status indicators
5. **Responsive Design**: Mobile-first with touch-friendly controls

### Typography & Colors
```css
/* Typography */
--font-ui: 'Inter', sans-serif;
--font-display: 'Syne', sans-serif;
--font-mono: 'Space Mono', monospace;

/* Color Palette */
--accent-green: hsl(156, 100%, 50%); /* #00ff9d Signal Green */
--accent-yellow: hsl(45, 100%, 50%); /* #ffbf00 Signal Yellow */
--accent-cyan: hsl(180, 100%, 50%); /* #00f0ff HUD Cyan */
```

### Mobile-Friendly Patterns
- **Sticky Footer**: Glassmorphism footer with primary actions (`backdrop-blur-lg`)
- **Pill Navigation**: Horizontal scrollable step indicators for mobile
- **Adaptive Modals**: Centered, width-adjusted dialogs on small screens
- **Touch Targets**: Minimum 44px button heights

---

## 🏗️ Technical Architecture

### Database Schema (Supabase)

#### 1. Main Position SOP Table
```sql
CREATE TABLE position_sops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sop_id TEXT UNIQUE NOT NULL, -- Format: POS-DEPT-001
  title TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  position_type TEXT CHECK (position_type IN ('full-time', 'part-time', 'contract')),
  flsa_status TEXT CHECK (flsa_status IN ('exempt', 'non-exempt')),
  work_arrangement TEXT CHECK (work_arrangement IN ('onsite', 'hybrid', 'remote')),
  location TEXT,
  reports_to_position_id UUID REFERENCES position_sops(id),
  
  -- Review & Version Control
  version TEXT DEFAULT 'v1.0',
  effective_date DATE DEFAULT CURRENT_DATE,
  review_frequency TEXT CHECK (review_frequency IN ('quarterly', 'biannual', 'annual', 'biennial')) DEFAULT 'annual',
  next_review_date DATE,
  status TEXT CHECK (status IN ('draft', 'active', 'pending_review', 'expired', 'archived')) DEFAULT 'draft',
  escalation_level TEXT CHECK (escalation_level IN ('none', 'author', 'manager', 'admin')) DEFAULT 'none',
  
  -- People
  owner_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  incumbent_id UUID REFERENCES users(id) NULL,
  hr_business_partner_id UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  is_hr_confidential BOOLEAN DEFAULT false,
  requires_training BOOLEAN DEFAULT true
);
```

#### 2. Position Responsibilities (Linked to Process SOPs)
```sql
CREATE TABLE position_responsibilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
  responsibility_area TEXT NOT NULL,
  key_activities JSONB, -- Array of activities
  time_allocation INTEGER CHECK (time_allocation >= 0 AND time_allocation <= 100),
  priority INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Junction table for linking to Process SOPs
CREATE TABLE position_responsibility_sops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  responsibility_id UUID REFERENCES position_responsibilities(id) ON DELETE CASCADE,
  process_sop_id TEXT NOT NULL, -- References existing process SOP IDs
  mastery_level TEXT CHECK (mastery_level IN ('awareness', 'proficient', 'expert')) DEFAULT 'proficient',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(responsibility_id, process_sop_id)
);
```

#### 3. Authority Matrix
```sql
CREATE TABLE position_authorities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
  decision_area TEXT NOT NULL,
  authority_level TEXT NOT NULL,
  approval_required TEXT,
  escalation_path TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 4. Performance Metrics (KPIs)
```sql
CREATE TABLE position_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  target TEXT NOT NULL,
  measurement_frequency TEXT CHECK (measurement_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually')),
  metric_weight INTEGER CHECK (metric_weight >= 0 AND metric_weight <= 100),
  data_source TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 5. Position Requirements
```sql
CREATE TABLE position_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
  requirement_type TEXT CHECK (requirement_type IN ('education', 'experience', 'certification', 'technical', 'soft_skill', 'physical')),
  description TEXT NOT NULL,
  is_minimum BOOLEAN DEFAULT true,
  is_preferred BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 6. Review History
```sql
CREATE TABLE sop_review_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_sop_id UUID REFERENCES position_sops(id) ON DELETE CASCADE,
  review_date DATE NOT NULL,
  reviewed_by UUID REFERENCES users(id),
  action_taken TEXT CHECK (action_taken IN ('no_change', 'minor_update', 'major_revision')),
  notes TEXT,
  next_review_date DATE,
  version_result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### API Endpoints

#### 1. Position SOP Management
```typescript
// GET /api/position-sops
// GET /api/position-sops/:id
// POST /api/position-sops
// PUT /api/position-sops/:id
// DELETE /api/position-sops/:id
// POST /api/position-sops/:id/clone
// POST /api/position-sops/:id/change-status
```

#### 2. Wizard Step Endpoints
```typescript
// POST /api/position-sops/:id/steps/:step
// GET /api/position-sops/:id/preview
// POST /api/position-sops/:id/generate-job-posting
```

#### 3. Review & Approval
```typescript
// POST /api/position-sops/:id/request-review
// POST /api/position-sops/:id/approve
// POST /api/position-sops/:id/reject
// GET /api/position-sops/expiring-soon
```

---

## 🎯 Frontend Components

### 1. Main Module Layout
```tsx
// app/dashboard/marketplace/sop-generator/page.tsx
<SOPGeneratorLayout>
  <SOPDashboard />
</SOPGeneratorLayout>
```

### 2. Wizard Component Structure
```tsx
// components/sop/wizard/SOPCreationWizard.tsx
<SOPCreationWizard>
  <WizardHeader />
  <WizardSteps>
    <Step1PositionIdentification />
    <Step2PositionOverview />
    <Step3KeyResponsibilities />
    <Step4AuthorityMatrix />
    <Step5PerformanceMetrics />
    <Step6PositionRequirements />
    <Step7TrainingDevelopment />
    <Step8SuccessionPlan />
    <Step9ResourcesTools />
    <Step10CommunicationProtocols />
    <Step11CompensationSection />
    <Step12LinkedDocuments />
    <Step13ReviewPreview />
  </WizardSteps>
  <WizardFooter />
</SOPCreationWizard>
```

### 3. Key Components

#### SOPCard Component
```tsx
// components/sop/SOPCard.tsx
interface SOPCardProps {
  sop: PositionSOP;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
}

<SOPCard>
  <SOPCardHeader>
    <SOPStatusBadge status={sop.status} />
    <SOPActionsMenu />
  </SOPCardHeader>
  <SOPCardContent>
    <SOPBasicInfo />
    <SOPNextReview />
  </SOPCardContent>
  <SOPCardFooter>
    <ActionButtons />
  </SOPCardFooter>
</SOPCard>
```

#### Responsibility Table Component
```tsx
// components/sop/tables/ResponsibilityTable.tsx
<ResponsibilityTable>
  <ResponsibilityTableHeader />
  <ResponsibilityTableBody>
    <ResponsibilityRow
      onEdit={handleEditResponsibility}
      onDelete={handleDeleteResponsibility}
      onLinkSOP={handleLinkSOP}
    />
  </ResponsibilityTableBody>
  <ResponsibilityTableFooter>
    <AddResponsibilityButton />
  </ResponsibilityTableFooter>
</ResponsibilityTable>
```

#### Preview Component
```tsx
// components/sop/preview/SOPPreview.tsx
<SOPPreview>
  <SOPDocumentHeader data={sopData} />
  <SOPDocumentBody>
    <PositionOverviewSection />
    <ResponsibilitiesSection />
    <AuthorityMatrixSection />
    <KPISection />
    <RequirementsSection />
  </SOPDocumentBody>
  <SOPDocumentFooter />
</SOPPreview>
```

---

## 🚀 Wizard Flow Specification

### Step 1: Position Identification
- **Layout**: Single-column form with `space-y-6`
- **Fields**:
  - Position Title (text input, required)
  - Department (select dropdown, links to departments table)
  - Position Type (radio group: full-time/part-time/contract)
  - FLSA Status (radio group: exempt/non-exempt)
  - Work Arrangement (radio group: onsite/hybrid/remote)
  - Location (text input with auto-suggest)
  - Reports To (searchable select of existing positions)
- **UI Pattern**: Standard shadcn form with validation

### Step 2: Position Overview
- **Layout**: Two text areas side-by-side on desktop, stacked on mobile
- **Fields**:
  - Mission Statement (textarea, 500 char limit, with counter)
  - Impact Statement (textarea, 500 char limit, with counter)
- **Design**: Use `h-[200px]` for textareas with `resize-none`

### Step 3: Key Responsibilities
- **Layout**: Interactive table with inline editing
- **Features**:
  - Add/Edit/Delete responsibilities
  - Drag-and-drop sorting
  - Time allocation slider (0-100%, visual pie chart)
  - Link to existing Process SOPs (searchable modal)
- **Mobile View**: Stacked cards instead of table

### Step 4: Authority Matrix
- **Layout**: Expandable accordion for each decision area
- **Fields per row**:
  - Decision Area (text input)
  - Authority Level (text input with suggestions)
  - Approval Required (conditional field)
  - Escalation Path (text input)

### Step 5: Performance Metrics
- **Layout**: Card grid with metric cards
- **Each Metric Card**:
  - Metric Name
  - Target (with validation for numeric targets)
  - Measurement Frequency (select dropdown)
  - Weight (slider 0-100)
  - Visual indicator showing weight proportion

### Step 6: Position Requirements
- **Layout**: Categorized sections with toggle switches
- **Sections**:
  - Minimum Qualifications (required toggle on)
  - Preferred Qualifications (required toggle off)
  - Technical Skills (tag input with suggestions)
  - Soft Skills (tag input)
  - Physical Requirements (checkboxes)

### Step 7: Training & Development
- **Layout**: Timeline view using vertical stepper
- **Features**:
  - Add timeline phases (Weeks 1-4, Months 2-3, etc.)
  - Each phase has:
    - Title
    - Activities (bullet points)
    - Training SOPs to complete
    - Completion criteria

### Step 8: Succession Plan
- **Layout**: Visual flowchart for desktop, list for mobile
- **Components**:
  - Primary Backup (search select of positions)
  - Secondary Backup (search select)
  - Succession Path (multi-step visualization)
  - Readiness Criteria (checklist)

### Step 9: Resources & Tools
- **Layout**: Two-column grid (Systems | Equipment)
- **Systems Section**:
  - System Name
  - Access Level Required
  - Request Process (link to SOP)
- **Equipment Section**:
  - Checkbox list with quantities

### Step 10: Communication Protocols
- **Layout**: Calendar-like view for meetings
- **Each Meeting**:
  - Name
  - Frequency (daily/weekly/monthly)
  - Participants (tag input)
  - Purpose (textarea)

### Step 11: Compensation (HR-Confidential)
- **Layout**: Locked section with permission check
- **Features**:
  - Only visible to HR role
  - Salary range sliders
  - Bonus structure inputs
  - Benefits eligibility matrix
- **UI**: Shield icon with "HR Confidential" badge

### Step 12: Linked Documents
- **Layout**: Drag-and-drop document connections
- **Features**:
  - Link to existing Process SOPs
  - Upload supporting documents
  - Categorize links (Policy, Form, Reference)
- **Visual**: Network graph showing connections

### Step 13: Review & Preview
- **Layout**: Split view (Form on left, Preview on right)
- **Features**:
  - Toggle between edit/preview
  - Real-time preview updates
  - Validation summary
  - "Mark as Complete" checkbox for each section
- **Mobile**: Tabbed view (Edit | Preview)

---

## 🔗 Integration Points

### 1. With Jobs-Careers Module
```typescript
// When Position SOP is marked "Active" and ready for posting:
// 1. Auto-generate job posting template
// 2. Pre-fill job posting form with SOP data
// 3. Create link between position and job posting

// API: POST /api/job-postings/generate-from-sop/:sopId
// This will be implemented in Phase 2
```

### 2. With HR-Onboarding Module
```typescript
// When employee is assigned to position:
// 1. Auto-create onboarding checklist
// 2. Assign required SOP training
// 3. Set up 90-day review schedule

// API: POST /api/onboarding/generate-from-sop/:sopId/:employeeId
// This will be implemented in Phase 2
```

### 3. Process SOP Linking
```typescript
// Search and link to existing Process SOPs
// Uses the same Process SOP database as other modules
// API: GET /api/process-sops/search?q=:query
```

---

## 📱 Mobile-Specific Implementation

### 1. Sticky Action Footer
```tsx
// components/sop/mobile/SOPMobileFooter.tsx
<SOPMobileFooter className="sticky bottom-4 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-t">
  <div className="flex justify-between items-center p-4">
    <MobileStepIndicator />
    <div className="flex gap-2">
      <MobileSaveButton />
      <MobileNextButton />
    </div>
  </div>
</SOPMobileFooter>
```

### 2. Mobile-Optimized Tables
```tsx
// Responsive table that converts to cards on mobile
<div className="hidden md:block">
  <DesktopTable />
</div>
<div className="md:hidden">
  <MobileCardView />
</div>
```

### 3. Touch-Friendly Controls
- All buttons: `min-h-[44px] min-w-[44px]`
- Inputs: `text-lg` on mobile for better readability
- Sliders: Enhanced touch area with `p-3`
- Dropdowns: Full-screen modal on mobile

---

## 🎨 UI Component Specifications

### Status Badges
```tsx
const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
  active: { color: 'bg-green-100 text-green-800', label: 'Active' },
  pending_review: { color: 'bg-yellow-100 text-yellow-800', label: 'Review Due' },
  expired: { color: 'bg-red-100 text-red-800', label: 'Expired' },
  archived: { color: 'bg-blue-100 text-blue-800', label: 'Archived' }
};
```

### Wizard Step Indicator
```tsx
// Horizontal scrollable pills on mobile
<div className="flex overflow-x-auto pb-2 -mb-2 scrollbar-hide">
  {steps.map((step, index) => (
    <PillStep
      key={step.id}
      index={index}
      label={step.label}
      isActive={currentStep === index}
      isCompleted={completedSteps.includes(index)}
    />
  ))}
</div>
```

### Save State Indicator
```tsx
// Standard pattern from other modules
<SaveIndicator
  isSaving={isSaving}
  lastSaved={lastSaved}
  hasUnsavedChanges={hasUnsavedChanges}
/>
```

---

## 🔧 Build Instructions

### 1. Database Setup
```bash
# Generate types from Supabase
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts

# Run migrations
npx supabase db push
```

### 2. Component Generation
```bash
# Use shadcn/ui for base components
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
```

### 3. Module Structure
```
app/dashboard/marketplace/sop-generator/
├── page.tsx                          # Main module page
├── layout.tsx                        # Module layout
├── create/
│   ├── page.tsx                      # Wizard entry
│   └── [step]/
│       └── page.tsx                  # Dynamic step pages
├── [id]/
│   ├── page.tsx                      # SOP detail view
│   ├── edit/
│   │   └── page.tsx                  # Edit existing SOP
│   └── preview/
│       └── page.tsx                  # Preview mode
└── components/
    ├── wizard/                       # Wizard components
    ├── forms/                        # Form sections
    ├── preview/                      # Preview components
    ├── tables/                       # Data tables
    └── mobile/                       # Mobile-specific components
```

### 4. Testing Requirements
```typescript
// End-to-end tests should cover:
// 1. Wizard flow completion
// 2. Form validation
// 3. Save/load functionality
// 4. Mobile responsiveness
// 5. Permission-based access (HR Confidential section)

// Use Playwright for E2E tests
```

---

## 📝 Phase 2 Integration Notes

### Future Integrations (Not in Current Build)
1. **Auto-Generated Job Postings**
   - Connect to existing Jobs-Careers module
   - Template mapping system
   - One-click posting generation

2. **Onboarding Checklist Automation**
   - Connect to HR-Onboarding module
   - Auto-assign SOP training
   - Progress tracking integration

3. **Review Escalation System**
   - Automated email notifications
   - Escalation workflows
   - Calendar integration for reviews

4. **Document Export**
   - PDF generation
   - Word template export
   - Shareable links

---

## ✅ Success Criteria

### Build Must Pass:
1. **No Console Errors**: Clean build with TypeScript strict mode
2. **Responsive Design**: Passes Lighthouse mobile audit
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Core Web Vitals thresholds met
5. **End-to-End Tests**: 100% pass rate on critical user flows

### User Acceptance Criteria:
1. Users can complete SOP creation in under 15 minutes
2. Mobile experience is as functional as desktop
3. Preview accurately reflects final document
4. All validation provides clear error messages
5. Save states are clearly communicated

---

## 🚨 Edge Cases to Handle

1. **Network Disconnection**: Auto-save draft locally, sync when reconnected
2. **Concurrent Editing**: Last-write-wins with user notification
3. **Large Documents**: Virtual scrolling for long sections
4. **Permission Changes**: Graceful degradation when HR access revoked
5. **Data Migration**: Import from existing position descriptions

---

## 📋 Implementation Priority

### Phase 1 (Current Build) - Core SOP Creation
- [ ] Database schema
- [ ] Wizard framework
- [ ] Basic form sections (1-6)
- [ ] Preview functionality
- [ ] Mobile responsiveness
- [ ] Save/load functionality

### Phase 2 (Future) - Integration & Automation
- [ ] Job posting auto-generation
- [ ] Onboarding checklist creation
- [ ] Review escalation system
- [ ] Advanced analytics
- [ ] Bulk operations
- [ ] API for external systems

---

**Note for AI Agent**: This specification follows the established patterns from other marketplace modules. Use the existing component library (shadcn/ui), styling patterns (Tailwind with HSL variables), and interaction patterns (wizard flow with sticky footer). Ensure all components are properly typed with TypeScript and follow the mobile-first responsive design approach demonstrated in the linked modules.