# Starter Club Monorepo

**San Francisco's launchpad for community creators**

Starter Club is a platform that bridges the gap between idea and action, helping neighbors build the projects, businesses, and groups that make San Francisco better. We provide a supportive environment where anyone can become creators, founders, and opportunity-makers.

## 📁 Project Structure

This repository is a **Monorepo** managing multiple applications sharing a common ecosystem.

```
starter-club/
├── apps/
│   ├── marketing-website/    # Main platform & public landing pages
│   ├── onboard-app/          # Kiosk/Tablet App (Vite SPA)
│   ├── flight-deck/          # Member Dashboard
│   └── super-admin/          # Super Admin Dashboard
├── packages/
│   ├── shared-types/         # Unified Database Types
│   ├── ui/                   # Shared UI (Shadcn + Antigravity Design System)
│   └── utils/                # Shared Logic
├── conductor/                # Product context & tech stack documentation
├── scripts/                  # Utility & verification scripts
├── supabase/                 # Shared Database config & migrations
└── package.json              # Root workspace (Turborepo)
```

## 🎯 Applications

### 1. Marketing Website (`@starter-club/marketing-website`)
- **Path**: `apps/marketing-website`
- **Port**: `3000`
- **Tech**: Next.js 16, App Router, Clerk Auth, Framer Motion
- **Function**: Member dashboard, partner portal, public landing pages
- **Key Routes**:
  - `/` - Landing page with Unicorn Test
  - `/dashboard` - Member dashboard
  - `/employee-portal` - Protected staff access
  - `/partner-portal` - Partner access
  - `/events` - Event Management System (Host, Success Stories, Summit)
  - `/test-users` - Development-only test user login

### 2. Onboard App (`@starter-club/onboard-app`)
- **Path**: `apps/onboard-app`
- **Port**: `5173` (Vite default)
- **Tech**: Vite, React 19 SPA, Recharts
- **Function**: Tablet-based kiosk for check-ins, guest registration, and room booking

### 3. Flight Deck (`@starter-club/flight-deck`)
- **Path**: `apps/flight-deck`
- **Port**: `3002`
- **Tech**: Next.js 16, Tailwind, Vitest
- **Function**: Internal member dashboard with progress tracking

### 4. Super Admin (`@starter-club/super-admin`)
- **Path**: `apps/super-admin`
- **Port**: `3001`
- **Tech**: Next.js 16, Shadcn UI, Shared Packages
- **Function**: Consolidated admin dashboard for marketplace, members, and system management
- **Features**: 
  - Marketplace management, member oversight, audit logs
  - **"View As" Role Simulation**: Simulate dashboard experiences for Members, Partners, Sponsors, and Employees.

### 5. Unified Identity System
- **RBAC**: Granular permission system based on roles (Member, Partner, Sponsor, Employee).
- **Multi-Role Support**: Users can hold multiple roles simultaneously.
- **Frontend Integration**: `useUserRoles` hook and `PermissionGuard` component for dynamic UI.
- **Security**: Hardened RLS policies using Clerk JWT 'sub' claim and text-based User IDs for maximum compatibility.

### 6. Dashboard Modernization
- **Theme Support**: Integrated Light, Dark, and "Race Track" modes.
- **Race Track View**: Specialized high-contrast, data-dense "F1 Telemetry" dashboard for advanced users.
- **Sidebar**: Dynamic navigation based on roles with direct Home/Logout controls.
- **Profile Settings Modal**: Tabbed settings interface with role-specific content (Account, Profile, Notifications, Subscription tabs).

### 7. Multi-Flow Onboarding System
- **Member Onboarding** (`/member-onboarding`) - Course member signup with subscription selection
- **Partner Onboarding** (`/partner-onboarding`) - Partner registration with expertise/capacity selection
- **Sponsor Onboarding** (`/sponsor-onboarding`) - Sponsor intake with organization details
- **Theme-Aware UI**: Race Track theme integration with "Lap Counter" progress indicators
- **Department Assignment**: Users can associate with departments during onboarding

### 8. Employee Tracking & Payroll System
- **Employee Management**: Full employee lifecycle tracking with departments and managers
- **Payroll Processing**: Payroll runs, entries, deductions, and contributions
- **Cost Allocation**: Department and project-based cost tracking
- **Employee Timeline**: Historical view of employee changes (position, salary, department)
- **Finance Dashboard**: Admin interface for expense and payroll management

### 9. Accounting & Financial Integration
- **Double-Entry Accounting**: Chart of accounts, journal entries, and account balances
- **Stripe Integration**: Automated income tracking via webhooks
- **Expense Management**: Vendor bills, expense approvals, and reimbursements
- **Reporting**: Real-time views for account balances and transactions

---

## 📦 Shared Packages

### `@starter-club/shared-types`
TypeScript database types auto-generated from Supabase schema.

### `@starter-club/ui`
- **Shadcn Components** (`src/components/`) - Standard UI components
- **Antigravity Design System** (`src/antigravity/`) - Premium F1-telemetry inspired UI with cyber-physical industrial aesthetic

### `@starter-club/utils`
Shared utilities including date-fns helpers and common logic.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm (workspaces enabled)
- Supabase Project & Clerk Account

### Installation

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd starter-club
   npm install  # Installs dependencies for ALL apps
   ```

2. **Environment Setup**

   Copy `.env.example` to `.env.local` in the root and each app directory:

   **Root `.env.local`:**
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/register
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=

   # UploadThing (File Uploads)
   UPLOADTHING_TOKEN=

   # Test Users Portal (Development Only)
   # WARNING: NEVER enable in production!
   NEXT_PUBLIC_ENABLE_TEST_USERS=false
   ```

   **Onboard App (`apps/onboard-app/.env`):**
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

