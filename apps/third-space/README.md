# @starter-club/third-space

Third Space Charging application - Part of the Starter Club monorepo.

## Overview

This is the Next.js 14 application being migrated from the original WordPress-based Third Space platform. The migration follows the Strangler Fig pattern, gradually replacing WordPress functionality while maintaining zero downtime.

## Project Banyan

**Codename:** Project Banyan
**Duration:** 8-10 weeks
**Approach:** Incremental Strangler Pattern with dual-run capability

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account (for authentication)
- Convex deployment (for backend)

### Installation

```bash
# From monorepo root
npm install

# Or install workspace dependencies specifically
npm install --workspace=@starter-club/third-space
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Convex
NEXT_PUBLIC_CONVEX_URL=https://third-space-xxx.convex.cloud
CONVEX_DEPLOYMENT_KEY=xxx

# WordPress Legacy (for migration proxy)
WORDPRESS_URL=http://localhost:8080

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

### Development

```bash
# Start development server on port 3003
npm run dev

# Or from monorepo root
npm run dev:third-space
```

Visit http://localhost:3003

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── legacy-proxy/  # WordPress proxy during migration
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and libraries
└── middleware.ts          # Clerk authentication middleware
```

## Migration Status

### Phase 1: Foundation & Shell (Current)

- [x] Create Next.js app in monorepo
- [x] Set up Clerk authentication
- [x] Create base layout with navigation
- [x] Implement legacy API proxy
- [x] Create base pages (home, about, contact)
- [ ] Deploy to staging
- [ ] Test authentication flow

### Upcoming Phases

- **Phase 2:** Backend Migration
  - Convex schema migration
  - API route handlers
  - Image generation as route handler

- **Phase 3:** Content Migration
  - Migrate WordPress pages
  - Create reusable components
  - Set up content fallback

- **Phase 4:** Authentication Migration
  - Migrate users to Clerk
  - Implement dual auth bridge
  - Create migration wizard

- **Phase 5:** Cutover
  - Gradual traffic shift
  - Monitor and validate
  - Decommission WordPress

## Key Features

### Authentication (Clerk)

- Industry-standard authentication
- Social login support
- User management
- Role-based access control

### Legacy Proxy

During migration, API routes proxy to WordPress:

```
/api/legacy-proxy/wp-json/wp/v2/posts -> WordPress
/api/legacy-proxy/wp-json/wp/v2/pages -> WordPress
```

### Shared UI Components

Uses `@starter-club/ui` for consistent design:
- Button, Card, Input components
- Theme provider
- Antigravity design system

## Dependencies

- **Next.js 16** - React framework
- **Clerk** - Authentication
- **Convex** - Backend
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server on port 3003 |
| `build` | Build for production |
| `start` | Start production server |
| `lint` | Run ESLint |
| `migrate:content` | Migrate WordPress content |
| `migrate:users` | Migrate WordPress users to Clerk |

## Migration Notes

### WordPress Compatibility

During migration, the application maintains compatibility with:
- WordPress REST API
- Custom JWT authentication (dual auth)
- Media files
- User sessions

### Rollback Capability

If migration encounters issues:
1. Route 100% traffic back to WordPress
2. Disable Clerk authentication
3. Investigate and fix
4. Resume migration

## Support

For questions or issues:
- Documentation: `/RefactorPlan`
- Issues: GitHub Issues
- Contact: engineering@forhemit.com

## License

MIT

---

**Built with ❤️ by Forhemit**
**Part of the Starter Club Monorepo**
