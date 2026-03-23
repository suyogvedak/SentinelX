import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("admin_session");

  // Allow login page
  if (pathname === "/admin") {
    if (session) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", req.url)
      );
    }
    return NextResponse.next();
  }

  // Protect all admin pages except login
  if (pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(
      new URL("/admin", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
