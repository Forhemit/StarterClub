import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/super-admin(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/grid-access(.*)", "/onboarding(.*)"]);
const isMemberOnboardingRoute = createRouteMatcher(["/member-onboarding(.*)"]);
const isPartnerOnboardingRoute = createRouteMatcher(["/partner-onboarding(.*)"]);
const isPublicAPI = createRouteMatcher(["/api(.*)"]);

import { createClient } from "@supabase/supabase-js";

export default clerkMiddleware(async (auth, req) => {

    try {
        // BLOCK DANGEROUS DEV ROUTES IN PRODUCTION
        if (process.env.NODE_ENV === "production") {
            const path = req.nextUrl.pathname;
            if (path.startsWith("/secret-menu") || path.startsWith("/employee-portal") || path.startsWith("/simple-login")) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        const { userId, getToken } = await auth();
        const url = new URL(req.url); // Use standard URL
        const pathname = url.pathname;

        // Onboarding & Role Check
        if (userId && !isPublicAPI(req)) {
            // Create authenticated Supabase client for middleware
            const token = await getToken({ template: 'supabase' });

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    global: {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                }
            );

            // Check Supabase profile for role and onboarding status
            const { data: profile } = await supabase
                .from('profiles')
                .select('active_roles, primary_role, onboarding_completed_at, primary_intent')
                .eq('id', userId)

            const hasRoles = profile?.active_roles && profile.active_roles.length > 0;
            const onboardingCompleted = !!profile?.onboarding_completed_at;

            // 1. Redirect to Onboarding if not completed and NO role assigned
            if (!onboardingCompleted && !hasRoles && !isOnboardingRoute(req) && !isMemberOnboardingRoute(req) && !isPartnerOnboardingRoute(req)) {
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }

            // 2. If has roles, allow dashboard access even if onboarding not complete
            // (Users can complete onboarding later from dashboard)
            if (hasRoles && !onboardingCompleted) {
                const allowedWithoutOnboarding = [
                    '/onboarding',
                    '/dashboard',
                    '/profile',
                    '/api',
                    '/complete-profile'
                ];
                const isAllowed = allowedWithoutOnboarding.some(route => pathname.startsWith(route));

                if (!isAllowed) {
                    return NextResponse.redirect(new URL("/dashboard", req.url));
                }
            }

            // 3. Smart Routing Outcomes
            // Everyone lands in Home Base, but Home Base is contextualized.
            // Some intents might require extra orientation.

            const hasCompletedOnboarding = !!profile?.onboarding_completed_at;
            const intent = profile?.primary_intent;

            // Handle additional orientation steps based on intent
            if (hasCompletedOnboarding) {
                if (intent === 'builder' && !isMemberOnboardingRoute(req)) {
                    // Check if member context is needed
                    // (For now, let's assume it's still tracked in metadata or needs a DB check)
                    // If we want to be safe, we can check if they've seen it.
                }

                if (intent === 'partner' && !isPartnerOnboardingRoute(req)) {
                    // Use the existing partner onboarding check
                }
            }

            // Fallback to existing metadata checks if DB check fails or is skipped?
            const { sessionClaims } = await auth();
            const metadata = sessionClaims?.publicMetadata as { onboardingComplete?: boolean; userTrack?: string; memberContextComplete?: boolean; partnerContextComplete?: boolean };

            if (hasCompletedOnboarding &&
                (intent === 'builder' || metadata?.userTrack === 'build_something') &&
                !metadata?.memberContextComplete &&
                !isMemberOnboardingRoute(req)) {

                const contextUrl = new URL("/member-onboarding", req.url);
                return NextResponse.redirect(contextUrl);
            }

            if (hasCompletedOnboarding &&
                (intent === 'partner' || metadata?.userTrack === 'support_builders') &&
                !metadata?.partnerContextComplete &&
                !isPartnerOnboardingRoute(req)) {

                const partnerContextUrl = new URL("/partner-onboarding", req.url);
                return NextResponse.redirect(partnerContextUrl);
            }
        }

        // Protect all dashboard routes
        if (isDashboardRoute(req)) {
            await auth.protect();
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
