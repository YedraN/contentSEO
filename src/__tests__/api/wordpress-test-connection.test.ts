import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/wordpress/test-connection/route";
import { NextRequest } from "next/server";

const mockVerifyToken = vi.hoisted(() => vi.fn());
const mockTestConnection = vi.hoisted(() => vi.fn());
const mockDecrypt = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
}));

vi.mock("@/lib/auth", () => ({ verifyToken: mockVerifyToken }));
vi.mock("@/lib/wordpress", () => ({ testWordPressConnection: mockTestConnection }));
vi.mock("@/lib/encryption", () => ({ decrypt: mockDecrypt }));
vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

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
    const res = await POST(createRequest());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("No autorizado");
  });

  it("debe retornar 401 si el token es inválido", async () => {
    mockVerifyToken.mockResolvedValue(null);

    const res = await POST(createRequest("invalid-token"));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Token inválido");
  });

  it("debe retornar 404 si el usuario no existe", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await POST(createRequest("valid-token"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Usuario no encontrado");
  });

  it("debe retornar 400 si no hay credenciales configuradas", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
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
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
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
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
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
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockRejectedValue(new Error("Unexpected"));

    const res = await POST(createRequest("valid-token"));
    expect(res.status).toBe(500);
  });
});
