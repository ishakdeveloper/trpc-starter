import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Guest-only paths
const guestPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = !!request.cookies.get("id");

  // Handle guest-only paths
  if (isAuthenticated && guestPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  // Handle protected paths (everything in (authenticated) group)
  if (!isAuthenticated && pathname.startsWith("/(authenticated)")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(authenticated)/:path*"],
};
