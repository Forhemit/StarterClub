# Starter Club Monorepo

**San Francisco's launchpad for community creators**

Starter Club is a platform that bridges the gap between idea and action, helping neighbors build the projects, businesses, and groups that make San Francisco better. We provide a supportive environment where anyone can become creators, founders, and opportunity-makers.

## 📁 Project Structure

This repository is a **Monorepo** managing multiple applications sharing a common ecosystem.

```
starter-club/
├── apps/
│   ├── marketing-website/    # Main platform
│   ├── onboard-app/          # Kiosk/Tablet App
│   ├── flight-deck/          # Member Dashboard
│   └── super-admin/          # [NEW] Admin Consolidation App
├── packages/
│   ├── shared-types/         # Unified Database Types
│   ├── ui/                   # Shared Shadcn Components
│   └── utils/                # Shared Logic
├── supabase/                 # Shared Database config
└── package.json              # Root workspace (Turborepo)
```

## 🎯 Applications

### 1. Marketing Website (`@starter-club/marketing-website`)
- **Path**: `apps/marketing-website`
- **Port**: `3000`
- **Tech**: Next.js 15, App Router, Clerk Auth.
- **Function**: Member dashboard, partner portal, public landing pages.
- **Employee Portal**: `/employee-portal` (Protected access for staff).

### 2. Onboard App (`@starter-club/onboard-app`)
- **Path**: `apps/onboard-app`
- **Port**: `3001`
- **Tech**: Vite, React SPA.
- **Function**: Tablet-based kiosk for check-ins, guest registration, and room booking.

### 3. Flight Deck (`@starter-club/flight-deck`)
- **Path**: `apps/flight-deck`
- **Port**: `3002`
- **Tech**: Next.js 15, Tailwind.
- **Function**: Internal member dashboard.

### 4. Super Admin (`@starter-club/super-admin`)
- **Path**: `apps/super-admin`
- **Port**: `3003` (Default Next.js port if others taken)
- **Tech**: Next.js 15, Shadcn UI, Shared Packages.
- **Function**: Consolidated admin dashboard for all systems.

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

   **Marketing Website (`apps/marketing-website/.env.local`)**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON=...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   NEXT_PUBLIC_ONBOARD_URL=http://localhost:3001 # For redirects
   ```

   **Onboard App (`apps/onboard-app/.env`)**:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=... # Note: Vite uses _KEY suffix in code often, check consistent naming
   ```

3. **Running the Apps**

   You can run both apps simultaneously from the root:
   ```bash
   npm run dev
   # Marketing at localhost:3000
   # Onboard at localhost:3001
   # Flight Deck at localhost:3002
   ```

   Or run them independently:

   ```bash
   # Run Marketing Website (localhost:3000)
   npm run dev:marketing

   # Run Onboard App (localhost:3001)
   npm run dev:onboard

   # Run Flight Deck (localhost:3002)
   npm run dev:flight-deck
   ```

4. **Verify Setup**
   
   Run the verification script to check your structure:
   ```bash
   ./scripts/verify.sh
   ```

---

## 🗄️ Database (Supabase)

Shared tables are defined in `supabase/migrations`. Both apps read/write to the same Supabase instance.
- **Core Tables**: `profiles`, `activity_log`, `member_progress`.
- **RBAC**: RLS policies ensure data security.

To apply migrations:
```bash
npx supabase link --project-ref exancwcrkqivoaqhmapr
npx supabase db push
```

### Type Generation
To generate TypeScript types (unified for all apps):
```bash
# Must be logged in: npx supabase login
npm run db:generate-types
# This updates packages/shared-types/src/database.types.ts
```

## 🚀 Deployment (Monorepo)

Deploying with **Vercel**:
1. Import the repository.
2. Add a project for each app (`apps/marketing-website`, etc.).
3. **Important**: In Vercel Project Settings > General:
   - Set **Root Directory** to `apps/[app-name]`.
   - Vercel will automatically detect Next.js/Vite.
   - Turborepo will handle dependency caching.

**Note**: `npm run build` at the root verifies the entire monorepo builds correctly.

## 🔐 Navigation

- The **Marketing Website** handles authentication (Clerk) and member management.
- The **Onboard App** is designed for physical presence (Kiosk) and links to the main platform.
- Route `/onboard` on the marketing site redirects to the Onboard App URL.

## 🤝 Contributing

1. Create feature branch.
2. Commit changes enforcing monorepo structure.
3. Verify both builds:
   ```bash
   npm run build:marketing
   npm run build:onboard
   npm run build:flight-deck
   ```

## 📄 License
Private and proprietary.
