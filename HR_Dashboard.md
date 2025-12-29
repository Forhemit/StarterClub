1. Use @ui_design_architect.md as guidelines for designing the HR Dashboard (http://localhost:3000/dashboard/hr)
2. Use @# Skill Definition: ui_design_architect for additional context and creation
3. Rememeber the standard light dark mode theme and rack track themes should look different with the race track theme being more vibrant and bold and following the race track color scheme
4. The goal of this project is to create a dashboard that is simple and easy to use and understand and allows the user to complete the HR process in a matter of a few clicks
5. The HR process should be follow the text instructions below
6. The HR process should be psychologically rewarding pleasing and designed to make the user want to complete the HR process
7. The dashboard should be fully intergrated into the unified dashboard and should have the same look and feel as the unified dashboard and components
8. Use gamification elements to make the HR process more engaging and interactive
9. Use best practices for HR middleware to make the HR process more engaging and interactive and the HR process should be psychologically rewarding pleasing and designed to make the user want to complete the HR process
10. Before we start building go out and reseach other UI and UX HR designs especially the HR     process of other successful platforms and analyze the design and try to understand why they are converting and try to implement similar elements into our HR process
11. After completing the HR process of the app challenge your design UI and UX chooses and debate if we could have made better choices and try to implement similar elements into our HR process
12. Once completed return to this document and analyze if these 12 steps were completed successfully and if not make the necessary changes to complete the process.
13. Create files and components for the HR dashboard and place them in the appropriate locations
14. The file size should be stand alone and compartmentalized and less than or approximately 800 lines of code per file
15. The file structure should be logical, easy to understand and easy to navigate
16. Test the HR dashboard and make sure it is working correctly and test the supabase connection and make sure it is working correctly
17. Return to this document and analyze if these 17 steps were completed successfully and if not make the necessary changes to complete the process
INSTRUCTIONS:
# Google Antigravity Agent Prompt: HR Interview History & Hire Processing Module

## 🎯 **Agent Context & Task**
You are to build a **Interview History & Hire/No-Hire Processing Module** for our unified HR dashboard at `http://localhost:3000/dashboard/hr`. This module should be accessible only to users with **HR or Super Admin** roles and must integrate seamlessly with our existing dashboard ecosystem http://localhost:3000/dashboard
So when the user clicks on the HR menu item the dashboard should appear in the body of the page and NOT as a modal or popup or new page. It should be integrated into the existing dashboard layout and should have the same look and feel as the existing dashboard layout.
## 📋 **Core Requirements & Constraints**

### **Access Control & Integration**
```javascript
// REQUIRED: Role-based visibility
- Show menu item ONLY for roles: 'hr_admin', 'super_admin', 'hiring_manager'
- Integrate with existing authentication system
- Use existing dashboard layout components
- Maintain consistent navigation patterns
```

### **Theming & Design Systems**
```css
/* Theme Requirements */
1. Standard Light/Dark Mode:
   - Clean, professional aesthetics
   - Accessible color contrast
   - Subtle animations

2. Race Track Theme (Vibrant/Bold):
   - Primary: #FF6B35 (Orange) / #4ECDC4 (Teal)
   - Secondary: #FFE66D (Yellow) / #1A535C (Dark Teal)
   - Accent: #FF9A76 (Coral)
   - Bold typography, energetic animations
   - Racing-inspired progress indicators
```

### **Psychological & UX Principles**
```
Key Psychological Drivers:
1. Completion Satisfaction: Visual progress tracking
2. Decision Confidence: Clear feedback on actions
3. Positive Reinforcement: Celebratory elements for hires
4. Reduced Cognitive Load: 3-click maximum for key actions
5. Gamification: Points, badges, progress bars
```

## 🔍 **Research & Benchmark Analysis**
Before coding, analyze these successful platforms for inspiration:

### **Platforms to Study:**
1. **Greenhouse ATS** - Candidate pipeline visualization
2. **Lever** - Collaborative hiring workflows
3. **BambooHR** - Simple, intuitive HR processes
4. **Workday** - Enterprise-grade decision flows
5. **Ashby** - Modern, data-driven hiring

### **Extract These Elements:**
- Visual candidate cards with quick actions
- Pipeline/stage tracking (Kanban style)
- One-click decision buttons with clear consequences
- Progress indicators for hiring funnel
- Mobile-responsive decision interfaces
- Email template previews before sending

## 🎨 **UI/UX Design Specifications**

### **1. Interview History Dashboard**
```typescript
// Component Structure
<InterviewDashboard>
  ├── <Header>
  │    ├── SearchBar (candidates/positions)
  │    ├── FilterChips (status: all, hired, waiting, rejected)
  │    └── QuickStats (interviews/month, hire-rate, avg-time)
  │
  ├── <CandidatePipelineView>
  │    ├── StageColumn: "Screening" (drag-drop enabled)
  │    ├── StageColumn: "Technical Interview"
  │    ├── StageColumn: "Final Round"
  │    └── StageColumn: "Decision Pending"
  │
  └── <CandidateCard>
       ├── Avatar + Name + Position
       ├── InterviewDate + Interviewers
       ├── ScoreBadge (0-5 stars)
       ├── FeedbackSnippets
       └── ActionButtons (View Details, Make Decision)
```

### **2. Candidate Detail View**
```typescript
<CandidateDetailModal>
  ├── <CandidateProfile>
  │    ├── Photo, Contact Info, Resume
  │    ├── Interview Timeline (visual)
  │    └── Skills/Tags (clickable for filtering)
  │
  ├── <InterviewFeedbackSection>
  │    ├── Individual interviewer feedback
  │    ├── Scoring breakdown
  │    └── Overall recommendation
  │
  ├── <DecisionPanel>  // CRITICAL: Gamified elements
  │    ├── "🚀 Hire" Button (primary, vibrant)
  │    │    └── Triggers: offer code generation
  │    │         └── Shows: confetti animation
  │    │         └── Awards: "Great Hire!" badge
  │    │
  │    ├── "⏳ Wait Pool" Button (secondary)
  │    │    └── Triggers: polite rejection email
  │    │    └── Shows: "Added to Talent Pool" message
  │    │
  │    └── "Not Now" Button (tertiary)
  │         └── Triggers: rejection with feedback option
  │
  └── <AuditLog>
       └── All decision history
```

### **3. Offer Code Generation Flow**
```typescript
// Gamified Offer Creation
1. Click "Hire" → Show celebratory animation
2. Modal: "🎉 Congratulations! You're making an offer!"
3. Auto-generate secure offer code (e.g., "OFFER-XYZ123")
4. Preview email template with code embedded
5. One-click send + track acceptance
6. Award points to hiring manager in dashboard
```

## 🎮 **Gamification Elements**

### **Progression & Rewards**
```javascript
const gamification = {
  points: {
    completeInterview: 10,
    makeHireDecision: 50,
    candidateHired: 100,
    fastDecision: 25, // within 24h
  },
  badges: [
    { id: 'speed_hire', name: 'Speed Demon', desc: '5 hires within 48h of interview' },
    { id: 'talent_scout', name: 'Talent Scout', desc: '10 candidates to wait pool' },
    { id: 'perfect_match', name: 'Perfect Match', desc: 'Hire with 5-star feedback' }
  ],
  progress: {
    monthlyQuota: 'Hiring Goal: 8/10 hires this month',
    teamRanking: 'You’re #2 in hiring speed this week'
  }
};
```

### **Micro-Interactions**
```css
/* Celebratory Animations */
@keyframes confetti {
  0% { transform: translateY(-100px) rotate(0deg); }
  100% { transform: translateY(500px) rotate(360deg); }
}

/* Decision Feedback */
.hire-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
}

/* Progress Visualization */
.progress-tracker {
  background: linear-gradient(90deg, #4CAF50 var(--progress), #f0f0f0 var(--progress));
  transition: --progress 0.5s ease;
}
```

## 📁 **File Structure & Organization**
```
src/
├── app/
│   └── dashboard/
│       └── hr/
│           ├── interview-history/
│           │   ├── page.tsx                 # Main page (< 800 lines)
│           │   ├── layout.tsx               # Section layout
│           │   └── actions/                 # Server actions
│           │       ├── offer-actions.ts
│           │       └── candidate-actions.ts
│           │
│           └── layout.tsx                   # HR dashboard layout
│
├── components/
│   └── hr/
│       ├── interview-history/
│       │   ├── CandidatePipeline.tsx        # Kanban view
│       │   ├── CandidateCard.tsx            # Individual card
│       │   ├── DecisionPanel.tsx            # Hire/Wait buttons
│       │   ├── OfferCodeModal.tsx           # Offer generation
│       │   ├── WaitPoolManager.tsx          # Talent pool management
│       │   └── InterviewAnalytics.tsx       # Metrics dashboard
│       │
│       ├── gamification/
│       │   ├── PointsDisplay.tsx
│       │   ├── BadgeAward.tsx
│       │   └── ProgressTracker.tsx
│       │
│       └── shared/
│           └── AuditLogViewer.tsx           # Reusable audit component
│
├── lib/
│   ├── hr/
│   │   ├── interview-utils.ts              # Helper functions
│   │   ├── offer-generator.ts              # Secure code generation
│   │   └── email-templates.ts              # Offer/rejection emails
│   │
│   └── gamification/
│       └── reward-system.ts                # Points/badges logic
│
├── types/
│   └── hr.ts                               # TypeScript interfaces
│
└── styles/
    └── hr-themes.css                       # Theme-specific styles
```

## 🔗 **Supabase Integration Schema**
```sql
-- Extend existing tables with these additions
CREATE TABLE interview_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id),
  position_id UUID REFERENCES positions(id),
  interview_date TIMESTAMP WITH TIME ZONE,
  interviewers JSONB, -- Array of user IDs
  feedback JSONB, -- Structured feedback
  score INTEGER CHECK (score >= 0 AND score <= 5),
  result TEXT CHECK (result IN ('strong_yes', 'yes', 'hold', 'no', 'strong_no')),
  decision_made_at TIMESTAMP WITH TIME ZONE,
  decided_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conditional_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id),
  offer_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  onboarding_triggered BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security on all tables
ALTER TABLE interview_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditional_offers ENABLE ROW LEVEL SECURITY;
```

## 🧪 **Testing Specifications**
```typescript
// Test Cases to Implement
describe('Interview History Module', () => {
  it('should only show to HR/Super Admin roles', () => {});
  it('should generate unique offer codes', () => {});
  it('should trigger onboarding on offer acceptance', () => {});
  it('should log all decisions to audit trail', () => {});
  it('should send appropriate emails for hire/wait decisions', () => {});
  it('should award points for completed actions', () => {});
  it('should sync with accounting on hire', () => {});
  it('should respect theme variations', () => {});
});
```

## 🔄 **Workflow Implementation**
```javascript
// Simplified 3-Click Hiring Process
Click 1: Select candidate from pipeline
Click 2: Click "Hire" button (triggers modal)
Click 3: Click "Send Offer" in modal

// Behind the scenes:
1. Generate offer code
2. Create pending employee record
3. Send email with code
4. Log action to audit trail
5. Award points to hiring manager
6. Update hiring metrics
7. Sync with accounting system
```

## 📊 **Success Metrics to Track**
```typescript
const metrics = {
  userEngagement: [
    'time_to_decision',
    'clicks_to_complete_hire',
    'module_return_rate'
  ],
  hiringEfficiency: [
    'interview_to_offer_ratio',
    'time_from_interview_to_offer',
    'wait_pool_conversion_rate'
  ],
  userSatisfaction: [
    'net_promoter_score_for_module',
    'user_feedback_on_decisions',
    'adoption_rate_by_hr_team'
  ]
};
```

## 🚨 **Critical Implementation Notes**

### **Before Building:**
1. Research competitor platforms (2 hours maximum)
2. Create wireframes in Figma with both themes
3. Validate workflow with actual HR users
4. Ensure all Supabase connections are tested

### **During Development:**
1. Keep each component under 800 lines
2. Implement proper error boundaries
3. Add loading states for all async actions
4. Test with both light/dark and race track themes

### **After Completion:**
1. Self-critique: Could we reduce clicks further?
2. Validate with HR team for psychological satisfaction
3. Check all 17 steps from original prompt
4. Performance test with 1000+ candidate records

## 🎯 **Agent Instructions Summary**
Build a visually engaging, gamified interview history module that makes hiring decisions psychologically rewarding. Focus on minimal clicks, clear feedback, and seamless integration with existing systems. Prioritize user delight while maintaining professional HR standards. Remember: **Every click should feel satisfying, every decision should feel confident.**

---
**Agent Action Required:** Begin execution following these specifications, with special attention to steps 10-12 (research and self-critique) before final delivery. Report completion of all 17 steps at the end.

To build a comprehensive HRIS (Human Resource Information System), you can consider adding the following modules and features, categorized by function.

## 🔍 Core HR & Employee Lifecycle
| Module/Feature | What it adds | Why it’s valuable |
| :--- | :--- | :--- |
| **Onboarding & Offboarding** | Automated checklists, e‑signature for paperwork, IT provisioning/de‑provisioning, welcome kits. | Streamlines the hire‑to‑retire cycle, reduces manual work, and ensures compliance[reference:0]. |
| **Benefits Administration** | Manage health, pension, insurance, and other benefits; open‑enrollment workflows; plan comparisons. | A key part of total compensation and employee satisfaction[reference:1]. |
| **Employee Self‑Service Portal** | Let employees view/update personal data, download tax forms, request time off, and access company documents. | Reduces HR administrative burden and improves employee experience[reference:2]. |
| **Document Management** | Centralized storage for contracts, policies, certificates, and other employee‑related files. | Keeps records organized, searchable, and audit‑ready. |
| **Compliance Tracking** | Alerts for legal changes, OSHA logs, policy acknowledgments, and compliance reporting. | Mitigates legal and regulatory risks[reference:3]. |

## 🎯 Talent & Performance
| Module/Feature | What it adds | Why it’s valuable |
| :--- | :--- | :--- |
| **Learning & Development (LMS)** | Create training courses, track certifications, assign learning paths, and measure training effectiveness. | Helps close skill gaps and supports career growth[reference:4]. |
| **Succession Planning** | Identify high‑potential employees, create career paths, and plan for critical‑role vacancies. | Ensures business continuity and talent pipeline[reference:5]. |
| **Employee Engagement & Surveys** | Pulse surveys, feedback tools, recognition programs, and engagement analytics. | Provides real‑time insights into morale and culture[reference:6]. |
| **Goal Setting & OKRs** | Set, track, and align individual and team objectives with company goals. | Drives performance and alignment beyond annual reviews. |
| **360‑Degree Feedback** | Collect feedback from peers, subordinates, and managers for a holistic view of performance. | Enriches performance data and development planning. |

## ⏰ Time & Attendance
| Module/Feature | What it adds | Why it’s valuable |
| :--- | :--- | :--- |
| **Time Tracking & Timesheets** | Clock‑in/out, project‑based time logging, overtime calculation, and integration with payroll. | Essential for accurate pay, especially for hourly workers[reference:7]. |
| **Employee Scheduling** | Drag‑and‑drop shift planning, availability management, and coverage optimization. | Improves workforce planning and reduces scheduling conflicts[reference:8]. |
| **Absence Management** | Track sick leave, parental leave, jury duty, and other types of absence beyond vacation. | Provides a complete view of employee availability and compliance. |
| **Biometric/Geo‑fencing Clock‑in** | Integrate with biometric devices or mobile location for accurate attendance. | Reduces “buddy punching” and ensures reliable data[reference:9]. |

## 💰 Payroll & Compensation
| Module/Feature | What it adds | Why it’s valuable |
| :--- | :--- | :--- |
| **Compensation Management** | Manage bonuses, equity, incentives, and salary bands beyond basic payroll. | Supports total‑reward strategies and pay‑for‑performance models. |
| **Tax & Deduction Management** | Automate tax withholdings, garnishments, and other deductions. | Ensures payroll accuracy and compliance. |
| **Payroll Reporting & Reconciliation** | Detailed reports for finance, audit trails, and reconciliation with accounting. | Strengthens the sync with accounting that you already require. |

## 📊 Analytics & Reporting
| Module/Feature | What it adds | Why it’s valuable |
| :--- | :--- | :--- |
| **Workforce Analytics (Advanced)** | Predictive analytics, turnover risk, headcount forecasting, diversity metrics, and cost‑per‑hire. | Moves beyond basic reports to strategic insights[reference:10]. |
| **Real‑time Dashboard Widgets** | Customizable KPI widgets (e.g., turnover rate, time‑to‑hire, training spend). | Gives HR and managers an at‑a‑glance view of critical metrics. |
| **Ad‑hoc Report Builder** | Drag‑and‑drop interface for creating custom reports without IT help. | Empowers HR to answer unique business questions quickly. |
| **Scheduled & Automated Reports** | Automatically generate and email reports (daily, weekly, monthly). | Saves time and ensures stakeholders receive timely data. |

## 🔗 Integration & Security
| Module/Feature | What it adds | Why it’s valuable |
| :--- | :--- | :--- |
| **API for 3rd‑Party Integrations** | Connect with accounting software (e.g., QuickBooks, Xero), email/calendar, Slack, etc. | Ensures data flows seamlessly across systems. |
| **Role‑Based Access Control (RBAC)** | Granular permissions for different HR roles (e.g., recruiter, payroll admin, manager). | Enhances security and data privacy beyond basic “user roles.” |
| **Audit Trail & Version History** | Track every change to employee data, who made it, and when (already requested). | Critical for compliance and troubleshooting. |
| **Data Encryption & Backup** | End‑to‑end encryption, regular backups, and disaster‑recovery plans. | Protects sensitive employee information. |

## 🚀 Advanced & UX Enhancements
| Module/Feature | What it adds | Why it’s valuable |
| :--- | :--- | :--- |
| **Mobile App** | Allow employees and managers to perform key tasks (request time off, approve requests, view payslips) on the go. | Increases adoption and convenience. |
| **AI‑Powered Insights** | Predict attrition, recommend training, or match candidates to internal roles. | Adds intelligent automation to HR decision‑making. |
| **Workflow Automation** | Custom approval flows for leave, expenses, promotions, etc. | Reduces manual steps and speeds up processes. |
| **Multi‑language & Multi‑currency** | Support for global teams if your organization operates in multiple countries. | Essential for multinational workforce management[reference:11]. |
| **Employee Wellness Tracking** | Manage wellness programs, mental‑health resources, and fitness challenges. | Boosts employee well‑being and productivity[reference:12]. |
Based on your requirements, here’s a comprehensive design for an **Interview History & Hire/No‑Hire Processing** dashboard section that integrates with your existing HR system. This module will centralize candidate tracking, automate post-interview decisions, and seamlessly connect to onboarding.

## 🎯 **Module Overview**
This section will serve as the central hub for managing candidates after interviews. It will track every interview, store feedback, and provide one‑click actions to either **trigger a conditional offer** (starting onboarding) or **place the candidate in a wait pool** (keeping them for future roles). All data is logged for audit trails and reporting.

## 📋 **Key Features & Capabilities**

| Feature | Description |
|:---|:---|
| **1. Interview History Tracking** | A complete record of each candidate’s interviews: date, interviewers, scores, feedback, notes, and overall result (e.g., “Strong Yes,” “No,” “Hold”). |
| **2. Hire Trigger with Conditional Offer Code** | When a candidate is selected, generate a unique **offer code** that unlocks a conditional offer letter. The system automatically sends the code via email and initiates the onboarding workflow. |
| **3. Wait Pool Management** | For candidates not selected now, add them to a searchable talent pool with tags (skills, experience). The system sends a polite rejection email and can alert recruiters when matching future roles open. |
| **4. Integration with Onboarding** | The hire trigger automatically creates a new employee profile, triggers onboarding checklists, and notifies relevant teams (IT, payroll, accounting). |
| **5. Reporting & Analytics** | Pre‑built reports on interview‑to‑offer ratios, time‑to‑hire, source effectiveness, and diversity metrics. |
| **6. Full Audit Log** | Every status change, note addition, and email sent is logged with timestamp and user ID for compliance. |

## 🗃️ **Suggested Data Model**
Extend your existing database with tables like:

| Table | Key Fields |
|:---|:---|
| **InterviewHistory** | `interview_id`, `candidate_id`, `position_id`, `interview_date`, `interviewers`, `feedback`, `score`, `result`, `created_at` |
| **Candidate** | `candidate_id`, `first_name`, `last_name`, `email`, `phone`, `resume_url`, `source`, `status` |
| **ConditionalOffer** | `offer_id`, `candidate_id`, `position_id`, `offer_code`, `expiry_date`, `status`, `sent_at`, `accepted_at` |
| **WaitPool** | `pool_id`, `candidate_id`, `added_date`, `tags`, `notes`, `last_contact_date` |
| **AuditLog** | `log_id`, `user_id`, `action`, `entity_type`, `entity_id`, `old_value`, `new_value`, `timestamp` |

## 🖥️ **UI/UX Components**
- **Interview History List**: A searchable, filterable table showing candidates, interview dates, results, and actions.
- **Candidate Detail View**: A profile with all interview notes, feedback, and a timeline of interactions.
- **Hire/No‑Hire Decision Panel**: Buttons for “Send Conditional Offer” and “Add to Wait Pool” with confirmation modals.
- **Offer‑Code Management**: A section to generate, view, and revoke offer codes.
- **Wait‑Pool Dashboard**: A visual board of wait‑pool candidates with quick filters by skills/tags.

## 🔄 **Workflow – How It Works**
1. **Interview Completed** → Recruiter enters feedback and selects a result (e.g., “Recommend Hire”).
2. **Decision Point**:
    - **Hire**: Click “Send Conditional Offer.” System generates a unique offer code, emails it to the candidate, and creates a pending employee record.
    - **No Hire**: Click “Add to Wait Pool.” System sends a polite rejection email and adds candidate to the talent pool.
3. **Onboarding Trigger** → When the candidate redeems the offer code, the system automatically:
    - Creates an employee profile.
    - Launches the onboarding checklist.
    - Syncs with accounting for payroll setup.
4. **Audit & Reporting** → All steps are logged; reports can be generated on interview metrics, offer acceptance rates, and pool utilization.

## 🔗 **Integration Points**
- **Accounting/ERP**: Sync new‑hire data for payroll setup (e.g., via API).
- **Email Service**: Send automated offer and rejection emails.
- **Onboarding Module**: Trigger onboarding tasks and document collection.
- **Logging Service**: Record all changes for audit trails.
- **Reporting Engine**: Feed data into HR analytics dashboards.

## 📊 **Sample Reports**
- **Interview‑to‑Offer Ratio**: How many interviews lead to offers.
- **Time‑to‑Hire**: Average days from interview to offer acceptance.
- **Wait‑Pool Utilization**: How many wait‑pool candidates are later hired.
- **Diversity Metrics**: Interview results by gender, ethnicity, etc.

## ⚠️ **Implementation Considerations**
- **Security**: Offer codes should be unique, encrypted, and expire after a set period.
- **Compliance**: Ensure email templates and data storage comply with regulations (e.g., GDPR).
- **Permissions**: Restrict hire/no‑hire decisions to authorized roles (hiring managers, HR).
- **Testing**: Pilot the workflow with a small team before full rollout.

## 🚀 **Next Steps**
1. **Define the data model** and extend your existing database.
2. **Build the UI components** (list, detail view, decision panel).
3. **Implement the offer‑code generator** and email automation.
4. **Integrate with onboarding and accounting** systems.
5. **Add audit logging and pre‑built reports**.
6. **Test thoroughly** with real hiring scenarios before going live.

This module will streamline your post‑interview process, reduce manual work, improve candidate experience, and provide full visibility into hiring outcomes.