3. **Running the Apps**

   Run all apps simultaneously from the root:
   ```bash
   npm run dev
   # Marketing at localhost:3000
   # Super Admin at localhost:3001
   # Flight Deck at localhost:3002
   # Onboard App at localhost:5173
   ```

   Or run them independently:
   ```bash
   # Marketing Website (localhost:3000)
   npm run dev:marketing

   # Flight Deck (localhost:3002)
   npm run dev:flight-deck

   # Onboard App (navigate to directory)
   cd apps/onboard-app && npm run dev

   # Super Admin (navigate to directory)
   cd apps/super-admin && npm run dev
   ```

4. **Verify Setup**
   
   Run the verification script to check your structure:
   ```bash
   ./scripts/verify.sh
   ```

---

## 🔧 Utility Scripts

Located in `scripts/`:

| Script | Purpose |
|--------|---------|
| `verify.sh` | Full verification suite (structure, env, lint, build, Supabase) |
| `check-env-safety.sh` | Validates environment variable security |
| `setup-vercel.sh` | Automates Vercel project setup |
| `db-backup.sh` | Database backup utility |
| `create-test-users.ts` | Creates test user accounts in Supabase |
| `seed-flight-deck-test-data.ts` | Seeds Flight Deck with test data |
| `verify-checklist.ts` | Validates checklist data integrity |
| `verify-flight-deck-data.ts` | Validates Flight Deck data |
| `verify-marketplace-v3.ts` | Validates marketplace module data |
| `verify_rbac_full.ts` | Full RBAC system verification |
| `verify_employee_system.ts` | Employee tracking system validation |
| `check-rls-policies.ts` | Validates RLS policy configuration |
| `test-onboarding-flow.ts` | Tests onboarding flow end-to-end |
| `diagnose-auth-flow.ts` | Diagnoses authentication issues |


**Quick Commands:**
```bash
# Run environment safety check
npm run check-safety

# Run full verification suite
./scripts/verify.sh

# Skip builds during verification
./scripts/verify.sh --skip-build
```

---

## 🗄️ Database (Supabase)

**50+ migrations** in `supabase/migrations/` managing the complete schema.

### Core Tables
- **`profiles`** - User profiles synced with Clerk
- **`roles`** - System roles (e.g. member, sponsor)
- **`permissions`** - Granular access capabilities
- **`user_roles`** - User-to-Role assignments
- **`role_permissions`** - Role-to-Permission definitions
- **`user_departments`** - User department assignments
- **`activity_log`** - System activity tracking
- **`member_progress`** - Member onboarding progress

### Checklists & Modules
- **`modules`** - Business checklist modules
- **`module_items`** - Items within each module
- **`client_checklists`** - User-specific checklist assignments
- **`client_progress`** - Progress tracking per item

### Marketplace
- **`marketplace_modules`** - Published module templates
- **`marketplace_module_items`** - Template items

### Employee Tracking & Payroll
- **`employees`** - Core employee records with manager hierarchy
- **`departments`** - Organizational departments
- **`employee_positions`**, **`employee_compensation`** - Position and salary history
- **`payroll_runs`**, **`payroll_entries`** - Payroll processing
- **`payroll_deductions`**, **`payroll_contributions`** - Benefits tracking
- **`cost_allocations`** - Department/project cost distribution

### Accounting & Finance
- **`accounts`** - Chart of accounts (assets, liabilities, income, expenses)
- **`journal_entries`**, **`journal_entry_lines`** - Double-entry transactions
- **`vendors`**, **`vendor_bills`** - Accounts payable
- **`expense_reports`**, **`expense_items`** - Employee expense tracking
- **`stripe_transactions`** - Stripe webhook event log

### Audit & Security
- **`audit_logs`** - System audit trail
- **`admin_actions`** - Admin action tracking

### Partners & Scouts
- **`partner_portal`** - Partner access data
- **`scout_program`** - Referral program tracking

### Applying Migrations
```bash
npx supabase link --project-ref exancwcrkqivoaqhmapr
npx supabase db push
```

### Type Generation
Generate TypeScript types (unified for all apps):
```bash
# Must be logged in: npx supabase login
npm run db:generate-types
# This updates packages/shared-types/src/database.types.ts
```

---

## 🚀 Deployment (Monorepo)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Vercel Setup:**
1. Import the repository
2. Create a project for each app (`apps/marketing-website`, etc.)
3. Set **Root Directory** to `apps/[app-name]` in Project Settings
4. Configure environment variables per app

**Automated Setup:**
```bash
./scripts/setup-vercel.sh
```

**Verify Build:**
```bash
npm run build  # Builds all apps via Turborepo
```

---

## 📖 Additional Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed Vercel deployment guide
- **[FlightDeckSetup.md](./FlightDeckSetup.md)** - Flight Deck specific setup
- **[conductor/product.md](./conductor/product.md)** - Product vision & context
- **[conductor/tech_stack.md](./conductor/tech_stack.md)** - Technology stack details
- **[TheRaceTrack/](./TheRaceTrack/)** - Race Track theme documentation

---

## 🔐 Authentication & Navigation

- **Marketing Website** handles authentication via Clerk
- **Onboard App** is designed for physical presence (Kiosk mode)
- Route `/onboard` on marketing site redirects to Onboard App URL
- Test users available at `/test-users` (development only)

---

## 🤝 Contributing

1. Create feature branch
2. Commit changes enforcing monorepo structure
3. Verify all apps build:
   ```bash
   npm run build:marketing
   npm run build:onboard
   npm run build:flight-deck
   npm run build  # Or build all at once
   ```
4. Run verification:
   ```bash
   ./scripts/verify.sh
   ```

---

## 📄 License

Private and proprietary.
