import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Clerk Authentication Middleware
 *
 * Public routes (no auth required):
 * - /: Home page
 * - /sign-in, /sign-up: Authentication pages
 * - /api/public: Public API endpoints
 * - /api/legacy-proxy: WordPress proxy during migration
 *
 * Protected routes require authentication.
 */

const isPublicRoute = createRouteMatcher([
  // Public pages
  "/",
  "/about",
  "/contact",
  "/vision",
  "/founders-note",

  // Authentication
  "/sign-in(.*)",
  "/sign-up(.*)",

  // Public API
  "/api/public(.*)",

  // Legacy proxy (during migration)
  "/api/legacy-proxy(.*)",
  "/wp-legacy(.*)",
]);

/**
 * WordPress JWT verification for legacy users during migration
 *
 * This function validates WordPress JWT tokens from the legacy system
 * to allow gradual user migration.
 */
async function verifyWordPressJWT(token: string) {
  try {
    // In production, this would verify against WordPress
    // For now, return a placeholder response
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    return {
      userId: `wp_${decoded.user_id}`,
      email: decoded.user_email,
      roles: decoded.roles || [],
      source: "wordpress",
    };
  } catch (error) {
    console.error("WordPress JWT verification failed:", error);
    return null;
  }
}

export default clerkMiddleware(async (auth, req) => {
  // 1. Check if route is public
  if (isPublicRoute(req)) {
    return Response.next();
  }

  // 2. Try Clerk authentication first
  const { userId } = await auth();
  if (userId) {
    return Response.next();
  }

  // 3. Fallback to WordPress JWT during migration period
  const wpToken =
    req.headers.get("x-wp-jwt") || req.cookies.get("wp_jwt")?.value;

  if (wpToken) {
    const user = await verifyWordPressJWT(wpToken);
    if (user) {
      // Set user in headers for downstream components
      const response = Response.next();
      response.headers.set("x-legacy-user", JSON.stringify(user));
      return response;
    }
  }

  // 4. Redirect to sign in
  return auth().redirectToSignIn();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Always run for API routes
    "/api/:path*",
  ],
};
