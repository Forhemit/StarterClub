# Flight Deck - Member Dashboard

The Flight Deck is the member dashboard for Starter Club, built with Next.js (App Router), Tailwind CSS, and Supabase.

## Getting Started

1.  **Environment Setup**:
    Ensure you have `.env.local` configured with:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON=...
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or the port assigned by workspace).

## Architecture

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS
-   **Auth**: Supabase Auth (integrated via `@supabase/ssr`)
-   **Database**: Supabase (PostgreSQL)

## Key Routes

-   `/dashboard`: Main command console
-   `/dashboard/my-board`: Member's task board
-   `/dashboard/mission-control`: Admin view (Mission Control)
-   `/dashboard/settings`: User settings

## Testing

Run tests with:
```bash
npm run test
```
