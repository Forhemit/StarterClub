# Decisions Log - Partner Portal

## Phase A: Initial Audit
- Date: 2025-12-13
- Decision: Using existing Next.js App Router structure.
- Context: Project uses Tailwind v4 and has Clerk/Supabase dependencies.

## Phase B: Auth & Database
- Date: 2025-12-13
- Decision: Use Supabase "Third-Party Auth" integration for Clerk.
- Rationale: Most secure and modern way to use Clerk with Supabase RLS.
- Manual Action Required:
    1. Go to Supabase Dashboard > Authentication > Providers.
    2. Enable "Third-Party Auth".
    3. Add "Clerk" (or custom OIDC).
    4. Set Issuer: `https://<your-clerk-domain>` (from Clerk API Keys).
    5. This allows `auth.jwt()` in PostgreSQL to decode Clerk tokens.
