# Vercel Deployment Guide

> [!TIP]
> **Automated Setup**: You can use the included script to automate the project creation and environment variable setup.
> Run: `./scripts/setup-vercel.sh`
>
> Then continue to step 4 in the script output (setting Root Directories manually).

This project is a **monorepo** containing multiple applications. To have a fully functional system in production, you must deploy each application as a separate project in Vercel.

## 1. Applications to Deploy

You need to create **4 separate Vercel projects**, keeping the repository connected to the same GitHub repo for each one, but changing the **Root Directory** settings.

| Application | Root Directory | Framework Preset | Description |
|---|---|---|---|
| **Marketing Website** | `apps/marketing-website` | Next.js | The main landing page and router. |
| **Member Portal** | `apps/onboard-app` | Vite | The reception/check-in app for members. |
| **Flight Deck** | `apps/flight-deck` | Next.js | The standalone Partner Dashboard (if used). |
| **Super Admin** | `apps/super-admin` | Next.js | The standalone Admin Dashboard (if used). |

## 2. Environment Variables

To link these applications together, you must set the following Environment Variables in the **Marketing Website** project on Vercel.

### Marketing Website (`apps/marketing-website`)

| Variable | Value Description | Example Value |
|---|---|---|
| `NEXT_PUBLIC_ONBOARD_URL` | The live URL of your **Member Portal** deployment. | `https://starter-club-onboard.vercel.app` |
| `NEXT_PUBLIC_PARTNER_URL` | (Optional) Verification URL for Partner App. | `https://starter-club-flight-deck.vercel.app` |
| `NEXT_PUBLIC_ADMIN_URL` | (Optional) Verification URL for Admin App. | `https://starter-club-admin.vercel.app` |

### Member Portal (`apps/onboard-app`)

| Variable | Value Description |
|---|---|
| `VITE_MARKETING_URL` | URL of the Marketing Website (for "Back to Home" links). |

## 3. Troubleshooting

### Member Portal links to `localhost`
- **Cause**: `NEXT_PUBLIC_ONBOARD_URL` is not set in the Marketing Website Vercel project.
- **Fix**: Add the Deployment URL of the `onboard-app` project to the environment variables of the `marketing-website` project.

### Partner/Admin routes link to Login
- **Cause**: The routes `/dashboard/partner` and `/dashboard/super-admin` inside `marketing-website` are protected by Clerk.
- **Fix**: If you intend to use the embedded dashboards, this is correct behavior (you must log in). If you intended to link to the separate `flight-deck` or `super-admin` apps, ensure you have set up the redirects or environment variables to point to those external URLs.
