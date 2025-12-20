import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/super-admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {

    try {
        // Protect all dashboard routes
        if (isDashboardRoute(req)) {
            await auth.protect();
        }

        // Additional role check for super-admin routes
        if (isAdminRoute(req)) {
            const { sessionClaims } = await auth();
            const role = (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role;

            if (role !== 'admin') {
                // Redirect non-admins to partner dashboard
                const redirectUrl = new URL('/dashboard/partner', req.url);
                return NextResponse.redirect(redirectUrl);
            }
        }
    } catch (error) {
        console.error("Middleware Error:", error);
        // Allow public routes to proceed even if auth fails
        if (!isDashboardRoute(req)) {
            return;
        }
        throw error;
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
