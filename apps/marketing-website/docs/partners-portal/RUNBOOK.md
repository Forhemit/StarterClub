# Partner Portal - Runbook

## 1. Environment Variables (`.env.local`)
Ensure the following variables are set in your `.env.local` file.

### Clerk (Authentication)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Redirects (Updated for Role-Based Dashboard)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Supabase (Database)
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON=eyJ...

# Required for Admin Dashboard actions (Bypasses RLS)
# Find this in Supabase Dashboard > Project Settings > API > service_role
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 2. Roles & Permissions
The system uses a hard strict role-based routing system.
- **Partner Layout**: Protected by `role="partner"` (Default).
- **Super Admin Layout**: Protected by `role="admin"` (Strict).
- **Partner Admin Layout**: Protected by `role="partner_admin"` (Strict).

### Setting Up an Admin
Since there is no UI to "promote" yourself to Super Admin initially:
1. Go to **Clerk Dashboard** > **Users**.
2. Find your user.
3. Edit **Public Metadata** to include:
   ```json
   {
     "role": "admin"
   }
   ```
4. Sign out and sign back in to force a token refresh. You can now access `/dashboard/super-admin`.

## 3. Running Locally
```bash
npm run dev
```
Access the portal at `http://localhost:3000`.

## 4. Deployment
This project is a standard Next.js application.
- **Build**: `npm run build`
- **Start**: `npm start`
- **Vercel**: Simply connect the repo and add the Environment Variables found above.
