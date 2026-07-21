import { NextResponse } from "next/server";
import type { NextRequest } from "next/app";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("admin_session")?.value;
  const isAuthenticated = sessionCookie === "authenticated";

  // Protection for /admin pages (excluding /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protection for mutating API routes (/api/projects with POST, PUT, DELETE)
  if (pathname.startsWith("/api/projects")) {
    const method = request.method;
    if (["POST", "PUT", "DELETE"].includes(method)) {
      if (!isAuthenticated) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*"],
};
