import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rotas protegidas
  const isAdminPath =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const adminSession = req.cookies.get("admin_session")?.value;

  if (adminSession === "ok") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
