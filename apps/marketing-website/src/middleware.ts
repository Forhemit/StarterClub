import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/super-admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // Check for simple auth bypass
    const isSimpleAuth = process.env.NEXT_PUBLIC_USE_SIMPLE_AUTH === 'true';
    console.log(`Middleware: isSimpleAuth=${isSimpleAuth}, Path=${req.nextUrl.pathname}`);

    if (isSimpleAuth && isDashboardRoute(req)) {
        console.log("Middleware: Entering simple auth bypass logic");
        const simpleAuthCookie = req.cookies.get('simple_auth_session');
        const passwordParam = req.nextUrl.searchParams.get('password');

        if (passwordParam === 'StarterClub!2025') {
            const response = NextResponse.redirect(new URL(req.nextUrl.pathname, req.url));
            response.cookies.set('simple_auth_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });
            return response;
        }

        if (!simpleAuthCookie) {
            const loginUrl = new URL('/simple-login', req.url);
            // Preserve the original URL to redirect back after login (optional, but good UX)
            // for now just redirect to login
            return NextResponse.redirect(loginUrl);
        }

        // If simple auth is successful, allow access without Clerk
        return NextResponse.next();
    }

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
