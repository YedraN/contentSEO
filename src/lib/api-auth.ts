import { NextRequest } from "next/server";
import { verifyToken, getUserById } from "@/lib/auth";

export async function verifyAuth(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded?.userId) return null;
  return decoded.userId;
}

export async function getAuthenticatedUser(request: NextRequest) {
  const userId = await verifyAuth(request);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (!user) return null;
  return { user, userId };
}
