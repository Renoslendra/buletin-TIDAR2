import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

const protectedPrefixes = [
  "/dashboard",
  "/schedules",
  "/bulletins",
  "/settings",
  "/history",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  const hasInvalidSessionCookie = Boolean(token && !session);
  const isProtected =
    !pathname.startsWith("/bulletins/classic-preview") &&
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    const response = NextResponse.redirect(url);
    if (hasInvalidSessionCookie) {
      response.cookies.delete(SESSION_COOKIE);
    }
    return response;
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  if (hasInvalidSessionCookie) {
    response.cookies.delete(SESSION_COOKIE);
  }
  return response;
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
