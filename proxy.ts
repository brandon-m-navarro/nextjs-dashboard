import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  // Simple cookie existence check (optimistic)
  const cookie = getSessionCookie(request);
  const isLoggedIn = Boolean(cookie);

  // Example: If user is NOT logged in and trying to access /dashboard → redirect
  const { pathname } = new URL(request.url);
  console.log(`Proxying request for: ${pathname}, logged in: ${isLoggedIn}`);
  
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/", request.url));
  } else if (isLoggedIn && pathname === "/") {
    // If logged in user tries to access login page, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Otherwise let the request through
  return NextResponse.next();
}

// Apply this proxy logic only to relevant routes:
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
