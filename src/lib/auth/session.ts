import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "sabatflow_session";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "reviewer";
};

function getSecret() {
  const value = process.env.SESSION_SECRET ?? "development-only-change-me";
  return new TextEncoder().encode(value);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role === "reviewer" ? "reviewer" : "admin",
    } satisfies SessionUser;
  } catch {
    return null;
  }
}
