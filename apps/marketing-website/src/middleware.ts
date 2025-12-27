import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/super-admin(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/grid-access(.*)"]);
const isMemberOnboardingRoute = createRouteMatcher(["/member-onboarding(.*)"]);
const isPublicAPI = createRouteMatcher(["/api(.*)"]);


export default clerkMiddleware(async (auth, req) => {

    try {
        // BLOCK DANGEROUS DEV ROUTES IN PRODUCTION
        if (process.env.NODE_ENV === "production") {
            const path = req.nextUrl.pathname;
            if (path.startsWith("/secret-menu") || path.startsWith("/employee-portal") || path.startsWith("/simple-login")) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        const { userId, sessionClaims } = await auth();

        // Onboarding Check
        // Redirect to /grid-access if user is logged in but hasn't completed onboarding
        // and is not already on the onboarding page or hitting an API
        if (userId && !isPublicAPI(req)) {
            const metadata = sessionClaims?.publicMetadata as { onboardingComplete?: boolean; userTrack?: string; memberContextComplete?: boolean };

            // 1. Basic Onboarding (Track Selection)
            if (!metadata?.onboardingComplete && !isOnboardingRoute(req)) {
                const onboardingUrl = new URL("/grid-access", req.url);
                return NextResponse.redirect(onboardingUrl);
            }

            // 2. Member Context Onboarding (Only for Members)
            // If they picked 'build_something' but haven't finished the context questions
            if (metadata?.onboardingComplete &&
                metadata?.userTrack === 'build_something' &&
                !metadata?.memberContextComplete &&
                !isMemberOnboardingRoute(req)) {

                const contextUrl = new URL("/member-onboarding", req.url);
                return NextResponse.redirect(contextUrl);
            }
        }

        // Protect all dashboard routes
        if (isDashboardRoute(req)) {
            await auth.protect();
        }

        // Removed legacy legacy checks for super-admin routes from marketing middleware
        // Super Admin app should handle its own auth via its own middleware.
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
