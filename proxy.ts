/**
 * Supabase Auth Middleware
 * Handles authentication token refresh and session management
 * Reference: Architecture.md Section 4.3
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables in middleware");
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  // This is required for session refresh
  let user = null;
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      // Only log actual errors, not "Auth session missing" which is normal for unauthenticated users
      if (authError.message !== "Auth session missing!") {
        console.error("Auth error in middleware:", authError.message);
      }
      // Continue without user - this is normal for unauthenticated requests
    } else {
      user = authUser;
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    // Continue without user - this is normal for unauthenticated requests
  }

  // Define protected routes that require authentication
  // Note: /checkout is NOT protected to allow guest checkout
  const protectedRoutes = ["/account"];

  // Define auth routes that should redirect if already authenticated
  const authRoutes = ["/auth/login", "/auth/signup"];

  // Define admin routes that require admin role
  const adminRoutes = ["/admin"];

  // Define routes that should skip all auth checks (like callback handlers)
  const publicAuthRoutes = ["/auth/callback", "/auth/reset-password", "/auth/forgot-password", "/auth/verify-email"];

  // Skip auth checks for public auth routes
  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicAuthRoute) {
    return supabaseResponse;
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check admin routes - must be authenticated AND have admin role
  if (isAdminRoute) {
    if (!user) {
      // Not logged in, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check if user has admin role
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || userData?.role !== 'admin') {
      // Not an admin, redirect to home
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - studio (Sanity Studio)
     * - api routes (handled separately)
     * - test-supabase (test page)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|studio|api|test-supabase|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
