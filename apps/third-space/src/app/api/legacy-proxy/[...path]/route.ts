import { NextRequest, NextResponse } from "next/server";

/**
 * Legacy WordPress API Proxy
 *
 * During migration, this route proxies requests to the legacy WordPress
 * installation. This allows gradual migration of functionality while
 * maintaining backward compatibility.
 */

const WORDPRESS_URL = process.env.WORDPRESS_URL || "http://localhost:8080";
const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL || "http://localhost:8080/wp-json";

/**
 * Transform WordPress REST API responses to our format
 */
function transformWordPressResponse(data: any, path: string) {
  // Handle posts endpoint
  if (path.includes("posts")) {
    const posts = Array.isArray(data) ? data : data?.posts || [];
    return {
      posts: posts.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title?.rendered || post.title,
        content: post.content?.rendered || post.content,
        excerpt: post.excerpt?.rendered || post.excerpt,
        date: post.date,
        modified: post.modified,
        author: post.author,
        // Add migration metadata
        _migration: {
          source: "wordpress",
          wpId: post.id,
          migrated: false,
        },
      })),
    };
  }

  // Handle pages endpoint
  if (path.includes("pages")) {
    const pages = Array.isArray(data) ? data : data?.pages || [];
    return {
      pages: pages.map((page: any) => ({
        id: page.id,
        slug: page.slug,
        title: page.title?.rendered || page.title,
        content: page.content?.rendered || page.content,
        excerpt: page.excerpt?.rendered || page.excerpt,
        date: page.date,
        modified: page.modified,
        _migration: {
          source: "wordpress",
          wpId: page.id,
          migrated: false,
        },
      })),
    };
  }

  // Handle media endpoint
  if (path.includes("media")) {
    const media = Array.isArray(data) ? data : data?.media || [];
    return {
      media: media.map((item: any) => ({
        id: item.id,
        url: item.source_url || item.url,
        title: item.title?.rendered || item.title,
        alt: item.alt_text || item.alt,
        mime_type: item.mime_type,
        _migration: {
          source: "wordpress",
          wpId: item.id,
          migrated: false,
        },
      })),
    };
  }

  // Return data as-is for other endpoints
  return data;
}

/**
 * GET handler - Proxies GET requests to WordPress
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const searchParams = request.nextUrl.search;
  const url = `${WORDPRESS_API_URL}/${path}${searchParams}`;

  console.log(`[Legacy Proxy] GET ${path} -> ${url}`);

  try {
    // Forward authorization header if present
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Forward WordPress JWT cookie if present
    const wpJwt = request.cookies.get("wp_jwt");
    if (wpJwt) {
      headers["Cookie"] = `wp_jwt=${wpJwt.value}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      // No caching for now - add caching strategy later
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[Legacy Proxy] WordPress responded with ${response.status}`
      );
      return NextResponse.json(
        { error: "Failed to fetch from WordPress", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    const transformed = transformWordPressResponse(data, path);

    // Add proxy headers
    const responseData = NextResponse.json(transformed);
    responseData.headers.set("X-Legacy-Proxy", "true");
    responseData.headers.set("X-Legacy-Source", "wordpress");

    return responseData;
  } catch (error) {
    console.error("[Legacy Proxy] Error:", error);
    return NextResponse.json(
      {
        error: "Internal proxy error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}

/**
 * POST handler - Proxies POST requests to WordPress
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const url = `${WORDPRESS_API_URL}/${path}`;

  console.log(`[Legacy Proxy] POST ${path} -> ${url}`);

  try {
    const body = await request.json();

    // Forward headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const wpJwt = request.cookies.get("wp_jwt");
    if (wpJwt) {
      headers["Cookie"] = `wp_jwt=${wpJwt.value}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "WordPress request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Legacy Proxy] POST Error:", error);
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 502 }
    );
  }
}

/**
 * Configure route to match all paths
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
