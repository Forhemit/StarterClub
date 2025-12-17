# Starter Club Monorepo

**San Francisco's launchpad for community creators**

Starter Club is a platform that bridges the gap between idea and action, helping neighbors build the projects, businesses, and groups that make San Francisco better. We provide a supportive environment where anyone can become creators, founders, and opportunity-makers.

## 📁 Project Structure

This repository is a **Monorepo** managing multiple applications sharing a common ecosystem.

```
starter-club/
├── apps/
│   ├── marketing-website/    # Main platform (Next.js, Tailwind, Clerk, Supabase)
│   └── onboard-app/          # Kiosk/Reception Tablet App (Vite, React, Supabase)
├── supabase/                 # Shared Database Migrations & Config
├── scripts/                  # Utility scripts
└── package.json              # Root workspace configuration
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
   ```

   Or run them independently:

   ```bash
   # Run Marketing Website (localhost:3000)
   npm run dev:marketing

   # Run Onboard App (localhost:3001)
   npm run dev:onboard
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
npx supabase link --project-ref <your-ref>
npx supabase db push
```

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
   ```

## 📄 License
Private and proprietary.
