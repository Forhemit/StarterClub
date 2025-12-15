# Starter Club

**San Francisco's launchpad for community creators**

Starter Club is a platform that bridges the gap between idea and action, helping neighbors build the projects, businesses, and groups that make San Francisco better. We provide a supportive environment where anyone can become creators, founders, and opportunity-makers.

## 🎯 About The Project

Starter Club is more than just a coworking space - it's an intentional community designed to help people bring their ideas to life. We offer:

- **Three-phase onboarding process**: Orientation → Check-ins → Integration
- **Tiered membership system**: From free Starter Members to Starter Founders
- **Resource library**: Access to curated learning materials and tools
- **Community events**: Regular gatherings and networking opportunities
- **Partner ecosystem**: Connections with local businesses and organizations

## 🛠️ Tech Stack

This project is built with modern web technologies:

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Library**: [React 19](https://react.dev)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: Framer Motion
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Cloudflare Pages (via Wrangler)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun
- A Supabase account and project
- A Clerk account and application

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd starter-club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

   See `.env.local.example` for a template.

4. **Set up the database**
   
   The project includes Supabase migrations in the `supabase` directory. To apply them:

   ```bash
   # Install Supabase CLI if you haven't already
   npm install -g supabase

   # Link to your Supabase project
   npx supabase link --project-ref your-project-ref

   # Push migrations to your database
   npx supabase db push

   # (Optional) Seed the database with initial data
   node scripts/seed.mjs
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
starter-club/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard routes (role-based)
│   │   │   ├── super-admin/    # Super admin dashboard
│   │   │   └── partner/        # Partner dashboard
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── ...                 # Custom components
│   └── lib/                    # Utility functions and clients
│       ├── supabaseClient.ts   # Supabase client
│       └── utils.ts            # Helper functions
├── supabase/                   # Database schema and migrations
├── public/                     # Static assets
└── scripts/                    # Utility scripts (seeds, etc.)
```

## 🗄️ Database Schema

The application uses the following main tables:

- **`waitlist_submissions`**: Stores waitlist form submissions
- **`partner_inquiries`**: Stores partner application inquiries
- **`users`**: User profiles and role management
- **`resources`**: Resource library documents and materials
- **`events`**: Community events and gatherings

See the `supabase/migrations` directory for the complete schema.

## 🔐 Authentication & Authorization

The application uses **Clerk** for authentication with role-based access control:

- **Public**: Landing page, waitlist, partner inquiry forms
- **Super Admin**: Full system access, user management, resource management
- **Partner Admin**: Partner-specific dashboard and reporting
- **Member**: Member dashboard and resources

Roles are managed through Clerk's metadata system and synced with the Supabase database.

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## 🚢 Deployment

The application is optimized for deployment on **Vercel**.

1. Connect your repository to Vercel.
2. Vercel will automatically detect the Next.js configuration.
3. Add the environment variables from `.env.local` to your Vercel project settings.
4. Click Deploy.

## 🤝 Contributing

This is a private project for Starter Club. If you have access and would like to contribute:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Private and proprietary. All rights reserved.

## 🔗 Links

- [Supabase Dashboard](https://app.supabase.com/)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Built with ❤️ for the San Francisco community
