import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/wordpress/test-connection/route";
import { NextRequest } from "next/server";

const mockGetAuthenticatedUser = vi.hoisted(() => vi.fn());
const mockTestConnection = vi.hoisted(() => vi.fn());
const mockDecrypt = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
}));

vi.mock("@/lib/api-auth", () => ({
  verifyAuth: vi.fn(),
  getAuthenticatedUser: mockGetAuthenticatedUser,
}));
vi.mock("@/lib/wordpress", () => ({ testWordPressConnection: mockTestConnection }));
vi.mock("@/lib/encryption", () => ({ decrypt: mockDecrypt }));
vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

const proUser = {
  userId: "user-1",
  user: {
    id: "user-1",
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    credits: 10,
    name: "Test",
    email: "test@test.com",
    articlesLimitPerMonth: 100,
    articlesUsedThisMonth: 0,
    billingCycleEnd: null,
    defaultLanguage: "es",
    defaultTone: "professional",
  },
};

function createRequest(token?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (token) headers["Cookie"] = `token=${token}`;
  return new NextRequest("http://localhost:3000/api/wordpress/test-connection", {
    method: "POST",
    headers,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/wordpress/test-connection", () => {
  it("debe retornar 401 si no hay token", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(null);

    const res = await POST(createRequest());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("No autorizado");
  });

  it("debe retornar 403 si el plan no permite WordPress", async () => {
    mockGetAuthenticatedUser.mockResolvedValue({
      ...proUser,
      user: { ...proUser.user, subscriptionPlan: "starter" },
    });

    const res = await POST(createRequest("valid-token"));
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toContain("Pro o Agency");
  });

  it("debe retornar 404 si el usuario no existe en BD", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(proUser);
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await POST(createRequest("valid-token"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Usuario no encontrado");
  });

  it("debe retornar 400 si no hay credenciales configuradas", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(proUser);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      wordpressUrl: null,
      wordpressUsername: null,
      wordpressPassword: null,
    });

    const res = await POST(createRequest("valid-token"));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Credenciales de WordPress no configuradas");
  });

  it("debe retornar 200 si la conexión es exitosa", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(proUser);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      wordpressUrl: "https://misitio.com",
      wordpressUsername: "admin",
      wordpressPassword: "encrypted-pass",
    });
    mockDecrypt.mockReturnValue("decrypted-pass");
    mockTestConnection.mockResolvedValue(true);

    const res = await POST(createRequest("valid-token"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Conexión exitosa");
    expect(mockDecrypt).toHaveBeenCalledWith("encrypted-pass");
    expect(mockTestConnection).toHaveBeenCalledWith({
      url: "https://misitio.com",
      username: "admin",
      password: "decrypted-pass",
    });
  });

  it("debe retornar 400 si la conexión falla", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(proUser);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      wordpressUrl: "https://misitio.com",
      wordpressUsername: "admin",
      wordpressPassword: "encrypted-pass",
    });
    mockDecrypt.mockReturnValue("decrypted-pass");
    mockTestConnection.mockResolvedValue(false);

    const res = await POST(createRequest("valid-token"));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toContain("No se pudo conectar");
  });

  it("debe retornar 500 si hay error inesperado", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(proUser);
    mockPrisma.user.findUnique.mockRejectedValue(new Error("Unexpected"));

    const res = await POST(createRequest("valid-token"));
    expect(res.status).toBe(500);
  });
});
