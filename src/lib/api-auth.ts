import { NextRequest } from "next/server";
import { verifyToken, getUserById } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function verifyAuth(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded?.userId) return null;

  // If the token carries a session version, verify it matches the DB.
  // Tokens issued before sessionVersion was added (sv undefined) are still accepted
  // to avoid breaking existing sessions on deploy — they'll rotate naturally on next login.
  if (decoded.sv !== undefined) {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { sessionVersion: true },
    });
    if (!user || user.sessionVersion !== decoded.sv) return null;
  }

  return decoded.userId;
}

export async function getAuthenticatedUser(request: NextRequest) {
  const userId = await verifyAuth(request);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (!user) return null;
  return { user, userId };
}
