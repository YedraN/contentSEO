import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "@/app/api/wordpress/credentials/route";
import { NextRequest } from "next/server";

const mockVerifyToken = vi.hoisted(() => vi.fn());
const mockTestConnection = vi.hoisted(() => vi.fn());
const mockEncrypt = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn(), update: vi.fn() },
}));

vi.mock("@/lib/auth", () => ({ verifyToken: mockVerifyToken }));
vi.mock("@/lib/wordpress", () => ({ testWordPressConnection: mockTestConnection }));
vi.mock("@/lib/encryption", () => ({ encrypt: mockEncrypt, decrypt: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

function createRequest(method: string, body?: any, token?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Cookie"] = `token=${token}`;

  return new NextRequest("http://localhost:3000/api/wordpress/credentials", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/wordpress/credentials", () => {
  it("debe retornar 401 si no hay token", async () => {
    const res = await POST(createRequest("POST", { action: "test" }));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("No autorizado");
  });

  it("debe retornar 400 si la acción no es válida", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });

    const res = await POST(createRequest("POST", { action: "invalid" }, "valid-token"));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Acción no válida");
  });

  describe("action: test", () => {
    it("debe retornar 200 si la conexión es exitosa", async () => {
      mockVerifyToken.mockResolvedValue({ userId: "user-1" });
      mockTestConnection.mockResolvedValue(true);

      const res = await POST(
        createRequest("POST", { action: "test", wordpressUrl: "https://misitio.com", wordpressUsername: "admin", wordpressPassword: "pass123" }, "valid-token")
      );
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(mockTestConnection).toHaveBeenCalledWith({ url: "https://misitio.com", username: "admin", password: "pass123" });
    });

    it("debe retornar 400 si la conexión falla", async () => {
      mockVerifyToken.mockResolvedValue({ userId: "user-1" });
      mockTestConnection.mockResolvedValue(false);

      const res = await POST(
        createRequest("POST", { action: "test", wordpressUrl: "https://malo.com", wordpressUsername: "admin", wordpressPassword: "wrong" }, "valid-token")
      );
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain("No se pudo conectar");
    });
  });

  describe("action: save", () => {
    it("debe retornar 400 si faltan campos", async () => {
      mockVerifyToken.mockResolvedValue({ userId: "user-1" });

      const res = await POST(createRequest("POST", { action: "save", wordpressUrl: "https://x.com" }, "valid-token"));
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toBe("Faltan datos requeridos");
    });

    it("debe retornar 400 si la conexión falla al guardar", async () => {
      mockVerifyToken.mockResolvedValue({ userId: "user-1" });
      mockTestConnection.mockResolvedValue(false);

      const res = await POST(
        createRequest("POST", { action: "save", wordpressUrl: "https://misitio.com", wordpressUsername: "admin", wordpressPassword: "wrong" }, "valid-token")
      );
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain("No se pudo conectar");
    });

    it("debe guardar credenciales encriptadas y retornar 200", async () => {
      mockVerifyToken.mockResolvedValue({ userId: "user-1" });
      mockTestConnection.mockResolvedValue(true);
      mockEncrypt.mockReturnValue("encrypted-password");
      mockPrisma.user.update.mockResolvedValue({});

      const res = await POST(
        createRequest("POST", { action: "save", wordpressUrl: "https://misitio.com", wordpressUsername: "admin", wordpressPassword: "pass123" }, "valid-token")
      );
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe("Credenciales guardadas");
      expect(mockEncrypt).toHaveBeenCalledWith("pass123");
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { wordpressUrl: "https://misitio.com", wordpressUsername: "admin", wordpressPassword: "encrypted-password", wordpressConnected: true },
      });
    });
  });

  describe("action: disconnect", () => {
    it("debe limpiar credenciales y retornar 200", async () => {
      mockVerifyToken.mockResolvedValue({ userId: "user-1" });
      mockPrisma.user.update.mockResolvedValue({});

      const res = await POST(createRequest("POST", { action: "disconnect" }, "valid-token"));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.message).toBe("Desconectado");
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { wordpressUrl: null, wordpressUsername: null, wordpressPassword: null, wordpressConnected: false },
      });
    });
  });
});

describe("GET /api/wordpress/credentials", () => {
  it("debe retornar estado de conexión conectado", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue({ wordpressConnected: true, wordpressUrl: "https://misitio.com" });

    const res = await GET(createRequest("GET", undefined, "valid-token"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.connected).toBe(true);
    expect(body.data.url).toBe("https://misitio.com");
  });

  it("debe retornar estado no conectado si no hay usuario", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await GET(createRequest("GET", undefined, "valid-token"));
    const body = await res.json();

    expect(body.data.connected).toBe(false);
    expect(body.data.url).toBe(null);
  });

  it("debe retornar 401 si no hay token", async () => {
    const res = await GET(createRequest("GET"));
    expect(res.status).toBe(401);
  });
});
