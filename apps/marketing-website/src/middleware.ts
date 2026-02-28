import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/super-admin(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/grid-access(.*)", "/onboarding(.*)"]);
const isMemberOnboardingRoute = createRouteMatcher(["/member-onboarding(.*)"]);
const isPartnerOnboardingRoute = createRouteMatcher(["/partner-onboarding(.*)"]);
const isPublicAPI = createRouteMatcher(["/api(.*)"]);

import { createClient } from "@supabase/supabase-js";

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.clerk.accounts.dev *.stripe.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' blob: data: *.supabase.co *.stripe.com o341ovdtm5.ufs.sh; " +
        "font-src 'self'; " +
        "connect-src 'self' *.supabase.co *.clerk.accounts.dev *.stripe.com api.stripe.com; " +
        "frame-ancestors 'none'; " +
        "form-action 'self';"
    );
    
    return response;
}

export default clerkMiddleware(async (auth, req) => {
    try {
        // BLOCK DANGEROUS DEV ROUTES IN PRODUCTION
        if (process.env.NODE_ENV === "production") {
            const path = req.nextUrl.pathname;
            const blockedDevRoutes = [
                "/secret-menu",
                "/employee-portal", 
                "/simple-login",
                "/test-users",
                "/dev-login",
                "/developer-login"
            ];
            if (blockedDevRoutes.some(route => path.startsWith(route))) {
                const response = NextResponse.redirect(new URL("/", req.url));
                return addSecurityHeaders(response);
            }
        }

        const { userId, getToken } = await auth();
        const url = new URL(req.url);
        const pathname = url.pathname;

        // Onboarding & Role Check
        if (userId && !isPublicAPI(req)) {
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

            const { data: profile } = await supabase
                .from('profiles')
                .select('active_roles, primary_role, onboarding_completed_at, primary_intent')
                .eq('id', userId)
                .single()

            const hasRoles = profile?.active_roles && profile.active_roles.length > 0;
            const onboardingCompleted = !!profile?.onboarding_completed_at;

            // Redirect to Onboarding if not completed and NO role assigned
            if (!onboardingCompleted && !hasRoles && !isOnboardingRoute(req) && !isMemberOnboardingRoute(req) && !isPartnerOnboardingRoute(req)) {
                const response = NextResponse.redirect(new URL("/onboarding", req.url));
                return addSecurityHeaders(response);
            }

            // If has roles, allow dashboard access even if onboarding not complete
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
                    const response = NextResponse.redirect(new URL("/dashboard", req.url));
                    return addSecurityHeaders(response);
                }
            }

            const hasCompletedOnboarding = !!profile?.onboarding_completed_at;
            const intent = profile?.primary_intent;

            if (hasCompletedOnboarding) {
                if (intent === 'builder' && !isMemberOnboardingRoute(req)) {
                    // Check if member context is needed
                }

                if (intent === 'partner' && !isPartnerOnboardingRoute(req)) {
                    // Use the existing partner onboarding check
                }
            }

            const { sessionClaims } = await auth();
            const metadata = sessionClaims?.publicMetadata as { onboardingComplete?: boolean; userTrack?: string; memberContextComplete?: boolean; partnerContextComplete?: boolean };

            if (hasCompletedOnboarding &&
                (intent === 'builder' || metadata?.userTrack === 'build_something') &&
                !metadata?.memberContextComplete &&
                !isMemberOnboardingRoute(req)) {

                const contextUrl = new URL("/member-onboarding", req.url);
                const response = NextResponse.redirect(contextUrl);
                return addSecurityHeaders(response);
            }

            if (hasCompletedOnboarding &&
                (intent === 'partner' || metadata?.userTrack === 'support_builders') &&
                !metadata?.partnerContextComplete &&
                !isPartnerOnboardingRoute(req)) {

                const partnerContextUrl = new URL("/partner-onboarding", req.url);
                const response = NextResponse.redirect(partnerContextUrl);
                return addSecurityHeaders(response);
            }
        }

        // Protect all dashboard routes
        if (isDashboardRoute(req)) {
            await auth.protect();
        }

    } catch (error) {
        console.error("Middleware Error:", error);
        if (!isDashboardRoute(req)) {
            return;
        }
        throw error;
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
