// src/middleware.ts  (place at project root alongside src/)
//
// Runs on the Edge before every request.
// Responsibilities:
//   1. Refresh the Supabase session cookie so it never silently expires.
//   2. Redirect unauthenticated users away from protected routes.
//   3. Redirect authenticated users away from auth pages (login / signup).

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ─── Route config ─────────────────────────────────────────────────────────────
// Routes that require a valid session.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/live",
  "/analytics",
  "/predictions",
  "/ai-assistant",
  "/settings",
];

// Routes that logged-in users should not see.
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

// ─── Middleware ───────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through static assets and API routes untouched.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // Build a response object we can mutate (cookie writes need this).
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to the request so server components see them,
          // and to the response so the browser stores them.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — this is the critical call that keeps JWTs alive.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Redirect logic ────────────────────────────────────────────────────────
  if (!user && isProtected(pathname)) {
    // Unauthenticated → send to login, preserve the intended destination.
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute(pathname)) {
    // Already logged in → send to dashboard instead of login/signup.
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.searchParams.delete("redirectTo");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Tell Next.js which paths to run this middleware on.
// Excluding static files here avoids unnecessary Edge invocations.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};