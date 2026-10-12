import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /admin to /admin/login
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Leave authentication checks to AdminAuthContext and AdminShell.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
