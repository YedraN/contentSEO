import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/articles/[id]/publish-to-wordpress/route";
import { NextRequest } from "next/server";

const mockVerifyToken = vi.hoisted(() => vi.fn());
const mockDecrypt = vi.hoisted(() => vi.fn());
const mockPublishPost = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
  article: { findUnique: vi.fn(), update: vi.fn() },
}));

vi.mock("@/lib/auth", () => ({ verifyToken: mockVerifyToken }));
vi.mock("@/lib/encryption", () => ({ decrypt: mockDecrypt }));
vi.mock("@/lib/wordpress", () => ({ publishPostToWordPress: mockPublishPost }));
vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

function createRequest(body?: any, token?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Cookie"] = `token=${token}`;

  return new NextRequest(
    "http://localhost:3000/api/articles/article-1/publish-to-wordpress",
    { method: "POST", body: body ? JSON.stringify(body) : undefined, headers }
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/articles/[id]/publish-to-wordpress", () => {
  const params = { id: "article-1" };

  const mockUser = {
    id: "user-1",
    subscriptionPlan: "pro",
    wordpressConnected: true,
    wordpressUrl: "https://misitio.com",
    wordpressUsername: "admin",
    wordpressPassword: "encrypted-pass",
  };

  const mockArticle = {
    id: "article-1",
    userId: "user-1",
    title: "Mi Artículo SEO",
    content: "<p>Contenido del artículo</p>",
  };

  it("debe retornar 401 si no hay token", async () => {
    const res = await POST(createRequest({ status: "draft" }), { params });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("No autorizado");
  });

  it("debe retornar 401 si el token es inválido", async () => {
    mockVerifyToken.mockResolvedValue(null);

    const res = await POST(createRequest({ status: "draft" }, "invalid-token"), { params });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("No autorizado");
  });

  it("debe retornar 404 si el usuario no existe", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await POST(createRequest({ status: "draft" }, "valid-token"), { params });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Usuario no encontrado");
  });

  it("debe retornar 400 si WordPress no está configurado", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, wordpressConnected: false });

    const res = await POST(createRequest({ status: "draft" }, "valid-token"), { params });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("WordPress no está configurado");
  });

  it("debe retornar 404 si el artículo no existe", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.article.findUnique.mockResolvedValue(null);

    const res = await POST(createRequest({ status: "draft" }, "valid-token"), { params });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Artículo no encontrado");
  });

  it("debe retornar 403 si el artículo no pertenece al usuario", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.article.findUnique.mockResolvedValue({ ...mockArticle, userId: "other-user" });

    const res = await POST(createRequest({ status: "draft" }, "valid-token"), { params });
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("No autorizado");
  });

  it("debe publicar exitosamente como draft", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.article.findUnique.mockResolvedValue(mockArticle);
    mockDecrypt.mockReturnValue("decrypted-pass");
    mockPublishPost.mockResolvedValue({ success: true, postId: 456, postUrl: "https://misitio.com/?p=456" });
    mockPrisma.article.update.mockResolvedValue({});

    const res = await POST(createRequest({ status: "draft", categories: [1], tags: [2] }, "valid-token"), { params });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.postId).toBe(456);
    expect(body.data.postUrl).toBe("https://misitio.com/?p=456");

    expect(mockDecrypt).toHaveBeenCalledWith("encrypted-pass");
    expect(mockPublishPost).toHaveBeenCalledWith(
      { url: "https://misitio.com", username: "admin", password: "decrypted-pass" },
      { title: "Mi Artículo SEO", content: "<p>Contenido del artículo</p>", status: "draft", categories: [1], tags: [2] }
    );
    expect(mockPrisma.article.update).toHaveBeenCalledWith({
      where: { id: "article-1" },
      data: { wordpressPostId: 456, wordpressPostUrl: "https://misitio.com/?p=456", publishedToWp: true, publishedToWpAt: expect.any(Date) },
    });
  });

  it("debe publicar como publish cuando se especifica", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.article.findUnique.mockResolvedValue(mockArticle);
    mockDecrypt.mockReturnValue("decrypted-pass");
    mockPublishPost.mockResolvedValue({ success: true, postId: 789, postUrl: "" });
    mockPrisma.article.update.mockResolvedValue({});

    await POST(createRequest({ status: "publish" }, "valid-token"), { params });

    expect(mockPublishPost.mock.calls[0][1].status).toBe("publish");
  });

  it("debe usar draft por defecto si no se envía status", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.article.findUnique.mockResolvedValue(mockArticle);
    mockDecrypt.mockReturnValue("decrypted-pass");
    mockPublishPost.mockResolvedValue({ success: true, postId: 1, postUrl: "" });
    mockPrisma.article.update.mockResolvedValue({});

    await POST(createRequest({}, "valid-token"), { params });

    expect(mockPublishPost.mock.calls[0][1].status).toBe("draft");
  });

  it("debe retornar 400 si WordPress devuelve error", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.article.findUnique.mockResolvedValue(mockArticle);
    mockDecrypt.mockReturnValue("decrypted-pass");
    mockPublishPost.mockResolvedValue({ success: false, error: "Categoría inválida" });

    const res = await POST(createRequest({ status: "draft" }, "valid-token"), { params });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Categoría inválida");
  });

  it("debe retornar 500 si hay error inesperado", async () => {
    mockVerifyToken.mockResolvedValue({ userId: "user-1" });
    mockPrisma.user.findUnique.mockRejectedValue(new Error("DB crash"));

    const res = await POST(createRequest({ status: "draft" }, "valid-token"), { params });

    expect(res.status).toBe(500);
  });
});
