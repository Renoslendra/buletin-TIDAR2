import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

const protectedPrefixes = [
  "/dashboard",
  "/schedules",
  "/bulletins",
  "/settings",
  "/history",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    !pathname.startsWith("/bulletins/classic-preview") &&
    !(pathname.includes("/preview") && request.nextUrl.searchParams.get("print") === "1") &&
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !request.cookies.get(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && request.cookies.get(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/schedules/:path*",
    "/bulletins/:path*",
    "/settings/:path*",
    "/history/:path*",
  ],
};
