# Partner Portal Build - Tasks

## Phase A — Repo & UI Audit
- [x] ~~UI audit: identify existing layout, nav, typography, spacing, dark mode, icons~~
- [x] ~~shadcn/ui audit: confirm installed components and conventions~~
- [x] ~~Identify auth + middleware patterns (Clerk)~~
- [x] ~~Identify Supabase usage patterns (if any)~~

## Phase B — Supabase + Clerk Correct Wiring (Third-Party Auth)
- [x] ~~Configure Supabase to accept Clerk session tokens (Third-Party Auth)~~ (See DECISIONS.md)
- [x] ~~Implement Supabase client helpers (server + browser) using Clerk token~~
- [x] ~~Create SQL migrations for portal tables~~
- [x] ~~Enable RLS + write policies (auth.jwt() based)~~
- [x] ~~Seed baseline resources + presets~~
- [x] ~~Verification: prove RLS works with real logged-in Clerk user (read/write tests)~~

## Phase C — Portal IA + Routing
- [x] ~~cards: /partners layout shell (sidebar + mobile sheet)~~
- [x] ~~Protected routes + RBAC (partner vs admin)~~

## Phase D — Pages
- [x] ~~cards: /partners dashboard~~
- [x] ~~cards: /partners/story~~ (Placeholder)
- [x] ~~cards: /partners/intros~~ (Placeholder)
- [x] ~~cards: /partners/roi (ROI Lab + export cards)~~
- [x] ~~cards: /partners/resources (download library + filters)~~
- [x] ~~cards: /partners/case-studies~~
- [x] ~~cards: /partners/packages~~ (Placeholder)
- [x] ~~cards: /partners/actions (forms)~~ (Placeholder)
- [x] ~~cards: /partners/reports/sample (exportable)~~ (Placeholder)

## Phase E — Admin (In Progress)
- [x] /partners/admin/users (Link Clerk User <-> Org ID)
- [x] /partners/admin resources CRUD
- [x] /partners/admin case studies CRUD
- [ ] /partners/admin calculator preset editor (Deferred/Optional)
- [x] /partners/admin submissions viewer (Completed)
- [x] Custom Auth Flow (Company Field + Work Email Enforced)
- [x] Refactor: Role-Based Dashboards (/dashboard/partner, /dashboard/super-admin)
- [x] Implement Guest User Invitation (Super Admin + Partner Admin)

## Phase F — QA / Polishing
- [x] a11y pass (labels, focus, keyboard)
- [x] empty states + skeletons
- [x] performance sanity
- [x] final “How to run + env vars” doc
