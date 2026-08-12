import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Define list of pages ONLY for UNLOGGED users
const authRoutes = ["/login", "/register", "/forgot-password"];

// 2. Define list of pages that MUST be logged in
const protectedRoutes = ["/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from Cookie
  const token = request.cookies.get("access_token")?.value;

  // CHECK 1: Logged in but trying to access /login -> Redirect to home '/'
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // CHECK 2: Not logged in but trying to access protected route -> Redirect to /login
  // Use .some() to block sub-routes like /settings/account
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CHECK 3: Valid -> Allow request to continue
  return NextResponse.next();
}

// 3. Matcher configuration (Crucial for performance optimization)
// Matcher specifies when Middleware will NOT run (e.g. static files, images)
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
