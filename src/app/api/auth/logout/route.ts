import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { handleRouteError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
