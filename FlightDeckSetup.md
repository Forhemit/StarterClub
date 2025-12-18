Project Brief: Flight Deck App Implementation
Project Context & Constraints
We're adding a Flight Deck dashboard app to our existing Starter Club monorepo. Key context:

Current Setup:

Monorepo with npm workspaces (apps/*)

Existing apps: apps/marketing-website (Clerk auth) and apps/onboard

Supabase backend with shared database schema

TypeScript, React, Tailwind across the stack

Flight Deck Requirements:

Standalone authenticated dashboard at apps/flight-deck

Must integrate with existing Supabase auth/tables

Separate routing from other apps

Serve at /flight-deck/* in production

Development Guardrails:

Read existing configs, don't overwrite unrelated files

Copy/reuse patterns from apps/onboard where applicable

No destructive operations or system-level changes

Implementation Tasks
Phase 1: App Bootstrap
Task 1.1 - Create App Structure

text
Create `apps/flight-deck/` with:
- Next.js 14 (App Router) matching onboard app's structure
- TypeScript + Tailwind configuration
- Basic `package.json` with workspace-compatible scripts
Task 1.2 - Environment Setup

text
Copy Supabase config from onboard app:
- Create `.env.local` with `NEXT_PUBLIC_SUPABASE_*` variables
- Reference existing Supabase types from shared definitions
Phase 2: Core Infrastructure
Task 2.1 - Supabase Integration

text
Create `apps/flight-deck/lib/supabase/` with:
- `client.ts` - Initialize Supabase client with existing config
- `auth-helpers.ts` - Session utilities (copy patterns from onboard app)
- `types.ts` - Generate/import shared database types
Task 2.2 - Authentication & Middleware

text
Implement route protection:
- `middleware.ts` - Check Supabase session, redirect to marketing site auth
- `app/layout.tsx` - Wrap with Supabase provider
- Handle auth state in server components
Phase 3: Routing & Layout
Task 3.1 - App Router Structure

text
Implement this exact routing structure:
app/
├── (auth)/
│   ├── login/
│   └── callback/
├── dashboard/
│   ├── layout.tsx      # Dashboard shell with sidebar
│   ├── page.tsx        # Command Console (default view)
│   ├── my-board/
│   ├── mission-control/
│   └── settings/
└── api/auth/           # Auth webhooks if needed
Task 3.2 - Dashboard Layout

text
Create responsive layout with:
- Sidebar navigation (desktop) / bottom nav (mobile)
- Header with user menu and flight status
- Breadcrumbs for nested routes
- Consistent spacing/typography with marketing site
Phase 4: Dashboard Views (Skeleton)
Task 4.1 - Command Console

text
Create placeholder UI for:
- Flight Status widget (current progress, next milestone)
- Next Actions list (3-5 placeholder items)
- Blockers section (empty state + "Add blocker" button)
- Recent Wins feed (dummy achievements)
- Team snapshot (member avatars + progress)
Task 4.2 - My Board (Kanban)

text
Implement skeleton kanban with:
- 4 columns (Backlog, Active, Review, Done)
- 2-3 placeholder cards per column
- Drag-and-drop ready (stub handlers)
- Column counts and empty states
Task 4.3 - Mission Control

text
Admin view with:
- Team grid (placeholder member cards)
- Blocker queue table (empty state)
- Quick stats panel
- Admin-only actions (placeholder)
Phase 5: Data Layer
Task 5.1 - Query Hooks

text
Create React hooks for:
- useMemberProfile() - Fetch current member data
- useTasks(board?: string) - Fetch kanban items
- useTeamSummary() - Team progress stats
- useBlockers(status?: 'active' | 'resolved')
Task 5.2 - Server Actions

text
Create server actions for:
- updateTaskStatus(taskId, status)
- createBlocker(title, description)
- resolveBlocker(blockerId, resolution)
- fetchDashboardData() - Aggregate initial load
Phase 6: UI Components
Task 6.1 - Shared Components

text
Create in `components/ui/`:
- Card.tsx - Consistent card styling
- Badge.tsx - Status indicators
- ProgressBar.tsx - Animated progress
- EmptyState.tsx - Reusable empty states
- LoadingSkeleton.tsx - Content placeholders
Task 6.2 - Dashboard Widgets

text
Create in `components/dashboard/`:
- StatusWidget.tsx - Flight progress display
- ActionList.tsx - Next actions with checkboxes
- BlockerCard.tsx - Blocker item component
- WinCard.tsx - Recent achievement display
Phase 7: Testing & Documentation
Task 7.1 - Setup Tests

text
Add testing infrastructure:
- `vitest.config.ts` matching other apps
- Example tests for 2-3 key components
- Test utilities for mocking Supabase
Task 7.2 - Documentation

text
Create:
- `README.md` - Setup, env vars, running dev
- `CONTRIBUTING.md` - Component patterns, data flow
- API.md - Available hooks & server actions
Key Files to Generate
Priority 1 (Required for MVP)
apps/flight-deck/package.json

apps/flight-deck/next.config.js

apps/flight-deck/middleware.ts

apps/flight-deck/lib/supabase/client.ts

apps/flight-deck/app/dashboard/layout.tsx

apps/flight-deck/app/dashboard/page.tsx

Priority 2 (Core Functionality)
apps/flight-deck/components/ui/Card.tsx

apps/flight-deck/components/dashboard/StatusWidget.tsx

apps/flight-deck/hooks/useMemberProfile.ts

apps/flight-deck/app/dashboard/my-board/page.tsx

Priority 3 (Polish)
apps/flight-deck/tests/components/Card.test.tsx

apps/flight-deck/README.md

Tailwind config extending marketing site theme

Responsive sidebar/navigation

Quality Requirements
Code Standards:

TypeScript strict mode enabled

ESLint config matching monorepo root

Prettier formatting

Import aliases (@/* for src)

Performance:

Implement React Suspense for data loading

Use server components where possible

Image optimization with Next.js Image

Security:

All dashboard routes protected by middleware

Row Level Security (RLS) considered in queries

No sensitive data in client components

Consistency:

Match color palette/typography of marketing site

Use same Supabase client pattern as onboard app

Follow existing monorepo scripts (dev, build, test)

Acceptance Criteria
The implementation is complete when:

✅ App runs at localhost:3000/flight-deck in development

✅ Supabase auth redirects work correctly

✅ All three dashboard views render with placeholder content

✅ Responsive design works on mobile/desktop

✅ TypeScript compiles without errors

✅ Basic tests pass

✅ README provides clear setup instructions

Stretch Goals (If time permits):

Real-time subscription to task updates

Keyboard shortcuts navigation

Dark/light theme toggle

Export data functionality (CSV)

Key Improvements in This Version:
Task-based structure - Clear, discrete units of work

Priority ordering - What to build first for MVP

Specific file list - Exactly which files need to be created

Integration details - How to reuse existing configs

Quality gates - Clear acceptance criteria

Performance/security - Built-in requirements

Less ambiguity - Specific component names and props

Monorepo-aware - References existing patterns