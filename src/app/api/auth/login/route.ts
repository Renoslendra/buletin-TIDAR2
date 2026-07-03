import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const body = loginSchema.safeParse(await request.json());
    if (!body.success) {
      return jsonError("Email atau password tidak valid.", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: body.data.email.toLowerCase() },
    });

    if (!user || !(await verifyPassword(body.data.password, user.passwordHash))) {
      return jsonError("Email atau password salah.", 401);
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
