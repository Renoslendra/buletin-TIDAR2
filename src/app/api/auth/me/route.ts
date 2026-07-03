import type { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/current-user";
import { jsonError } from "@/lib/http/api-response";

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return jsonError("Sesi tidak valid. Silakan login ulang.", 401);
  }

  return Response.json({ user });
}
