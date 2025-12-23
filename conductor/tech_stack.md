# Tech Stack & Architecture

## Core Frameworks
- **Runtime:** Node.js
- **Language:** TypeScript
- **Web Framework:** Next.js 16 (React 19)
- **Monorepo Manager:** Turborepo
- **Package Manager:** npm

## Frontend & Styling
- **Styling Engine:** Tailwind CSS
- **Component Library:** Shadcn UI (Radix UI primitives)
- **Icons:** Lucide React
- **Theme Management:** next-themes

## Backend & Data
- **Database:** Supabase (PostgreSQL)
- **ORM/Querying:** Supabase JS Client (`@supabase/supabase-js`, `@supabase/ssr`)
- **Authentication:** Clerk (`@clerk/nextjs`)

## Infrastructure & DevOps
- **Hosting:** Vercel (implied by Next.js/Turborepo nature)
- **CI/CD:** GitHub Actions (inferred from `.github` folder)

## Testing
- **Unit/Integration:** Vitest
- **Testing Libraries:** React Testing Library

## Workspace Structure
- **Apps:**
  - `flight-deck`: Main application dashboard
  - `marketing-website`: Public facing site
  - `onboard-app`: User onboarding flow
  - `super-admin`: Administration interface
- **Packages:**
  - `ui`: Shared UI components
  - `utils`: Shared utilities
  - `shared-types`: Shared TypeScript definitions
