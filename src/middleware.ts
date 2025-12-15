import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/super-admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // Protect all dashboard routes
    if (isDashboardRoute(req)) {
        await auth.protect();
    }

    // Role checks would ideally happen here or in layouts
    // For local dev/MVP, we'll rely on Layout-based role checks to show unauthorized UI
    // to prevent infinite redirects if metadata is missing.
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
