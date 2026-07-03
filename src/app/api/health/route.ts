import { prisma } from "@/lib/db/prisma";
import { getPersistenceStatus } from "@/lib/runtime/persistence";

export const runtime = "nodejs";

export async function GET() {
  const persistence = getPersistenceStatus();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      ok: persistence.ok,
      database: "ok",
      persistence,
      timestamp: new Date().toISOString(),
    }, { status: persistence.ok ? 200 : 503 });
  } catch {
    return Response.json(
      {
        ok: false,
        database: "error",
        persistence,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
